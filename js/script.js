class CalculatorModel {
  constructor() {
    this.expression = '';
    this.result = null;

    this.willBeNewNumber = true;
    this.lastNumber = null;
    this.lastNumberStartIndex = null;
    this.lastNumberHasDot = null;
    this.lastElementIsNumber = null;
  }

  updateExpression(expressionNewPart) {
    this.expression += expressionNewPart;
  }

  addSimpleMathOperation(operation) {
    const lastExpressionElem = this.expression[this.expression.length - 1];

    const isMinus = operation === '-';
    const expressionIsEmpty = this.expression.length === 0;
    const lastElemIsDivide = lastExpressionElem === '/';
    const lastElemIsMultiply = lastExpressionElem === '*';

    const isMinusCase =
      (isMinus && expressionIsEmpty) ||
      (isMinus && lastElemIsMultiply) ||
      (isMinus && lastElemIsDivide);

    if (this.lastElementIsNumber || isMinusCase) {
      this.updateExpression(operation);

      this.lastNumberHasDot = false;
      this.willBeNewNumber = true;
      this.lastElementIsNumber = false;
    }
  }

  addNumber(number) {
    if (this.willBeNewNumber === true) {
      this.lastNumberStartIndex = this.expression.length;
    }

    this.lastNumber = String(this.expression).slice(this.lastNumberStartIndex);

    if (this.willBeNewNumber || this.lastNumberHasDot) {
      this.updateExpression(number);
    } else if (+this.lastNumber === 0) {
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

    this.lastElementIsNumber = true;
    this.willBeNewNumber = false;
  }

  addDot() {
    if (this.lastNumberHasDot !== true && this.lastElementIsNumber) {
      this.updateExpression('.');

      this.lastNumberHasDot = true;
      this.lastElementIsNumber = false;
    }
  }

  equal() {
    if (this.isComputedExpression()) {
      if (String(this.getResult()).includes('.')) {
        this.lastNumberHasDot = true;
      } else {
        this.lastNumberHasDot = false;
      }

      this.lastNumberStartIndex = 0;

      this.setExpression(String(this.getResult()));
      this.setResult('');
    }
  }

  refresh() {
    this.expression = '';
    this.result = '';

    this.lastNumberHasDot = false;
    this.willBeNewNumber = true;
    this.lastElementIsNumber = false;
    this.lastNumberStartIndex = null;
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
    if (this.isComputedExpression()) {
      this.result = eval(this.expression);
    }
  }

  isComputedExpression() {
    const expHasMathOperation = this.expression.match(/[+\-\*\/]/);

    if (this.lastElementIsNumber && expHasMathOperation) {
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

  divideBtnHandler() {
    this.model.addSimpleMathOperation('/');

    return this.model.getExpression();
  }

  multiplyBtnHandler() {
    this.model.addSimpleMathOperation('*');

    return this.model.getExpression();
  }

  equalBtnHandler() {
    this.model.equal();

    return this.model.getPackageData();
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

  onDivideBtnClick() {
    const expression = this.controller.divideBtnHandler();

    this.printExpression(expression);
  }

  onMultiplyBtnClick() {
    const expression = this.controller.multiplyBtnHandler();

    this.printExpression(expression);
  }

  onEqualBtnClick() {
    const data = this.controller.equalBtnHandler();

    const expression = data.expression;
    const result = data.result;

    this.printExpression(expression);
    this.printResult(result);
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
    const dotBtn = document.querySelector('#dot-btn');
    dotBtn.addEventListener('click', () => this.onDotBtnClick());

    const plusBtn = document.querySelector('#plus');
    plusBtn.addEventListener('click', () => this.onPlusBtnClick());
    const minusBtn = document.querySelector('#minus');
    minusBtn.addEventListener('click', () => this.onMinusBtnClick());
    const divideBtn = document.querySelector('#divide');
    divideBtn.addEventListener('click', () => this.onDivideBtnClick());
    const multiplyBtn = document.querySelector('#multiply');
    multiplyBtn.addEventListener('click', () => this.onMultiplyBtnClick());

    const equalBtn = document.querySelector('#equal');
    equalBtn.addEventListener('click', () => this.onEqualBtnClick());

    const refreshBtn = document.querySelector('#refresh-btn');
    refreshBtn.addEventListener('click', () => this.onRefreshBtnClick());
  }
}

const app = new CalculatorView(new CalculatorController(new CalculatorModel()));
