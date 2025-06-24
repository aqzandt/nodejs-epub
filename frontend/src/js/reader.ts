import '../css/style.css';
import '../css/reader.css';

let bookId = window.location.pathname.split("/").pop();
let pageNumber = 0;

const homeButton = document.getElementById("homeButton")!;
const bookmarkSaveButton = document.getElementById("bookmarkSaveButton")!;
const bookmarkLoadButton = document.getElementById("bookmarkLoadButton")!;
const pageNumberInput = document.getElementById(
  "pageNumber"
) as HTMLInputElement;

homeButton.addEventListener("click", () => {
  window.location.href = "/";
});
bookmarkSaveButton.addEventListener("click", bookmarkPage);
bookmarkLoadButton.addEventListener("click", loadBookmark);
pageNumberInput.addEventListener("input", (e) => {
  pageNumber = Number((e.target as HTMLInputElement).value);
  loadPage(pageNumber);
});
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") prevPage();
  if (e.code === "ArrowRight") nextPage();
});

function loadPage(page: number) {
  pageNumber = page;
  pageNumberInput.value = String(pageNumber);
  fetch(`/book/${bookId}/${pageNumber}`).then(async (resp) => {
    let text = await resp.text();
    let doc = XMLParse(text);
    document.getElementById("readingArea")!.replaceChildren(doc.body);
  });
}

function prevPage() {
  if (pageNumber <= 0) {
    return;
  }
  loadPage(pageNumber - 1);
}

function nextPage() {
  // TODO add max page number check
  loadPage(pageNumber + 1);
}

function bookmarkPage() {
  let scroll = window.scrollY;
  let body = JSON.stringify({
    "scroll": scroll,
    "page": pageNumber,
  });
  console.log(body);
  fetch("/save/" + bookId, {
    method: "POST",
    body: body,
    headers: { "Content-type": "application/json" },
  });
}

function loadBookmark() {
  fetch("/load/" + bookId).then(async (resp) => {
    const res = await resp.json();
    console.log(res);
    let page = res.page;
    let scroll = res.scroll;
    loadPage(page);
    window.scrollTo(0, scroll);
  });
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

loadPage(0);