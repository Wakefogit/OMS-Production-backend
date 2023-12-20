import GraphQLDateTime from 'graphql-type-datetime';
import GraphQLJSON from 'graphql-type-json';
import { UserService } from '../services/UserService';
import AppConstants from '../constants/Appconstants';
import { authToken, decryptValue, encrypt } from '../utils/Utils';
import { LoginTrackService } from '../services/LoginTrackService';
import db from "../../models";

let userService = new UserService();
let loginTrackService = new LoginTrackService();

export const resolvers = {
    DateTime: GraphQLDateTime,
    Json: GraphQLJSON,
    Query: {
        login: async (_, { credential }, { currentUser }) => {
            // let tran = await db.sequelize.transaction();
            try {
                let [email, password] = (decryptValue(credential, process.env.SECRET_KEY)).split(':');
                console.log("email1 " + email + " password " + password + " password2 " + encrypt(password), authToken(email, password));
                let userDetails = await userService.findByCredentials(email, password);
                if (userDetails) {
                    let userId = userDetails.id;
                    delete userDetails.id
                    let loginResponse = {
                        auth_token: authToken(email, password),
                        user: userDetails
                    };
                    await loginTrackService.logInAndOutTrack(userId, loginResponse?.auth_token, AppConstants.LOGIN)
                    // tran.commit();
                    return loginResponse;
                } else {
                    console.log("into_the_login_process_else")
                    throw AppConstants.LOGIN_UNSUCCESS;
                }
            } catch (error) {
                console.log("Error_in_login ", error);
                // tran.rollback();
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        }
    },

    Mutation: {
        logout: async (_, { userId }) => {
            // let tran = await db.sequelize.transaction();
            try {
                let result = await loginTrackService.logInAndOutTrack(userId, "", AppConstants.LOGOUT);
                // tran.commit();
                return result
            } catch (error) {
                console.log("Error_in_logout " + error);
                // tran.rollback();
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        }
    }
}