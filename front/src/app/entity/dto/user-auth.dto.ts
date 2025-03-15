import { User } from "../user.entity";

export interface UserRegisterDTO extends User {
    signature: string;
    nonce: number;
  }