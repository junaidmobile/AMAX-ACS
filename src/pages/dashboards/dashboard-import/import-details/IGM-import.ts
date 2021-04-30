/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:44:26
 * @modify date 2018-07-16 11:44:26
 * @desc [description]
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HttpProvider } from '../../../../providers/http/http';
import { GlobalProvider } from '../../../../providers/global/global';
import moment from 'moment';
import { Constants } from '../../../../constant';

export class ImportIGM { pi_strUserName: any; pi_intIGMNo: any; pi_intYear: any; pi_strMAWBNo: any; pi_strAirline3Code: any; pi_strErrorMsg: any; }
@Component({
  selector: 'page-import-IGM',
  templateUrl: 'IGM-import.html'
})

export class IGMImport implements OnInit {
  @ViewChild('MAWBNoValue') myInput;
  @ViewChild('PrefixValue') PrefixInput;

  importIGM: ImportIGM
  Prefix: any;
  MAWBNo: any;
  IGMResp: any;
  showDiv: boolean;
  IGMDate: any;
  appBuildConfig: any;
  title: String;
  private _strUserName: any;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider) {
    this.importIGM = new ImportIGM();
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "IGM";
  }


  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];

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

    this.getDetails();
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

  getDetails() {
    debugger
    this.importIGM.pi_intIGMNo = 0;
    this.importIGM.pi_intYear = new Date().getFullYear();
    this.importIGM.pi_strMAWBNo = this.Prefix + this.MAWBNo;
    this.importIGM.pi_strAirline3Code = this.Prefix;
    this.importIGM.pi_strErrorMsg = '';
    this.importIGM.pi_strErrorMsg = '';
   this.importIGM.pi_strUserName = this._strUserName;
   debugger
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.IGM, this.importIGM).then((response) => {
      //console.log("Response : ", response);
      if (response != null && response != "") {
        this.showDiv = true;
        // this.IGMResp = response;
        if (response.hasOwnProperty('NewDataSet')) {
          this.IGMResp = response['NewDataSet'].Table[0];
          if (this.IGMResp.hasOwnProperty('IGMFlightArrDate')) {
            this.IGMDate = moment(this.IGMResp['IGMFlightArrDate'][0]).format('DD-MMM-YYYY HH:mm');
          } else {
            this.IGMDate = "";
          }
        }
      } else {
        this.global.showAlert("MAWB number is invalid.");
        this.clearInputs();
      }
    }, (error) => { });
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
