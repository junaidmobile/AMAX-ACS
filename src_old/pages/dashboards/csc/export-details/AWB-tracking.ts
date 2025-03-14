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
import { DatePipe } from '@angular/common';

export class ExportAWBCSC { pi_strAirwayBillNo: any; pi_strUserName: any;pi_strAWBNo: any;
 }
export class routingClass { strUserID: any; strAWBNo: any }

@Component({
  selector: 'page-export-AWB-tracking-csc',
  templateUrl: 'AWB-tracking.html'
})

export class AWBTrackingCSC implements OnInit {
  @ViewChild('MAWBNoValue') myInput;
  @ViewChild('PrefixValue') PrefixInput;
  exportAWB: ExportAWBCSC;
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
  _strUserID: any;
  exportAWBRoting: routingClass;
  routingData: any;
  c2kData: any;
  _DEHDateDA: any;
  _DEHDateDAfrm: string;
  TempData: any;
  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public http: HttpProvider, public global: GlobalProvider, public datepipe: DatePipe) {
    this.exportAWB = new ExportAWBCSC();
    this.exportAWBRoting = new routingClass();
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "TRACK AND TRACE";

  }


  ngOnInit() {

    this._strUserID = JSON.parse(this.global.get('userResp')).UserName[0];
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
    this.exportAWB.pi_strUserName = this._strUserID;
    this.fetchAWBDetails();

  }

  fetchAWBDetails() {
    // check if no records available from first service, then fetch the records from other service
    this.http.getHttpPostRequest(Constants.GMAX_Services.Exports.AWB_tracking, this.exportAWB, true).then((response) => {

     // console.log("Response : ", JSON.stringify(response));
      if (response != null && response != "" && response.hasOwnProperty('clsAirWayBill')) {
        this.setAWBDetails(response);
        // this.GetTemperature(Constants.CSC_Service_URL, Constants.GMAX_Services.Exports.AWB_temp); //remember this 01/05
       // this.getAWBDetailsRouting(Constants.GMAX_CSC_perishabe_URL_Routing, Constants.GMAX_Services.Exports.GetGHARoutingDetails_tt);
        //this.getAWBDetailsC2K(Constants.GMAX_CSC_perishabe_URL_Routing, Constants.GMAX_Services.Exports.GetC2KDetails_tt);
      } else if (response == null || response == '') {
        this.getAWBDetails(Constants.GMAX_CSC_perishabe_URL, Constants.GMAX_Services.Exports.AWB_tracking);

        //this.getAWBDetailsRouting(Constants.GMAX_CSC_perishabe_URL_Routing, Constants.GMAX_Services.Exports.GetGHARoutingDetails_tt);
       // this.getAWBDetailsC2K(Constants.GMAX_CSC_perishabe_URL_Routing, Constants.GMAX_Services.Exports.GetC2KDetails_tt);

      } else {
        this.global.showAlert("MAWB number is invalid.").then((resp) => {
          document.getElementsByClassName("alert-head")[0]['style'].backgroundColor = "#DE1D1B";
        });
      }
    }, (error) => { });
  }

  GetTemperature(url, service_name) {
    this.exportAWB.pi_strAWBNo = this.Prefix + this.MAWBNo;
    this.exportAWB.pi_strUserName = this._strUserID;

    this.http.getHttpPostRequest2(url, service_name, this.exportAWB, true).then((response) => {

      if (response != null && response != "") {
        if (response.hasOwnProperty('NewDataSet')) {

          this.TempData = response['NewDataSet']['Table1'];
          //console.log( this.routingData);

        }
      } else {
        this.global.showAlert("Record not found.");
      }
    }, (error) => { });
  }


  getAWBDetailsRouting(url, service_name) {
    this.showDiv = true;
    this.exportAWBRoting.strUserID = this._strUserID;//this._strUserID;
    this.exportAWBRoting.strAWBNo = this.Prefix + this.MAWBNo;


    this.http.getHttpPostRequest2(url, service_name, this.exportAWBRoting, true).then((response) => {

      if (response != null && response != "") {
        if (response.hasOwnProperty('NewDataSet')) {
          this.routingData = response['NewDataSet']['Table'];
          //console.log( this.routingData);

        }
      } else {
        this.global.showAlert("Record not found.");
      }
    }, (error) => { });
  }

  getAWBDetailsC2K(url, service_name) {
    this.showDiv = true;
    this.exportAWBRoting.strUserID = this._strUserID;//this._strUserID;
    this.exportAWBRoting.strAWBNo = this.Prefix + this.MAWBNo;

    this.http.getHttpPostRequest2(url, service_name, this.exportAWBRoting, true).then((response) => {

      if (response != null && response != "") {
        if (response.hasOwnProperty('NewDataSet')) {
          this.c2kData = response['NewDataSet']['Table'];
          this._DEHDateDA = this.c2kData[0]["DEHDateDA"];

          //this.c2kData[0], 'DEHDateDA') && this._DEHDateDA[0]['DEHDateDA'][0].trim() != ""
          // if (this.checkProperty(this.c2kData[0], 'DDODate') && this.c2kData[0]['DDODate'][0].trim() != "") {

          // }

          this._DEHDateDAfrm = this.datepipe.transform(this._DEHDateDA, 'M/d/yyyy, h:mm');// moment(this._DEHDateDA).format('DD-MMM-YYYY HH:mm');

          console.log(this._DEHDateDA);
          // this.timeStampASI = moment(this.c2kData[0].TimeStamp[0]).format('DD-MMM-YYYY HH:mm');

        }
      } else {
        this.global.showAlert("Record not found.");
      }
    }, (error) => { });
  }

  checkProperty(obj, key) {

    return obj.hasOwnProperty(key);
  }

  getAWBDetails(url, service_name) {
    this.http.getHttpPostRequest1(url, service_name, this.exportAWB, true).then((response) => {
      //console.log("Response : ", JSON.stringify(response));
      if (response != null && response != "" && response.hasOwnProperty('clsAirWayBill')) {
        this.setAWBDetails(response)
      } else {
        this.global.showAlert("MAWB number is invalid.").then((resp) => {
          document.getElementsByClassName("alert-head")[0]['style'].backgroundColor = "#DE1D1B";
        });
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
    if (this.Prefix.length == 3) {
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
