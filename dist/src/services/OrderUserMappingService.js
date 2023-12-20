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
exports.OrderUserMappingService = void 0;
const typedi_1 = require("typedi");
const BaseService_1 = __importDefault(require("./BaseService"));
const models_1 = __importDefault(require("../../models"));
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
const Utils_1 = require("../utils/Utils");
const OrderService_1 = require("./OrderService");
const OrderTimeTrackService_1 = require("./OrderTimeTrackService");
const Enums_1 = require("../enums/Enums");
let orderService = new OrderService_1.OrderService();
let orderTimeTrack = new OrderTimeTrackService_1.OrderTimeTrackService();
let OrderUserMappingService = class OrderUserMappingService extends BaseService_1.default {
    getModel() {
        return models_1.default.tbl_orderUserMapping;
    }
    orderStatusUpdate(input, currentUser, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result;
                let alreadyPicked = [];
                if (input["type"] == Appconstants_1.default.PICK) {
                    let { workFlowId } = yield orderService.getWorkFlow_fromEnum({ type: Appconstants_1.default.PENDING }, currentUser);
                    let orderDetails = yield this.getSelectedOrders(input["orderId"]);
                    if ((0, Utils_1.isArrayPopulated)(orderDetails)) {
                        let arrOrderId = [];
                        for (let order of orderDetails) {
                            if (workFlowId == order.workFlowId) {
                                arrOrderId.push(order.id);
                            }
                            else {
                                alreadyPicked.push(order.material_code.slice(-7));
                            }
                        }
                        if ((0, Utils_1.isArrayPopulated)(arrOrderId)) {
                            yield this.saveOrderUserMapping(arrOrderId, currentUser["id"], tran);
                            let { workFlowId } = yield orderService.getWorkFlow_fromEnum({ type: Appconstants_1.default.INPROGRESS }, currentUser);
                            result = yield orderService.updateOrderStatus(arrOrderId, workFlowId[0], currentUser, tran);
                            yield orderTimeTrack.multipleTrackLoop(arrOrderId, workFlowId, currentUser, tran);
                        }
                    }
                    else {
                        return Appconstants_1.default.INVALID_ID;
                    }
                }
                else if (input["type"] == Appconstants_1.default.HOLD) {
                    input["roleData"].orderId = input["orderId"][0];
                    let updateResult = yield orderService.roleBasedDataUpdate(input["roleData"], currentUser, tran);
                    let orderDetails = yield this.findUniqueKey(models_1.default.tbl_order, input["orderId"][0]);
                    if (orderDetails && updateResult != Appconstants_1.default.INVALID_ID) {
                        let { workFlowId } = yield orderService.getWorkFlow_fromEnum(input, currentUser);
                        result = yield orderService.updateOrderStatus(orderDetails.id, workFlowId[0], currentUser, tran);
                        yield orderTimeTrack.holdOrderTrack(orderDetails.id, workFlowId[0], currentUser, tran);
                    }
                    else {
                        return Appconstants_1.default.INVALID_ID;
                    }
                }
                else if (input["type"] == Appconstants_1.default.COMPLETED) {
                    console.log("input ", input);
                    if (currentUser["roleId"] == Enums_1.role.PPC || (0, Utils_1.isArrayPopulated)(yield orderService.validateOrder(currentUser["roleId"], input["orderId"][0]))) {
                        input["roleData"].orderId = input["orderId"][0];
                        let updateResult = yield orderService.roleBasedDataUpdate(input["roleData"], currentUser, tran);
                        let orderDetails = yield this.findUniqueKey(models_1.default.tbl_order, input["orderId"][0]);
                        if (orderDetails && updateResult != Appconstants_1.default.INVALID_ID) {
                            let { completedId } = yield orderService.getWorkFlow_fromEnum(input, currentUser);
                            result = yield orderService.updateOrderStatus(orderDetails.id, completedId[0], currentUser, tran);
                            yield orderTimeTrack.completedOrderTrack(orderDetails.id, currentUser, tran);
                        }
                        else {
                            return Appconstants_1.default.INVALID_ID;
                        }
                    }
                    else {
                        return Appconstants_1.default.SOMETHING_WENT_WRONG;
                    }
                }
                else {
                    return Appconstants_1.default.INVALID_TYPE;
                }
                if ((0, Utils_1.isArrayPopulated)(result) ? result[0] : result)
                    return { "Message": Appconstants_1.default.UPDATED_SUCCESSFULLY, "alreadyPicked": alreadyPicked };
                else if ((0, Utils_1.isArrayPopulated)(alreadyPicked))
                    return { "Message": Appconstants_1.default.NO_RECORDS_TO_UPDATE, "alreadyPicked": alreadyPicked };
                else
                    return Appconstants_1.default.PROBLEM_WHILE_UPDATING;
            }
            catch (error) {
                console.log("Error_in_orderStatusUpdate " + error);
                throw error;
            }
        });
    }
    saveOrderUserMapping(orderId, userId, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dataArr = [];
                if ((0, Utils_1.isArrayPopulated)(orderId)) {
                    for (const id of orderId) {
                        let orderUserMappingObj = new models_1.default.tbl_orderUserMapping();
                        orderUserMappingObj.uniqueKey = (0, Utils_1.uuidv4)();
                        orderUserMappingObj.userId = userId;
                        orderUserMappingObj.orderId = id;
                        orderUserMappingObj.createdBy = userId;
                        orderUserMappingObj.createdOn = new Date(new Date().toUTCString());
                        orderUserMappingObj.isDeleted = Appconstants_1.default.ZERO;
                        dataArr.push(yield this.splitDataValuesFromData(orderUserMappingObj));
                    }
                }
                // let result = await this.createOrUpdateByModel(db.tbl_orderUserMapping, orderUserMappingObj);
                let result = yield this.bulkCreation(dataArr, tran);
                return result;
            }
            catch (error) {
                console.log("Error_in_saveOrderUserMapping " + error);
                throw error;
            }
        });
    }
    getSelectedOrders(orderIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield models_1.default.tbl_order.findAll({
                    where: {
                        isActive: Appconstants_1.default.ONE,
                        isDeleted: Appconstants_1.default.ZERO,
                        uniqueKey: orderIds
                    },
                    raw: true
                });
                return result;
            }
            catch (error) {
                console.log("Error_in_getSelectedOrders " + error);
                throw error;
            }
        });
    }
};
OrderUserMappingService = __decorate([
    (0, typedi_1.Service)()
], OrderUserMappingService);
exports.OrderUserMappingService = OrderUserMappingService;
//# sourceMappingURL=OrderUserMappingService.js.map