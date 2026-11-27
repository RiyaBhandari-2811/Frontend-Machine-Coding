let newQuoteBtn = document.querySelector(".newQuoteBtn");
let quote = document.querySelector(".quote");
let author = document.querySelector(".author");

function generateQuote() {
    console.log("hello");
  fetch("https://api.quotable.io/random")
    .then((response) => response.json())
    .then((result) => {
        quote.innerHTML = result.content ;
        author.innerHTML = result.author ;
    });
}

newQuoteBtn.addEventListener("click", generateQuote);
