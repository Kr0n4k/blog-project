import { Field, ObjectType } from "@nestjs/graphql";
import { Post } from "generated/prisma";
import { CommentModel } from "./comment.model";
import { LikeModel } from "./like.model";
import { UserModel } from "../../auth/account/models/user.model";

@ObjectType()
export class PostModel implements Post {

    @Field(() => String)
    id: string;

    @Field(() => String)
    userId: string;

    @Field(() => String)
    title: string;

    @Field(() => [String])
    videos: string[];

    @Field(() => [String])
    photos: string[];

    @Field(() => String)
    text: string;

    @Field(() => [CommentModel], { nullable: true })
    comments?: CommentModel[];

    @Field(() => [LikeModel], { nullable: true })
    likes?: LikeModel[];

    @Field(() => UserModel, { nullable: true })
    user?: UserModel;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)    
    updatedAt: Date;
}