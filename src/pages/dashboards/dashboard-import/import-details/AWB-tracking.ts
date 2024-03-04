/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:44:19
 * @modify date 2018-07-16 11:44:19
 * @desc [description]
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HttpProvider } from '../../../../providers/http/http';
import { GlobalProvider } from '../../../../providers/global/global';
export class ImportAWB { pi_intIGMNumber: any; pi_intIGMYear: any; pi_strMAWBNo: any;pi_strUserName: any;
 }
export class HawbMaster { strMAWBNO: any; strHAWBNO: any; intIGMNo: any; intIGMYear: any;pi_strUserName: any;
 }
import moment from 'moment';
import { Constants } from '../../../../constant';

@Component({
    selector: 'page-import-AWB-tracking',
    templateUrl: 'AWB-tracking-import.html'
})

export class AWBTrackingImport implements OnInit {
    @ViewChild('MAWBNoValue') myInput;
    @ViewChild('PrefixValue') PrefixInput;
    importAWB: ImportAWB;
    HawbMaster: HawbMaster;
    Prefix: string = '';
    MAWBNo: string = '';
    HAWBNo: string = '';
    IHM_HAWBNO_C: any;
    showSelectedValue: boolean;
    showAWBDetails: any;
    AWBDetailsRes: any;
    BOEDateTime: any;
    zone: any;
    modeKeys: any;
    appBuildConfig: any;
    holdStat: any;
    OCStatus: any;
    DOStatus: any;
    isDOStat: boolean;
    title: String;
  private _strUserID: any;
    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider) {
        this.importAWB = new ImportAWB();
        this.HawbMaster = new HawbMaster();
        this.appBuildConfig = this.global.appBuildConfig;
        this.title = "TRACK AND TRACE";
    }


    ngOnInit() {
      this._strUserID = JSON.parse(this.global.get('userResp')).UserName[0];
    }

    GetAWBTrackingDetails() {
      debugger
        this.showAWBDetails = false;
        this.showSelectedValue = false;
        this.IHM_HAWBNO_C = '';
        if (this.Prefix.length >= 3 && this.MAWBNo.length >= 8) {
            this.importAWB.pi_intIGMNumber = 0;
            this.importAWB.pi_intIGMYear = new Date().getFullYear();
            this.importAWB.pi_strMAWBNo = this.Prefix + this.MAWBNo;
            this.importAWB.pi_strUserName = this._strUserID;

            this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.AWB_tracking.HAWBNO, this.importAWB).then((response) => {

                //console.log("Response : ", JSON.stringify(response));
                if (response != null && response != "" && response.hasOwnProperty('NewDataSet')) {
                    this.IHM_HAWBNO_C = response['NewDataSet'].Table;
                    this.IHM_HAWBNO_C[0].hasOwnProperty('IHM_HAWBNO_C') && this.IHM_HAWBNO_C[0]['IHM_HAWBNO_C'][0] != '' && (this.showSelectedValue = true);
                } else {
                    this.global.showAlert("MAWB number is invalid.");
                }
            }, (error) => { });
        }
    }

    focusNextInput() {
        if (this.Prefix.length == 3) {
            this.myInput.setFocus();
        }
    }

    fetchAWBDetails(selectedVal) {
        this.HawbMaster.strMAWBNO = this.Prefix + this.MAWBNo;
        this.HawbMaster.intIGMNo = 0;
        this.HawbMaster.strHAWBNO = selectedVal;
        this.HawbMaster.intIGMYear = new Date().getFullYear();
        this.HawbMaster.pi_strUserName = this._strUserID;
        this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.AWB_tracking.AWB_details, this.HawbMaster).then((response) => {
            //console.log("Response : ", JSON.stringify(response));
            if (response != null && response != "" && response.hasOwnProperty('NewDataSet')) {
                this.AWBDetailsRes = response['NewDataSet'].Table[0];
                if (this.AWBDetailsRes.hasOwnProperty('BOEDateTime')) {
                    this.BOEDateTime = this.checkStatus(this.AWBDetailsRes.BOEDateTime[0]);;
                }

                if (this.AWBDetailsRes.hasOwnProperty('HAWBDO')) {
                    this.holdStat = this.checkStatus(this.AWBDetailsRes.HAWBDO[0]);
                }

                if (this.AWBDetailsRes.hasOwnProperty('OCStatus')) {
                    this.OCStatus = this.checkStatus(this.AWBDetailsRes.OCStatus[0]);
                }

                if (this.AWBDetailsRes.hasOwnProperty('HAWBDOStatus')) {
                    this.DOStatus = this.checkStatus(this.AWBDetailsRes.HAWBDOStatus[0]);
                }
                this.showAWBDetails = true;
            } else {
                this.global.showAlert("MAWB number is invalid.");
                this.clearInputs();
            }
        }, (error) => { });

    }

    checkStatus(status) {
        return (status == 'true' || status == true) ? 'on Hold' : (status == 'false' || status == false) ? 'N.A' : moment(status).format('DD-MMM-YYYY HH:mm');
    }

    ionViewDidLoad() {
        setTimeout(() => {
            this.PrefixInput.setFocus();
        }, 800)
    }


    // Just to animate the fab
    fabGone = false;
    ionViewWillEnter() {
        this.fabGone = false;
    }

    ionViewWillLeave() {
        this.fabGone = true;
    }

    // clear all the inputs
    clearInputs() {
        this.Prefix = "";
        this.MAWBNo = "";
        this.showAWBDetails = false;
        this.IHM_HAWBNO_C = '';
        this.showSelectedValue = false;
    }



}
