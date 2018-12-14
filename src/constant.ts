/**
 * @name Constants
 * @author Sachin Semlety
 * @description
 * This Class is used to access the Constants Variables declared for the App.
**/
export class Constants {
    ExportDashboardArray: any;
    public static expDashboardImages: Array<Object> = [{ "img": "assets/imgs/Jobgrey.png" }, { "img": "assets/imgs/Statusgrey.png" }, { "img": "assets/imgs/EGM_orange.png" }, { "img": "assets/imgs/FAQorange.png" }, { "img": "assets/imgs/ApplChgsOrng.png" }];
    public static ImportImages: Array<Object> = [{ "img": "assets/imgs/Jobgrey.png" }, { "img": "assets/imgs/Statusgrey.png" }, { "img": "assets/imgs/IGM_orange.png" }, { "img": "assets/imgs/FAQorange.png" }, { "img": "assets/imgs/ApplChgsOrng.png" }, { "img": "assets/imgs/IssueDO.png" }];
    public static OthersImages: Array<Object> = [{ "img": "assets/imgs/PDorange.png" }, { "img": "assets/imgs/Calculatororange.png" }, { "img": "assets/imgs/Conractorange.png" }];
    public static getContactUsJSON = [{ "name": "GMAX Queries", "children": [{ "name": "Contact_No", "Contact_no": ["91-22 4113 4113"], "Extensions": ["4103", "4183", "4171", "4102", "4173"], "GalaxySupport": "9820120701", }, { "name": "Email_Id", "emailIds": ["Gmax.support@gvk.com", "Galaxy.support@kalelogistics.in"] }] }, { "name": "Accounts / Finance - Queries", "children": [{ "name": "Contact_No", "Contact_no": ["02266859841", "02266859840", "02266850632"], "Extensions": [], }, { "name": "Email_Id", "emailIds": ["Cargo.accounts@gvk.com"] }] }, { "name": "Import Operations - Queries", "children": [{ "name": "Contact_No", "Contact_no": ["02266851345", "02266851347", "02266851379", "9167213667"], "Extensions": [], }, { "name": "Email_Id", "emailIds": ["Shiftops.imports@gvk.com"] }] }, { "name": "Export Operations - Queries", "children": [{ "name": "Contact_No", "Contact_no": ["02266851364", "02266851382", "02266851349", "9167213623", "9167213694", "9930144171", "9930095673"], "Extensions": [], }, { "name": "Email_Id", "emailIds": ["Shiftops.exports@gvk.com"] }] }, { "name": "MIAL Cargo Pass Section", "children": [{ "name": "Contact_No", "Contact_no": ["02266851386"], "Extensions": [], }, { "name": "Email_Id", "emailIds": ["Passsection.cargo@gvk.com", "Rafiq.shaikh@gvk.com"] }] }];
    //– No enquiry for Airport Entry Permit (AEP)

    // GMAX_LIVE_URL
    public static get GMAX_Service_URL(): string { return "http://cargo.gvk.com/gmaxmobapp/hhtservice.asmx/"; };

    // GMAX_UAT_URL/Testing URL

    // public static get GMAX_Service_URL(): string { return "http://113.193.225.59:8080/GMAXAndroid_HHT/HHTService.asmx/"; };
    // public static get GMAX_Service_URL(): string { return "http://10.22.2.71:8080/GMAXAndroid_HHT/HHTService.asmx/"; };
    // public static get PD_balance_URL(): string { return "http://10.22.3.113/GMaxMObilesrv/GmaxMSrv.asmx/" }

    public static get PD_balance_URL(): string { return "http://52.172.54.123:8080/GMAXPDAService/GmaxMSrv.asmx/" }

    // public static get GMAX_HHT_URL(): string { return "http://113.193.225.59:8080/GMAXHHT/gmaxmobilesrv.asmx/"; };
    // public static get GMAX_dummy_service_URL(): string { return "http://10.22.3.230/OldWebservice/HHTService.asmx/" }

    public static get ExportDashboardJsonImages(): any {
        return this.expDashboardImages
    }

    // One Signal and FireBase Credentials
    static get APP_ID(): string { return "795c1f2d-6d2a-4dfa-800e-18406187ca1a" };
    static get GOOOGLE_PROJECT_NUMBER(): string { return "165264439036" };
    static get REST_API_KEY(): string { return "Mjc4ZjY4OGItZDUxMy00N2U4LWI3YzctYzFmM2E4MTc1NTVm" }
    static get ONE_SIGNAL_NOTIFACTION_URL(): string { return "https://onesignal.com/api/v1/notifications?app_id=" + this.APP_ID }

    static readonly DATE_FMT = 'dd/MMM/yyyy';
    static readonly DATE_TIME_FMT = `${Constants.DATE_FMT} hh:mm:ss`;
    // for localstorage Encryption secretKey
    public static get SECRET_KEY(): string { return "0123456789abcdef" };

    public static get REGEX_EXPRESSION_SPLIT_NUMBER_AND_ALPHA(): RegExp { return /[a-z]+|[^a-z]+/gi };

    public static get ACTION_AWAITING(): string { return "Action awaiting" };

    // All Services names includes in this below object
    public static GMAX_Services = {
        "Login": {
            "validateUser": "ValidatePDAUserCredentials"
        },
        "Exports": {
            "AWB_tracking": "GetAirWayBillHistoryForHHT",
            "EGM": "GetEGMdetailsByAWBForHHT",
            "Vehicle_tracking": "GetVehicleDetailsByAWBForHHT"
        },
        "Imports": {
            "AWB_tracking": {
                "HAWBNO": "GetHAWBNumbersForMAWBNoForHHT",
                "AWB_details": "GetHawbMasterDataForHHT"
            },
            "IGM": "GetIGMdetailsByAWBForHHT",
            "Vehicle_tracking": "",
            "IssueDOStatus": "ConsoleDOStatus_ForHHT"
        },
        "Others": {
            "Commodity_details": "ExpGetCommodity_forHHT",
            "Charge_Calculator": "ExpCalculateCharge_forHHT",
            "PD_Balance": "GetGMAXPDABalanceforHHT"
        },
        "Orders": {
            "cartingOrder": {
                "carting_Order_Details": "GetAirWayBillHistoryForHHT",
                "create_CO": "ApproveCO_ForHHT",
                "delete_CO": "DeleteCartingOrder_ForHHT"
            },
            "deliveryOrder": {
                "delivery_Order_Details": "GetHawbMasterDataForHHT",
                "create_DO": "AirlineCreateDO_ForHHT",
                "delete_DO": "AirlineRevokeDO_ForHHT"
            }
        }
    }
}