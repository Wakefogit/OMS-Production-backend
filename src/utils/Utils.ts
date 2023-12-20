import * as CryptoJS from "crypto-js";
import * as crypto from "crypto";
import * as jwt from "jwt-simple";
import moment from "moment";
import * as _lodash from "lodash";

export function nameValidation(searchText: string = "") {
  const fullName = searchText.trim().split(" ");
  const firstName = fullName[0];
  const lastName = fullName[1];
  return [firstName, lastName];
}

export function encryptValue(value, secretKey) {
  return CryptoJS.AES.encrypt(value, secretKey).toString();
}

export function decryptValue(cipherValue, secretKey) {
  try {
    return CryptoJS.AES.decrypt(cipherValue, secretKey).toString(
      CryptoJS.enc.Utf8
    );
  } catch (error) {
    console.log("Error in decryptValue ", error);
  }
}

export function md5(password: string): string {
  return crypto.createHash('md5').update(password).digest("hex");
}

export function isNullOrEmpty(value: string): boolean {
  return (!value || 0 === value.length);
}

export function contain(arr, value): boolean {
  return arr.indexOf(value) > -1
}

export function chunk(array, size) {
  const chunked_arr = [];
  let copied = [...array];
  const numOfChild = Math.ceil(copied.length / size);
  for (let i = 0; i < numOfChild; i++) {
    chunked_arr.push(copied.splice(0, size));
  }
  return chunked_arr;
}

export function timestamp(): number {
  return new Date().getTime();
}

export function isPhoto(mimetype: string): boolean {
  return mimetype && mimetype == 'image/jpeg' || mimetype == 'image/jpg' || mimetype == 'image/png';
}

export function fileExt(fileName: string): string {
  return fileName.split('.').pop();
}

export function isPdf(mimetype: string): boolean {
  return mimetype && mimetype == 'application/pdf';
}

export function isVideo(mimetype: string): boolean {
  if (!mimetype) return false;
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

export function isStringNullOrEmpty(checkString: string): boolean {
  return typeof checkString === 'string' && checkString !== null && checkString.length > 0 ? true : false;
}

export function isNotNullAndUndefined(checkString: string): boolean {
  return typeof checkString === 'string' && checkString !== null && checkString !== undefined;
}

export function isArrayPopulated(checkArray: any): boolean {
  if (checkArray !== 'undefined'
    && checkArray !== null
    && Array.isArray(checkArray)
    && checkArray.length > 0) {
    return true;
  }
  return false;
}

export function stringTONumber(checkString: string | number): number {
  return typeof checkString === 'string' ? parseInt(checkString) : checkString;
}
export function paginationData(totalCount: number, LIMIT: number, OFFSET: number) {
  let totalPages = Math.ceil(totalCount / LIMIT);
  let currentPage = Math.floor(OFFSET / LIMIT);
  let prevPage = (currentPage - 1) > 0 ? (currentPage - 1) * LIMIT : 0;
  let nextPage = (currentPage + 1) <= totalPages ? (currentPage + 1) * LIMIT : 0;

  return {
    nextPage,
    prevPage,
    totalCount,
    currentPage: currentPage + 1
  }
}
export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function encrypt(data) {
  try {
    const crypto = require("crypto");
    var cipher = crypto.createCipher('aes-256-cbc', process.env.SECRET_KEY)
    var crypted = cipher.update(data, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
  } catch (error) {
    throw error;
  }
}

export function decrypt(data) {
  try {
    const crypto = require("crypto");
    var decipher = crypto.createDecipher('aes-256-cbc', process.env.SECRET_KEY)
    var dec = decipher.update(data, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
  } catch (error) {
    throw error;
  }
}

export function isObjectEmpty(e) {
  return Object.keys(e).length === 0 ? true : false;
}

export function authToken(email: string, password: string): string {
  try {
    let secret = process.env.AUTH_KEY.toString();
    let data = null;
    data = `${email.toLowerCase()}:${password}`;

    let encryptVal = encrypt(jwt.encode({ data }, secret));
    return encryptVal;
  } catch (error) {
    console.log("Error_in_authToken " + error);
    throw error;
  }
}

export function formatDate(date: Date) {
  try {
    return moment(date).format("DD/MMM/YYYY")
    // return date.toLocaleDateString('en-GB', {
    //   day: 'numeric', month: 'short', year: 'numeric'
    // }).replace(/ /g, '-');
  } catch (error) {
    console.log("Error_in_formatDate " + error);
    throw error;
  }
}

export function convertTitleCase(str: string) {
  try {
    return str.split(' ')
      .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
      .join(' ');
  } catch (error) {
    console.log("Error_in_convertTitleCase " + error);
    throw error;
  }
}

export function removeKeyfromJson(input: Array<Object>, key: String) {
  try {
    return _lodash.map(input, function (row) {
      return _lodash.omit(row, [key])
    })
  } catch (error) {
    console.log("Error_in_removeIdfromJson ", error);
    throw error;
  }
}

export function isValueOrUndefined(value) {
  try {
    return value ? value : undefined;
  } catch (error) {
    console.log("Error_in_isValueOrUndefined ", error);
    throw error;
  }
}

export function findDuration(startTime, endTime) {
  try {
    let mins: any;
    const startDate: any = new Date(startTime);
    const endDate: any = new Date(endTime);
    const duration: any = endDate.getTime() - startDate.getTime();
    const diffDuration = moment.duration(duration);
    const hr = diffDuration.hours()
    var min = diffDuration.minutes()
    if (min < 10) {
      mins = 0 + "" + min;
    }
    let minutesTemp = (min >= 10 ? min : mins);
    const time = Number(minutesTemp) == 59 ? (Number(hr) + 1) + ".00" : hr + "." + minutesTemp;
    let minutes = (hr * 60) + (Number(minutesTemp) == 59 ? 60 : Number(minutesTemp))
    return [time, minutes];
  } catch (error) {
    console.log("Error_in_findDuration ", error);
    throw error;
  }
}