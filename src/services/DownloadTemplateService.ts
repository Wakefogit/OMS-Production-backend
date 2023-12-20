import { Service } from "typedi";
import BaseService from "./BaseService";
import db from "../../models";
import AppConstants from "../constants/Appconstants";
import { isArrayPopulated } from "../utils/Utils";
import { Op, Sequelize } from "sequelize";

@Service()
export class DownloadTemplateService extends BaseService<any> {
    getModel() {
        return db.tbl_downloadTemplate;
    }

    public async getDownloadTemplate(name: Array<any>, isUser: number, exceptHearder: string) {
        try {
            let dataObj = {
                // attributes: ["name", "columnName"],
                distinct: true,
                model: db.tbl_downloadTemplate,
                where: {
                    isDeleted: AppConstants.ZERO,
                    name: name
                },
                required: false,
                raw: true
            }
            if (!isArrayPopulated(name)) {
                delete dataObj.where.name;
            }
            if (isUser) {
                dataObj.where['and'] = Sequelize.literal(`
                    [tbl_downloadTemplate].name not in ('${exceptHearder}')
                `)
            }
            let query = await db.tbl_downloadTemplate.findAll(dataObj);
            // console.log("query ", query);
            return query;
        } catch (error) {
            console.log("Error_in_getDownloadTemplate ", error);
            throw error;
        }
    }
}