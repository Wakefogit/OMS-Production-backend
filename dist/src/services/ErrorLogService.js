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
exports.ErrorLogService = void 0;
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
const models_1 = __importDefault(require("../../models"));
const BaseService_1 = __importDefault(require("./BaseService"));
class ErrorLogService extends BaseService_1.default {
    getModel() {
        return models_1.default.tbl_errorLog;
    }
    errorLog(schemaName, transType, message, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            let tran2 = yield models_1.default.sequelize.transaction();
            try {
                console.log("message ", message);
                let errorLogObj = new models_1.default.tbl_errorLog();
                errorLogObj.schemaName = schemaName;
                errorLogObj.transType = transType;
                errorLogObj.message = JSON.stringify(message);
                errorLogObj.createdBy = currentUserId;
                errorLogObj.createdOn = new Date(new Date().toUTCString());
                errorLogObj.isDeleted = Appconstants_1.default.ZERO;
                console.log("errorLogObj ", errorLogObj);
                yield this.createOrUpdateByModel(models_1.default.tbl_errorLog, errorLogObj, tran2);
                tran2.commit();
            }
            catch (error) {
                tran2.rollback();
                console.log("Error occurred in login track ", error);
                throw error;
            }
        });
    }
}
exports.ErrorLogService = ErrorLogService;
//# sourceMappingURL=ErrorLogService.js.map