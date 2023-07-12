class CalculatorModel {
  constructor() {
    this.expression = '';
    this.result = null;
  }

  addNumber(number) {
    this.refreshAllState();

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

      this.expression = expressionWithoutLastNum;
      this.updateExpression(number);
    } else {
      this.updateExpression(number);
    }

    this.refreshAllState();
  }

  addDot() {
    if (this.expression === 'Infinity') {
      return;
    }

    if (this.lastNumberHasDot !== true && this.lastElementIsNumber) {
      this.updateExpression('.');

      this.refreshAllState();
    }
  }

  addSimpleMathOperation(operation) {
    this.refreshLastExpressionElem();
    this.refreshLastExpressionElemInfo();

    const expressionIsEmpty = this.expression.length === 0;
    const expressionIsOnlyMinus = this.expression === '-';

    const isMinus = operation === '-';
    const lastElemIsDivide = this.lastExpressionElem === '/';
    const lastElemIsMultiply = this.lastExpressionElem === '*';

    const isMinusCase =
      (isMinus && expressionIsEmpty) ||
      (isMinus && lastElemIsMultiply) ||
      (isMinus && lastElemIsDivide);

    if (this.lastElementIsNumber || this.lastElementIsPercentage) {
      this.updateExpression(operation);

      this.refreshAllState();
    } else if (isMinusCase) {
      this.updateExpression(operation);

      this.refreshAllState();
    } else if (this.minusCaseWorked && !expressionIsOnlyMinus) {
      const newExpression = this.expression.slice(0, -2);
      this.expression = newExpression;
      this.updateExpression(operation);

      this.refreshAllState();
    } else if (this.lastElementIsOperation && !expressionIsOnlyMinus) {
      const newExpression = this.expression.slice(0, -1);
      this.expression = newExpression;
      this.updateExpression(operation);

      this.refreshAllState();
    }
  }

  addPercentage() {
    if (this.expression === 'Infinity') {
      return;
    }

    if (this.lastElementIsNumber) {
      this.updateExpression('/ 100');

      this.refreshAllState();
    }
  }

  equal() {
    if (this.isComputedExpression()) {
      if (String(this.result).includes('.')) {
        this.lastNumberHasDot = true;
      } else {
        this.lastNumberHasDot = false;
      }

      this.lastNumberStartIndex = 0;

      this.expression = String(this.result);
      this.result = '';
    }
  }

  allClean() {
    this.expression = '';
    this.result = '';

    this.refreshAllState();
  }

  backspace() {
    if (this.expression === '') {
      this.allClean();

      return;
    }

    this.lastElementIsPercentage = this.expression.slice(-5) === '/ 100';

    if (this.lastElementIsPercentage) {
      this.expression = this.expression.slice(0, -5);
    } else {
      this.expression = this.expression.slice(0, -1);
    }

    this.refreshAllState();
  }

  toogleSignLastNumber() {
    if (this.expression === 'Infinity') {
      return;
    }

    const lastOperationIndex = this.lastNumberStartIndex - 1;
    const lastOperation = this.expression[lastOperationIndex];

    const lastNumberIsPositive =
      lastOperation !== '-' && this.expression !== '';

    if (!lastNumberIsPositive) {
      this.changeLastNumberToPositive(lastOperationIndex);
    } else if (lastNumberIsPositive) {
      this.changeLastNumberToNegative(lastOperation, lastOperationIndex);
    }
  }

  changeLastNumberToNegative(lastOperation, lastOperationIndex) {
    if (lastOperation === '+') {
      this.expression = this.replaceCharacterAtString(
        this.expression,
        lastOperationIndex,
        '-'
      );
    } else {
      this.expression = this.insertCharacterAtString(
        this.expression,
        lastOperationIndex + 1,
        '-'
      );

      this.lastNumberStartIndex++;
    }
  }

  changeLastNumberToPositive(lastOperationIndex) {
    const prevSignIsNumber = !isNaN(this.expression[lastOperationIndex - 1]);

    if (prevSignIsNumber) {
      this.expression = this.replaceCharacterAtString(
        this.expression,
        lastOperationIndex,
        '+'
      );
    } else if (!prevSignIsNumber) {
      this.expression = this.replaceCharacterAtString(
        this.expression,
        lastOperationIndex,
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

  updateExpression(expressionNewPart) {
    if (this.expression === 'Infinity') {
      this.allClean();
    }

    this.expression += expressionNewPart;
  }

  calculateResult() {
    if (this.isComputedExpression()) {
      this.result = parseFloat(eval(this.expression).toPrecision(12));
    } else {
      this.result = '';
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

  refreshAllState() {
    this.refreshLastNumber();
    this.refreshLastNumberInfo();
    this.refreshLastExpressionElem();
    this.refreshLastExpressionElemInfo();
    this.willBeNewNumber = this.lastElementIsOperation;
    this.minusCaseWorked =
      this.expression.slice(-2) === '*-' ||
      this.expression.slice(-2) === '/-' ||
      this.expression === '-';
  }

  refreshLastNumber() {
    this.lastNumber = '';
    let lastNumberFound = false;

    const expression = this.expression.split('/ 100').join('%');

    for (let i = expression.length - 1; i >= 0; i--) {
      if (!isNaN(expression[i]) || expression[i] === '.') {
        this.lastNumber += expression[i];

        lastNumberFound = true;
      } else if (isNaN(expression[i]) && lastNumberFound) {
        break;
      }
    }

    this.lastNumber = this.lastNumber.split('').reverse().join('');
  }

  refreshLastNumberInfo() {
    this.lastNumberStartIndex = this.expression.lastIndexOf(this.lastNumber);
    this.lastNumberHasDot = this.lastNumber.includes('.');
  }

  refreshLastExpressionElem() {
    if (this.expression.slice(-5) === '/ 100') {
      this.lastExpressionElem = '%';
    } else {
      this.lastExpressionElem = this.expression[this.expression.length - 1];
    }
  }

  refreshLastExpressionElemInfo() {
    if (this.expression === '') {
      this.lastElementIsNumber = false;
      this.lastElementIsOperation = false;
      this.lastElementIsPercentage = false;
    }

    this.lastElementIsNumber = !isNaN(this.lastExpressionElem);
    this.lastElementIsOperation =
      this.lastExpressionElem === '-' ||
      this.lastExpressionElem === '*' ||
      this.lastExpressionElem === '+' ||
      this.lastExpressionElem === '/';
    this.lastElementIsPercentage = this.lastExpressionElem === '%';
  }

  getPackageData() {
    const expression = this.expression;
    const result = this.result;

    return { expression, result };
  }
}

class CalculatorController {
  constructor(model) {
    this.model = model;
  }

  numberBtnsHandler(newNumber) {
    this.model.addNumber(newNumber);

    this.model.calculateResult();

    return this.model.getPackageData();
  }

  dotBtnHandler() {
    this.model.addDot();

    return this.model.expression;
  }

  plusBtnHandler() {
    this.model.addSimpleMathOperation('+');

    return this.model.expression;
  }

  minusBtnHandler() {
    this.model.addSimpleMathOperation('-');

    return this.model.expression;
  }

  divideBtnHandler() {
    this.model.addSimpleMathOperation('/');

    return this.model.expression;
  }

  multiplyBtnHandler() {
    this.model.addSimpleMathOperation('*');

    return this.model.expression;
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

  allCleanBtnHandler() {
    this.model.allClean();

    return this.model.getPackageData();
  }

  backspaceBtnHandler() {
    this.model.backspace();

    this.model.calculateResult();

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

    this.bindListenersByClick();
    this.bindListenersByKeys();
  }

  onNumberBtnClick(newNumber) {
    const data = this.controller.numberBtnsHandler(newNumber);

    const expression = data.expression;
    const result = data.result;

    const prettyExpression = this.getPrettyExpression(expression);

    this.printExpression(prettyExpression);
    this.printResult(result);
  }

  onAllCleanBtnClick() {
    const data = this.controller.allCleanBtnHandler();

    const expression = data.expression;
    const result = data.result;

    const prettyExpression = this.getPrettyExpression(expression);

    this.printExpression(prettyExpression);
    this.printResult(result);
  }

  onBackspaceBtnClick() {
    const data = this.controller.backspaceBtnHandler();

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

  onWhiteThemeBtnClick() {
    const calculatorDiv = document.querySelector('.calculator');
    calculatorDiv.classList.add('calculator--light-theme');

    const themesDiv = document.querySelector('.calculator__themes');
    themesDiv.classList.add('calculator__themes--light-theme');

    const btnsDiv = document.querySelector('.calculator__btns');
    btnsDiv.classList.add('calculator__btns--light-theme');

    this.numberBtns.forEach((calculatorBtn) =>
      calculatorBtn.classList.add('calculator__btn--light-theme')
    );

    const greenBtns = document.querySelectorAll('.calculator__btn--green');
    const redBtns = document.querySelectorAll('.calculator__btn--red');
    greenBtns.forEach((calculatorBtn) =>
      calculatorBtn.classList.add('calculator__btn--green--light-theme')
    );
    redBtns.forEach((calculatorBtn) =>
      calculatorBtn.classList.add('calculator__btn--red--light-theme')
    );

    this.backspaceBtn.classList.add('calculator__btn--light-theme');
    this.dotBtn.classList.add('calculator__btn--light-theme');

    this.whiteThemeBtn.classList.add('calculator__white-theme--active');
    this.darkThemeBtn.classList.remove('calculator__dark-theme--active');
  }

  onDarkThemeBtnClick() {
    const calculatorDiv = document.querySelector('.calculator');
    calculatorDiv.classList.remove('calculator--light-theme');

    const themesDiv = document.querySelector('.calculator__themes');
    themesDiv.classList.remove('calculator__themes--light-theme');

    const btnsDiv = document.querySelector('.calculator__btns');
    btnsDiv.classList.remove('calculator__btns--light-theme');

    this.numberBtns.forEach((calculatorBtn) =>
      calculatorBtn.classList.remove('calculator__btn--light-theme')
    );

    const greenBtns = document.querySelectorAll('.calculator__btn--green');
    const redBtns = document.querySelectorAll('.calculator__btn--red');
    greenBtns.forEach((calculatorBtn) =>
      calculatorBtn.classList.remove('calculator__btn--green--light-theme')
    );
    redBtns.forEach((calculatorBtn) =>
      calculatorBtn.classList.remove('calculator__btn--red--light-theme')
    );

    this.backspaceBtn.classList.remove('calculator__btn--light-theme');
    this.dotBtn.classList.remove('calculator__btn--light-theme');

    this.whiteThemeBtn.classList.remove('calculator__white-theme--active');
    this.darkThemeBtn.classList.add('calculator__dark-theme--active');
  }

  getPrettyExpression(expression) {
    const plusIcon = this.plusBtn.children[0].cloneNode(true);
    const minusIcon = this.minusBtn.children[0].cloneNode(true);
    const divideIcon = this.divideBtn.children[0].cloneNode(true);
    const multiplyIcon = this.multiplyBtn.children[0].cloneNode(true);
    const percentageIcon = this.percentageBtn.children[0].cloneNode(true);

    expression = expression.split('/ 100').join('%');

    let prettyExpression = '';

    for (let elem of expression) {
      if (elem === '+') {
        elem = plusIcon.outerHTML;
      } else if (elem === '-') {
        elem = minusIcon.outerHTML;
      } else if (elem === '*') {
        elem = multiplyIcon.outerHTML;
      } else if (elem === '/') {
        elem = divideIcon.outerHTML;
      } else if (elem === '%') {
        elem = percentageIcon.outerHTML;
      }

      prettyExpression += elem;
    }

    return prettyExpression;
  }

  printExpression(expression) {
    this.expressionDiv.innerHTML = expression;
  }

  printResult(result) {
    this.resultDiv.innerHTML = result;
  }

  bindListenersByClick() {
    this.numberBtns = document.querySelectorAll('#num-btn');
    this.numberBtns.forEach((numberBtn) =>
      numberBtn.addEventListener('click', (e) =>
        this.onNumberBtnClick(e.target.innerText)
      )
    );
    this.dotBtn = document.querySelector('#dot-btn');
    this.dotBtn.addEventListener('click', () => this.onDotBtnClick());

    this.plusBtn = document.querySelector('#plus');
    this.plusBtn.addEventListener('click', () => this.onPlusBtnClick());
    this.minusBtn = document.querySelector('#minus');
    this.minusBtn.addEventListener('click', () => this.onMinusBtnClick());
    this.divideBtn = document.querySelector('#divide');
    this.divideBtn.addEventListener('click', () => this.onDivideBtnClick());
    this.multiplyBtn = document.querySelector('#multiply');
    this.multiplyBtn.addEventListener('click', () => this.onMultiplyBtnClick());

    this.percentageBtn = document.querySelector('#percentage');
    this.percentageBtn.addEventListener('click', () =>
      this.onPercentageClick()
    );

    this.equalBtn = document.querySelector('#equal');
    this.equalBtn.addEventListener('click', () => this.onEqualBtnClick());

    this.allCleanBtn = document.querySelector('#all-clean');
    this.allCleanBtn.addEventListener('click', () => this.onAllCleanBtnClick());

    this.backspaceBtn = document.querySelector('#backspace-btn');
    this.backspaceBtn.addEventListener('click', () =>
      this.onBackspaceBtnClick()
    );

    this.plusMinusBtn = document.querySelector('#plus-minus-btn');
    this.plusMinusBtn.addEventListener('click', () =>
      this.onPlusMinusBtnClick()
    );

    this.whiteThemeBtn = document.querySelector('.calculator__white-theme');
    this.whiteThemeBtn.addEventListener('click', () =>
      this.onWhiteThemeBtnClick()
    );
    this.darkThemeBtn = document.querySelector('.calculator__dark-theme');
    this.darkThemeBtn.addEventListener('click', () =>
      this.onDarkThemeBtnClick()
    );
  }

  bindListenersByKeys() {
    for (let i = 0; i <= 9; i++) {
      document.addEventListener('keydown', (e) => {
        if (e.key === `${i}`) {
          this.onNumberBtnClick(`${i}`);
        }
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === '.') this.onDotBtnClick();
      else if (e.key === '+') this.onPlusBtnClick();
      else if (e.key === '-') this.onMinusBtnClick();
      else if (e.key === '*') this.onMultiplyBtnClick();
      else if (e.key === '/') this.onDivideBtnClick();
      else if (e.key === '=') this.onEqualBtnClick();
      else if (e.key === 'Escape') this.onAllCleanBtnClick();
      else if (e.key === 'Backspace') this.onBackspaceBtnClick();
      else if (e.key === '%') this.onPercentageClick();
      else if (e.key === '`') this.onPlusMinusBtnClick();
      else if (e.code === 'KeyD') this.onDarkThemeBtnClick();
      else if (e.code === 'KeyL') this.onWhiteThemeBtnClick();
    });
  }
}

const app = new CalculatorView(new CalculatorController(new CalculatorModel()));
