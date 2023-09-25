import { ValidationError } from '@nestjs/common';

export function errorConverter(errors: ValidationError[], errorMessage?: any, parentField?: string): any {
  const message = errorMessage || {};
  let errorField = '';
  let validationList;

  errors.forEach((error) => {
    errorField = parentField ? `${parentField}.${error.property}` : error?.property;

    if (!error?.constraints && error?.children?.length) {
      errorConverter(error.children, message, errorField);
    } else {
      validationList = Object.values(error?.constraints);
      message[errorField] = validationList.length > 0 ? validationList.pop() : 'Invalid Value';
    }
  });

  return message;
}
