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
exports.OrderTimeTrackService = void 0;
const models_1 = __importDefault(require("../../models"));
const BaseService_1 = __importDefault(require("./BaseService"));
const typedi_1 = require("typedi");
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
let OrderTimeTrackService = class OrderTimeTrackService extends BaseService_1.default {
    getModel() {
        return models_1.default.tbl_orderTimeTrack;
    }
    findOrderTrack(orderId, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield this.getModel().findAll({
                    where: { orderId: orderId, userId: currentUser["id"], isDeleted: 0 },
                    raw: true
                });
                console.log("response.dataValues", response);
                return response;
            }
            catch (error) {
                console.log("Error occurred in Unique Key " + error);
                throw error;
            }
        });
    }
    multiplePickOrderTrack(input, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.bulkCreation(input, tran);
            }
            catch (error) {
                console.log("Error_in_multiplePickOrderTrack " + error);
                throw error;
            }
        });
    }
    holdOrderTrack(orderId, workFlowId, currentUser, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let orderTrackDataObj = new models_1.default.tbl_orderTimeTrack();
                orderTrackDataObj.orderId = orderId;
                orderTrackDataObj.workflowId = workFlowId;
                orderTrackDataObj.userId = currentUser["id"];
                orderTrackDataObj.startTime = new Date(new Date().toUTCString());
                orderTrackDataObj.createdBy = currentUser["id"];
                orderTrackDataObj.createdOn = new Date(new Date().toUTCString());
                yield this.createOrUpdateByModel(models_1.default.tbl_orderTimeTrack, orderTrackDataObj, tran);
            }
            catch (error) {
                console.log("Error_in_holdOrderTrack " + error);
                throw error;
            }
        });
    }
    completedOrderTrack(orderId, currentUser, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let alreadyHaveTrack = yield this.findOrderTrack(orderId, currentUser);
                if (alreadyHaveTrack) {
                    for (var data of alreadyHaveTrack) {
                        let orderTrackDataObj = new models_1.default.tbl_orderTimeTrack();
                        orderTrackDataObj.id = data === null || data === void 0 ? void 0 : data.id;
                        orderTrackDataObj.endTime = new Date(new Date().toUTCString());
                        orderTrackDataObj.updatedBy = currentUser["id"];
                        orderTrackDataObj.updatedOn = new Date(new Date().toUTCString());
                        yield this.createOrUpdateByModel(models_1.default.tbl_orderTimeTrack, orderTrackDataObj, tran);
                    }
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log("Error_in_completedOrderTrack " + error);
                throw error;
            }
        });
    }
    multipleTrackLoop(arrOrderId, workFlowId, currentUser, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let orderTrackDataObj;
                let orderTrackArr = [];
                for (let id of arrOrderId) {
                    orderTrackDataObj = new models_1.default.tbl_orderTimeTrack();
                    orderTrackDataObj.orderId = id;
                    orderTrackDataObj.workflowId = workFlowId[0];
                    orderTrackDataObj.userId = currentUser["id"];
                    orderTrackDataObj.startTime = new Date(new Date().toUTCString());
                    orderTrackDataObj.endTime = null;
                    orderTrackDataObj.createdBy = currentUser["id"];
                    orderTrackDataObj.createdOn = new Date(new Date().toUTCString());
                    orderTrackDataObj.isDeleted = Appconstants_1.default.ZERO;
                    orderTrackArr.push(orderTrackDataObj.dataValues);
                }
                yield this.multiplePickOrderTrack(orderTrackArr, tran);
            }
            catch (error) {
                console.log("Error_in_multipleTrackLoop " + error);
                throw error;
            }
        });
    }
};
OrderTimeTrackService = __decorate([
    (0, typedi_1.Service)()
], OrderTimeTrackService);
exports.OrderTimeTrackService = OrderTimeTrackService;
//# sourceMappingURL=OrderTimeTrackService.js.map