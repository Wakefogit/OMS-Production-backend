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
const ErrorLogService_1 = require("../services/ErrorLogService");
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
const UserService_1 = require("../services/UserService");
const models_1 = __importDefault(require("../../models"));
let errorLogService = new ErrorLogService_1.ErrorLogService();
let userService = new UserService_1.UserService();
exports.resolvers = {
    DateTime: graphql_type_datetime_1.default,
    Json: graphql_type_json_1.default,
    Query: {
        getAdminStringData: (_, {}, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            try {
                // console.log("password ", encryptValue(userName + ':' + password, process.env.SECRET_KEY))
                let result = {
                    message: "Welcome to the Jindal Aluminium Admin"
                };
                return result;
            }
            catch (error) {
                console.log("error ", error);
                yield errorLogService.errorLog((_a = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _a === void 0 ? void 0 : _a.GET_ADMIN_STRING_DATA, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.QUERY, error, currentUser["id"]);
                return error;
            }
        }),
        getUserDetailsList: (_, { input }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            try {
                console.log("Into_the_getUserDetailsList", input, '\ncurrentUser', currentUser);
                let result = yield userService.getUserList(input);
                return result;
            }
            catch (error) {
                console.log("Error_in_getUserDetailsList ", error);
                yield errorLogService.errorLog((_b = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _b === void 0 ? void 0 : _b.GET_USER_DETAILS_LIST, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.QUERY, error, currentUser["id"]);
                return error;
            }
        })
    },
    Mutation: {
        createOrUpdateUser: (_, { input }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            let tran = yield models_1.default.sequelize.transaction();
            try {
                console.log("Into_the_createOrUpdateUser ", input, "\ncurrentUser ", currentUser);
                let result = yield userService.saveUser(input, currentUser, tran);
                tran.commit();
                return result;
            }
            catch (error) {
                console.log("Error_in_createOrUpdateUser ", error);
                yield errorLogService.errorLog((_c = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _c === void 0 ? void 0 : _c.CREATE_OR_UPDATE_USER, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return error;
            }
        })
    }
};
//# sourceMappingURL=adminResolver.js.map