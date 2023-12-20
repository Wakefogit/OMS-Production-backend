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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDuration = exports.isValueOrUndefined = exports.removeKeyfromJson = exports.convertTitleCase = exports.formatDate = exports.authToken = exports.isObjectEmpty = exports.decrypt = exports.encrypt = exports.uuidv4 = exports.paginationData = exports.stringTONumber = exports.isArrayPopulated = exports.isNotNullAndUndefined = exports.isStringNullOrEmpty = exports.isVideo = exports.isPdf = exports.fileExt = exports.isPhoto = exports.timestamp = exports.chunk = exports.contain = exports.isNullOrEmpty = exports.md5 = exports.decryptValue = exports.encryptValue = exports.nameValidation = void 0;
const CryptoJS = __importStar(require("crypto-js"));
const crypto = __importStar(require("crypto"));
const jwt = __importStar(require("jwt-simple"));
const moment_1 = __importDefault(require("moment"));
const _lodash = __importStar(require("lodash"));
function nameValidation(searchText = "") {
    const fullName = searchText.trim().split(" ");
    const firstName = fullName[0];
    const lastName = fullName[1];
    return [firstName, lastName];
}
exports.nameValidation = nameValidation;
function encryptValue(value, secretKey) {
    return CryptoJS.AES.encrypt(value, secretKey).toString();
}
exports.encryptValue = encryptValue;
function decryptValue(cipherValue, secretKey) {
    try {
        return CryptoJS.AES.decrypt(cipherValue, secretKey).toString(CryptoJS.enc.Utf8);
    }
    catch (error) {
        console.log("Error in decryptValue ", error);
    }
}
exports.decryptValue = decryptValue;
function md5(password) {
    return crypto.createHash('md5').update(password).digest("hex");
}
exports.md5 = md5;
function isNullOrEmpty(value) {
    return (!value || 0 === value.length);
}
exports.isNullOrEmpty = isNullOrEmpty;
function contain(arr, value) {
    return arr.indexOf(value) > -1;
}
exports.contain = contain;
function chunk(array, size) {
    const chunked_arr = [];
    let copied = [...array];
    const numOfChild = Math.ceil(copied.length / size);
    for (let i = 0; i < numOfChild; i++) {
        chunked_arr.push(copied.splice(0, size));
    }
    return chunked_arr;
}
exports.chunk = chunk;
function timestamp() {
    return new Date().getTime();
}
exports.timestamp = timestamp;
function isPhoto(mimetype) {
    return mimetype && mimetype == 'image/jpeg' || mimetype == 'image/jpg' || mimetype == 'image/png';
}
exports.isPhoto = isPhoto;
function fileExt(fileName) {
    return fileName.split('.').pop();
}
exports.fileExt = fileExt;
function isPdf(mimetype) {
    return mimetype && mimetype == 'application/pdf';
}
exports.isPdf = isPdf;
function isVideo(mimetype) {
    if (!mimetype)
        return false;
    switch (mimetype) {
        case 'video/mp4':
        case 'video/quicktime':
        case 'video/mpeg':
        case 'video/mp2t':
        case 'video/webm':
        case 'video/ogg':
        case 'video/x-ms-wmv':
        case 'video/x-msvideo':
        case 'video/3gpp':
        case 'video/3gpp2':
            return true;
        default:
            return false;
    }
}
exports.isVideo = isVideo;
function isStringNullOrEmpty(checkString) {
    return typeof checkString === 'string' && checkString !== null && checkString.length > 0 ? true : false;
}
exports.isStringNullOrEmpty = isStringNullOrEmpty;
function isNotNullAndUndefined(checkString) {
    return typeof checkString === 'string' && checkString !== null && checkString !== undefined;
}
exports.isNotNullAndUndefined = isNotNullAndUndefined;
function isArrayPopulated(checkArray) {
    if (checkArray !== 'undefined'
        && checkArray !== null
        && Array.isArray(checkArray)
        && checkArray.length > 0) {
        return true;
    }
    return false;
}
exports.isArrayPopulated = isArrayPopulated;
function stringTONumber(checkString) {
    return typeof checkString === 'string' ? parseInt(checkString) : checkString;
}
exports.stringTONumber = stringTONumber;
function paginationData(totalCount, LIMIT, OFFSET) {
    let totalPages = Math.ceil(totalCount / LIMIT);
    let currentPage = Math.floor(OFFSET / LIMIT);
    let prevPage = (currentPage - 1) > 0 ? (currentPage - 1) * LIMIT : 0;
    let nextPage = (currentPage + 1) <= totalPages ? (currentPage + 1) * LIMIT : 0;
    return {
        nextPage,
        prevPage,
        totalCount,
        currentPage: currentPage + 1
    };
}
exports.paginationData = paginationData;
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
exports.uuidv4 = uuidv4;
function encrypt(data) {
    try {
        const crypto = require("crypto");
        var cipher = crypto.createCipher('aes-256-cbc', process.env.SECRET_KEY);
        var crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }
    catch (error) {
        throw error;
    }
}
exports.encrypt = encrypt;
function decrypt(data) {
    try {
        const crypto = require("crypto");
        var decipher = crypto.createDecipher('aes-256-cbc', process.env.SECRET_KEY);
        var dec = decipher.update(data, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }
    catch (error) {
        throw error;
    }
}
exports.decrypt = decrypt;
function isObjectEmpty(e) {
    return Object.keys(e).length === 0 ? true : false;
}
exports.isObjectEmpty = isObjectEmpty;
function authToken(email, password) {
    try {
        let secret = process.env.AUTH_KEY.toString();
        let data = null;
        data = `${email.toLowerCase()}:${password}`;
        let encryptVal = encrypt(jwt.encode({ data }, secret));
        return encryptVal;
    }
    catch (error) {
        console.log("Error_in_authToken " + error);
        throw error;
    }
}
exports.authToken = authToken;
function formatDate(date) {
    try {
        return (0, moment_1.default)(date).format("DD/MMM/YYYY");
        // return date.toLocaleDateString('en-GB', {
        //   day: 'numeric', month: 'short', year: 'numeric'
        // }).replace(/ /g, '-');
    }
    catch (error) {
        console.log("Error_in_formatDate " + error);
        throw error;
    }
}
exports.formatDate = formatDate;
function convertTitleCase(str) {
    try {
        return str.split(' ')
            .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
            .join(' ');
    }
    catch (error) {
        console.log("Error_in_convertTitleCase " + error);
        throw error;
    }
}
exports.convertTitleCase = convertTitleCase;
function removeKeyfromJson(input, key) {
    try {
        return _lodash.map(input, function (row) {
            return _lodash.omit(row, [key]);
        });
    }
    catch (error) {
        console.log("Error_in_removeIdfromJson ", error);
        throw error;
    }
}
exports.removeKeyfromJson = removeKeyfromJson;
function isValueOrUndefined(value) {
    try {
        return value ? value : undefined;
    }
    catch (error) {
        console.log("Error_in_isValueOrUndefined ", error);
        throw error;
    }
}
exports.isValueOrUndefined = isValueOrUndefined;
function findDuration(startTime, endTime) {
    try {
        let mins;
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        const duration = endDate.getTime() - startDate.getTime();
        const diffDuration = moment_1.default.duration(duration);
        const hr = diffDuration.hours();
        var min = diffDuration.minutes();
        if (min < 10) {
            mins = 0 + "" + min;
        }
        let minutesTemp = (min >= 10 ? min : mins);
        const time = Number(minutesTemp) == 59 ? (Number(hr) + 1) + ".00" : hr + "." + minutesTemp;
        let minutes = (hr * 60) + (Number(minutesTemp) == 59 ? 60 : Number(minutesTemp));
        return [time, minutes];
    }
    catch (error) {
        console.log("Error_in_findDuration ", error);
        throw error;
    }
}
exports.findDuration = findDuration;
//# sourceMappingURL=Utils.js.map