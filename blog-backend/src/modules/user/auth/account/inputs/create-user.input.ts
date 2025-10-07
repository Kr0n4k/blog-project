import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class CreateUserInput {

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    public userName : string

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

    @Field()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    public email : string

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    public password : string
}