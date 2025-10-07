// post.resolver.ts
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Authorization } from 'src/shared/decorators/auth.decorator';
import { PostModel } from './models/post.model';
import { CreatePostInput } from './inputs/create-post.input';
import { Authorized } from 'src/shared/decorators/authorized.decorator';
import { CommentModel } from './models/comment.model';
import { LikeModel } from './models/like.model';

@Resolver('Post')
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Authorization()
  @Mutation(() => PostModel, {name: 'createPost'})
  public async createPost(@Args('data') input : CreatePostInput, @Authorized("id") id: string){
    return await this.postService.createPost(input, id)
  }

  @Query(() => [PostModel], {name: 'getUserPosts'})
  public async getPosts(@Args('id') id: string){
    return await this.postService.getPostsByUser(id)
  }

  @Authorization()
  @Query(() => [PostModel], {name: 'getMyPosts'})
  public async getMyPosts(@Authorized("id") id: string){
    return await this.postService.getPostsByUser(id)
  }

  @Authorization()
  @Mutation(() => CommentModel, {name: 'createComment'})
  public async createComment(
    @Authorized("id") id: string, 
    @Args('postId') postId: string, // Добавлен декоратор @Args
    @Args('text') text: string // Добавлен декоратор @Args
  ){
    return await this.postService.createComment(postId, id, text)
  }

  @Authorization()
  @Mutation(() => LikeModel, {name: 'likePost'})
  public async likePost(
    @Authorized("id") id: string, 
    @Args('postId') postId: string // Добавлен декоратор @Args
  ){
    return await this.postService.likePost(postId, id)
  }

  @Query(() => [PostModel], {name: 'getRandomPosts'})
  public async getRandomPosts(){
    return await this.postService.getRandomPosts()
  }

  @Query(() => [PostModel], {name: 'searchPosts'})
  public async searchPosts(
    @Args('query') query: string,
    @Args('limit', { nullable: true }) limit?: number,
    @Args('offset', { nullable: true }) offset?: number
  ){
    return await this.postService.searchPosts(query, limit || 10, offset || 0)
  }
}