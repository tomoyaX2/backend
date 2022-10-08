import { BadRequestException, HttpStatus } from '@nestjs/common';
import { Errors } from 'src/errors/auth';
import { RestorePasswordDto } from './auth.dto';

export const isValidRegistrationInput = ({
  password,
  matchPassword,
  phone,
  email,
}: {
  password: string;
  matchPassword: string;
  phone: string;
  email: string;
}) => {
  const errors = {} as Record<string, any>;
  const passwordMatchRequirements = password.match(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
  );
  const phoneMatchRegExp = phone
    ? phone.match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{6})$/)
    : true;

  const emailMatchRegExp = email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
  if (!passwordMatchRequirements) {
    errors.invalidPassword = Errors.registrationErrors.invalidPassword;
  }
  if (password !== matchPassword) {
    errors.passwordsDontMatch = Errors.registrationErrors.passwordsDontMatch;
  }
  if (!phoneMatchRegExp) {
    errors.invalidPhone = Errors.registrationErrors.invalidPhone;
  }
  if (!emailMatchRegExp) {
    errors.invalidEmail = Errors.registrationErrors.invalidEmail;
  }
  if (Object.keys(errors).length) {
    throw new BadRequestException({
      message: errors,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
  return true;
};

export const isValidRestoreInput = ({
  newPassword,
  confirmPassword,
}: RestorePasswordDto) => {
  const errors = {} as Record<string, any>;
  if (newPassword !== confirmPassword) {
    errors.passwordsDontMatch = Errors.registrationErrors.passwordsDontMatch;
  }
  throw new BadRequestException({
    message: errors,
    statusCode: HttpStatus.BAD_REQUEST,
  });
  return true;
};
