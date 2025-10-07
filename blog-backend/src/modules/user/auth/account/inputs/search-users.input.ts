import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class SearchUsersInput {
    @Field(() => String)
    query: string;

    @Field(() => Int, { nullable: true })
    limit?: number;

    @Field(() => Int, { nullable: true })
    offset?: number;
}
