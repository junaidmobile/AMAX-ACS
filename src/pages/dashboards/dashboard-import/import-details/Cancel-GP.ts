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
import { NgxBarcodeModule } from 'ngx-barcode';
import { TSPCreate } from './TPS-Create';
export class TSPSerachClass { pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }
export class gatePassCancel {
  pi_intHAWBRowId: any; pi_strGatePassNo: any; pi_strCreatedBy: any;
  pi_strDeliveryOpeartion: any; pi_strHAWBNo: any;
}
@Component({
  selector: 'Cancel-GP',
  templateUrl: 'Cancel-GP.html'
})

export class cancelGP implements OnInit {
  appBuildConfig: any;
  title: String;
  GPNumber: any = '';
  MAWBNo: any = '';
  _allPrams: TSPSerachClass;
  _gatePassCancel: gatePassCancel;
  _strUserName: any;
  showDiv: boolean;
  tspdetails: any;
  TSPPaidAmount: any;
  tspdetails_set: any;
  HAWBNo: any;
  flag: any;
  MultipleTSP: any;
  lblTSP: boolean;
  ddlTSP: boolean;
  HAWBId: any;
  GPSuccess: any;
  IsTokenActive: any;

  deliveredMsg: boolean = false;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {

    this.MAWBNo = localStorage.getItem('MAWBNo');
    this.HAWBNo = localStorage.getItem('HAWBNo');
    this.HAWBId = localStorage.getItem('HAWBId');
    if (this.HAWBNo == null) {
      this.HAWBNo = '';
    }
    //this.TSPNumber = localStorage.getItem('TSPNo');
    this.flag = localStorage.getItem('flag');
    this._allPrams = new TSPSerachClass();
    this._gatePassCancel = new gatePassCancel();
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "GP Barcode";

  }

  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    this.getTSP_Details();
    // if (this.flag == 'T') {
    //   this.ddlTSP = false;
    //   this.lblTSP = true;
    // } else if (this.flag == 'M') {
    //   this.getTSP_Details();
    //   this.ddlTSP = true;
    //   this.lblTSP = false ;
    // }
  }

  getTSP_Details() {

    this._allPrams.pi_chrSearchParam = 'M';
    this._allPrams.pi_strTSPNo = '';
    this._allPrams.pi_strMAWBNo = this.MAWBNo;
    this._allPrams.pi_strHAWBNo = this.HAWBNo;
    this._allPrams.pi_strUserName = this._strUserName;

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetTSPDetails_HHT_for_AWBTSP, this._allPrams).then((response) => {
      if (response != null && response != "") {
        this.MultipleTSP = response['NewDataSet']['Table'];
        console.log('check data here for delivered status: ',this.MultipleTSP);
        for (var j = 0; j < this.MultipleTSP.length; j++) {
          if (this.MultipleTSP[j]['gpdeliverystatus'] != 'Delivered') {

            this.GPNumber = this.MultipleTSP[j]['GatePassNo'].toString();

            if (this.checkProperty(this.MultipleTSP[j], 'IsTokenActive')) {
              this.IsTokenActive = this.MultipleTSP[j]['IsTokenActive'].toString();
            }
          }

          if (this.MultipleTSP[j]['gpdeliverystatus'] == 'Delivered') {
            this.GPNumber = this.MultipleTSP[j]['GatePassNo'].toString();
            this.deliveredMsg = true;
          }

        }



      } else {
        //this.global.showAlert("Record not found.");
      }
    }, (error) => {
      console.log(error);
    });
  }


  checkProperty(obj, key) {

    return obj.hasOwnProperty(key);
  }


  cancelConfirmMAster() {
//debugger
    if (this.IsTokenActive == '1' || this.IsTokenActive == 'true') {
      this.showConfirmAlertForIsVA();
      return
    } else if (this.IsTokenActive == '0' || this.IsTokenActive == 'false') {
      // this.showConfirmAlertForGPCancel();
      // return
      this.IMPCancelGP_HHT();
    }
  }


  IMPCancelGP_HHT() {


    this._gatePassCancel.pi_strDeliveryOpeartion = "";
    this._gatePassCancel.pi_strHAWBNo = this.HAWBNo;
    this._gatePassCancel.pi_strGatePassNo = this.GPNumber;
    this._gatePassCancel.pi_strCreatedBy = this._strUserName;
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.IMPCancelGP_HHT_GP, this._gatePassCancel).then((response) => {
      if (response != null && response != "") {
        this.GPSuccess = response['Root']['Output'].toString();
        // this.global.showAlert(this.TSPSuccess);
        this.showConfirmForTSP();
      } else {
        this.global.showAlert("Record not found.");
      }
    }, (error) => {
      console.log(error);
    });
  }

  showConfirmForTSP() {
    let confirm = this.alertCtrl.create({
      title: this.GPSuccess,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // this.global.routePage(TSPCreate);
            this.navCtrl.pop(); //added by Himesh on 02/11/2020
          }
        }
      ]
    });
    confirm.present();
  }

  onCustodianChange(event) {

    this.GPNumber = event;
    // this.isInputDisabled();
  }


  // Just to animate the fab
  fabGone = false;
  ionViewWillEnter() {
    this.fabGone = false;
  }

  ionViewWillLeave() {
    this.fabGone = true;
  }


  showConfirmAlertForIsVA() {

    let alert = this.alertCtrl.create({
      title: 'Confirm Cancel Gate Pass',
      message: 'All VT’s linked to this GP shall be cancelled. Are you sure you want to proceed?',
      buttons: [{
        text: "Ok",
        handler: () => {
          this.IMPCancelGP_HHT();
        }
      }, {
        text: "Cancel",
        role: 'cancel'
      }]
    })
    alert.present();
  }

  showConfirmAlertForGPCancel() {

    let alert = this.alertCtrl.create({
      title: 'Confirm Cancel Gate Pass',
      message: 'Are you sure you want to cancel the Gate Pass?',
      buttons: [{
        text: "Ok",
        handler: () => {
          this.IMPCancelGP_HHT();
        }
      }, {
        text: "Cancel",
        role: 'cancel'
      }]
    })
    alert.present();
  }

}
