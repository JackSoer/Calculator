class CalculatorModel {
  constructor() {}
}

class CalculatorController {
  constructor() {}
}

class CalculatorView {
  constructor() {
    this.expressionDiv = document.querySelector('.calculator__expression');
    this.resultDiv = document.querySelector('.calculator__result');
  }

  printNumber(number) {
    this.expressionDiv.innerText += number;
  }

  refresh() {
    this.expressionDiv.innerText = '';
    this.expressionDiv.innerText = '';
  }
}

const calculatorView = new CalculatorView();

calculatorView.printNumber(9);
calculatorView.refresh();
