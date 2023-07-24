function fetchFact() {
  fetch("https://api.api-ninjas.com/v1/facts?limit=1", {
    headers: {
      "X-Api-Key": "My API KEY",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const fact = data[0]?.fact;
      const para = document.querySelector("p");
      para.innerHTML = fact || "Retry...";
    })
    .catch((err) => {
      console.log(err);
    });
}

// Call this function to load fact for the first time
fetchFact();

// Load fact on each click
const btn = document.querySelector("button");
btn.addEventListener("click", () => {
  fetchFact();
});
