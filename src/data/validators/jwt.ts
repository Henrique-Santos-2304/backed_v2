import jwt from "jsonwebtoken";

import { ITokenValidator } from "@contracts/index";

export class TokenValidator implements ITokenValidator {
  #secret = process.env.TOKEN_SECRET;

  encrypt(data: any) {
    return jwt.sign(data, this.#secret);
  }

  decrypt<T = any>(token: string): T {
    return jwt.verify(token, this.#secret) as T;
  }
}
