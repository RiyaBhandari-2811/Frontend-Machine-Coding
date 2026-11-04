const Elements = document.querySelectorAll("[data-selection]");
const compScore = document.getElementById("compScore");
const userScore = document.getElementById("userScore");
const userChoice = document.getElementById("userChoice");
const compChoice = document.getElementById("compChoice");

let user = 0,
  comp = 0;

const Selections = [
  {
    name: "rock",
    emoji: "🪨",
    beats: "scissor",
  },
  {
    name: "paper",
    emoji: "📜",
    beats: "rock",
  },
  {
    name: "scissor",
    emoji: "✂️",
    beats: "paper",
  },
];

Elements.forEach((Element) => {
  Element.addEventListener("click", (e) => {
    const selectedElement = Element.dataset.selection;
    const userEle = Selections.find(
      (selection) => selection.name === selectedElement
    );
    findResult(userEle);
  });
});

function findResult(userEle) {
  const compEle = computerChoice();
  console.log(userEle);
  userChoice.innerHTML = `Your Choice : ${userEle.emoji}`;
  compChoice.innerHTML = `Computer Choice : ${compEle.emoji}`;
  const yourWinner = isWinner(userEle, compEle);
  const compWinner = isWinner(compEle, userEle);

  if (yourWinner) userScorefun();
  if (compWinner) computerScorefun();
}

function computerChoice() {
  const randomIndex = Math.floor(Math.random() * Selections.length);
  return Selections[randomIndex];
}

function userScorefun() {
  user++;
  userScore.innerHTML = `User Score : ${user}`;
}

function computerScorefun() {
  comp++;
  compScore.innerHTML = `Computer Score : ${comp}`;
}

function isWinner(selection, opponent) {
  return selection.beats === opponent.name;
}
