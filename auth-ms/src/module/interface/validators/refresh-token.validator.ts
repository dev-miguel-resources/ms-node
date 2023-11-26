import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenValidator {
  // Design Pattern Decorator: https://refactoring.guru/es/design-patterns/decorators

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
