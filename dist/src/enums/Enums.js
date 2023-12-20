"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processStageMeta = exports.role = exports.bundlingSupervisorWorkFlow = exports.operatorEntryWorkFlow = exports.qaWorkFlow = exports.toolShopWorkFlow = exports.ppcWorkFlow = exports.workFlow = void 0;
var workFlow;
(function (workFlow) {
    workFlow[workFlow["Pending"] = 1] = "Pending";
    workFlow[workFlow["PPC_Inprogress"] = 2] = "PPC_Inprogress";
    workFlow[workFlow["PPC_Hold"] = 3] = "PPC_Hold";
    workFlow[workFlow["Queued_for_Tool_Shop"] = 4] = "Queued_for_Tool_Shop";
    workFlow[workFlow["Tool_Shop_Inprogress"] = 5] = "Tool_Shop_Inprogress";
    workFlow[workFlow["Tool_Shop_Hold"] = 6] = "Tool_Shop_Hold";
    workFlow[workFlow["Queued_for_QA"] = 7] = "Queued_for_QA";
    workFlow[workFlow["QA_Inprogress"] = 8] = "QA_Inprogress";
    workFlow[workFlow["QA_Hold"] = 9] = "QA_Hold";
    workFlow[workFlow["Queued_for_Operator_Entry"] = 10] = "Queued_for_Operator_Entry";
    workFlow[workFlow["Operator_Entry_Inprogress"] = 11] = "Operator_Entry_Inprogress";
    workFlow[workFlow["Operator_Entry_Hold"] = 12] = "Operator_Entry_Hold";
    workFlow[workFlow["Queued_for_Bundling_Supervisior"] = 13] = "Queued_for_Bundling_Supervisior";
    workFlow[workFlow["Bundling_Supervisior_Inprogress"] = 14] = "Bundling_Supervisior_Inprogress";
    workFlow[workFlow["Bundling_Supervisior_Hold"] = 15] = "Bundling_Supervisior_Hold";
    workFlow[workFlow["Bundling_Supervisior_Completed"] = 16] = "Bundling_Supervisior_Completed";
    workFlow[workFlow["Archived"] = 17] = "Archived";
})(workFlow = exports.workFlow || (exports.workFlow = {}));
var ppcWorkFlow;
(function (ppcWorkFlow) {
    ppcWorkFlow[ppcWorkFlow["Pending"] = 1] = "Pending";
    ppcWorkFlow[ppcWorkFlow["PPC_Inprogress"] = 2] = "PPC_Inprogress";
    ppcWorkFlow[ppcWorkFlow["PPC_Hold"] = 3] = "PPC_Hold";
})(ppcWorkFlow = exports.ppcWorkFlow || (exports.ppcWorkFlow = {}));
var toolShopWorkFlow;
(function (toolShopWorkFlow) {
    toolShopWorkFlow[toolShopWorkFlow["Queued_for_Tool_Shop"] = 4] = "Queued_for_Tool_Shop";
    toolShopWorkFlow[toolShopWorkFlow["Tool_Shop_Inprogress"] = 5] = "Tool_Shop_Inprogress";
    toolShopWorkFlow[toolShopWorkFlow["Tool_Shop_Hold"] = 6] = "Tool_Shop_Hold";
})(toolShopWorkFlow = exports.toolShopWorkFlow || (exports.toolShopWorkFlow = {}));
var qaWorkFlow;
(function (qaWorkFlow) {
    qaWorkFlow[qaWorkFlow["Queued_for_QA"] = 7] = "Queued_for_QA";
    qaWorkFlow[qaWorkFlow["QA_Inprogress"] = 8] = "QA_Inprogress";
    qaWorkFlow[qaWorkFlow["QA_Hold"] = 9] = "QA_Hold";
})(qaWorkFlow = exports.qaWorkFlow || (exports.qaWorkFlow = {}));
var operatorEntryWorkFlow;
(function (operatorEntryWorkFlow) {
    operatorEntryWorkFlow[operatorEntryWorkFlow["Queued_for_Operator_Entry"] = 10] = "Queued_for_Operator_Entry";
    operatorEntryWorkFlow[operatorEntryWorkFlow["Operator_Entry_Inprogress"] = 11] = "Operator_Entry_Inprogress";
    operatorEntryWorkFlow[operatorEntryWorkFlow["Operator_Entry_Hold"] = 12] = "Operator_Entry_Hold";
})(operatorEntryWorkFlow = exports.operatorEntryWorkFlow || (exports.operatorEntryWorkFlow = {}));
var bundlingSupervisorWorkFlow;
(function (bundlingSupervisorWorkFlow) {
    bundlingSupervisorWorkFlow[bundlingSupervisorWorkFlow["Queued_for_Bundling_Supervisior"] = 13] = "Queued_for_Bundling_Supervisior";
    bundlingSupervisorWorkFlow[bundlingSupervisorWorkFlow["Bundling_Supervisior_Inprogress"] = 14] = "Bundling_Supervisior_Inprogress";
    bundlingSupervisorWorkFlow[bundlingSupervisorWorkFlow["Bundling_Supervisior_Hold"] = 15] = "Bundling_Supervisior_Hold";
    bundlingSupervisorWorkFlow[bundlingSupervisorWorkFlow["Bundling_Supervisior_Completed"] = 16] = "Bundling_Supervisior_Completed";
})(bundlingSupervisorWorkFlow = exports.bundlingSupervisorWorkFlow || (exports.bundlingSupervisorWorkFlow = {}));
var role;
(function (role) {
    role[role["Admin"] = 1] = "Admin";
    role[role["PPC"] = 2] = "PPC";
    role[role["Tool_Shop"] = 3] = "Tool_Shop";
    role[role["QA"] = 4] = "QA";
    role[role["Operator_Entry"] = 5] = "Operator_Entry";
    role[role["Bundling_Supervisior"] = 6] = "Bundling_Supervisior";
})(role = exports.role || (exports.role = {}));
var processStageMeta;
(function (processStageMeta) {
    processStageMeta["ppc"] = "PPC Data";
    processStageMeta["toolShop"] = "Tool Shop Data";
    processStageMeta["qa"] = "QA Data";
    processStageMeta["operatorEntry"] = "Operator Entry";
    processStageMeta["bundlingSupervisor"] = "Bundling Supervisor";
})(processStageMeta = exports.processStageMeta || (exports.processStageMeta = {}));
//# sourceMappingURL=Enums.js.map