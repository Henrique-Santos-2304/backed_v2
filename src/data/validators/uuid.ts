import crypto from "node:crypto";

import { IHashId } from "@contracts/index";

export class HashId implements IHashId {
  generate(): string {
    return crypto.randomUUID();
  }
}
