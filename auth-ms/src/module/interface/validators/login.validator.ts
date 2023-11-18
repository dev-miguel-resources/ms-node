import { IsNotEmpty, IsString } from "class-validator";

export class LoginValidator {
  // Design Pattern Decorator: https://refactoring.guru/es/design-patterns/decorators

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}