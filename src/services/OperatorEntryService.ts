import { Service } from "typedi";
import BaseService from "./BaseService";
import db from "../../models";
import AppConstants from "../constants/Appconstants";
import { findDuration, isArrayPopulated, isValueOrUndefined, uuidv4 } from "../utils/Utils";
import { Op, Sequelize } from "sequelize";
import { role } from "../enums/Enums";

@Service()
export class OperatorEntryService extends BaseService<any> {
    getModel() {
        return db.tbl_operatorEntry;
    }

    public async createOrUpdateOperatorEntryData(input: Object, currentUser: Object, tran) {
        try {
            let orderData = await this.findUniqueKey(db.tbl_order, input["orderId"]);
            let operatorEntryData;
            if (orderData) {
                let operatorEntryDataObj = new db.tbl_operatorEntry();
                operatorEntryDataObj.orderId = orderData.id;
                operatorEntryDataObj.dieTrialRefId = input["dieTrialRefId"];
                operatorEntryDataObj.dieWithAluminiumRefId = input["dieWithAluminiumRefId"];
                operatorEntryDataObj.previousDayDie_continueRefId = input["previousDayDie_continueRefId"];
                operatorEntryDataObj.batchNo = input["batchNo"];
                operatorEntryDataObj.actualInternalAlloy = input["actualInternalAlloy"];
                operatorEntryDataObj.startTime = isValueOrUndefined(input["startTime"]);
                operatorEntryDataObj.endTime = isValueOrUndefined(input["endTime"]);
                operatorEntryDataObj.processTime = isValueOrUndefined(input["processTime"]);
                operatorEntryDataObj.noOfBilletAndLength = input["noOfBilletAndLength"] ? JSON.stringify(input["noOfBilletAndLength"]) : undefined;
                operatorEntryDataObj.actualButtThickness = isValueOrUndefined(input["actualButtThickness"]);
                operatorEntryDataObj.breakThroughPressure = input["breakThroughPressure"];
                operatorEntryDataObj.pushOnBilletLength = input["pushOnBilletLength"] != null ? input["pushOnBilletLength"] : undefined;
                operatorEntryDataObj.pushQtyInKgs = input["pushQtyInKgs"];
                operatorEntryDataObj.actualProductionRate = input["actualProductionRate"] != null ? input["actualProductionRate"] : undefined;
                operatorEntryDataObj.buttWeightInKgs = input["buttWeightInKgs"] != null ? input["buttWeightInKgs"] : undefined;
                operatorEntryDataObj.diefailRefId = input["diefailRefId"];
                operatorEntryDataObj.dieFailureReason = input["dieFailureReason"];
                operatorEntryDataObj.breakDown = input["breakDown"] ? JSON.stringify(input["breakDown"]) : undefined;
                operatorEntryDataObj.breakDownDuration = isValueOrUndefined(input["breakDownDuration"]);
                operatorEntryDataObj.logEndScrapLengthInMm = input["logEndScrapLengthInMm"];
                operatorEntryDataObj.logEndScrapInKgs = input["logEndScrapInKgs"];
                operatorEntryDataObj.operatorName = input["operatorName"];
                operatorEntryDataObj.remarks = input["remarks"];
                operatorEntryDataObj.isActive = input["isActive"];
                operatorEntryDataObj.isDeleted = AppConstants.ZERO;
                if (currentUser["roleId"] == role.Admin) {
                    operatorEntryDataObj.updatedAdminId = currentUser["id"];
                    operatorEntryDataObj.adminUpdatedOn = new Date(new Date().toUTCString());
                }

                // console.log("input[operatorId]", input);
                if (input["operatorId"] != "" || (input["uniqueKey"] && input["uniqueKey"] != "")) {
                    let operatorId = input["operatorId"] ? input["operatorId"] : input["uniqueKey"]
                    operatorEntryData = operatorId != "" ? await this.findUniqueKey(db.tbl_operatorEntry, operatorId) : undefined;
                }

                if (operatorEntryData) {
                    operatorEntryDataObj.id = operatorEntryData.id;
                    operatorEntryDataObj.uniqueKey = operatorEntryData.uniqueKey;
                    operatorEntryDataObj.updatedBy = currentUser["id"];
                    operatorEntryDataObj.updatedOn = new Date(new Date().toUTCString());
                } else {
                    operatorEntryDataObj.uniqueKey = uuidv4();
                    operatorEntryDataObj.createdBy = currentUser["id"];
                    operatorEntryDataObj.createdOn = new Date(new Date().toUTCString());
                }
                let result = await this.createOrUpdateByModel(db.tbl_operatorEntry, operatorEntryDataObj, tran);
                if (result) {
                    (currentUser["roleId"] == role.Admin) &&
                        await this.updateBundlingSupervisorDerivatives(orderData.id, operatorEntryDataObj.pushOnBilletLength, tran);
                    return {
                        "message": AppConstants.UPDATED_SUCCESSFULLY,
                        "uniqueKey": result.uniqueKey
                    }
                }
                // return AppConstants.UPDATED_SUCCESSFULLY;
                else
                    return AppConstants.PROBLEM_WHILE_UPDATING;
            } else
                return AppConstants.INVALID_ID;
        } catch (error) {
            throw error;
        }
    }

    public async getOperatorEntryData(orderId: number, userId: number, roleId: number) {
        try {
            let whereCondition = {
                isActive: AppConstants.ONE,
                isDeleted: AppConstants.ZERO,
                orderId: orderId,
                // createdBy: userId
            };
            // (roleId == role.Admin || roleId > role.Operator_Entry) && delete whereCondition.createdBy
            let query = await db.tbl_operatorEntry.findOne({
                attributes: [
                    ["uniqueKey", 'operatorEntryId'],
                    "dieTrialRefId",
                    "dieWithAluminiumRefId",
                    "previousDayDie_continueRefId",
                    "batchNo", "actualInternalAlloy", "startTime", "endTime",
                    "processTime", "noOfBilletAndLength", "actualButtThickness", "breakThroughPressure",
                    "pushOnBilletLength", "pushQtyInKgs", "actualProductionRate", "buttWeightInKgs",
                    "diefailRefId",
                    "dieFailureReason", "breakDown", "breakDownDuration", "logEndScrapLengthInMm",
                    "logEndScrapInKgs", "operatorName", "remarks"
                ],
                distinct: true,
                model: db.tbl_operatorEntry,
                where: whereCondition,
                required: true,
                raw: true
            })
            console.log("query", query)
            return query;
        } catch (error) {
            console.log("Error_in_getOperatorEntryData " + error);
            throw error;
        }
    }

    public async getOperatorEntryAttributes(isDownload: number) {
        try {
            let attributes = [
                [Sequelize.literal('tbl_operatorEntry.uniqueKey'), 'operatorEntryId'],
                [Sequelize.literal(`
                    (case when tbl_operatorEntry.dieTrialRefId = 1 then 'Yes'
                        when tbl_operatorEntry.dieTrialRefId = 2 then 'No'
                        else null
                    end)`), 'dieTrial'],
                [Sequelize.literal(`
                (case when tbl_operatorEntry.dieWithAluminiumRefId = 1 then 'Yes'
                    when tbl_operatorEntry.dieWithAluminiumRefId = 2 then 'No'
                    else null
                end)`), 'dieWithAluminium'],
                [Sequelize.literal(`
                (case when tbl_operatorEntry.previousDayDie_continueRefId = 1 then 'Yes'
                    when tbl_operatorEntry.previousDayDie_continueRefId = 2 then 'No'
                    else null
                end)`), 'previousDayDie_continue'],
                [Sequelize.literal('tbl_operatorEntry.batchNo'), 'batchNo'],
                [Sequelize.literal(`${isDownload ? "replace(tbl_operatorEntry.actualInternalAlloy,'#','')" : 'tbl_operatorEntry.actualInternalAlloy'}`), 'actualInternalAlloy'],
                [Sequelize.literal('tbl_operatorEntry.startTime'), 'startTime'],
                [Sequelize.literal('tbl_operatorEntry.endTime'), 'endTime'],
                [Sequelize.literal('tbl_operatorEntry.processTime'), 'processTime'],
                [Sequelize.literal('tbl_operatorEntry.noOfBilletAndLength'), 'noOfBilletAndLength'],
                [Sequelize.literal('tbl_operatorEntry.actualButtThickness'), 'actualButtThickness'],
                [Sequelize.literal('tbl_operatorEntry.breakThroughPressure'), 'breakThroughPressure'],
                [Sequelize.literal('tbl_operatorEntry.pushOnBilletLength'), 'pushOnBilletLength'],
                [Sequelize.literal('tbl_operatorEntry.pushQtyInKgs'), 'pushQtyInKgs'],
                [Sequelize.literal('tbl_operatorEntry.actualProductionRate'), 'actualProductionRate'],
                [Sequelize.literal('tbl_operatorEntry.buttWeightInKgs'), 'buttWeightInKgs'],
                [Sequelize.literal(`
                (case when tbl_operatorEntry.diefailRefId = 1 then 'Yes'
                    when tbl_operatorEntry.diefailRefId = 2 then 'No'
                    else null
                end)`), 'diefail'],
                [Sequelize.literal(`${isDownload ? "replace(tbl_operatorEntry.dieFailureReason,'#','')" : 'tbl_operatorEntry.dieFailureReason'}`), 'dieFailureReason'],
                [Sequelize.literal('tbl_operatorEntry.breakDown'), 'breakDown'],
                [Sequelize.literal('tbl_operatorEntry.breakDownDuration'), 'breakDownDuration'],
                [Sequelize.literal('tbl_operatorEntry.logEndScrapLengthInMm'), 'logEndScrapLengthInMm'],
                [Sequelize.literal('tbl_operatorEntry.logEndScrapInKgs'), 'logEndScrapInKgs'],
                [Sequelize.literal(`${isDownload ? "replace(tbl_operatorEntry.operatorName,'#','')" : 'tbl_operatorEntry.operatorName'}`), 'operatorName'],
                [Sequelize.literal(`${isDownload ? "replace(tbl_operatorEntry.remarks,'#','')" : 'tbl_operatorEntry.remarks'}`), "operatorEntryRemarks"]
            ]
            return attributes;
        } catch (error) {
            console.log("Error_in_getOperatorEntryAttributes ", error);
            throw error;
        }
    }

    public async getOperatorEntryIncludes() {
        try {
            let includes = {
                attributes: [],
                distinct: true,
                model: db.tbl_operatorEntry,
                where: {
                    isActive: AppConstants.ONE,
                    isDeleted: AppConstants.ZERO
                },
                required: false,
                raw: true
            }
            return includes;
        } catch (error) {
            console.log("Error_in_getOperatorEntryIncludes ", error);
            throw error;
        }
    }

    public async getOperatorEntryFilter(input: Object) {
        let operatorEntryFilter = {
            '$[tbl_operatorEntry].dieTrialRefId$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[dieTrialRefId],0) LIKE N'%${input["fdieTrialRefId"]}%' )
            `),
            '$[tbl_operatorEntry].dieWithAluminiumRefId$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[dieWithAluminiumRefId],0) LIKE N'%${input["fdieWithAluminiumRefId"]}%' )
            `),
            '$[tbl_operatorEntry].previousDayDie_continueRefId$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[previousDayDie_continueRefId],0) LIKE N'%${input["fpreviousDayDie_continueRefId"]}%' )
            `),
            '$[tbl_operatorEntry].batchNo$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[batchNo],0) LIKE N'%${input["fbatchNo"]}%' )
            `),
            '$[tbl_operatorEntry].actualInternalAlloy$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[actualInternalAlloy],'') LIKE N'%${input["factualInternalAlloy"]}%' )
            `),
            '$[tbl_operatorEntry].startTime$': Sequelize.literal(`
                (CAST([tbl_operatorEntry].[startTime] as TIME) = CAST('${input["fstartTime"]}' as TIME))
            `),
            '$[tbl_operatorEntry].endTime$': Sequelize.literal(`
                (CAST([tbl_operatorEntry].[endTime] as TIME) = CAST('${input["fendTime"]}' as TIME))
            `),
            // '$[tbl_operatorEntry].startTime$': Sequelize.literal(`
            //     (isnull([tbl_operatorEntry].[startTime],'') LIKE N'%${input["fstartTime"]}%' )
            // `),
            // '$[tbl_operatorEntry].endTime$': Sequelize.literal(`
            //     (isnull([tbl_operatorEntry].[endTime],'') LIKE N'%${input["fendTime"]}%' )
            // `),
            '$[tbl_operatorEntry].processTime$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[processTime],'') LIKE N'%${input["fprocessTime"]}%' )
            `),
            // '$[tbl_operatorEntry].noOfBilletAndLength$': Sequelize.literal(`
            //     ([tbl_operatorEntry].[processTime] LIKE N'%${input["fprocessTime"]}%' OR 1=1 )
            // `),
            '$[tbl_operatorEntry].actualButtThickness$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[actualButtThickness],0) LIKE N'%${input["factualButtThickness"]}%' )
            `),
            '$[tbl_operatorEntry].breakThroughPressure$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[breakThroughPressure],0) LIKE N'%${input["fbreakThroughPressure"]}%' )
            `),
            '$[tbl_operatorEntry].pushOnBilletLength$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[pushOnBilletLength],0) LIKE N'%${input["fpushOnBilletLength"]}%' )
            `),
            '$[tbl_operatorEntry].pushQtyInKgs$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[pushQtyInKgs],0) LIKE N'%${input["fpushQtyInKgs"]}%' )
            `),
            '$[tbl_operatorEntry].actualProductionRate$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[actualProductionRate],0) LIKE N'%${input["factualProductionRate"]}%' )
            `),
            '$[tbl_operatorEntry].buttWeightInKgs$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[buttWeightInKgs],0) LIKE N'%${input["fbuttWeightInKgs"]}%' )
            `),
            '$[tbl_operatorEntry].diefailRefId$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[diefailRefId],0) LIKE N'%${input["fdiefailRefId"]}%' )
            `),
            '$[tbl_operatorEntry].dieFailureReason$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[dieFailureReason],'') LIKE N'%${input["fdieFailureReason"]}%' )
            `),
            // '$[tbl_operatorEntry].breakDown$': {
            //     [Op.like]: '%' + input["fbreakDown"] + '%'
            // },
            '$[tbl_operatorEntry].breakDownDuration$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[breakDownDuration],'') LIKE N'%${input["fbreakDownDuration"]}%' )
            `),
            '$[tbl_operatorEntry].logEndScrapLengthInMm$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[logEndScrapLengthInMm],0) LIKE N'%${input["flogEndScrapLengthInMm"]}%' )
            `),
            '$[tbl_operatorEntry].logEndScrapInKgs$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[logEndScrapInKgs],0) LIKE N'%${input["flogEndScrapInKgs"]}%' )
            `),
            '$[tbl_operatorEntry].operatorName$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[operatorName],'') LIKE N'%${input["foperatorName"]}%' )
            `),
            '$[tbl_operatorEntry].remarks$': Sequelize.literal(`
                (isnull([tbl_operatorEntry].[remarks],'') LIKE N'%${input["foperatorEntryRemarks"]}%' )
            `),
        }
        input["fstartTime"] == '' ? delete operatorEntryFilter['$[tbl_operatorEntry].startTime$'] : undefined;
        input["fendTime"] == '' ? delete operatorEntryFilter['$[tbl_operatorEntry].endTime$'] : undefined;
        return operatorEntryFilter;
    }

    public async concatBreakDown(breakDown: Array<Object>) {
        try {
            let text = "";
            if (isArrayPopulated(breakDown)) {
                (breakDown || []).map((e: any, index: any) => {
                    text += `${e?.startTime} - ${e?.endTime}, ${e?.reason.replace(/#/g, '')}, ${e?.responsibleDepartment.replace(/#/g, '')} ${index != breakDown.length - 1 ? " | " : ""}`;
                })
            }
            return text;
            // let result = '';
            // for (let data of breakDown) {
            //     if (result.length > 0)
            //         result = result + ' | ' + data["startTime"] + " - " + data["endTime"]
            //             + " - " + data["reason"] + " - " + data["responsibleDepartment"]
            //     else
            //         result = data["startTime"] + " - " + data["endTime"]
            //             + " - " + data["reason"] + " - " + data["responsibleDepartment"]
            // }
            // return result;
        } catch (error) {
            console.log("Error_in_concatBreakDown ", error);
            throw error;
        }
    }

    public async concatBilletAndLength(billet: Array<Object>) {
        try {
            let billetString = '';
            (billet || []).map((e: any, index: any) => {
                billetString += `Batch${index + 1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billet.length - 1 ? " - " : ""}`;
            })
            let total: any = billet?.reduce((total: number, x: any) => total + parseInt(x?.noOfBillet), 0)
            billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
            // console.log("billetString ", billetString)
            // let result = '', i = 1;
            // for (let data of billet) {
            //     if (result.length > 0)
            //         result = result + ' | ' + `${"Billet" + i}: ${data["billet"]}`
            //     else
            //         result = `${"Billet" + i}: ${data["billet"]}`
            //     i++;
            // }
            return billetString;
        } catch (error) {
            console.log("Error_in_concatBilletAndLength ", error);
            throw error;
        }
    }

    public async getOperatorEntryPushOnBillet(orderId: number) {
        try {
            let whereCondition = {
                isActive: AppConstants.ONE,
                isDeleted: AppConstants.ZERO,
                orderId: orderId,
            };
            let query = await db.tbl_operatorEntry.findOne({
                attributes: [
                    "pushOnBilletLength"
                ],
                distinct: true,
                model: db.tbl_operatorEntry,
                where: whereCondition,
                required: true,
                raw: true
            })
            console.log("query", query)
            return query;
        } catch (error) {
            console.log("Error_in_getOperatorEntryPushOnBillet " + error);
            throw error;
        }
    }

    public async updateDerivativeFields(orderId: number, buttWeightPerInch: number, tran) {
        try {
            let operatorEntryData = await this.findByKey(db.tbl_operatorEntry, 'orderId', orderId)
            if (operatorEntryData) {
                if (operatorEntryData.noOfBilletAndLength) {
                    let pushOnBillet = JSON.parse(operatorEntryData.noOfBilletAndLength).reduce(((total: number, x: any) => {
                        let billetVal = Number(x?.noOfBillet) * parseFloat(x?.billetLength) * Number(buttWeightPerInch)
                        return total + billetVal
                    }), 0);
                    let totalBillet = JSON.parse(operatorEntryData.noOfBilletAndLength).reduce(((total: number, x: any) => total + Number(x?.noOfBillet)), 0)
                    let buttWeightInKgs = (Number(buttWeightPerInch) * Number(operatorEntryData?.actualButtThickness)) * Number(totalBillet);
                    let time = findDuration(operatorEntryData?.startTime, operatorEntryData?.endTime);
                    let breakDownTime: number = 0;
                    if (operatorEntryData.breakDown) {
                        for (let item of JSON.parse(operatorEntryData.breakDown)) {
                            let value = item.elapsedTime.split(" ")[0];
                            breakDownTime += Number(value);
                        }
                    }
                    let ActualProductionRate = ((pushOnBillet * 60) / (Number(time[1]) - Number(breakDownTime))).toFixed(4);

                    let operatorEntryDataObj = new db.tbl_operatorEntry();
                    operatorEntryDataObj.id = operatorEntryData.id;
                    operatorEntryDataObj.pushOnBilletLength = pushOnBillet;
                    operatorEntryDataObj.actualProductionRate = (!Number.isNaN(ActualProductionRate) && ActualProductionRate != "Infinity") ? ActualProductionRate : AppConstants.ZERO;
                    operatorEntryDataObj.buttWeightInKgs = buttWeightInKgs;

                    await this.createOrUpdateByModel(db.tbl_operatorEntry, operatorEntryDataObj, tran);
                    await this.updateBundlingSupervisorDerivatives(orderId, pushOnBillet, tran);
                }
            }
        } catch (error) {
            console.log("Error_in_updateDerivativeFields " + error);
            throw error;
        }
    }

    public async updateBundlingSupervisorDerivatives(orderId, pushOnBillet, tran) {
        try {
            let bundlingSupervisorData = await this.findByKey(db.tbl_bundlingSupervisor, 'orderId', orderId);
            if (bundlingSupervisorData) {
                let recovery = ((bundlingSupervisorData?.finishQuantity / pushOnBillet) * 100).toFixed(4);

                let bundlingSupervisorObj = new db.tbl_bundlingSupervisor();
                bundlingSupervisorObj.id = bundlingSupervisorData.id;
                bundlingSupervisorObj.recovery = recovery;

                await this.createOrUpdateByModel(db.tbl_bundlingSupervisor, bundlingSupervisorObj, tran);
            }
        } catch (error) {
            console.log("Error_in_updateBundlingSupervisorDeviates " + error);
            throw error;
        }
    }
}    