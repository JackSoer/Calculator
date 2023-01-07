class CalculatorModel {
  constructor() {
    this.expression = '';
    this.result = null;

    this.lastNumberHasDot = false;
    this.willBeNewNumber = true;
  }

  updateExpression(expressionNewPart) {
    this.expression += expressionNewPart;
  }

  addSimpleMathOperation(operation) {
    const lastExpressionElem = this.expression[this.expression.length - 1];

    if (
      !isNaN(lastExpressionElem) ||
      (operation === '-' && this.expression.length === 0)
    ) {
      this.updateExpression(operation);

      this.lastNumberHasDot = false;
      this.willBeNewNumber = true;
    }
  }

  addNumber(number) {
    if (this.willBeNewNumber === true) {
      this.lastNumberStartIndex = this.expression.length;
    }

    const lastNumber = this.expression.slice(this.lastNumberStartIndex);

    if (this.willBeNewNumber || this.lastNumberHasDot) {
      this.updateExpression(number);
    } else if (+lastNumber === 0) {
      // Incorrect number validation like 03, -05 etc
      const expressionWithoutLastNum = this.expression.slice(
        0,
        this.lastNumberStartIndex
      );

      this.setExpression(expressionWithoutLastNum);
      this.updateExpression(number);
    } else {
      this.updateExpression(number);
    }

    this.willBeNewNumber = false;
  }

  addDot() {
    const lastExpressionElem = this.expression[this.expression.length - 1];

    if (this.lastNumberHasDot !== true && !isNaN(lastExpressionElem)) {
      this.updateExpression('.');

      this.lastNumberHasDot = true;
    }
  }

  refresh() {
    this.expression = '';
    this.result = '';

    this.lastNumberHasDot = false;
    this.willBeNewNumber = true;
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
    const expHaveMathOperation = this.expression.match(/[+\-\*\/]/);

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
    this.model.addDot();

    return this.model.getExpression();
  }

  plusBtnHandler() {
    this.model.addSimpleMathOperation('+');

    return this.model.getExpression();
  }

  minusBtnHandler() {
    this.model.addSimpleMathOperation('-');

    return this.model.getExpression();
  }

  refreshBtnHandler() {
    this.model.refresh();

    return this.model.getPackageData();
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
    const data = this.controller.refreshBtnHandler();

    const expression = data.expression;
    const result = data.result;

    this.printExpression(expression);
    this.printResult(result);
  }

  onDotBtnClick() {
    const expression = this.controller.dotBtnHandler();

    this.printExpression(expression);
  }

  onPlusBtnClick() {
    const expression = this.controller.plusBtnHandler();

    this.printExpression(expression);
  }

  onMinusBtnClick() {
    const expression = this.controller.minusBtnHandler();

    this.printExpression(expression);
  }

  printExpression(expression) {
    this.expressionDiv.innerHTML = expression;
  }

  printResult(result) {
    this.resultDiv.innerHTML = result;
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
