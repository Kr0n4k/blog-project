import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { UserModel } from './models/user.model';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateProfileInput } from './inputs/update-profile.input';
import { Authorized } from 'src/shared/decorators/authorized.decorator';
import { Authorization } from 'src/shared/decorators/auth.decorator';
import { FindByNameInput } from './inputs/find-by-name.input';
import { GqlContext } from 'src/shared/types/gql-context.types';

@Resolver('Account')
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Authorization()
  @Query(() => UserModel, { name: 'currentUser' })
  async currentUser(@Context() { req }: GqlContext) {
    if (!req.user) {
      throw new Error('User not found in request');
    }
    return req.user;
  }

  @Query(() => Boolean, { name: 'isAuthenticated' })
  async isAuthenticated(@Context() { req }: GqlContext): Promise<boolean> {
    try {
      const session = req.session as any;
      return !!(session && session.userId);
    } catch {
      return false;
    }
  }

  @Authorization()
  @Query(() => UserModel, {name: 'findProfile'})
  public async me(@Authorized('id') id: string){
    return this.accountService.me(id)
  }

  @Mutation(() => UserModel, {name: 'createUser'})
  public async create(@Args('data') input: CreateUserInput){
    return this.accountService.create(input)
  }

  @Query(() => UserModel, {name: 'getUserById'})
  public async getUserById(@Args('id') id: string){
    return this.accountService.getUserById(id)
  }

  @Query(() => UserModel, {name: 'findUserByName'})
  public async findUserByName(@Args('name') name: FindByNameInput){
    return this.accountService.findUserByName(name)
  }
  
  @Query(() => UserModel, {name: 'findUserByID'})
  public async findUserByID(@Args('id') id: string){
    return this.accountService.findUserByID(id)
  }

  @Authorization()
  @Mutation(() => UserModel, {name: 'updateProfile'})
  public async updateProfile(
    @Authorized('id') id: string,
    @Args('bio', { nullable: true }) bio?: string,
    @Args('avatar', { nullable: true }) avatar?: string
  ){
    return this.accountService.updateProfile(id, { bio, avatar })
  }

  @Query(() => [UserModel], {name: 'searchUsers'})
  public async searchUsers(
    @Args('query') query: string,
    @Args('limit', { nullable: true }) limit?: number,
    @Args('offset', { nullable: true }) offset?: number
  ){
    return this.accountService.searchUsers(query, limit || 10, offset || 0)
  }

  @Query(() => [UserModel], {name: 'getAllUsers'})
  public async getAllUsers(){
    return this.accountService.getAllUsers()
  }
}