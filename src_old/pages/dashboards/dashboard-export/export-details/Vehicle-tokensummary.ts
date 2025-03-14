/**
 * @author Mohammaed Junaid
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:30
 * @modify date 2018-07-16 11:43:30
 * @desc [description]
*/
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpProvider } from '../../../../providers/http/http';
import { Constants } from '../../../../constant';
export class VehicletokensummaryClass { pi_dtfromdate: any; pi_dttodate: any; pi_strclientcode: any; }
@Component({
  selector: 'page-export-Vehicle-tokensummary',
  templateUrl: 'Vehicle-tokensummary.html'
})



export class VehicleTokenSummary implements OnInit {
  appBuildConfig: any;
  title: String;
  _allPrams: VehicletokensummaryClass;
  exportVehicleVehicletokensummary: any;
  custodianData: any[] = [];
  _fromDate: any = '';
  _toDate: any = '';
  _custodian: any = '';
  showDiv: boolean;
  slotDetail: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {
    this._allPrams = new VehicletokensummaryClass()
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Vehicle Token Summary";

    this.platform.ready().then(() => {

      this.custodianData = [
        { code: 'M', custname: "MIAL Light" },
        { code: 'H', custname: "MIAL Heavy" },
        { code: 'C', custname: "CSC Perishable" },
        { code: 'A', custname: "AI General" },
        { code: 'P', custname: "AI APEDA" },
        { code: 'T', custname: "ALL" }

      ];

    })
  }

  onCustodianChange(event) {
    this._custodian = event;
    // this.isInputDisabled();
  }

  ngOnInit() {

  }

  Getvehicletokensummary() {

    if (this._fromDate == '') {
      this.global.showAlert("Please enter From Date.");
      return;
    }

    if (this._toDate == '') {
      this.global.showAlert("Please enter To Date.");
      return;
    }
    if (this._custodian == '') {
      this.global.showAlert("Please select Custodian.");
      return;
    }
    this._allPrams.pi_dtfromdate = this._fromDate;
    this._allPrams.pi_dttodate = this._toDate;
    this._allPrams.pi_strclientcode = this._custodian;

    this.getvehicleSummDetail();
  }

  getvehicleSummDetail() {
    this.http.getHttpPostRequest(Constants.GMAX_Services.Exports.Vehicle_tokensummary, this._allPrams).then((response) => {
      console.log(response);
      if (response != null && response != "") {
        if (response.hasOwnProperty('NewDataSet')) {

          this.slotDetail = response['NewDataSet']['Table'];
          this.showDiv = true;
        }
      } else {
        this.global.showAlert("Record not found.");
      }
    }, (error) => {

    });

  }

  // isInputDisabled(): boolean {

  //   if (this._fromDate == '' && this._toDate == '' && this._custodian == '') {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  clearInputs() {
    this._fromDate = '';
    this._toDate = '';
    this._custodian = '';
    this, this.showDiv = false;
    this.custodianData = [];
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
