import GraphQLDateTime from 'graphql-type-datetime';
import GraphQLJSON from 'graphql-type-json';
import { ErrorLogService } from '../services/ErrorLogService';
import AppConstants from '../constants/Appconstants';
import { UserService } from '../services/UserService';
import db from "../../models";

let errorLogService = new ErrorLogService();
let userService = new UserService();

export const resolvers = {
    DateTime: GraphQLDateTime,
    Json: GraphQLJSON,

    Query: {
        getAdminStringData: async (_, { }, { currentUser }) => {
            try {
                // console.log("password ", encryptValue(userName + ':' + password, process.env.SECRET_KEY))
                let result = {
                    message: "Welcome to the Jindal Aluminium Admin"
                };
                return result;
            } catch (error) {
                console.log("error ", error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.GET_ADMIN_STRING_DATA, AppConstants?.TRANSTYPE.QUERY, error, currentUser["id"]);
                return error
            }
        },
        getUserDetailsList: async (_, { input }, { currentUser }) => {
            try {
                console.log("Into_the_getUserDetailsList", input, '\ncurrentUser', currentUser);
                let result = await userService.getUserList(input);
                return result;
            } catch (error) {
                console.log("Error_in_getUserDetailsList ", error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.GET_USER_DETAILS_LIST, AppConstants?.TRANSTYPE.QUERY, error, currentUser["id"]);
                return error
            }
        }
    },
    Mutation: {
        createOrUpdateUser: async (_, { input }, { currentUser }) => {
            let tran = await db.sequelize.transaction();
            try {
                console.log("Into_the_createOrUpdateUser ", input, "\ncurrentUser ", currentUser);
                let result = await userService.saveUser(input, currentUser, tran);
                tran.commit();
                return result;
            } catch (error) {
                console.log("Error_in_createOrUpdateUser ", error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.CREATE_OR_UPDATE_USER, AppConstants?.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return error
            }
        }
    }
}