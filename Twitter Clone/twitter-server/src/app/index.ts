import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import { User } from './user';
import { GraphQLContext } from '../interfaces';
import JWTService from '../services/jwt';
import { Post } from './post';

export async function initServer(){
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());

    const graphQlServer = new ApolloServer<GraphQLContext>({
        typeDefs: `
        ${User.types}
        ${Post.types}
            type Query {
                ${User.queries}
                ${Post.queries}
            }

            type Mutation {
                ${Post.mutations}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
                ...Post.resolvers.queries
            },
            Mutation: {
                ...Post.resolvers.mutations
            },
            ...Post.resolvers.extraResolvers,
            ...User.resolvers.extraResolvers,
        },
    });

    await graphQlServer.start();

    app.use('/graphql', expressMiddleware(graphQlServer, {
        context:async({req, res}) => {
            return {
                user: req.headers.authorization 
                    ? JWTService.decodeToken(req.headers.authorization.split(' ')[1]) 
                    : undefined
            };
        }
    }));

    return app;
}