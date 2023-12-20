import { Service } from "typedi";
import BaseService from "./BaseService";
import db from "../../models";
import AppConstants from "../constants/Appconstants";
import { isArrayPopulated, uuidv4 } from "../utils/Utils";
import { OrderService } from "./OrderService";
import { OrderTimeTrackService } from "./OrderTimeTrackService";
import { role } from "../enums/Enums";

let orderService = new OrderService();
let orderTimeTrack = new OrderTimeTrackService();

@Service()
export class OrderUserMappingService extends BaseService<any> {
    getModel() {
        return db.tbl_orderUserMapping;
    }

    public async orderStatusUpdate(input: Object, currentUser: Object, tran) {
        try {
            let result;
            let alreadyPicked = [];
            if (input["type"] == AppConstants.PICK) {
                let { workFlowId } = await orderService.getWorkFlow_fromEnum(
                    { type: AppConstants.PENDING }, currentUser)
                let orderDetails = await this.getSelectedOrders(input["orderId"]);
                if (isArrayPopulated(orderDetails)) {
                    let arrOrderId = [];
                    for (let order of orderDetails) {
                        if (workFlowId == order.workFlowId) {
                            arrOrderId.push(order.id);
                        } else {
                            alreadyPicked.push(order.material_code.slice(-7))
                        }
                    }
                    if (isArrayPopulated(arrOrderId)) {
                        await this.saveOrderUserMapping(arrOrderId, currentUser["id"], tran);
                        let { workFlowId } = await orderService.getWorkFlow_fromEnum(
                            { type: AppConstants.INPROGRESS }, currentUser)
                        result = await orderService.updateOrderStatus(arrOrderId, workFlowId[0],
                            currentUser, tran);
                        await orderTimeTrack.multipleTrackLoop(arrOrderId, workFlowId, currentUser, tran);
                    }
                } else {
                    return AppConstants.INVALID_ID;
                }
            } else if (input["type"] == AppConstants.HOLD) {
                input["roleData"].orderId = input["orderId"][0];
                let updateResult = await orderService.roleBasedDataUpdate(input["roleData"], currentUser, tran);
                let orderDetails = await this.findUniqueKey(db.tbl_order, input["orderId"][0]);
                if (orderDetails && updateResult != AppConstants.INVALID_ID) {
                    let { workFlowId } = await orderService.getWorkFlow_fromEnum(
                        input, currentUser)
                    result = await orderService.updateOrderStatus(orderDetails.id, workFlowId[0],
                        currentUser, tran);

                    await orderTimeTrack.holdOrderTrack(orderDetails.id, workFlowId[0], currentUser, tran);
                } else {
                    return AppConstants.INVALID_ID;
                }
            } else if (input["type"] == AppConstants.COMPLETED) {
                console.log("input ", input)
                if (currentUser["roleId"] == role.PPC || isArrayPopulated(await orderService.validateOrder(currentUser["roleId"], input["orderId"][0]))) {
                    input["roleData"].orderId = input["orderId"][0];
                    let updateResult = await orderService.roleBasedDataUpdate(input["roleData"], currentUser, tran);
                    let orderDetails = await this.findUniqueKey(db.tbl_order, input["orderId"][0]);
                    if (orderDetails && updateResult != AppConstants.INVALID_ID) {
                        let { completedId } = await orderService.getWorkFlow_fromEnum(
                            input, currentUser)
                        result = await orderService.updateOrderStatus(orderDetails.id, completedId[0],
                            currentUser, tran);
                        await orderTimeTrack.completedOrderTrack(orderDetails.id, currentUser, tran);
                    } else {
                        return AppConstants.INVALID_ID;
                    }
                } else {
                    return AppConstants.SOMETHING_WENT_WRONG;
                }
            } else {
                return AppConstants.INVALID_TYPE;
            }
            if (isArrayPopulated(result) ? result[0] : result)
                return { "Message": AppConstants.UPDATED_SUCCESSFULLY, "alreadyPicked": alreadyPicked };
            else if (isArrayPopulated(alreadyPicked))
                return { "Message": AppConstants.NO_RECORDS_TO_UPDATE, "alreadyPicked": alreadyPicked };
            else
                return AppConstants.PROBLEM_WHILE_UPDATING;
        } catch (error) {
            console.log("Error_in_orderStatusUpdate " + error);
            throw error;
        }
    }

    public async saveOrderUserMapping(orderId: number[], userId: number, tran) {
        try {
            let dataArr = [];
            if (isArrayPopulated(orderId)) {
                for (const id of orderId) {
                    let orderUserMappingObj = new db.tbl_orderUserMapping();
                    orderUserMappingObj.uniqueKey = uuidv4();
                    orderUserMappingObj.userId = userId;
                    orderUserMappingObj.orderId = id;
                    orderUserMappingObj.createdBy = userId;
                    orderUserMappingObj.createdOn = new Date(new Date().toUTCString());
                    orderUserMappingObj.isDeleted = AppConstants.ZERO
                    dataArr.push(await this.splitDataValuesFromData(orderUserMappingObj));
                }
            }
            // let result = await this.createOrUpdateByModel(db.tbl_orderUserMapping, orderUserMappingObj);
            let result = await this.bulkCreation(dataArr, tran);
            return result;
        } catch (error) {
            console.log("Error_in_saveOrderUserMapping " + error);
            throw error;
        }
    }

    public async getSelectedOrders(orderIds: string[]) {
        try {
            let result = await db.tbl_order.findAll({
                where: {
                    isActive: AppConstants.ONE,
                    isDeleted: AppConstants.ZERO,
                    uniqueKey: orderIds
                },
                raw: true
            });
            return result;
        } catch (error) {
            console.log("Error_in_getSelectedOrders " + error);
            throw error;
        }
    }

}