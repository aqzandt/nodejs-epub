import "../css/style.css";
import "../css/index.css";

const list = document.getElementById("list");

function createBookCard(book: {id: string, title: string}, img: HTMLImageElement): HTMLElement {
  const div = document.createElement("div");
  div.className = "grid-item book-card";
  div.onclick = () => window.location.href = `/reader/${book.id}`;

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

fetch("/books").then(async (resp) => {
  const books = await resp.json();
  if (books.length === 0) {
    list!.innerHTML = "<p>No books available</p>";
    return;
  }
  list!.innerHTML = "";
  for (const book of books) {
    fetch("/book/" + book.id + "/cover").then(async (resp) => {
      if (resp.ok) {
        const blob = await resp.blob();
        const img = document.createElement("img");
        img.src = URL.createObjectURL(blob);
        img.alt = book.title + " cover";
        const card = createBookCard(book, img);
        list!.appendChild(card);
      } else {
        console.error("Failed to fetch cover for book:", book.title);
      }
    });
  }
});
