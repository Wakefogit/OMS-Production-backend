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
exports.AlterTableFunction = void 0;
const models_1 = __importDefault(require("../../models"));
function AlterTableFunction() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield models_1.default.sequelize.query(`
            IF NOT EXISTS (
                    SELECT 1
                    FROM sys.tables
                    WHERE name = 'tbl_order'
                        AND temporal_type = 2
                    )
            BEGIN
                ALTER TABLE dbo.tbl_order
                    ADD   
                    sysStartTime datetime2(7) GENERATED ALWAYS AS ROW START HIDDEN DEFAULT SYSUTCDATETIME(),
                    sysEndTime datetime2(7) GENERATED ALWAYS AS ROW END HIDDEN DEFAULT CONVERT(datetime2 (7), '9999-12-31 23:59:59.9999999'),   
                    PERIOD FOR SYSTEM_TIME (sysStartTime, sysEndTime);
                
                ALTER TABLE tbl_order
                SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.tbl_orderHistory));
            END;
        `);
            yield models_1.default.sequelize.query(`
            IF NOT EXISTS (
                    SELECT 1
                    FROM sys.tables
                    WHERE name = 'tbl_orderusermapping'
                        AND temporal_type = 2
                    )
            BEGIN
                ALTER TABLE dbo.tbl_orderusermapping
                    ADD   
                    sysStartTime datetime2(7) GENERATED ALWAYS AS ROW START HIDDEN DEFAULT SYSUTCDATETIME(),
                    sysEndTime datetime2(7) GENERATED ALWAYS AS ROW END HIDDEN DEFAULT CONVERT(datetime2 (7), '9999-12-31 23:59:59.9999999'),   
                    PERIOD FOR SYSTEM_TIME (sysStartTime, sysEndTime);
                
                ALTER TABLE tbl_orderusermapping
                SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.tbl_orderusermappingHistory));
            END;
        `);
            yield models_1.default.sequelize.query(`
            IF NOT EXISTS (
                    SELECT 1
                    FROM sys.tables
                    WHERE name = 'tbl_ppc'
                        AND temporal_type = 2
                    )
            BEGIN
                ALTER TABLE dbo.tbl_ppc
                    ADD   
                    sysStartTime datetime2(7) GENERATED ALWAYS AS ROW START HIDDEN DEFAULT SYSUTCDATETIME(),
                    sysEndTime datetime2(7) GENERATED ALWAYS AS ROW END HIDDEN DEFAULT CONVERT(datetime2 (7), '9999-12-31 23:59:59.9999999'),   
                    PERIOD FOR SYSTEM_TIME (sysStartTime, sysEndTime);
                
                ALTER TABLE tbl_ppc
                SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.tbl_ppcHistory));
            END;
        `);
            yield models_1.default.sequelize.query(`
            IF NOT EXISTS (
                    SELECT 1
                    FROM sys.tables
                    WHERE name = 'tbl_toolShop'
                        AND temporal_type = 2
                    )
            BEGIN
                ALTER TABLE dbo.tbl_toolShop
                    ADD   
                    sysStartTime datetime2(7) GENERATED ALWAYS AS ROW START HIDDEN DEFAULT SYSUTCDATETIME(),
                    sysEndTime datetime2(7) GENERATED ALWAYS AS ROW END HIDDEN DEFAULT CONVERT(datetime2 (7), '9999-12-31 23:59:59.9999999'),   
                    PERIOD FOR SYSTEM_TIME (sysStartTime, sysEndTime);
                
                ALTER TABLE tbl_toolShop
                SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.tbl_toolShopHistory));
            END;
        `);
            yield models_1.default.sequelize.query(`
            IF NOT EXISTS (
                    SELECT 1
                    FROM sys.tables
                    WHERE name = 'tbl_qa'
                        AND temporal_type = 2
                    )
            BEGIN
                ALTER TABLE dbo.tbl_qa
                    ADD   
                    sysStartTime datetime2(7) GENERATED ALWAYS AS ROW START HIDDEN DEFAULT SYSUTCDATETIME(),
                    sysEndTime datetime2(7) GENERATED ALWAYS AS ROW END HIDDEN DEFAULT CONVERT(datetime2 (7), '9999-12-31 23:59:59.9999999'),   
                    PERIOD FOR SYSTEM_TIME (sysStartTime, sysEndTime);
                
                ALTER TABLE tbl_qa
                SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.tbl_qaHistory));
            END;
        `);
            yield models_1.default.sequelize.query(`
            IF NOT EXISTS (
                    SELECT 1
                    FROM sys.tables
                    WHERE name = 'tbl_operatorEntry'
                        AND temporal_type = 2
                    )
            BEGIN
                ALTER TABLE dbo.tbl_operatorEntry
                    ADD   
                    sysStartTime datetime2(7) GENERATED ALWAYS AS ROW START HIDDEN DEFAULT SYSUTCDATETIME(),
                    sysEndTime datetime2(7) GENERATED ALWAYS AS ROW END HIDDEN DEFAULT CONVERT(datetime2 (7), '9999-12-31 23:59:59.9999999'),   
                    PERIOD FOR SYSTEM_TIME (sysStartTime, sysEndTime);
                
                ALTER TABLE tbl_operatorEntry
                SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.tbl_operatorEntryHistory));
            END;
        `);
            yield models_1.default.sequelize.query(`
            IF NOT EXISTS (
                    SELECT 1
                    FROM sys.tables
                    WHERE name = 'tbl_bundlingSupervisor'
                        AND temporal_type = 2
                    )
            BEGIN
                ALTER TABLE dbo.tbl_bundlingSupervisor
                    ADD   
                    sysStartTime datetime2(7) GENERATED ALWAYS AS ROW START HIDDEN DEFAULT SYSUTCDATETIME(),
                    sysEndTime datetime2(7) GENERATED ALWAYS AS ROW END HIDDEN DEFAULT CONVERT(datetime2 (7), '9999-12-31 23:59:59.9999999'),   
                    PERIOD FOR SYSTEM_TIME (sysStartTime, sysEndTime);
                
                ALTER TABLE tbl_bundlingSupervisor
                SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.tbl_bundlingSupervisorHistory));
            END;
        `);
            yield models_1.default.sequelize.query(`
            IF NOT EXISTS (
                    SELECT 1
                    FROM sys.tables
                    WHERE name = 'tbl_user'
                        AND temporal_type = 2
                    )
            BEGIN
                ALTER TABLE dbo.tbl_user
                    ADD   
                    sysStartTime datetime2(7) GENERATED ALWAYS AS ROW START HIDDEN DEFAULT SYSUTCDATETIME(),
                    sysEndTime datetime2(7) GENERATED ALWAYS AS ROW END HIDDEN DEFAULT CONVERT(datetime2 (7), '9999-12-31 23:59:59.9999999'),   
                    PERIOD FOR SYSTEM_TIME (sysStartTime, sysEndTime);
                
                ALTER TABLE tbl_user
                SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.tbl_userHistory));
            END;
        `);
        }
        catch (error) {
            console.log("Error_in_formatDate " + error);
            throw error;
        }
    });
}
exports.AlterTableFunction = AlterTableFunction;
//# sourceMappingURL=AlterTable_SystemVersion.js.map