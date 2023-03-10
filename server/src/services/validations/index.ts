import { validateOrReject, ValidationError, ValidatorOptions } from 'class-validator';
import { ClassType } from '@interfaces/common';

export interface IValidationArgs {
  ValidatorClass: ClassType;
  fields: Record<string, unknown>;
  validatorOptions?: ValidatorOptions;
}
export interface IValidationError {
  field: string;
  errors: Record<string, string>;
}
export interface IValidationResult {
  errors?: IValidationError[];
}

export async function validation(args: IValidationArgs): Promise<IValidationResult> {
  const { fields, ValidatorClass, validatorOptions } = args;
  const validatorClass: ClassType = new ValidatorClass();
  let result: IValidationResult = {};
  
  Object.entries(fields).forEach(([field, value]: [string, unknown]): void => {
    validatorClass[field] = value;
  });
  
  try {
    await validateOrReject(validatorClass, validatorOptions);
    return result;
  } catch (errors) {
    const validationErrors: IValidationError[] = (errors as ValidationError[])
      .map(({ property, constraints }: ValidationError): IValidationError => {
        return {
          field: property,
          errors: constraints,
        };
      });
    result = {
      errors: validationErrors,
    };
    return result;
  }
}