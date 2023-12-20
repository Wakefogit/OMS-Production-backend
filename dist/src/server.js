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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_graphql_1 = require("express-graphql");
const models_1 = __importDefault(require("./../models"));
const schema_1 = __importDefault(require("./schemas/schema"));
const Appconstants_1 = __importDefault(require("./constants/Appconstants"));
const AuthenticationMiddleware_1 = require("./middleware/AuthenticationMiddleware");
const loginSchema_1 = __importDefault(require("./schemas/loginSchema"));
const routes_1 = __importDefault(require("./routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const AlterTable_SystemVersion_1 = require("./utils/AlterTable_SystemVersion");
const Scheduler_1 = require("./scheduler/Scheduler");
const adminSchema_1 = __importDefault(require("./schemas/adminSchema"));
const schedulerRoute_1 = __importDefault(require("./schedulerRoute"));
const handleCors = (router) => router.use((0, cors_1.default)({ /*credentials: true,*/ origin: true }));
const loginMiddleWare = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("loginMiddleWare Url " + request.url);
    if (request.url.includes(Appconstants_1.default.LOGIN_URL) || request.url.includes(Appconstants_1.default.SCHEDULER_URL)) {
        next();
        return;
    }
    else {
        let auth = new AuthenticationMiddleware_1.AuthenticationMiddleware();
        let result = yield auth.checkAuthorization(request.headers.authorization || '');
        if (result) {
            request.headers["currentUser"] = result;
            next();
        }
        else {
            response.status(401).send({ message: Appconstants_1.default.AUTHORIZATION_REQUIRED_ERROR });
        }
    }
});
const app = (0, express_1.default)();
handleCors(app);
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(loginMiddleWare);
app.use('/jindal/api/login', (0, express_graphql_1.graphqlHTTP)((request, response) => ({
    schema: loginSchema_1.default,
})));
app.use('/jindal/api/jindal', (0, express_graphql_1.graphqlHTTP)((request, response) => ({
    schema: schema_1.default,
    graphiql: true,
    // pretty: true
    context: {
        currentUser: request.headers.currentUser,
        authorization: request.headers.authorization,
        reqBody: request.body,
        resBody: response.set('Access-Control-Allow-Origin', '*')
    }
})));
app.use('/jindal/api/admin/jindal', (0, express_graphql_1.graphqlHTTP)((request, response) => ({
    schema: adminSchema_1.default,
    graphiql: true,
    // pretty: true
    context: {
        currentUser: request.headers.currentUser,
        authorization: request.headers.authorization,
        reqBody: request.body,
        resBody: response.set('Access-Control-Allow-Origin', '*')
    }
})));
app.use('/jindal/api/download', routes_1.default);
app.use('/schedule', schedulerRoute_1.default);
app.timeout = 300000;
const port = process.env.PORT;
// db.sequelize.sync({ alter: true }).then(async () => {
models_1.default.sequelize.sync().then(() => __awaiter(void 0, void 0, void 0, function* () {
    (process.env.NODE_ENV != Appconstants_1.default.LOCAL) && (yield (0, AlterTable_SystemVersion_1.AlterTableFunction)());
    app.listen(port, () => {
        console.log("server listening on port: ", port);
        console.log("start date ", new Date());
        let scheduler = new Scheduler_1.Scheduler();
        scheduler.scheduleChannel();
    });
})).catch((err) => console.log("error in server.ts ", err));
//# sourceMappingURL=server.js.map