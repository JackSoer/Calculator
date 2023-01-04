class CalculatorModel {
  constructor() {
    this.expression = '';
    this.result = '';
  }

  updateExpression(expressionNewPart) {
    this.expression += expressionNewPart;
  }

  addMathOperation(operation) {
    const lastExpressionElem = this.expression[this.expression.length - 1];

    if (!isNaN(lastExpressionElem)) {
      this.updateExpression(operation);
    }
  }

  addNumber(number) {
    this.calculateResult();

    if (+this.result === 0 && this.isExpression()) {
      this.setExpression(number);
    } else {
      this.updateExpression(number);
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
    if (this.isExpression()) {
      this.result = eval(this.expression);
    }
  }

  isExpression() {
    const lastElementIsNumber = !isNaN(
      this.expression[this.expression.length - 1]
    );
    const expHaveMathOperation = this.expression.match(/[+/-/*//]/);

    if (lastElementIsNumber && expHaveMathOperation) {
      return true;
    } else {
      return false;
    }
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

    this.model.addNumber(currentNumber);

    this.model.calculateResult();

    return this.model.getPackageData();
  }

  dotBtnHandler() {
    this.model.addMathOperation('.');

    return this.model.getExpression();
  }

  plusBtnHandler() {
    this.model.addMathOperation('+');

    return this.model.getExpression();
  }

  minusBtnHandler() {
    this.model.addMathOperation('-');

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
    const data = this.controller.numberBtnsHandler(e);

    const expression = data.expression;
    const result = data.result;

    this.printExpression(expression);
    this.printResult(result);
  }

  onRefreshBtnClick() {
    this.controller.refreshBtnHandler();

    this.refresh();
  }

  onDotBtnClick() {
    const expression = this.controller.dotBtnHandler();

    this.printExpression(expression);
  }

  onPlusBtnClick() {
    const expression = this.controller.plusBtnHandler();

    this.printExpression(expression);
  }

  onMinusBtnClick() {}

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

    const plusBtn = document.querySelector('#plus');
    plusBtn.addEventListener('click', () => this.onPlusBtnClick());
    const minusBtn = document.querySelector('#minus');
    minusBtn.addEventListener('click', () => this.onMinusBtnClick());
  }
}

const app = new CalculatorView(new CalculatorController(new CalculatorModel()));
