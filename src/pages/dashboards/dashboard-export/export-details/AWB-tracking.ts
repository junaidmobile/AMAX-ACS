/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:24
 * @modify date 2018-07-16 11:43:24
 * @desc [description]
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HttpProvider } from '../../../../providers/http/http';
import { GlobalProvider } from '../../../../providers/global/global';
import moment from 'moment';
import { Constants } from '../../../../constant';

export class ExportAWB { pi_strAirwayBillNo: any }
@Component({
    selector: 'page-export-AWB-tracking',
    templateUrl: 'AWB-tracking.html'
})

export class AWBTracking implements OnInit {
    @ViewChild('MAWBNoValue') myInput;
    @ViewChild('PrefixValue') PrefixInput;
    exportAWB: ExportAWB
    Prefix: any;
    MAWBNo: any;
    AWBResponse: any;
    showDiv: boolean;
    timeStampASI: any;
    timeStampCORequest: any;
    timeStampCOApproval: any;
    timeStampTSP: any;
    appBuildConfig: any;
    LeoConfirmed: any;
    TDGAcceptance: any;
    BAGAcceptance: any;
    EGM: any;
    title: String;
    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider) {
        this.exportAWB = new ExportAWB();
        this.appBuildConfig = this.global.appBuildConfig;
        this.title = "TRACK AND TRACE";
    }


    ngOnInit() {

    }


    GetAWBTrackingDetails() {
        if (this.Prefix == undefined || (this.Prefix == '') || (this.Prefix.length < 3)) {
            this.global.showAlert("Please enter valid Prefix.");
            return;
        }

        if (this.MAWBNo == undefined || (this.MAWBNo == '') || (this.MAWBNo.length < 8)) {
            this.global.showAlert("Please enter valid MAWB No.");
            return;
        }

        this.exportAWB.pi_strAirwayBillNo = this.Prefix + this.MAWBNo;
        this.fetchAWBDetails();
    }

    fetchAWBDetails() {
        this.http.getHttpPostRequest(Constants.GMAX_Services.Exports.AWB_tracking, this.exportAWB).then((response) => {
            //console.log("Response : ", JSON.stringify(response));
            if (response != null && response != "" && response.hasOwnProperty('clsAirWayBill')) {
                this.setAWBDetails(response);
            } else if (response == null || response == '') {
                this.getAWBDetails(Constants.GMAX_Services.Exports.AWB_tracking); // change this service name later
            } else {
                this.global.showAlert("Shipment does not exist.");
            }
        }, (error) => { });
    }

    getAWBDetails(url) {
        this.http.getHttpPostRequest(url, this.exportAWB).then((response) => {
            //console.log("Response : ", JSON.stringify(response));
            if (response != null && response != "" && response.hasOwnProperty('clsAirWayBill')) {
                this.setAWBDetails(response)
            } else {
                this.global.showAlert("Shipment does not exist.");
            }
        }, (error) => { });
    }

    setAWBDetails(response) {
        this.showDiv = true;
        this.AWBResponse = response['clsAirWayBill'];
        if (this.AWBResponse.hasOwnProperty('Histories')) {
            let histories = this.AWBResponse['Histories'][0].clsAWBHistory;
            console.log("Histories: ", JSON.stringify(histories));
            // this.EGM = this.AWBResponse['EGMNo'][0];
            for (let i = 0; i < histories.length; i++) {
                if (histories[i].CurStatus[0] == 'AWB Keyin' && histories[i].TimeStamp[0] != "") {
                    this.timeStampASI = moment(histories[i].TimeStamp[0]).format('DD-MMM-YYYY HH:mm');
                }
                if (histories[i].CurStatus[0] == 'CO Requested' && histories[i].TimeStamp[0] != "") {
                    this.timeStampCORequest = moment(histories[i].TimeStamp[0]).format('DD-MMM-YYYY HH:mm');
                }
                if (histories[i].CurStatus[0] == 'CO Confirmed' && histories[i].TimeStamp[0] != "") {
                    this.timeStampCOApproval = moment(histories[i].TimeStamp[0]).format('DD-MMM-YYYY HH:mm');
                }
                if (histories[i].CurStatus[0] == 'TSP-Confirmed' && histories[i].TimeStamp[0] != "") {
                    this.timeStampTSP = moment(histories[i].TimeStamp[0]).format('DD-MMM-YYYY HH:mm');
                }

                if (histories[i].CurStatus[0] == 'LEO Confirmed' && histories[i].TimeStamp[0] != "") {
                    this.LeoConfirmed = moment(histories[i].TimeStamp[0]).format('DD-MMM-YYYY HH:mm');
                }

                if (histories[i].CurStatus[0] == 'TDG Acceptance' && histories[i].TimeStamp[0] != "") {
                    this.TDGAcceptance = moment(histories[i].TimeStamp[0]).format('DD-MMM-YYYY HH:mm');
                }

                if (histories[i].CurStatus[0] == 'BAG Acceptance' && histories[i].TimeStamp[0] != "") {
                    this.BAGAcceptance = moment(histories[i].TimeStamp[0]).format('DD-MMM-YYYY HH:mm');
                }

                if (histories[i].CurStatus[0] == 'EGM Confirmed' && histories[i].TimeStamp[0] != "") {
                    this.EGM = this.AWBResponse['EGMNo'][0] + " / " + moment(histories[i].TimeStamp[0]).format('DD-MMM-YYYY HH:mm');
                }
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
        }, 800);
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
