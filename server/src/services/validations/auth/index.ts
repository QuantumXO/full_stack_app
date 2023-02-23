import { ObjectSchema, string, ref, object, ValidationResult } from 'joi';

const signUpSchema: ObjectSchema = object({
  username: string()
    .min(3)
    .max(30)
    .required(),
  location: string()
    .min(3)
    .max(30),
  password: string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  repeatPassword: ref('password'),
  email: string()
    .email({ minDomainSegments: 2 })
});

export const signUpValidation = async (validationData: unknown): Promise<ValidationResult> => {
  try {
     return signUpSchema.validate(validationData);
  } catch (e) {
    console.log('signUpValidation e: ', e);
  }
};