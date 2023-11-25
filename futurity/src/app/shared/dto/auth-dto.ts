export interface RegistrationDto {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenDto {
  token: string;
}
