import { Auth } from "../auth";
import { AuthResult } from "../types/auth.type";

// Solid Principle: Inversion of Dependency
// Design Pattern Facade
export interface AuthRepository {
  
  register(auth: Auth): Promise<AuthResult>;
  // pendiente los demás
}
