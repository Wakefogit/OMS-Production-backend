"use strict";
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
exports.resolvers = void 0;
const graphql_type_datetime_1 = __importDefault(require("graphql-type-datetime"));
const graphql_type_json_1 = __importDefault(require("graphql-type-json"));
const PpcService_1 = require("../services/PpcService");
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
const OrderService_1 = require("../services/OrderService");
const ToolShopService_1 = require("../services/ToolShopService");
const OperatorEntryService_1 = require("../services/OperatorEntryService");
const OrderUserMappingService_1 = require("../services/OrderUserMappingService");
const BundlingSupervisorService_1 = require("../services/BundlingSupervisorService");
const Utils_1 = require("../utils/Utils");
const models_1 = __importDefault(require("../../models"));
const QAService_1 = require("../services/QAService");
const ErrorLogService_1 = require("../services/ErrorLogService");
const Scheduler_1 = require("../scheduler/Scheduler");
const RoleService_1 = require("../services/RoleService");
const DownloadTemplateService_1 = require("../services/DownloadTemplateService");
let orderService = new OrderService_1.OrderService();
let ppcService = new PpcService_1.PpcService();
let toolShopService = new ToolShopService_1.ToolShopService();
let operatorEntryService = new OperatorEntryService_1.OperatorEntryService();
let orderUserMappingService = new OrderUserMappingService_1.OrderUserMappingService();
let qaService = new QAService_1.QAService();
let bundlingSupervisorService = new BundlingSupervisorService_1.BundlingSupervisorService();
let errorLogService = new ErrorLogService_1.ErrorLogService();
let roleService = new RoleService_1.RoleService();
let downloadTemplateService = new DownloadTemplateService_1.DownloadTemplateService();
exports.resolvers = {
    DateTime: graphql_type_datetime_1.default,
    Json: graphql_type_json_1.default,
    Query: {
        getStringData: (_, { userName, password, headers }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            try {
                console.log("password ", (0, Utils_1.encryptValue)(userName + ':' + password, process.env.SECRET_KEY), " password ", (0, Utils_1.encrypt)(password));
                let result = {
                    message: "Welcome to the Jindal Aluminium"
                };
                return result;
            }
            catch (error) {
                console.log("error ", error);
                yield errorLogService.errorLog((_a = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _a === void 0 ? void 0 : _a.GET_STRING_DATA, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.QUERY, error, currentUser["id"]);
                return error;
            }
        }),
        getOrderData: (_, { input }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            try {
                console.log("Into_the_getOrderData ", input, '\ncurrentUser', currentUser);
                let result = yield orderService.orderList(input, currentUser);
                return result;
            }
            catch (error) {
                console.log("Error_in_getOrderData " + (error === null || error === void 0 ? void 0 : error.message));
                yield errorLogService.errorLog((_b = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _b === void 0 ? void 0 : _b.GET_ORDER_DATA, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.QUERY, error === null || error === void 0 ? void 0 : error.message, currentUser["id"]);
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        getPpcInprogressData: (_, { orderId }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            try {
                let orderDetails = yield orderService.findUniqueKey(models_1.default.tbl_order, orderId);
                if (orderDetails) {
                    let result = yield ppcService.getPPCData(orderDetails.id, currentUser["id"], currentUser["roleId"]);
                    return result;
                }
                else {
                    return Appconstants_1.default.INVALID_ID;
                }
            }
            catch (error) {
                console.log("Error_in_getPpcInprogressData " + error);
                yield errorLogService.errorLog((_c = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _c === void 0 ? void 0 : _c.GET_PPC_INPROGRESS_DATA, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.QUERY, error, currentUser["id"]);
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        getToolShopInprogressData: (_, { orderId }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _d;
            try {
                let orderDetails = yield orderService.findUniqueKey(models_1.default.tbl_order, orderId);
                if (orderDetails) {
                    let result = yield toolShopService.getToolShopData(orderDetails.id, currentUser["id"], currentUser["roleId"]);
                    return result;
                }
                else {
                    return Appconstants_1.default.INVALID_ID;
                }
            }
            catch (error) {
                console.log("Error_in_getToolShopInprogressData " + error);
                yield errorLogService.errorLog((_d = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _d === void 0 ? void 0 : _d.GET_TOOLSHOP_INPROGRESS_DATA, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.QUERY, error, currentUser["id"]);
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        getQAInprogressData: (_, { orderId }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let orderDetails = yield orderService.findUniqueKey(models_1.default.tbl_order, orderId);
                if (orderDetails) {
                    let result = yield qaService.getQAData(orderDetails.id, currentUser["id"], currentUser["roleId"]);
                    return result;
                }
                else {
                    return Appconstants_1.default.INVALID_ID;
                }
            }
            catch (error) {
                console.log("Error_in_getQAInprogressData " + error);
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        getOperatorEntry_inprogressData: (_, { orderId }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _e;
            try {
                let orderDetails = yield orderService.findUniqueKey(models_1.default.tbl_order, orderId);
                if (orderDetails) {
                    let result = yield operatorEntryService.getOperatorEntryData(orderDetails.id, currentUser["id"], currentUser["roleId"]);
                    result = Object.assign(Object.assign({}, result), yield ppcService.getPPCBilletWeight(orderDetails.id));
                    return result;
                }
                else {
                    return Appconstants_1.default.INVALID_ID;
                }
            }
            catch (error) {
                console.log("Error_in_getOperatorEntry_inprogressData " + error);
                yield errorLogService.errorLog((_e = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _e === void 0 ? void 0 : _e.GET_OPERATORENTRY_INPROGRESS_DATA, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.QUERY, error, currentUser["id"]);
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        getBundlingSupervisor_inprogressData: (_, { orderId }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _f;
            try {
                let orderDetails = yield orderService.findUniqueKey(models_1.default.tbl_order, orderId);
                if (orderDetails) {
                    let result = yield bundlingSupervisorService.getBundlingSupervisorData(orderDetails.id, currentUser["id"], currentUser["roleId"]);
                    result = Object.assign(Object.assign({}, result), yield operatorEntryService.getOperatorEntryPushOnBillet(orderDetails.id));
                    return result;
                }
                else {
                    return Appconstants_1.default.INVALID_ID;
                }
            }
            catch (error) {
                console.log("Error_in_getBundlingSupervisor_inprogressData " + error);
                yield errorLogService.errorLog((_f = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _f === void 0 ? void 0 : _f.GET_BUNDLINGSUPERVISOR_INPROGRESS_DATA, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.QUERY, error, currentUser["id"]);
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        getViewDetails: (_, { orderId }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _g;
            try {
                let result = yield orderService.viewDetailsList(orderId, currentUser);
                return result;
            }
            catch (error) {
                console.log("Error_in_getViewDetails " + error);
                yield errorLogService.errorLog((_g = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _g === void 0 ? void 0 : _g.GET_VIEW_DETAILS, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.QUERY, error, currentUser["id"]);
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        getReferenceData: (_, { name }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _h;
            try {
                let result = yield ppcService.getReferenceMetaData(name);
                return result;
            }
            catch (error) {
                console.log("Error_in_getReferenceData " + error);
                yield errorLogService.errorLog((_h = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _h === void 0 ? void 0 : _h.GET_REFERENCE_DATA, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.QUERY, error, currentUser["id"]);
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        getRoleList: (_, {}, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _j;
            try {
                let result = yield roleService.roleList();
                return result;
            }
            catch (error) {
                console.log("Error_in_getRoleList " + error);
                yield errorLogService.errorLog((_j = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _j === void 0 ? void 0 : _j.GET_ROLE_LIST, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.QUERY, error, currentUser["id"]);
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        getReportData: (_, { input }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _k;
            try {
                let result = yield orderService.getReportList(input);
                return result;
            }
            catch (error) {
                console.log("Error_in_getReportData " + error);
                yield errorLogService.errorLog((_k = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _k === void 0 ? void 0 : _k.GET_REPORT_DATA, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.QUERY, error, currentUser["id"]);
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        })
    },
    Mutation: {
        createOrUpdatePpcData: (_, { input }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _l;
            let tran = yield models_1.default.sequelize.transaction();
            try {
                console.log("Into_the_createOrUpdatePpcData ", input);
                let result = yield ppcService.createOrUpdatePpcStatus(input, currentUser, tran);
                tran.commit();
                return result;
            }
            catch (error) {
                console.log("Error_in_createOrUpdatePpcData " + error);
                yield errorLogService.errorLog((_l = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _l === void 0 ? void 0 : _l.CREATE_OR_UPDATE_PPCDATA, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        updateOrderStatus_withMapping: (_, { input }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _m;
            let tran = yield models_1.default.sequelize.transaction();
            try {
                console.log("Into_the_updateOrderStatus_withMapping " + input["orderId"], ' ' + input["type"], currentUser);
                let result = yield orderUserMappingService.orderStatusUpdate(input, currentUser, tran);
                tran.commit();
                return result;
            }
            catch (error) {
                console.log("Error_in_updateOrderStatus_withMapping " + error);
                yield errorLogService.errorLog((_m = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _m === void 0 ? void 0 : _m.UPDATE_ORDERSTATUS_WITHMAPPING, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        createOrUpdateToolShopData: (_, { input }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _o;
            let tran = yield models_1.default.sequelize.transaction();
            try {
                console.log("Into_the_createOrUpdateToolShopData ", input);
                let result = yield toolShopService.createOrUpdateToolShopData(input, currentUser, tran);
                tran.commit();
                return result;
            }
            catch (error) {
                console.log("Error_in_createOrUpdateToolShopData " + error);
                yield errorLogService.errorLog((_o = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _o === void 0 ? void 0 : _o.CREATE_OR_UPDATE_TOOLSHOPDATA, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        createOrUpdateOperatorEntryData: (_, { input }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _p;
            let tran = yield models_1.default.sequelize.transaction();
            try {
                console.log("Into_the_createOrUpdateOperatorEntryData ", input);
                let result = yield operatorEntryService.createOrUpdateOperatorEntryData(input, currentUser, tran);
                tran.commit();
                return result;
            }
            catch (error) {
                console.log("Error_in_createOrUpdateOperatorEntryData " + error);
                yield errorLogService.errorLog((_p = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _p === void 0 ? void 0 : _p.CREATE_OR_UPDATE_OPERATORENTRYDATA, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        createOrUpdateQAData: (_, { input }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _q;
            let tran = yield models_1.default.sequelize.transaction();
            try {
                let result = yield qaService.createOrUpdateQaData(input, currentUser, tran);
                tran.commit();
                return result;
            }
            catch (error) {
                console.log("Error_in_createOrUpdateQAData " + error);
                yield errorLogService.errorLog((_q = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _q === void 0 ? void 0 : _q.CREATE_OR_UPDATE_QADATA, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        createOrUpdateBundlingSupervisor: (_, { input }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _r;
            let tran = yield models_1.default.sequelize.transaction();
            try {
                console.log("Into_the_createOrUpdateBundlingSupervisor ", input);
                let result = yield bundlingSupervisorService.createOrUpdatebundlingSupervisorData(input, currentUser, tran);
                tran.commit();
                return result;
            }
            catch (error) {
                console.log("Error_in_createOrUpdateBundlingSupervisor " + error);
                yield errorLogService.errorLog((_r = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _r === void 0 ? void 0 : _r.CREATE_OR_UPDATE_BUNDLINGSUPERVISOR, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        reassignOrder: (_, { input }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _s;
            let tran = yield models_1.default.sequelize.transaction();
            try {
                console.log("into the resolver");
                let result = yield orderService.reassignOrderIdWorkFlow(input, currentUser, tran);
                tran.commit();
                return result;
            }
            catch (error) {
                console.log("Error_in_createOrUpdateBundlingSupervisor " + error);
                yield errorLogService.errorLog((_s = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _s === void 0 ? void 0 : _s.CREATE_OR_UPDATE_BUNDLINGSUPERVISOR, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        manualOrderSync: (_, {}, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _t;
            let tran = yield models_1.default.sequelize.transaction();
            try {
                let scheduler = new Scheduler_1.Scheduler();
                let isThere_anyData_toPull = yield scheduler.checkDatasToPull();
                if (isThere_anyData_toPull) {
                    let jobDetails = yield scheduler.createJob(null, {});
                    // let result = await scheduler.insertJobDetails(jobDetails.id);
                    if (jobDetails) {
                        tran.commit();
                        return Appconstants_1.default.CREATED_SUCCESSFULLY;
                    }
                    else {
                        tran.commit();
                        return Appconstants_1.default.PROBLEM_WHILE_CREATING;
                    }
                }
                else {
                    tran.commit();
                    return Appconstants_1.default.NOTHING_TO_PULL;
                }
            }
            catch (error) {
                console.log("Error_in_manualOrderSync " + error);
                yield errorLogService.errorLog((_t = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _t === void 0 ? void 0 : _t.MANUAL_ORDER_SYNC, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.MUTATION, error, currentUser["id"]);
                tran.rollback();
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        }),
        downloadDashboardAsExcel: (_, { input }, { currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            var _u;
            try {
                let dataHeaders = yield downloadTemplateService.getDownloadTemplate(input.headers, Appconstants_1.default.ZERO, null);
                let array = dataHeaders.map(e => e.queryAndFunction);
                let data = yield orderService.getDashboardDownloadList(input, array.toString());
                let result = yield orderService.excelConversionForDashboard(data, input.headers, dataHeaders);
                return result;
            }
            catch (error) {
                console.log("Error_in_downloadDashboardAsExcel " + error);
                yield errorLogService.errorLog((_u = Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.SCHEMA_NAME) === null || _u === void 0 ? void 0 : _u.DOWNLOAD_DASHBOARD_AS_EXCEL, Appconstants_1.default === null || Appconstants_1.default === void 0 ? void 0 : Appconstants_1.default.TRANSTYPE.MUTATION, error, currentUser["id"]);
                return Appconstants_1.default.SOMETHING_WENT_WRONG + " " + error;
            }
        })
    }
};
//# sourceMappingURL=resolver.js.map