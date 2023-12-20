import { OrderService } from "../src/services/OrderService";
import AppConstants from "../src/constants/Appconstants";
import { role } from "../src/enums/Enums";
import * as fastCSV from "fast-csv";
import { convertTitleCase, formatDate, isArrayPopulated } from "../src/utils/Utils";
import { OperatorEntryService } from "../src/services/OperatorEntryService";
import { DownloadTemplateService } from "../src/services/DownloadTemplateService";
const PDFDocument = require("pdfkit-table");

let orderService = new OrderService();
let operatorEntryService = new OperatorEntryService();
let downloadTemplateService = new DownloadTemplateService();

export async function csvDownload(req, res) {
    try {
        console.log("Into_the_csvDownload ", req.body, req.headers.currentUser);
        let dataHeaders = await downloadTemplateService.getDownloadTemplate([], AppConstants.ONE, 'PO Release Date');
        let query = await orderService.orderList(req.body, req.headers.currentUser);
        let dataArr;
        if (isArrayPopulated(query)) {
            dataArr = await orderService.getDownloadJsonFormation(query, dataHeaders);
            console.log("dataArr ", dataArr);
            res.setHeader('Content-disposition', 'attachment; filename=report.csv');
            res.setHeader('content-type', 'text/csv');
            // let result = await fastCSV.write(dataArr, { headers: true })
            //     .on("finish", function () { })
            // return res.status(200).send(result);
            fastCSV.write(dataArr, { headers: true })
                .on("finish", function () { })
                .pipe(res);
        } else
            return res.status(212).send(query);
    } catch (error) {
        console.log("Error_in_csvDownload " + error);
        return res.status(500).send(AppConstants.SOMETHING_WENT_WRONG + ' ' + error);
    }
}

export async function csvDashboardDownload(req, res) {
    try {
        console.log("Into_the_csvDownload ", req.body, req.headers.currentUser);
        let dataHeaders = await downloadTemplateService.getDownloadTemplate(req.body.headers, AppConstants.ZERO, null);
        let array = dataHeaders.map(e => e.queryAndFunction)
        let query = await orderService.getDashboardDownloadList(req.body, array.toString());
        let dataArr;
        if (isArrayPopulated(query)) {
            dataArr = await orderService.getDownloadJsonFormation(query, dataHeaders);
            console.log("dataArr ", dataArr);
            res.setHeader('Content-disposition', 'attachment; filename=report.csv');
            res.setHeader('content-type', 'text/csv');
            fastCSV.write(dataArr, { headers: true })
                .on("finish", function () { })
                .pipe(res);
        } else
            return res.status(212).send(query);
    } catch (error) {
        console.log("Error_in_csvDownload " + error);
        return res.status(500).send(AppConstants.SOMETHING_WENT_WRONG + ' ' + error);
    }
}

export async function pdfDownload(req, res) {
    try {
        console.log("Into_the_pdfDownload ", req.body, req.headers.currentUser);
        let query = await orderService.orderList(req.body, req.headers.currentUser);
        if (isArrayPopulated(query)) {
            // let doc = new PDFDocument({ margin: 20, size: 'A4' });
            let pdfWidth = 4350, pdfHeight = 1000;
            let doc = new PDFDocument({ margin: 30, size: [pdfHeight, pdfWidth], layout: 'landscape' });
            let title = await orderService.getRoleNameById(req.headers.currentUser["roleId"]);
            // doc.text(title + ' ' + convertTitleCase(req.body["type"]))
            //     .font("Helvetica-Bold")
            //     .fontSize(20)
            //     .image('./jindal_logo.png', 730, 20, { width: 50 })
            //     .moveDown()
            // doc.image('./jindal_logo.png', 330, 180, { width: 150 })
            let xAxis = pdfWidth / 2, yAxis = pdfHeight / 2;
            doc.image('./jindal_logo.png', xAxis, yAxis, { width: 150 })
            let valueData = [];
            for (let data of query) {
                let value = {
                    "sectionNo": data.sectionNo, "orderNo": data.orderNo, "soNo": data.soNo,
                    "orderDate": `${formatDate(data.orderDate)}`, "customerName": data.customerName,
                    "orderQty": data.orderQty, "alloyTemper": data.alloyTemper, "cutLength": data.cutLength,
                    "priority": data.priority,
                    "processStage": data.processStage,
                    "completedDate": `${req.body["type"] == AppConstants.COMPLETED ? formatDate(data.completedDate) : null}`,
                    "alloy": data["alloy"] ? data["alloy"] : '',
                    "quenching": data?.quenching ? data.quenching : '',
                    "productionRate": data?.productionRate ? data.productionRate : '',
                    "billetLength": data?.billetLength ? data.billetLength : '',
                    "noOfBillet": data?.noOfBillet ? data.noOfBillet : '',
                    "piecesPerBillet": data?.piecesPerBillet ? data.piecesPerBillet : '',
                    "buttThickness": data?.buttThickness ? data.buttThickness : '',
                    "extrusionLength": data?.extrusionLength ? data.extrusionLength : '',
                    "coringOrPipingLength_frontEnd": data?.coringOrPipingLength_frontEnd ? data.coringOrPipingLength_frontEnd : '',
                    "coringOrPipingLength_backEnd": data?.coringOrPipingLength_backEnd ? data.coringOrPipingLength_backEnd : '',
                    "pressEntry": data?.pressEntry ? data.pressEntry : '',
                    "plantRefId": data?.plantRefId ? data.plantRefId : '',
                    "balanceQuantity": data?.balanceQuantity ? data?.balanceQuantity : '',
                    "noOfPiecesRequired": data?.noOfPiecesRequired ? data?.noOfPiecesRequired : '',
                    "quantityTolerance": data?.quantityTolerance ? data?.quantityTolerance : '',
                    "ppcRemarks": data?.ppcRemarks ? data.ppcRemarks : '',
                    "dieRefId": data?.dieRefId ? data.dieRefId : '',
                    "noOfCavity": data?.noOfCavity ? data.noOfCavity : '',
                    "bolsterEntry": data?.bolsterEntry ? data.bolsterEntry : '',
                    "backerEntry": data?.backerEntry ? data.backerEntry : '',
                    "specialBackerEntry": data?.specialBackerEntry ? data.specialBackerEntry : '',
                    "ringEntry": data?.ringEntry ? data.ringEntry : '',
                    "dieSetter": data?.dieSetter ? data.dieSetter : '',
                    "weldingChamber": data?.weldingChamber ? data.weldingChamber : '',
                    "toolShopRemarks": data?.toolShopRemarks ? data.toolShopRemarks : '',
                    "qaRemarks": data["qaRemarks"] ? data["qaRemarks"] : '',
                    "batchNo": data["batchNo"] ? JSON.parse(data["batchNo"]).toString() : '',
                    "buttWeight": data["buttWeight"] ? data["buttWeight"] : '',
                    "pushOnBilletLength": data["pushOnBilletLength"] ? JSON.parse(data["pushOnBilletLength"]).toString() : '',
                    "approxPushQty": data["approxPushQty"] ? data["approxPushQty"] : '',
                    "startTime": data["startTime"] ? `${formatDate(data["startTime"])}` : '',
                    "endTime": data["endTime"] ? `${formatDate(data["endTime"])}` : '',
                    "processTime": data["processTime"] ? data["processTime"] : '',
                    "productionRateActual": data["productionRateActual"] ? data["productionRateActual"] : '',
                    "dieWithAluminium": data["dieWithAluminium"] ? data["dieWithAluminium"] : '',
                    "diefailed": data["diefailed"] ? data["diefailed"] : '',
                    "dieFailureReasonRefId": data["dieFailureReasonRefId"] ? data["dieFailureReasonRefId"] : '',
                    "breakDownStartTime": data["breakDownStartTime"] ? `${formatDate(data["breakDownStartTime"])}` : '',
                    "breakDownEndTime": data["breakDownEndTime"] ? `${formatDate(data["breakDownEndTime"])}` : '',
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
                }
                if (req.headers.currentUser["roleId"] != role.Admin) delete value["processStage"]
                if (req.body["type"] != AppConstants.COMPLETED) delete value["completedDate"]
                valueData.push(value)
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
                title: title + ' ' + convertTitleCase(req.body["type"]),
                headers: headers,
                datas: valueData
            }
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
                    doc.font("Helvetica-Bold").fontSize(8)
                    doc.on('pageAdded', (): void => {
                        // doc.text(title + ' ' + convertTitleCase(req.body["type"]))
                        //     .font("Helvetica-Bold")
                        //     // .fontSize(20)
                        //     .image('./jindal_logo.png', 730, 20, { width: 50 })
                        //     .moveDown()
                        //     .moveDown()
                        doc.image('./jindal_logo.png', xAxis, yAxis, { width: 150 })
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
            let filename = ((title + '_' + convertTitleCase(req.body["type"])) + '.pdf').replace(' ', '_');
            res.setHeader('Content-disposition', `attachment; filename = ${filename}`);
            res.setHeader('Content-type', 'application/pdf');

            doc.pipe(res);
            doc.end();
        } else
            return res.status(212).send({ "message": "No Data" });
    } catch (error) {
        console.log("Error_in_pdfDownload " + error);
        return res.status(500).send(AppConstants.SOMETHING_WENT_WRONG + ' ' + error);
    }
}