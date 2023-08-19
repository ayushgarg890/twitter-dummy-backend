import { IsNotEmpty, IsString } from "class-validator";

export class JwtPayload {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}