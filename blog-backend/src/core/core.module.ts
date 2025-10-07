import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { getGraphQLConfig } from './config/graphql.config';
import { AccountModule } from 'src/modules/user/auth/account/account.module';
import { SessionModule } from 'src/modules/user/auth/session/session.module';
import { PostModule } from 'src/modules/user/post/post.module';
import { UsersModule } from 'src/modules/users/users.module';
import { PostsModule } from 'src/modules/posts/posts.module';
import { CommentsModule } from 'src/modules/comments/comments.module';
import { HealthModule } from 'src/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: getGraphQLConfig,
      inject: [ConfigService]
    }),
    AccountModule,
    SessionModule,
    PostModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    HealthModule
  ]
})
export class CoreModule {}
