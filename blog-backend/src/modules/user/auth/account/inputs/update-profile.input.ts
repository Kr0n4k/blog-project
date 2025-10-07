import { InputType, Field } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateProfileInput {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    public bio?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    public avatar?: string;
}
