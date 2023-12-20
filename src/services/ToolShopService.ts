import { Service } from "typedi";
import BaseService from "./BaseService";
import db from "../../models";
import AppConstants from "../constants/Appconstants";
import { isValueOrUndefined, uuidv4 } from "../utils/Utils";
import { Op, Sequelize } from "sequelize";

@Service()
export class ToolShopService extends BaseService<any> {
    getModel() {
        return db.tbl_toolShop;
    }

    public async createOrUpdateToolShopData(input: Object, currentUser: Object, tran) {
        try {
            let toolShopData
            let orderData = await this.findUniqueKey(db.tbl_order, input["orderId"]);
            if (orderData) {
                let toolShopDataObj = new db.tbl_toolShop();
                toolShopDataObj.orderId = orderData.id;
                toolShopDataObj.dieRefId = input["dieRefId"];
                toolShopDataObj.noOfCavity = input["noOfCavity"];
                toolShopDataObj.bolsterEntry = input["bolsterEntry"];
                toolShopDataObj.backerEntry = input["backerEntry"];
                toolShopDataObj.specialBackerEntry = input["specialBackerEntry"];
                toolShopDataObj.ringEntry = input["ringEntry"];
                toolShopDataObj.dieSetter = input["dieSetter"];
                toolShopDataObj.weldingChamber = input["weldingChamber"];
                toolShopDataObj.remarks = input["remarks"];
                toolShopDataObj.isActive = input["isActive"];
                toolShopDataObj.isDeleted = AppConstants.ZERO
                if (currentUser["roleId"] == AppConstants.ONE) {
                    toolShopDataObj.updatedAdminId = currentUser["id"];
                    toolShopDataObj.adminUpdatedOn = new Date(new Date().toUTCString());
                }

                if (input["toolShopId"] != "" || (input["uniqueKey"] && input["uniqueKey"] != "")) {
                    let toolShopId = input["toolShopId"] ? input["toolShopId"] : input["uniqueKey"]
                    toolShopData = toolShopId != "" ? await this.findUniqueKey(db.tbl_toolShop, toolShopId) : undefined;
                }
                // console.log("toolShopData ",toolShopData)
                if (toolShopData) {
                    toolShopDataObj.id = toolShopData.id;
                    toolShopDataObj.uniqueKey = toolShopData.uniqueKey;
                    toolShopDataObj.updatedBy = currentUser["id"];
                    toolShopDataObj.updatedOn = new Date(new Date().toUTCString());
                } else {
                    toolShopDataObj.uniqueKey = uuidv4();
                    toolShopDataObj.createdBy = currentUser["id"];
                    toolShopDataObj.createdOn = new Date(new Date().toUTCString());
                }
                // console.log("toolShopDataObj ",toolShopDataObj)
                let result = await this.createOrUpdateByModel(db.tbl_toolShop, toolShopDataObj, tran);

                if (result)
                    return {
                        "message": AppConstants.UPDATED_SUCCESSFULLY,
                        "uniqueKey": result.uniqueKey
                    }
                // return AppConstants.UPDATED_SUCCESSFULLY + '|' + result.uniqueKey;
                else
                    return AppConstants.PROBLEM_WHILE_UPDATING;
            } else
                return AppConstants.INVALID_ID;
        } catch (error) {
            throw error
        }
    }

    public async getToolShopData(orderId: number, userId: number, roleId: number) {
        try {
            let whereCondition = {
                isActive: AppConstants.ONE,
                isDeleted: AppConstants.ZERO,
                orderId: orderId,
                // createdBy: userId
            };
            // (roleId == role.Admin || roleId > role.Tool_Shop) && delete whereCondition.createdBy
            let query = await db.tbl_toolShop.findOne({
                attributes: [
                    ["uniqueKey", 'toolShopId'],
                    "dieRefId",
                    // [Sequelize.literal(`
                    //     (SELECT description  
                    //         FROM tbl_reference tr 
                    //         WHERE tr.isDeleted = 0 AND tr.referenceGroupId = 2
                    //             AND tr.id = dieRefId)
                    // `), 'die'],
                    "noOfCavity", "bolsterEntry", "backerEntry",
                    "specialBackerEntry", "ringEntry", "dieSetter", "weldingChamber",
                    "remarks", "isActive"
                ],
                distinct: true,
                model: db.tbl_toolShop,
                where: whereCondition,
                required: true,
                raw: true
            })
            return query;
        } catch (error) {
            console.log("Into_the_getToolShopData ", error);
            throw error;
        }
    }

    public async getToolShopAttributes(isDownload: number) {
        try {
            let attributes = [
                [Sequelize.literal('tbl_toolShop.uniqueKey'), 'toolShopId'],
                [Sequelize.literal(`${isDownload ? "replace(tbl_toolShop.dieRefId,'#','')" : 'tbl_toolShop.dieRefId'}`), 'die'],
                [Sequelize.literal('tbl_toolShop.noOfCavity'), 'noOfCavity'],
                [Sequelize.literal(`${isDownload ? "replace(tbl_toolShop.bolsterEntry,'#','')" : 'tbl_toolShop.bolsterEntry'}`), 'bolsterEntry'],
                [Sequelize.literal(`${isDownload ? "replace(tbl_toolShop.backerEntry,'#','')" : 'tbl_toolShop.backerEntry'}`), 'backerEntry'],
                [Sequelize.literal(`${isDownload ? "replace(tbl_toolShop.specialBackerEntry,'#','')" : 'tbl_toolShop.specialBackerEntry'}`), 'specialBackerEntry'],
                [Sequelize.literal(`${isDownload ? "replace(tbl_toolShop.ringEntry,'#','')" : 'tbl_toolShop.ringEntry'}`), 'ringEntry'],
                [Sequelize.literal(`${isDownload ? "replace(tbl_toolShop.dieSetter,'#','')" : 'tbl_toolShop.dieSetter'}`), 'dieSetter'],
                [Sequelize.literal(`${isDownload ? "replace(tbl_toolShop.weldingChamber,'#','')" : 'tbl_toolShop.weldingChamber'}`), 'weldingChamber'],
                [Sequelize.literal(`${isDownload ? "replace(tbl_toolShop.remarks,'#','')" : 'tbl_toolShop.remarks'}`), "toolShopRemarks"]
            ]
            return attributes;
        } catch (error) {
            console.log("Error_in_getToolShopAttributes ", error);
            throw error;
        }
    }

    public async getToolShopIncludes() {
        try {
            let includes = {
                attributes: [],
                distinct: true,
                model: db.tbl_toolShop,
                where: {
                    isActive: AppConstants.ONE,
                    isDeleted: AppConstants.ZERO
                },
                required: false,
                raw: true
            }
            return includes;
        } catch (error) {
            console.log("Error_in_getToolShopIncludes ", error);
            throw error;
        }
    }

    public async getToolShopFilter(input: Object) {
        let toolshopFilter = {
            '$[tbl_toolShop].dieRefId$': Sequelize.literal(`
                (isnull([tbl_toolShop].[dieRefId],'') LIKE N'%${input["fdieRefId"]}%' )
            `),
            '$[tbl_toolShop].noOfCavity$': Sequelize.literal(`
                (isnull([tbl_toolShop].[noOfCavity],0) LIKE N'%${input["fnoOfCavity"]}%' )
            `),
            '$[tbl_toolShop].bolsterEntry$': Sequelize.literal(`
                (isnull([tbl_toolShop].[bolsterEntry],'') LIKE N'%${input["fbolsterEntry"]}%' )
            `),
            '$[tbl_toolShop].backerEntry$': Sequelize.literal(`
                (isnull([tbl_toolShop].[backerEntry],'') LIKE N'%${input["fbackerEntry"]}%' )
            `),
            '$[tbl_toolShop].specialBackerEntry$': Sequelize.literal(`
                (isnull([tbl_toolShop].[specialBackerEntry],'') LIKE N'%${input["fspecialBackerEntry"]}%' )
            `),
            '$[tbl_toolShop].ringEntry$': Sequelize.literal(`
                (isnull([tbl_toolShop].[ringEntry],'') LIKE N'%${input["fringEntry"]}%' )
            `),
            '$[tbl_toolShop].dieSetter$': Sequelize.literal(`
                (isnull([tbl_toolShop].[dieSetter],'') LIKE N'%${input["fdieSetter"]}%' )
            `),
            '$[tbl_toolShop].weldingChamber$': Sequelize.literal(`
                (isnull([tbl_toolShop].[weldingChamber],'') LIKE N'%${input["fweldingChamber"]}%' )
            `),
            '$[tbl_toolShop].remarks$': Sequelize.literal(`
                (isnull([tbl_toolShop].[remarks],'') LIKE N'%${input["ftoolShopRemarks"]}%' )
            `),
        }
        return toolshopFilter;
    }
}    