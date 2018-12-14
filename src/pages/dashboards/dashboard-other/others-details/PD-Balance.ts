/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:44:51
 * @modify date 2018-07-16 11:44:51
 * @desc [description]
*/
import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HttpProvider } from '../../../../providers/http/http';
import { GlobalProvider } from '../../../../providers/global/global';
import { Constants } from '../../../../constant';
export class PdBalance { strUserName: any; strBranchId: any; }

export class ExportAWB { pi_strAirwayBillNo: any }
@Component({
    selector: 'page-others-pd-balance',
    templateUrl: 'PD-Balance.html'
})

export class PDBalance {
    @ViewChild('MAWBNoValue') myInput;
    Bal_Options: any;
    PDbalanceResp: any;
    showGMAXBal: boolean;
    PDbalance: PdBalance;
    BOEDateTime: any;
    PDBal: any;
    showMIALBal: boolean;
    selectedVal: any;
    appBuildConfig: any;
    title: String;
    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider) {
        this.PDbalance = new PdBalance();
        this.appBuildConfig = this.global.appBuildConfig;
        this.title = "PD BALANCE";
    }


    ionViewDidLoad() {
        this.Bal_Options = [
            "GMAX",
            "MIAL"
        ]
    }
    getPDBalance() {
        if (this.selectedVal == 'GMAX') {
            this.PDbalance.strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
            this.PDbalance.strBranchId = "BOM";
            this.http.getHttpPostRequest1(Constants.GMAX_Services.Others.PD_Balance, this.PDbalance).then((response) => {
                //console.log("Response : ", JSON.stringify(response));
                if (response != null && response != "" && response.hasOwnProperty('NewDataSet')) {
                    this.PDBal = " INR- " + response['NewDataSet'].Table[0].Balance;
                    this.showGMAXBal = true;
                    this.showMIALBal = false;
                } else {
                    this.global.showAlert("Shipment does not exist.");
                }
            }, (error) => { });
        } else if (this.selectedVal == 'MIAL') {
            // " INR- " + (objclsuser.Organization.OpeningBalance + objclsuser.Organization.Credits - objclsuser.Organization.Debits).ToString();
            this.showMIALBal = true;
            this.showGMAXBal = false;
            let userResp = JSON.parse(this.global.get('userResp')).Organization[0];
            this.PDBal = " INR- " + ((+userResp.OpeningBalance[0]) + (+userResp.Credits[0]) - (+userResp.Debits[0])).toFixed(2);
        } else { }


    }
}
