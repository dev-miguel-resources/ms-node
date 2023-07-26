import { IsNotEmpty, IsNumber, IsString, IsUUID, MinLength } from "class-validator";

export class InsertValidator {
  @IsUUID()
  @IsNotEmpty({ message: "Guid must be not be empty" })
  @IsString({ message: "Guid must be a string" })
  @MinLength(10, { message: "Guid is too short" })
  productId: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}
