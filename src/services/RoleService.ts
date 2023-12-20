import { Service } from "typedi";
import BaseService from "./BaseService";
import db from "../../models";
import AppConstants from "../constants/Appconstants";
import { Op } from "sequelize";
import { role } from "../enums/Enums";

@Service()
export class RoleService extends BaseService<any> {
    getModel() {
        return db.tbl_role;
    }

    public async roleList() {
        try {
            let result = await db.tbl_role.findAll({
                attributes: [
                    ['uniqueKey', 'roleId'],
                    "name", "description",
                    "isActive"
                ],
                where: {
                    isActive: AppConstants.ONE,
                    isDeleted: AppConstants.ZERO,
                    id: {
                        [Op.not]: role.Admin
                    }
                },
                order: [["id", "ASC"]],
                raw: true
            });
            return result;
        } catch (error) {
            console.log("Error in roleList ", error);
            throw error;
        }
    }

    public async getRoleIncludes(roleId: any) {
        try {
            let includes = {
                model: db.tbl_role,
                attributes: [],
                distinct: true,
                required: true,
                where: {
                    isActive: AppConstants.ONE,
                    isDeleted: AppConstants.ZERO,
                    uniqueKey: roleId
                },
                raw: true
            }
            // if(!isArrayPopulated(roleId)) {
            //     delete includes.where["uniqueKey"]
            // }    
            return includes
        } catch (error) {
            console.log("Error in getRoleIncludes ", error);
            throw error;
        }
    }
}