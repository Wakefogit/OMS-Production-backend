"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppConstants = {
    LOCAL: "local",
    DEVELOPMENT: "development",
    PRODUCTION: "production",
    LOGIN_URL: "/login",
    SCHEDULER_URL: "/schedule/generate/job",
    DB_JINDAL: "JINDALOMS",
    DB_JINDALORDER: "SAP",
    TBL_USER: "tbl_user",
    TBL_ROLE: "tbl_role",
    TBL_LOGINTRACK: "tbl_loginTrack",
    TBL_ORDER: "tbl_order",
    TBL_ORDERUSERMAPPING: "tbl_orderUserMapping",
    TBL_REFERENCEGROUP: "tbl_referenceGroup",
    TBL_REFERENCE: "tbl_reference",
    TBL_PPC: "tbl_ppc",
    TBL_TOOLSHOP: "tbl_toolShop",
    TBL_QA: "tbl_qa",
    TBL_OPERATORENTRY: "tbl_operatorEntry",
    TBL_BUNDLINGSUPERVISOR: "tbl_bundlingSupervisor",
    TBL_WORKFLOW: "tbl_workFlow",
    TBL_ORDERTIMETRACK: "tbl_orderTimeTrack",
    TBL_JOB: "tbl_job",
    TBL_JOBDETAILS: "tbl_jobDetails",
    TBL_STAGETABLE: "ProdTable",
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NINE: 9,
    TEN: 10,
    ELEVEN: 11,
    TWELVE: 12,
    THIRTEEN: 13,
    FOURTEEN: 14,
    FIFTEEN: 15,
    SIXTEEN: 16,
    SEVENTEEN: 17,
    EIGHTEEN: 18,
    NINETEEN: 19,
    TWENTY: 20,
    FOURTY: 40,
    SIXTY: 60,
    EIGHTY: 80,
    HUNDRED: 100,
    YES: "Yes",
    NO: "No",
    PENDING: "PENDING",
    INPROGRESS: "INPROGRESS",
    HOLD: "HOLD",
    PICK: "PICK",
    COMPLETED: "COMPLETED",
    DELETED_SUCCESSFULLY: "Deleted Successfully",
    UPDATED_SUCCESSFULLY: "Updated Successfully",
    CREATED_SUCCESSFULLY: "Created Successfully",
    PROBLEM_WHILE_CREATING: "Problem while creating",
    PROBLEM_WHILE_UPDATING: "Problem while updating",
    NO_RECORDS_TO_UPDATE: "No active records to update",
    MAIL_ALREADY_EXIST: "Email Already Exist",
    INVALID_REQUEST_BODY: "Invalid Request Body",
    SOMETHING_WENT_WRONG: "Something went wrong. Please contact administrator",
    INVALID_ID: "Invalid id",
    USERS_ALREADY_EXIST: "Users already exist",
    INVALID_USER: "Invalid User",
    INVALID_TYPE: "Invalid input type",
    INVALID_ROLE: "Invalid Role",
    ORDER_ALREADY_PICKED: "Order already picked",
    NOTHING_TO_PULL: "Nothing to pull",
    LOGIN_UNSUCCESS: "Login Unsuccessful. Incorrect Username or Password",
    AUTHORIZATION_REQUIRED_ERROR: "Unauthorized Access.",
    PROVIDE_TOKEN: "Please provide an authorization token.",
    ADMIN: "Admin",
    PPC: "PPC",
    TOOLSHOP: "Tool Shop",
    QA: "QA ",
    OPERATOR_ENTRY: "Operator Entry",
    BUNDLING_SUPERVISOR: "Bundling Supervisor",
    LOGIN: "Login",
    LOGOUT: "Logout",
    SCHEMA_NAME: {
        LOGIN: "login",
        GET_STRING_DATA: "getStringData",
        GET_ORDER_DATA: "getOrderData",
        GET_PPC_INPROGRESS_DATA: "getPpcInprogressData",
        GET_TOOLSHOP_INPROGRESS_DATA: "getToolShopInprogressData",
        GET_QA_INPROGRESS_DATA: "getQAInprogressData",
        GET_OPERATORENTRY_INPROGRESS_DATA: "getOperatorEntry_inprogressData",
        GET_BUNDLINGSUPERVISOR_INPROGRESS_DATA: "getBundlingSupervisor_inprogressData",
        GET_VIEW_DETAILS: "getViewDetails",
        GET_REFERENCE_DATA: "getReferenceData",
        CREATE_OR_UPDATE_PPCDATA: "createOrUpdatePpcData",
        UPDATE_ORDERSTATUS_WITHMAPPING: "updateOrderStatus_withMapping",
        CREATE_OR_UPDATE_TOOLSHOPDATA: "createOrUpdateToolShopData",
        CREATE_OR_UPDATE_OPERATORENTRYDATA: "createOrUpdateOperatorEntryData",
        CREATE_OR_UPDATE_QADATA: "createOrUpdateQAData",
        CREATE_OR_UPDATE_BUNDLINGSUPERVISOR: "createOrUpdateBundlingSupervisor",
        MANUAL_ORDER_SYNC: "manualOrderSync",
        LOGOUT: "logout",
        GET_ADMIN_STRING_DATA: "getAdminStringData",
        CREATE_OR_UPDATE_USER: "createOrUpdateUser",
        GET_ROLE_LIST: "getRoleList",
        GET_USER_DETAILS_LIST: "getUserDetailsList",
        GET_REPORT_DATA: "getReportData",
        DOWNLOAD_DASHBOARD_AS_EXCEL: "downloadDashboardAsExcel",
    },
    TRANSTYPE: {
        QUERY: "Query",
        MUTATION: "Mutation"
    }
};
exports.default = AppConstants;
//# sourceMappingURL=Appconstants.js.map