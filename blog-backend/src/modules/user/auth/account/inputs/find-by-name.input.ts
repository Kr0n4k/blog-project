import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class FindByNameInput {

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    public firstName : string

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    public lastName : string

}