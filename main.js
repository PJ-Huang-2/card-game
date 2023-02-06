// 設定遊戲狀態
const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
};

const Symbols = [
  "./images/spades.png", // 黑桃
  "./images/hearts.png", // 愛心
  "./images/diamonds.png", // 方塊
  "./images/club.png", // 梅花
];

const view = {
  getCardElement(index) {
    return `<div data-index="${index}" class="card back"></div>`;
  },
  getCardContent(index) {
    // const number = (index % 13) + 1;
    const number = this.transformNumber((index % 13) + 1);
    const symbol = Symbols[Math.floor(index / 13)];
    return `
         <p>${number}</p>
        <img src="${symbol}" />
        <p>${number}</p>
     `;
  },
  transformNumber(number) {
    switch (number) {
      case 1:
        return "A";
      case 11:
        return "J";
      case 12:
        return "Q";
      case 13:
        return "K";
      default:
        return number;
    }
  },
  displayCards(indexes) {
    const rootElement = document.querySelector("#cards");
    // rootElement.innerHTML = Array.from(Array(52).keys())
    rootElement.innerHTML =
      // utility.getRandomNumberArray(52)
      indexes.map((index) => this.getCardElement(index)).join("");
  },

  // flipCard
  flipCard(card) {
    console.log(card.dataset.index);
    if (card.classList.contains("back")) {
      // 回傳正面
      card.classList.remove("back");
      card.innerHTML = this.getCardContent(Number(card.dataset.index));
      return;
    }
    // 回傳背面
    card.classList.add("back");
    card.innerHTML = null;
  },
};

// 宣告Model
const model = {
  revealedCards: [],
};
const controller = {
  currentState: GAME_STATE.FirstCardAwaits, // 加在第一行

  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52));
  },
};
// get random number array
const utility = {
  getRandomNumberArray(count) {
    // count = 5 => [2, 3, 4, 1, 0]

    const number = Array.from(Array(count).keys());
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1));
      //  陣列裡的元素交換
      // console.log("QQ", randomIndex, index);
      [number[index], number[randomIndex]] = [
        number[randomIndex],
        number[index],
      ];

      /*  [1, 2, 3, 4, 5] 
      const temp = 1
      arr[4] = temp
      arr[0] = 5 */
    }
    return number;
  },
};

// view.displayCards();
controller.generateCards();
// console.log(utility.getRandomNumberArray(5));
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", (event) => {
    view.flipCard(card);
  });
});
