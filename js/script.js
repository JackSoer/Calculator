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

  printResult(result) {
    this.resultDiv.innerText = result;
  }

  refresh() {
    this.expressionDiv.innerText = '';
    this.expressionDiv.innerText = '';
  }
}

const calculatorView = new CalculatorView();

calculatorView.printResult(333);
