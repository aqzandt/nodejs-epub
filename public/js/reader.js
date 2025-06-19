import { Book } from "../../shared/Book.js";
const book = await Book.fetchBook();
const bookmarkLoadButton = document.getElementById("bookmarkLoadButton");
bookmarkLoadButton.addEventListener("click", loadBookmark);
const bookmarkSaveButton = document.getElementById("bookmarkSaveButton");
bookmarkSaveButton.addEventListener("click", bookmarkPage);
document.getElementById("pageNumber").setAttribute("min", "0");
document.getElementById("pageNumber").setAttribute("max", (book.spine.length - 1).toString());
// Hotkeys for navigation
document.addEventListener('keydown', (e) => {
    if (e.code === "ArrowLeft")
        prevPage();
    if (e.code === "ArrowRight")
        nextPage();
});
document.getElementById("pageNumber").addEventListener('input', (e) => {
    loadPage(Number(e.target.value));
});
function loadPage(pageNumber) {
    book.pageNumber = pageNumber;
    document.getElementById("pageNumber").value = book.pageNumber.toString();
    let ref = book.spine[book.pageNumber];
    fetch("/book/page/" + ref).then(async (resp) => {
        let text = await resp.text();
        let doc = XMLParse(text);
        document.getElementById("readingArea").replaceChildren(doc.body);
    });
}
function prevPage() {
    if (book.pageNumber <= 0) {
        return;
    }
    loadPage(book.pageNumber - 1);
}
function nextPage() {
    if (book.pageNumber >= book.spine.length - 1) {
        return;
    }
    loadPage(book.pageNumber + 1);
}
function bookmarkPage() {
    let a = window.scrollY;
    let page = book.pageNumber;
    let body = JSON.stringify({
        scroll: a,
        page: page
    });
    console.log(body);
    fetch('/save', {
        method: "POST",
        body: body,
        headers: { "Content-type": "application/json" }
    });
}
function loadBookmark() {
    fetch('/load').then(async (resp) => {
        const res = await resp.json();
        console.log(res);
        let page = res.page;
        let scroll = res.scroll;
        loadPage(page);
        window.scrollTo(0, scroll);
    });
}
function XMLParse(xmlStr) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, "application/xhtml+xml");
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
        console.log("error while parsing");
    }
    return doc;
}
