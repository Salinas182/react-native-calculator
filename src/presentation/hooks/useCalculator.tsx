import { useRef, useState } from 'react';

enum Operator {
  add,
  subtract,
  multiply,
  divide,
}

export const useCalculator = () => {
  const [number, setNumber] = useState('0');
  const [previousNumber, setPreviousNumber] = useState('0');
  const lastOperation = useRef<Operator>();

  const clean = () => {
    setNumber('0');
    setPreviousNumber('0');
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
    const number1 = Number(previousNumber);
    const number2 = Number(number);

    switch (lastOperation.current) {
      case Operator.add:
        setNumber(`${number1 + number2}`);
        break;
      case Operator.subtract:
        setNumber(`${number1 - number2}`);
        break;
      case Operator.multiply:
        setNumber(`${number1 * number2}`);
        break;
      case Operator.divide:
        setNumber(`${number1 / number2}`);
        break;
      default:
        throw new Error('Operation not implemented');
    }

    setPreviousNumber('0');
  };

  return {
    number,
    previousNumber,
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
