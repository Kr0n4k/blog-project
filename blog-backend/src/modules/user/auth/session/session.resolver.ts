import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { SessionService } from './session.service';
import type { GqlContext } from 'src/shared/types/gql-context.types';
import { LoginInput } from './inputs/login.input';
import { Authorization } from 'src/shared/decorators/auth.decorator';
import { SessionModel } from './models/session.model';
import { AuthModel } from '../account/models/auth.model';
import { UserSession } from './session.service';

@Resolver(() => SessionModel)
export class SessionResolver {
  public constructor(private readonly sessionService: SessionService) {}

  @Authorization()
  @Query(() => [SessionModel], { name: 'findSessionsByUser' })
  public async findByUser(@Context() { req }: GqlContext): Promise<SessionModel[]> {
    const sessions = await this.sessionService.findByUser(req);
    return sessions.map(session => this.mapToSessionModel(session));
  }

  @Authorization()
  @Query(() => SessionModel, { name: 'findCurrentSession' })
  public async findCurrent(@Context() { req }: GqlContext): Promise<SessionModel> {
    const session = await this.sessionService.findCurrent(req);
    return this.mapToSessionModel(session);
  }

  @Mutation(() => AuthModel, { name: 'login' })
  public async login(
    @Context() { req }: GqlContext, 
    @Args('data') input: LoginInput
  ): Promise<AuthModel> {
    const result = await this.sessionService.login(req, input);
    return result as AuthModel;
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'logout' })
  public async logout(@Context() { req }: GqlContext): Promise<boolean> {
    return this.sessionService.logout(req);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeSession' })
  public async remove(
    @Context() { req }: GqlContext, 
    @Args('id') id: string
  ): Promise<boolean> {
    return this.sessionService.remove(req, id);
  }

  @Mutation(() => Boolean, { name: 'clearSessionCookie' })
  public async clearSession(@Context() { req }: GqlContext): Promise<boolean> {
    return this.sessionService.clearSession(req);
  }

  private mapToSessionModel(session: UserSession): SessionModel {
    const model = new SessionModel();
    model.id = session.id;
    model.userId = session.userId;
    model.createdAt = new Date(session.createdAt).toISOString();
    return model;
  }
}