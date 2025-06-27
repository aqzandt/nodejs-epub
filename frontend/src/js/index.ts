import "../css/style.css";
import "../css/index.css";

const list = document.getElementById("list") as HTMLDivElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const fileInput = document.getElementById("file-input") as HTMLInputElement;
const uploadForm = document.getElementById("file-form") as HTMLFormElement;
const uploadBtn = document.getElementById("uploadBtn") as HTMLButtonElement;

let debounceTimeout: number | undefined;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = window.setTimeout(() => {
    fetchAndShowBooks(searchInput.value.trim());
  }, 300); // 300ms delay
});

// Book upload button opens file input dialog
uploadBtn.addEventListener("click", () => {
  document.getElementById("input")?.click();
});

// Send book once book selected
fileInput.addEventListener("change", () => {
  console.log("File input changed:", fileInput.files);
  if (fileInput.files && fileInput.files.length > 0) {
    uploadForm.submit();
  }
});

function createBookCard(
  book: { id: string; title: string },
  img: HTMLImageElement
): HTMLElement {
  const div = document.createElement("div");
  div.className = "grid-item book-card";
  div.onclick = () => (window.location.href = `/reader/${book.id}`);

  const imgWrapper = document.createElement("div");
  imgWrapper.className = "img-wrapper";
  img.width = 200;
  img.height = 320;
  imgWrapper.appendChild(img);

  const titleElement = document.createElement("h4");
  titleElement.className = "book-title";
  titleElement.textContent = book.title;
  imgWrapper.appendChild(titleElement);

  div.appendChild(imgWrapper);
  return div;
}

function fetchAndShowBooks(query: string = ""): void {
  fetch(`/books?query=${encodeURIComponent(query)}`).then(async (resp) => {
    const books = await resp.json();
    console.log("Books fetched:", books);
    const newList = document.createElement("div");
    newList.innerHTML = books.length === 0 ? "<p>No books found</p>" : "";

    const promises: any = [];
    for (const book of books) {
      const promise = fetch("/book/" + book.id + "/cover").then(async (resp) => {
        if (resp.ok) {
          const blob = await resp.blob();
          const img = document.createElement("img");
          img.src = URL.createObjectURL(blob);
          img.alt = book.title + " cover";
          const card = createBookCard(book, img);
          newList.appendChild(card);
        }
      });
      promises.push(promise);
    }
    await Promise.all(promises);
    list.innerHTML = newList.innerHTML;
  });
}

fetchAndShowBooks();
