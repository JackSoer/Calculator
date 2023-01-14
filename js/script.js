class CalculatorModel {
  constructor() {
    this.expression = '';
    this.result = null;

    this.willBeNewNumber = true;
    this.lastNumber = null;
    this.lastNumberStartIndex = null;
    this.lastNumberHasDot = null;
    this.lastElementIsNumber = null;
    this.lastElementIsOperation = null;
    this.minusCaseWorked = null;
    this.lastElementIsPercentage = null;
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

    const expressionIsOnlyMinus = this.expression === '-';

    if (this.lastElementIsNumber || this.lastElementIsPercentage) {
      this.updateExpression(operation);

      this.minusCaseWorked = false;
      this.lastNumberHasDot = false;
      this.willBeNewNumber = true;
      this.lastElementIsNumber = false;
      this.lastElementIsOperation = true;
      this.lastElementIsPercentage = false;
    } else if (isMinusCase) {
      this.updateExpression(operation);

      this.minusCaseWorked = true;
      this.lastNumberHasDot = false;
      this.willBeNewNumber = true;
      this.lastElementIsNumber = false;
      this.lastElementIsOperation = true;
      this.lastElementIsPercentage = false;
    } else if (this.minusCaseWorked && !expressionIsOnlyMinus) {
      const newExpression = this.expression.slice(0, -2);
      this.setExpression(newExpression);
      this.updateExpression(operation);

      this.minusCaseWorked = false;
      this.lastNumberHasDot = false;
      this.willBeNewNumber = true;
      this.lastElementIsNumber = false;
      this.lastElementIsOperation = true;
      this.lastElementIsPercentage = false;
    } else if (this.lastElementIsOperation && !expressionIsOnlyMinus) {
      const newExpression = this.expression.slice(0, -1);
      this.setExpression(newExpression);
      this.updateExpression(operation);

      this.minusCaseWorked = false;
      this.lastNumberHasDot = false;
      this.willBeNewNumber = true;
      this.lastElementIsNumber = false;
      this.lastElementIsOperation = true;
      this.lastElementIsPercentage = false;
    }
  }

  addPercentage() {
    if (this.lastElementIsNumber) {
      this.updateExpression('/ 100');

      this.minusCaseWorked = false;
      this.lastNumberHasDot = false;
      this.willBeNewNumber = false;
      this.lastElementIsNumber = false;
      this.lastElementIsOperation = false;
      this.lastElementIsPercentage = true;
    }
  }

  addNumber(number) {
    if (this.willBeNewNumber === true) {
      this.lastNumberStartIndex = this.expression.length;
    }

    this.lastNumber = String(this.expression).slice(this.lastNumberStartIndex);

    if (this.lastElementIsPercentage) {
      return;
    } else if (this.willBeNewNumber || this.lastNumberHasDot) {
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
    this.lastElementIsOperation = false;
    this.minusCaseWorked = false;
    this.lastElementIsPercentage = false;
  }

  addDot() {
    if (this.lastNumberHasDot !== true && this.lastElementIsNumber) {
      this.updateExpression('.');

      this.lastNumberHasDot = true;
      this.lastElementIsNumber = false;
      this.lastElementIsOperation = false;
      this.minusCaseWorked = false;
      this.lastElementIsPercentage = false;
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

    this.lastNumberHasDot = null;
    this.willBeNewNumber = true;
    this.lastElementIsNumber = null;
    this.lastNumberStartIndex = null;
    this.lastElementIsOperation = null;
    this.minusCaseWorked = null;
    this.lastElementIsPercentage = null;
  }

  toogleSignLastNumber() {
    this.lastOperationIndex = this.lastNumberStartIndex - 1;
    this.lastOperation = this.expression[this.lastOperationIndex];

    this.lastNumberIsPositive = this.lastOperation !== '-';

    if (!this.lastNumberIsPositive) {
      this.changeLastNumberToPositive();
    } else if (this.lastNumberIsPositive) {
      this.changeLastNumberToNegative();
    }
  }

  changeLastNumberToNegative() {
    if (this.lastOperation === '+') {
      this.expression = this.replaceCharacterAtString(
        this.expression,
        this.lastOperationIndex,
        '-'
      );
    } else {
      this.expression = this.insertCharacterAtString(
        this.expression,
        this.lastOperationIndex + 1,
        '-'
      );

      this.lastNumberStartIndex++;
    }
  }

  changeLastNumberToPositive() {
    const prevSignIsNumber = !isNaN(
      this.expression[this.lastOperationIndex - 1]
    );

    if (prevSignIsNumber) {
      this.expression = this.replaceCharacterAtString(
        this.expression,
        this.lastOperationIndex,
        '+'
      );
    } else if (!prevSignIsNumber) {
      this.expression = this.replaceCharacterAtString(
        this.expression,
        this.lastOperationIndex,
        ''
      );

      this.lastNumberStartIndex--;
    }
  }

  replaceCharacterAtString(string, index, char) {
    const newString = string.split('');
    newString[index] = char;

    return newString.join('');
  }

  insertCharacterAtString(string, index, char) {
    const firstPart = string.slice(0, index);
    const secondPart = string.slice(index);

    return firstPart + char + secondPart;
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
    const expression = this.expression.slice(1);
    const expHasMathOperation = expression.match(/[+\-\*\/]/);

    if (this.lastElementIsNumber && expHasMathOperation) {
      return true;
    } else if (this.lastElementIsPercentage) {
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

  percentageBtnHandler() {
    this.model.addPercentage();

    this.model.calculateResult();

    return this.model.getPackageData();
  }

  equalBtnHandler() {
    this.model.equal();

    return this.model.getPackageData();
  }

  refreshBtnHandler() {
    this.model.refresh();

    return this.model.getPackageData();
  }

  plusMinusBtnHandler() {
    this.model.toogleSignLastNumber();

    this.model.calculateResult();

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

    const prettyExpression = this.getPrettyExpression(expression);

    this.printExpression(prettyExpression);
    this.printResult(result);
  }

  onRefreshBtnClick() {
    const data = this.controller.refreshBtnHandler();

    const expression = data.expression;
    const result = data.result;

    const prettyExpression = this.getPrettyExpression(expression);

    this.printExpression(prettyExpression);
    this.printResult(result);
  }

  onDotBtnClick() {
    const expression = this.controller.dotBtnHandler();

    const prettyExpression = this.getPrettyExpression(expression);

    this.printExpression(prettyExpression);
  }

  onPlusBtnClick() {
    const expression = this.controller.plusBtnHandler();

    const prettyExpression = this.getPrettyExpression(expression);

    this.printExpression(prettyExpression);
  }

  onMinusBtnClick() {
    const expression = this.controller.minusBtnHandler();

    const prettyExpression = this.getPrettyExpression(expression);

    this.printExpression(prettyExpression);
  }

  onDivideBtnClick() {
    const expression = this.controller.divideBtnHandler();

    const prettyExpression = this.getPrettyExpression(expression);

    this.printExpression(prettyExpression);
  }

  onMultiplyBtnClick() {
    const expression = this.controller.multiplyBtnHandler();

    const prettyExpression = this.getPrettyExpression(expression);

    this.printExpression(prettyExpression);
  }

  onPercentageClick() {
    const data = this.controller.percentageBtnHandler();

    const expression = data.expression;
    const result = data.result;

    const prettyExpression = this.getPrettyExpression(expression);

    this.printExpression(prettyExpression);
    this.printResult(result);
  }

  onEqualBtnClick() {
    const data = this.controller.equalBtnHandler();

    const expression = data.expression;
    const result = data.result;

    const prettyExpression = this.getPrettyExpression(expression);

    this.printExpression(prettyExpression);
    this.printResult(result);
  }

  onPlusMinusBtnClick() {
    const data = this.controller.plusMinusBtnHandler();

    const expression = data.expression;
    const result = data.result;

    const prettyExpression = this.getPrettyExpression(expression);

    this.printExpression(prettyExpression);
    this.printResult(result);
  }

  getPrettyExpression(expression) {
    const prettyExpression = expression.split('/ 100').join('%');

    return prettyExpression;
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

    const percentageBtn = document.querySelector('#percentage');
    percentageBtn.addEventListener('click', () => this.onPercentageClick());

    const equalBtn = document.querySelector('#equal');
    equalBtn.addEventListener('click', () => this.onEqualBtnClick());

    const refreshBtn = document.querySelector('#refresh-btn');
    refreshBtn.addEventListener('click', () => this.onRefreshBtnClick());

    const plusMinusBtn = document.querySelector('#plus-minus-btn');
    plusMinusBtn.addEventListener('click', () => this.onPlusMinusBtnClick());
  }
}

const app = new CalculatorView(new CalculatorController(new CalculatorModel()));
