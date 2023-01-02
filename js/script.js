class CalculatorModel {
  constructor() {
    this.expression = '';
    this.result;
  }

  updateExpression(expressionNewPart) {
    const firstExpressionNum = +this.expression[0];

    if (firstExpressionNum === 0) {
      this.expression = expressionNewPart;
    } else {
      this.expression += expressionNewPart;
    }
  }

  getPackageData() {
    const expression = this.expression;
    const result = this.result;

    return { expression, result };
  }

  setExpression(expression) {
    this.expression = expression;
  }

  getExpression() {
    return this.expression;
  }

  calculateResult() {
    this.result = eval(this.expression);
  }

  setResult(result) {
    this.result = result;
  }

  getResult() {
    return this.result;
  }
}

class CalculatorController {
  constructor(model) {
    this.model = model;
  }

  numberBtnsHandler(e) {
    const currentNumber = e.target.innerText;

    const firstExpressionNum = +this.model.getExpression()[0];

    if (firstExpressionNum === 0) {
      this.model.setExpression(currentNumber);

      return this.model.getExpression();
    }

    this.model.updateExpression(currentNumber);

    return this.model.getExpression();
  }

  dotBtnHandler() {
    const expression = this.model.getExpression();

    if (expression.includes('.') === true) {
      return this.model.getExpression();
    }

    this.model.updateExpression('.');

    return this.model.getExpression();
  }

  refreshBtnHandler() {
    this.model.setExpression('');
    this.model.setResult('');
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
    const expression = this.controller.numberBtnsHandler(e);

    this.printExpression(expression);
  }

  onRefreshBtnClick() {
    this.controller.refreshBtnHandler();

    this.refresh();
  }

  onDotBtnClick() {
    const expression = this.controller.dotBtnHandler();

    this.printExpression(expression);
  }

  printExpression(expression) {
    this.expressionDiv.innerHTML = expression;
  }

  printResult(result) {
    this.resultDiv.innerHTML = result;
  }

  refresh() {
    this.expressionDiv.innerHTML = '';
    this.resultDiv.innerHTML = '';
  }

  bindListeners() {
    const numberBtns = document.querySelectorAll('#num-btn');
    numberBtns.forEach((numberBtn) =>
      numberBtn.addEventListener('click', (e) => this.onNumberBtnClick(e))
    );

    const refreshBtn = document.querySelector('#refresh-btn');
    refreshBtn.addEventListener('click', () => this.onRefreshBtnClick());

    const dotBtn = document.querySelector('#dot-btn');
    dotBtn.addEventListener('click', () => this.onDotBtnClick());
  }
}

const app = new CalculatorView(new CalculatorController(new CalculatorModel()));
