import '../css/style.css';
import '../css/reader.css';

let bookId = window.location.pathname.split("/").pop();
let pageNumber = 0;
let totalPages = Number.POSITIVE_INFINITY;

const homeButton = document.getElementById("homeButton") as HTMLButtonElement;
const bookmarkSaveButton = document.getElementById("bookmarkSaveButton") as HTMLButtonElement;
const bookmarkLoadButton = document.getElementById("bookmarkLoadButton") as HTMLButtonElement;
const pageNumberInput = document.getElementById("pageNumber") as HTMLInputElement;
const hideButton = document.getElementById("hideButton") as HTMLButtonElement;

homeButton.addEventListener("click", () => {
  window.location.href = "/";
});

bookmarkSaveButton.addEventListener("click", bookmarkPage);
bookmarkLoadButton.addEventListener("click", loadBookmark);
hideButton.addEventListener("click", hideHeader);
pageNumberInput.addEventListener("input", (e) => {
  const val = Number((e.target as HTMLInputElement).value);
  if (!Number.isFinite(val)) return;
  loadPage(val);
});

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") prevPage();
  if (e.code === "ArrowRight") nextPage();
});

async function loadPage(page: number) {
  const maxIndex = Number.isFinite(totalPages) ? totalPages - 1 : Number.POSITIVE_INFINITY;
  pageNumber = Math.max(0, Math.min(page, maxIndex));
  pageNumberInput.value = String(pageNumber);
  const resp = await fetch(`/book/${bookId}/${pageNumber}`);
  const text = await resp.text();
  const doc = XMLParse(text);
  document.getElementById("readingArea")!.replaceChildren(doc.body);
}

function prevPage() {
  if (pageNumber <= 0) {
    return;
  }
  loadPage(pageNumber - 1);
}

function nextPage() {
  if (pageNumber + 1 >= totalPages) {
    return;
  }
  loadPage(pageNumber + 1);
}

async function bookmarkPage() {
  const scroll = window.scrollY;
  const body = JSON.stringify({
    scroll,
    page: pageNumber,
  });
  try {
    const resp = await fetch("/save/" + bookId, {
      method: "POST",
      body,
      headers: { "Content-type": "application/json" },
    });
    if (resp.ok) {
      showToast("Bookmarked!");
    } else {
      showToast("Failed to bookmark");
    }
  } catch (_) {
    showToast("Failed to bookmark");
  }
}

async function loadBookmark() {
  const resp = await fetch("/load/" + bookId);
  const res = await resp.json();
  console.log(res);
  const page = res.page;
  const scroll = res.scroll;
  await loadPage(page);
  window.scrollTo(0, scroll);
  showToast("Loaded bookmark!");
}

async function loadBookMeta() {
  try {
    const resp = await fetch(`/book/${bookId}/meta`);
    if (!resp.ok) return;
    const meta = await resp.json();
    const pages = Number(meta?.totalPages);
    if (Number.isFinite(pages) && pages > 0) {
      totalPages = pages;
    }
  } catch (_err) {
    // Keep fallback infinity when meta cannot be loaded
  }
}

function hideHeader() {
  const header = document.querySelector("header") as HTMLElement;
  if (header.style.display === "none") {
    header.style.display = "block";
    hideButton.textContent = "v";
    hideButton.style.marginTop = "-35px";
    hideButton.style.top = "60px";
  } else {
    header.style.display = "none";
    hideButton.textContent = "^";
    hideButton.style.top = "-10px";
  }
}

function XMLParse(xmlStr: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlStr, "application/xhtml+xml");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    console.log("error while parsing");
  }
  return doc;
}

function showToast(message: string) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);
  // Trigger CSS animation on next frame
  requestAnimationFrame(() => {
    el.classList.add("show");
  });
  const ttl = 1800; // total time before removal
  setTimeout(() => {
    el.remove();
  }, ttl + 250);
}

async function init() {
  await loadBookMeta();
  loadPage(0);
}

init();