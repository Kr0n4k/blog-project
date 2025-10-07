import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class CreatePostInput {

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    public title: string;

    @Field(() => [String], { nullable: true })
    public videos: string[];

    @Field(() => [String], { nullable: true }) // массив URL фотографий
    public photos: string[];

    @Field(() => String, { nullable: true })
    @IsString()
    public text?: string;
}