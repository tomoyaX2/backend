import { HttpStatus } from '@nestjs/common';

export const Errors = {
  unknownError: {
    message: 'Unknown error',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  loginErrors: {
    incorrentInput: {
      message: 'Email or Password is incorrect',
      statusCode: HttpStatus.UNAUTHORIZED,
    },
  },
  registrationErrors: {
    invalidPassword: {
      message:
        "Password shouldn't have less that 6 symbols and more than 32 symbols, contains 1 uppercase letter and 1 number",
    },
    invalidLogin: {
      message: "Login shouldn't be empty or longer than 32 symbols",
    },
    passwordsDontMatch: {
      message: "Passwords doesn't match",
    },
    invalidPhone: {
      message: 'Phone has invalid format',
    },
    invalidEmail: {
      message: 'Invalid email',
    },
  },
  authErrors: {
    invalidToken: {
      message: 'Token has invalid structure or expired, please, re-log in',
      statusCode: HttpStatus.UNAUTHORIZED,
    },
    invalidEmail: {
      message:
        'This email is not connected to any user account. Please, verify your data, or contact to support via email',
      statusCode: HttpStatus.NOT_FOUND,
    },
    userResetTokenIsNotReady: {
      message: 'Your next recovery link will be ready in 5 minutes',
      statuscodE: HttpStatus.FORBIDDEN,
    },
    invalidRestoreToken: {
      message:
        'Token has invalid structure or expired. Please, repeat your restoration try or contact support via  email',
      statusCode: HttpStatus.FORBIDDEN,
    },
  },
};
