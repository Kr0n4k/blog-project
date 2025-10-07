import type { ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigService } from "@nestjs/config";
import { join } from "path";

export function getGraphQLConfig(
    configService: ConfigService
): ApolloDriverConfig {
    const isDevEnv = true;
    
    return {
        playground: isDevEnv ? {
            settings: {
                'request.credentials': 'include',
            },
        } : false,
        path: configService.getOrThrow<string>('GRAPHQL_PREFIX'),
        autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
        sortSchema: true,
        context: ({req, res}) => ({req, res}),
    }
}