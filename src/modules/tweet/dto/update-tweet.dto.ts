import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class UpdateTweetDto {
    @IsNotEmpty()
    @IsMongoId()
    id: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}