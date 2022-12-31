class CalculatorModel {
  constructor() {
    this.expression;
    this.result;
  }

  updateExpression(expression) {
    this.expression = expression;
  }

  calculateResult() {
    this.result = eval(this.expression);

    return this.result;
  }
}

class CalculatorController {
  constructor(model) {
    this.model = model;
  }
}

class CalculatorView {
  constructor(controller) {
    this.controller = controller;

    this.expressionDiv = document.querySelector('.calculator__expression');
    this.resultDiv = document.querySelector('.calculator__result');
  }

  printExpressionSymbol(symbol) {
    this.expressionDiv.innerHTML += symbol;
  }

  printResult(result) {
    this.resultDiv.innerHTML = result;
  }

  refresh() {
    this.expressionDiv.innerHTML = '';
    this.expressionDiv.innerText = '';
  }
}

const app = new CalculatorView(new CalculatorController(new CalculatorModel()));
