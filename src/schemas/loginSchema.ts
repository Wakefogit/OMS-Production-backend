import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "../resolvers/loginResolver";

const typeDefs = `
    scalar DateTime
    scalar Json

    type Query {
        login(credential: String!): Json
    }

    type Mutation {
        logout(userId: String!): Json
    }
`;

const loginSchema = makeExecutableSchema({ typeDefs, resolvers })

export default loginSchema;