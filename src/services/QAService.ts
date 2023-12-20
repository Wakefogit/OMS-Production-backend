import { Service } from "typedi";
import BaseService from "./BaseService";
import db from "../../models";
import AppConstants from "../constants/Appconstants";
import { isValueOrUndefined, uuidv4 } from "../utils/Utils";
import { role } from "../enums/Enums";
import { Sequelize } from "sequelize";
import { PpcService } from "./PpcService";

let ppcService = new PpcService();

@Service()
export class QAService extends BaseService<any> {
    getModel() {
        return db.qa;
    }

    public async createOrUpdateQaData(input: Object, currentUser: Object, tran) {
        try {
            let orderData = await this.findUniqueKey(db.tbl_order, input["orderId"]);
            let qaData;
            if (orderData) {
                let qaObj = new db.tbl_qa();
                qaObj.orderId = orderData.id;
                qaObj.remarks = input["remarks"];
                qaObj.isDeleted = AppConstants.ZERO
                if (currentUser["roleId"] == AppConstants.ONE) {
                    qaObj.updatedAdminId = currentUser["id"];
                    qaObj.adminUpdatedOn = new Date(new Date().toUTCString());
                }

                if (input["qaId"] && input["qaId"] != "") {
                    qaData = await this.findUniqueKey(db.tbl_qa, input["qaId"]);
                }

                if (qaData) {
                    qaObj.id = qaData.id;
                    qaObj.updatedBy = currentUser["id"];
                    qaObj.updatedOn = new Date(new Date().toUTCString());
                } else {
                    qaObj.uniqueKey = uuidv4();
                    qaObj.createdBy = currentUser["id"];
                    qaObj.createdOn = new Date(new Date().toUTCString());
                }

                // if (input['plannedQuenching'] || input['plannedInternalAlloy'] ||
                //     (input['frontEndCoringLength'] >= AppConstants.ZERO && input['frontEndCoringLength'] != null)
                //     || (input['backEndCoringLength'] >= AppConstants.ZERO && input['backEndCoringLength'] != null)) {
                let result2 = await this.updatePpcData(input, orderData.id, currentUser['id'], currentUser['roleId'], tran)
                // }
                // if ((input['cut_len_tolerance_upper'] >= AppConstants.ZERO && input['cut_len_tolerance_upper'] != null) ||
                //     (input['cut_len_tolerance_lower'] >= AppConstants.ZERO && input['cut_len_tolerance_lower'] != null)) {
                let result3 = await this.updateOrderDatas(input, orderData.id, currentUser['id'], currentUser['roleId'], tran)
                // }

                console.log("qaObj", qaObj);

                let result = await this.createOrUpdateByModel(db.tbl_qa, qaObj, tran);
                if (result)
                    return {
                        "message": AppConstants.UPDATED_SUCCESSFULLY,
                        "uniqueKey": result.uniqueKey
                    }
                // return AppConstants.UPDATED_SUCCESSFULLY;
                else
                    return AppConstants.PROBLEM_WHILE_UPDATING;
            } else
                return AppConstants.INVALID_ID;
        } catch (error) {
            throw error
        }
    }

    public async getQAData(orderId: number, userId: number, roleId: number) {
        try {
            let whereCondition = {
                isActive: AppConstants.ONE,
                isDeleted: AppConstants.ZERO,
                id: orderId,
                // createdBy: userId
            };
            // let query = await db.tbl_ppc.findOne({
            //     attributes: [
            //         // ['uniqueKey', 'qaId'], 
            //         // "remarks",
            //         "plannedQuenching",
            //         "plannedInternalAlloy",
            //         "frontEndCoringLength",
            //         "backEndCoringLength",
            //         [Sequelize.literal(`
            //         (SELECT uniqueKey from ${AppConstants.DB_JINDAL}.dbo.${AppConstants.TBL_QA} tq 
            //             where tq.isDeleted =${AppConstants.ZERO} and tq.isActive = ${AppConstants.ONE} 
            //             and tq.orderId = ${orderId} )
            //         `), "qaId"],
            //         [Sequelize.literal(`
            //         (SELECT remarks from ${AppConstants.DB_JINDAL}.dbo.${AppConstants.TBL_QA} tq 
            //             where tq.isDeleted =${AppConstants.ZERO} and tq.isActive = ${AppConstants.ONE} 
            //             and tq.orderId = ${orderId} )
            //         `), "remarks"],
            //         [Sequelize.literal(`
            //         (SELECT cut_len_tolerance_upper 
            //             from ${AppConstants.DB_JINDAL}.dbo.${AppConstants.TBL_ORDER} tol 
            //             where tol.isDeleted =${AppConstants.ZERO} and tol.isActive = ${AppConstants.ONE} 
            //                 and tol.id = ${orderId})
            //         `), "cutLengthToleranceUpper"],
            //         [Sequelize.literal(`
            //         (SELECT cut_len_tolerance_lower 
            //             from ${AppConstants.DB_JINDAL}.dbo.${AppConstants.TBL_ORDER} tol 
            //             where tol.isDeleted =${AppConstants.ZERO} and tol.isActive = ${AppConstants.ONE} 
            //                 and tol.id = ${orderId})
            //         `), "cutLengthToleranceLower"]
            //     ],
            //     distinct: true,
            //     model: db.tbl_ppc,
            //     where: whereCondition,
            //     required: true,
            //     raw: true
            // })
            let dataObj = {
                attributes: [
                    [Sequelize.literal("tbl_qa.uniqueKey"), "qaId"],
                    [Sequelize.literal("tbl_qa.remarks"), "remarks"],
                    ["cut_len_tolerance_lower", 'cutLengthToleranceLower'],
                    ["cut_len_tolerance_upper", 'cutLengthToleranceUpper'],
                    [Sequelize.literal('tbl_ppc.plannedQuenching'), 'plannedQuenching'],
                    [Sequelize.literal('tbl_ppc.plannedInternalAlloy'), 'plannedInternalAlloy'],
                    [Sequelize.literal('tbl_ppc.frontEndCoringLength'), 'frontEndCoringLength'],
                    [Sequelize.literal('tbl_ppc.backEndCoringLength'), 'backEndCoringLength'],
                ],
                distinct: true,
                model: db.tbl_order,
                where: whereCondition,
                required: true,
                raw: true
            };
            dataObj["include"] = [
                await ppcService.getPPCIncludes(),
                await this.getQAIncludes(),
            ];
            let query = await db.tbl_order.findOne(dataObj);

            return query;
        } catch (error) {
            console.log("Error_in_getQAData ", error);
            throw error;
        }
    }

    public async getQAAttributes(isDownload: number) {
        try {
            let attributes = [
                [Sequelize.literal('tbl_qa.uniqueKey'), 'qaId'],
                [Sequelize.literal(`${isDownload ? "replace(tbl_qa.remarks,'#','')" : 'tbl_qa.remarks'}`), "qaRemarks"]
            ]
            return attributes;
        } catch (error) {
            console.log("Error_in_getQAAttributes ", error);
            throw error;
        }
    }

    public async getQAIncludes() {
        try {
            let includes = {
                attributes: [],
                distinct: true,
                model: db.tbl_qa,
                where: {
                    isActive: AppConstants.ONE,
                    isDeleted: AppConstants.ZERO
                },
                required: false,
                raw: true
            }
            return includes;
        } catch (error) {
            console.log("Error_in_getQAIncludes ", error);
            throw error;
        }
    }

    public async updatePpcData(input: Object, orderId: number, userId: number, roleId: number, tran) {
        try {
            let result;
            let ppcData = await db.tbl_ppc.findOne({
                where: {
                    isDeleted: AppConstants.ZERO,
                    isActive: AppConstants.ONE,
                    orderId: orderId,
                },
                raw: true
            });
            console.log("ppcData", ppcData)
            if (ppcData) {
                // let ppcId = ppcData.id
                let ppcObj = new db.tbl_ppc();
                ppcObj.id = ppcData.id;
                ppcObj.uniqueKey = ppcData.uniqueKey;
                ppcObj.plannedQuenching = input["plannedQuenching"];
                ppcObj.plannedInternalAlloy = input["plannedInternalAlloy"];
                ppcObj.frontEndCoringLength = input["frontEndCoringLength"];
                ppcObj.backEndCoringLength = input["backEndCoringLength"];
                if (roleId == role.Admin) {
                    ppcObj.adminUpdatedOn = new Date(new Date().toUTCString())
                    ppcObj.updatedAdminId = userId;
                }
                else {
                    ppcObj.updatedBy = userId;
                    ppcObj.updatedOn = new Date(new Date().toUTCString())
                }
                // console.log("ppcObj ",ppcObj)
                result = await this.createOrUpdateByModel(db.tbl_ppc, ppcObj, tran)
            } else {
                let ppcObj = new db.tbl_ppc();
                // ppcObj.id = ppcData.id;
                ppcObj.uniqueKey = uuidv4();
                ppcObj.orderId = orderId;
                ppcObj.plannedQuenching = input["plannedQuenching"];
                ppcObj.plannedInternalAlloy = input["plannedInternalAlloy"];
                ppcObj.frontEndCoringLength = input["frontEndCoringLength"];
                ppcObj.backEndCoringLength = input["backEndCoringLength"];
                if (roleId == role.Admin) {
                    ppcObj.adminUpdatedOn = new Date(new Date().toUTCString())
                    ppcObj.updatedAdminId = userId;
                    ppcObj.createdBy = userId;
                    ppcObj.createdOn = new Date(new Date().toUTCString())
                }
                else {
                    ppcObj.createdBy = userId;
                    ppcObj.createdOn = new Date(new Date().toUTCString())
                }
                // console.log("ppcObj ",ppcObj)
                result = await this.createOrUpdateByModel(db.tbl_ppc, ppcObj, tran)
            }
            return result;
        } catch (error) {
            console.log("Error in updatePpcData" + error);
            throw error;
        }
    }

    public async updateOrderDatas(input: Object, orderId: number, userId: number, roleId: number, tran) {
        try {
            let orderObj = new db.tbl_order();
            orderObj.id = orderId
            orderObj.cut_len_tolerance_upper = input["cut_len_tolerance_upper"];
            orderObj.cut_len_tolerance_lower = input["cut_len_tolerance_lower"];
            if (roleId == AppConstants.ONE) {
                orderObj.updatedAdminId = userId;
                orderObj.adminUpdatedOn = new Date(new Date().toUTCString());
            } else {
                orderObj.updatedOn = new Date(new Date().toUTCString());
                orderObj.updatedBy = userId;
            }
            let result = await this.createOrUpdateByModel(db.tbl_order, orderObj, tran)
            return result;
        } catch (error) {
            console.log("Error in updateOrderDatas" + error);
            throw error;
        }
    }

    public async getQAFilter(input: Object) {
        let qaFilter = {
            '$[tbl_qa].remarks$': Sequelize.literal(`
                (isnull([tbl_qa].[remarks],'') LIKE N'%${input["fqaRemarks"]}%' )
            `),
        }
        return qaFilter;
    }
}    