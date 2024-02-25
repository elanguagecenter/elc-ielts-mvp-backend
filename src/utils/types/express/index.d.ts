import { UserData } from "../common/types";

export {};

declare global {
  namespace Express {
    export interface Request {
      userData: UserData;
    }
  }
}
