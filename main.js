const Symbols = [
  "./images/spades.png", // 黑桃
  "./images/hearts.png", // 愛心
  "./images/diamonds.png", // 方塊
  "./images/club.png", // 梅花
];

const view = {
  getCardElement(index) {
    // const number = (index % 13) + 1;
    const number = this.transformNumber((index % 13) + 1);
    const symbol = Symbols[Math.floor(index / 13)];
    return `
 
      <div class="card">
        <p>${number}</p>
        <img src="${symbol}" />
        <p>${number}</p>
      </div>

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
  displayCards() {
    const rootElement = document.querySelector("#cards");
    // rootElement.innerHTML = Array.from(Array(52).keys())
    rootElement.innerHTML = utility
      .getRandomNumberArray(52)
      .map((index) => this.getCardElement(index))
      .join("");
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
      console.log("QQ", randomIndex, index);
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

view.displayCards();
// console.log(utility.getRandomNumberArray(5));
