/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:44:45
 * @modify date 2018-07-16 11:44:45
 * @desc [description]
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { HttpProvider } from '../../../../providers/http/http';
import { GlobalProvider } from '../../../../providers/global/global';
import { Constants } from '../../../../constant';

export class ChargeCalc { "pi_strComDetails": any; "pi_intDays": any }

@Component({
    selector: 'page-other-Charge-Calculator',
    templateUrl: 'Charge-Calculator.html'
})

export class ChargeCalculator implements OnInit {
    @ViewChild('MAWNoValue') myInput;
    ChargeCalc: ChargeCalc;
    Commodity: any;
    GrCh: any;
    noOfDays: any;
    calculatedDetails: any;
    showDiv: boolean;
    ChargeCalcResp: any;
    CommodityDetails: any;
    commodityModel: any;
    appBuildConfig: any;
    title: String;
    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider, public navParams: NavParams) {
        this.ChargeCalc = new ChargeCalc();
        this.CommodityDetails = this.navParams.get('commDetails');
        this.appBuildConfig = this.global.appBuildConfig;
        this.title = "Charge Calculator";
    }
    ngOnInit() {

    }

    Calculate() {
        if (this.commodityModel != undefined && this.commodityModel != "" && this.GrCh != undefined && this.GrCh != "" && this.noOfDays != undefined && this.noOfDays != "") {
            let calcXML = '<Calculator><Com ComId="' + this.commodityModel.MC_RowId_I[0] + '" ComChWt="' + this.GrCh + '" ComPCS="0" /></Calculator>';
            this.ChargeCalc.pi_strComDetails = calcXML
            this.ChargeCalc.pi_intDays = this.noOfDays;
            this.http.getHttpPostRequest(Constants.GMAX_Services.Others.Charge_Calculator, this.ChargeCalc).then((response) => {
                //console.log("Response : ", JSON.stringify(response));
                if (response != null && response != "" && response.hasOwnProperty('NewDataSet')) {
                    this.showDiv = true;
                    this.calculatedDetails = response['NewDataSet'];
                } else {
                    this.global.showAlert("Currently not able to calculate the charges.");
                }
            }, (error) => { });
        } else {
            this.global.showAlert("Fill all the details");
        }
    }

    clearAll() {
        this.commodityModel = "";
        this.GrCh = "";
        this.noOfDays = "";
        this.showDiv = false;
    }

    // Just to animate the fab
    fabGone = false;
    ionViewWillEnter() {
        this.fabGone = false;
    }

    ionViewWillLeave() {
        this.fabGone = true;
    }
}
