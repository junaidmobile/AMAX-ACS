/**
 * @author Mohammaed Junaid
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:30
 * @modify date 2018-07-16 11:43:30
 * @desc [description]
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpProvider } from '../../../../providers/http/http';
import { Constants } from '../../../../constant';
import { TPSMileStone } from './TPS-MileStone';
import { DatePipe } from '@angular/common';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { VehicleTokens } from './Vehicle-Tokens';
import { GPDetailBarcode } from './GP-Detail-Barcode';

export class TSPSerachClass {
  pi_strGPNo: any; pi_strUserName: any; pi_strTokenNo: any;
  pi_chrOperation: any;

}


@Component({
  selector: 'GP-Detail-Detach',
  templateUrl: 'GP-Detail-Detach.html'
})

export class GPDetailDetach implements OnInit {
  appBuildConfig: any;
  title: String;
  VTNo: any;
  _allPrams: TSPSerachClass;
  _strUserName: any;
  MAWBNo: any;
  HAWBNo: any;
  VTData: any;
  Shed: any;
  gadiNo: any;
  showDiv: boolean;
  errorMsg: any;
  vehicleDetail: any;
  VTCancelSuccess: any;
  GPDate: any;
  ActiveVTData: any;
  GPDetailData: any;
  objRemoveGPDetail: any;

  IsMultipleGP: any; //new on 13/07

  Table1Data: string; //new for detach feature
  allvtscommaseprated: string; //new for detach feature

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private datePipe: DatePipe, private barcodeScanner: BarcodeScanner) {
    this._allPrams = new TSPSerachClass();
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Gate Pass Details";

    this.vehicleDetail = JSON.parse(localStorage.getItem("vehicleDetail"));
    this.objRemoveGPDetail = JSON.parse(localStorage.getItem("objRemoveGPDetail"));

    this.Table1Data = localStorage.getItem("Table1Data"); //new for detach feature
    this.allvtscommaseprated = this.Table1Data.replace(/['"]+/g, ''); //new for detach feature

    console.log('check all the tokens here: ', this.allvtscommaseprated);

    this.IsMultipleGP = localStorage.getItem('IsMultipleGP'); //new on 13/07
    console.log('check new flag: ', this.IsMultipleGP);





  }

  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];

    // this.VTNo = this.vehicleDetail[0]['TokenNo'][0];
    // this.gadiNo = this.vehicleDetail[0]['VehicleNo'][0];
    // this.Shed = this.vehicleDetail[0]['Shed'][0];

  }

  showMsgOnDetach(){
    if(localStorage.getItem('IsMultipleVT') == 'Y'){
      this.showMessageForMultipleVTCancel();
    }
    else{
      this.showMessageForSingleVTCancel();
    }
  }

  showMessageForSingleVTCancel(){
    let confirm = this.alertCtrl.create({
      title: 'Confirm Cancel Vehicle Token',
      message: 'Are you sure you want to proceed?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.ImpCancelToken_HHT_VTCancel();
          }
        },
        {
          text: "Cancel",
          role: 'cancel'
        }
      ]
    });
    confirm.present();
  }

  showMessageForMultipleVTCancel() {
    let confirm = this.alertCtrl.create({
      title: 'Confirm Cancel Vehicle Token',
      message: 'All VT’s linked to this GP shall be cancelled. Are you sure you want to proceed?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // this.global.routePage(VehicleTokens);
            // this.navCtrl.pop() //added by Himesh on 03/11/2020
            this.ImpCancelToken_HHT_VTCancel();
          }
        },
        {
          text: "Cancel",
          role: 'cancel'
        }
      ]
    });
    confirm.present();
  }

  ImpCancelToken_HHT_GPDeatched(VehicleNo, TokenNo, HAWBNo, MAWBNo, GPNo) {

    this._allPrams.pi_strTokenNo = TokenNo.toString();//this.vehicleDetail[0].TokenNo.toString();
    this._allPrams.pi_chrOperation = 'D';
    this._allPrams.pi_strGPNo = GPNo.toString();// this.vehicleDetail[0].GPNo.toString();
    this._allPrams.pi_strUserName = this._strUserName;

    // this._allPrams.pi_strUserName = this._strUserName;
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.ImpCancelToken_HHT_Cancel, this._allPrams).then((response) => {
      console.log('my name is  ---   ' + response);
      if (response != null && response != "") {

        if (response.hasOwnProperty('NewDataSet')) {
          this.GPDate = response['NewDataSet']['Table'];
        } else {
          //  this.global.showAlert(response['Root']['Output']);
          // this.errorMsg = response['Root']['Output'].toString();
          this.VTCancelSuccess = response['Root']['Output'];
          this.showConfirmForVTCancel();
        }

      }
    }, (error) => {
      console.log(error);
    });
  }

  //as per need, detach means delete all the tokens associated with the GP
  ImpCancelToken_HHT_VTCancel() {
    this._allPrams.pi_strTokenNo = this.allvtscommaseprated
    // this._allPrams.pi_strTokenNo =  this.vehicleDetail[0].TokenNo.toString();
    this._allPrams.pi_chrOperation = 'C';
    this._allPrams.pi_strGPNo = this.vehicleDetail[0].GPNo.toString();
    this._allPrams.pi_strUserName = this._strUserName;

    //  this._allPrams.pi_strUserName = this._strUserName;
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.ImpCancelToken_HHT_Cancel, this._allPrams).then((response) => {
      console.log('response after cancellation',response);
      if (response != null && response != "") {

        if (response.hasOwnProperty('NewDataSet')) {

        } else {
          //  this.global.showAlert(response['Root']['Output']);
          // this.errorMsg = response['Root']['Output'].toString();
          this.VTCancelSuccess = response['Root']['Output'];
          this.showConfirmForVTCancel();
        }

      }
    }, (error) => {
      console.log(error);
    });
  }



  GoToVtDetail() {
    // this.global.routePage(VehicleTokens);
    this.navCtrl.remove(this.navCtrl.getActive().index - 1, 2); //added by Himesh on 03/11/2020
    this.global.showSegment = 2;
  }


  showConfirmForVTCancel() {
    let confirm = this.alertCtrl.create({
      title: this.VTCancelSuccess,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // this.global.routePage(VehicleTokens);
            this.navCtrl.remove(this.navCtrl.getActive().index - 1, 2); //new
          }
        }
      ]
    });
    confirm.present();
  }


  clearInputs() {
    this.VTNo = '';
    this.showDiv = false;
  }

  scanBarCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.VTNo = barcodeData.text;
      localStorage.setItem('VTNo', this.VTNo);

    }).catch(err => {
      console.log('Error', err);
    });
  }

  fabGone = false;
  ionViewWillEnter() {
    this.fabGone = false;
  }

  ionViewWillLeave() {
    this.fabGone = true;
  }

  goGPDetailAndBarCode(VehicleNo, TokenNo, HAWBNo, MAWBNo, GPNo) {

    localStorage.setItem('VehicleNo', VehicleNo);
    localStorage.setItem('TokenNo', TokenNo);
    localStorage.setItem('HAWBNo', HAWBNo);
    localStorage.setItem('MAWBNo', MAWBNo);
    localStorage.setItem('GPNo', GPNo);

    this.global.routePage(GPDetailBarcode);
  }

}
