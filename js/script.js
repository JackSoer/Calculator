class CalculatorModel {
  constructor() {}

  calculateResult(expression) {
    const result = eval(expression);

    return result;
  }
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
const calculateModal = new CalculatorModel();

calculatorView.printResult(calculateModal.calculateResult('2 + 2'));
