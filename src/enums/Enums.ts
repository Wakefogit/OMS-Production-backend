
export enum workFlow {
    Pending = 1,
    PPC_Inprogress = 2,
    PPC_Hold = 3,
    Queued_for_Tool_Shop = 4,
    Tool_Shop_Inprogress = 5,
    Tool_Shop_Hold = 6,
    Queued_for_QA = 7,
    QA_Inprogress = 8,
    QA_Hold = 9,
    Queued_for_Operator_Entry = 10,
    Operator_Entry_Inprogress = 11,
    Operator_Entry_Hold = 12,
    Queued_for_Bundling_Supervisior = 13,
    Bundling_Supervisior_Inprogress = 14,
    Bundling_Supervisior_Hold = 15,
    Bundling_Supervisior_Completed = 16,
    Archived = 17
}

export enum ppcWorkFlow {
    Pending = 1,
    PPC_Inprogress = 2,
    PPC_Hold = 3
}

export enum toolShopWorkFlow {
    Queued_for_Tool_Shop = 4,
    Tool_Shop_Inprogress = 5,
    Tool_Shop_Hold = 6
}

export enum qaWorkFlow {
    Queued_for_QA = 7,
    QA_Inprogress = 8,
    QA_Hold = 9
}

export enum operatorEntryWorkFlow {
    Queued_for_Operator_Entry = 10,
    Operator_Entry_Inprogress = 11,
    Operator_Entry_Hold = 12
}

export enum bundlingSupervisorWorkFlow {
    Queued_for_Bundling_Supervisior = 13,
    Bundling_Supervisior_Inprogress = 14,
    Bundling_Supervisior_Hold = 15,
    Bundling_Supervisior_Completed = 16
}

export enum role {
    Admin = 1,
    PPC = 2,
    Tool_Shop = 3,
    QA = 4,
    Operator_Entry = 5,
    Bundling_Supervisior = 6
}

export enum processStageMeta {
    ppc = 'PPC Data',
    toolShop = 'Tool Shop Data',
    qa = 'QA Data',
    operatorEntry = 'Operator Entry',
    bundlingSupervisor = 'Bundling Supervisor'
}