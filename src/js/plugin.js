class CountdownTimer {
  constructor({ selector, targetDate }) {
    this.container = document.querySelector(selector);
    this.targetDate = targetDate;
    this.intervalId = null;

    this.units = {
      days: this.container.querySelector('[data-value="days"]'),
      hours: this.container.querySelector('[data-value="hours"]'),
      mins: this.container.querySelector('[data-value="mins"]'),
      secs: this.container.querySelector('[data-value="secs"]'),
    };

    this.currentValues = {
      days: "",
      hours: "",
      mins: "",
      secs: "",
    };

    this.start();
  }

  start() {
    this.update();
    this.intervalId = setInterval(() => this.update(), 1000);
  }

  update() {
    const time = this.targetDate - new Date();

    if (time <= 0) {
      clearInterval(this.intervalId);
      this.render(0, 0, 0, 0);
      return;
    }

    const secs = Math.floor((time % (1000 * 60)) / 1000);
    const mins = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const days = Math.floor(time / (1000 * 60 * 60 * 24));

    this.render(days, hours, mins, secs);
  }

  render(days, hours, mins, secs) {
    this.updateUnit("days", String(days).padStart(3, "0"));
    this.updateUnit("hours", String(hours).padStart(2, "0"));
    this.updateUnit("mins", String(mins).padStart(2, "0"));
    this.updateUnit("secs", String(secs).padStart(2, "0"));
  }

  updateUnit(unitKey, valString) {
    if (this.currentValues[unitKey] === valString) return;
    const groupElement = this.units[unitKey];
    const cards = groupElement.querySelectorAll(".flip-card");
    const oldValString = this.currentValues[unitKey] || valString;
    valString.split("").forEach((char, index) => {
      const oldChar = oldValString[index];
      if (oldChar !== char || !this.currentValues[unitKey]) {
        this.flipDigit(cards[index], oldChar, char);
      }
    });
    this.currentValues[unitKey] = valString;
  }

  flipDigit(card, oldValue, newValue) {
    card.querySelectorAll(".leaf").forEach((leaf) => leaf.remove());
    const topElem = card.querySelector(".top");
    const bottomElem = card.querySelector(".bottom");
    const topLeaf = document.createElement("div");
    topLeaf.className = "leaf top-leaf";
    topLeaf.textContent = oldValue ?? newValue;
    const bottomLeaf = document.createElement("div");
    bottomLeaf.className = "leaf bottom-leaf";
    bottomLeaf.textContent = newValue;
    card.appendChild(topLeaf);
    card.appendChild(bottomLeaf);
    bottomElem.textContent = newValue;
    card.classList.remove("flipping");
    void card.offsetWidth;
    card.classList.add("flipping");

    setTimeout(() => {
      topElem.textContent = newValue;
      card.classList.remove("flipping");
      topLeaf.remove();
      bottomLeaf.remove();
    }, 500);
  }
}

const timer = new CountdownTimer({
  selector: "#timer-1",
  targetDate: new Date("Feb 25, 2027"),
});