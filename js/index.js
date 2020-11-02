import sentences from "./sentences.js";

const CORRECT_LETTER_COLOR = "#ffea00";
const INCORRECT_LETTER_COLOR = "#8d0801";
class TypingSpeedTester {
  constructor() {
    this.running = false;
    this.sentenceExist = true;
    this.wait = false;

    this.getAllOutputElements();
    this.getInputElement();

    this.createSentence();
    this.addEventListeners();
  }

  ready() {
    this.hideResults();
    this.clearInput();
    this.openInput();

    this.result = {
      time: {
        string: "",
        m: 0,
        s: 0,
      },
      speed: 0,
      words: 0,
      symbols: 0,
      errors: [],
      quality: 0,
    };

    if (!this.sentenceExist) {
      this.textLabel.innerHTML = "";
      this.createSentence();
      this.sentenceExist = true;
    }

    this.updateTimerLabel();
  }

  start() {
    if (!this.running) return;

    this.startTimer();
  }

  stop() {
    if (!this.running) return;

    this.closeInput();

    this.running = false;

    this.sentenceExist = false;

    this.getResults();
    this.updateResultLabels();
    this.showResults();

    this.wait = true;
  }

  getAllOutputElements() {
    this.timerLabel = document.getElementById("timer");
    this.textLabel = document.getElementById("text");

    this.typingSpeedLabel = document.getElementById("typingSpeed");
    this.typingTimeLabel = document.getElementById("typingTime");
    this.numberOfWordsLabel = document.getElementById("numberOfWords");
    this.typingQualityLabel = document.getElementById("typingQuality");

    this.restartBtn = document.getElementById("tryAgainBtn");
  }

  updateResultLabels() {
    this.typingSpeedLabel.innerHTML = this.result.speed;
    this.typingTimeLabel.innerHTML = this.result.time.string;
    this.numberOfWordsLabel.innerHTML = this.result.words;
    this.typingQualityLabel.innerHTML = this.result.quality;
  }

  updateTimerLabel() {
    this.timerLabel.innerHTML = this.result.time.string;
  }

  getResults() {
    const words = (this.result.words = [...this.textLabel.children]
      .reduce((total, current) => total + current.innerHTML, "")
      .match(/\w+/g).length);

    this.result.symbols = this.textLabel.children.length;

    const symbols = this.result.symbols;
    const errors = this.result.errors.filter(err => err === true).length;
    const time = this.result.time.m * 60 + this.result.time.s;

    let quality = 1 - errors / symbols;

    this.result.quality = Math.floor(quality * 100) + "%";

    this.result.speed = Math.floor(symbols / time) + " symb/s";
  }

  getInputElement() {
    this.inputField = document.getElementById("input");
  }

  addEventListeners() {
    document.addEventListener("keydown", () => this.typing());
    this.inputField.addEventListener("input", () => this.typing());
    this.restartBtn.addEventListener("click", () => this.restart());
  }

  startTimer() {
    let m = 0;
    let s = 0;

    let timer = setInterval(() => {
      if (!this.running) return clearInterval(timer);

      s += 1;

      if (s >= 60) {
        s = 0;
        m += 1;
      }

      // Seconds first digit
      const sfd = s < 10 ? "0" : s;

      // Seconds second digit
      const ssd = s < 10 ? s : "";

      this.result.time.m = m;
      this.result.time.s = s;

      this.result.time.string = `${m}:${sfd}${ssd}`;

      this.updateTimerLabel();
    }, 1000);
  }

  restart() {
    this.wait = false;

    this.ready();
  }

  typing(mode) {
    if (this.wait) return;

    if (this.running) {
      this.checkSpelling();
    } else {
      this.running = true;
      this.ready();
      this.start();
    }
  }

  checkSpelling() {
    const inputText = this.inputField.value;

    [...this.textLabel.children].forEach((textSymbol, index) => {
      const input = inputText[index];
      const text = textSymbol.innerHTML;

      switch (input) {
        case undefined:
        case null:
          this.markSymbol(index, "white");
          this.result.errors[index] = this.result.errors[index] ? true : null;
          break;

        case text:
          this.markSymbol(index, CORRECT_LETTER_COLOR);
          this.result.errors[index] = this.result.errors[index] ? true : false;
          break;

        default:
          this.markSymbol(index, INCORRECT_LETTER_COLOR);
          this.result.errors[index] = true;
          break;
      }

      if (this.inputField.value.length >= this.textLabel.children.length) this.stop();
    });
  }

  markSymbol(index, color) {
    const symbol = document.getElementById(`symbol-${index}`);

    if (symbol != null) symbol.style.color = color;
  }

  showResults() {
    document.body.style.setProperty("--results-display", "block");
  }

  hideResults() {
    document.body.style.setProperty("--results-display", "none");
  }

  clearInput() {
    this.inputField.value = "";
  }

  openInput() {
    this.inputField.disabled = false;
  }

  closeInput() {
    this.inputField.disabled = true;
  }

  getRandomSentece() {
    return sentences[Math.floor(Math.random() * sentences.length)];
  }

  createSentence() {
    const sentence = this.getRandomSentece();

    let fontSize = 19;
    if (sentence.length >= 500) fontSize = 15;

    if (sentence.length >= 800) fontSize = 12;

    for (let i in sentence) {
      const symbol = sentence[i];
      const spanElement = document.createElement("span");

      spanElement.innerHTML = symbol;
      spanElement.id = `symbol-${i}`;
      spanElement.style.fontSize = `${fontSize}px`;

      this.textLabel.appendChild(spanElement);
    }
  }
}

window.addEventListener("load", new TypingSpeedTester());
