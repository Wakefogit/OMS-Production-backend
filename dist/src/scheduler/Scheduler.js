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
exports.Scheduler = void 0;
const models_1 = __importDefault(require("../../models"));
const node_cron_1 = __importDefault(require("node-cron"));
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
const OrderService_1 = require("../services/OrderService");
const Utils_1 = require("../utils/Utils");
class Scheduler {
    scheduleChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            // let tran = await db.sequelize.transaction();
            // let tran2 = await db.sequelize.transaction();
            try {
                console.log("into the scheduleChannel");
                // await cron.schedule("*/5 * * * *", async () => {
                //     console.log("Into the job cron ", new Date())
                //     let jobData = await this.getJob();
                //     if (!isArrayPopulated(jobData)) {
                //         await this.createJob(null, {}, tran);
                //         tran.commit();
                //     }
                // });
                yield node_cron_1.default.schedule("*/20 * * * * *", () => __awaiter(this, void 0, void 0, function* () {
                    console.log("Into the job details cron ", new Date());
                    // let tran2 = await db.sequelize.transaction();
                    try {
                        let jobData = yield this.getJob();
                        console.log("jobData ", jobData);
                        if ((0, Utils_1.isArrayPopulated)(jobData)) {
                            let isThere_anyData_toPull = yield this.checkDatasToPull();
                            if (isThere_anyData_toPull) {
                                yield this.insertJobDetails(jobData[0].id);
                                // tran2.commit();
                            }
                        }
                    }
                    catch (error) {
                        console.log("Error in job details cron ", error);
                        // tran2.rollback();
                        throw error;
                    }
                }));
            }
            catch (error) {
                console.log("Error in scheduleChannel ", error);
                // tran.rollback();
                // tran2.rollback();
                throw error;
            }
        });
    }
    getJob() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Into the getJob");
                let query = yield models_1.default.sequelize.query(`
                select top 1 * from ${Appconstants_1.default.DB_JINDAL}.dbo.${Appconstants_1.default.TBL_JOB} as tj
                where tj.isDeleted = ${Appconstants_1.default.ZERO} and statusRefId = ${Appconstants_1.default.ONE};
            `);
                console.log("query ", query[0]);
                let result = query[0];
                return result;
            }
            catch (error) {
                console.log("Error in getJob ", error);
                throw error;
            }
        });
    }
    createJob(jobId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Into the createJob");
                let job = new models_1.default.tbl_job();
                job.isDeleted = Appconstants_1.default.ZERO;
                if (jobId) {
                    job.id = jobId;
                    job.errorMsg = input["errorMsg"] ? input["errorMsg"] : null;
                    job.statusRefId = input["statusRefId"];
                    job.endTime = new Date(new Date().toUTCString());
                    job.updatedOn = new Date(new Date().toUTCString());
                }
                else {
                    job.statusRefId = Appconstants_1.default.ONE;
                    job.isManual = Appconstants_1.default.ZERO;
                    job.startTime = new Date(new Date().toUTCString());
                    job.createdOn = new Date(new Date().toUTCString());
                }
                // let result = await new OrderService().createOrUpdateByModel(db.tbl_job, job, tran);
                let result = yield new OrderService_1.OrderService().createorUpdateModelWithoutTran(models_1.default.tbl_job, job);
                console.log("result ", result);
                return result;
            }
            catch (error) {
                console.log("Error in createJob ", error);
                throw error;
            }
        });
    }
    checkDatasToPull() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = yield models_1.default.sequelize.query(`
                select top 1 st.* from ${Appconstants_1.default.DB_JINDALORDER}.dbo.${Appconstants_1.default.TBL_STAGETABLE} as st
                left join ${Appconstants_1.default.DB_JINDAL}.dbo.${Appconstants_1.default.TBL_JOBDETAILS} as tj
                    on tj.isDeleted = 0 and tj.po = st.po 
                        and tj.planned_press = st.planned_press
                        -- and tj.material_code = st.material_code
                        -- and tj.so = st.so and tj.component_1 = st.component_1
                where tj.po is null 
                    -- and tj.planned_press is null
                    -- and tj.material_code is null and tj.so is null
                    -- and tj.component_1 is null
                    and st.plant = 'BF01'
                    and st.planned_press LIKE 'PRESS%'
                    and st.po_release_dt >= '2023-01-01'
                order by st.po;
            `);
                let result = query[0];
                return result;
            }
            catch (error) {
                console.log("Error in checkDatasToPull ", error);
                throw error;
            }
        });
    }
    insertJobDetails(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dataList = yield models_1.default.sequelize.query(`
                insert into ${Appconstants_1.default.DB_JINDAL}.dbo.${Appconstants_1.default.TBL_JOBDETAILS}
                (jobId,std_alloy,customer_name,customer_delivery_dt,cut_len,cut_len_uom,
                    cut_len_tolerance_upper,cut_len_tolerance_lower,
                    tool_detail,die_issued_by_ts,po_qty,po_release_status,internal_alloy,no_of_pieces,
                    order_qty,order_qty_uom,po,po_release_dt,
                    planned_press,profile_unit_weight_kg_m,material_code,so,so_release_dt,so_creation_dt,
                    temper,qty_tolerance_min,qty_tolerance_max,so_line_items,zone,
                    customer_technical_data_sheet,end_use,component_1,
                    component_2,Requirement1_qty,requirement2_qty,order_type,plant,teco_status,createdOn,isDeleted)
                select ${jobId},st.*,CURRENT_TIMESTAMP,0  
                from ${Appconstants_1.default.DB_JINDALORDER}.dbo.${Appconstants_1.default.TBL_STAGETABLE} as st
                left join ${Appconstants_1.default.DB_JINDAL}.dbo.${Appconstants_1.default.TBL_JOBDETAILS} as tj
                    on tj.isDeleted = 0 and tj.po = st.po 
                        and tj.planned_press = st.planned_press
                        -- and tj.material_code = st.material_code
                        -- and tj.so = st.so and tj.component_1 = st.component_1
                where tj.po is null 
                    -- and tj.planned_press is null
                    -- and tj.material_code is null and tj.so is null
                    -- and tj.component_1 is null
                    and st.plant = 'BF01'
                    and st.planned_press LIKE 'PRESS%'
                    and st.po_release_dt >= '2023-01-01'
                order by st.po;
            `);
                console.log("dataList", dataList);
                let orderResult = dataList[1] ? yield this.insertOrderData() : null;
                let result = (dataList[1] && orderResult) ? yield this.createJob(jobId, { statusRefId: Appconstants_1.default.TWO }) : null;
                // console.log("result ", result)
                if (!(dataList[1] && result && orderResult[1])) {
                    yield this.createJob(jobId, {
                        errorMsg: Appconstants_1.default.PROBLEM_WHILE_CREATING,
                        statusRefId: Appconstants_1.default.THREE
                    });
                    return Appconstants_1.default.PROBLEM_WHILE_CREATING;
                }
                return Appconstants_1.default.CREATED_SUCCESSFULLY;
            }
            catch (error) {
                console.log("Error in insertJobDetails ", error);
                throw error;
            }
        });
    }
    insertOrderData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dataList = yield models_1.default.sequelize.query(`
                insert into ${Appconstants_1.default.DB_JINDAL}.dbo.${Appconstants_1.default.TBL_ORDER}
                (uniqueKey,std_alloy,customer_name,customer_delivery_dt,cut_len,cut_len_uom,
                    cut_len_tolerance_upper,cut_len_tolerance_lower,tool_detail,die_issued_by_ts,
                    po_qty,po_release_status,internal_alloy,no_of_pieces,order_qty,
                    order_qty_uom,po,po_release_dt,planned_press,profile_unit_weight_kg_m,material_code,
                    so,so_release_dt,so_creation_dt,temper,qty_tolerance_min,qty_tolerance_max,
                    so_line_items,zone,customer_technical_data_sheet,end_use,component_1,
                    component_2,Requirement1_qty,requirement2_qty,order_type,plant,teco_status,
                    workFlowId,priorityRefId,
                    --extruded_qty,balance_po_qty,marketing_remarks,
                    isActive,createdBy,createdOn,isDeleted)
                select NEWID(),tj.std_alloy,replace(tj.customer_name,'#','') as customer_name,tj.customer_delivery_dt,tj.cut_len,
                    tj.cut_len_uom,tj.cut_len_tolerance_upper,tj.cut_len_tolerance_lower,tj.tool_detail,
                    tj.die_issued_by_ts,tj.po_qty,tj.po_release_status,tj.internal_alloy,
                    tj.no_of_pieces,tj.order_qty,tj.order_qty_uom,tj.po,tj.po_release_dt,tj.planned_press,
                    tj.profile_unit_weight_kg_m,tj.material_code,tj.so,tj.so_release_dt,tj.so_creation_dt,
                    tj.temper,tj.qty_tolerance_min,tj.qty_tolerance_max,tj.so_line_items,tj.[zone],
                    tj.customer_technical_data_sheet,tj.end_use,tj.component_1,tj.component_2,
                    tj.Requirement1_qty,tj.requirement2_qty,tj.order_type,tj.plant,tj.teco_status,
                    1,1,
                    --extruded_qty,balance_po_qty,marketing_remarks,
                    1,1,current_timestamp, 0  
                from ${Appconstants_1.default.DB_JINDAL}.dbo.${Appconstants_1.default.TBL_JOBDETAILS} tj
                left join ${Appconstants_1.default.DB_JINDAL}.dbo.${Appconstants_1.default.TBL_ORDER} tbo
                    on tbo.isDeleted = 0 and tbo.po = tj.po 
                        and tbo.planned_press = tj.planned_press
                        -- and tbo.material_code = tj.material_code
                        -- and tbo.so = tj.so and tbo.component_1 = tj.component_1
                where tbo.po is null 
                    -- and tbo.material_code is null and tbo.so is null
                    -- and tbo.component_1 is null
                order by tj.po;            
            `);
                console.log("dataList", dataList);
                return dataList;
            }
            catch (error) {
                console.log("Error in insertOrderData ", error);
                throw error;
            }
        });
    }
    generateJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let tran = yield models_1.default.sequelize.transaction();
            try {
                let query = yield models_1.default.sequelize.query(`
                select top 1 * from ${Appconstants_1.default.DB_JINDAL}.dbo.${Appconstants_1.default.TBL_JOB} as tj
                where tj.isDeleted = ${Appconstants_1.default.ZERO} and statusRefId = ${Appconstants_1.default.ONE};
            `);
                if (!(0, Utils_1.isArrayPopulated)(query[0])) {
                    // await this.createJob(null, {});
                    let jobId = null;
                    let input = {};
                    let job = new models_1.default.tbl_job();
                    job.isDeleted = Appconstants_1.default.ZERO;
                    if (jobId) {
                        job.id = jobId;
                        job.errorMsg = input["errorMsg"] ? input["errorMsg"] : null;
                        job.statusRefId = input["statusRefId"];
                        job.endTime = new Date(new Date().toUTCString());
                        job.updatedOn = new Date(new Date().toUTCString());
                    }
                    else {
                        job.statusRefId = Appconstants_1.default.ONE;
                        job.isManual = Appconstants_1.default.ZERO;
                        job.startTime = new Date(new Date().toUTCString());
                        job.createdOn = new Date(new Date().toUTCString());
                    }
                    let result = yield new OrderService_1.OrderService().createOrUpdateByModel(models_1.default.tbl_job, job, tran);
                    console.log("jobresult ", result);
                    tran.commit();
                    // return result;
                }
                return res.status(200).send(Appconstants_1.default.CREATED_SUCCESSFULLY);
            }
            catch (error) {
                console.log("Error in generateJob ", error);
                tran.rollback();
                throw error;
            }
        });
    }
}
exports.Scheduler = Scheduler;
//# sourceMappingURL=Scheduler.js.map