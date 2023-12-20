import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { decrypt, encrypt } from "../utils/Utils";
import { Inject, Service } from "typedi";
import * as jwt from 'jwt-simple';
import db from "../../models";
import AppConstants from "../constants/Appconstants";

@Service()
@Middleware({ type: "before" })
export class AuthenticationMiddleware implements ExpressMiddlewareInterface {

    public async use(request: any, response: any, next: (err?: any) => any) {
        console.log("Url " + request.url);
        const token = request.headers.authorization || "";
        if (token.length > 0) {
            let data = await this.checkAuthorization(token);

            if (!data) {
                response.status(401).send({ message: AppConstants.AUTHORIZATION_REQUIRED_ERROR });
            } else {
                request.headers.authorization = data;
            }
        } else {
            response.status(401).send({ message: AppConstants.PROVIDE_TOKEN });
        }
        next();
    }

    public async checkAuthorization(token: String) {
        try {
            if (token == '' || token == "" || token == undefined) {
                return false;
            } else {
                const data = jwt.decode(decrypt(token), process.env.AUTH_KEY).data.split(':');
                let email = data[0];
                let password = data[1];
                // let user = await db[AppConstants.USER_DB].query(`
                //     select * from ${process.env.POSTGRES_DATABASE_USER}.${AppConstants.USER_SCHEMA}.${AppConstants.TBL_USER} u 
                //     where email = '${email}' and password = '${password}' and is_deleted = 0 and is_active = 1;
                // `);
                let user = await db.tbl_user.findAll({
                    where: {
                        isDeleted: AppConstants.ZERO,
                        isActive: AppConstants.ONE,
                        email: email,
                        password: encrypt(password),
                    },
                    raw: true
                });
                let userDetails = user[0];
                //console.log("User Details "+JSON.stringify(userDetails[0]));

                if (userDetails) {
                    return userDetails;
                } else {
                    return false;
                }
            }
        } catch (error) {
            console.log("error in checkAuthorization ", error);
            throw error;
        }
    }

}
