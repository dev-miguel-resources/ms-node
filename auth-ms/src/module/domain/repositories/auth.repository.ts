import { Auth } from "../auth";
import { AuthResult } from "../types/auth.type";

// Solid Principle: Inversion of Dependency
// Design Pattern Facade
export interface AuthRepository {
  
  register(auth: Auth): Promise<AuthResult>;
  findOne(where: { [s: string]: string }): Promise<any> // pending
  update(where: { [s: string]: string }, data: { [s: string]: string }): Promise<any>
}
