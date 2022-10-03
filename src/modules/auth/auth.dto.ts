export class LoginDto {
  login: string;
  password: string;
}

export class RegistrationDto {
  login: string;
  password: string;
  matchPassword: string;
  email?: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
}

export class TokenReturnDto {
  accessToken: string;
}

export class ResetPasswordDto {
  email?: string;
  login?: string;
}

export class RestorePasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
