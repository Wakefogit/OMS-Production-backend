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
exports.LoginTrackService = void 0;
const Appconstants_1 = __importDefault(require("../../src/constants/Appconstants"));
const models_1 = __importDefault(require("../../models"));
const BaseService_1 = __importDefault(require("./BaseService"));
const ErrorLogService_1 = require("./ErrorLogService");
let errorLogService = new ErrorLogService_1.ErrorLogService();
class LoginTrackService extends BaseService_1.default {
    getModel() {
        return models_1.default.tbl_loginTrack;
    }
    logInAndOutTrack(currentUserId, sessionToken, logStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let loginUser;
                let user;
                let logInOutTrackObj = new models_1.default.tbl_loginTrack();
                if (logStatus == Appconstants_1.default.LOGIN) {
                    loginUser = yield this.getLoginUser(currentUserId);
                    // loginUser = await db.tbl_user.findByPk(currentUserId);
                    if (loginUser) {
                        logInOutTrackObj.id = loginUser.id;
                        logInOutTrackObj.isLoggedIn = Appconstants_1.default.ZERO;
                        logInOutTrackObj.updatedBy = Appconstants_1.default.ONE;
                        logInOutTrackObj.updatedOn = new Date(new Date().toUTCString());
                    }
                }
                else if (logStatus == Appconstants_1.default.LOGOUT) {
                    user = yield this.findUniqueKey(models_1.default.tbl_user, currentUserId);
                    loginUser = yield this.getLoginUser(user.id);
                }
                if (!loginUser && logStatus == Appconstants_1.default.LOGIN) {
                    logInOutTrackObj.userId = currentUserId;
                    logInOutTrackObj.sessionToken = sessionToken;
                    logInOutTrackObj.isLoggedIn = Appconstants_1.default.ONE;
                    logInOutTrackObj.createdBy = currentUserId;
                    logInOutTrackObj.createdOn = new Date(new Date().toUTCString());
                }
                else if (logStatus == Appconstants_1.default.LOGOUT) {
                    logInOutTrackObj.id = loginUser.id;
                    logInOutTrackObj.isLoggedIn = Appconstants_1.default.ZERO;
                    logInOutTrackObj.updatedBy = user.id;
                    logInOutTrackObj.updatedOn = new Date(new Date().toUTCString());
                }
                logInOutTrackObj.isDeleted = Appconstants_1.default.ZERO;
                yield this.createorUpdateModelWithoutTran(this.getModel(), logInOutTrackObj);
            }
            catch (error) {
                console.log("Error occurred in login track ", error);
                throw error;
            }
        });
    }
    getLoginUser(currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // let response = await db.tbl_loginTrack.findOne({
                //     where: { userId: currentUserId, isLoggedIn: 1, isActive: 1, isDeleted: 0 },
                //     order: [['id', 'DESC']],
                //     raw: true
                // })
                let response = yield models_1.default.tbl_loginTrack.findOne({
                    attributes: ['id'],
                    where: { userId: currentUserId, isLoggedIn: 1, isActive: 1, isDeleted: 0 },
                    order: [['id', 'DESC']],
                    raw: true
                });
                return response;
            }
            catch (error) {
                console.log("Error occurred in getLoginUser " + error);
                throw error;
            }
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield models_1.default.tbl_user.findOne({
                    where: { uniqueKey: userId, isActive: Appconstants_1.default.ONE, isDeleted: Appconstants_1.default.ZERO },
                    raw: true
                });
                return response;
            }
            catch (error) {
                console.log("Error occurred in getUser" + error);
                throw error;
            }
        });
    }
}
exports.LoginTrackService = LoginTrackService;
//# sourceMappingURL=LoginTrackService.js.map