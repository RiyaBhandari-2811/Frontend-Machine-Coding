let coin = document.querySelector(".coin");
let flipBtn = document.querySelector("#flip-button");
let resetBtn = document.querySelector("#reset-button");

let heads = 0;
let tails = 0;

flipBtn.addEventListener("click", () => {
  let num = Math.floor(Math.random() * 2);
  coin.style.animation = "none";

  if (num) {
    setTimeout(() => {
      coin.style.animation = "spin-head 3s forwards";
    }, 100);
    heads++;
  } else {
    setTimeout(() => {
      coin.style.animation = "spin-tail 3s forwards";
    }, 100);
    tails++;
  }
  setTimeout(updateScores, 3000);
  disableButton();
});

function updateScores() {
  document.querySelector("#head-count").textContent = `Heads - ${heads}`;
  document.querySelector("#tail-count").textContent = `Tails - ${tails}`;
}

function disableButton(){
    flipBtn.disabled = true;
    setTimeout(function(){
        flipBtn.disabled = false;
    },3000);
}

resetBtn.addEventListener("click",() => {
    coin.style.animation = "none";
    heads = 0;
    tails = 0;
    updateScores();
});
