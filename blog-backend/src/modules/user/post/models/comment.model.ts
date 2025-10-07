import { Field, ObjectType } from "@nestjs/graphql";
import { Comment } from "generated/prisma";
import { UserModel } from "../../auth/account/models/user.model";

@ObjectType()
export class CommentModel implements Comment {
    @Field(() => String)
    id: string;

    @Field(() => String)
    text: string;

    @Field(() => String)
    userId: string;

    @Field(() => String)
    postId: string;

    @Field(() => UserModel, { nullable: true })
    user?: UserModel;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}