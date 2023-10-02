import { IsNotEmpty, IsNumber, IsString, IsUUID, MinLength } from "class-validator";

export class InsertValidator {
  // Design Pattern Decorator: https://refactoring.guru/es/design-patterns/decorators

  @IsUUID()
  @IsNotEmpty({ message: "Guid must not be empty" })
  @IsString({ message: "Guid must be a string" })
  @MinLength(10, { message: "Guid is too short" })
  productId: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}
