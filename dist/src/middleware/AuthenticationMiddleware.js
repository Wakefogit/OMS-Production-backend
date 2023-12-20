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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.AuthenticationMiddleware = void 0;
const routing_controllers_1 = require("routing-controllers");
const Utils_1 = require("../utils/Utils");
const typedi_1 = require("typedi");
const jwt = __importStar(require("jwt-simple"));
const models_1 = __importDefault(require("../../models"));
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
let AuthenticationMiddleware = class AuthenticationMiddleware {
    use(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Url " + request.url);
            const token = request.headers.authorization || "";
            if (token.length > 0) {
                let data = yield this.checkAuthorization(token);
                if (!data) {
                    response.status(401).send({ message: Appconstants_1.default.AUTHORIZATION_REQUIRED_ERROR });
                }
                else {
                    request.headers.authorization = data;
                }
            }
            else {
                response.status(401).send({ message: Appconstants_1.default.PROVIDE_TOKEN });
            }
            next();
        });
    }
    checkAuthorization(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (token == '' || token == "" || token == undefined) {
                    return false;
                }
                else {
                    const data = jwt.decode((0, Utils_1.decrypt)(token), process.env.AUTH_KEY).data.split(':');
                    let email = data[0];
                    let password = data[1];
                    // let user = await db[AppConstants.USER_DB].query(`
                    //     select * from ${process.env.POSTGRES_DATABASE_USER}.${AppConstants.USER_SCHEMA}.${AppConstants.TBL_USER} u 
                    //     where email = '${email}' and password = '${password}' and is_deleted = 0 and is_active = 1;
                    // `);
                    let user = yield models_1.default.tbl_user.findAll({
                        where: {
                            isDeleted: Appconstants_1.default.ZERO,
                            isActive: Appconstants_1.default.ONE,
                            email: email,
                            password: (0, Utils_1.encrypt)(password),
                        },
                        raw: true
                    });
                    let userDetails = user[0];
                    //console.log("User Details "+JSON.stringify(userDetails[0]));
                    if (userDetails) {
                        return userDetails;
                    }
                    else {
                        return false;
                    }
                }
            }
            catch (error) {
                console.log("error in checkAuthorization ", error);
                throw error;
            }
        });
    }
};
AuthenticationMiddleware = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.Middleware)({ type: "before" })
], AuthenticationMiddleware);
exports.AuthenticationMiddleware = AuthenticationMiddleware;
//# sourceMappingURL=AuthenticationMiddleware.js.map