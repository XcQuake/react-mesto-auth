import { useState, useEffect } from 'react';

export const useValidation = (value, validations) => {
  const [isEmpty, setIsEmpty] = useState(true);
  const [minLengthError, setMinLengthError] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [validity, setValidity] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const urlValidRegExp = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;

  useEffect(() => {
    for (const validation in validations) {
      switch (validation) {
        case 'minLength':
          if (value.length < validations.minLength) {
            setMinLengthError(true);
            setErrorMessage(`Минимальное количество символов: ${validations.minLength}`)
          } else {
            setMinLengthError(false);
          }
          break;
        case 'isEmpty':
          if(value) {
            setIsEmpty(false);
          } else {
            setIsEmpty(true);
            setErrorMessage('Неообходимо заполнить поле');
          }
          break;
        case 'isUrl':
          if (urlValidRegExp.test(value)) {
            setUrlError(false);
          } else {
            setUrlError(true);
            setErrorMessage('Введите ссылку на изображение');
          }
      }
    }
  }, [value])

  useEffect(() => {
    if (isEmpty || minLengthError || urlError) {
      setValidity(false)
    } else {
      setValidity(true)
    }
  }, [isEmpty, minLengthError, urlError])

  return {
    isEmpty,
    minLengthError,
    urlError,
    validity,
    errorMessage
  }
}