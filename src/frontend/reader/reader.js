var book;

fetch('/spine').then(async (resp) => {
    book = new Book(await resp.json())
    book.loadPage(0);
});

const bookmarkLoadButton = document.getElementById("bookmarkLoadButton")
bookmarkLoadButton.addEventListener("click", loadBookmark);

const bookmarkSaveButton = document.getElementById("bookmarkSaveButton")
bookmarkSaveButton.addEventListener("click", bookmarkPage);

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
        headers: {"Content-type": "application/json"}
    });
      
}

function loadBookmark() {
    fetch('/load').then(async (resp) => {
        const res = await resp.json();
        console.log(res)
        let page = res.page;
        let scroll = res.scroll;
        book.loadPage(page)
        window.scrollTo(0, scroll);
    });
}

class Book {
    constructor(spine) {
        this.spine = spine;
        this.pageNumber = 0;

        document.getElementById("pageNumber").setAttribute("min", 0)
        document.getElementById("pageNumber").setAttribute("max", spine.length - 1);

        document.addEventListener('keydown', (e) => {
            if (e.code === "ArrowLeft") this.prevPage()
            if (e.code === "ArrowRight") this.nextPage()
        });

        document.getElementById("pageNumber").addEventListener('input', (e) => {
            this.loadPage(e.target.valueAsNumber);
        });
    }

    loadPage(pageNumber) {
        this.pageNumber = pageNumber;
        document.getElementById("pageNumber").value=this.pageNumber;
        let ref = this.spine[this.pageNumber];
        fetch("/book/page/" + ref).then(async (resp) => {
            let text = await resp.text();
            let doc = XMLParse(text);
            document.getElementById("readingArea").replaceChildren(doc.body);
        })
    }

    prevPage() {
        if (this.pageNumber <= 0) {
            return;
        }
        this.loadPage(this.pageNumber - 1);
    }

    nextPage() {
        if (this.pageNumber >= this.spine.length - 1) {
            return;
        }
        this.loadPage(this.pageNumber + 1);
    }
}

function XMLParse(xmlStr) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, "application/xhtml+xml");
    // print the name of the root element or error message
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
        console.log("error while parsing");
    } else {
        return doc;
    }
}

