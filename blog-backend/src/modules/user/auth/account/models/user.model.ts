import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserModel {

    @Field(() => String)
    id: string;

    @Field(() => String)
    userName: string;

    @Field(() => String)
    email: string;

    // Пароль намеренно не включён в GraphQL-модель

    @Field(() => String)
    firstName: string;

    @Field(() => String)
    lastName: string;
    
    @Field(() => String, { nullable: true })
    avatar: string | null;

    @Field(() => String, { nullable: true })
    bio: string | null;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}