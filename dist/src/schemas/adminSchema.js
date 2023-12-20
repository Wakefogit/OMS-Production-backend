"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@graphql-tools/schema");
const adminResolver_1 = require("../resolvers/adminResolver");
const typeDefs = `
    scalar DateTime
    scalar Json

    input paging {
        limit: Int
        offset: Int
    }

    type page {
        nextPage: Int
        prevPage: Int
        totalCount: Int
        currentPage: Int
    }

    input userInput {
        userId: String
        roleId: String!
        firstName: String
        lastName: String
        email: String
        password: String
        phoneNumber: String
        isActive: Int!
    }

    input userDetailsListInput{
        isActive: Int!
        roleId: [String]
        paging: paging
    }

    type Query {
        getAdminStringData: Json
        getUserDetailsList(input: userDetailsListInput): Json
    }

    type Mutation {
        createOrUpdateUser(input: userInput): Json
    }
`;
const adminSchema = (0, schema_1.makeExecutableSchema)({ typeDefs, resolvers: adminResolver_1.resolvers });
exports.default = adminSchema;
//# sourceMappingURL=adminSchema.js.map