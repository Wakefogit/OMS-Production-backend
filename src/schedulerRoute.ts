import express from "express";
// import { generateJob } from "./scheduler/Scheduler";
import { Scheduler } from "./scheduler/Scheduler";

let scheduler = new Scheduler()

const schedulerRouter = express.Router();

schedulerRouter.post("/generate/job", scheduler.generateJob)


export default schedulerRouter;