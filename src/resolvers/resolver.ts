import GraphQLDateTime from 'graphql-type-datetime';
import GraphQLJSON from 'graphql-type-json';
import { PpcService } from '../services/PpcService';
import AppConstants from '../constants/Appconstants';
import { OrderService } from "../services/OrderService";
import { ToolShopService } from '../services/ToolShopService';
import { OperatorEntryService } from '../services/OperatorEntryService';
import { OrderUserMappingService } from '../services/OrderUserMappingService';
import { BundlingSupervisorService } from "../services/BundlingSupervisorService";
import { encrypt, encryptValue } from '../utils/Utils';
import db from "../../models";
import { QAService } from '../services/QAService';
import { ErrorLogService } from '../services/ErrorLogService';
import { Scheduler } from '../scheduler/Scheduler';
import { RoleService } from '../services/RoleService';
import { DownloadTemplateService } from '../services/DownloadTemplateService';

let orderService = new OrderService();
let ppcService = new PpcService();
let toolShopService = new ToolShopService();
let operatorEntryService = new OperatorEntryService();
let orderUserMappingService = new OrderUserMappingService();
let qaService = new QAService();
let bundlingSupervisorService = new BundlingSupervisorService();
let errorLogService = new ErrorLogService();
let roleService = new RoleService();
let downloadTemplateService = new DownloadTemplateService();

export const resolvers = {
    DateTime: GraphQLDateTime,
    Json: GraphQLJSON,

    Query: {
        getStringData: async (_, { userName, password, headers }, { currentUser }) => {
            try {
                console.log("password ", encryptValue(userName + ':' + password, process.env.SECRET_KEY), " password ", encrypt(password))
                let result = {
                    message: "Welcome to the Jindal Aluminium"
                };
                return result;
            } catch (error) {
                console.log("error ", error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.GET_STRING_DATA, AppConstants?.TRANSTYPE.QUERY, error, currentUser["id"]);
                return error
            }
        },

        getOrderData: async (_, { input }, { currentUser }) => {
            try {
                console.log("Into_the_getOrderData ", input, '\ncurrentUser', currentUser)
                let result = await orderService.orderList(input, currentUser);
                return result;
            } catch (error) {
                console.log("Error_in_getOrderData " + error?.message);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.GET_ORDER_DATA, AppConstants?.TRANSTYPE.QUERY, error?.message, currentUser["id"]);
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },

        getPpcInprogressData: async (_, { orderId }, { currentUser }) => {
            try {
                let orderDetails = await orderService.findUniqueKey(db.tbl_order, orderId);
                if (orderDetails) {
                    let result = await ppcService.getPPCData(orderDetails.id, currentUser["id"], currentUser["roleId"]);
                    return result;
                } else {
                    return AppConstants.INVALID_ID;
                }
            } catch (error) {
                console.log("Error_in_getPpcInprogressData " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.GET_PPC_INPROGRESS_DATA,
                    AppConstants?.TRANSTYPE.QUERY, error, currentUser["id"]);
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },
        getToolShopInprogressData: async (_, { orderId }, { currentUser }) => {
            try {
                let orderDetails = await orderService.findUniqueKey(db.tbl_order, orderId);
                if (orderDetails) {
                    let result = await toolShopService.getToolShopData(orderDetails.id, currentUser["id"], currentUser["roleId"]);
                    return result;
                } else {
                    return AppConstants.INVALID_ID;
                }
            } catch (error) {
                console.log("Error_in_getToolShopInprogressData " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.GET_TOOLSHOP_INPROGRESS_DATA, AppConstants?.TRANSTYPE.QUERY, error, currentUser["id"]);
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },

        getQAInprogressData: async (_, { orderId }, { currentUser }) => {
            try {
                let orderDetails = await orderService.findUniqueKey(db.tbl_order, orderId);
                if (orderDetails) {
                    let result = await qaService.getQAData(orderDetails.id, currentUser["id"], currentUser["roleId"]);
                    return result;
                } else {
                    return AppConstants.INVALID_ID;
                }
            } catch (error) {
                console.log("Error_in_getQAInprogressData " + error);
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },

        getOperatorEntry_inprogressData: async (_, { orderId }, { currentUser }) => {
            try {
                let orderDetails = await orderService.findUniqueKey(db.tbl_order, orderId);
                if (orderDetails) {
                    let result = await operatorEntryService.getOperatorEntryData(orderDetails.id, currentUser["id"], currentUser["roleId"]);
                    result = { ...result, ...await ppcService.getPPCBilletWeight(orderDetails.id) };
                    return result;
                } else {
                    return AppConstants.INVALID_ID;
                }
            } catch (error) {
                console.log("Error_in_getOperatorEntry_inprogressData " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.GET_OPERATORENTRY_INPROGRESS_DATA, AppConstants?.TRANSTYPE.QUERY, error, currentUser["id"]);
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },

        getBundlingSupervisor_inprogressData: async (_, { orderId }, { currentUser }) => {
            try {
                let orderDetails = await orderService.findUniqueKey(db.tbl_order, orderId);
                if (orderDetails) {
                    let result = await bundlingSupervisorService.getBundlingSupervisorData(orderDetails.id, currentUser["id"], currentUser["roleId"]);
                    result = { ...result, ...await operatorEntryService.getOperatorEntryPushOnBillet(orderDetails.id) }
                    return result;
                } else {
                    return AppConstants.INVALID_ID;
                }
            } catch (error) {
                console.log("Error_in_getBundlingSupervisor_inprogressData " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.GET_BUNDLINGSUPERVISOR_INPROGRESS_DATA, AppConstants?.TRANSTYPE.QUERY, error, currentUser["id"]);
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },

        getViewDetails: async (_, { orderId }, { currentUser }) => {
            try {
                let result = await orderService.viewDetailsList(orderId, currentUser);
                return result;
            } catch (error) {
                console.log("Error_in_getViewDetails " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.GET_VIEW_DETAILS, AppConstants?.TRANSTYPE.QUERY, error, currentUser["id"]);
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },

        getReferenceData: async (_, { name }, { currentUser }) => {
            try {
                let result = await ppcService.getReferenceMetaData(name);
                return result;
            } catch (error) {
                console.log("Error_in_getReferenceData " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.GET_REFERENCE_DATA, AppConstants?.TRANSTYPE.QUERY, error, currentUser["id"]);
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },

        getRoleList: async (_, { }, { currentUser }) => {
            try {
                let result = await roleService.roleList();
                return result;
            } catch (error) {
                console.log("Error_in_getRoleList " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.GET_ROLE_LIST, AppConstants?.TRANSTYPE.QUERY, error, currentUser["id"]);
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },

        getReportData: async (_, { input }, { currentUser }) => {
            try {
                let result = await orderService.getReportList(input);
                return result;
            } catch (error) {
                console.log("Error_in_getReportData " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.GET_REPORT_DATA, AppConstants?.TRANSTYPE.QUERY, error, currentUser["id"]);
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        }
    },

    Mutation: {
        createOrUpdatePpcData: async (_, { input }, { currentUser }) => {
            let tran = await db.sequelize.transaction();
            try {
                console.log("Into_the_createOrUpdatePpcData ", input)
                let result = await ppcService.createOrUpdatePpcStatus(input, currentUser, tran);
                tran.commit();
                return result;
            } catch (error) {
                console.log("Error_in_createOrUpdatePpcData " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.CREATE_OR_UPDATE_PPCDATA, AppConstants?.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },
        updateOrderStatus_withMapping: async (_, { input }, { currentUser }) => {
            let tran = await db.sequelize.transaction();
            try {
                console.log("Into_the_updateOrderStatus_withMapping " + input["orderId"], ' ' + input["type"],currentUser)
                let result = await orderUserMappingService.orderStatusUpdate(input, currentUser, tran);
                tran.commit();
                return result;
            } catch (error) {
                console.log("Error_in_updateOrderStatus_withMapping " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.UPDATE_ORDERSTATUS_WITHMAPPING, AppConstants?.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },
        createOrUpdateToolShopData: async (_, { input }, { currentUser }) => {
            let tran = await db.sequelize.transaction();
            try {
                console.log("Into_the_createOrUpdateToolShopData ", input)
                let result = await toolShopService.createOrUpdateToolShopData(input, currentUser, tran);
                tran.commit();
                return result;
            } catch (error) {
                console.log("Error_in_createOrUpdateToolShopData " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.CREATE_OR_UPDATE_TOOLSHOPDATA, AppConstants?.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },
        createOrUpdateOperatorEntryData: async (_, { input }, { currentUser }) => {
            let tran = await db.sequelize.transaction();
            try {
                console.log("Into_the_createOrUpdateOperatorEntryData ", input)
                let result = await operatorEntryService.createOrUpdateOperatorEntryData(input, currentUser, tran);
                tran.commit();
                return result;
            } catch (error) {
                console.log("Error_in_createOrUpdateOperatorEntryData " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.CREATE_OR_UPDATE_OPERATORENTRYDATA, AppConstants?.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },

        createOrUpdateQAData: async (_, { input }, { currentUser }) => {
            let tran = await db.sequelize.transaction();
            try {
                let result = await qaService.createOrUpdateQaData(input, currentUser, tran);
                tran.commit();
                return result;
            } catch (error) {
                console.log("Error_in_createOrUpdateQAData " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.CREATE_OR_UPDATE_QADATA, AppConstants?.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },

        createOrUpdateBundlingSupervisor: async (_, { input }, { currentUser }) => {
            let tran = await db.sequelize.transaction();
            try {
                console.log("Into_the_createOrUpdateBundlingSupervisor ", input)
                let result = await bundlingSupervisorService.createOrUpdatebundlingSupervisorData(input, currentUser, tran);
                tran.commit();
                return result;
            } catch (error) {
                console.log("Error_in_createOrUpdateBundlingSupervisor " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.CREATE_OR_UPDATE_BUNDLINGSUPERVISOR, AppConstants?.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },

        reassignOrder: async (_, { input }, { currentUser }) => {
            let tran = await db.sequelize.transaction();
            try {
                console.log("into the resolver")
                let result = await orderService.reassignOrderIdWorkFlow(input, currentUser, tran)
                tran.commit();
                return result;
            } catch (error) {
                console.log("Error_in_createOrUpdateBundlingSupervisor " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.CREATE_OR_UPDATE_BUNDLINGSUPERVISOR, AppConstants?.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },

        manualOrderSync: async (_, { }, { currentUser }) => {
            let tran = await db.sequelize.transaction();
            try {
                let scheduler = new Scheduler();
                let isThere_anyData_toPull = await scheduler.checkDatasToPull();
                if (isThere_anyData_toPull) {
                    let jobDetails = await scheduler.createJob(null, {});
                    // let result = await scheduler.insertJobDetails(jobDetails.id);
                    if (jobDetails) {
                        tran.commit();
                        return AppConstants.CREATED_SUCCESSFULLY;
                    }
                    else {
                        tran.commit();
                        return AppConstants.PROBLEM_WHILE_CREATING;
                    }
                } else {
                    tran.commit();
                    return AppConstants.NOTHING_TO_PULL;
                }
            } catch (error) {
                console.log("Error_in_manualOrderSync " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.MANUAL_ORDER_SYNC, AppConstants?.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        },

        downloadDashboardAsExcel: async (_, { input }, { currentUser }) => {
            try {
                let dataHeaders = await downloadTemplateService.getDownloadTemplate(input.headers, AppConstants.ZERO, null);
                let array = dataHeaders.map(e => e.queryAndFunction)
                let data = await orderService.getDashboardDownloadList(input, array.toString());
                let result = await orderService.excelConversionForDashboard(data, input.headers, dataHeaders);
                return result;
            } catch (error) {
                console.log("Error_in_downloadDashboardAsExcel " + error);
                await errorLogService.errorLog(AppConstants?.SCHEMA_NAME?.DOWNLOAD_DASHBOARD_AS_EXCEL, AppConstants?.TRANSTYPE.MUTATION, error, currentUser["id"]);
                return AppConstants.SOMETHING_WENT_WRONG + " " + error;
            }
        }
    }
}    
