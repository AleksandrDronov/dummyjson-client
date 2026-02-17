import { createValidator } from './validation';
import type { AuthCredentials } from '../types/auth';

export const createLoginValidator = () => createValidator<AuthCredentials>({
  username: {
    required: true,
    message: 'Введите логин'
  },
  password: {
    required: true,
    message: 'Введите пароль'
  }
});
