import db from "../../models";

export async function AlterTableFunction() {
    try {
        await db.sequelize.query(`
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
        await db.sequelize.query(`
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
        await db.sequelize.query(`
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
        await db.sequelize.query(`
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
        await db.sequelize.query(`
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
        await db.sequelize.query(`
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
        await db.sequelize.query(`
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
        await db.sequelize.query(`
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
    } catch (error) {
        console.log("Error_in_formatDate " + error);
        throw error;
    }
}