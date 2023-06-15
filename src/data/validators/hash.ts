import crypto from "node:crypto";

import { IEncrypt } from "@contracts/index";

export class EncrypterData implements IEncrypt {
  #secret = process.env.TOKEN_SECRET!;

  encrypt(data: string) {
    return crypto
      .pbkdf2Sync(data, this.#secret, 1000, 64, `sha512`)
      .toString(`hex`);
  }

  compare(data: string, encrypted: any) {
    const hash = crypto
      .pbkdf2Sync(data, this.#secret, 1000, 64, `sha512`)
      .toString(`hex`);
    return hash === encrypted;
  }
}
