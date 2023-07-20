const Products = [
  {
    name: "Ndeg5",
    tag: "Female",
    price: 500,
    image: "./Image/img1.png",
  },
  {
    name: "Coco",
    tag: "Male",
    price: 550,
    image: "./Image/img2.png",
  },
  {
    name: "Coco-Noir",
    tag: "Male",
    price: 650,
    image: "./Image/img3.png",
  },
  {
    name: "N5",
    tag: "Female",
    price: 780,
    image: "./Image/img4.png",
  },
  {
    name: "Gabrielle",
    tag: "Female",
    price: 880,
    image: "./Image/img5.png",
  },
  {
    name: "Chance",
    tag: "Female",
    price: 1000,
    image: "./Image/img6.png",
  },
  {
    name: "Mademoiselle",
    tag: "Female",
    price: 1500,
    image: "./Image/img7.png",
  },
  {
    name: "Wood Neroli",
    tag: "Male",
    price: 650,
    image: "./Image/img8.png",
  },
  {
    name: "Intensely",
    tag: "Male",
    price: 750,
    image: "./Image/img9.png",
  },
  {
    name: "Eros",
    tag: "Male",
    price: 1000,
    image: "./Image/img10.png",
  },
  {
    name: "Euphoria",
    tag: "Male",
    price: 1500,
    image: "./Image/img11.png",
  },
];

const productContainer = document.querySelector(".productContainer");

for (let i of Products) {
  //Card
  let card = document.createElement("div");
  // Adding class to card
  card.classList.add("card", i.tag, i.price);
  // image div
  let imgContainer = document.createElement("div");
  imgContainer.classList.add("imgContainer");
  //image tag
  let image = document.createElement("img");
  image.setAttribute("src", i.image);
  imgContainer.appendChild(image);
  card.appendChild(imgContainer);

  // Description of cards
  let descContainer = document.createElement("div");
  descContainer.classList.add("descContainer");
  let productName = document.createElement("span");
  productName.innerHTML = i.name;
  productName.classList.add("productName");
  let priceTag = document.createElement("span");
  priceTag.innerHTML = "₹" + i.price;
  priceTag.classList.add("priceTag");
  let genderTag = document.createElement("span");
  genderTag.innerHTML = i.tag;
  genderTag.classList.add("genderTag");
  descContainer.appendChild(productName);
  descContainer.appendChild(priceTag);
  descContainer.appendChild(genderTag);
  card.appendChild(descContainer);
  productContainer.appendChild(card);
}

function filterProduct(tag) {
  // add the active class
  let btns = document.querySelectorAll(".button");
  btns.forEach((btn) => {
    if (tag.toUpperCase() == btn.innerText.toUpperCase()) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  // All cards
  let cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    // all
    if (tag == "all") {
      card.classList.remove("hide");
    } else {
      // male and female
      if (card.classList.contains(tag)) {
        card.classList.remove("hide");
      } else {
        card.classList.add("hide");
      }
    }
  });
}

window.onload = () => {
  filterProduct("all");
};
