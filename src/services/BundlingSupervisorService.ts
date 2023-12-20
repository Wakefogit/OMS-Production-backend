import { Service } from "typedi";
import BaseService from "./BaseService";
import db from "../../models";
import AppConstants from "../constants/Appconstants";
import { isValueOrUndefined, uuidv4 } from "../utils/Utils";
import { role } from "../enums/Enums";
import { Op, Sequelize } from "sequelize";

@Service()
export class BundlingSupervisorService extends BaseService<any> {
    getModel() {
        return db.tbl_bundlingSupervisor;
    }

    public async createOrUpdatebundlingSupervisorData(input: Object, currentUser: Object, tran) {
        try {
            let orderData = await this.findUniqueKey(db.tbl_order, input["orderId"]);
            let bundlingSupervisorData
            if (orderData) {
                let bundlingSupervisorObj = new db.tbl_bundlingSupervisor();
                bundlingSupervisorObj.orderId = orderData.id;
                bundlingSupervisorObj.finishQuantity = isValueOrUndefined(input["finishQuantity"]);
                bundlingSupervisorObj.piecesPerBundle = input["piecesPerBundle"];
                bundlingSupervisorObj.bundleWeight = input["bundleWeight"];
                bundlingSupervisorObj.noOfBundles = input["noOfBundles"];
                bundlingSupervisorObj.totalNoOfPieces = input["totalNoOfPieces"];
                bundlingSupervisorObj.correctionQty = input["correctionQty"];
                bundlingSupervisorObj.actualFrontEndCoringLength = input["actualFrontEndCoringLength"];
                bundlingSupervisorObj.actualBackEndCoringLength = input["actualBackEndCoringLength"];
                bundlingSupervisorObj.recovery = input["recovery"] != null ? input["recovery"] : undefined;
                bundlingSupervisorObj.remarks = input["remarks"];
                bundlingSupervisorObj.isActive = input["isActive"];
                bundlingSupervisorObj.isDeleted = AppConstants.ZERO;
                if (currentUser["roleId"] == role.Admin) {
                    bundlingSupervisorObj.updatedAdminId = currentUser["id"];
                    bundlingSupervisorObj.adminUpdatedOn = new Date(new Date().toUTCString());
                }

                if (input["bundlingSupervisorId"] != "" || (input["uniqueKey"] && input["uniqueKey"] != "")) {
                    let bundlingSupervisorId = input["bundlingSupervisorId"] ? input["bundlingSupervisorId"] : input["uniqueKey"];
                    bundlingSupervisorData = bundlingSupervisorId != "" ?
                        await this.findUniqueKey(db.tbl_bundlingSupervisor, bundlingSupervisorId)
                        : undefined;  //bundlingSupervisiorId
                }

                if (bundlingSupervisorData) {
                    bundlingSupervisorObj.id = bundlingSupervisorData.id;
                    bundlingSupervisorObj.uniqueKey = bundlingSupervisorData.uniqueKey;
                    bundlingSupervisorObj.updatedBy = currentUser["id"];
                    bundlingSupervisorObj.updatedOn = new Date(new Date().toUTCString());
                } else {
                    bundlingSupervisorObj.uniqueKey = uuidv4();
                    bundlingSupervisorObj.createdBy = currentUser["id"];
                    bundlingSupervisorObj.createdOn = new Date(new Date().toUTCString());
                }
                let result = await this.createOrUpdateByModel(db.tbl_bundlingSupervisor, bundlingSupervisorObj, tran);
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

    public async getBundlingSupervisorData(orderId: number, userId: number, roleId: number) {
        try {
            let whereCondition = {
                isActive: AppConstants.ONE,
                isDeleted: AppConstants.ZERO,
                orderId: orderId,
                // createdBy: userId
            };
            // roleId == role.Admin && delete whereCondition.createdBy
            let query = await db.tbl_bundlingSupervisor.findOne({
                attributes: [
                    ["uniqueKey", 'bundlingSupervisorId'],
                    "finishQuantity", "piecesPerBundle", "bundleWeight", "noOfBundles",
                    "correctionQty", "totalNoOfPieces", "actualFrontEndCoringLength",
                    "actualBackEndCoringLength", "recovery", 'remarks'
                ],
                distinct: true,
                model: db.tbl_bundlingSupervisor,
                where: whereCondition,
                required: true,
                raw: true
            })
            return query;
        } catch (error) {
            console.log("Error_in_getBundlingSupervisorData " + error);
            throw error;
        }
    }

    public async getBundlingSupervisorAttributes(isDownload: number) {
        try {
            let attributes = [
                [Sequelize.literal('tbl_bundlingSupervisor.uniqueKey'), 'bundlingSupervisorId'],
                [Sequelize.literal('tbl_bundlingSupervisor.finishQuantity'), 'finishQuantity'],
                [Sequelize.literal('tbl_bundlingSupervisor.piecesPerBundle'), 'piecesPerBundle'],
                [Sequelize.literal('tbl_bundlingSupervisor.bundleWeight'), 'bundleWeight'],
                [Sequelize.literal('tbl_bundlingSupervisor.noOfBundles'), 'noOfBundles'],
                [Sequelize.literal('tbl_bundlingSupervisor.totalNoOfPieces'), 'totalNoOfPieces'],
                [Sequelize.literal('tbl_bundlingSupervisor.correctionQty'), 'correctionQty'],
                [Sequelize.literal('tbl_bundlingSupervisor.actualFrontEndCoringLength'), 'actualFrontEndCoringLength'],
                [Sequelize.literal('tbl_bundlingSupervisor.actualBackEndCoringLength'), 'actualBackEndCoringLength'],
                [Sequelize.literal('tbl_bundlingSupervisor.recovery'), 'recovery'],
                [Sequelize.literal(`${isDownload ? "replace(tbl_bundlingSupervisor.remarks,'#','')" : 'tbl_bundlingSupervisor.remarks'}`), 'bundlingSupervisorRemarks'],
            ]
            return attributes;
        } catch (error) {
            console.log("Error_in_getBundlingSupervisorAttributes ", error);
            throw error;
        }
    }

    public async getBundlingSupervisorIncludes() {
        try {
            let includes = {
                attributes: [],
                distinct: true,
                model: db.tbl_bundlingSupervisor,
                where: {
                    isActive: AppConstants.ONE,
                    isDeleted: AppConstants.ZERO
                },
                required: false,
                raw: true
            }
            return includes;
        } catch (error) {
            console.log("Error_in_getBundlingSupervisorIncludes ", error);
            throw error;
        }
    }

    public async getBundlingSupervisorFilter(input: Object) {
        let operatorEntryFilter = {
            '$[tbl_bundlingSupervisor].finishQuantity$': Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[finishQuantity],0) LIKE N'%${input["ffinishQuantity"]}%' )
            `),
            '$[tbl_bundlingSupervisor].piecesPerBundle$': Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[piecesPerBundle],0) LIKE N'%${input["fpiecesPerBundle"]}%' )
            `),
            '$[tbl_bundlingSupervisor].bundleWeight$': Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[bundleWeight],0) LIKE N'%${input["fbundleWeight"]}%' )
            `),
            '$[tbl_bundlingSupervisor].noOfBundles$': Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[noOfBundles],0) LIKE N'%${input["fnoOfBundles"]}%' )
            `),
            '$[tbl_bundlingSupervisor].totalNoOfPieces$': Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[totalNoOfPieces],0) LIKE N'%${input["ftotalNoOfPieces"]}%' )
            `),
            '$[tbl_bundlingSupervisor].correctionQty$': Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[correctionQty],0) LIKE N'%${input["fcorrectionQty"]}%' )
            `),
            '$[tbl_bundlingSupervisor].actualFrontEndCoringLength$': Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[actualFrontEndCoringLength],0) LIKE N'%${input["factualFrontEndCoringLength"]}%' )
            `),
            '$[tbl_bundlingSupervisor].actualBackEndCoringLength$': Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[actualBackEndCoringLength],0) LIKE N'%${input["factualBackEndCoringLength"]}%' )
            `),
            '$[tbl_bundlingSupervisor].recovery$': Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[recovery],0) LIKE N'%${input["frecovery"]}%' )
            `),
            '$[tbl_bundlingSupervisor].remarks$': Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[remarks],'') LIKE N'%${input["fbundlingSupervisorRemarks"]}%' )
            `),
        }
        return operatorEntryFilter;
    }
}