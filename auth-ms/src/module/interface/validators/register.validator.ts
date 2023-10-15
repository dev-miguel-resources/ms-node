import { IsNotEmpty, IsString } from "class-validator";

export class RegisterValidator {
  // Design Pattern Decorator: https://refactoring.guru/es/design-patterns/decorators

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
