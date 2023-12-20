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
exports.OrderService = void 0;
const typedi_1 = require("typedi");
const BaseService_1 = __importDefault(require("./BaseService"));
const models_1 = __importDefault(require("../../models"));
const Enums_1 = require("../enums/Enums");
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
const Utils_1 = require("../utils/Utils");
const sequelize_1 = require("sequelize");
const PpcService_1 = require("./PpcService");
const ToolShopService_1 = require("./ToolShopService");
const QAService_1 = require("./QAService");
const OperatorEntryService_1 = require("./OperatorEntryService");
const BundlingSupervisorService_1 = require("./BundlingSupervisorService");
let ppcService = new PpcService_1.PpcService();
let toolShopService = new ToolShopService_1.ToolShopService();
let qaService = new QAService_1.QAService();
let operatorEntryService = new OperatorEntryService_1.OperatorEntryService();
let bundlingSupervisorService = new BundlingSupervisorService_1.BundlingSupervisorService();
let OrderService = class OrderService extends BaseService_1.default {
    getModel() {
        return models_1.default.tbl_order;
    }
    orderList(input, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Into_the_orderList ", currentUser["roleId"]);
                let { workFlowId, completedId } = yield this.getWorkFlow_fromEnum(input, currentUser);
                let result = yield this.getOrderList(input, workFlowId, completedId, currentUser);
                return result;
            }
            catch (error) {
                console.log("Error_in_orderList " + error);
                throw error;
            }
        });
    }
    getWorkFlow_fromEnum(input, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let workFlowId = [];
                let completedId = [];
                switch (currentUser["roleId"]) {
                    case Enums_1.role.PPC:
                        workFlowId.push(input["type"] == Appconstants_1.default.PENDING ?
                            Enums_1.ppcWorkFlow.Pending : (input["type"] == Appconstants_1.default.INPROGRESS ?
                            Enums_1.ppcWorkFlow.PPC_Inprogress : Enums_1.ppcWorkFlow.PPC_Hold));
                        if (input["type"] == Appconstants_1.default.INPROGRESS || input["type"] == Appconstants_1.default.COMPLETED) {
                            completedId = [...Array(17).keys()].slice(4);
                        }
                        break;
                    case Enums_1.role.Tool_Shop:
                        workFlowId.push(input["type"] == Appconstants_1.default.PENDING ?
                            Enums_1.toolShopWorkFlow.Queued_for_Tool_Shop :
                            (input["type"] == Appconstants_1.default.INPROGRESS ?
                                Enums_1.toolShopWorkFlow.Tool_Shop_Inprogress : Enums_1.toolShopWorkFlow.Tool_Shop_Hold));
                        if (input["type"] == Appconstants_1.default.INPROGRESS || input["type"] == Appconstants_1.default.COMPLETED) {
                            completedId = [...Array(17).keys()].slice(7);
                        }
                        break;
                    case Enums_1.role.QA:
                        workFlowId.push(input["type"] == Appconstants_1.default.PENDING ?
                            Enums_1.qaWorkFlow.Queued_for_QA : (input["type"] == Appconstants_1.default.INPROGRESS ?
                            Enums_1.qaWorkFlow.QA_Inprogress : Enums_1.qaWorkFlow.QA_Hold));
                        if (input["type"] == Appconstants_1.default.INPROGRESS || input["type"] == Appconstants_1.default.COMPLETED) {
                            completedId = [...Array(17).keys()].slice(10);
                        }
                        break;
                    case Enums_1.role.Operator_Entry:
                        workFlowId.push(input["type"] == Appconstants_1.default.PENDING ?
                            Enums_1.operatorEntryWorkFlow.Queued_for_Operator_Entry :
                            (input["type"] == Appconstants_1.default.INPROGRESS ?
                                Enums_1.operatorEntryWorkFlow.Operator_Entry_Inprogress :
                                Enums_1.operatorEntryWorkFlow.Operator_Entry_Hold));
                        if (input["type"] == Appconstants_1.default.INPROGRESS || input["type"] == Appconstants_1.default.COMPLETED) {
                            completedId = [...Array(17).keys()].slice(13);
                        }
                        break;
                    case Enums_1.role.Bundling_Supervisior:
                        workFlowId.push(input["type"] == Appconstants_1.default.PENDING ?
                            Enums_1.bundlingSupervisorWorkFlow.Queued_for_Bundling_Supervisior :
                            (input["type"] == Appconstants_1.default.INPROGRESS ?
                                Enums_1.bundlingSupervisorWorkFlow.Bundling_Supervisior_Inprogress :
                                Enums_1.bundlingSupervisorWorkFlow.Bundling_Supervisior_Hold));
                        if (input["type"] == Appconstants_1.default.INPROGRESS || input["type"] == Appconstants_1.default.COMPLETED) {
                            completedId.push(Enums_1.bundlingSupervisorWorkFlow.Bundling_Supervisior_Completed);
                        }
                        break;
                    default: //For Admin
                        console.log("Into the Admin ", currentUser["roleId"], " workFlowId ", workFlowId, " completedId ", completedId);
                        // workFlowId = [...Array(16).keys()].slice(1)
                        if (input["roleData"] && (0, Utils_1.isNotNullAndUndefined)(input["roleData"]["processStage"])) {
                            input["type"] == Appconstants_1.default.HOLD &&
                                workFlowId.push(yield this.getAdminUpdate_WorkFlowId(input));
                            input["type"] == Appconstants_1.default.COMPLETED &&
                                completedId.push(yield this.getAdminUpdate_WorkFlowId(input));
                        }
                        else {
                            input["type"] == Appconstants_1.default.PENDING
                                && workFlowId.push(Appconstants_1.default.ONE, Appconstants_1.default.FOUR, Appconstants_1.default.SEVEN, Appconstants_1.default.TEN, Appconstants_1.default.THIRTEEN);
                            input["type"] == Appconstants_1.default.INPROGRESS
                                && workFlowId.push(Appconstants_1.default.TWO, Appconstants_1.default.FIVE, Appconstants_1.default.EIGHT, Appconstants_1.default.ELEVEN, Appconstants_1.default.FOURTEEN);
                            input["type"] == Appconstants_1.default.HOLD
                                && workFlowId.push(Appconstants_1.default.THREE, Appconstants_1.default.SIX, Appconstants_1.default.NINE, Appconstants_1.default.TWELVE, Appconstants_1.default.FIFTEEN);
                            (input["type"] == Appconstants_1.default.COMPLETED || input["type"] == Appconstants_1.default.INPROGRESS)
                                && completedId.push(Appconstants_1.default.SIXTEEN);
                            // && completedId.push(AppConstants.FOUR, AppConstants.SEVEN, AppConstants.TEN,
                            //     AppConstants.THIRTEEN, AppConstants.SIXTEEN);
                        }
                        break;
                }
                return { workFlowId, completedId };
            }
            catch (error) {
                console.log("Error_in_getWorkFlow_fromEnum " + error);
                throw error;
            }
        });
    }
    getOrderList(input, workflowId, completedId, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = yield Promise.all([
                    models_1.default.tbl_order.findAndCountAll(yield this.commonOrderList_Formation(input, workflowId, completedId, currentUser)),
                    // (isArrayPopulated(completedId) && input["type"] == AppConstants.INPROGRESS
                    //     && input["exportType"] == AppConstants.ZERO) &&
                    // db.tbl_order.findOne(await this.orderCompleted_inInProgres(input, completedId, currentUser["roleId"]))
                ]).then((data) => {
                    // console.log("data ", JSON.stringify(data))
                    // return data.flat()
                    return data;
                });
                // if (query[query.length - 1] && input["type"] == AppConstants.INPROGRESS
                //     && input["exportType"] == AppConstants.ZERO) {
                //     let completedValue = query.pop()
                //     query[0].count += AppConstants.ONE;
                //     query[0].rows.unshift(completedValue)
                // }
                // console.log("query ", query[0])
                let result;
                if ((0, Utils_1.isArrayPopulated)(query[0].rows)) {
                    if (input["exportType"] == Appconstants_1.default.ZERO) {
                        let pagination = yield (0, Utils_1.paginationData)(query[0].count, input["paging"].limit, input["paging"].offset);
                        result = {
                            page: pagination,
                            orderData: (0, Utils_1.removeKeyfromJson)(query[0].rows, 'id'),
                            lastSync: yield this.getLastSyncDate()
                        };
                    }
                    else if (input["exportType"] == Appconstants_1.default.ONE) {
                        result = yield this.excelConversion(query[0].rows, input["type"], currentUser["roleId"]);
                    }
                    else if (input["exportType"] == Appconstants_1.default.TWO) {
                        result = query[0].rows;
                    }
                }
                else {
                    result = {
                        page: null,
                        orderData: null,
                        lastSync: yield this.getLastSyncDate()
                    };
                }
                // console.log("result ", result);
                return result;
            }
            catch (error) {
                console.log("Error_in_getOrderList " + error);
                throw error;
            }
        });
    }
    updateOrderStatus(orderId, workFlowId, currentUser, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield models_1.default.tbl_order.update({
                    workFlowId: workFlowId,
                    isReassigned: Appconstants_1.default.ZERO,
                    reassignedOn: null,
                    updatedBy: currentUser["id"],
                    updatedOn: new Date(new Date().toUTCString())
                }, {
                    where: {
                        isActive: Appconstants_1.default.ONE,
                        isDeleted: Appconstants_1.default.ZERO,
                        id: orderId
                    }
                }, { transaction: tran });
                return result;
            }
            catch (error) {
                console.log("Error_in_updateOrderStatus " + error);
                throw error;
            }
        });
    }
    commonOrderList_Formation(input, workflowId, completedId, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sortOrder = input["type"] == Appconstants_1.default.COMPLETED ? [['updatedOn', 'DESC']] :
                    ((input["type"] == Appconstants_1.default.INPROGRESS || input["type"] == Appconstants_1.default.HOLD) ?
                        [['priorityRefId', 'ASC'], ['updatedOn', 'ASC']] :
                        [["isReassigned", "DESC"], ["reassignedOn", "ASC"], ['priorityRefId', 'ASC'], ['updatedOn', 'ASC']]);
                let processStage = `
                (case 
                    when workFlowId in (${Enums_1.workFlow.Pending},${Enums_1.workFlow.PPC_Inprogress},${Enums_1.workFlow.PPC_Hold}) then '${Enums_1.processStageMeta.ppc}'
                    when workFlowId in (${Enums_1.workFlow.Queued_for_Tool_Shop},${Enums_1.workFlow.Tool_Shop_Inprogress},${Enums_1.workFlow.Tool_Shop_Hold}) then '${Enums_1.processStageMeta.toolShop}'
                    when workFlowId in (${Enums_1.workFlow.Queued_for_QA},${Enums_1.workFlow.QA_Inprogress},${Enums_1.workFlow.QA_Hold}) then '${Enums_1.processStageMeta.qa}'
                    when workFlowId in (${Enums_1.workFlow.Queued_for_Operator_Entry},${Enums_1.workFlow.Operator_Entry_Inprogress},${Enums_1.workFlow.Operator_Entry_Hold}) then '${Enums_1.processStageMeta.operatorEntry}'
                    when workFlowId in (${Enums_1.workFlow.Queued_for_Bundling_Supervisior},${Enums_1.workFlow.Bundling_Supervisior_Inprogress},${Enums_1.workFlow.Bundling_Supervisior_Hold}) then '${Enums_1.processStageMeta.bundlingSupervisor}'
                    else 'Completed'
                end)
            `;
                let dataObj = {
                    attributes: [
                        sequelize_1.Sequelize.literal(`distinct([tbl_order].id)`),
                        ["uniqueKey", 'orderId'],
                        ["po", "poNo"], "customer_name", ["so", "soNo"],
                        [sequelize_1.Sequelize.literal(`right(material_code,7)`), "sectionNo"],
                        ["temper", "alloyTemper"],
                        "po_qty", "extruded_qty",
                        "balance_po_qty",
                        [sequelize_1.Sequelize.literal(`
                        (case when cut_len_tolerance_lower >= 0 or cut_len_tolerance_upper >= 0 
                            then concat(isnull(cut_len_tolerance_lower, 0),', ',isnull(cut_len_tolerance_upper,0))
                            else null 
                        end)`),
                            "cut_len_tolerance"],
                        [sequelize_1.Sequelize.literal(`
                        (case when isnull(qty_tolerance_min, 0) <> 0 or isnull(qty_tolerance_max,0) <> 0 
                            then concat(isnull(qty_tolerance_min, 0),', ',isnull(qty_tolerance_max,0))
                            else null 
                        end)`),
                            "qty_tolerance"],
                        "marketing_remarks",
                        "cut_len",
                        "priorityRefId",
                        [sequelize_1.Sequelize.literal(`
                        (select tr.name
                        from ${Appconstants_1.default.DB_JINDAL}.dbo.${Appconstants_1.default.TBL_REFERENCE} tr
                        where tr.isDeleted = 0 and tr.referenceGroupId = 4
                            and tr.id = priorityRefId)
                        `),
                            "priority"],
                        [sequelize_1.Sequelize.literal(`${processStage}`), 'processStage'],
                        "workFlowId", "isReassigned",
                        "[updatedOn]", "[reassignedOn]"
                    ],
                    distinct: true,
                    model: models_1.default.tbl_order,
                    subQuery: false,
                    where: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ isActive: Appconstants_1.default.ONE, isDeleted: Appconstants_1.default.ZERO, workflowId: {
                            [sequelize_1.Op.in]: (0, Utils_1.isArrayPopulated)(input["fprocessStage"]) ? input["fprocessStage"]
                                : (input["type"] == Appconstants_1.default.COMPLETED ? completedId : workflowId)
                        }, po: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[po] LIKE N'%${input["fpo"]}%')
                    `), customer_name: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[customer_name] LIKE N'%${input["fcustomer_name"]}%')
                    `), so: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[so] LIKE N'%${input["fso"]}%')
                    `), material_code: sequelize_1.Sequelize.literal(`
                        (right([tbl_order].material_code,7) LIKE N'%${input["fsectionNo"]}%')
                    `), temper: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[temper] LIKE N'%${input["fAlloyTemper"]}%')
                    `), po_qty: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[po_qty] LIKE N'%${input["fpo_qty"]}%')
                    `), extruded_qty: sequelize_1.Sequelize.literal(`
                        (isnull([tbl_order].[extruded_qty],'') LIKE N'%${input["fextruded_qty"]}%' )
                    `), balance_po_qty: sequelize_1.Sequelize.literal(`
                        (isnull([tbl_order].[balance_po_qty],'') LIKE N'%${input["fbalance_po_qty"]}%' )
                    `), marketing_remarks: sequelize_1.Sequelize.literal(`
                        (isnull([tbl_order].[marketing_remarks],'') LIKE N'%${input["fmarketing_remarks"]}%' )
                    `), cut_len: sequelize_1.Sequelize.literal(`
                        (isnull([tbl_order].[cut_len],'') LIKE N'%${input["fcut_len"]}%')
                    `), priorityRefId: sequelize_1.Sequelize.literal(`
                        (isnull([tbl_order].[priorityRefId],'') LIKE N'%${input["fPriority"]}%')
                    `) }, ((currentUser["roleId"] === Enums_1.role.Admin || currentUser['roleId'] >= Enums_1.role.PPC || input["exportType"]) ?
                        yield ppcService.getPPCFilter(input) : null)), ((currentUser["roleId"] === Enums_1.role.Admin || currentUser['roleId'] > Enums_1.role.PPC || input["exportType"]) ?
                        yield toolShopService.getToolShopFilter(input) : null)), ((currentUser["roleId"] === Enums_1.role.Admin || currentUser['roleId'] > Enums_1.role.Tool_Shop || input["exportType"]) ?
                        yield qaService.getQAFilter(input) : null)), ((currentUser["roleId"] === Enums_1.role.Admin || currentUser['roleId'] > Enums_1.role.QA || input["exportType"]) ?
                        yield operatorEntryService.getOperatorEntryFilter(input) : null)), ((currentUser["roleId"] === Enums_1.role.Admin || currentUser['roleId'] > Enums_1.role.Operator_Entry || input["exportType"]) ?
                        yield bundlingSupervisorService.getBundlingSupervisorFilter(input) : null)
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
                    ),
                    order: sortOrder,
                    required: true,
                    raw: true
                };
                if (input["type"] !== Appconstants_1.default.PENDING && input["type"] !== Appconstants_1.default.COMPLETED
                    && Enums_1.role.Admin !== currentUser["roleId"]) {
                    dataObj.where["updatedBy"] = currentUser["id"];
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
                dataObj["include"] = yield this.getValidationIncludes(currentUser["roleId"], false, input["exportType"]);
                // dataObj.attributes = [
                //     ...dataObj.attributes,
                //     ...((currentUser["roleId"] === 1 || currentUser['roleId'] >= role.PPC) ? await ppcService.getPPCAttributes():null),
                //     ...((currentUser["roleId"] === 1 || currentUser['roleId'] > role.PPC ) ? await toolShopService.getToolShopAttributes():null),
                //     ...((currentUser["roleId"] === 1 || currentUser['roleId'] > role.Tool_Shop) ? await qaService.getQAAttributes():null),
                //     ...((currentUser["roleId"] === 1 || currentUser['roleId'] > role.QA) ? await operatorEntryService.getOperatorEntryAttributes():null),
                //     ...((currentUser["roleId"] === 1 || currentUser['roleId'] > role.Operator_Entry) ? await bundlingSupervisorService.getBundlingSupervisorAttributes():null)
                // ];
                dataObj['attributes'] =
                    yield this.getValidationAttributes(currentUser["roleId"], dataObj.attributes, input["exportType"]);
                if (input["paging"].limit > Appconstants_1.default.ZERO) {
                    dataObj["limit"] = input["paging"].limit;
                    dataObj["offset"] = input["paging"].offset;
                }
                console.log("dataObj ", dataObj);
                return dataObj;
            }
            catch (error) {
                console.log("Error_in_commonOrderList_Formation " + error);
                throw error;
            }
        });
    }
    orderCompleted_inInProgres(input, completedId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let processStage = `
                (case 
                    when workFlowId in (${Enums_1.workFlow.Pending},${Enums_1.workFlow.PPC_Inprogress},${Enums_1.workFlow.PPC_Hold}) then '${Enums_1.processStageMeta.ppc}'
                    when workFlowId in (${Enums_1.workFlow.Queued_for_Tool_Shop},${Enums_1.workFlow.Tool_Shop_Inprogress},${Enums_1.workFlow.Tool_Shop_Hold}) then '${Enums_1.processStageMeta.toolShop}'
                    when workFlowId in (${Enums_1.workFlow.Queued_for_QA},${Enums_1.workFlow.QA_Inprogress},${Enums_1.workFlow.QA_Hold}) then '${Enums_1.processStageMeta.qa}'
                    when workFlowId in (${Enums_1.workFlow.Queued_for_Operator_Entry},${Enums_1.workFlow.Operator_Entry_Inprogress},${Enums_1.workFlow.Operator_Entry_Hold}) then '${Enums_1.processStageMeta.operatorEntry}'
                    when workFlowId in (${Enums_1.workFlow.Queued_for_Bundling_Supervisior},${Enums_1.workFlow.Bundling_Supervisior_Inprogress},${Enums_1.workFlow.Bundling_Supervisior_Hold}) then '${Enums_1.processStageMeta.bundlingSupervisor}'
                    else 'Completed'
                end)
            `;
                let dataObj = {
                    attributes: [
                        ["uniqueKey", 'orderId'],
                        ["uniqueKey", 'orderId'],
                        ["po", "poNo"], "customer_name", ["so", "soNo"],
                        [sequelize_1.Sequelize.literal(`right(material_code,7)`), "sectionNo"],
                        ["temper", "alloyTemper"],
                        "po_qty", "extruded_qty",
                        "balance_po_qty",
                        [sequelize_1.Sequelize.literal(`
                        (case when isnull(cut_len_tolerance_lower, 0) <> 0 or isnull(cut_len_tolerance_upper,0) <> 0 
                            then concat(isnull(cut_len_tolerance_lower, 0),', ',isnull(cut_len_tolerance_upper,0))
                            else null 
                        end)`),
                            "cut_len_tolerance"],
                        [sequelize_1.Sequelize.literal(`
                        (case when isnull(qty_tolerance_min, 0) <> 0 or isnull(qty_tolerance_max,0) <> 0 
                            then concat(isnull(qty_tolerance_min, 0),', ',isnull(qty_tolerance_max,0))
                            else null 
                        end)`),
                            "qty_tolerance"],
                        "marketing_remarks",
                        "cut_len",
                        [sequelize_1.Sequelize.literal(`
                        (select tr.name 
                        from ${Appconstants_1.default.DB_JINDAL}.dbo.${Appconstants_1.default.TBL_REFERENCE} tr
                        where tr.isDeleted = 0 and tr.referenceGroupId = 4
                            and tr.id = priorityRefId)
                    `), "priority"],
                        [sequelize_1.Sequelize.literal(`${processStage}`), 'processStage'],
                        "workFlowId", "isReassigned",
                    ],
                    distinct: true,
                    model: models_1.default.tbl_order,
                    where: {
                        isActive: Appconstants_1.default.ONE,
                        isDeleted: Appconstants_1.default.ZERO,
                        workflowId: {
                            [sequelize_1.Op.in]: completedId
                        },
                    },
                    order: [
                        ['updatedOn', 'DESC']
                    ],
                    limit: 1,
                    offset: input["paging"].offset,
                    required: true,
                    raw: true
                };
                dataObj["include"] = [
                    yield ppcService.getPPCIncludes(),
                    yield toolShopService.getToolShopIncludes(),
                    yield qaService.getQAIncludes(),
                    yield operatorEntryService.getOperatorEntryIncludes(),
                    yield bundlingSupervisorService.getBundlingSupervisorIncludes()
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
            }
            catch (error) {
                console.log("Error_in_orderCompleted_inInProgres " + error);
                throw error;
            }
        });
    }
    viewDetailsList(orderId, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Into_the_viewDetailsList ", orderId, currentUser);
                let orderDetails = yield this.findUniqueKey(models_1.default.tbl_order, orderId);
                if (orderDetails) {
                    let result = yield Promise.all([
                        {
                            "ppcData": yield ppcService.getPPCData(orderDetails.id, currentUser["id"], currentUser["roleId"]),
                            "toolShopData": currentUser["roleId"] > Enums_1.role.PPC || currentUser["roleId"] == Enums_1.role.Admin ?
                                yield toolShopService.getToolShopData(orderDetails.id, currentUser["id"], currentUser["roleId"]) :
                                null,
                            "qaData": currentUser["roleId"] > Enums_1.role.Tool_Shop || currentUser["roleId"] == Enums_1.role.Admin ?
                                yield qaService.getQAData(orderDetails.id, currentUser["id"], currentUser["roleId"]) :
                                null,
                            "operatorEntryData": currentUser["roleId"] > Enums_1.role.QA || currentUser["roleId"] == Enums_1.role.Admin ?
                                yield operatorEntryService.getOperatorEntryData(orderDetails.id, currentUser["id"], currentUser["roleId"]) :
                                null,
                            "bundlingSupervisorData": currentUser["roleId"] > Enums_1.role.Operator_Entry || currentUser["roleId"] == Enums_1.role.Admin ?
                                yield bundlingSupervisorService.getBundlingSupervisorData(orderDetails.id, currentUser["id"], currentUser["roleId"]) :
                                null
                        },
                    ]).then((data) => {
                        console.log("data ", JSON.stringify(data.flat()));
                        return data.flat();
                    });
                    console.log("result ", result);
                    return result;
                }
                else {
                    return Appconstants_1.default.INVALID_ID;
                }
            }
            catch (error) {
                console.log("Error_in_viewDetailsList " + error);
                throw error;
            }
        });
    }
    roleBasedDataUpdate(input, currentUser, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("into the roleBasedDataUpdate");
                let result;
                switch (currentUser["roleId"]) {
                    case Enums_1.role.PPC:
                        console.log("ppc");
                        result = yield ppcService.createOrUpdatePpcStatus(input, currentUser, tran);
                        break;
                    case Enums_1.role.Tool_Shop:
                        console.log("toolshop");
                        result = yield toolShopService.createOrUpdateToolShopData(input, currentUser, tran);
                        break;
                    case Enums_1.role.QA:
                        console.log("qa");
                        result = yield qaService.createOrUpdateQaData(input, currentUser, tran);
                        break;
                    case Enums_1.role.Operator_Entry:
                        console.log("Operator_Entry");
                        result = yield operatorEntryService.createOrUpdateOperatorEntryData(input, currentUser, tran);
                        break;
                    case Enums_1.role.Bundling_Supervisior:
                        console.log("Bundling_Supervisior");
                        result = yield bundlingSupervisorService.createOrUpdatebundlingSupervisorData(input, currentUser, tran);
                        break;
                    case Enums_1.role.Admin: //For Admin
                        console.log("Into the Admin ", currentUser["roleId"]);
                        if (input["processStage"] == Enums_1.processStageMeta.ppc)
                            result = yield ppcService.createOrUpdatePpcStatus(input, currentUser, tran);
                        else if (input["processStage"] == Enums_1.processStageMeta.toolShop)
                            result = yield toolShopService.createOrUpdateToolShopData(input, currentUser, tran);
                        else if (input["processStage"] == Enums_1.processStageMeta.qa)
                            result = yield qaService.createOrUpdateQaData(input, currentUser, tran);
                        else if (input["processStage"] == Enums_1.processStageMeta.operatorEntry)
                            result = yield operatorEntryService.createOrUpdateOperatorEntryData(input, currentUser, tran);
                        else if (input["processStage"] == Enums_1.processStageMeta.bundlingSupervisor)
                            result = yield bundlingSupervisorService.createOrUpdatebundlingSupervisorData(input, currentUser, tran);
                        break;
                }
                return result;
            }
            catch (error) {
                console.log("Error_in_roleBasedDataUpdate " + error);
                throw error;
            }
        });
    }
    excelConversion(query, type, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
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
                        plannedNoOfBilletAndLength: (0, Utils_1.isArrayPopulated)(JSON.parse(data["plannedNoOfBilletAndLength"])) ?
                            yield operatorEntryService.concatBilletAndLength(JSON.parse(data["plannedNoOfBilletAndLength"])) : null,
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
                        noOfBilletAndLength: (0, Utils_1.isArrayPopulated)(JSON.parse(data["noOfBilletAndLength"])) ?
                            yield operatorEntryService.concatBilletAndLength(JSON.parse(data["noOfBilletAndLength"])) : null,
                        actualButtThickness: data["actualButtThickness"],
                        breakThroughPressure: data["breakThroughPressure"],
                        pushOnBilletLength: data["pushOnBilletLength"],
                        pushQtyInKgs: data["pushQtyInKgs"],
                        actualProductionRate: data["actualProductionRate"],
                        buttWeightInKgs: data["buttWeightInKgs"],
                        diefail: data["diefail"],
                        dieFailureReason: data["dieFailureReason"] ? data["dieFailureReason"].replace(/#/g, '') : data["dieFailureReason"],
                        breakDown: (0, Utils_1.isArrayPopulated)(JSON.parse(data["breakDown"])) ?
                            yield operatorEntryService.concatBreakDown(JSON.parse(data["breakDown"])) : null,
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
                    };
                    // if (roleId != role.Admin) delete obj.processStage
                    // if (type != AppConstants.COMPLETED) delete obj.completedDate
                    dataArr.push(obj);
                }
                result = yield this.getExcelBinaryString(dataArr, sheetHeaders);
                return result;
            }
            catch (error) {
                console.log("Error_in_excelConversion " + error);
                throw error;
            }
        });
    }
    getRoleNameById(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let title;
                switch (roleId) {
                    case Enums_1.role.PPC:
                        title = Appconstants_1.default.PPC;
                        break;
                    case Enums_1.role.Tool_Shop:
                        title = Appconstants_1.default.TOOLSHOP;
                        break;
                    case Enums_1.role.QA:
                        title = Appconstants_1.default.QA;
                        break;
                    case Enums_1.role.Operator_Entry:
                        title = Appconstants_1.default.OPERATOR_ENTRY;
                        break;
                    case Enums_1.role.Bundling_Supervisior:
                        title = Appconstants_1.default.BUNDLING_SUPERVISOR;
                        break;
                    default:
                        title = Appconstants_1.default.ADMIN;
                        break;
                }
                return title;
            }
            catch (error) {
                console.log("Error_in_getRoleNameById " + error);
                throw error;
            }
        });
    }
    getPdfHeaders() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    reassignOrderIdWorkFlow(input, currentUser, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("into the orderService");
                let orderData = yield this.findUniqueKey(models_1.default.tbl_order, input["orderId"]);
                if (orderData) {
                    let currentWorkFlowId = input["workFlowId"];
                    let roleId = currentUser["roleId"];
                    let query = ((roleId == Enums_1.role.Tool_Shop || (roleId == Enums_1.role.Admin && input["processStage"] == Enums_1.processStageMeta.toolShop)) ?
                        // await this.toolShopRemarksupdate(input, userId, roleId) :
                        yield toolShopService.createOrUpdateToolShopData(input, currentUser, tran) :
                        (roleId == Enums_1.role.QA || (roleId == Enums_1.role.Admin && input["processStage"] == Enums_1.processStageMeta.qa)) ?
                            yield this.qaRemarksupdate(input, orderData.id, currentUser["id"], roleId, tran) :
                            (roleId == Enums_1.role.Operator_Entry || (roleId == Enums_1.role.Admin && input["processStage"] == Enums_1.processStageMeta.operatorEntry)) ?
                                // await this.operatorEntryRemarksupdate(input, userId, roleId) :
                                yield operatorEntryService.createOrUpdateOperatorEntryData(input, currentUser, tran) :
                                (roleId == Enums_1.role.Bundling_Supervisior || (roleId == Enums_1.role.Admin && input["processStage"] == Enums_1.processStageMeta.bundlingSupervisor)) ?
                                    // await this.bundlingSupervisorRemarksupdate(input, userId, roleId) : ""
                                    yield bundlingSupervisorService.createOrUpdatebundlingSupervisorData(input, currentUser, tran) : "");
                    let newWorkFlowId = input["type"] == Appconstants_1.default.HOLD ? currentWorkFlowId - Appconstants_1.default.FIVE :
                        input["type"] == Appconstants_1.default.INPROGRESS ? currentWorkFlowId - Appconstants_1.default.FOUR : "";
                    // console.log("newWorkFlowId", newWorkFlowId)
                    let orderObj = new models_1.default.tbl_order();
                    orderObj.id = orderData.id;
                    orderObj.workFlowId = newWorkFlowId;
                    orderObj.isReassigned = Appconstants_1.default.ONE;
                    orderObj.reassignedOn = new Date(new Date().toUTCString());
                    if (roleId == Appconstants_1.default.ONE) {
                        orderObj.updatedAdminId = currentUser["id"];
                        orderObj.adminUpdatedOn = new Date(new Date().toUTCString());
                    }
                    else {
                        orderObj.updatedBy = currentUser["id"];
                        orderObj.updatedOn = new Date(new Date().toUTCString());
                    }
                    let result = yield this.createOrUpdateByModel(models_1.default.tbl_order, orderObj, tran);
                    if (query && result) {
                        return Appconstants_1.default.UPDATED_SUCCESSFULLY;
                    }
                    else {
                        return Appconstants_1.default.PROBLEM_WHILE_UPDATING;
                    }
                }
                else {
                    return Appconstants_1.default.INVALID_REQUEST_BODY;
                }
            }
            catch (error) {
                console.log("Error_in_reassignOrderIdWorkFlow " + error);
                throw error;
            }
        });
    }
    toolShopRemarksupdate(input, userId, roleId, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("into the toolshop service")
                let toolShopData = yield this.findUniqueKey(models_1.default.tbl_toolShop, input["uniqueKey"]);
                let toolShopRemarksObj, result;
                if (toolShopData) {
                    toolShopRemarksObj = new models_1.default.tbl_toolShop();
                    toolShopRemarksObj.id = toolShopData.id;
                    toolShopRemarksObj.remarks = input["remarks"];
                    if (roleId == Appconstants_1.default.ONE) {
                        toolShopRemarksObj.updatedAdminId = userId;
                        toolShopRemarksObj.adminUpdatedOn = new Date(new Date().toUTCString());
                    }
                    else {
                        toolShopRemarksObj.updatedBy = userId;
                        toolShopRemarksObj.updatedOn = new Date(new Date().toUTCString());
                    }
                    result = yield this.createOrUpdateByModel(models_1.default.tbl_toolShop, toolShopRemarksObj, tran);
                    return result;
                }
            }
            catch (error) {
                console.log("Error_in_toolShopRemarksupdate" + error);
                throw error;
            }
        });
    }
    qaRemarksupdate(input, orderId, userId, roleId, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("into the qaRemarksupdate")
                let qaData = input["uniqueKey"] != "" ? yield this.findUniqueKey(models_1.default.tbl_qa, input["uniqueKey"]) : undefined;
                let qaObj, result;
                qaObj = new models_1.default.tbl_qa();
                qaObj.remarks = input["remarks"];
                qaObj.orderId = orderId;
                qaObj.isDeleted = Appconstants_1.default.ZERO;
                if (roleId == Appconstants_1.default.ONE) {
                    qaObj.updatedAdminId = userId;
                    qaObj.adminUpdatedOn = new Date(new Date().toUTCString());
                }
                if (qaData) {
                    qaObj.id = qaData.id;
                    qaObj.uniqueKey = qaData.uniqueKey;
                    qaObj.updatedBy = userId;
                    qaObj.updatedOn = new Date(new Date().toUTCString());
                }
                else {
                    qaObj.uniqueKey = (0, Utils_1.uuidv4)();
                    qaObj.createdBy = userId;
                    qaObj.createdOn = new Date(new Date().toUTCString());
                }
                result = yield this.createOrUpdateByModel(models_1.default.tbl_qa, qaObj, tran);
                // if (input['plannedQuenching'] || input['plannedInternalAlloy'] ||
                //     (input['frontEndCoringLength'] >= AppConstants.ZERO && input['frontEndCoringLength'] != null)
                //     || (input['backEndCoringLength'] >= AppConstants.ZERO && input['backEndCoringLength'] != null)) {
                let result1 = yield qaService.updatePpcData(input, orderId, userId, roleId, tran);
                // }
                // if ((input['cut_len_tolerance_upper'] >= AppConstants.ZERO && input['cut_len_tolerance_upper'] != null) ||
                //     (input['cut_len_tolerance_lower'] >= AppConstants.ZERO && input['cut_len_tolerance_lower'] != null)) {
                let result2 = yield this.updateOrderDatas(input, orderId, userId, roleId, tran);
                // }
                return result;
            }
            catch (error) {
                console.log("Error_in_qaRemarksupdate" + error);
                throw error;
            }
        });
    }
    operatorEntryRemarksupdate(input, userId, roleId, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("into the operatorEntryRemarksupdate")
                let operatorEntryData = yield this.findUniqueKey(models_1.default.tbl_operatorEntry, input["uniqueKey"]);
                let operatorEntryObj, result;
                if (operatorEntryData) {
                    operatorEntryObj = new models_1.default.tbl_operatorEntry();
                    operatorEntryObj.id = operatorEntryData.id;
                    operatorEntryObj.remarks = input["remarks"];
                    if (roleId == Appconstants_1.default.ONE) {
                        operatorEntryObj.updatedAdminId = userId;
                        operatorEntryObj.adminUpdatedOn = new Date(new Date().toUTCString());
                    }
                    else {
                        operatorEntryObj.updatedBy = userId;
                        operatorEntryObj.updatedOn = new Date(new Date().toUTCString());
                    }
                    result = yield this.createOrUpdateByModel(models_1.default.tbl_operatorEntry, operatorEntryObj, tran);
                }
                return result;
            }
            catch (error) {
                console.log("Error_in_qaRemarksupdate" + error);
                throw error;
            }
        });
    }
    bundlingSupervisorRemarksupdate(input, userId, roleId, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("into the bundlingSupervisorRemarksupdate")
                let bundlingSupervisorData = yield this.findUniqueKey(models_1.default.tbl_bundlingSupervisor, input["uniqueKey"]);
                let bundlingSupervisorReassignObj, result;
                if (bundlingSupervisorData) {
                    bundlingSupervisorReassignObj = new models_1.default.tbl_bundlingSupervisor();
                    bundlingSupervisorReassignObj.id = bundlingSupervisorData.id;
                    bundlingSupervisorReassignObj.remarks = input["remarks"];
                    if (roleId == Appconstants_1.default.ONE) {
                        bundlingSupervisorReassignObj.adminUpdatedOn = new Date(new Date().toUTCString());
                        bundlingSupervisorReassignObj.updatedAdminId = userId;
                    }
                    else {
                        bundlingSupervisorReassignObj.updatedBy = userId;
                        bundlingSupervisorReassignObj.updatedOn = new Date(new Date().toUTCString());
                    }
                    // console.log("bundlingSupervisorReassignObj", bundlingSupervisorReassignObj)
                    result = yield this.createOrUpdateByModel(models_1.default.tbl_bundlingSupervisor, bundlingSupervisorReassignObj, tran);
                }
                return result;
            }
            catch (error) {
                console.log("Error_in_bundlingSupervisorRemarksupdate" + error);
                throw error;
            }
        });
    }
    updateOrderDatas(input, orderId, userId, roleId, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let orderObj = new models_1.default.tbl_order();
                orderObj.id = orderId;
                orderObj.cut_len_tolerance_upper = input["cut_len_tolerance_upper"];
                orderObj.cut_len_tolerance_lower = input["cut_len_tolerance_lower"];
                if (roleId == Appconstants_1.default.ONE) {
                    orderObj.updatedAdminId = userId;
                    orderObj.adminUpdatedOn = new Date(new Date().toUTCString());
                }
                else {
                    orderObj.updatedOn = new Date(new Date().toUTCString());
                    orderObj.updatedBy = userId;
                }
                let result = yield this.createOrUpdateByModel(models_1.default.tbl_order, orderObj, tran);
                return result;
            }
            catch (error) {
                console.log("Error in updateOrderDatas" + error);
                throw error;
            }
        });
    }
    getLastSyncDate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("into the getLastSyncDate");
                let orderData = yield models_1.default.tbl_order.findOne({
                    attributes: ["createdOn"],
                    model: models_1.default.tbl_order,
                    order: [
                        ['createdOn', 'DESC']
                    ],
                    raw: true
                });
                console.log("orderData ", orderData);
                // let { createdOn = orderData // && await this.splitDataValuesFromData(orderData) ;
                return orderData ? orderData.createdOn : null;
            }
            catch (error) {
                console.log("Error in getLastSyncDate" + error);
                throw error;
            }
        });
    }
    getReportDataObj(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let status = `
                (case 
                    when (workFlowId < ${Enums_1.workFlow.Queued_for_Tool_Shop}) then 'PPC Data In-Progress'
                    when (workFlowId >= ${Enums_1.workFlow.Queued_for_Tool_Shop} and workFlowId < ${Enums_1.workFlow.Queued_for_QA}) then 'PPC Data Completed'
                    when (workFlowId >= ${Enums_1.workFlow.Queued_for_QA} and workFlowId < ${Enums_1.workFlow.Queued_for_Operator_Entry}) then 'Tool Shop Data Completed'
                    when (workFlowId >= ${Enums_1.workFlow.Queued_for_Operator_Entry} and workFlowId < ${Enums_1.workFlow.Queued_for_Bundling_Supervisior}) then 'QA Entry Completed'
                    when (workFlowId >= ${Enums_1.workFlow.Queued_for_Bundling_Supervisior} and workFlowId < ${Enums_1.workFlow.Bundling_Supervisior_Completed}) then 'Operator Entry Completed'
                    else 'Bundling Supervisor Completed'
                end)
            `;
                let weightage = `
                (case 
                    when (workFlowId < ${Enums_1.workFlow.Queued_for_Tool_Shop}) then ${Appconstants_1.default.ZERO}
                    when (workFlowId >= ${Enums_1.workFlow.Queued_for_Tool_Shop} and workFlowId < ${Enums_1.workFlow.Queued_for_QA}) then ${Appconstants_1.default.TWENTY}
                    when (workFlowId >= ${Enums_1.workFlow.Queued_for_QA} and workFlowId < ${Enums_1.workFlow.Queued_for_Operator_Entry}) then ${Appconstants_1.default.FOURTY}
                    when (workFlowId >= ${Enums_1.workFlow.Queued_for_Operator_Entry} and workFlowId < ${Enums_1.workFlow.Queued_for_Bundling_Supervisior}) then ${Appconstants_1.default.SIXTY}
                    when (workFlowId >= ${Enums_1.workFlow.Queued_for_Bundling_Supervisior} and workFlowId < ${Enums_1.workFlow.Bundling_Supervisior_Completed}) then ${Appconstants_1.default.EIGHTY}
                    else ${Appconstants_1.default.HUNDRED}
                end)
            `;
                let dataObj = {
                    attributes: [
                        sequelize_1.Sequelize.literal(`distinct([tbl_order].id)`),
                        ["uniqueKey", 'orderId'],
                        ["po", "poNo"], "customer_name",
                        [sequelize_1.Sequelize.literal(`${status}`), 'status'],
                        [sequelize_1.Sequelize.literal(`${weightage}`), 'weightage'],
                        ["so", "soNo"],
                        [sequelize_1.Sequelize.literal(`right(material_code,7)`), "sectionNo"],
                        ["temper", "alloyTemper"],
                        "po_qty", "extruded_qty",
                        "balance_po_qty",
                        [sequelize_1.Sequelize.literal(`
                            (case when cut_len_tolerance_lower >= 0 or cut_len_tolerance_upper >= 0 
                                then concat(cut_len_tolerance_lower,', ',cut_len_tolerance_upper)
                                else null 
                            end)`),
                            "cut_len_tolerance"],
                        [sequelize_1.Sequelize.literal(`
                            (case when isnull(qty_tolerance_min, 0) <> 0 or isnull(qty_tolerance_max,0) <> 0 
                                then concat(isnull(qty_tolerance_min, 0),', ',isnull(qty_tolerance_max,0))
                                else null 
                            end)`),
                            "qty_tolerance"],
                        "marketing_remarks",
                        "cut_len",
                        // "priorityRefId",
                        [sequelize_1.Sequelize.literal(`
                            (select tr.name
                            from ${Appconstants_1.default.DB_JINDAL}.dbo.${Appconstants_1.default.TBL_REFERENCE} tr
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
                    model: models_1.default.tbl_order,
                    where: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ isActive: Appconstants_1.default.ONE, isDeleted: Appconstants_1.default.ZERO, workflowId: {
                            [sequelize_1.Op.in]: input["fstatusOrWeightage"] >= Appconstants_1.default.ZERO ? yield this.getStatusWeightageFilter(input["fstatusOrWeightage"]) : Appconstants_1.default.ZERO
                        }, planned_press: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[planned_press] LIKE N'%${input["fpress"]}%')
                    `), po: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[po] LIKE N'%${input["fpo"]}%')
                    `), customer_name: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[customer_name] LIKE N'%${input["fcustomer_name"]}%')
                    `), so: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[so] LIKE N'%${input["fso"]}%')
                    `), material_code: sequelize_1.Sequelize.literal(`
                        (right([tbl_order].material_code,7) LIKE N'%${input["fsectionNo"]}%')
                    `), temper: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[temper] LIKE N'%${input["fAlloyTemper"]}%')
                    `), po_qty: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[po_qty] LIKE N'%${input["fpo_qty"]}%')
                    `), extruded_qty: sequelize_1.Sequelize.literal(`
                        (isnull([tbl_order].[extruded_qty],'') LIKE N'%${input["fextruded_qty"]}%' )
                    `), balance_po_qty: sequelize_1.Sequelize.literal(`
                        (isnull([tbl_order].[balance_po_qty],'') LIKE N'%${input["fbalance_po_qty"]}%' )
                    `), marketing_remarks: sequelize_1.Sequelize.literal(`
                        (isnull([tbl_order].[marketing_remarks],'') LIKE N'%${input["fmarketing_remarks"]}%' )
                    `), cut_len: sequelize_1.Sequelize.literal(`
                        (isnull([tbl_order].[cut_len],'') LIKE N'%${input["fcut_len"]}%')
                    `), priorityRefId: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[priorityRefId] LIKE N'%${input["fPriority"]}%')
                    `) }, (yield ppcService.getPPCFilter(input))), (yield toolShopService.getToolShopFilter(input))), (yield qaService.getQAFilter(input))), (yield operatorEntryService.getOperatorEntryFilter(input))), (yield bundlingSupervisorService.getBundlingSupervisorFilter(input))),
                    order: [
                        ['po_release_dt', 'DESC']
                    ],
                    required: true,
                    raw: true
                };
                dataObj["include"] = [
                    yield ppcService.getPPCIncludes(),
                    yield toolShopService.getToolShopIncludes(),
                    yield qaService.getQAIncludes(),
                    yield operatorEntryService.getOperatorEntryIncludes(),
                    yield bundlingSupervisorService.getBundlingSupervisorIncludes()
                ];
                if (input["ffromDate"] && input["ffromDate"] != '' && input["ftoDate"] && input["ftoDate"] != '') {
                    dataObj.where['[Op.and]'] = sequelize_1.Sequelize.literal(`
                    ([tbl_order].[po_release_dt] between N'${input["ffromDate"]}' AND N'${input["ftoDate"]}')
                `);
                }
                if (!(input["fstatusOrWeightage"] >= Appconstants_1.default.ZERO)) {
                    delete dataObj.where.workflowId;
                }
                dataObj.attributes = [
                    ...dataObj.attributes,
                    ...(yield ppcService.getPPCAttributes(input["exportType"])),
                    ...(yield toolShopService.getToolShopAttributes(input["exportType"])),
                    ...(yield qaService.getQAAttributes(input["exportType"])),
                    ...(yield operatorEntryService.getOperatorEntryAttributes(input["exportType"])),
                    ...(yield bundlingSupervisorService.getBundlingSupervisorAttributes(input["exportType"]))
                ];
                if (input["paging"].limit > Appconstants_1.default.ZERO) {
                    dataObj["limit"] = input["paging"].limit;
                    dataObj["offset"] = input["paging"].offset;
                }
                return dataObj;
            }
            catch (error) {
                console.log("Error in getReportDataObj" + error);
                throw error;
            }
        });
    }
    getReportList(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = yield models_1.default.tbl_order.findAndCountAll(yield this.getReportDataObj(input));
                // console.log("query ", query);
                let result;
                if ((0, Utils_1.isArrayPopulated)(query.rows)) {
                    let pagination = yield (0, Utils_1.paginationData)(query.count, input["paging"].limit, input["paging"].offset);
                    result = {
                        page: pagination,
                        orderData: (0, Utils_1.removeKeyfromJson)(query.rows, 'id')
                    };
                }
                return result;
            }
            catch (error) {
                console.log("Error in getReportList " + error);
                throw error;
            }
        });
    }
    getDashboardDownloadList(input, columns) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dataObj = {
                    attributes: [sequelize_1.Sequelize.literal(`${columns}`)],
                    distinct: true,
                    model: models_1.default.tbl_order,
                    where: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ isActive: Appconstants_1.default.ONE, isDeleted: Appconstants_1.default.ZERO, workflowId: {
                            [sequelize_1.Op.in]: input["fstatusOrWeightage"] >= Appconstants_1.default.ZERO ? yield this.getStatusWeightageFilter(input["fstatusOrWeightage"]) : Appconstants_1.default.ZERO
                        }, 
                        // planned_press: Sequelize.literal(`
                        //     ([tbl_order].[planned_press] LIKE N'%${input["fpress"]}%')
                        // `),
                        po: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[po] LIKE N'%${input["fpo"]}%')
                    `), customer_name: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[customer_name] LIKE N'%${input["fcustomer_name"]}%')
                    `), so: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[so] LIKE N'%${input["fso"]}%')
                    `), material_code: sequelize_1.Sequelize.literal(`
                        (right([tbl_order].material_code,7) LIKE N'%${input["fsectionNo"]}%')
                    `), temper: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[temper] LIKE N'%${input["fAlloyTemper"]}%')
                    `), po_qty: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[po_qty] LIKE N'%${input["fpo_qty"]}%')
                    `), extruded_qty: sequelize_1.Sequelize.literal(`
                        (isnull([tbl_order].[extruded_qty],'') LIKE N'%${input["fextruded_qty"]}%' )
                    `), balance_po_qty: sequelize_1.Sequelize.literal(`
                        (isnull([tbl_order].[balance_po_qty],'') LIKE N'%${input["fbalance_po_qty"]}%' )
                    `), marketing_remarks: sequelize_1.Sequelize.literal(`
                        (isnull([tbl_order].[marketing_remarks],'') LIKE N'%${input["fmarketing_remarks"]}%' )
                    `), cut_len: sequelize_1.Sequelize.literal(`
                        (isnull([tbl_order].[cut_len],'') LIKE N'%${input["fcut_len"]}%')
                    `), priorityRefId: sequelize_1.Sequelize.literal(`
                        ([tbl_order].[priorityRefId] LIKE N'%${input["fPriority"]}%')
                    `) }, (yield ppcService.getPPCFilter(input))), (yield toolShopService.getToolShopFilter(input))), (yield qaService.getQAFilter(input))), (yield operatorEntryService.getOperatorEntryFilter(input))), (yield bundlingSupervisorService.getBundlingSupervisorFilter(input))),
                    required: true,
                    raw: true
                };
                dataObj["include"] = [
                    yield ppcService.getPPCIncludes(),
                    yield toolShopService.getToolShopIncludes(),
                    yield qaService.getQAIncludes(),
                    yield operatorEntryService.getOperatorEntryIncludes(),
                    yield bundlingSupervisorService.getBundlingSupervisorIncludes()
                ];
                if (input["ffromDate"] && input["ffromDate"] != '' && input["ftoDate"] && input["ftoDate"] != '') {
                    dataObj.where['[Op.and]'] = sequelize_1.Sequelize.literal(`
                    ([tbl_order].[po_release_dt] between N'${input["ffromDate"]}' AND N'${input["ftoDate"]}')
                `);
                }
                if (!(input["fstatusOrWeightage"] >= Appconstants_1.default.ZERO)) {
                    delete dataObj.where.workflowId;
                }
                let query = yield models_1.default.tbl_order.findAll(dataObj);
                console.log("query ", query);
                return query;
            }
            catch (error) {
                console.log("Error in getDashboardDownloadList " + error);
                throw error;
            }
        });
    }
    excelConversionForDashboard(query, headers, dataHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result, sheetHeaders;
                // let dataArr = [];
                let dataArr = yield this.getDownloadJsonFormation(query, dataHeaders);
                // sheetHeaders = headers;
                sheetHeaders = (0, Utils_1.isArrayPopulated)(Object.keys(dataArr[0])) ? Object.keys(dataArr[0]) : sheetHeaders;
                // console.log("sheetHeaders ", sheetHeaders, Object.keys(dataArr[0]))
                console.log("dataArr ", dataArr);
                result = yield this.getExcelBinaryString(dataArr, sheetHeaders);
                return result;
            }
            catch (error) {
                console.log("Error_in_excelConversion " + error);
                throw error;
            }
        });
    }
    getAdminUpdate_WorkFlowId(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("into the getAdminUpdate_WorkFlowId ", input);
                let workFlowId;
                switch (input["roleData"]["processStage"]) {
                    case Enums_1.processStageMeta.ppc:
                        if (input["type"] == Appconstants_1.default.HOLD) {
                            workFlowId = Enums_1.workFlow.PPC_Hold;
                        }
                        if (input["type"] == Appconstants_1.default.COMPLETED) {
                            workFlowId = Enums_1.workFlow.Queued_for_Tool_Shop;
                        }
                        break;
                    case Enums_1.processStageMeta.toolShop:
                        if (input["type"] == Appconstants_1.default.HOLD) {
                            workFlowId = Enums_1.workFlow.Tool_Shop_Hold;
                        }
                        if (input["type"] == Appconstants_1.default.COMPLETED) {
                            workFlowId = Enums_1.workFlow.Queued_for_QA;
                        }
                        break;
                    case Enums_1.processStageMeta.qa:
                        if (input["type"] == Appconstants_1.default.HOLD) {
                            workFlowId = Enums_1.workFlow.QA_Hold;
                        }
                        if (input["type"] == Appconstants_1.default.COMPLETED) {
                            workFlowId = Enums_1.workFlow.Queued_for_Operator_Entry;
                        }
                        break;
                    case Enums_1.processStageMeta.operatorEntry:
                        if (input["type"] == Appconstants_1.default.HOLD) {
                            workFlowId = Enums_1.workFlow.Operator_Entry_Hold;
                        }
                        if (input["type"] == Appconstants_1.default.COMPLETED) {
                            workFlowId = Enums_1.workFlow.Queued_for_Bundling_Supervisior;
                        }
                        break;
                    case Enums_1.processStageMeta.bundlingSupervisor:
                        if (input["type"] == Appconstants_1.default.HOLD) {
                            workFlowId = Enums_1.workFlow.Bundling_Supervisior_Hold;
                        }
                        if (input["type"] == Appconstants_1.default.COMPLETED) {
                            workFlowId = Enums_1.workFlow.Bundling_Supervisior_Completed;
                        }
                        break;
                }
                console.log("workflowid in getAdminUpdate_WorkFlowId ", workFlowId);
                return workFlowId;
            }
            catch (error) {
                console.log("Error_in_getAdminUpdate_WorkFlowId " + error);
                throw error;
            }
        });
    }
    getStatusWeightageFilter(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let workFlowId = [];
                switch (input) {
                    case Appconstants_1.default.TWENTY:
                        workFlowId.push(Enums_1.workFlow.Queued_for_Tool_Shop, Enums_1.workFlow.Tool_Shop_Inprogress, Enums_1.workFlow.Tool_Shop_Hold);
                        // workFlowId = [...workFlow.Queued_for_Tool_Shop]
                        break;
                    case Appconstants_1.default.FOURTY:
                        workFlowId.push(Enums_1.workFlow.Queued_for_QA, Enums_1.workFlow.QA_Inprogress, Enums_1.workFlow.QA_Hold);
                        break;
                    case Appconstants_1.default.SIXTY:
                        workFlowId.push(Enums_1.workFlow.Queued_for_Operator_Entry, Enums_1.workFlow.Operator_Entry_Inprogress, Enums_1.workFlow.Operator_Entry_Hold);
                        break;
                    case Appconstants_1.default.EIGHTY:
                        workFlowId.push(Enums_1.workFlow.Queued_for_Bundling_Supervisior, Enums_1.workFlow.Bundling_Supervisior_Inprogress, Enums_1.workFlow.Bundling_Supervisior_Hold);
                        break;
                    case Appconstants_1.default.HUNDRED:
                        workFlowId.push(Enums_1.workFlow.Bundling_Supervisior_Completed);
                        break;
                    default:
                        workFlowId.push(Enums_1.workFlow.Pending, Enums_1.workFlow.PPC_Inprogress, Enums_1.workFlow.PPC_Hold);
                        break;
                }
                return workFlowId;
            }
            catch (error) {
                console.log("Error_in_getStatusWeightageFilter " + error);
                throw error;
            }
        });
    }
    getDownloadJsonFormation(query, dataHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dataArr = [];
                for (let data of query) {
                    let obj = {};
                    for (let data2 of dataHeaders) {
                        if (data2.columnName == 'plannedNoOfBilletAndLength' || data2.columnName == 'noOfBilletAndLength') {
                            obj[data2.name] = (0, Utils_1.isArrayPopulated)(JSON.parse(data[data2.alias != '' ? data2.alias : data2.columnName])) ?
                                yield operatorEntryService.concatBilletAndLength(JSON.parse(data[data2.alias != '' ? data2.alias : data2.columnName])) : null;
                        }
                        else if (data2.columnName == 'breakDown') {
                            obj[data2.name] = (0, Utils_1.isArrayPopulated)(JSON.parse(data[data2.alias != '' ? data2.alias : data2.columnName])) ?
                                yield operatorEntryService.concatBreakDown(JSON.parse(data[data2.alias != '' ? data2.alias : data2.columnName])) : null;
                        }
                        else {
                            obj[data2.name] = data[data2.alias != '' ? data2.alias : data2.columnName];
                        }
                    }
                    dataArr.push(obj);
                }
                return dataArr;
            }
            catch (error) {
                console.log("Error_in_getDownloadJsonFormation " + error);
                throw error;
            }
        });
    }
    getExcelBinaryString(dataArr, sheetHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = ((dataArr) => __awaiter(this, void 0, void 0, function* () {
                    const XLSX = require('xlsx');
                    const workbook = XLSX.utils.book_new();
                    const worksheet = XLSX.utils.json_to_sheet(dataArr, { "defval": "", raw: false, blankrows: false });
                    yield XLSX.utils.sheet_add_aoa(worksheet, [sheetHeaders], { origin: "A1", headers: true });
                    yield XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
                    let dataString = yield XLSX.write(workbook, { bookType: "xlsx", type: "base64" });
                    console.log("Excel Data::" + " " + dataString);
                    return dataString;
                }))(dataArr);
                return result;
            }
            catch (error) {
                console.log("Error_in_getExcelBinaryString " + error);
                throw error;
            }
        });
    }
    getValidationIncludes(roleId, requiredCondition, isDownload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (roleId == Enums_1.role.Admin || roleId == Enums_1.role.Bundling_Supervisior || isDownload) {
                    if (!requiredCondition)
                        return [
                            Object.assign(Object.assign({}, yield ppcService.getPPCIncludes()), { required: requiredCondition }),
                            Object.assign(Object.assign({}, yield toolShopService.getToolShopIncludes()), { required: requiredCondition }),
                            Object.assign(Object.assign({}, yield qaService.getQAIncludes()), { required: requiredCondition }),
                            Object.assign(Object.assign({}, yield operatorEntryService.getOperatorEntryIncludes()), { required: requiredCondition }),
                            Object.assign(Object.assign({}, yield bundlingSupervisorService.getBundlingSupervisorIncludes()), { required: requiredCondition }),
                        ];
                    else
                        return [
                            Object.assign(Object.assign({}, yield ppcService.getPPCIncludes()), { required: requiredCondition }),
                            Object.assign(Object.assign({}, yield toolShopService.getToolShopIncludes()), { required: requiredCondition }),
                            Object.assign(Object.assign({}, yield qaService.getQAIncludes()), { required: requiredCondition }),
                            Object.assign(Object.assign({}, yield operatorEntryService.getOperatorEntryIncludes()), { required: requiredCondition }),
                        ];
                }
                else if (roleId == Enums_1.role.Operator_Entry) {
                    if (!requiredCondition)
                        return [
                            Object.assign(Object.assign({}, yield ppcService.getPPCIncludes()), { required: requiredCondition }),
                            Object.assign(Object.assign({}, yield toolShopService.getToolShopIncludes()), { required: requiredCondition }),
                            Object.assign(Object.assign({}, yield qaService.getQAIncludes()), { required: requiredCondition }),
                            Object.assign(Object.assign({}, yield operatorEntryService.getOperatorEntryIncludes()), { required: requiredCondition })
                        ];
                    else
                        return [
                            Object.assign(Object.assign({}, yield ppcService.getPPCIncludes()), { required: requiredCondition }),
                            Object.assign(Object.assign({}, yield toolShopService.getToolShopIncludes()), { required: requiredCondition }),
                            Object.assign(Object.assign({}, yield qaService.getQAIncludes()), { required: requiredCondition }),
                            // { ...await operatorEntryService.getOperatorEntryIncludes(), required: requiredCondition }
                        ];
                }
                else if (roleId == Enums_1.role.QA) {
                    if (!requiredCondition)
                        return [
                            Object.assign(Object.assign({}, yield ppcService.getPPCIncludes()), { required: requiredCondition }),
                            Object.assign(Object.assign({}, yield toolShopService.getToolShopIncludes()), { required: requiredCondition }),
                            Object.assign(Object.assign({}, yield qaService.getQAIncludes()), { required: requiredCondition })
                        ];
                    else
                        return [
                            Object.assign(Object.assign({}, yield ppcService.getPPCIncludes()), { required: requiredCondition }),
                            Object.assign(Object.assign({}, yield toolShopService.getToolShopIncludes()), { required: requiredCondition }),
                            // { ...await qaService.getQAIncludes(), required: requiredCondition }
                        ];
                }
                else if (roleId == Enums_1.role.Tool_Shop) {
                    if (!requiredCondition)
                        return [
                            Object.assign(Object.assign({}, yield ppcService.getPPCIncludes()), { required: requiredCondition }),
                            Object.assign(Object.assign({}, yield toolShopService.getToolShopIncludes()), { required: requiredCondition })
                        ];
                    else
                        return [
                            Object.assign(Object.assign({}, yield ppcService.getPPCIncludes()), { required: requiredCondition }),
                            // { ...await toolShopService.getToolShopIncludes(), required: requiredCondition }
                        ];
                }
                else if (roleId == Enums_1.role.PPC) {
                    return [
                        Object.assign(Object.assign({}, yield ppcService.getPPCIncludes()), { required: requiredCondition })
                    ];
                }
            }
            catch (error) {
                console.log("Error_in_getValidationIncludes " + error);
                throw error;
            }
        });
    }
    getValidationAttributes(roleId, attributes, isDownload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (roleId == Enums_1.role.Bundling_Supervisior || roleId == Enums_1.role.Admin || isDownload) {
                    return [
                        ...attributes,
                        ...yield ppcService.getPPCAttributes(isDownload),
                        ...yield toolShopService.getToolShopAttributes(isDownload),
                        ...yield qaService.getQAAttributes(isDownload),
                        ...yield operatorEntryService.getOperatorEntryAttributes(isDownload),
                        ...yield bundlingSupervisorService.getBundlingSupervisorAttributes(isDownload)
                    ];
                }
                else if (roleId == Enums_1.role.Operator_Entry) {
                    return [
                        ...attributes,
                        ...yield ppcService.getPPCAttributes(isDownload),
                        ...yield toolShopService.getToolShopAttributes(isDownload),
                        ...yield qaService.getQAAttributes(isDownload),
                        ...yield operatorEntryService.getOperatorEntryAttributes(isDownload)
                    ];
                }
                else if (roleId == Enums_1.role.QA) {
                    return [
                        ...attributes,
                        ...yield ppcService.getPPCAttributes(isDownload),
                        ...yield toolShopService.getToolShopAttributes(isDownload),
                        ...yield qaService.getQAAttributes(isDownload)
                    ];
                }
                else if (roleId == Enums_1.role.Tool_Shop) {
                    return [
                        ...attributes,
                        ...yield ppcService.getPPCAttributes(isDownload),
                        ...yield toolShopService.getToolShopAttributes(isDownload),
                    ];
                }
                else if (roleId == Enums_1.role.PPC) {
                    return [
                        ...attributes,
                        ...yield ppcService.getPPCAttributes(isDownload),
                    ];
                }
            }
            catch (error) {
                console.log("Error_in_getValidationAttributes" + error);
                throw error;
            }
        });
    }
    getValidationFilter(roleId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (roleId == Enums_1.role.Bundling_Supervisior || roleId == Enums_1.role.Admin) {
                    return [
                        Object.assign({}, yield ppcService.getPPCFilter(input)),
                        Object.assign({}, yield toolShopService.getToolShopFilter(input)),
                        Object.assign({}, yield qaService.getQAFilter(input)),
                        Object.assign({}, yield operatorEntryService.getOperatorEntryFilter(input)),
                        Object.assign({}, yield bundlingSupervisorService.getBundlingSupervisorFilter(input))
                    ];
                }
                else if (roleId == Enums_1.role.Operator_Entry) {
                    return [
                        Object.assign({}, yield ppcService.getPPCFilter(input)),
                        Object.assign({}, yield toolShopService.getToolShopFilter(input)),
                        Object.assign({}, yield qaService.getQAFilter(input)),
                        Object.assign({}, yield operatorEntryService.getOperatorEntryFilter(input))
                    ];
                }
                else if (roleId == Enums_1.role.QA) {
                    return [
                        Object.assign({}, yield ppcService.getPPCFilter(input)),
                        Object.assign({}, yield toolShopService.getToolShopFilter(input)),
                        Object.assign({}, yield qaService.getQAFilter(input))
                    ];
                }
                else if (roleId == Enums_1.role.Tool_Shop) {
                    return [
                        Object.assign({}, yield ppcService.getPPCFilter(input)),
                        Object.assign({}, yield toolShopService.getToolShopFilter(input))
                    ];
                }
                else if (roleId == Enums_1.role.PPC) {
                    return [
                        Object.assign({}, yield ppcService.getPPCFilter(input)),
                    ];
                }
            }
            catch (error) {
                console.log("Error_in_getValidationFilter");
                throw error;
            }
        });
    }
    getOrderValidateQuery(roleId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dataObj = {
                    attributes: [],
                    distinct: true,
                    model: models_1.default.tbl_order,
                    where: {
                        isActive: Appconstants_1.default.ONE,
                        isDeleted: Appconstants_1.default.ZERO,
                        uniqueKey: orderId
                    },
                };
                dataObj["include"] = yield this.getValidationIncludes(roleId, true, Appconstants_1.default.ZERO);
                return dataObj;
            }
            catch (error) {
                console.log("Error_in_getOrderValidateQuery ", error);
                throw error;
            }
        });
    }
    validateOrder(roleId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = yield models_1.default.tbl_order.findAll(yield this.getOrderValidateQuery(roleId, orderId));
                // console.log("query ", query)
                return query;
            }
            catch (error) {
                console.log("Error_in_validateOrder ", error);
                throw error;
            }
        });
    }
};
OrderService = __decorate([
    (0, typedi_1.Service)()
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=OrderService.js.map