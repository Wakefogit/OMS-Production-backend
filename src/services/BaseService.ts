import { Op } from "sequelize";
import { Model } from "sequelize-typescript";
import { Service } from "typedi";

@Service()
export default abstract class BaseService<T extends Model<T>> {
  abstract getModel();

  public async createOrUpdateByModel(model, data, tran) {
    try {
      if (data.dataValues.id == 0 || data.dataValues.id == null || data.dataValues.id == undefined) {
        console.log("Create data ", data.dataValues);
        let result = await model.create(data.dataValues, { transaction: tran });
        console.log('result', result.dataValues);
        return result.dataValues;
      } else {
        console.log("Update Data ", data.dataValues);
        await model.update(
          data.dataValues,
          {
            where: { id: data.dataValues.id }
          }, { transaction: tran });
        let result = await model.findByPk(data.dataValues.id);
        console.log('result', result.dataValues);
        return result.dataValues;
      }
    } catch (error) {
      console.log(`Error in createOrUpdateByModel ::: ${error}`);
      throw error;
    }
  }

  public async createorUpdateModelWithoutTran(model, data,) {
    try{
      if (data.dataValues.id == 0 || data.dataValues.id == null || data.dataValues.id == undefined) {
        console.log("Create data ", data.dataValues);
        let result = await model.create(data.dataValues);
        console.log('result', result.dataValues);
        return result.dataValues;
      } else {
        console.log("Update Data ", data.dataValues);
        await model.update(
        data.dataValues,
        {
          where: { id: data.dataValues.id }
        });
      let result = await model.findByPk(data.dataValues.id);
      console.log('result', result.dataValues);
      return result.dataValues;
    }
  } catch (error) {
    console.log(`Error in createorUpdateModelWithoutTran ::: ${error}`);
    throw error;
  }
}

  public async findAllValues(model: any): Promise<T> {
    try {
      console.log("Model ", model);
      let query = model.findAll();
      console.log("Query ", JSON.stringify(query))
      return query;
    } catch (error) {
      console.log("Error occurred in findAllValues " + error);
      return error
    }
  }

  public async findUniqueKey(model, data: String) {
    try {
      console.log("data of event", data, model);
      let response = await model.findOne({
        where: { uniqueKey: data, isDeleted: 0 },
        raw: true
      });
      return response;
    } catch (error) {
      console.log("Error occurred in Unique Key " + error);
      return error;
    }
  }

  public async findOneValues(findmodel, data) {
    try {
      let query = await findmodel.findOne({
        where: { id: data, isDeleted: 0 }
      })
      console.log("Query ", JSON.stringify(query.dataValues));
      return query.dataValues;
    } catch (error) {
      console.log("Error occurred in findOneValues " + error);
      return error
    }
  }

  public async bulkCreation(data: T[], tran): Promise<T> {
    try {
      console.log("into the bulk creation");
      console.log('data', data);
      let record = await this.getModel()
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
    } catch (error) {
      // console.log(`Error occurred in createOrUpdate ::: ${error}`);
      throw error;
    }
  }

  public async splitDataValuesFromData(data: any) {
    try {
      return data.dataValues;
    } catch (error) {
      throw error;
    }
  }

  public async compareTwoArrays(firstArray: any, secondArray: any) {
    try {
      const removeCommon = (firstArray, secondArray) => {
        const spreaded = [...firstArray, ...secondArray];
        return spreaded.filter(el => {
          return !(firstArray.includes(el) && secondArray.includes(el));
        })
      }

      return removeCommon(firstArray, secondArray);
    } catch (error) {
      throw error;
    }
  }

  public async compareByFirstArray(firstArray: any, secondArray: any) {
    try {
      let arrayDifference = firstArray.filter(x => secondArray.indexOf(x) === -1);
      console.log(arrayDifference);
      return arrayDifference;
    } catch (error) {
      throw error;
    }
  }


  public async bulkCreation_Multiple_response(data: T[]): Promise<T> {
    try {
      console.log("into the bulk creation");
      console.log('data', data);
      let record = await this.getModel()
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
    } catch (error) {
      throw error;
    }
  }

  public async findByEmail(findmodel, email, userUniqueKey) {
    try {
      let query = await findmodel.findOne({
        where: {
          email: email,
          isDeleted: 0,
          uniqueKey: {
            [Op.not]: userUniqueKey
          }
        },
        raw: true
      })
      console.log("Query ", query);
      return query;
    } catch (error) {
      console.log("Error occurred in findOneValues " + error);
      throw error;
    }
  }

  public async findCustomer_byMobileNumber(findmodel, mobileNumber) {
    try {
      let query = await findmodel.findOne({
        where: { mobileNumber: mobileNumber, isDeleted: 0 }
      })
      console.log("Query ", query);
      return query.dataValues;
    } catch (error) {
      console.log("Error occurred in findOneValues " + error);
      throw error;
    }
  }

  public async sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  public async findByKey(model, Key, data) {
    try {
      console.log("data of event", data, model);
      let response = await model.findOne({
        where: { [Key]: data, isDeleted: 0 },
        raw: true
      });
      return response;
    } catch (error) {
      console.log("Error occurred in Unique Key " + error);
      return error;
    }
  }
}