import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "../resolvers/resolver";

const typeDefs = `
    scalar DateTime
    scalar Json

    input paging {
        limit: Int
        offset: Int
    }

    type page {
        nextPage: Int
        prevPage: Int
        totalCount: Int
        currentPage: Int
    }

    input orderDataInput {
        type: String!
        fpo: String
        fcustomer_name: String
        fso: String
        fsectionNo: String
        fprocessStage: String
        fAlloyTemper: String
        fpo_qty: String
        fextruded_qty: String
        fbalance_po_qty: String
        fmarketing_remarks: String
        fcut_len: String
        fPriority: String
        fplantSelected: String
        fpressAllocation: String
        fplannedQty: String
        fplannedInternalAlloy: String
        fproductionRateRequired: String
        fplannedQuenching: String
        ffrontEndCoringLength: String
        fbackEndCoringLength: String
        fplantExtrusionLength: String
        fextrusionLengthRefId: String
        fplannedButtThickness: String
        fcutBilletsRefId: String
        fbuttWeightPerInch: String
        fppcRemarks: String
        fdieRefId: String
        fnoOfCavity: String
        fbolsterEntry: String
        fbackerEntry: String
        fspecialBackerEntry: String
        fringEntry: String
        fdieSetter: String
        fweldingChamber: String
        ftoolShopRemarks: String
        fqaRemarks: String
        fdieTrialRefId: String
        fdieWithAluminiumRefId: String
        fpreviousDayDie_continueRefId: String
        fbatchNo: String
        factualInternalAlloy: String
        fstartTime: String
        fendTime: String
        fprocessTime: String
        factualButtThickness: String
        fbreakThroughPressure: String
        fpushOnBilletLength: String
        fpushQtyInKgs: String
        factualProductionRate: String
        fbuttWeightInKgs: String
        fdiefailRefId: String
        fdieFailureReason: String
        fbreakDownDuration: String
        flogEndScrapLengthInMm: String
        flogEndScrapInKgs: String
        foperatorName: String
        foperatorEntryRemarks: String
        ffinishQuantity: String
        fpiecesPerBundle: String
        fbundleWeight: String
        fnoOfBundles: String
        ftotalNoOfPieces: String
        fcorrectionQty: String
        factualFrontEndCoringLength: String
        factualBackEndCoringLength: String
        frecovery: String
        fbundlingSupervisorRemarks: String
        exportType: Int
        paging: paging
    }

    type orderData {
        orderId: String
        sectionNo: Int
        orderNo: Int
        soNo: Int
        orderDate: DateTime
        customerName: String
        orderQty: Int
        alloyTemper: String
        cutLength: String
        priority: String
        workFlowId: Int
        completedDate: DateTime
    }

    type orderDataList {
        page: page
        orderData: [orderData]
    }

    input updatePpcDataInput{
        ppcId: String
        orderId: String!
        plantSelected: String
        pressAllocationRefId: Int
        plannedQty: Float
        plannedInternalAlloy: String
        plannedNoOfBilletAndLength: Json
        productionRateRequired: Float
        plannedQuenching: Int
        frontEndCoringLength: Float
        backEndCoringLength: Float
        plantExtrusionLength: Float
        extrusionLengthRefId: Int
        plannedButtThickness: Float
        cutBilletsRefId: Int
        buttWeightPerInch: Float
        priorityRefId: Int
        remarks: String
        isActive: Int
    }

    input updateToolShopDataInput{
        toolShopId : String
        orderId: String!
        dieRefId: String
        noOfCavity: Int
        bolsterEntry : String
        backerEntry : String
        specialBackerEntry : String
        ringEntry : String
        dieSetter : String
        weldingChamber : String
        remarks : String
        isActive : Int!
    }

    input operatorEntryDataInput{
        operatorId : String
        orderId: String!
        dieTrialRefId: Int
        dieWithAluminiumRefId: Int
        previousDayDie_continueRefId: Int
        batchNo: Int
        actualInternalAlloy: String
        startTime: DateTime
        endTime: DateTime
        processTime: String
        noOfBilletAndLength: Json
        actualButtThickness: Float
        breakThroughPressure: Float
        pushOnBilletLength: Float
        pushQtyInKgs: Float
        actualProductionRate: Float
        buttWeightInKgs: Float
        diefailRefId: Int
        dieFailureReason: String
        breakDown: Json
        breakDownDuration: String
        logEndScrapLengthInMm: Float
        logEndScrapInKgs: Float
        operatorName: String
        remarks: String
        isActive: Int!
    }

    input updateQADataInput{
        qaId: String
        orderId: String
        remarks : String
        plannedQuenching: Int
        plannedInternalAlloy: String
        frontEndCoringLength: Float
        backEndCoringLength: Float
        cut_len_tolerance_upper: Float
        cut_len_tolerance_lower: Float
        isActive : Int
    }

    input bundlingSupervisorInput{
        bundlingSupervisorId: String
        orderId: String!
        finishQuantity: Float
        piecesPerBundle: Int
        bundleWeight: Float
        noOfBundles: Int
        totalNoOfPieces: Int
        correctionQty: Float
        actualFrontEndCoringLength: Float
        actualBackEndCoringLength: Float
        recovery: Float
        remarks : String
        isActive : Int!
    }

    input updateOrderStatusInput {
        orderId: [String!]!
        type: String!
        roleData: Json
    }
    input updateorderWorkFlowInput{
        type: String!
        processStage: String
        uniqueKey: String!
        orderId: String!
        workFlowId: Int!
        remarks:String!
        plannedQuenching: Int
        plannedInternalAlloy: String
        frontEndCoringLength: Float
        backEndCoringLength: Float
        cut_len_tolerance_upper: Float
        cut_len_tolerance_lower: Float
    }

    input reportInput { 
        ffromDate: String
        ftoDate: String
        fpress: String
        fpo: String
        fcustomer_name: String
        fstatusOrWeightage: Int
        fso: String
        fsectionNo: String
        fAlloyTemper: String
        fpo_qty: String
        fextruded_qty: String
        fbalance_po_qty: String
        fmarketing_remarks: String
        fcut_len: String
        fPriority: String
        fplantSelected: String
        fpressAllocation: String
        fplannedQty: String
        fplannedInternalAlloy: String
        fproductionRateRequired: String
        fplannedQuenching: String
        ffrontEndCoringLength: String
        fbackEndCoringLength: String
        fplantExtrusionLength: String
        fextrusionLengthRefId: String
        fplannedButtThickness: String
        fcutBilletsRefId: String
        fbuttWeightPerInch: String
        fppcRemarks: String
        fdieRefId: String
        fnoOfCavity: String
        fbolsterEntry: String
        fbackerEntry: String
        fspecialBackerEntry: String
        fringEntry: String
        fdieSetter: String
        fweldingChamber: String
        ftoolShopRemarks: String
        fqaRemarks: String
        fdieTrialRefId: String
        fdieWithAluminiumRefId: String
        fpreviousDayDie_continueRefId: String
        fbatchNo: String
        factualInternalAlloy: String
        fstartTime: String
        fendTime: String
        fprocessTime: String
        factualButtThickness: String
        fbreakThroughPressure: String
        fpushOnBilletLength: String
        fpushQtyInKgs: String
        factualProductionRate: String
        fbuttWeightInKgs: String
        fdiefailRefId: String
        fdieFailureReason: String
        fbreakDownDuration: String
        flogEndScrapLengthInMm: String
        flogEndScrapInKgs: String
        foperatorName: String
        foperatorEntryRemarks: String
        ffinishQuantity: String
        fpiecesPerBundle: String
        fbundleWeight: String
        fnoOfBundles: String
        ftotalNoOfPieces: String
        fcorrectionQty: String
        factualFrontEndCoringLength: String
        factualBackEndCoringLength: String
        frecovery: String
        fbundlingSupervisorRemarks: String
        exportType: Int
        paging: paging
    }

    input dashboardDownloadInput { 
        headers: Json
        ffromDate: String
        ftoDate: String
        fpress: String
        fpo: String
        fcustomer_name: String
        fstatusOrWeightage: Int
        fso: String
        fsectionNo: String
        fAlloyTemper: String
        fpo_qty: String
        fextruded_qty: String
        fbalance_po_qty: String
        fmarketing_remarks: String
        fcut_len: String
        fPriority: String
        fplantSelected: String
        fpressAllocation: String
        fplannedQty: String
        fplannedInternalAlloy: String
        fproductionRateRequired: String
        fplannedQuenching: String
        ffrontEndCoringLength: String
        fbackEndCoringLength: String
        fplantExtrusionLength: String
        fextrusionLengthRefId: String
        fplannedButtThickness: String
        fcutBilletsRefId: String
        fbuttWeightPerInch: String
        fppcRemarks: String
        fdieRefId: String
        fnoOfCavity: String
        fbolsterEntry: String
        fbackerEntry: String
        fspecialBackerEntry: String
        fringEntry: String
        fdieSetter: String
        fweldingChamber: String
        ftoolShopRemarks: String
        fqaRemarks: String
        fdieTrialRefId: String
        fdieWithAluminiumRefId: String
        fpreviousDayDie_continueRefId: String
        fbatchNo: String
        factualInternalAlloy: String
        fstartTime: String
        fendTime: String
        fprocessTime: String
        factualButtThickness: String
        fbreakThroughPressure: String
        fpushOnBilletLength: String
        fpushQtyInKgs: String
        factualProductionRate: String
        fbuttWeightInKgs: String
        fdiefailRefId: String
        fdieFailureReason: String
        fbreakDownDuration: String
        flogEndScrapLengthInMm: String
        flogEndScrapInKgs: String
        foperatorName: String
        foperatorEntryRemarks: String
        ffinishQuantity: String
        fpiecesPerBundle: String
        fbundleWeight: String
        fnoOfBundles: String
        ftotalNoOfPieces: String
        fcorrectionQty: String
        factualFrontEndCoringLength: String
        factualBackEndCoringLength: String
        frecovery: String
        fbundlingSupervisorRemarks: String
    }
    
    type Query {
        getStringData(userName: String,password: String): Json
        getOrderData(input: orderDataInput): Json
        getPpcInprogressData(orderId: String!): Json
        getToolShopInprogressData(orderId: String!): Json
        getQAInprogressData(orderId: String!): Json
        getOperatorEntry_inprogressData(orderId: String!): Json
        getBundlingSupervisor_inprogressData(orderId: String!): Json
        getViewDetails(orderId: String!): Json
        getReferenceData(name: String!): Json
        getRoleList: Json
        getReportData(input: reportInput): Json
    }   

    type Mutation {
        createOrUpdatePpcData(input: updatePpcDataInput): Json
        updateOrderStatus_withMapping(input: updateOrderStatusInput): Json
        createOrUpdateToolShopData(input: updateToolShopDataInput): Json
        createOrUpdateOperatorEntryData(input: operatorEntryDataInput): Json
        createOrUpdateQAData(input: updateQADataInput): Json
        createOrUpdateBundlingSupervisor(input: bundlingSupervisorInput): Json
        reassignOrder(input: updateorderWorkFlowInput): String
        manualOrderSync: String
        downloadDashboardAsExcel(input: dashboardDownloadInput): Json
    }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers })

export default schema;