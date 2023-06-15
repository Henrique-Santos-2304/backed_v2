import { EncrypterData, HashId, TokenValidator } from "@data/validators";

export const uuidService = new HashId();
export const tokenService = new TokenValidator();
export const encrypterService = new EncrypterData();
