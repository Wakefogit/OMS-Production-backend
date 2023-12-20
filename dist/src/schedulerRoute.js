"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { generateJob } from "./scheduler/Scheduler";
const Scheduler_1 = require("./scheduler/Scheduler");
let scheduler = new Scheduler_1.Scheduler();
const schedulerRouter = express_1.default.Router();
schedulerRouter.post("/generate/job", scheduler.generateJob);
exports.default = schedulerRouter;
//# sourceMappingURL=schedulerRoute.js.map