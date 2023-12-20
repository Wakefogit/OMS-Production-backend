"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandlerMiddleware = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
let ErrorHandlerMiddleware = class ErrorHandlerMiddleware {
    error(error, req, res, next) {
        if (!res.headersSent) {
            if (error.httpCode != 500) {
                console.log("Error", error);
                res.status(error.httpCode ? error.httpCode : 500);
                let name;
                let message;
                switch (error.name) {
                    case 'NotFoundError':
                        name = 'empty_response';
                        message = 'Object not found';
                        break;
                    case 'InvalidCharacterError':
                    case 'LoginError':
                        name = 'failed_login';
                        message = error.message;
                        break;
                    case 'AuthorizationRequiredError':
                        name = 'unauthorized_access';
                        message = 'Before using api client must be authorized';
                        break;
                    default:
                        name = error.name;
                        message = error.message;
                }
                res.json({
                    name: name,
                    message: message
                });
            }
            else {
                console.log("Error", error);
                res.status(error.httpCode);
                res.json({
                    name: error.name,
                    message: error.message,
                });
            }
        }
        //console.log(error.name, error.stack);
    }
};
ErrorHandlerMiddleware = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.Middleware)({ type: "after" })
], ErrorHandlerMiddleware);
exports.ErrorHandlerMiddleware = ErrorHandlerMiddleware;
//# sourceMappingURL=ErrorHandlerMiddleware.js.map