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

  // flipCard => flipCards
  flipCards(...cards) {
    cards.map((card) => {
      if (card.classList.contains("back")) {
        // 回傳正面
        card.classList.remove("back");
        card.innerHTML = this.getCardContent(Number(card.dataset.index));
        console.log(...card.dataset.index);

        return;
      }
      // 回傳背面
      card.classList.add("back");
      card.innerHTML = null;
      console.log(...card.dataset.index);
    });
  },
  // 配對成功改顏色
  pairCards(...cards) {
    cards.map((card) => {
      card.classList.add("paired");
      // console.log("YEAH");
    });
  },
  renderScore(score) {
    document.querySelector(".score").textContent = `Score: ${score}`;
  },
  renderTriedTimes(times) {
    document.querySelector(
      ".tried"
    ).textContent = `You've tired: ${times} times`;
  },
  // 配對失敗提示動畫
  appendWrongAnimation(...cards) {
    cards.map((card) => {
      card.classList.add("wrong");
      card.addEventListener(
        "animationed",
        (event) => event.target.classList.remove("wrong"),
        { once: true }
      );
    });
  },
  // 結束遊戲顯示畫面
  showGameFinished() {
    const div = document.createElement("div");
    div.classList.add("completed");
    div.innerHTML = `
      <p>Complete ！</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
    `;
    const header = document.querySelector("#header");
    header.before(div);
  },
};

// 宣告Model
const model = {
  revealedCards: [],
  isRevealedCardsMatched() {
    return (
      this.revealedCards[0].dataset.index % 13 ===
      this.revealedCards[1].dataset.index % 13
    );
  },
  score: 0,
  triedTimes: 0,
};

const controller = {
  currentState: GAME_STATE.FirstCardAwaits, // 加在第一行
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52));
  },
  // 調度卡片的狀態
  dispatchCardAction(card) {
    if (!card.classList.contains("back")) {
      return;
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card);
        model.revealedCards.push(card);
        this.currentState = GAME_STATE.SecondCardAwaits;
        break;
      case GAME_STATE.SecondCardAwaits:
        view.renderTriedTimes(++model.triedTimes);
        view.flipCards(card);
        model.revealedCards.push(card);
        // 判斷配對是否成功
        if (model.isRevealedCardsMatched()) {
          // 配對成功
          view.renderScore((model.score += 10));
          this.currentState = GAME_STATE.CardsMatched;
          view.pairCards(...model.revealedCards);
          model.revealedCards = [];
          if (model.score === 260) {
            console.log("showGameFinished");
            this.currentState = GAME_STATE.GameFinished;
            view.showGameFinished();
            return;
          }
          this.currentState = GAME_STATE.FirstCardAwaits;
        } else {
          // 配對失敗
          this.currentState = GAME_STATE.CardsMatchFailed;
          view.appendWrongAnimation(...model.revealedCards);
          setTimeout(this.resetCards, 1000);
        }
        break;
    }
    console.log("this.currentState", this.currentState);
    // console.log(
    //   "revealCards",
    //   model.revealedCards.map((card) => card.dataset.index)
    // );
  },
  resetCards() {
    view.flipCards(...model.revealedCards);
    model.revealedCards = [];
    controller.currentState = GAME_STATE.FirstCardAwaits;
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
    controller.dispatchCardAction(card);
  });
});
