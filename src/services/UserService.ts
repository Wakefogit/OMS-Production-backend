import { Service } from "typedi";
import BaseService from "./BaseService";
import db from "../../models";
import AppConstants from "../constants/Appconstants";
import { RoleService } from "../services/RoleService";
import { encrypt, uuidv4, isArrayPopulated, paginationData } from "../utils/Utils";
import { Sequelize } from "sequelize";

let roleService = new RoleService();

@Service()
export class UserService extends BaseService<any> {
    getModel() {
        return db.tbl_user;
    }

    public async findByCredentials(email: string, password: string) {
        try {
            console.log("email and password", email, password, db.tbl_user);
            let result = await db.tbl_user.findOne({
                attributes: [
                    'id',
                    ['uniqueKey', 'userId'],
                    'firstName', 'lastName', 'email',
                    // 'password', 
                    'roleId', 'isActive'
                ],
                where: {
                    isActive: AppConstants.ONE,
                    isDeleted: AppConstants.ZERO,
                    email: email,
                    password: encrypt(password)
                    // password: password
                },
                raw: true
            });

            console.log("result ", result);
            return result;
        } catch (error) {
            console.log("Error_in_findByCredentials " + error);
            throw error;
        }
    }

    public async saveUser(input: Object, currentUser: Object, tran) {
        try {
            let role = await this.findUniqueKey(db.tbl_role, input["roleId"]);
            if (role) {
                let existingUser = await this.findByEmail(db.tbl_user, input["email"], input["userId"]);
                let userData = await this.findUniqueKey(db.tbl_user, input['userId']);
                // console.log("email ", existingUser, existingUser?.email === input["email"])
                if (existingUser?.email !== input["email"] || input["email"] == "") {
                    let userDetails = new db.tbl_user();
                    userDetails.firstName = input["firstName"] ? input["firstName"] : undefined;
                    userDetails.lastName = input["lastName"] ? input["lastName"] : undefined;
                    userDetails.email = input["email"] ? input["email"] : undefined;
                    userDetails.password = input["password"] ? encrypt(input["password"]) : undefined;
                    userDetails.phoneNumber = input["phoneNumber"] ? input["phoneNumber"] : undefined;
                    userDetails.roleId = role.id;
                    userDetails.isActive = input["isActive"];
                    userDetails.isDeleted = AppConstants.ZERO
                    if (userData) {
                        userDetails.id = userData.id;
                        userDetails.uniqueKey = userData.uniqueKey;
                        userDetails.updatedBy = currentUser["id"];
                        userDetails.updatedOn = new Date(new Date().toUTCString());
                    } else {
                        userDetails.uniqueKey = uuidv4();
                        userDetails.createdBy = currentUser["id"];
                        userDetails.createdOn = new Date(new Date().toUTCString());
                    }
                    console.log("userDetails ", userDetails)
                    let result = await this.createOrUpdateByModel(db.tbl_user, userDetails, tran);
                    if (result) {
                        return AppConstants.UPDATED_SUCCESSFULLY;
                    } else {
                        return AppConstants.PROBLEM_WHILE_UPDATING;
                    }
                } else {
                    return AppConstants.MAIL_ALREADY_EXIST;
                }
            } else {
                return AppConstants.INVALID_ROLE;
            }
        } catch (error) {
            console.log("Error_in_saveUser ", error);
            throw error;
        }
    }

    public async getUserList(input: Object) {
        try {
            let query, result;
            let objInfo = {
                attributes: [
                    ['uniqueKey', 'userId'],
                    'firstName', 'lastName', 'email',
                    'profileUrl', 'phoneNumber', 'isActive',
                    // 'password',
                    [Sequelize.literal('tbl_role.uniqueKey'), 'roleId'],
                    [Sequelize.literal('tbl_role.name'), 'roleName']
                ],
                model: db.tbl_user,
                where: {
                    isActive: input['isActive'],
                    isDeleted: AppConstants.ZERO,
                },
            }
            objInfo['include'] = [await roleService.getRoleIncludes(input['roleId'])]
            if (input["paging"].limit > AppConstants.ZERO) {
                objInfo["limit"] = input["paging"].limit;
                objInfo["offset"] = input["paging"].offset;
            }
            query = await db.tbl_user.findAndCountAll(objInfo)
            if (isArrayPopulated(query.rows)) {
                let pagination = await paginationData(query.count, input["paging"].limit, input["paging"].offset);
                result = {
                    page: pagination,
                    data: query.rows
                }
            } else {
                result = {
                    page: null,
                    data: null
                }
            }
            return result;
        } catch (error) {
            console.log("Error_in_getUserList ", error);
            throw error;
        }
    }
}