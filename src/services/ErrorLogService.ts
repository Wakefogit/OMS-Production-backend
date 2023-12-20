import AppConstants from "../constants/Appconstants";
import db from "../../models";
import BaseService from "./BaseService";

export class ErrorLogService extends BaseService<any>{
    getModel() {
        return db.tbl_errorLog;
    }

    public async errorLog(schemaName: string, transType: string, message: any, currentUserId: any) {
        let tran2 = await db.sequelize.transaction();
        try {
            console.log("message ", message)
            let errorLogObj = new db.tbl_errorLog();
            errorLogObj.schemaName = schemaName;
            errorLogObj.transType = transType;
            errorLogObj.message = JSON.stringify(message);
            errorLogObj.createdBy = currentUserId;
            errorLogObj.createdOn = new Date(new Date().toUTCString());
            errorLogObj.isDeleted = AppConstants.ZERO;
            console.log("errorLogObj ", errorLogObj);
            await this.createOrUpdateByModel(db.tbl_errorLog, errorLogObj, tran2);
            tran2.commit();
        } catch (error) {
            tran2.rollback();
            console.log("Error occurred in login track ", error);
            throw error;
        }

    }
}