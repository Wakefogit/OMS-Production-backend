import db from "../../models";
import BaseService from "./BaseService";
import { Service } from "typedi";
import AppConstants from "../constants/Appconstants";

@Service()
export class OrderTimeTrackService extends BaseService<any>{
    getModel() {
        return db.tbl_orderTimeTrack;
    }

    public async findOrderTrack(orderId, currentUser) {
        try {
            let response = await this.getModel().findAll({
                where: { orderId: orderId, userId: currentUser["id"], isDeleted: 0 },
                raw: true
            });
            console.log("response.dataValues", response);
            return response;
        } catch (error) {
            console.log("Error occurred in Unique Key " + error);
            throw error
        }
    }

    public async multiplePickOrderTrack(input: any, tran) {
        try {
            await this.bulkCreation(input, tran)
        } catch (error) {
            console.log("Error_in_multiplePickOrderTrack " + error);
            throw error
        }
    }

    public async holdOrderTrack(orderId, workFlowId, currentUser, tran) {
        try {
            let orderTrackDataObj = new db.tbl_orderTimeTrack();
            orderTrackDataObj.orderId = orderId;
            orderTrackDataObj.workflowId = workFlowId;
            orderTrackDataObj.userId = currentUser["id"];
            orderTrackDataObj.startTime = new Date(new Date().toUTCString());
            orderTrackDataObj.createdBy = currentUser["id"];
            orderTrackDataObj.createdOn = new Date(new Date().toUTCString());
            await this.createOrUpdateByModel(db.tbl_orderTimeTrack, orderTrackDataObj, tran);
        } catch (error) {
            console.log("Error_in_holdOrderTrack " + error);
            throw error
        }
    }

    public async completedOrderTrack(orderId, currentUser, tran) {
        try {
            let alreadyHaveTrack = await this.findOrderTrack(orderId, currentUser);
            if (alreadyHaveTrack) {
                for (var data of alreadyHaveTrack) {
                    let orderTrackDataObj = new db.tbl_orderTimeTrack();
                    orderTrackDataObj.id = data?.id;
                    orderTrackDataObj.endTime = new Date(new Date().toUTCString());
                    orderTrackDataObj.updatedBy = currentUser["id"];
                    orderTrackDataObj.updatedOn = new Date(new Date().toUTCString());
                    await this.createOrUpdateByModel(db.tbl_orderTimeTrack, orderTrackDataObj, tran);
                }
            } else {
                return null
            }
        } catch (error) {
            console.log("Error_in_completedOrderTrack " + error);
            throw error
        }
    }

    public async multipleTrackLoop(arrOrderId, workFlowId, currentUser, tran) {
        try {
            let orderTrackDataObj;
            let orderTrackArr = [];
            for (let id of arrOrderId) {
                orderTrackDataObj = new db.tbl_orderTimeTrack();
                orderTrackDataObj.orderId = id;
                orderTrackDataObj.workflowId = workFlowId[0];
                orderTrackDataObj.userId = currentUser["id"];
                orderTrackDataObj.startTime = new Date(new Date().toUTCString());
                orderTrackDataObj.endTime = null;
                orderTrackDataObj.createdBy = currentUser["id"];
                orderTrackDataObj.createdOn = new Date(new Date().toUTCString());
                orderTrackDataObj.isDeleted = AppConstants.ZERO
                orderTrackArr.push(orderTrackDataObj.dataValues);
            }
            await this.multiplePickOrderTrack(orderTrackArr, tran);
        } catch (error) {
            console.log("Error_in_multipleTrackLoop " + error);
            throw error
        }
    }

}