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
        fetch('/public/OEBPS/' + this.spine[this.pageNumber]).then(async (resp) => {
            var text = await resp.text();
            var doc = XMLParse(text);
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

fetch('/spine').then(async (resp) => {
    var book = new Book(await resp.json())
    book.loadPage(0);
})

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