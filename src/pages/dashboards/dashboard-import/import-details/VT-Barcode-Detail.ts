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
import { GPDetailDetach } from './GP-Detail-Detach';
import { ActiveSingleGatePass } from './Active-Single-GatePass';
// import { ActiveSingleGatePass } from './Active-Single-GatePass';

export class TSPSerachClass {
  pi_strGPNo: any; pi_strUserName: any; pi_strTokenNo: any;
  pi_chrOperation: any;

}


@Component({
  selector: 'VT-Barcode-Detail',
  templateUrl: 'VT-Barcode-Detail.html'
})

export class VTBarcodeDetail implements OnInit {
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
  Table1Data: string;
  allvtscommaseprated: string;

  IsMultipleVT;
  shed;

  IsMultipleGP;

  oneGPMultiVT;

  gatePassesListArr: any = []; //new


  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private datePipe: DatePipe, private barcodeScanner: BarcodeScanner) {
    this._allPrams = new TSPSerachClass();
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Token Barcode";
    debugger
    this.vehicleDetail = JSON.parse(localStorage.getItem("vehicleDetail"));
    this.ActiveVTData = JSON.parse(localStorage.getItem("ActiveVTData"));
    this.Table1Data = localStorage.getItem("Table1Data");

    this.oneGPMultiVT = JSON.parse(localStorage.getItem("oneGPMultiVT")); //new on 04/03
    console.log('test for edit module 2: ', this.oneGPMultiVT);

    this.allvtscommaseprated = this.Table1Data.replace(/['"]+/g, '');

    console.log('test for defect 150749:', this.vehicleDetail);

    this.IsMultipleVT = this.vehicleDetail[0].IsMultipleVT;
    this.IsMultipleGP = this.vehicleDetail[0].IsMultipleGP; //new on 13/07
    console.log('test for multiple VTs: ', this.vehicleDetail.IsMultipleVT);
    console.log('test for multiple VTs2: ', this.IsMultipleVT);

    localStorage.setItem('IsMultipleVT',this.IsMultipleVT); //newly added on 24/03 for detach part
    localStorage.setItem('IsMultipleGP',this.IsMultipleGP); //new on 13/07


    this.MAWBNo = this.vehicleDetail[0].MAWBNo;
    console.log('test for mawb: ', this.MAWBNo);

    this.HAWBNo = this.vehicleDetail[0].HAWBNo;
    console.log('test for hawb: ', this.HAWBNo);

  }

  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];

    // this.VTNo = this.vehicleDetail[0]['TokenNo'][0];
    // this.gadiNo = this.vehicleDetail[0]['VehicleNo'][0];
    // this.Shed = this.vehicleDetail[0]['Shed'][0];

    // this.sliceShed();

  }

  ImpCancelToken_HHT_VTCancel() {
    // if (this.allvtscommaseprated.indexOf(',') > -1) {



    //  }else{

    //  }

    this._allPrams.pi_strTokenNo = this.allvtscommaseprated
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

  ImpCancelToken_HHT_GPDeatched() {

    this._allPrams.pi_strTokenNo = this.vehicleDetail[0].TokenNo.toString();
    this._allPrams.pi_chrOperation = 'D';
    this._allPrams.pi_strGPNo = this.vehicleDetail[0].GPNo.toString();
    this._allPrams.pi_strUserName = this._strUserName;

    //   this._allPrams.pi_strUserName = this._strUserName;
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.ImpCancelToken_HHT_Cancel, this._allPrams).then((response) => {
      console.log(response);
      if (response != null && response != "") {

        if (response.hasOwnProperty('NewDataSet')) {
          this.GPDate = response['NewDataSet']['Table'];
        } else {
          //  this.global.showAlert(response['Root']['Output']);
          // this.errorMsg = response['Root']['Output'].toString();
          this.VTCancelSuccess = response['Root']['Output'];
          //this.showConfirmForVTCancel();
        }

      }
    }, (error) => {
      console.log(error);
    });
  }



  goTOGPDetail() {
debugger
    this.GPDetailData = this.ActiveVTData.filter(t => t.GPNo == this.vehicleDetail[0].GPNo.toString());
    localStorage.setItem('objRemoveGPDetail', JSON.stringify(this.GPDetailData));

    this.global.routePage(GPDetailDetach);
  }

  toEditVT() {
    // this.global.routePage(ActiveSingleGatePass);
    this.global.edTokenFlag = 1;
    localStorage.removeItem('ActiveGPList');
    localStorage.setItem('ActiveGPList', JSON.stringify(this.gatePassesListArr));
    // this.navCtrl.push(ActiveSingleGatePass, {vtDetails: this.vehicleDetail}); //commented on 04/03
    this.navCtrl.push(ActiveSingleGatePass, {vtDetails: this.vehicleDetail, oneGPMultiVT: this.oneGPMultiVT}); //new on 04/03
    console.log('----VT Details----', this.vehicleDetail);
    console.log('----****----', JSON.parse(localStorage.getItem("ActiveGPList")));
  }


  showConfirmForVTCancel() {
    let confirm = this.alertCtrl.create({
      title: this.VTCancelSuccess,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // this.global.routePage(VehicleTokens);
            this.navCtrl.pop() //added by Himesh on 03/11/2020
          }
        }
      ]
    });
    confirm.present();
  }

  sliceShed(){
    var fir = this.vehicleDetail[0].shed;
    this.shed = fir.splice(0,1).join("");


    console.log('final shed: ', this.shed);
  }

  showMsgOnCancelVT(){
    if(this.IsMultipleVT == 'Y'){
      this.showMessageForMultipleVTCancel();
    }
    else {
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

  //new below function for defect 157094 by Himesh on 21/12
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

    this.gatePassesListArr = []; //new
    this.gatePassesListArr.push(this.MAWBNo);
    this.gatePassesListArr.push(this.HAWBNo);
  }

  ionViewDidEnter(){
    // this.sliceShed();
  }

  ionViewWillLeave() {
    this.fabGone = true;
  }

}
