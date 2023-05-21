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
    emailExists: {
      message: 'This email is already taken',
    },
    loginExists: {
      message: 'This login is already taken',
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
  fileSizeExceed: {
    message: 'File size cannot be more than 5 Mb',
  },
  gallery: {
    maxAlbumsAmount: {
      message: 'Max albums amount cannot be less than actual albums amount',
    },
  },
  comments: {
    incorrectUser: {
      message: 'You cannot delete this comment',
    },
    incorrectCommentId: {
      message: "This comment id doesn't exist ",
    },
    incorrectAlbum: {
      message: "This comment doesn't below to album",
    },
    incorrectVideo: {
      message: "This comment doesn't below to video",
    },
  },
};
