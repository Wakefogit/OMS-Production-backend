"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ExportController_1 = require("../controller/ExportController");
const router = express_1.default.Router();
router.post("/csv", ExportController_1.csvDownload);
router.post("/pdf", ExportController_1.pdfDownload);
router.post("/dashboard/csv", ExportController_1.csvDashboardDownload);
exports.default = router;
//# sourceMappingURL=routes.js.map