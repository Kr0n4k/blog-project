import { Field, ObjectType } from "@nestjs/graphql";
import { Like } from "generated/prisma";

@ObjectType()
export class LikeModel implements Like {
    @Field(() => String)
    id: string;

    @Field(() => String)
    userId: string;

    @Field(() => String)
    postId: string;

    @Field(() => Date)
    createdAt: Date;
}