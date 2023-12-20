import { Service } from "typedi";
import BaseService from "./BaseService";
import db from "../../models";
import AppConstants from "../constants/Appconstants";
import { isValueOrUndefined, uuidv4 } from "../utils/Utils";
import { Op, Sequelize } from "sequelize";
import { role } from "../enums/Enums";
import { OperatorEntryService } from "./OperatorEntryService";

let operatorEntryService = new OperatorEntryService();

@Service()
export class PpcService extends BaseService<any> {
    getModel() {
        return db.PPC;
    }

    public async createOrUpdatePpcStatus(input: Object, currentUser: Object, tran) {
        try {
            let ppcData
            let orderData = await this.findUniqueKey(db.tbl_order, input["orderId"]);
            if (orderData) {
                let ppcDataObj = new db.tbl_ppc();
                ppcDataObj.plantSelected = input["plantSelected"];
                ppcDataObj.pressAllocationRefId = input["pressAllocationRefId"];
                ppcDataObj.plannedQty = input["plannedQty"];
                ppcDataObj.orderId = orderData.id;
                ppcDataObj.plannedInternalAlloy = input["plannedInternalAlloy"];
                ppcDataObj.plannedNoOfBilletAndLength = input["plannedNoOfBilletAndLength"] ? JSON.stringify(input["plannedNoOfBilletAndLength"]) : undefined;
                ppcDataObj.productionRateRequired = input["productionRateRequired"];
                ppcDataObj.plannedQuenching = input["plannedQuenching"];
                ppcDataObj.frontEndCoringLength = input["frontEndCoringLength"];
                ppcDataObj.backEndCoringLength = input["backEndCoringLength"];
                // ppcDataObj.backEndCoringLength = (input["backEndCoringLength"] != null
                //     && input["backEndCoringLength"] >= AppConstants.ZERO) ?
                //     input["backEndCoringLength"] : undefined;
                ppcDataObj.plantExtrusionLength = input["plantExtrusionLength"];
                ppcDataObj.extrusionLengthRefId = input["extrusionLengthRefId"];
                ppcDataObj.plannedButtThickness = input["plannedButtThickness"];
                ppcDataObj.cutBilletsRefId = input["cutBilletsRefId"];
                ppcDataObj.buttWeightPerInch = isValueOrUndefined(input["buttWeightPerInch"]);
                ppcDataObj.remarks = input["remarks"];
                ppcDataObj.isActive = input["isActive"];
                ppcDataObj.isDeleted = AppConstants.ZERO
                if (currentUser["roleId"] == AppConstants.ONE) {
                    ppcDataObj.updatedAdminId = currentUser["id"];
                    ppcDataObj.adminUpdatedOn = new Date(new Date().toUTCString());
                }

                if (input["ppcId"] != "") {
                    ppcData = await this.findUniqueKey(db.tbl_ppc, input["ppcId"]);
                }

                if (ppcData) {
                    ppcDataObj.id = ppcData.id;
                    ppcDataObj.updatedBy = currentUser["id"];
                    ppcDataObj.updatedOn = new Date(new Date().toUTCString());
                } else {
                    ppcDataObj.uniqueKey = uuidv4();
                    ppcDataObj.createdBy = currentUser["id"];
                    ppcDataObj.createdOn = new Date(new Date().toUTCString());
                }

                // console.log("ppcDataObj", ppcDataObj);

                let result = await this.createOrUpdateByModel(db.tbl_ppc, ppcDataObj, tran);
                if (result) {
                    isValueOrUndefined(input["priorityRefId"]) && await this.updateOrderPriority(input, orderData.id, currentUser["id"], currentUser["roleId"], tran);
                    (currentUser["roleId"] == role.Admin) && await operatorEntryService.updateDerivativeFields(orderData.id, ppcDataObj.buttWeightPerInch, tran);
                    return {
                        "message": AppConstants.UPDATED_SUCCESSFULLY,
                        "uniqueKey": result.uniqueKey
                    }
                    // return AppConstants.UPDATED_SUCCESSFULLY;
                } else
                    return AppConstants.PROBLEM_WHILE_UPDATING;
            } else
                return AppConstants.INVALID_ID;
        } catch (error) {
            throw error
        }
    }

    public async getPPCData(orderId: number, userId: number, roleId: number) {
        try {
            let whereCondition = {
                isActive: AppConstants.ONE,
                isDeleted: AppConstants.ZERO,
                orderId: orderId,
                // createdBy: userId
            };
            // (roleId == role.Admin || roleId > role.PPC) && delete whereCondition.createdBy
            let query = await db.tbl_ppc.findOne({
                attributes: [
                    ["uniqueKey", 'ppcId'],
                    "plantSelected", "pressAllocationRefId", "plannedQty", "plannedInternalAlloy",
                    "plannedNoOfBilletAndLength", "productionRateRequired", "plannedQuenching",
                    "frontEndCoringLength", "backEndCoringLength", "plantExtrusionLength",
                    "extrusionLengthRefId",
                    "plannedButtThickness",
                    "cutBilletsRefId",
                    "buttWeightPerInch", //"priorityAssignmentRefId",
                    [Sequelize.literal(`
                        (select priorityRefId
                        from ${AppConstants.DB_JINDAL}.dbo.${AppConstants.TBL_ORDER} tbo
                        where tbo.isDeleted = 0 and tbo.isActive = 1
                            and tbo.id = tbl_ppc.orderId)
                    `), "priorityRefId"],
                    "remarks"
                ],
                distinct: true,
                model: db.tbl_ppc,
                where: whereCondition,
                required: true,
                raw: true
            })
            return query;
        } catch (error) {
            console.log("Error_in_getPPCData ", error);
            throw error;
        }
    }

    public async getReferenceMetaData(name: string) {
        try {
            let referenceGroupData = await db.tbl_referenceGroup.findOne({
                where: { name: name, isDeleted: 0 },
                raw: true
            })
            if (referenceGroupData) {
                let result = await db.tbl_reference.findAll({
                    attributes: [
                        "id", "name", "description",
                        "referenceGroupId", "sortOrder",
                    ],
                    distinct: true,
                    model: db.tbl_reference,
                    where: {
                        isDeleted: AppConstants.ZERO,
                        referenceGroupId: referenceGroupData.id
                    },
                    required: true,
                    raw: true,
                    order: [['sortOrder', 'ASC']]
                })
                return result;
            } else
                return AppConstants.INVALID_ID;
        } catch (error) {
            console.log("Error_in_getReferenceMetaData ", error);
            throw error;
        }
    }

    public async getPPCAttributes(isDownload: number) {
        try {
            let attributes = [
                [Sequelize.literal('tbl_ppc.uniqueKey'), 'ppcId'],
                [Sequelize.literal(`${isDownload ? "replace(tbl_ppc.plantSelected,'#','')" : 'tbl_ppc.plantSelected'}`), 'plantSelected'],
                // [Sequelize.literal('tbl_ppc.pressAllocationRefId'), 'pressAllocationRefId'],
                [Sequelize.literal(`(select tr.name 
                    from ${AppConstants.DB_JINDAL}.dbo.${AppConstants.TBL_REFERENCE} tr
                    where tr.isDeleted = 0 and tr.referenceGroupId = 9 
                        and tr.id = tbl_ppc.pressAllocationRefId)`), 'pressAllocation'],
                [Sequelize.literal('tbl_ppc.plannedQty'), 'plannedQty'],
                [Sequelize.literal(`${isDownload ? "replace(tbl_ppc.plannedInternalAlloy,'#','')" : 'tbl_ppc.plannedInternalAlloy'}`), 'plannedInternalAlloy'],
                [Sequelize.literal('tbl_ppc.plannedNoOfBilletAndLength'), 'plannedNoOfBilletAndLength'],
                [Sequelize.literal('tbl_ppc.productionRateRequired'), 'productionRateRequired'],
                [Sequelize.literal(`(select tr.name 
                    from ${AppConstants.DB_JINDAL}.dbo.${AppConstants.TBL_REFERENCE} tr
                    where tr.isDeleted = 0 and tr.referenceGroupId = 1 
                        and tr.id = tbl_ppc.plannedQuenching)`), 'plannedQuenching'],
                [Sequelize.literal('tbl_ppc.frontEndCoringLength'), 'frontEndCoringLength'],
                [Sequelize.literal('tbl_ppc.backEndCoringLength'), 'backEndCoringLength'],
                [Sequelize.literal('tbl_ppc.plantExtrusionLength'), 'plantExtrusionLength'],
                // [Sequelize.literal('tbl_ppc.extrusionLengthRefId'), 'extrusionLengthRefId'],
                [Sequelize.literal(`(select tr.name 
                    from ${AppConstants.DB_JINDAL}.dbo.${AppConstants.TBL_REFERENCE} tr
                    where tr.isDeleted = 0 and tr.referenceGroupId = 2 
                        and tr.id = tbl_ppc.extrusionLengthRefId)`), 'extrusionLength'],
                [Sequelize.literal('tbl_ppc.plannedButtThickness'), 'plannedButtThickness'],
                [Sequelize.literal(`
                    (case when tbl_ppc.cutBilletsRefId = 1 then 'Yes'
                        when tbl_ppc.cutBilletsRefId = 2 then 'No'
                        else null
                    end)`),
                    "cutBillets"],
                [Sequelize.literal('tbl_ppc.buttWeightPerInch'), "buttWeightPerInch"],
                [Sequelize.literal(`${isDownload ? "replace(tbl_ppc.remarks,'#','')" : 'tbl_ppc.remarks'}`), "ppcRemarks"],
            ]
            return attributes;
        } catch (error) {
            console.log("Error_in_getPPCAttributes ", error);
            throw error;
        }
    }

    public async getPPCIncludes() {
        try {
            let includes = {
                attributes: [],
                distinct: true,
                model: db.tbl_ppc,
                where: {
                    isActive: AppConstants.ONE,
                    isDeleted: AppConstants.ZERO,
                },
                required: false,
                raw: true
            }
            return includes;
        } catch (error) {
            console.log("Error_in_getPPCIncludes ", error);
            throw error;
        }
    }

    public async getPPCFilter(input: Object) {
        let ppcFilter = {
            '$[tbl_ppc].plantSelected$': Sequelize.literal(`
                    (isnull([tbl_ppc].[plantSelected], '') LIKE N'%${input["fplantSelected"]}%')
                    `),
            '$[tbl_ppc].pressAllocationRefId$': Sequelize.literal(`
                    (isnull([tbl_ppc].[pressAllocationRefId], 0) LIKE N'%${input["fpressAllocation"]}%')
                    `),
            '$[tbl_ppc].plannedQty$': Sequelize.literal(`
                    (isnull([tbl_ppc].[plannedQty], 0) LIKE N'%${input["fplannedQty"]}%')
                    `),
            '$[tbl_ppc].plannedInternalAlloy$': Sequelize.literal(`
                    (isnull([tbl_ppc].[plannedInternalAlloy], '') LIKE N'%${input["fplannedInternalAlloy"]}%')
                    `),
            // '$[tbl_ppc].plannedNoOfBilletAndLength$': Sequelize.literal(`
            //     ([tbl_ppc].[plannedNoOfBilletAndLength] LIKE N'%${input["fplannedNoOfBilletAndLength"]}%' OR 1=1 )
            // `),
            '$[tbl_ppc].productionRateRequired$': Sequelize.literal(`
                (isnull([tbl_ppc].[productionRateRequired],0) LIKE N'%${input["fproductionRateRequired"]}%' )
            `),
            '$[tbl_ppc].plannedQuenching$': Sequelize.literal(`
                (isnull([tbl_ppc].[plannedQuenching],0) LIKE N'%${input["fplannedQuenching"]}%' )
            `),
            '$[tbl_ppc].frontEndCoringLength$': Sequelize.literal(`
                (isnull([tbl_ppc].[frontEndCoringLength],0) LIKE N'%${input["ffrontEndCoringLength"]}%' )
            `),
            '$[tbl_ppc].backEndCoringLength$': Sequelize.literal(`
                (isnull([tbl_ppc].[backEndCoringLength],0) LIKE N'%${input["fbackEndCoringLength"]}%' )
            `),
            '$[tbl_ppc].plantExtrusionLength$': Sequelize.literal(`
                (isnull([tbl_ppc].[plantExtrusionLength],0) LIKE N'%${input["fplantExtrusionLength"]}%' )
            `),
            '$[tbl_ppc].extrusionLengthRefId$': Sequelize.literal(`
                (isnull([tbl_ppc].[extrusionLengthRefId],0) LIKE N'%${input["fextrusionLengthRefId"]}%' )
            `),
            '$[tbl_ppc].plannedButtThickness$': Sequelize.literal(`
                (isnull([tbl_ppc].[plannedButtThickness],0) LIKE N'%${input["fplannedButtThickness"]}%' )
            `),
            '$[tbl_ppc].cutBilletsRefId$': Sequelize.literal(`
                (isnull([tbl_ppc].[cutBilletsRefId],0) LIKE N'%${input["fcutBilletsRefId"]}%' )
            `),
            '$[tbl_ppc].buttWeightPerInch$': Sequelize.literal(`
                (isnull([tbl_ppc].[buttWeightPerInch],0) LIKE N'%${input["fbuttWeightPerInch"]}%' )
            `),
            '$[tbl_ppc].remarks$': Sequelize.literal(`
                (isnull([tbl_ppc].[remarks],'') LIKE N'%${input["fppcRemarks"]}%' )
            `),
        }
        return ppcFilter;
    }

    public async updateOrderPriority(input: Object, orderId: number, userId: number, roleId: number, tran) {
        try {
            console.log("into the updateOrderPriority")
            let orderObj = new db.tbl_order();
            orderObj.id = orderId;
            orderObj.priorityRefId = input["priorityRefId"];
            if (roleId == AppConstants.ONE) {
                orderObj.updatedAdminId = userId;
                orderObj.adminUpdatedOn = new Date(new Date().toUTCString());
            } else {
                orderObj.updatedBy = userId;
                orderObj.updatedOn = new Date(new Date().toUTCString());
            }
            let result = await this.createOrUpdateByModel(db.tbl_order, orderObj, tran)
            return result;
        } catch (error) {
            console.log("Error_in_updateOrderPriority" + error);
            throw error;
        }
    }

    public async getOrderUserMappingIncludes(input: Object, currentUser: Object) {
        try {
            let includes = {
                attributes: [],
                distinct: true,
                model: db.tbl_orderUserMapping,
                where: {
                    isActive: AppConstants.ONE,
                    isDeleted: AppConstants.ZERO,
                    userId: Sequelize.literal(`tbl_orderUserMappings.userId = tbl_order.updatedBy`)
                },
                required: false,
                subQuery: false,
                raw: true
            }
            // if (role.Admin == currentUser["roleId"]) {
            //     delete includes.where.userId
            // }
            return includes;
        } catch (error) {
            console.log("Error_in_getOrderUserMappingIncludes ", error);
            throw error;
        }
    }

    public async getPPCBilletWeight(orderId: number) {
        try {
            let whereCondition = {
                isActive: AppConstants.ONE,
                isDeleted: AppConstants.ZERO,
                orderId: orderId
            };
            let query = await db.tbl_ppc.findOne({
                attributes: [
                    "buttWeightPerInch"
                ],
                distinct: true,
                model: db.tbl_ppc,
                where: whereCondition,
                required: true,
                raw: true
            })
            return query;
        } catch (error) {
            console.log("Error_in_getPPCBilletWeight ", error);
            throw error;
        }
    }
}