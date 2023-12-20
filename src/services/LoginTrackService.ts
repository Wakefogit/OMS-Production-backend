import AppConstants from "../../src/constants/Appconstants";
import db from "../../models";
import BaseService from "./BaseService";
import { ErrorLogService } from "./ErrorLogService";

let errorLogService = new ErrorLogService();

export class LoginTrackService extends BaseService<any>{
    getModel() {
        return db.tbl_loginTrack;
    }

    public async logInAndOutTrack(currentUserId: String, sessionToken: string, logStatus: string) {
        try {
            let loginUser: any
            let user: any

            let logInOutTrackObj = new db.tbl_loginTrack();
            if (logStatus == AppConstants.LOGIN) {
                loginUser = await this.getLoginUser(currentUserId);
                // loginUser = await db.tbl_user.findByPk(currentUserId);
                if (loginUser) {
                    logInOutTrackObj.id = loginUser.id
                    logInOutTrackObj.isLoggedIn = AppConstants.ZERO
                    logInOutTrackObj.updatedBy = AppConstants.ONE
                    logInOutTrackObj.updatedOn = new Date(new Date().toUTCString())
                }
            } else if (logStatus == AppConstants.LOGOUT) {
                user = await this.findUniqueKey(db.tbl_user, currentUserId);
                loginUser = await this.getLoginUser(user.id);
            }

            if (!loginUser && logStatus == AppConstants.LOGIN) {
                logInOutTrackObj.userId = currentUserId
                logInOutTrackObj.sessionToken = sessionToken
                logInOutTrackObj.isLoggedIn = AppConstants.ONE
                logInOutTrackObj.createdBy = currentUserId
                logInOutTrackObj.createdOn = new Date(new Date().toUTCString());
            } else if (logStatus == AppConstants.LOGOUT) {
                logInOutTrackObj.id = loginUser.id
                logInOutTrackObj.isLoggedIn = AppConstants.ZERO
                logInOutTrackObj.updatedBy = user.id
                logInOutTrackObj.updatedOn = new Date(new Date().toUTCString())
            }
            logInOutTrackObj.isDeleted = AppConstants.ZERO;
            await this.createorUpdateModelWithoutTran(this.getModel(), logInOutTrackObj);
        } catch (error) {
            console.log("Error occurred in login track ", error)
            throw error;
        }
    }

    public async getLoginUser(currentUserId: String) {
        try {
            // let response = await db.tbl_loginTrack.findOne({
            //     where: { userId: currentUserId, isLoggedIn: 1, isActive: 1, isDeleted: 0 },
            //     order: [['id', 'DESC']],
            //     raw: true
            // })
            let response = await db.tbl_loginTrack.findOne({
                attributes:['id'],
                where: { userId: currentUserId, isLoggedIn: 1, isActive: 1, isDeleted: 0 },
                order: [['id', 'DESC']],
                raw: true
            })
            return response
        } catch (error) {
            console.log("Error occurred in getLoginUser " + error);
            throw error
        }
    }

    public async getUser(userId: any) {
        try {
            let response = await db.tbl_user.findOne({
                where: { uniqueKey: userId, isActive: AppConstants.ONE, isDeleted: AppConstants.ZERO },
                raw: true
            })
            return response;
        } catch (error) {
            console.log("Error occurred in getUser" + error);
            throw error
        }
    }

}