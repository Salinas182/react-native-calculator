import { useState } from 'react';

export const useCalculator = () => {
  const [number, setNumber] = useState('0');

  const clean = () => setNumber('0');

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

  return {
    number,
    clean,
    buildNumber,
    deleteLastOperation,
    toggleSign,
  };
};
