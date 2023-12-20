import express, { Router } from "express";
import cors from "cors";
import { graphqlHTTP } from 'express-graphql';
import db from "./../models";
import schema from "./schemas/schema";
import AppConstants from "./constants/Appconstants";
import { AuthenticationMiddleware } from "./middleware/AuthenticationMiddleware";
import loginSchema from "./schemas/loginSchema";
import router from "./routes";
import bodyParser from "body-parser";
import { AlterTableFunction } from "./utils/AlterTable_SystemVersion";
import { Scheduler } from "./scheduler/Scheduler";
import adminSchema from "./schemas/adminSchema";
import schedulerRouter from "./schedulerRoute";

const handleCors = (router: Router) => router.use(cors({ /*credentials: true,*/ origin: true }));

const loginMiddleWare = async (request, response, next) => {
    console.log("loginMiddleWare Url " + request.url);
    if (request.url.includes(AppConstants.LOGIN_URL) || request.url.includes(AppConstants.SCHEDULER_URL) ) {
        next();
        return;
    } else {
        let auth = new AuthenticationMiddleware();
        let result = await auth.checkAuthorization(request.headers.authorization || '');
        if (result) {
            request.headers["currentUser"] = result;
            next();
        } else {
            response.status(401).send({ message: AppConstants.AUTHORIZATION_REQUIRED_ERROR });
        }
    }
}

const app = express();
handleCors(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(loginMiddleWare);

app.use('/jindal/api/login',
    graphqlHTTP((request: any, response: any) => ({
        schema: loginSchema,
    })));

app.use('/jindal/api/jindal',
    graphqlHTTP((request: any, response: any) => ({
        schema: schema,
        graphiql: true,
        // pretty: true
        context: {
            currentUser: request.headers.currentUser,
            authorization: request.headers.authorization,
            reqBody: request.body,
            resBody: response.set('Access-Control-Allow-Origin', '*')
        }
    })));

app.use('/jindal/api/admin/jindal',
    graphqlHTTP((request: any, response: any) => ({
        schema: adminSchema,
        graphiql: true,
        // pretty: true
        context: {
            currentUser: request.headers.currentUser,
            authorization: request.headers.authorization,
            reqBody: request.body,
            resBody: response.set('Access-Control-Allow-Origin', '*')
        }
    })));

app.use('/jindal/api/download', router)
app.use('/schedule', schedulerRouter)

app.timeout = 300000;

const port = process.env.PORT

// db.sequelize.sync({ alter: true }).then(async () => {
db.sequelize.sync().then(async () => {
    (process.env.NODE_ENV != AppConstants.LOCAL) && await AlterTableFunction();
    app.listen(port, () => {
        console.log("server listening on port: ", port)
        console.log("start date ",new Date())
        let scheduler = new Scheduler();
        scheduler.scheduleChannel();
    })
}).catch((err) => console.log("error in server.ts " , err));