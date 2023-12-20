import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "../resolvers/adminResolver";

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

const adminSchema = makeExecutableSchema({ typeDefs, resolvers })

export default adminSchema;