import { Service } from "typedi";
import BaseService from "./BaseService";
import db from "../../models";
import {
    bundlingSupervisorWorkFlow, operatorEntryWorkFlow,
    ppcWorkFlow, processStageMeta, qaWorkFlow, role, toolShopWorkFlow, workFlow
} from "../enums/Enums";
import AppConstants from "../constants/Appconstants";
import { isArrayPopulated, isNotNullAndUndefined, paginationData, removeKeyfromJson, uuidv4 } from "../utils/Utils";
import { Op, Sequelize } from "sequelize";
import { PpcService } from "./PpcService";
import { ToolShopService } from "./ToolShopService";
import { QAService } from "./QAService";
import { OperatorEntryService } from "./OperatorEntryService";
import { BundlingSupervisorService } from "./BundlingSupervisorService";

let ppcService = new PpcService();
let toolShopService = new ToolShopService();
let qaService = new QAService();
let operatorEntryService = new OperatorEntryService();
let bundlingSupervisorService = new BundlingSupervisorService();

@Service()
export class OrderService extends BaseService<any> {
    getModel() {
        return db.tbl_order;
    }

    public async orderList(input: Object, currentUser: Object) {
        try {
            console.log("Into_the_orderList ", currentUser["roleId"]);
            let { workFlowId, completedId } = await this.getWorkFlow_fromEnum(input, currentUser);
            let result = await this.getOrderList(input, workFlowId, completedId, currentUser);
            return result;
        } catch (error) {
            console.log("Error_in_orderList " + error);
            throw error;
        }
    }

    public async getWorkFlow_fromEnum(input: Object, currentUser: Object) {
        try {
            let workFlowId = [];
            let completedId = [];
            switch (currentUser["roleId"]) {
                case role.PPC:
                    workFlowId.push(input["type"] == AppConstants.PENDING ?
                        ppcWorkFlow.Pending : (input["type"] == AppConstants.INPROGRESS ?
                            ppcWorkFlow.PPC_Inprogress : ppcWorkFlow.PPC_Hold))
                    if (input["type"] == AppConstants.INPROGRESS || input["type"] == AppConstants.COMPLETED) {
                        completedId = [...Array(17).keys()].slice(4)
                    }
                    break;
                case role.Tool_Shop:
                    workFlowId.push(input["type"] == AppConstants.PENDING ?
                        toolShopWorkFlow.Queued_for_Tool_Shop :
                        (input["type"] == AppConstants.INPROGRESS ?
                            toolShopWorkFlow.Tool_Shop_Inprogress : toolShopWorkFlow.Tool_Shop_Hold))
                    if (input["type"] == AppConstants.INPROGRESS || input["type"] == AppConstants.COMPLETED) {
                        completedId = [...Array(17).keys()].slice(7)
                    }
                    break;
                case role.QA:
                    workFlowId.push(input["type"] == AppConstants.PENDING ?
                        qaWorkFlow.Queued_for_QA : (input["type"] == AppConstants.INPROGRESS ?
                            qaWorkFlow.QA_Inprogress : qaWorkFlow.QA_Hold))
                    if (input["type"] == AppConstants.INPROGRESS || input["type"] == AppConstants.COMPLETED) {
                        completedId = [...Array(17).keys()].slice(10)
                    }
                    break;
                case role.Operator_Entry:
                    workFlowId.push(input["type"] == AppConstants.PENDING ?
                        operatorEntryWorkFlow.Queued_for_Operator_Entry :
                        (input["type"] == AppConstants.INPROGRESS ?
                            operatorEntryWorkFlow.Operator_Entry_Inprogress :
                            operatorEntryWorkFlow.Operator_Entry_Hold))
                    if (input["type"] == AppConstants.INPROGRESS || input["type"] == AppConstants.COMPLETED) {
                        completedId = [...Array(17).keys()].slice(13)
                    }
                    break;
                case role.Bundling_Supervisior:
                    workFlowId.push(input["type"] == AppConstants.PENDING ?
                        bundlingSupervisorWorkFlow.Queued_for_Bundling_Supervisior :
                        (input["type"] == AppConstants.INPROGRESS ?
                            bundlingSupervisorWorkFlow.Bundling_Supervisior_Inprogress :
                            bundlingSupervisorWorkFlow.Bundling_Supervisior_Hold))
                    if (input["type"] == AppConstants.INPROGRESS || input["type"] == AppConstants.COMPLETED) {
                        completedId.push(bundlingSupervisorWorkFlow.Bundling_Supervisior_Completed)
                    }
                    break;

                default:    //For Admin
                    console.log("Into the Admin ", currentUser["roleId"], " workFlowId ", workFlowId, " completedId ", completedId)
                    // workFlowId = [...Array(16).keys()].slice(1)
                    if (input["roleData"] && isNotNullAndUndefined(input["roleData"]["processStage"])) {
                        input["type"] == AppConstants.HOLD &&
                            workFlowId.push(await this.getAdminUpdate_WorkFlowId(input));
                        input["type"] == AppConstants.COMPLETED &&
                            completedId.push(await this.getAdminUpdate_WorkFlowId(input));
                    } else {
                        input["type"] == AppConstants.PENDING
                            && workFlowId.push(AppConstants.ONE, AppConstants.FOUR, AppConstants.SEVEN,
                                AppConstants.TEN, AppConstants.THIRTEEN);
                        input["type"] == AppConstants.INPROGRESS
                            && workFlowId.push(AppConstants.TWO, AppConstants.FIVE, AppConstants.EIGHT,
                                AppConstants.ELEVEN, AppConstants.FOURTEEN);
                        input["type"] == AppConstants.HOLD
                            && workFlowId.push(AppConstants.THREE, AppConstants.SIX, AppConstants.NINE,
                                AppConstants.TWELVE, AppConstants.FIFTEEN);
                        (input["type"] == AppConstants.COMPLETED || input["type"] == AppConstants.INPROGRESS)
                            && completedId.push(AppConstants.SIXTEEN);
                        // && completedId.push(AppConstants.FOUR, AppConstants.SEVEN, AppConstants.TEN,
                        //     AppConstants.THIRTEEN, AppConstants.SIXTEEN);
                    }
                    break;
            }
            return { workFlowId, completedId };
        } catch (error) {
            console.log("Error_in_getWorkFlow_fromEnum " + error);
            throw error;
        }
    }

    public async getOrderList(input: Object, workflowId: number[], completedId: number[], currentUser: Object) {
        try {
            let query = await Promise.all([
                db.tbl_order.findAndCountAll(
                    await this.commonOrderList_Formation(input, workflowId, completedId, currentUser)),
                // (isArrayPopulated(completedId) && input["type"] == AppConstants.INPROGRESS
                //     && input["exportType"] == AppConstants.ZERO) &&
                // db.tbl_order.findOne(await this.orderCompleted_inInProgres(input, completedId, currentUser["roleId"]))
            ]).then((data) => {
                // console.log("data ", JSON.stringify(data))
                // return data.flat()
                return data
            })
            // if (query[query.length - 1] && input["type"] == AppConstants.INPROGRESS
            //     && input["exportType"] == AppConstants.ZERO) {
            //     let completedValue = query.pop()
            //     query[0].count += AppConstants.ONE;
            //     query[0].rows.unshift(completedValue)
            // }
            // console.log("query ", query[0])
            let result;
            if (isArrayPopulated(query[0].rows)) {
                if (input["exportType"] == AppConstants.ZERO) {
                    let pagination = await paginationData(query[0].count, input["paging"].limit, input["paging"].offset);
                    result = {
                        page: pagination,
                        orderData: removeKeyfromJson(query[0].rows, 'id'),
                        lastSync: await this.getLastSyncDate()
                    }
                } else if (input["exportType"] == AppConstants.ONE) {
                    result = await this.excelConversion(query[0].rows, input["type"], currentUser["roleId"]);
                } else if (input["exportType"] == AppConstants.TWO) {
                    result = query[0].rows;
                }
            } else {
                result = {
                    page: null,
                    orderData: null,
                    lastSync: await this.getLastSyncDate()
                }
            }
            // console.log("result ", result);
            return result;
        } catch (error) {
            console.log("Error_in_getOrderList " + error);
            throw error;
        }
    }

    public async updateOrderStatus(orderId: number[], workFlowId: number, currentUser: Object, tran) {
        try {
            let result = await db.tbl_order.update({
                workFlowId: workFlowId,
                isReassigned: AppConstants.ZERO,
                reassignedOn: null,
                updatedBy: currentUser["id"],
                updatedOn: new Date(new Date().toUTCString())
            }, {
                where: {
                    isActive: AppConstants.ONE,
                    isDeleted: AppConstants.ZERO,
                    id: orderId
                }
            }, { transaction: tran })
            return result;
        } catch (error) {
            console.log("Error_in_updateOrderStatus " + error);
            throw error;
        }
    }

    public async commonOrderList_Formation(input: Object, workflowId: number[], completedId: number[], currentUser: Object) {
        try {
            let sortOrder = input["type"] == AppConstants.COMPLETED ? [['updatedOn', 'DESC']] :
                ((input["type"] == AppConstants.INPROGRESS || input["type"] == AppConstants.HOLD) ?
                    [['priorityRefId', 'ASC'], ['updatedOn', 'ASC']] :
                    [["isReassigned", "DESC"], ["reassignedOn", "ASC"], ['priorityRefId', 'ASC'], ['updatedOn', 'ASC']]);
            let processStage = `
                (case 
                    when workFlowId in (${workFlow.Pending},${workFlow.PPC_Inprogress},${workFlow.PPC_Hold}) then '${processStageMeta.ppc}'
                    when workFlowId in (${workFlow.Queued_for_Tool_Shop},${workFlow.Tool_Shop_Inprogress},${workFlow.Tool_Shop_Hold}) then '${processStageMeta.toolShop}'
                    when workFlowId in (${workFlow.Queued_for_QA},${workFlow.QA_Inprogress},${workFlow.QA_Hold}) then '${processStageMeta.qa}'
                    when workFlowId in (${workFlow.Queued_for_Operator_Entry},${workFlow.Operator_Entry_Inprogress},${workFlow.Operator_Entry_Hold}) then '${processStageMeta.operatorEntry}'
                    when workFlowId in (${workFlow.Queued_for_Bundling_Supervisior},${workFlow.Bundling_Supervisior_Inprogress},${workFlow.Bundling_Supervisior_Hold}) then '${processStageMeta.bundlingSupervisor}'
                    else 'Completed'
                end)
            `;
            let dataObj = {
                attributes: [
                    Sequelize.literal(`distinct([tbl_order].id)`),
                    ["uniqueKey", 'orderId'],
                    ["po", "poNo"], "customer_name", ["so", "soNo"],
                    [Sequelize.literal(`right(material_code,7)`), "sectionNo"],
                    ["temper", "alloyTemper"],
                    "po_qty", "extruded_qty",
                    "balance_po_qty",
                    [Sequelize.literal(`
                        (case when cut_len_tolerance_lower >= 0 or cut_len_tolerance_upper >= 0 
                            then concat(isnull(cut_len_tolerance_lower, 0),', ',isnull(cut_len_tolerance_upper,0))
                            else null 
                        end)`),
                        "cut_len_tolerance"],
                    [Sequelize.literal(`
                        (case when isnull(qty_tolerance_min, 0) <> 0 or isnull(qty_tolerance_max,0) <> 0 
                            then concat(isnull(qty_tolerance_min, 0),', ',isnull(qty_tolerance_max,0))
                            else null 
                        end)`),
                        "qty_tolerance"],
                    "marketing_remarks",
                    "cut_len",
                    "priorityRefId",
                    [Sequelize.literal(`
                        (select tr.name
                        from ${AppConstants.DB_JINDAL}.dbo.${AppConstants.TBL_REFERENCE} tr
                        where tr.isDeleted = 0 and tr.referenceGroupId = 4
                            and tr.id = priorityRefId)
                        `),
                        "priority"],
                    [Sequelize.literal(`${processStage}`), 'processStage'],
                    "workFlowId", "isReassigned",
                    "[updatedOn]", "[reassignedOn]"
                ],
                distinct: true,
                model: db.tbl_order,
                subQuery: false,
                where: {
                    isActive: AppConstants.ONE,
                    isDeleted: AppConstants.ZERO,
                    workflowId: {
                        [Op.in]: isArrayPopulated(input["fprocessStage"]) ? input["fprocessStage"]
                            : (input["type"] == AppConstants.COMPLETED ? completedId : workflowId)
                    },
                    po: Sequelize.literal(`
                        ([tbl_order].[po] LIKE N'%${input["fpo"]}%')
                    `),
                    customer_name: Sequelize.literal(`
                        ([tbl_order].[customer_name] LIKE N'%${input["fcustomer_name"]}%')
                    `),
                    so: Sequelize.literal(`
                        ([tbl_order].[so] LIKE N'%${input["fso"]}%')
                    `),
                    material_code: Sequelize.literal(`
                        (right([tbl_order].material_code,7) LIKE N'%${input["fsectionNo"]}%')
                    `),
                    temper: Sequelize.literal(`
                        ([tbl_order].[temper] LIKE N'%${input["fAlloyTemper"]}%')
                    `),
                    po_qty: Sequelize.literal(`
                        ([tbl_order].[po_qty] LIKE N'%${input["fpo_qty"]}%')
                    `),
                    extruded_qty: Sequelize.literal(`
                        (isnull([tbl_order].[extruded_qty],'') LIKE N'%${input["fextruded_qty"]}%' )
                    `),
                    balance_po_qty: Sequelize.literal(`
                        (isnull([tbl_order].[balance_po_qty],'') LIKE N'%${input["fbalance_po_qty"]}%' )
                    `),
                    marketing_remarks: Sequelize.literal(`
                        (isnull([tbl_order].[marketing_remarks],'') LIKE N'%${input["fmarketing_remarks"]}%' )
                    `),
                    cut_len: Sequelize.literal(`
                        (isnull([tbl_order].[cut_len],'') LIKE N'%${input["fcut_len"]}%')
                    `),
                    priorityRefId: Sequelize.literal(`
                        (isnull([tbl_order].[priorityRefId],'') LIKE N'%${input["fPriority"]}%')
                    `),
                    ...((currentUser["roleId"] === role.Admin || currentUser['roleId'] >= role.PPC || input["exportType"]) ?
                        await ppcService.getPPCFilter(input) : null),
                    ...((currentUser["roleId"] === role.Admin || currentUser['roleId'] > role.PPC || input["exportType"]) ?
                        await toolShopService.getToolShopFilter(input) : null),
                    ...((currentUser["roleId"] === role.Admin || currentUser['roleId'] > role.Tool_Shop || input["exportType"]) ?
                        await qaService.getQAFilter(input) : null),
                    ...((currentUser["roleId"] === role.Admin || currentUser['roleId'] > role.QA || input["exportType"]) ?
                        await operatorEntryService.getOperatorEntryFilter(input) : null),
                    ...((currentUser["roleId"] === role.Admin || currentUser['roleId'] > role.Operator_Entry || input["exportType"]) ?
                        await bundlingSupervisorService.getBundlingSupervisorFilter(input) : null)

                    // // orderDate: Sequelize.literal(`
                    // //     (case when ${input["fOrderDate"] ? `'${input["fOrderDate"]}'` : null} is not null 
                    // //         then CAST(tbl_order.orderDate AS date) = CAST('${input["fOrderDate"]}' AS date)
                    // //         else 1=1 
                    // //     end)
                    // // `),
                    // orderQty: {
                    //     [Op.like]: '%' + input["fOrderQty"] + '%'
                    // },
                    // // updatedOn: Sequelize.literal(`
                    // //     (case when ${input["fCompletedDate"] ? `'${input["fCompletedDate"]}'` : null} is not null
                    // //         then CAST(tbl_order.updatedOn AS date) = CAST('${input["fCompletedDate"]}' AS date)
                    // //         else 1=1
                    // //     end)
                    // // `)
                    // orderDate: input["fOrderDate"],
                    // // updatedOn: input["fCompletedDate"]
                },
                order: sortOrder,
                required: true,
                raw: true
            }
            if (input["type"] !== AppConstants.PENDING && input["type"] !== AppConstants.COMPLETED
                && role.Admin !== currentUser["roleId"]) {
                dataObj.where["updatedBy"] = currentUser["id"]
            }
            // if (input["fCompletedDate"] && input["fCompletedDate"] != '') {
            //     dataObj.where['[Op.and]'] = Sequelize.literal(`
            //         CONVERT(nvarchar(50),[tbl_order].[updatedOn], 105) = CONVERT(nvarchar(50),N'${input["fCompletedDate"]}', 105)
            //     `)
            // }
            // dataObj["include"] = [
            //     await ppcService.getPPCIncludes(),
            //     await toolShopService.getToolShopIncludes(),
            //     await qaService.getQAIncludes(),
            //     await operatorEntryService.getOperatorEntryIncludes(),
            //     await bundlingSupervisorService.getBundlingSupervisorIncludes(),
            //     await ppcService.getOrderUserMappingIncludes(input, currentUser),
            // ];
            dataObj["include"] = await this.getValidationIncludes(currentUser["roleId"], false, input["exportType"])
            // dataObj.attributes = [
            //     ...dataObj.attributes,
            //     ...((currentUser["roleId"] === 1 || currentUser['roleId'] >= role.PPC) ? await ppcService.getPPCAttributes():null),
            //     ...((currentUser["roleId"] === 1 || currentUser['roleId'] > role.PPC ) ? await toolShopService.getToolShopAttributes():null),
            //     ...((currentUser["roleId"] === 1 || currentUser['roleId'] > role.Tool_Shop) ? await qaService.getQAAttributes():null),
            //     ...((currentUser["roleId"] === 1 || currentUser['roleId'] > role.QA) ? await operatorEntryService.getOperatorEntryAttributes():null),
            //     ...((currentUser["roleId"] === 1 || currentUser['roleId'] > role.Operator_Entry) ? await bundlingSupervisorService.getBundlingSupervisorAttributes():null)
            // ];
            dataObj['attributes'] =
                await this.getValidationAttributes(currentUser["roleId"], dataObj.attributes, input["exportType"])

            if (input["paging"].limit > AppConstants.ZERO) {
                dataObj["limit"] = input["paging"].limit;
                dataObj["offset"] = input["paging"].offset;
            }
            console.log("dataObj ", dataObj)
            return dataObj;
        } catch (error) {
            console.log("Error_in_commonOrderList_Formation " + error);
            throw error;
        }
    }

    public async orderCompleted_inInProgres(input: Object, completedId: number[], roleId: number) {
        try {
            let processStage = `
                (case 
                    when workFlowId in (${workFlow.Pending},${workFlow.PPC_Inprogress},${workFlow.PPC_Hold}) then '${processStageMeta.ppc}'
                    when workFlowId in (${workFlow.Queued_for_Tool_Shop},${workFlow.Tool_Shop_Inprogress},${workFlow.Tool_Shop_Hold}) then '${processStageMeta.toolShop}'
                    when workFlowId in (${workFlow.Queued_for_QA},${workFlow.QA_Inprogress},${workFlow.QA_Hold}) then '${processStageMeta.qa}'
                    when workFlowId in (${workFlow.Queued_for_Operator_Entry},${workFlow.Operator_Entry_Inprogress},${workFlow.Operator_Entry_Hold}) then '${processStageMeta.operatorEntry}'
                    when workFlowId in (${workFlow.Queued_for_Bundling_Supervisior},${workFlow.Bundling_Supervisior_Inprogress},${workFlow.Bundling_Supervisior_Hold}) then '${processStageMeta.bundlingSupervisor}'
                    else 'Completed'
                end)
            `;
            let dataObj = {
                attributes: [
                    ["uniqueKey", 'orderId'],
                    ["uniqueKey", 'orderId'],
                    ["po", "poNo"], "customer_name", ["so", "soNo"],
                    [Sequelize.literal(`right(material_code,7)`), "sectionNo"],
                    ["temper", "alloyTemper"],
                    "po_qty", "extruded_qty",
                    "balance_po_qty",
                    [Sequelize.literal(`
                        (case when isnull(cut_len_tolerance_lower, 0) <> 0 or isnull(cut_len_tolerance_upper,0) <> 0 
                            then concat(isnull(cut_len_tolerance_lower, 0),', ',isnull(cut_len_tolerance_upper,0))
                            else null 
                        end)`),
                        "cut_len_tolerance"],
                    [Sequelize.literal(`
                        (case when isnull(qty_tolerance_min, 0) <> 0 or isnull(qty_tolerance_max,0) <> 0 
                            then concat(isnull(qty_tolerance_min, 0),', ',isnull(qty_tolerance_max,0))
                            else null 
                        end)`),
                        "qty_tolerance"],
                    "marketing_remarks",
                    "cut_len",
                    [Sequelize.literal(`
                        (select tr.name 
                        from ${AppConstants.DB_JINDAL}.dbo.${AppConstants.TBL_REFERENCE} tr
                        where tr.isDeleted = 0 and tr.referenceGroupId = 4
                            and tr.id = priorityRefId)
                    `), "priority"],
                    [Sequelize.literal(`${processStage}`), 'processStage'],
                    "workFlowId", "isReassigned",
                ],
                distinct: true,
                model: db.tbl_order,
                where: {
                    isActive: AppConstants.ONE,
                    isDeleted: AppConstants.ZERO,
                    workflowId: {
                        [Op.in]: completedId
                    },
                },
                order: [
                    ['updatedOn', 'DESC']
                ],
                limit: 1,
                offset: input["paging"].offset,
                required: true,
                raw: true
            }
            dataObj["include"] = [
                await ppcService.getPPCIncludes(),
                await toolShopService.getToolShopIncludes(),
                await qaService.getQAIncludes(),
                await operatorEntryService.getOperatorEntryIncludes(),
                await bundlingSupervisorService.getBundlingSupervisorIncludes()
            ];
            // dataObj.attributes = [
            //     ...dataObj.attributes,
            //     ...(await ppcService.getPPCAttributes()),
            //     ...(await toolShopService.getToolShopAttributes()),
            //     ...(await qaService.getQAAttributes()),
            //     ...(await operatorEntryService.getOperatorEntryAttributes()),
            //     ...(await bundlingSupervisorService.getBundlingSupervisorAttributes())
            // ];
            return dataObj;
        } catch (error) {
            console.log("Error_in_orderCompleted_inInProgres " + error);
            throw error;
        }
    }

    public async viewDetailsList(orderId: string, currentUser: Object) {
        try {
            console.log("Into_the_viewDetailsList ", orderId, currentUser);
            let orderDetails = await this.findUniqueKey(db.tbl_order, orderId);
            if (orderDetails) {
                let result = await Promise.all([
                    {
                        "ppcData": await ppcService.getPPCData(orderDetails.id, currentUser["id"], currentUser["roleId"]),
                        "toolShopData":
                            currentUser["roleId"] > role.PPC || currentUser["roleId"] == role.Admin ?
                                await toolShopService.getToolShopData(orderDetails.id, currentUser["id"], currentUser["roleId"]) :
                                null,
                        "qaData":
                            currentUser["roleId"] > role.Tool_Shop || currentUser["roleId"] == role.Admin ?
                                await qaService.getQAData(orderDetails.id, currentUser["id"], currentUser["roleId"]) :
                                null,
                        "operatorEntryData":
                            currentUser["roleId"] > role.QA || currentUser["roleId"] == role.Admin ?
                                await operatorEntryService.getOperatorEntryData(orderDetails.id, currentUser["id"], currentUser["roleId"]) :
                                null,
                        "bundlingSupervisorData":
                            currentUser["roleId"] > role.Operator_Entry || currentUser["roleId"] == role.Admin ?
                                await bundlingSupervisorService.getBundlingSupervisorData(orderDetails.id, currentUser["id"], currentUser["roleId"]) :
                                null
                    },
                ]).then((data) => {
                    console.log("data ", JSON.stringify(data.flat()))
                    return data.flat();
                })
                console.log("result ", result);
                return result;
            } else {
                return AppConstants.INVALID_ID;
            }
        } catch (error) {
            console.log("Error_in_viewDetailsList " + error);
            throw error;
        }
    }

    public async roleBasedDataUpdate(input: Object, currentUser: Object, tran) {
        try {
            console.log("into the roleBasedDataUpdate")
            let result;
            switch (currentUser["roleId"]) {
                case role.PPC:
                    console.log("ppc")
                    result = await ppcService.createOrUpdatePpcStatus(input, currentUser, tran);
                    break;
                case role.Tool_Shop:
                    console.log("toolshop")
                    result = await toolShopService.createOrUpdateToolShopData(input, currentUser, tran);
                    break;
                case role.QA:
                    console.log("qa")
                    result = await qaService.createOrUpdateQaData(input, currentUser, tran);
                    break;
                case role.Operator_Entry:
                    console.log("Operator_Entry")
                    result = await operatorEntryService.createOrUpdateOperatorEntryData(input, currentUser, tran);
                    break;
                case role.Bundling_Supervisior:
                    console.log("Bundling_Supervisior")
                    result = await bundlingSupervisorService.createOrUpdatebundlingSupervisorData(input, currentUser, tran);
                    break;

                case role.Admin:    //For Admin
                    console.log("Into the Admin ", currentUser["roleId"])
                    if (input["processStage"] == processStageMeta.ppc)
                        result = await ppcService.createOrUpdatePpcStatus(input, currentUser, tran);
                    else if (input["processStage"] == processStageMeta.toolShop)
                        result = await toolShopService.createOrUpdateToolShopData(input, currentUser, tran);
                    else if (input["processStage"] == processStageMeta.qa)
                        result = await qaService.createOrUpdateQaData(input, currentUser, tran);
                    else if (input["processStage"] == processStageMeta.operatorEntry)
                        result = await operatorEntryService.createOrUpdateOperatorEntryData(input, currentUser, tran);
                    else if (input["processStage"] == processStageMeta.bundlingSupervisor)
                        result = await bundlingSupervisorService.createOrUpdatebundlingSupervisorData(input, currentUser, tran);
                    break;
            }
            return result;
        } catch (error) {
            console.log("Error_in_roleBasedDataUpdate " + error);
            throw error;
        }
    }

    public async excelConversion(query: Object[], type: string, roleId: number) {
        try {
            let result, sheetHeaders;
            let dataArr = [];
            sheetHeaders = ["PO No.", "Customer Name", "Sales Order No.", "Section No.", "Alloy Temper",
                "PO Total Quantity", "Extruded Quantity(kgs)", "Balance PO Quantity(kgs)", "Cut Length",
                "Cut Length Tolerance(mm)", "Quantity Tolerance(%)", "Priority Assignment", "Marketing Remarks",
                "Plant Selected", "Press Allocation", "Planned Quantity(Kgs)",
                "Planned Internal Alloy", "Planned No. of Billet and Billet Length(Inches)",
                "Production Rate Req(Kg/Hr)", "Planned Quenching", "Planned FrontEnd Coring Length(mm)",
                "Planned BackEnd Coring Length(mm)", "Planned Extrusion Length", "Planned Butt Thickness(Inches)",
                "Cut Billets", "Butt Weight Per Inch", "PPC Remarks", "Die", "No. of Cavity", "Bolster Entry",
                "Backer Entry", "Special Backer Entry", "Ring Entry", "Welding Chamber", "Die Setter", "Tool Shop Remarks",
                "QA Remarks", "Die Trail", "Die with Aluminium", "Previous Day Die Continue", "Batch No.", "Actual Internal Alloy",
                "Start Time", "End Time", "Process Time(Hr)", "No. of Billet and Billet Length", "Actual Butt Thickness",
                "Breakthrough Pressure", "Push On Billet Length", "Push Qty(Kgs)", "Actual Production Rate",
                "Butt Weight(Kgs)", "Die Fail", "Die Failure Reason",
                // "Breakdown Start Time", "Breakdown End Time",
                // "Reason For Breakdown", "Responsible Department for Breakdown", 
                "Breakdown",
                "Breakdown Duration",
                "Log End Scrap Length(mm)", "Log End Scrap(Kgs)", "Operator Name", "Operator Entry Remarks", "Finish Quantity(Kgs)",
                "No. of Pcs Per Bundle", "Bundle Weight(Kg)", "No. of Bundles", "Total No. of Pcs", "Correction Qty(Kgs)",
                "Actual FrontEnd Coring Length(mm)", "Actual BackEnd Coring Length(mm)", "Recovery(Calculated)",
                "Bundling Supervisor Remarks"
            ];
            for (let data of query) {
                let obj = {
                    poNo: data["poNo"],
                    customer_name: data["customer_name"],
                    soNo: data["soNo"],
                    sectionNo: data["sectionNo"],
                    alloyTemper: data["alloyTemper"],
                    po_qty: data["po_qty"],
                    extruded_qty: data["extruded_qty"],
                    balance_po_qty: data["balance_po_qty"],
                    cut_len: data["cut_len"],
                    cut_len_tolerance: data["cut_len_tolerance"],
                    qty_tolerance: data["qty_tolerance"],
                    priority: data["priority"],
                    marketing_remarks: data["marketing_remarks"],
                    plantSelected: data["plantSelected"] ? data["plantSelected"].replace(/#/g, '') : data["plantSelected"],
                    pressAllocation: data["pressAllocation"],
                    plannedQty: data["plannedQty"],
                    plannedInternalAlloy: data["plannedInternalAlloy"] ?
                        data["plannedInternalAlloy"].replace(/#/g, '') : data["plannedInternalAlloy"],
                    plannedNoOfBilletAndLength:
                        isArrayPopulated(JSON.parse(data["plannedNoOfBilletAndLength"])) ?
                            await operatorEntryService.concatBilletAndLength(
                                JSON.parse(data["plannedNoOfBilletAndLength"])) : null,
                    productionRateRequired: data["productionRateRequired"],
                    plannedQuenching: data["plannedQuenching"],
                    frontEndCoringLength: data["frontEndCoringLength"],
                    backEndCoringLength: data["backEndCoringLength"],
                    plantExtrusionLength: data["plantExtrusionLength"],
                    plannedButtThickness: data["plannedButtThickness"],
                    cutBillets: data["cutBillets"],
                    buttWeightPerInch: data["buttWeightPerInch"],
                    ppcRemarks: data["ppcRemarks"] ? data["ppcRemarks"].replace(/#/g, '') : data["ppcRemarks"],
                    die: data["die"] ? data["die"].replace(/#/g, '') : data["die"],
                    noOfCavity: data["noOfCavity"],
                    bolsterEntry: data["bolsterEntry"] ? data["bolsterEntry"].replace(/#/g, '') : data["bolsterEntry"],
                    backerEntry: data["backerEntry"] ? data["backerEntry"].replace(/#/g, '') : data["backerEntry"],
                    specialBackerEntry: data["specialBackerEntry"] ?
                        data["specialBackerEntry"].replace(/#/g, '') : data["specialBackerEntry"],
                    ringEntry: data["ringEntry"] ? data["ringEntry"].replace(/#/g, '') : data["ringEntry"],
                    weldingChamber: data["weldingChamber"] ? data["weldingChamber"].replace(/#/g, '') : data["weldingChamber"],
                    dieSetter: data["dieSetter"] ? data["dieSetter"].replace(/#/g, '') : data["dieSetter"],
                    toolShopRemarks: data["toolShopRemarks"] ? data["toolShopRemarks"].replace(/#/g, '') : data["toolShopRemarks"],
                    qaRemarks: data["qaRemarks"] ? data["qaRemarks"].replace(/#/g, '') : data["qaRemarks"],
                    dieTrial: data["dieTrail"],
                    dieWithAluminium: data["dieWithAluminium"],
                    previousDayDie_continue: data["previousDayDie_continue"],
                    batchNo: data["batchNo"],
                    actualInternalAlloy: data["actualInternalAlloy"] ?
                        data["actualInternalAlloy"].replace(/#/g, '') : data["actualInternalAlloy"],
                    startTime: data["startTime"],
                    endTime: data["endTime"],
                    processTime: data["processTime"],
                    noOfBilletAndLength:
                        isArrayPopulated(JSON.parse(data["noOfBilletAndLength"])) ?
                            await operatorEntryService.concatBilletAndLength(
                                JSON.parse(data["noOfBilletAndLength"])) : null,
                    actualButtThickness: data["actualButtThickness"],
                    breakThroughPressure: data["breakThroughPressure"],
                    pushOnBilletLength: data["pushOnBilletLength"],
                    pushQtyInKgs: data["pushQtyInKgs"],
                    actualProductionRate: data["actualProductionRate"],
                    buttWeightInKgs: data["buttWeightInKgs"],
                    diefail: data["diefail"],
                    dieFailureReason: data["dieFailureReason"] ? data["dieFailureReason"].replace(/#/g, '') : data["dieFailureReason"],
                    breakDown:
                        isArrayPopulated(JSON.parse(data["breakDown"])) ?
                            await operatorEntryService.concatBreakDown(JSON.parse(data["breakDown"])) : null,
                    breakDownDuration: data["breakDownDuration"],
                    logEndScrapLengthInMm: data["logEndScrapLengthInMm"],
                    logEndScrapInKgs: data["logEndScrapInKgs"],
                    operatorName: data["operatorName"] ? data["operatorName"].replace(/#/g, '') : data["operatorName"],
                    operatorEntryRemarks: data["operatorEntryRemarks"] ?
                        data["operatorEntryRemarks"].replace(/#/g, '') : data["operatorEntryRemarks"],
                    finishQuantity: data["finishQuantity"],
                    piecesPerBundle: data["piecesPerBundle"],
                    bundleWeight: data["bundleWeight"],
                    noOfBundles: data["noOfBundles"],
                    totalNoOfPieces: data["totalNoOfPieces"],
                    correctionQty: data["correctionQty"],
                    actualFrontEndCoringLength: data["actualFrontEndCoringLength"],
                    actualBackEndCoringLength: data["actualBackEndCoringLength"],
                    recovery: data["recovery"],
                    bundlingSupervisorRemarks: data["bundlingSupervisorRemarks"] ?
                        data["bundlingSupervisorRemarks"].replace(/#/g, '') : data["bundlingSupervisorRemarks"]
                }
                // if (roleId != role.Admin) delete obj.processStage
                // if (type != AppConstants.COMPLETED) delete obj.completedDate
                dataArr.push(obj);
            }
            result = await this.getExcelBinaryString(dataArr, sheetHeaders);
            return result;
        } catch (error) {
            console.log("Error_in_excelConversion " + error);
            throw error;
        }
    }

    public async getRoleNameById(roleId: number) {
        try {
            let title;
            switch (roleId) {
                case role.PPC:
                    title = AppConstants.PPC;
                    break;
                case role.Tool_Shop:
                    title = AppConstants.TOOLSHOP;
                    break;
                case role.QA:
                    title = AppConstants.QA;
                    break;
                case role.Operator_Entry:
                    title = AppConstants.OPERATOR_ENTRY;
                    break;
                case role.Bundling_Supervisior:
                    title = AppConstants.BUNDLING_SUPERVISOR;
                    break;
                default:
                    title = AppConstants.ADMIN;
                    break;
            }
            return title;
        } catch (error) {
            console.log("Error_in_getRoleNameById " + error);
            throw error;
        }
    }

    public async getPdfHeaders() {
        let headers = [
            { "label": "Section No", "property": "sectionNo", "width": 70 },
            { "label": "PO No", "property": "orderNo", "width": 50 },
            { "label": "SO No", "property": "soNo", "width": 50 },
            { "label": "Date", "property": "orderDate", "width": 70 },
            { "label": "Customer Name", "property": "customerName", "width": 100 },
            { "label": "Order Qty", "property": "orderQty", "width": 60 },
            { "label": "Alloy Temper", "property": "alloyTemper", "width": 80 },
            { "label": "Cut Length", "property": "cutLength", "width": 60 },
            { "label": "Priority", "property": "priority", "width": 60 },
            { "label": "Process Stage", "property": "processStage", "width": 90 },
            { "label": "Completed Date", "property": "completedDate", "width": 70 },
            { "label": "Alloy", "property": "alloy", "width": 60 },
            { "label": "Quenching", "property": "quenching", "width": 100 },
            { "label": "Production Rate", "property": "productionRate", "width": 100 },
            { "label": "Billet Length", "property": "billetLength", "width": 100 },
            { "label": "No Of Billet", "property": "noOfBillet", "width": 100 },
            { "label": "Pieces Per Billet", "property": "piecesPerBillet", "width": 100 },
            { "label": "Butt Thickness", "property": "buttThickness", "width": 100 },
            { "label": "Extrusion Length", "property": "extrusionLength", "width": 100 },
            { "label": "Coring/Piping Length(Front End)", "property": "coringOrPipingLength_frontEnd", "width": 100 },
            { "label": "Coring/Piping Length(Back End)", "property": "coringOrPipingLength_backEnd", "width": 100 },
            { "label": "Press Entry", "property": "pressEntry", "width": 100 },
            { "label": "Plant", "property": "plantRefId", "width": 100 },
            { "label": "PPC Remarks", "property": "ppcRemarks", "width": 100 },
            { "label": "die", "property": "dieRefId", "width": 100 },
            { "label": "No Of Cavity", "property": "noOfCavity", "width": 100 },
            { "label": "Bolster Entry", "property": "bolsterEntry", "width": 100 },
            { "label": "Backer Entry", "property": "backerEntry", "width": 100 },
            { "label": "Special Backer Entry", "property": "specialBackerEntry", "width": 100 },
            { "label": "Ring Entry", "property": "ringEntry", "width": 100 },
            { "label": "Die Setter", "property": "dieSetter", "width": 100 },
            { "label": "Welding Chamber", "property": "weldingChamber", "width": 100 },
            { "label": "Tool Shop Remarks", "property": "toolShopRemarks", "width": 100 },
            { "label": "QA Remarks", "property": "qaRemarks", "width": 100 },
            { "label": "Batch No", "property": "batchNo", "width": 100 },
            { "label": "Butt Weight", "property": "buttWeight", "width": 100 },
            { "label": "Push On Billet Length", "property": "pushOnBilletLength", "width": 100 },
            { "label": "Approx Push Qty", "property": "approxPushQty", "width": 100 },
            { "label": "Start Time", "property": "startTime", "width": 100 },
            { "label": "End Time", "property": "endTime", "width": 100 },
            { "label": "Process Time", "property": "processTime", "width": 100 },
            { "label": "Production Rate Actual", "property": "productionRateActual", "width": 100 },
            { "label": "Die With Aluminium", "property": "dieWithAluminium", "width": 100 },
            { "label": "Die Failed", "property": "diefailed", "width": 100 },
            { "label": "Die Failure Reason", "property": "dieFailureReason", "width": 100 },
            { "label": "BreakDown Start Time", "property": "breakDownStartTime", "width": 100 },
            { "label": "BreakDown End Time", "property": "breakDownEndTime", "width": 100 },
            { "label": "Reason For BreakDown", "property": "reasonForBreakDown", "width": 100 },
            { "label": "Time Taken BreakDown", "property": "timeTakenBreakDown", "width": 100 },
            { "label": "Previous Day Die Continue", "property": "previousDayDieContinue", "width": 100 },
            { "label": "Name Of Operator", "property": "nameOfOperator", "width": 100 },
            { "label": "Operator Entry Remarks", "property": "operatorEntryRemarks", "width": 100 },
            { "label": "Finish Quantity", "property": "finishQuantity", "width": 100 },
            { "label": "Pieces Per Bundle", "property": "piecesPerBundle", "width": 100 },
            { "label": "Bundle Weight", "property": "bundleWeight", "width": 100 },
            { "label": "No Of Bundles", "property": "noOfBundles", "width": 100 },
            { "label": "Correction Qty", "property": "correctionQty", "width": 100 },
            { "label": "Total No Of Pieces", "property": "totalNoOfPieces", "width": 100 },
            { "label": "Total Finish Qty", "property": "totalFinishQty", "width": 100 },
            { "label": "Recovery", "property": "recovery", "width": 100 },
            { "label": "LogEnd Cut Sharp (Inch)", "property": "logEndCutSharpInch", "width": 100 },
            { "label": "LogEnd Cut Sharp (Weight)", "property": "logEndCutSharpWeight", "width": 100 },
            { "label": "Bundling Supervisor Remarks", "property": "bundlingSupervisorRemarks", "width": 100 }
        ];
        return headers;
    }

    public async reassignOrderIdWorkFlow(input: Object, currentUser: Object, tran) {
        try {
            console.log("into the orderService")
            let orderData = await this.findUniqueKey(db.tbl_order, input["orderId"])
            if (orderData) {
                let currentWorkFlowId = input["workFlowId"]
                let roleId = currentUser["roleId"];
                let query = (
                    (roleId == role.Tool_Shop || (roleId == role.Admin && input["processStage"] == processStageMeta.toolShop)) ?
                        // await this.toolShopRemarksupdate(input, userId, roleId) :
                        await toolShopService.createOrUpdateToolShopData(input, currentUser, tran) :
                        (roleId == role.QA || (roleId == role.Admin && input["processStage"] == processStageMeta.qa)) ?
                            await this.qaRemarksupdate(input, orderData.id, currentUser["id"], roleId, tran) :
                            (roleId == role.Operator_Entry || (roleId == role.Admin && input["processStage"] == processStageMeta.operatorEntry)) ?
                                // await this.operatorEntryRemarksupdate(input, userId, roleId) :
                                await operatorEntryService.createOrUpdateOperatorEntryData(input, currentUser, tran) :
                                (roleId == role.Bundling_Supervisior || (roleId == role.Admin && input["processStage"] == processStageMeta.bundlingSupervisor)) ?
                                    // await this.bundlingSupervisorRemarksupdate(input, userId, roleId) : ""
                                    await bundlingSupervisorService.createOrUpdatebundlingSupervisorData(input, currentUser, tran) : ""
                );
                let newWorkFlowId = input["type"] == AppConstants.HOLD ? currentWorkFlowId - AppConstants.FIVE :
                    input["type"] == AppConstants.INPROGRESS ? currentWorkFlowId - AppConstants.FOUR : "";
                // console.log("newWorkFlowId", newWorkFlowId)
                let orderObj = new db.tbl_order();
                orderObj.id = orderData.id;
                orderObj.workFlowId = newWorkFlowId;
                orderObj.isReassigned = AppConstants.ONE;
                orderObj.reassignedOn = new Date(new Date().toUTCString());
                if (roleId == AppConstants.ONE) {
                    orderObj.updatedAdminId = currentUser["id"];
                    orderObj.adminUpdatedOn = new Date(new Date().toUTCString());
                } else {
                    orderObj.updatedBy = currentUser["id"];
                    orderObj.updatedOn = new Date(new Date().toUTCString());
                }
                let result = await this.createOrUpdateByModel(db.tbl_order, orderObj, tran)
                if (query && result) {
                    return AppConstants.UPDATED_SUCCESSFULLY
                } else {
                    return AppConstants.PROBLEM_WHILE_UPDATING
                }
            } else {
                return AppConstants.INVALID_REQUEST_BODY
            }
        } catch (error) {
            console.log("Error_in_reassignOrderIdWorkFlow " + error);
            throw error;
        }
    }

    public async toolShopRemarksupdate(input: Object, userId: number, roleId: number, tran) {
        try {
            // console.log("into the toolshop service")
            let toolShopData = await this.findUniqueKey(db.tbl_toolShop, input["uniqueKey"])
            let toolShopRemarksObj, result;
            if (toolShopData) {
                toolShopRemarksObj = new db.tbl_toolShop();
                toolShopRemarksObj.id = toolShopData.id;
                toolShopRemarksObj.remarks = input["remarks"];
                if (roleId == AppConstants.ONE) {
                    toolShopRemarksObj.updatedAdminId = userId;
                    toolShopRemarksObj.adminUpdatedOn = new Date(new Date().toUTCString());
                } else {
                    toolShopRemarksObj.updatedBy = userId;
                    toolShopRemarksObj.updatedOn = new Date(new Date().toUTCString());
                }
                result = await this.createOrUpdateByModel(db.tbl_toolShop, toolShopRemarksObj, tran)
                return result;
            }
        } catch (error) {
            console.log("Error_in_toolShopRemarksupdate" + error);
            throw error;
        }
    }

    public async qaRemarksupdate(input: Object, orderId: number, userId: number, roleId: number, tran) {
        try {
            // console.log("into the qaRemarksupdate")
            let qaData = input["uniqueKey"] != "" ? await this.findUniqueKey(db.tbl_qa, input["uniqueKey"]) : undefined;
            let qaObj, result;
            qaObj = new db.tbl_qa();
            qaObj.remarks = input["remarks"];
            qaObj.orderId = orderId;
            qaObj.isDeleted = AppConstants.ZERO;
            if (roleId == AppConstants.ONE) {
                qaObj.updatedAdminId = userId;
                qaObj.adminUpdatedOn = new Date(new Date().toUTCString());
            }
            if (qaData) {
                qaObj.id = qaData.id;
                qaObj.uniqueKey = qaData.uniqueKey;
                qaObj.updatedBy = userId;
                qaObj.updatedOn = new Date(new Date().toUTCString());
            } else {
                qaObj.uniqueKey = uuidv4();
                qaObj.createdBy = userId;
                qaObj.createdOn = new Date(new Date().toUTCString());
            }
            result = await this.createOrUpdateByModel(db.tbl_qa, qaObj, tran)

            // if (input['plannedQuenching'] || input['plannedInternalAlloy'] ||
            //     (input['frontEndCoringLength'] >= AppConstants.ZERO && input['frontEndCoringLength'] != null)
            //     || (input['backEndCoringLength'] >= AppConstants.ZERO && input['backEndCoringLength'] != null)) {
            let result1 = await qaService.updatePpcData(input, orderId, userId, roleId, tran)
            // }
            // if ((input['cut_len_tolerance_upper'] >= AppConstants.ZERO && input['cut_len_tolerance_upper'] != null) ||
            //     (input['cut_len_tolerance_lower'] >= AppConstants.ZERO && input['cut_len_tolerance_lower'] != null)) {
            let result2 = await this.updateOrderDatas(input, orderId, userId, roleId, tran)
            // }
            return result;
        } catch (error) {
            console.log("Error_in_qaRemarksupdate" + error);
            throw error;
        }
    }

    public async operatorEntryRemarksupdate(input: Object, userId: number, roleId: number, tran) {
        try {
            // console.log("into the operatorEntryRemarksupdate")
            let operatorEntryData = await this.findUniqueKey(db.tbl_operatorEntry, input["uniqueKey"]);
            let operatorEntryObj, result;
            if (operatorEntryData) {
                operatorEntryObj = new db.tbl_operatorEntry();
                operatorEntryObj.id = operatorEntryData.id;
                operatorEntryObj.remarks = input["remarks"];
                if (roleId == AppConstants.ONE) {
                    operatorEntryObj.updatedAdminId = userId;
                    operatorEntryObj.adminUpdatedOn = new Date(new Date().toUTCString());
                } else {
                    operatorEntryObj.updatedBy = userId;
                    operatorEntryObj.updatedOn = new Date(new Date().toUTCString());
                }
                result = await this.createOrUpdateByModel(db.tbl_operatorEntry, operatorEntryObj, tran)
            }

            return result;
        } catch (error) {
            console.log("Error_in_qaRemarksupdate" + error);
            throw error;
        }
    }

    public async bundlingSupervisorRemarksupdate(input: Object, userId: number, roleId: number, tran) {
        try {
            // console.log("into the bundlingSupervisorRemarksupdate")
            let bundlingSupervisorData = await this.findUniqueKey(db.tbl_bundlingSupervisor, input["uniqueKey"]);
            let bundlingSupervisorReassignObj, result
            if (bundlingSupervisorData) {
                bundlingSupervisorReassignObj = new db.tbl_bundlingSupervisor();
                bundlingSupervisorReassignObj.id = bundlingSupervisorData.id;
                bundlingSupervisorReassignObj.remarks = input["remarks"];
                if (roleId == AppConstants.ONE) {
                    bundlingSupervisorReassignObj.adminUpdatedOn = new Date(new Date().toUTCString())
                    bundlingSupervisorReassignObj.updatedAdminId = userId;
                }
                else {
                    bundlingSupervisorReassignObj.updatedBy = userId;
                    bundlingSupervisorReassignObj.updatedOn = new Date(new Date().toUTCString())
                }
                // console.log("bundlingSupervisorReassignObj", bundlingSupervisorReassignObj)
                result = await this.createOrUpdateByModel(db.tbl_bundlingSupervisor, bundlingSupervisorReassignObj, tran)
            }
            return result;
        } catch (error) {
            console.log("Error_in_bundlingSupervisorRemarksupdate" + error);
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

    public async getLastSyncDate() {
        try {
            console.log("into the getLastSyncDate")
            let orderData = await db.tbl_order.findOne({
                attributes: ["createdOn"],
                model: db.tbl_order,
                order: [
                    ['createdOn', 'DESC']
                ],
                raw: true
            });
            console.log("orderData ", orderData)
            // let { createdOn = orderData // && await this.splitDataValuesFromData(orderData) ;
            return orderData ? orderData.createdOn : null;
        } catch (error) {
            console.log("Error in getLastSyncDate" + error);
            throw error;
        }
    }

    public async getReportDataObj(input: Object) {
        try {
            let status = `
                (case 
                    when (workFlowId < ${workFlow.Queued_for_Tool_Shop}) then 'PPC Data In-Progress'
                    when (workFlowId >= ${workFlow.Queued_for_Tool_Shop} and workFlowId < ${workFlow.Queued_for_QA}) then 'PPC Data Completed'
                    when (workFlowId >= ${workFlow.Queued_for_QA} and workFlowId < ${workFlow.Queued_for_Operator_Entry}) then 'Tool Shop Data Completed'
                    when (workFlowId >= ${workFlow.Queued_for_Operator_Entry} and workFlowId < ${workFlow.Queued_for_Bundling_Supervisior}) then 'QA Entry Completed'
                    when (workFlowId >= ${workFlow.Queued_for_Bundling_Supervisior} and workFlowId < ${workFlow.Bundling_Supervisior_Completed}) then 'Operator Entry Completed'
                    else 'Bundling Supervisor Completed'
                end)
            `;
            let weightage = `
                (case 
                    when (workFlowId < ${workFlow.Queued_for_Tool_Shop}) then ${AppConstants.ZERO}
                    when (workFlowId >= ${workFlow.Queued_for_Tool_Shop} and workFlowId < ${workFlow.Queued_for_QA}) then ${AppConstants.TWENTY}
                    when (workFlowId >= ${workFlow.Queued_for_QA} and workFlowId < ${workFlow.Queued_for_Operator_Entry}) then ${AppConstants.FOURTY}
                    when (workFlowId >= ${workFlow.Queued_for_Operator_Entry} and workFlowId < ${workFlow.Queued_for_Bundling_Supervisior}) then ${AppConstants.SIXTY}
                    when (workFlowId >= ${workFlow.Queued_for_Bundling_Supervisior} and workFlowId < ${workFlow.Bundling_Supervisior_Completed}) then ${AppConstants.EIGHTY}
                    else ${AppConstants.HUNDRED}
                end)
            `;
            let dataObj = {
                attributes: [
                    Sequelize.literal(`distinct([tbl_order].id)`),
                    ["uniqueKey", 'orderId'],
                    ["po", "poNo"], "customer_name",
                    [Sequelize.literal(`${status}`), 'status'],
                    [Sequelize.literal(`${weightage}`), 'weightage'],
                    ["so", "soNo"],
                    [Sequelize.literal(`right(material_code,7)`), "sectionNo"],
                    ["temper", "alloyTemper"],
                    "po_qty", "extruded_qty",
                    "balance_po_qty",
                    [Sequelize.literal(`
                            (case when cut_len_tolerance_lower >= 0 or cut_len_tolerance_upper >= 0 
                                then concat(cut_len_tolerance_lower,', ',cut_len_tolerance_upper)
                                else null 
                            end)`),
                        "cut_len_tolerance"],
                    [Sequelize.literal(`
                            (case when isnull(qty_tolerance_min, 0) <> 0 or isnull(qty_tolerance_max,0) <> 0 
                                then concat(isnull(qty_tolerance_min, 0),', ',isnull(qty_tolerance_max,0))
                                else null 
                            end)`),
                        "qty_tolerance"],
                    "marketing_remarks",
                    "cut_len",
                    // "priorityRefId",
                    [Sequelize.literal(`
                            (select tr.name
                            from ${AppConstants.DB_JINDAL}.dbo.${AppConstants.TBL_REFERENCE} tr
                            where tr.isDeleted = 0 and tr.referenceGroupId = 4
                                and tr.id = priorityRefId)
                            `),
                        "priority"],
                    // [Sequelize.literal(`${processStage}`), 'processStage'],
                    "workFlowId",
                    "isReassigned",
                    "[updatedOn]", "[reassignedOn]",
                    "po_release_dt"
                ],
                distinct: true,
                model: db.tbl_order,
                where: {
                    isActive: AppConstants.ONE,
                    isDeleted: AppConstants.ZERO,
                    workflowId: {
                        [Op.in]: input["fstatusOrWeightage"] >= AppConstants.ZERO ? await this.getStatusWeightageFilter(input["fstatusOrWeightage"]) : AppConstants.ZERO
                    },
                    planned_press: Sequelize.literal(`
                        ([tbl_order].[planned_press] LIKE N'%${input["fpress"]}%')
                    `),
                    po: Sequelize.literal(`
                        ([tbl_order].[po] LIKE N'%${input["fpo"]}%')
                    `),
                    customer_name: Sequelize.literal(`
                        ([tbl_order].[customer_name] LIKE N'%${input["fcustomer_name"]}%')
                    `),
                    so: Sequelize.literal(`
                        ([tbl_order].[so] LIKE N'%${input["fso"]}%')
                    `),
                    material_code: Sequelize.literal(`
                        (right([tbl_order].material_code,7) LIKE N'%${input["fsectionNo"]}%')
                    `),
                    temper: Sequelize.literal(`
                        ([tbl_order].[temper] LIKE N'%${input["fAlloyTemper"]}%')
                    `),
                    po_qty: Sequelize.literal(`
                        ([tbl_order].[po_qty] LIKE N'%${input["fpo_qty"]}%')
                    `),
                    extruded_qty: Sequelize.literal(`
                        (isnull([tbl_order].[extruded_qty],'') LIKE N'%${input["fextruded_qty"]}%' )
                    `),
                    balance_po_qty: Sequelize.literal(`
                        (isnull([tbl_order].[balance_po_qty],'') LIKE N'%${input["fbalance_po_qty"]}%' )
                    `),
                    marketing_remarks: Sequelize.literal(`
                        (isnull([tbl_order].[marketing_remarks],'') LIKE N'%${input["fmarketing_remarks"]}%' )
                    `),
                    cut_len: Sequelize.literal(`
                        (isnull([tbl_order].[cut_len],'') LIKE N'%${input["fcut_len"]}%')
                    `),
                    priorityRefId: Sequelize.literal(`
                        ([tbl_order].[priorityRefId] LIKE N'%${input["fPriority"]}%')
                    `),
                    ...(await ppcService.getPPCFilter(input)),
                    ...(await toolShopService.getToolShopFilter(input)),
                    ...(await qaService.getQAFilter(input)),
                    ...(await operatorEntryService.getOperatorEntryFilter(input)),
                    ...(await bundlingSupervisorService.getBundlingSupervisorFilter(input)),
                },
                order: [
                    ['po_release_dt', 'DESC']
                ],
                required: true,
                raw: true
            }
            dataObj["include"] = [
                await ppcService.getPPCIncludes(),
                await toolShopService.getToolShopIncludes(),
                await qaService.getQAIncludes(),
                await operatorEntryService.getOperatorEntryIncludes(),
                await bundlingSupervisorService.getBundlingSupervisorIncludes()
            ];
            if (input["ffromDate"] && input["ffromDate"] != '' && input["ftoDate"] && input["ftoDate"] != '') {
                dataObj.where['[Op.and]'] = Sequelize.literal(`
                    ([tbl_order].[po_release_dt] between N'${input["ffromDate"]}' AND N'${input["ftoDate"]}')
                `)
            }
            if (!(input["fstatusOrWeightage"] >= AppConstants.ZERO)) {
                delete dataObj.where.workflowId
            }
            dataObj.attributes = [
                ...dataObj.attributes,
                ...(await ppcService.getPPCAttributes(input["exportType"])),
                ...(await toolShopService.getToolShopAttributes(input["exportType"])),
                ...(await qaService.getQAAttributes(input["exportType"])),
                ...(await operatorEntryService.getOperatorEntryAttributes(input["exportType"])),
                ...(await bundlingSupervisorService.getBundlingSupervisorAttributes(input["exportType"]))
            ];
            if (input["paging"].limit > AppConstants.ZERO) {
                dataObj["limit"] = input["paging"].limit;
                dataObj["offset"] = input["paging"].offset;
            }
            return dataObj;
        } catch (error) {
            console.log("Error in getReportDataObj" + error);
            throw error;
        }
    }

    public async getReportList(input: Object) {
        try {
            let query = await db.tbl_order.findAndCountAll(await this.getReportDataObj(input));
            // console.log("query ", query);
            let result;
            if (isArrayPopulated(query.rows)) {
                let pagination = await paginationData(query.count, input["paging"].limit, input["paging"].offset);
                result = {
                    page: pagination,
                    orderData: removeKeyfromJson(query.rows, 'id')
                }
            }
            return result;
        } catch (error) {
            console.log("Error in getReportList " + error);
            throw error;
        }
    }

    public async getDashboardDownloadList(input: Object, columns: Array<any>) {
        try {
            let dataObj = {
                attributes:
                    [Sequelize.literal(`${columns}`)],
                distinct: true,
                model: db.tbl_order,
                where: {
                    isActive: AppConstants.ONE,
                    isDeleted: AppConstants.ZERO,
                    workflowId: {
                        [Op.in]: input["fstatusOrWeightage"] >= AppConstants.ZERO ? await this.getStatusWeightageFilter(input["fstatusOrWeightage"]) : AppConstants.ZERO
                    },
                    // planned_press: Sequelize.literal(`
                    //     ([tbl_order].[planned_press] LIKE N'%${input["fpress"]}%')
                    // `),
                    po: Sequelize.literal(`
                        ([tbl_order].[po] LIKE N'%${input["fpo"]}%')
                    `),
                    customer_name: Sequelize.literal(`
                        ([tbl_order].[customer_name] LIKE N'%${input["fcustomer_name"]}%')
                    `),
                    so: Sequelize.literal(`
                        ([tbl_order].[so] LIKE N'%${input["fso"]}%')
                    `),
                    material_code: Sequelize.literal(`
                        (right([tbl_order].material_code,7) LIKE N'%${input["fsectionNo"]}%')
                    `),
                    temper: Sequelize.literal(`
                        ([tbl_order].[temper] LIKE N'%${input["fAlloyTemper"]}%')
                    `),
                    po_qty: Sequelize.literal(`
                        ([tbl_order].[po_qty] LIKE N'%${input["fpo_qty"]}%')
                    `),
                    extruded_qty: Sequelize.literal(`
                        (isnull([tbl_order].[extruded_qty],'') LIKE N'%${input["fextruded_qty"]}%' )
                    `),
                    balance_po_qty: Sequelize.literal(`
                        (isnull([tbl_order].[balance_po_qty],'') LIKE N'%${input["fbalance_po_qty"]}%' )
                    `),
                    marketing_remarks: Sequelize.literal(`
                        (isnull([tbl_order].[marketing_remarks],'') LIKE N'%${input["fmarketing_remarks"]}%' )
                    `),
                    cut_len: Sequelize.literal(`
                        (isnull([tbl_order].[cut_len],'') LIKE N'%${input["fcut_len"]}%')
                    `),
                    priorityRefId: Sequelize.literal(`
                        ([tbl_order].[priorityRefId] LIKE N'%${input["fPriority"]}%')
                    `),
                    ...(await ppcService.getPPCFilter(input)),
                    ...(await toolShopService.getToolShopFilter(input)),
                    ...(await qaService.getQAFilter(input)),
                    ...(await operatorEntryService.getOperatorEntryFilter(input)),
                    ...(await bundlingSupervisorService.getBundlingSupervisorFilter(input)),
                },
                required: true,
                raw: true
            }
            dataObj["include"] = [
                await ppcService.getPPCIncludes(),
                await toolShopService.getToolShopIncludes(),
                await qaService.getQAIncludes(),
                await operatorEntryService.getOperatorEntryIncludes(),
                await bundlingSupervisorService.getBundlingSupervisorIncludes()
            ];
            if (input["ffromDate"] && input["ffromDate"] != '' && input["ftoDate"] && input["ftoDate"] != '') {
                dataObj.where['[Op.and]'] = Sequelize.literal(`
                    ([tbl_order].[po_release_dt] between N'${input["ffromDate"]}' AND N'${input["ftoDate"]}')
                `)
            }
            if (!(input["fstatusOrWeightage"] >= AppConstants.ZERO)) {
                delete dataObj.where.workflowId
            }
            let query = await db.tbl_order.findAll(dataObj);
            console.log("query ", query)
            return query;
        } catch (error) {
            console.log("Error in getDashboardDownloadList " + error);
            throw error;
        }
    }

    public async excelConversionForDashboard(query: Object[], headers: Array<any>, dataHeaders: Array<any>) {
        try {
            let result, sheetHeaders;
            // let dataArr = [];
            let dataArr = await this.getDownloadJsonFormation(query, dataHeaders);
            // sheetHeaders = headers;
            sheetHeaders = isArrayPopulated(Object.keys(dataArr[0])) ? Object.keys(dataArr[0]) : sheetHeaders;
            // console.log("sheetHeaders ", sheetHeaders, Object.keys(dataArr[0]))
            console.log("dataArr ", dataArr)
            result = await this.getExcelBinaryString(dataArr, sheetHeaders);
            return result;
        } catch (error) {
            console.log("Error_in_excelConversion " + error);
            throw error;
        }
    }

    public async getAdminUpdate_WorkFlowId(input: Object) {
        try {
            console.log("into the getAdminUpdate_WorkFlowId ", input)
            let workFlowId;
            switch (input["roleData"]["processStage"]) {
                case processStageMeta.ppc:
                    if (input["type"] == AppConstants.HOLD) {
                        workFlowId = workFlow.PPC_Hold
                    }
                    if (input["type"] == AppConstants.COMPLETED) {
                        workFlowId = workFlow.Queued_for_Tool_Shop
                    }
                    break;
                case processStageMeta.toolShop:
                    if (input["type"] == AppConstants.HOLD) {
                        workFlowId = workFlow.Tool_Shop_Hold
                    }
                    if (input["type"] == AppConstants.COMPLETED) {
                        workFlowId = workFlow.Queued_for_QA
                    }
                    break;
                case processStageMeta.qa:
                    if (input["type"] == AppConstants.HOLD) {
                        workFlowId = workFlow.QA_Hold
                    }
                    if (input["type"] == AppConstants.COMPLETED) {
                        workFlowId = workFlow.Queued_for_Operator_Entry
                    }
                    break;
                case processStageMeta.operatorEntry:
                    if (input["type"] == AppConstants.HOLD) {
                        workFlowId = workFlow.Operator_Entry_Hold
                    }
                    if (input["type"] == AppConstants.COMPLETED) {
                        workFlowId = workFlow.Queued_for_Bundling_Supervisior
                    }
                    break;
                case processStageMeta.bundlingSupervisor:
                    if (input["type"] == AppConstants.HOLD) {
                        workFlowId = workFlow.Bundling_Supervisior_Hold
                    }
                    if (input["type"] == AppConstants.COMPLETED) {
                        workFlowId = workFlow.Bundling_Supervisior_Completed
                    }
                    break;
            }
            console.log("workflowid in getAdminUpdate_WorkFlowId ", workFlowId)
            return workFlowId;
        } catch (error) {
            console.log("Error_in_getAdminUpdate_WorkFlowId " + error);
            throw error;
        }
    }

    public async getStatusWeightageFilter(input: number) {
        try {
            let workFlowId = [];
            switch (input) {
                case AppConstants.TWENTY:
                    workFlowId.push(workFlow.Queued_for_Tool_Shop, workFlow.Tool_Shop_Inprogress, workFlow.Tool_Shop_Hold)
                    // workFlowId = [...workFlow.Queued_for_Tool_Shop]
                    break;
                case AppConstants.FOURTY:
                    workFlowId.push(workFlow.Queued_for_QA, workFlow.QA_Inprogress, workFlow.QA_Hold)
                    break;
                case AppConstants.SIXTY:
                    workFlowId.push(workFlow.Queued_for_Operator_Entry, workFlow.Operator_Entry_Inprogress, workFlow.Operator_Entry_Hold)
                    break;
                case AppConstants.EIGHTY:
                    workFlowId.push(workFlow.Queued_for_Bundling_Supervisior, workFlow.Bundling_Supervisior_Inprogress, workFlow.Bundling_Supervisior_Hold)
                    break;
                case AppConstants.HUNDRED:
                    workFlowId.push(workFlow.Bundling_Supervisior_Completed)
                    break;
                default:
                    workFlowId.push(workFlow.Pending, workFlow.PPC_Inprogress, workFlow.PPC_Hold)
                    break;
            }
            return workFlowId;
        } catch (error) {
            console.log("Error_in_getStatusWeightageFilter " + error);
            throw error;
        }
    }

    public async getDownloadJsonFormation(query: Object[], dataHeaders: Array<any>) {
        try {
            let dataArr = [];
            for (let data of query) {
                let obj = {}
                for (let data2 of dataHeaders) {
                    if (data2.columnName == 'plannedNoOfBilletAndLength' || data2.columnName == 'noOfBilletAndLength') {
                        obj[data2.name] = isArrayPopulated(JSON.parse(data[data2.alias != '' ? data2.alias : data2.columnName])) ?
                            await operatorEntryService.concatBilletAndLength(
                                JSON.parse(data[data2.alias != '' ? data2.alias : data2.columnName])) : null
                    } else if (data2.columnName == 'breakDown') {
                        obj[data2.name] = isArrayPopulated(JSON.parse(data[data2.alias != '' ? data2.alias : data2.columnName])) ?
                            await operatorEntryService.concatBreakDown(JSON.parse(data[data2.alias != '' ? data2.alias : data2.columnName])) : null
                    } else {
                        obj[data2.name] = data[data2.alias != '' ? data2.alias : data2.columnName]
                    }
                }
                dataArr.push(obj);
            }
            return dataArr;
        } catch (error) {
            console.log("Error_in_getDownloadJsonFormation " + error);
            throw error;
        }
    }

    public async getExcelBinaryString(dataArr: Array<any>, sheetHeaders: Array<any>) {
        try {
            let result = (async (dataArr) => {
                const XLSX = require('xlsx');
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet(dataArr, { "defval": "", raw: false, blankrows: false });
                await XLSX.utils.sheet_add_aoa(worksheet, [sheetHeaders],
                    { origin: "A1", headers: true });
                await XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
                let dataString = await XLSX.write(workbook, { bookType: "xlsx", type: "base64" });
                console.log("Excel Data::" + " " + dataString);
                return dataString;
            })(dataArr);
            return result;
        } catch (error) {
            console.log("Error_in_getExcelBinaryString " + error);
            throw error;
        }
    }

    public async getValidationIncludes(roleId: number, requiredCondition: boolean, isDownload: number) {
        try {
            if (roleId == role.Admin || roleId == role.Bundling_Supervisior || isDownload) {
                if (!requiredCondition)
                    return [
                        { ...await ppcService.getPPCIncludes(), required: requiredCondition },
                        { ...await toolShopService.getToolShopIncludes(), required: requiredCondition },
                        { ...await qaService.getQAIncludes(), required: requiredCondition },
                        { ...await operatorEntryService.getOperatorEntryIncludes(), required: requiredCondition },
                        { ...await bundlingSupervisorService.getBundlingSupervisorIncludes(), required: requiredCondition },
                    ];
                else
                    return [
                        { ...await ppcService.getPPCIncludes(), required: requiredCondition },
                        { ...await toolShopService.getToolShopIncludes(), required: requiredCondition },
                        { ...await qaService.getQAIncludes(), required: requiredCondition },
                        { ...await operatorEntryService.getOperatorEntryIncludes(), required: requiredCondition },
                    ];
            }
            else if (roleId == role.Operator_Entry) {
                if (!requiredCondition)
                    return [
                        { ...await ppcService.getPPCIncludes(), required: requiredCondition },
                        { ...await toolShopService.getToolShopIncludes(), required: requiredCondition },
                        { ...await qaService.getQAIncludes(), required: requiredCondition },
                        { ...await operatorEntryService.getOperatorEntryIncludes(), required: requiredCondition }
                    ];
                else
                    return [
                        { ...await ppcService.getPPCIncludes(), required: requiredCondition },
                        { ...await toolShopService.getToolShopIncludes(), required: requiredCondition },
                        { ...await qaService.getQAIncludes(), required: requiredCondition },
                        // { ...await operatorEntryService.getOperatorEntryIncludes(), required: requiredCondition }
                    ];
            } else if (roleId == role.QA) {
                if (!requiredCondition)
                    return [
                        { ...await ppcService.getPPCIncludes(), required: requiredCondition },
                        { ...await toolShopService.getToolShopIncludes(), required: requiredCondition },
                        { ...await qaService.getQAIncludes(), required: requiredCondition }
                    ];
                else
                    return [
                        { ...await ppcService.getPPCIncludes(), required: requiredCondition },
                        { ...await toolShopService.getToolShopIncludes(), required: requiredCondition },
                        // { ...await qaService.getQAIncludes(), required: requiredCondition }
                    ];
            } else if (roleId == role.Tool_Shop) {
                if (!requiredCondition)
                    return [
                        { ...await ppcService.getPPCIncludes(), required: requiredCondition },
                        { ...await toolShopService.getToolShopIncludes(), required: requiredCondition }
                    ];
                else
                    return [
                        { ...await ppcService.getPPCIncludes(), required: requiredCondition },
                        // { ...await toolShopService.getToolShopIncludes(), required: requiredCondition }
                    ];
            } else if (roleId == role.PPC) {
                return [
                    { ...await ppcService.getPPCIncludes(), required: requiredCondition }
                ];
            }
        } catch (error) {
            console.log("Error_in_getValidationIncludes " + error);
            throw error;
        }
    }

    public async getValidationAttributes(roleId: number, attributes: any, isDownload: number) {
        try {
            if (roleId == role.Bundling_Supervisior || roleId == role.Admin || isDownload) {
                return [
                    ...attributes,
                    ... await ppcService.getPPCAttributes(isDownload),
                    ...await toolShopService.getToolShopAttributes(isDownload),
                    ...await qaService.getQAAttributes(isDownload),
                    ...await operatorEntryService.getOperatorEntryAttributes(isDownload),
                    ...await bundlingSupervisorService.getBundlingSupervisorAttributes(isDownload)
                ];
            } else if (roleId == role.Operator_Entry) {
                return [
                    ...attributes,
                    ...await ppcService.getPPCAttributes(isDownload),
                    ...await toolShopService.getToolShopAttributes(isDownload),
                    ...await qaService.getQAAttributes(isDownload),
                    ...await operatorEntryService.getOperatorEntryAttributes(isDownload)
                ];
            } else if (roleId == role.QA) {
                return [
                    ...attributes,
                    ...await ppcService.getPPCAttributes(isDownload),
                    ...await toolShopService.getToolShopAttributes(isDownload),
                    ...await qaService.getQAAttributes(isDownload)
                ];
            } else if (roleId == role.Tool_Shop) {
                return [
                    ...attributes,
                    ...await ppcService.getPPCAttributes(isDownload),
                    ...await toolShopService.getToolShopAttributes(isDownload),
                ];
            } else if (roleId == role.PPC) {
                return [
                    ...attributes,
                    ...await ppcService.getPPCAttributes(isDownload),
                ];
            }
        } catch (error) {
            console.log("Error_in_getValidationAttributes" + error);
            throw error;
        }
    }

    public async getValidationFilter(roleId: number, input: Object) {
        try {
            if (roleId == role.Bundling_Supervisior || roleId == role.Admin) {
                return [
                    { ...await ppcService.getPPCFilter(input) },
                    { ...await toolShopService.getToolShopFilter(input) },
                    { ...await qaService.getQAFilter(input) },
                    { ...await operatorEntryService.getOperatorEntryFilter(input) },
                    { ...await bundlingSupervisorService.getBundlingSupervisorFilter(input) }
                ];
            } else if (roleId == role.Operator_Entry) {
                return [
                    { ...await ppcService.getPPCFilter(input) },
                    { ...await toolShopService.getToolShopFilter(input) },
                    { ...await qaService.getQAFilter(input) },
                    { ...await operatorEntryService.getOperatorEntryFilter(input) }
                ];
            } else if (roleId == role.QA) {
                return [
                    { ...await ppcService.getPPCFilter(input) },
                    { ...await toolShopService.getToolShopFilter(input) },
                    { ...await qaService.getQAFilter(input) }
                ];
            } else if (roleId == role.Tool_Shop) {
                return [
                    { ...await ppcService.getPPCFilter(input) },
                    { ...await toolShopService.getToolShopFilter(input) }
                ];
            } else if (roleId == role.PPC) {
                return [
                    { ...await ppcService.getPPCFilter(input) },
                ];
            }
        } catch (error) {
            console.log("Error_in_getValidationFilter")
            throw error;
        }
    }

    public async getOrderValidateQuery(roleId: number, orderId: string) {
        try {
            let dataObj = {
                attributes: [],
                distinct: true,
                model: db.tbl_order,
                where: {
                    isActive: AppConstants.ONE,
                    isDeleted: AppConstants.ZERO,
                    uniqueKey: orderId
                },
            }
            dataObj["include"] = await this.getValidationIncludes(roleId, true, AppConstants.ZERO);
            return dataObj;
        } catch (error) {
            console.log("Error_in_getOrderValidateQuery ", error);
            throw error;
        }
    }

    public async validateOrder(roleId: number, orderId: string) {
        try {
            let query = await db.tbl_order.findAll(await this.getOrderValidateQuery(roleId, orderId));
            // console.log("query ", query)
            return query;
        } catch (error) {
            console.log("Error_in_validateOrder ", error);
            throw error;
        }
    }
}