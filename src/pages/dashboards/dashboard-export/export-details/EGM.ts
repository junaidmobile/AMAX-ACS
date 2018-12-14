/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:36
 * @modify date 2018-07-16 11:43:36
 * @desc [description]
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HttpProvider } from '../../../../providers/http/http';
import { GlobalProvider } from '../../../../providers/global/global';
import moment from 'moment';
import { Constants } from '../../../../constant';

export class ExportEGM { pi_strEGMNo: any; pi_dtFromDate: any; pi_dtToDate: any; pi_strSelection: any; pi_strAWBNo: any; po_strErrmsg: any; }

@Component({
    selector: 'page-export-EGM',
    templateUrl: 'EGM.html'
})

export class EGM implements OnInit {
    @ViewChild('MAWBNoValue') myInput;
    @ViewChild('PrefixValue') PrefixInput;

    exportEGM: ExportEGM
    Prefix: any;
    MAWBNo: any;
    EGMResp: any;
    showDiv: boolean;
    EGMDate: any;
    appBuildConfig: any;
    title: any;
    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider) {
        this.exportEGM = new ExportEGM();
        this.appBuildConfig = this.global.appBuildConfig;
        this.title = "EGM";
    }


    ngOnInit() {

    }
    submitDetails() {
        if (this.Prefix == undefined || (this.Prefix == '') || (this.Prefix.length < 3)) {
            this.global.showAlert("Please enter valid Prefix.");
            return;
        }

        if (this.MAWBNo == undefined || (this.MAWBNo == '') || (this.MAWBNo.length < 8)) {
            this.global.showAlert("Please enter valid MAWB No.");
            return;
        }


        let TodayDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
        // alert("Today Date: " + TodayDate)
        // let TodayDate = 2017 + "-" + 1 + "-" + 11;
        this.exportEGM.pi_strAWBNo = this.Prefix + this.MAWBNo;
        this.exportEGM.pi_strEGMNo = "";
        this.exportEGM.pi_strSelection = 'A';
        this.exportEGM.po_strErrmsg = "";
        this.exportEGM.pi_dtFromDate = TodayDate;
        this.exportEGM.pi_dtToDate = TodayDate;
        this.fetchEGMDetails();
    }

    fetchEGMDetails() {
        this.http.getHttpPostRequest(Constants.GMAX_Services.Exports.EGM, this.exportEGM).then((response) => {
            //console.log("Response : ", response);
            if (response != null && response != "") {
                this.setEGMDetails(response);
            } else if (response == null || response == '') {
                this.getEGMDetails(Constants.GMAX_Services.Exports.EGM)  // Change this service name later.
            } else {
                this.global.showAlert("Shipment does not exist.");
            }
        }, (error) => { });
    }

    getEGMDetails(url) {
        this.http.getHttpPostRequest(url, this.exportEGM).then((response) => {
            //console.log("Response : ", response);
            if (response != null && response != "") {
                this.setEGMDetails(response);
            } else {
                this.global.showAlert("Shipment does not exist.");
            }
        }, (error) => { });
    }

    setEGMDetails(response) {
        this.showDiv = true;
        // this.EGMResp = response;
        if (response.hasOwnProperty('NewDataSet')) {
            this.EGMResp = response['NewDataSet'].Table[0];
            if (this.EGMResp.hasOwnProperty('EGMDate')) {
                this.EGMDate = moment(this.EGMResp['EGMDate'][0]).format('DD-MMM-YYYY HH:mm');
            } else {
                this.EGMDate = "";
            }
        }
    }


    focusNextInput() {
        if (this.Prefix.length >= 3) {
            this.myInput.setFocus();
        }
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
        this.showDiv = false;
    }




}
