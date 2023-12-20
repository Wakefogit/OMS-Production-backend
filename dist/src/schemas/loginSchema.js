"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@graphql-tools/schema");
const loginResolver_1 = require("../resolvers/loginResolver");
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
const loginSchema = (0, schema_1.makeExecutableSchema)({ typeDefs, resolvers: loginResolver_1.resolvers });
exports.default = loginSchema;
//# sourceMappingURL=loginSchema.js.map