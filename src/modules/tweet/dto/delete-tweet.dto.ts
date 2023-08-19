import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class DeleteTweetDto {
    @IsNotEmpty()
    @IsMongoId()
    id: string;
}