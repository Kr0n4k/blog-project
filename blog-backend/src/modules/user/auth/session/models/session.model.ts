import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class SessionModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  createdAt: string;
}