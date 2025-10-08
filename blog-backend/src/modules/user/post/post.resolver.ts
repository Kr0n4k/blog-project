// post.resolver.ts
import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
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

  @Authorization()
  @Mutation(() => CommentModel, {name: 'updateComment'})
  public async updateComment(
    @Authorized("id") id: string,
    @Args('commentId') commentId: string,
    @Args('text') text: string
  ){
    return await this.postService.updateComment(commentId, id, text)
  }

  @Authorization()
  @Mutation(() => CommentModel, {name: 'deleteComment'})
  public async deleteComment(
    @Authorized("id") id: string,
    @Args('commentId') commentId: string
  ){
    return await this.postService.deleteComment(commentId, id)
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

  // Подписки для real-time обновлений
  @Subscription(() => LikeModel, {name: 'likeAdded'})
  public likeAdded(@Args('postId') postId: string) {
    return this.postService.likeAddedSubscription(postId);
  }

  @Subscription(() => CommentModel, {name: 'commentAdded'})
  public commentAdded(@Args('postId') postId: string) {
    return this.postService.commentAddedSubscription(postId);
  }

  @Subscription(() => CommentModel, {name: 'commentUpdated'})
  public commentUpdated(@Args('postId') postId: string) {
    return this.postService.commentUpdatedSubscription(postId);
  }

  @Subscription(() => CommentModel, {name: 'commentDeleted'})
  public commentDeleted(@Args('postId') postId: string) {
    return this.postService.commentDeletedSubscription(postId);
  }
}