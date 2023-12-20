"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const typedi_1 = require("typedi");
let BaseService = class BaseService {
    createOrUpdateByModel(model, data, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (data.dataValues.id == 0 || data.dataValues.id == null || data.dataValues.id == undefined) {
                    console.log("Create data ", data.dataValues);
                    let result = yield model.create(data.dataValues, { transaction: tran });
                    console.log('result', result.dataValues);
                    return result.dataValues;
                }
                else {
                    console.log("Update Data ", data.dataValues);
                    yield model.update(data.dataValues, {
                        where: { id: data.dataValues.id }
                    }, { transaction: tran });
                    let result = yield model.findByPk(data.dataValues.id);
                    console.log('result', result.dataValues);
                    return result.dataValues;
                }
            }
            catch (error) {
                console.log(`Error in createOrUpdateByModel ::: ${error}`);
                throw error;
            }
        });
    }
    createorUpdateModelWithoutTran(model, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (data.dataValues.id == 0 || data.dataValues.id == null || data.dataValues.id == undefined) {
                    console.log("Create data ", data.dataValues);
                    let result = yield model.create(data.dataValues);
                    console.log('result', result.dataValues);
                    return result.dataValues;
                }
                else {
                    console.log("Update Data ", data.dataValues);
                    yield model.update(data.dataValues, {
                        where: { id: data.dataValues.id }
                    });
                    let result = yield model.findByPk(data.dataValues.id);
                    console.log('result', result.dataValues);
                    return result.dataValues;
                }
            }
            catch (error) {
                console.log(`Error in createorUpdateModelWithoutTran ::: ${error}`);
                throw error;
            }
        });
    }
    findAllValues(model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Model ", model);
                let query = model.findAll();
                console.log("Query ", JSON.stringify(query));
                return query;
            }
            catch (error) {
                console.log("Error occurred in findAllValues " + error);
                return error;
            }
        });
    }
    findUniqueKey(model, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("data of event", data, model);
                let response = yield model.findOne({
                    where: { uniqueKey: data, isDeleted: 0 },
                    raw: true
                });
                return response;
            }
            catch (error) {
                console.log("Error occurred in Unique Key " + error);
                return error;
            }
        });
    }
    findOneValues(findmodel, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = yield findmodel.findOne({
                    where: { id: data, isDeleted: 0 }
                });
                console.log("Query ", JSON.stringify(query.dataValues));
                return query.dataValues;
            }
            catch (error) {
                console.log("Error occurred in findOneValues " + error);
                return error;
            }
        });
    }
    bulkCreation(data, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("into the bulk creation");
                console.log('data', data);
                let record = yield this.getModel()
                    .bulkCreate(data, { transaction: tran }) //array of objects
                    .then((obj) => {
                    console.log("obj::", obj);
                    return obj;
                })
                    .catch((error) => {
                    // console.log(error);
                    return error;
                });
                console.log('Bulk record', record[0].dataValues);
                return record[0].dataValues;
            }
            catch (error) {
                // console.log(`Error occurred in createOrUpdate ::: ${error}`);
                throw error;
            }
        });
    }
    splitDataValuesFromData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return data.dataValues;
            }
            catch (error) {
                throw error;
            }
        });
    }
    compareTwoArrays(firstArray, secondArray) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const removeCommon = (firstArray, secondArray) => {
                    const spreaded = [...firstArray, ...secondArray];
                    return spreaded.filter(el => {
                        return !(firstArray.includes(el) && secondArray.includes(el));
                    });
                };
                return removeCommon(firstArray, secondArray);
            }
            catch (error) {
                throw error;
            }
        });
    }
    compareByFirstArray(firstArray, secondArray) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let arrayDifference = firstArray.filter(x => secondArray.indexOf(x) === -1);
                console.log(arrayDifference);
                return arrayDifference;
            }
            catch (error) {
                throw error;
            }
        });
    }
    bulkCreation_Multiple_response(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("into the bulk creation");
                console.log('data', data);
                let record = yield this.getModel()
                    .bulkCreate(data) //array of objects
                    .then((obj) => {
                    console.log("obj::", obj);
                    return obj;
                })
                    .catch((error) => {
                    return error;
                });
                console.log('Bulk record', record);
                return record;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findByEmail(findmodel, email, userUniqueKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = yield findmodel.findOne({
                    where: {
                        email: email,
                        isDeleted: 0,
                        uniqueKey: {
                            [sequelize_1.Op.not]: userUniqueKey
                        }
                    },
                    raw: true
                });
                console.log("Query ", query);
                return query;
            }
            catch (error) {
                console.log("Error occurred in findOneValues " + error);
                throw error;
            }
        });
    }
    findCustomer_byMobileNumber(findmodel, mobileNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = yield findmodel.findOne({
                    where: { mobileNumber: mobileNumber, isDeleted: 0 }
                });
                console.log("Query ", query);
                return query.dataValues;
            }
            catch (error) {
                console.log("Error occurred in findOneValues " + error);
                throw error;
            }
        });
    }
    sleep(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        });
    }
    findByKey(model, Key, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("data of event", data, model);
                let response = yield model.findOne({
                    where: { [Key]: data, isDeleted: 0 },
                    raw: true
                });
                return response;
            }
            catch (error) {
                console.log("Error occurred in Unique Key " + error);
                return error;
            }
        });
    }
};
BaseService = __decorate([
    (0, typedi_1.Service)()
], BaseService);
exports.default = BaseService;
//# sourceMappingURL=BaseService.js.map