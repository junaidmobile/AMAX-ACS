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
import moment from 'moment';

export class TSPSerachClass { pi_strVTNo: any; pi_strUserName: any }


@Component({
  selector: 'Access-Vehicle-Token',
  templateUrl: 'Access-Vehicle-Token.html'
})

export class AccessVehicleToken implements OnInit {
  appBuildConfig: any;
  title: String;
  VTNo: any = '';
  _allPrams: TSPSerachClass;
  _strUserName: any;
  MAWBNo: any;
  HAWBNo: any;
  VTData: any;
  Shed: any;
  gadiNo: any;
  showDiv: boolean;
  errorMsg: any;
  VTOTP: any = '';
  _ScanVTNo: string;
  comeVT: any;
  value: string;

  driverName: string;
  licenseNo: any;
  @ViewChild('OTPValue') OTPInput;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private datePipe: DatePipe, private barcodeScanner: BarcodeScanner) {
    this._allPrams = new TSPSerachClass();
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Search Token Number";
    if(this.value=="mial"){
      this.VTNo = 'IVT' + this.getCurrentTime();
      }
      else{
      this.VTNo = 'AIIVT' + this.getCurrentTime();
      }
  }

  ionViewDidLoad() {
    // commented as per requirement from MIAL
    setTimeout(() => {
      this.OTPInput.setFocus();
    }, 800)
  }
  onSelectChange(selectedValue: any) {
     console.log('Selected', selectedValue);

     if(selectedValue=="airIndia"){
      this.VTNo = 'AIIVT' + this.getCurrentTime();
      }
      else{
      this.VTNo = 'IVT' + this.getCurrentTime();
      }
   }
  ngOnInit() {

    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    this.VTNo = 'IVT' + this.getCurrentTime();
  }

  getCurrentTime() {
    return moment().format('YYMMDD');
  }

  GetImpVTDetails_HHT() {

    if (this.VTNo == '') {
      this.global.showAlert("Please enter VT No.");
      return;
    }
    if (this.VTOTP == '') {
      this.global.showAlert("Please enter OTP.");
      return;
    }


    this._allPrams.pi_strVTNo = this.VTNo + this.VTOTP;//this.VTNo;
    this._allPrams.pi_strUserName = this._strUserName;
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetImpVTDetails_HHT_VT, this._allPrams).then((response) => {
      console.log(response);
      if (response != null && response != "") {

        if (response.hasOwnProperty('NewDataSet')) {
          this.showDiv = true;
          this.VTData = response['NewDataSet']['Table'];
          this.Shed = this.VTData[0]['ITD_CLEARANCRTYPE_C'];
          this.comeVT = this.VTData[0]['ITD_TOKENNO_C'].toString();
          this.gadiNo = this.VTData[0]['ITD_VEHICLENO_C'];

          this.driverName = this.VTData[0]['ITD_DRIVENAME_C'];
          this.licenseNo = this.VTData[0]['ITD_LicenceNo_C'].toString();

          var str = this.comeVT;

          this.VTNo = str.substring(0, 9);
          this.VTOTP = str.substring(9, 13);


        } else {
          // this.global.showAlert(response['Root']['Output']);
          this.global.showAlert("OTP is invalid.");
          this.clearInputs();
          // this.errorMsg = response['Root']['Output'].toString();
        }


      }
    }, (error) => {
      console.log(error);
    });
  }

  clearInputs() {

   this.showDiv = false;
    this.VTOTP = '';
  }

  // scanBarCode() {
  //   this.barcodeScanner.scan().then(barcodeData => {
  //     console.log('Barcode data', barcodeData);
  //     this._ScanVTNo = barcodeData.text;

  //     var str = this._ScanVTNo;

  //     this.VTNo = str.substring(0, 9);
  //     this.VTOTP = str.substring(9, 13);

  //     localStorage.setItem('VTNo', this.VTNo);
  //     if (barcodeData.cancelled != true) {
  //       this.GetImpVTDetails_HHT();
  //     }

  //   }).catch(err => {
  //     console.log('Error', err);
  //   });
  // }

  scanBarCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this._ScanVTNo = barcodeData.text;

      var str = this._ScanVTNo;

      this.VTNo = str.substr(0, 9);
      this.VTOTP = str.substr(9, 13);

      var str2 = str.substr(9,13);

      console.log('test for substring: ', str2);

      localStorage.setItem('VTNo', this.VTNo);
      if (barcodeData.cancelled != true) {
        this.GetImpVTDetails_HHT();
      }

    }).catch(err => {
      console.log('Error', err);
    });
  }

  onChange(){
    if(this.VTOTP.length == 13){
      this.VTNo = this.VTOTP.substring(0,9);
      this.VTOTP = this.VTOTP.substring(9,13);
      this.GetImpVTDetails_HHT();
    }
    console.log('test for OTP length: ',this.VTOTP);
  }

  fabGone = false;
  ionViewWillEnter() {
    this.fabGone = false;
    setTimeout(() => {
      this.OTPInput.setFocus();
    }, 800)
  }

  ionViewWillLeave() {
    this.fabGone = true;
  }

}
