import { IsNotEmpty, IsString } from "class-validator";

export class TokenValidator {
  // Design Pattern Decorator: https://refactoring.guru/es/design-patterns/decorators

  @IsNotEmpty()
  @IsString()
  token: string;

}