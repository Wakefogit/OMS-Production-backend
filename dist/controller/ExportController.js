"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.pdfDownload = exports.csvDashboardDownload = exports.csvDownload = void 0;
const OrderService_1 = require("../src/services/OrderService");
const Appconstants_1 = __importDefault(require("../src/constants/Appconstants"));
const Enums_1 = require("../src/enums/Enums");
const fastCSV = __importStar(require("fast-csv"));
const Utils_1 = require("../src/utils/Utils");
const OperatorEntryService_1 = require("../src/services/OperatorEntryService");
const DownloadTemplateService_1 = require("../src/services/DownloadTemplateService");
const PDFDocument = require("pdfkit-table");
let orderService = new OrderService_1.OrderService();
let operatorEntryService = new OperatorEntryService_1.OperatorEntryService();
let downloadTemplateService = new DownloadTemplateService_1.DownloadTemplateService();
function csvDownload(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Into_the_csvDownload ", req.body, req.headers.currentUser);
            let dataHeaders = yield downloadTemplateService.getDownloadTemplate([], Appconstants_1.default.ONE, 'PO Release Date');
            let query = yield orderService.orderList(req.body, req.headers.currentUser);
            let dataArr;
            if ((0, Utils_1.isArrayPopulated)(query)) {
                dataArr = yield orderService.getDownloadJsonFormation(query, dataHeaders);
                console.log("dataArr ", dataArr);
                res.setHeader('Content-disposition', 'attachment; filename=report.csv');
                res.setHeader('content-type', 'text/csv');
                // let result = await fastCSV.write(dataArr, { headers: true })
                //     .on("finish", function () { })
                // return res.status(200).send(result);
                fastCSV.write(dataArr, { headers: true })
                    .on("finish", function () { })
                    .pipe(res);
            }
            else
                return res.status(212).send(query);
        }
        catch (error) {
            console.log("Error_in_csvDownload " + error);
            return res.status(500).send(Appconstants_1.default.SOMETHING_WENT_WRONG + ' ' + error);
        }
    });
}
exports.csvDownload = csvDownload;
function csvDashboardDownload(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Into_the_csvDownload ", req.body, req.headers.currentUser);
            let dataHeaders = yield downloadTemplateService.getDownloadTemplate(req.body.headers, Appconstants_1.default.ZERO, null);
            let array = dataHeaders.map(e => e.queryAndFunction);
            let query = yield orderService.getDashboardDownloadList(req.body, array.toString());
            let dataArr;
            if ((0, Utils_1.isArrayPopulated)(query)) {
                dataArr = yield orderService.getDownloadJsonFormation(query, dataHeaders);
                console.log("dataArr ", dataArr);
                res.setHeader('Content-disposition', 'attachment; filename=report.csv');
                res.setHeader('content-type', 'text/csv');
                fastCSV.write(dataArr, { headers: true })
                    .on("finish", function () { })
                    .pipe(res);
            }
            else
                return res.status(212).send(query);
        }
        catch (error) {
            console.log("Error_in_csvDownload " + error);
            return res.status(500).send(Appconstants_1.default.SOMETHING_WENT_WRONG + ' ' + error);
        }
    });
}
exports.csvDashboardDownload = csvDashboardDownload;
function pdfDownload(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Into_the_pdfDownload ", req.body, req.headers.currentUser);
            let query = yield orderService.orderList(req.body, req.headers.currentUser);
            if ((0, Utils_1.isArrayPopulated)(query)) {
                // let doc = new PDFDocument({ margin: 20, size: 'A4' });
                let pdfWidth = 4350, pdfHeight = 1000;
                let doc = new PDFDocument({ margin: 30, size: [pdfHeight, pdfWidth], layout: 'landscape' });
                let title = yield orderService.getRoleNameById(req.headers.currentUser["roleId"]);
                // doc.text(title + ' ' + convertTitleCase(req.body["type"]))
                //     .font("Helvetica-Bold")
                //     .fontSize(20)
                //     .image('./jindal_logo.png', 730, 20, { width: 50 })
                //     .moveDown()
                // doc.image('./jindal_logo.png', 330, 180, { width: 150 })
                let xAxis = pdfWidth / 2, yAxis = pdfHeight / 2;
                doc.image('./jindal_logo.png', xAxis, yAxis, { width: 150 });
                let valueData = [];
                for (let data of query) {
                    let value = {
                        "sectionNo": data.sectionNo, "orderNo": data.orderNo, "soNo": data.soNo,
                        "orderDate": `${(0, Utils_1.formatDate)(data.orderDate)}`, "customerName": data.customerName,
                        "orderQty": data.orderQty, "alloyTemper": data.alloyTemper, "cutLength": data.cutLength,
                        "priority": data.priority,
                        "processStage": data.processStage,
                        "completedDate": `${req.body["type"] == Appconstants_1.default.COMPLETED ? (0, Utils_1.formatDate)(data.completedDate) : null}`,
                        "alloy": data["alloy"] ? data["alloy"] : '',
                        "quenching": (data === null || data === void 0 ? void 0 : data.quenching) ? data.quenching : '',
                        "productionRate": (data === null || data === void 0 ? void 0 : data.productionRate) ? data.productionRate : '',
                        "billetLength": (data === null || data === void 0 ? void 0 : data.billetLength) ? data.billetLength : '',
                        "noOfBillet": (data === null || data === void 0 ? void 0 : data.noOfBillet) ? data.noOfBillet : '',
                        "piecesPerBillet": (data === null || data === void 0 ? void 0 : data.piecesPerBillet) ? data.piecesPerBillet : '',
                        "buttThickness": (data === null || data === void 0 ? void 0 : data.buttThickness) ? data.buttThickness : '',
                        "extrusionLength": (data === null || data === void 0 ? void 0 : data.extrusionLength) ? data.extrusionLength : '',
                        "coringOrPipingLength_frontEnd": (data === null || data === void 0 ? void 0 : data.coringOrPipingLength_frontEnd) ? data.coringOrPipingLength_frontEnd : '',
                        "coringOrPipingLength_backEnd": (data === null || data === void 0 ? void 0 : data.coringOrPipingLength_backEnd) ? data.coringOrPipingLength_backEnd : '',
                        "pressEntry": (data === null || data === void 0 ? void 0 : data.pressEntry) ? data.pressEntry : '',
                        "plantRefId": (data === null || data === void 0 ? void 0 : data.plantRefId) ? data.plantRefId : '',
                        "balanceQuantity": (data === null || data === void 0 ? void 0 : data.balanceQuantity) ? data === null || data === void 0 ? void 0 : data.balanceQuantity : '',
                        "noOfPiecesRequired": (data === null || data === void 0 ? void 0 : data.noOfPiecesRequired) ? data === null || data === void 0 ? void 0 : data.noOfPiecesRequired : '',
                        "quantityTolerance": (data === null || data === void 0 ? void 0 : data.quantityTolerance) ? data === null || data === void 0 ? void 0 : data.quantityTolerance : '',
                        "ppcRemarks": (data === null || data === void 0 ? void 0 : data.ppcRemarks) ? data.ppcRemarks : '',
                        "dieRefId": (data === null || data === void 0 ? void 0 : data.dieRefId) ? data.dieRefId : '',
                        "noOfCavity": (data === null || data === void 0 ? void 0 : data.noOfCavity) ? data.noOfCavity : '',
                        "bolsterEntry": (data === null || data === void 0 ? void 0 : data.bolsterEntry) ? data.bolsterEntry : '',
                        "backerEntry": (data === null || data === void 0 ? void 0 : data.backerEntry) ? data.backerEntry : '',
                        "specialBackerEntry": (data === null || data === void 0 ? void 0 : data.specialBackerEntry) ? data.specialBackerEntry : '',
                        "ringEntry": (data === null || data === void 0 ? void 0 : data.ringEntry) ? data.ringEntry : '',
                        "dieSetter": (data === null || data === void 0 ? void 0 : data.dieSetter) ? data.dieSetter : '',
                        "weldingChamber": (data === null || data === void 0 ? void 0 : data.weldingChamber) ? data.weldingChamber : '',
                        "toolShopRemarks": (data === null || data === void 0 ? void 0 : data.toolShopRemarks) ? data.toolShopRemarks : '',
                        "qaRemarks": data["qaRemarks"] ? data["qaRemarks"] : '',
                        "batchNo": data["batchNo"] ? JSON.parse(data["batchNo"]).toString() : '',
                        "buttWeight": data["buttWeight"] ? data["buttWeight"] : '',
                        "pushOnBilletLength": data["pushOnBilletLength"] ? JSON.parse(data["pushOnBilletLength"]).toString() : '',
                        "approxPushQty": data["approxPushQty"] ? data["approxPushQty"] : '',
                        "startTime": data["startTime"] ? `${(0, Utils_1.formatDate)(data["startTime"])}` : '',
                        "endTime": data["endTime"] ? `${(0, Utils_1.formatDate)(data["endTime"])}` : '',
                        "processTime": data["processTime"] ? data["processTime"] : '',
                        "productionRateActual": data["productionRateActual"] ? data["productionRateActual"] : '',
                        "dieWithAluminium": data["dieWithAluminium"] ? data["dieWithAluminium"] : '',
                        "diefailed": data["diefailed"] ? data["diefailed"] : '',
                        "dieFailureReasonRefId": data["dieFailureReasonRefId"] ? data["dieFailureReasonRefId"] : '',
                        "breakDownStartTime": data["breakDownStartTime"] ? `${(0, Utils_1.formatDate)(data["breakDownStartTime"])}` : '',
                        "breakDownEndTime": data["breakDownEndTime"] ? `${(0, Utils_1.formatDate)(data["breakDownEndTime"])}` : '',
                        "reasonForBreakDownRefId": data["reasonForBreakDownRefId"] ? data["reasonForBreakDownRefId"] : '',
                        "timeTakenBreakDown": data["timeTakenBreakDown"] ? data["timeTakenBreakDown"] : '',
                        "previousDayDieContinue": data["previousDayDieContinue"] ? data["previousDayDieContinue"] : '',
                        "nameOfOperator": data["nameOfOperator"] ? data["nameOfOperator"] : '',
                        "operatorEntryRemarks": data["operatorEntryRemarks"] ? data["operatorEntryRemarks"] : '',
                        "finishQuantity": data["finishQuantity"] ? data["finishQuantity"] : '',
                        "piecesPerBundle": data["piecesPerBundle"] ? data["piecesPerBundle"] : '',
                        "bundleWeight": data["bundleWeight"] ? data["bundleWeight"] : '',
                        "noOfBundles": data["noOfBundles"] ? data["noOfBundles"] : '',
                        "correctionQty": data["correctionQty"] ? data["correctionQty"] : '',
                        "totalNoOfPieces": data["totalNoOfPieces"] ? data["totalNoOfPieces"] : '',
                        "totalFinishQty": data["totalFinishQty"] ? data["totalFinishQty"] : '',
                        "recovery": data["recovery"] ? data["recovery"] : '',
                        "logEndCutSharpInch": data["logEndCutSharpInch"] ? data["logEndCutSharpInch"] : '',
                        "logEndCutSharpWeight": data["logEndCutSharpWeight"] ? data["logEndCutSharpWeight"] : '',
                        "bundlingSupervisorRemarks": data["bundlingSupervisorRemarks"] ? data["bundlingSupervisorRemarks"] : ''
                    };
                    if (req.headers.currentUser["roleId"] != Enums_1.role.Admin)
                        delete value["processStage"];
                    if (req.body["type"] != Appconstants_1.default.COMPLETED)
                        delete value["completedDate"];
                    valueData.push(value);
                }
                let headers = [
                    //For portrait
                    // { "label": "Section No", "property": "sectionNo", "width": 50 },
                    // { "label": "PO No", "property": "orderNo", "width": 40 },
                    // { "label": "SO No", "property": "soNo", "width": 40 },
                    // { "label": "Date", "property": "orderDate", "width": 50 },
                    // { "label": "Customer Name", "property": "customerName", "width": 60 },
                    // { "label": "Order Qty", "property": "orderQty", "width": 50 },
                    // { "label": "Alloy Temper", "property": "alloyTemper", "width": 60 },
                    // { "label": "Cut Length", "property": "cutLength", "width": 50 },
                    // { "label": "Priority", "property": "priority", "width": 50 },
                    //for landscape
                    // { "label": "Section No", "property": "sectionNo", "width": 70 },
                    // { "label": "PO No", "property": "orderNo", "width": 50 },
                    // { "label": "SO No", "property": "soNo", "width": 50 },
                    // { "label": "Date", "property": "orderDate", "width": 70 },
                    // { "label": "Customer Name", "property": "customerName", "width": 100 },
                    // { "label": "Order Qty", "property": "orderQty", "width": 60 },
                    // { "label": "Alloy Temper", "property": "alloyTemper", "width": 80 },
                    // { "label": "Cut Length", "property": "cutLength", "width": 60 },
                    // { "label": "Priority", "property": "priority", "width": 60 },
                    { "label": "Section No", "property": "sectionNo", "width": 70 },
                    { "label": "PO No", "property": "orderNo", "width": 50 },
                    { "label": "SO No", "property": "soNo", "width": 50 },
                    { "label": "Date", "property": "orderDate", "width": 70 },
                    { "label": "Customer Name", "property": "customerName", "width": 100 },
                    { "label": "Order Qty", "property": "orderQty", "width": 60 },
                    { "label": "Alloy Temper", "property": "alloyTemper", "width": 80 },
                    { "label": "Cut Length", "property": "cutLength", "width": 60 },
                    { "label": "Priority", "property": "priority", "width": 60 },
                    { "label": "Process Stage", "property": "processStage", "width": 90 },
                    { "label": "Completed Date", "property": "completedDate", "width": 80 },
                    { "label": "Alloy", "property": "alloy", "width": 50 },
                    { "label": "Quenching", "property": "quenching", "width": 60 },
                    { "label": "Production Rate", "property": "productionRate", "width": 60 },
                    { "label": "Billet Length", "property": "billetLength", "width": 60 },
                    { "label": "No Of Billet", "property": "noOfBillet", "width": 50 },
                    { "label": "Pieces Per Billet", "property": "piecesPerBillet", "width": 50 },
                    { "label": "Butt Thickness", "property": "buttThickness", "width": 50 },
                    { "label": "Extrusion Length", "property": "extrusionLength", "width": 60 },
                    { "label": "Coring/Piping Length (Front End)", "property": "coringOrPipingLength_frontEnd", "width": 70 },
                    { "label": "Coring/Piping Length (Back End)", "property": "coringOrPipingLength_backEnd", "width": 70 },
                    { "label": "Press Entry", "property": "pressEntry", "width": 50 },
                    { "label": "Plant", "property": "plantRefId", "width": 40 },
                    { "label": "Balance Quantity", "property": "balanceQuantity", "width": 60 },
                    { "label": "No Of Pieces Required", "property": "noOfPiecesRequired", "width": 70 },
                    { "label": "Quantity Tolerance", "property": "quantityTolerance", "width": 70 },
                    { "label": "PPC Remarks", "property": "ppcRemarks", "width": 100 },
                    { "label": "Die", "property": "dieRefId", "width": 30 },
                    { "label": "No Of Cavity", "property": "noOfCavity", "width": 60 },
                    { "label": "Bolster Entry", "property": "bolsterEntry", "width": 50 },
                    { "label": "Backer Entry", "property": "backerEntry", "width": 60 },
                    { "label": "Special Backer Entry", "property": "specialBackerEntry", "width": 60 },
                    { "label": "Ring Entry", "property": "ringEntry", "width": 50 },
                    { "label": "Die Setter", "property": "dieSetter", "width": 50 },
                    { "label": "Welding Chamber", "property": "weldingChamber", "width": 50 },
                    { "label": "Tool Shop Remarks", "property": "toolShopRemarks", "width": 100 },
                    { "label": "QA Remarks", "property": "qaRemarks", "width": 100 },
                    { "label": "Batch No", "property": "batchNo", "width": 70 },
                    { "label": "Butt Weight", "property": "buttWeight", "width": 60 },
                    { "label": "Push On Billet Length", "property": "pushOnBilletLength", "width": 80 },
                    { "label": "Approx Push Qty", "property": "approxPushQty", "width": 60 },
                    { "label": "Start Time", "property": "startTime", "width": 70 },
                    { "label": "End Time", "property": "endTime", "width": 70 },
                    { "label": "Process Time", "property": "processTime", "width": 50 },
                    { "label": "Production Rate Actual", "property": "productionRateActual", "width": 70 },
                    { "label": "Die With Aluminium", "property": "dieWithAluminium", "width": 60 },
                    { "label": "Die Failed", "property": "diefailed", "width": 50 },
                    { "label": "Die Failure Reason", "property": "dieFailureReason", "width": 60 },
                    { "label": "BreakDown Start Time", "property": "breakDownStartTime", "width": 70 },
                    { "label": "BreakDown End Time", "property": "breakDownEndTime", "width": 70 },
                    { "label": "Reason For BreakDown", "property": "reasonForBreakDown", "width": 80 },
                    { "label": "Time Taken BreakDown", "property": "timeTakenBreakDown", "width": 60 },
                    { "label": "Previous Day Die Continue", "property": "previousDayDieContinue", "width": 60 },
                    { "label": "Name Of Operator", "property": "nameOfOperator", "width": 80 },
                    { "label": "Operator Entry Remarks", "property": "operatorEntryRemarks", "width": 100 },
                    { "label": "Finish Quantity", "property": "finishQuantity", "width": 50 },
                    { "label": "Pieces Per Bundle", "property": "piecesPerBundle", "width": 60 },
                    { "label": "Bundle Weight", "property": "bundleWeight", "width": 60 },
                    { "label": "No Of Bundles", "property": "noOfBundles", "width": 60 },
                    { "label": "Correction Qty", "property": "correctionQty", "width": 60 },
                    { "label": "Total No Of Pieces", "property": "totalNoOfPieces", "width": 60 },
                    { "label": "Total Finish Qty", "property": "totalFinishQty", "width": 50 },
                    { "label": "Recovery", "property": "recovery", "width": 60 },
                    { "label": "LogEnd Cut Sharp (Inch)", "property": "logEndCutSharpInch", "width": 70 },
                    { "label": "LogEnd Cut Sharp (Weight)", "property": "logEndCutSharpWeight", "width": 70 },
                    { "label": "Bundling Supervisor Remarks", "property": "bundlingSupervisorRemarks", "width": 100 }
                ];
                // let headers = await orderService.getPdfHeaders();
                // (req.headers.currentUser["roleId"] == role.Admin) && headers.push({ "label": "Process Stage", "property": "processStage", "width": 90 });
                // (req.body["type"] == AppConstants.COMPLETED) && headers.push({ "label": "Completed Date", "property": "completedDate", "width": 70 });
                let tableData = {
                    title: title + ' ' + (0, Utils_1.convertTitleCase)(req.body["type"]),
                    headers: headers,
                    datas: valueData
                };
                doc.table(tableData, {
                    // title: () => {
                    //     doc.on('pageAdded', (): void => {
                    //         doc.text(title + ' ' + convertTitleCase(req.body["type"]))
                    //             .font("Helvetica-Bold")
                    //             .fontSize(20)
                    //             .image('./jindal_logo.png', 730, 20, { width: 50 })
                    //             .moveDown()
                    //         // doc.image('./image.png', 330, 120, {
                    //         //     width: 150,
                    //         //     opacity: 0.2,
                    //         //     align: "center"
                    //         // })
                    //     });
                    // },
                    prepareHeader: () => {
                        doc.font("Helvetica-Bold").fontSize(8);
                        doc.on('pageAdded', () => {
                            // doc.text(title + ' ' + convertTitleCase(req.body["type"]))
                            //     .font("Helvetica-Bold")
                            //     // .fontSize(20)
                            //     .image('./jindal_logo.png', 730, 20, { width: 50 })
                            //     .moveDown()
                            //     .moveDown()
                            doc.image('./jindal_logo.png', xAxis, yAxis, { width: 150 });
                        });
                    },
                    prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                        doc.font("Helvetica").fontSize(8);
                        indexColumn === 0;
                    },
                    // width: 300,
                    // columnsSize: [ 200, 100, 100 ],
                });
                // doc.on('pageAdded', (): void => {
                //     doc.text(title + ' ' + convertTitleCase(req.body["type"]))
                //         .font("Helvetica-Bold")
                //         .fontSize(20)
                //         .image('./jindal_logo.png', 730, 20, { width: 50 })
                //         .moveDown()
                //     // doc.image('./image.png', 330, 120, {
                //     //     width: 150,
                //     //     opacity: 0.2,
                //     //     align: "center"
                //     // })
                //     //     .fillColor('B2B2B2')
                // });
                let filename = ((title + '_' + (0, Utils_1.convertTitleCase)(req.body["type"])) + '.pdf').replace(' ', '_');
                res.setHeader('Content-disposition', `attachment; filename = ${filename}`);
                res.setHeader('Content-type', 'application/pdf');
                doc.pipe(res);
                doc.end();
            }
            else
                return res.status(212).send({ "message": "No Data" });
        }
        catch (error) {
            console.log("Error_in_pdfDownload " + error);
            return res.status(500).send(Appconstants_1.default.SOMETHING_WENT_WRONG + ' ' + error);
        }
    });
}
exports.pdfDownload = pdfDownload;
//# sourceMappingURL=ExportController.js.map