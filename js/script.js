class CalculatorModel {
  constructor() {
    this.expression = '';
    this.result;
  }

  updateExpression(expressionNewPart) {
    this.expression += expressionNewPart;
  }

  getExpresion() {
    return this.expression;
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

  numberBtnsHandler(e) {
    const currentBtn = e.target;

    this.model.updateExpression(currentBtn.innerText);

    const expression = this.model.getExpresion();
    const result = this.model.calculateResult();

    return { expression, result };
  }
}

class CalculatorView {
  constructor(controller) {
    this.controller = controller;

    this.expressionDiv = document.querySelector('.calculator__expression');
    this.resultDiv = document.querySelector('.calculator__result');

    this.bindListeners();
  }

  onNumberBtnClick(e) {
    const handlerResult = this.controller.numberBtnsHandler(e);

    const resut = handlerResult.result;
    const expression = handlerResult.expression;

    this.printExpression(expression);
    this.printResult(resut);
  }

  printExpression(expression) {
    this.expressionDiv.innerHTML = expression;
  }

  printResult(result) {
    this.resultDiv.innerHTML = result;
  }

  refresh() {
    this.expressionDiv.innerHTML = '';
    this.expressionDiv.innerText = '';
  }

  bindListeners() {
    const numberBtns = document.querySelectorAll('#num-btn');
    numberBtns.forEach((numberBtn) =>
      numberBtn.addEventListener('click', (e) => this.onNumberBtnClick(e))
    );
  }
}

const app = new CalculatorView(new CalculatorController(new CalculatorModel()));
