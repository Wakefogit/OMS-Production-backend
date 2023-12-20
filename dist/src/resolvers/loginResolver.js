"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const graphql_type_datetime_1 = __importDefault(require("graphql-type-datetime"));
const graphql_type_json_1 = __importDefault(require("graphql-type-json"));
const UserService_1 = require("../services/UserService");
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
const Utils_1 = require("../utils/Utils");
const LoginTrackService_1 = require("../services/LoginTrackService");
let userService = new UserService_1.UserService();
let loginTrackService = new LoginTrackService_1.LoginTrackService();
exports.resolvers = {
    DateTime: graphql_type_datetime_1.default,
    Json: graphql_type_json_1.default,
    Query: {
        login: (_, { credential }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            // let tran = await db.sequelize.transaction();
            try {
                let [email, password] = ((0, Utils_1.decryptValue)(credential, process.env.SECRET_KEY)).split(':');
                console.log("email1 " + email + " password " + password + " password2 " + (0, Utils_1.encrypt)(password), (0, Utils_1.authToken)(email, password));
                let userDetails = yield userService.findByCredentials(email, password);
                if (userDetails) {
                    let userId = userDetails.id;
                    delete userDetails.id;
                    let loginResponse = {
                        auth_token: (0, Utils_1.authToken)(email, password),
                        user: userDetails
                    };
                    yield loginTrackService.logInAndOutTrack(userId, loginResponse === null || loginResponse === void 0 ? void 0 : loginResponse.auth_token, Appconstants_1.default.LOGIN);
                    // tran.commit();
                    return loginResponse;
                }
                else {
                    console.log("into_the_login_process_else");
                    throw Appconstants_1.default.LOGIN_UNSUCCESS;
                }
            }
            catch (error) {
                console.log("Error_in_login ", error);
                // tran.rollback();
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        })
    },
    Mutation: {
        logout: (_, { userId }) => __awaiter(void 0, void 0, void 0, function* () {
            // let tran = await db.sequelize.transaction();
            try {
                let result = yield loginTrackService.logInAndOutTrack(userId, "", Appconstants_1.default.LOGOUT);
                // tran.commit();
                return result;
            }
            catch (error) {
                console.log("Error_in_logout " + error);
                // tran.rollback();
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        })
    }
};
//# sourceMappingURL=loginResolver.js.map