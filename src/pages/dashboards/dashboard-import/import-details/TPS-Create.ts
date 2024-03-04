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
import moment from 'moment';
import { cancelGP } from './Cancel-GP';
import { debounce } from 'ionic-angular/umd/util/util';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
//export class TSPSerachClass { pi_chrSearchParam: any; pi_strTSPNo: any; pi_strMAWBNo: any; pi_strHAWBNo: any; po_strMessage: any; po_chrAlert: any }
export class TSPSerachClass {
  pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any;
}

export class GPParameter {
  pi_chrSearchParam: string;
  pi_strGPNo: string;
  pi_strMAWBNo: string;
  pi_strHAWBNo: string;

}


@Component({
  selector: 'TPS-Create',
  templateUrl: 'TPS-Create.html'
})



export class TSPCreate implements OnInit {
  appBuildConfig: any;
  title: String;
  Prefix: any = '';
  TSPNumber: any = '';
  MAWBNo: any = '';
  _allPrams: TSPSerachClass;
  gpParam: GPParameter;
  options: BarcodeScannerOptions;
  _strUserName: any;
  showDiv: boolean;
  tspdetails: any;
  TSPPaidAmount: any;
  tspdetails_set: any;
  @ViewChild('PrefixValue') PrefixInput;
  @ViewChild('MAWBNoValue') myInput;
  ExamPieces: any;
  _HAWBNo: any;
  GPPrefix: string;
  GPOTP: string;
  GPNumber: any;
  HAWBCheck: any;

  dCubeStatus;

  
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private datePipe: DatePipe, private barcodeScanner: BarcodeScanner) {
    this._allPrams = new TSPSerachClass();
    this.gpParam = new GPParameter;
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Search MAWB";
  }

  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    this.GPPrefix = 'G' + this.getCurrentTime();
  }
  getCurrentTime() {
    return moment().format('YYMMDD');
  }
  ionViewDidLoad() {
    setTimeout(() => {
      this.PrefixInput.setFocus();
    }, 800)
  }

  ionViewDidEnter(){ //new for DHL
    setTimeout(() => {
      this.PrefixInput.setFocus();
    }, 800)
   this.getTSP_MAWB_Details();
  }
  GetMAWBDetail() {

    if (this.Prefix == '') {
      this.global.showAlert("Please enter Prefix.");
      return;
    }
    if (this.MAWBNo == '') {
      this.global.showAlert("Please enter MAWB Number.");
      return;
    }
    this.getTSP_MAWB_Details();
  }

  getTSP_MAWB_Details() {

    localStorage.removeItem('TSPNo');
    localStorage.removeItem('GrWt');
    localStorage.removeItem('ChWt');
    localStorage.removeItem('Pieces');
    localStorage.removeItem('GPStatus');
    localStorage.removeItem('HAWBId');
    localStorage.removeItem('MAWBNo');
    localStorage.removeItem('HAWBNo');
    localStorage.removeItem('flag');
    localStorage.removeItem('ConsigneeName');
    localStorage.removeItem('PartyName');
    localStorage.removeItem('pi_strIGMDetailsXML');
    localStorage.removeItem('ActiveVTData');
    localStorage.removeItem('vehicleDetail');
    localStorage.removeItem('GPStatus');
    localStorage.removeItem('DlvblPkgs');
    localStorage.removeItem('objRemoveGPDetail');
    localStorage.removeItem('DlvblChWt');
    localStorage.removeItem('HAWBID');
    localStorage.removeItem('OCNumber');
    localStorage.removeItem('flag');

    localStorage.removeItem('DlvblChWt');
    localStorage.removeItem('DlvblGrWt');
    localStorage.removeItem('DlvblPkgs');
    localStorage.removeItem('OCNumber');
    localStorage.removeItem('PartyName');
    localStorage.removeItem('pi_strIGMDetailsXML');

    this._allPrams.pi_strMAWBNo = this.Prefix + this.MAWBNo;
    this._allPrams.pi_strUserName = this._strUserName;
    // this._allPrams.po_strMessage = '';
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetHAWBNosBasedOnMAWBNos_HHT_MAWB, this._allPrams).then((response) => {
      console.log(response);
      if (response != null && response != "") {

        this.tspdetails = response['NewDataSet']['Table'];
        // if (this.tspdetails[0]['HAWBNo'] == "") {

        this.HAWBCheck = this.tspdetails[0]['HAWBNo'];
        localStorage.setItem('HAWBId', this.tspdetails[0]['HAWBId']);
        localStorage.setItem('MAWBNo', this.tspdetails[0]['MAWBNo']);
        localStorage.setItem('GPStatus', this.tspdetails[0]['GPStatus']);

        localStorage.setItem('HAWBNo', this.tspdetails[0]['HAWBNo']);

        console.log('----DCUBE Status----: ', this.tspdetails[0]['CHADCubeStatus']);
        this.dCubeStatus = this.tspdetails[0]['CHADCubeStatus'];
        this.showDiv = true;
        // if (this.tspdetails[0]['GPStatus'] == 1 && this.tspdetails[0]['TSPStatus'] == 1) {

        //   this.global.routePage(cancelGP);

        // } else {
        //   this.clearInputs();
        //   this.global.routePage(TPSMileStone);
        // }
        // } else {
        //   this.showDiv = true;
        // }

        //this.IMPCalculateTSP_HHT();

      } else if(this.Prefix == '' || this.MAWBNo == ''){
        console.log('first stage');
      } //new else if for DHL
      
      else {
        this.global.showAlert("MAWB number is invalid.");
        this.clearInputs();
      }
    }, (error) => {

      console.log(error);
    });
  }

  // Just to animate the fab
  fabGone = false;
  ionViewWillEnter() {
    this.fabGone = false;
  }

  ionViewWillLeave() {
    this.fabGone = true;
    this.dCubeStatus = '';
  }
  focusNextInput() {
    if (this.Prefix.length == 3) {
      this.myInput.setFocus();
    }
  }

  goTOTPSMileStone(HAWBId, HAWBNo, MAWBNo, GPStatus, TSPStatus, GPDeliveryStatus) {
    localStorage.setItem('HAWBId', HAWBId);
    localStorage.setItem('HAWBNo', HAWBNo);
    localStorage.setItem('MAWBNo', MAWBNo);
    localStorage.setItem('GPStatus', GPStatus);
    // if (GPStatus == 1 && TSPStatus == 1) {
    if (GPStatus == 1) {
      // this.clearInputs();  //commented on 12/07 as per Satish/Mayur
      this.global.routePage(cancelGP);
    } else if (GPStatus == 2 && GPDeliveryStatus != 'Delivered') {
      // this.clearInputs(); //commented on 12/07 as per Satish/Mayur
      this.global.routePage(cancelGP);
    } else {
      // this.clearInputs(); //commented on 12/07 as per Satish/Mayur
      this.global.routePage(TPSMileStone);
    }
  }

  notSubscribedMsg(){
    let confirm = this.alertCtrl.create({
      title: 'DCube service is not activated for your account. To continue with this transaction online, contact the Terminal Operator to activate DCube service.',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            // this.navCtrl.pop()
            console.log('action cancelled');
          }
        }
      ]
    });
    confirm.present();
  }

  clearInputs() {
    this.TSPNumber = '';
    this.Prefix = '';
    this.MAWBNo = '';
    this.showDiv = false;

  }


  GetTSPDetail() {

    if (this.GPPrefix == '') {
      this.global.showAlert("Please enter GP Prefix.");
      return;
    }
    if (this.GPOTP == '') {
      this.global.showAlert("Please enter OTP.");
      return;
    }
    this.gpParam.pi_chrSearchParam = 'G';
    this.gpParam.pi_strGPNo = this.GPPrefix + this.GPOTP;// this.GPNumber;
    this.gpParam.pi_strMAWBNo = '';
    this.gpParam.pi_strHAWBNo = '';
    this._allPrams.pi_strUserName = this._strUserName;
    this.getTSP_Details();
  }



  getTSP_Details() {

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetImpGPDetailsForDelivery_HHT_GP, this.gpParam).then((response) => {
      console.log("GP Response : ==>", response);
      if (response != null && response != "") {

        if (response.hasOwnProperty('NewDataSet')) {

          if (this.tspdetails[0]['GPStatus'] == 1 && this.tspdetails[0]['TSPStatus'] == 1) {

            // this.global.routePage(cancelGP);

          }
          // this.showDiv = true;
          // this.GPdetails = response['NewDataSet']['Table'];

          // this.habboNo = this.GPdetails[0]['IHM_HAWBNo_C'].toString();
          // this.ShowHideHAwb = this.GPdetails[0]['IHM_HAWBNo_C'];
          // if (this.habboNo == '') {
          //   this.Direct = 'Direct';
          // }
        } else {
          this.showDiv = false;
          this.global.showAlert(response['Root']['Output']);

        }
      } else {
        this.global.showAlert("OTP is invalid.");
        this.clearInputs();
      }
    }, (error) => {
      console.log(error);
    });
  }


  scanBarCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.GPNumber = barcodeData.text;

      var str = this.GPNumber;
      this.GPPrefix = str.substring(0, 7);
      this.GPOTP = str.substring(7, 11);

      localStorage.setItem('GPNumber', this.GPNumber);
      // if (this.GPDeliveryStatus != "Approved") {
      //   this.global.showAlert("Delivery Accepted or Not Approve.");
      //   return;
      // }

      if (barcodeData.cancelled != true) {
        this.gpParam.pi_chrSearchParam = 'G';
        this.gpParam.pi_strGPNo = this.GPNumber;
        this.gpParam.pi_strMAWBNo = '';
        this.gpParam.pi_strHAWBNo = '';
        this._allPrams.pi_strUserName = this._strUserName;
        this.getTSP_Details();
      }

    }).catch(err => {
      console.log('Error', err);
    });
  }

}
