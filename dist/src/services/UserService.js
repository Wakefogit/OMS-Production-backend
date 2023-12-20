"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.UserService = void 0;
const typedi_1 = require("typedi");
const BaseService_1 = __importDefault(require("./BaseService"));
const models_1 = __importDefault(require("../../models"));
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
const RoleService_1 = require("../services/RoleService");
const Utils_1 = require("../utils/Utils");
const sequelize_1 = require("sequelize");
let roleService = new RoleService_1.RoleService();
let UserService = class UserService extends BaseService_1.default {
    getModel() {
        return models_1.default.tbl_user;
    }
    findByCredentials(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("email and password", email, password, models_1.default.tbl_user);
                let result = yield models_1.default.tbl_user.findOne({
                    attributes: [
                        'id',
                        ['uniqueKey', 'userId'],
                        'firstName', 'lastName', 'email',
                        // 'password', 
                        'roleId', 'isActive'
                    ],
                    where: {
                        isActive: Appconstants_1.default.ONE,
                        isDeleted: Appconstants_1.default.ZERO,
                        email: email,
                        password: (0, Utils_1.encrypt)(password)
                        // password: password
                    },
                    raw: true
                });
                console.log("result ", result);
                return result;
            }
            catch (error) {
                console.log("Error_in_findByCredentials " + error);
                throw error;
            }
        });
    }
    saveUser(input, currentUser, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let role = yield this.findUniqueKey(models_1.default.tbl_role, input["roleId"]);
                if (role) {
                    let existingUser = yield this.findByEmail(models_1.default.tbl_user, input["email"], input["userId"]);
                    let userData = yield this.findUniqueKey(models_1.default.tbl_user, input['userId']);
                    // console.log("email ", existingUser, existingUser?.email === input["email"])
                    if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.email) !== input["email"] || input["email"] == "") {
                        let userDetails = new models_1.default.tbl_user();
                        userDetails.firstName = input["firstName"] ? input["firstName"] : undefined;
                        userDetails.lastName = input["lastName"] ? input["lastName"] : undefined;
                        userDetails.email = input["email"] ? input["email"] : undefined;
                        userDetails.password = input["password"] ? (0, Utils_1.encrypt)(input["password"]) : undefined;
                        userDetails.phoneNumber = input["phoneNumber"] ? input["phoneNumber"] : undefined;
                        userDetails.roleId = role.id;
                        userDetails.isActive = input["isActive"];
                        userDetails.isDeleted = Appconstants_1.default.ZERO;
                        if (userData) {
                            userDetails.id = userData.id;
                            userDetails.uniqueKey = userData.uniqueKey;
                            userDetails.updatedBy = currentUser["id"];
                            userDetails.updatedOn = new Date(new Date().toUTCString());
                        }
                        else {
                            userDetails.uniqueKey = (0, Utils_1.uuidv4)();
                            userDetails.createdBy = currentUser["id"];
                            userDetails.createdOn = new Date(new Date().toUTCString());
                        }
                        console.log("userDetails ", userDetails);
                        let result = yield this.createOrUpdateByModel(models_1.default.tbl_user, userDetails, tran);
                        if (result) {
                            return Appconstants_1.default.UPDATED_SUCCESSFULLY;
                        }
                        else {
                            return Appconstants_1.default.PROBLEM_WHILE_UPDATING;
                        }
                    }
                    else {
                        return Appconstants_1.default.MAIL_ALREADY_EXIST;
                    }
                }
                else {
                    return Appconstants_1.default.INVALID_ROLE;
                }
            }
            catch (error) {
                console.log("Error_in_saveUser ", error);
                throw error;
            }
        });
    }
    getUserList(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query, result;
                let objInfo = {
                    attributes: [
                        ['uniqueKey', 'userId'],
                        'firstName', 'lastName', 'email',
                        'profileUrl', 'phoneNumber', 'isActive',
                        // 'password',
                        [sequelize_1.Sequelize.literal('tbl_role.uniqueKey'), 'roleId'],
                        [sequelize_1.Sequelize.literal('tbl_role.name'), 'roleName']
                    ],
                    model: models_1.default.tbl_user,
                    where: {
                        isActive: input['isActive'],
                        isDeleted: Appconstants_1.default.ZERO,
                    },
                };
                objInfo['include'] = [yield roleService.getRoleIncludes(input['roleId'])];
                if (input["paging"].limit > Appconstants_1.default.ZERO) {
                    objInfo["limit"] = input["paging"].limit;
                    objInfo["offset"] = input["paging"].offset;
                }
                query = yield models_1.default.tbl_user.findAndCountAll(objInfo);
                if ((0, Utils_1.isArrayPopulated)(query.rows)) {
                    let pagination = yield (0, Utils_1.paginationData)(query.count, input["paging"].limit, input["paging"].offset);
                    result = {
                        page: pagination,
                        data: query.rows
                    };
                }
                else {
                    result = {
                        page: null,
                        data: null
                    };
                }
                return result;
            }
            catch (error) {
                console.log("Error_in_getUserList ", error);
                throw error;
            }
        });
    }
};
UserService = __decorate([
    (0, typedi_1.Service)()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map