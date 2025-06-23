const list = document.getElementById("list");

fetch("/books").then(async (resp) => {
  const books = await resp.json();
  if (books.length === 0) {
    list!.innerHTML = "<p>No books available</p>";
    return;
  }
  list!.innerHTML = "";
  for (const book of books) {
    const li = document.createElement("li");
    li.innerHTML = `<a href="/reader/${book.id}">${book.title} | ${book.id}</a>`;
    list!.appendChild(li);
  }
});
