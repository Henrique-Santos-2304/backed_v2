export interface ITokenValidator {
  encrypt(data: any): string;
  decrypt<T = any>(token: string): T;
}

export interface IEncrypt {
  encrypt(data: string): string;
  compare(data: string, encrypted: any): boolean;
}

export interface IHashId {
  generate(): string;
}
