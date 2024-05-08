import { useEffect, useRef, useState } from 'react';

enum Operator {
  add = '+',
  subtract = '-',
  multiply = 'x',
  divide = '/',
}

export const useCalculator = () => {
  const [formula, setFormula] = useState('');
  const [number, setNumber] = useState('0');
  const [previousNumber, setPreviousNumber] = useState('0');
  const lastOperation = useRef<Operator>();

  useEffect(() => {
    if (lastOperation.current) {
      const firstFormulaPart = formula?.split(' ').at(0);
      return setFormula(
        `${firstFormulaPart} ${lastOperation.current} ${number}`,
      );
    }
    setFormula(number);
  }, [number]);

  useEffect(() => {
    const subResult = calculateSubresult();
    setPreviousNumber(`${subResult}`);
  }, [formula]);

  const clean = () => {
    setNumber('0');
    setPreviousNumber('0');
    lastOperation.current = undefined;
    setFormula('');
  };

  const deleteLastOperation = () => {
    if (number === '') {
      return;
    }

    let previousString = number?.slice(0, -1);

    if (
      previousString === '' ||
      previousString === '-' ||
      previousString === '0.' ||
      previousString === '-0.'
    ) {
      return setNumber('0');
    }

    if (previousString?.endsWith('.')) {
      previousString = number?.slice(0, -2);
    }
    setNumber(previousString);
  };

  const toggleSign = () => {
    if (number?.includes('-')) {
      return setNumber(number.replace('-', ''));
    }
    setNumber('-' + number);
  };

  const buildNumber = (numberString: string) => {
    if (number?.includes('.') && numberString === '.') {
      return;
    }

    if (number === '0' && numberString === '.') {
      return setNumber(number + numberString);
    }

    if (number?.startsWith('0') || number?.startsWith('-0')) {
      if (numberString === '0' && !number?.includes('.')) {
        return;
      }
      if (numberString !== '0' && !number?.includes('.')) {
        return setNumber(numberString);
      }
    }
    setNumber(number + numberString);
  };

  const setLastNumber = () => {
    calculateResult();

    if (number?.endsWith('.')) {
      setPreviousNumber(number.slice(0, -1));
    } else {
      setPreviousNumber(number);
    }
    setNumber('0');
  };

  const divideOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.divide;
  };

  const multiplyOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.multiply;
  };

  const addOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.add;
  };

  const subtractOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.subtract;
  };

  const calculateResult = () => {
    const result = calculateSubresult();
    setFormula(`${result}`);
    lastOperation.current = undefined;
    setPreviousNumber('0');
  };

  const calculateSubresult = (): number => {
    const [value1, operator, value2] = formula?.split(' ');
    const number1 = Number(value1);
    const number2 = Number(value2);

    if (isNaN(number2)) {
      return number1;
    }

    switch (operator) {
      case Operator.add:
        return number1 + number2;
      case Operator.subtract:
        return number1 - number2;
      case Operator.multiply:
        return number1 * number2;
      case Operator.divide:
        return number1 / number2;
      default:
        throw new Error('Operation not implemented');
    }
  };

  return {
    number,
    previousNumber,
    formula,
    clean,
    buildNumber,
    deleteLastOperation,
    toggleSign,
    divideOperation,
    multiplyOperation,
    addOperation,
    subtractOperation,
    calculateResult,
  };
};
