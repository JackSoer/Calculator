class CalculatorModel {
  constructor() {}
}

class CalculatorController {
  constructor() {}
}

class CalculatorView {
  constructor() {
    this.expressionDiv = document.querySelector('.calculator__expression');
  }

  printNumber(number) {
    this.expressionDiv.innerText += number;
  }
}

const calculatorView = new CalculatorView();

calculatorView.printNumber(9);
calculatorView.printNumber(4);
calculatorView.printNumber(6);
