//ScanTSPOption

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
import { TSPQRCode } from './TSP-QRCode';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { StorageLocationList } from './Storage-Location-List';
import { DeliverySubmit } from './Delivery-Submit';
import { ApproveDeliverySubmit } from './Approve-Delivery-Submit';
import moment from 'moment';
//export class TSPSerachClass { pi_chrSearchParam: any; pi_strTSPNo: any; pi_strMAWBNo: any; pi_strHAWBNo: any; po_strMessage: any; po_chrAlert: any }
export class TSPSerachClass {
  pi_strMAWBNo: any;
  pi_strUserName: any; po_strMessage: any;
  pi_chrSearchParam: any; pi_strGPNo: any; pi_strHAWBNo: any;
}

@Component({
  selector: 'Approve-Delivery',
  templateUrl: 'Approve-Delivery.html'
})
export class ApproveDelivery implements OnInit {
  scanData: {};
  options: BarcodeScannerOptions;
  appBuildConfig: any;
  title: String;
  Prefix: any = '';
  GPNumber: any = '';
  MAWBNo: any = '';
  _allPrams: TSPSerachClass
  _strUserName: any;
  showDiv: boolean;
  GPdetails: any;
  TSPPaidAmount: any;
  tspdetails_set: any;
  HAWBNumber: any;
  HAWBNumberbool: boolean;
  dropdownHAWB: any;
  @ViewChild('PrefixValue') PrefixInput;
  @ViewChild('MAWBNoValue') myInput;
  @ViewChild('OTPValue') OTPInput;
  HAWBNo: any = '';
  GPDeliveryStatus: any;
  habboNo: any;
  Direct: string;
  ShowHideHAwb: string;
  GPPrefix: any = '';
  GPOTP: any = '';
  GPdetailsNew: any;

  searchByMAWB: boolean = false;
  searchByOTP: boolean = false;

  GpStat;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private barcodeScanner: BarcodeScanner) {
    this._allPrams = new TSPSerachClass()
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Search Delivery Details";
    this.options = { prompt: 'Scan the Barcode to Enter', resultDisplayDuration: 0 };
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
      this.OTPInput.setFocus();
    }, 800)
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
    this.searchByMAWB = true;
    this.searchByOTP = false;
    this.getGPList();
  }


  getGPList() {

    this.GpStat = '';
    
    localStorage.removeItem('TSPNo');
    localStorage.removeItem('GPNumber');
    localStorage.removeItem('GrWt');
    localStorage.removeItem('ChWt');
    localStorage.removeItem('Pieces');
    localStorage.removeItem('GPStatus');
    localStorage.removeItem('HAWBId');
    localStorage.removeItem('MAWBNo');
    localStorage.removeItem('HAWBNo');
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

    this._allPrams.pi_strMAWBNo = this.Prefix + this.MAWBNo;
    this._allPrams.pi_strUserName = this._strUserName;
    // this._allPrams.po_strMessage = '';
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetHAWBNosBasedOnMAWBNos_HHT_MAWB, this._allPrams).then((response) => {
      if (response != null && response != "") {


        this.showDiv = true;
        this.GPdetails = response['NewDataSet']['Table'];
        this.HAWBNumber = 0;
        this.dropdownHAWB = response['NewDataSet']['Table'];

        this.dropdownHAWB =
          this.dropdownHAWB.filter(
            HAWB => HAWB.GPStatus != '0' && HAWB.GPDeliveryStatus != 'Delivered' //&& condition added for history Shipment
          );

        this.ShowHideHAwb = this.GPdetails[0]['HAWBNo'];
        console.log(this.GPdetails)
        if (this.GPdetails.length == 1 && this.GPdetails[0]['HAWBNo'] == "") {
          this.HAWBNumberbool = false;
        } else {
          this.HAWBNumberbool = true;
        }


        // this.showDiv = true;
        // this.GPdetails = response['NewDataSet']['Table'];
        // this.dropdownHAWB = response['NewDataSet']['Table'];
        // if (this.checkProperty(this.GPdetails[0], 'HAWBNo')) {
        //   if (this.GPdetails[0]['HAWBNo'] == "") {

        //     localStorage.setItem('HAWBId', this.GPdetails[0]['HAWBId']);
        //     localStorage.setItem('MAWBNo', this.GPdetails[0]['MAWBNo']);
        //     localStorage.setItem('GPStatus', this.GPdetails[0]['GPStatus']);
        //     localStorage.setItem('GPStatus', this.GPdetails[0]['GPDeliveryStatus']);
        //     this.GPDeliveryStatus = this.GPdetails[0]['GPDeliveryStatus'].toString();

        //     // if (this.GPDeliveryStatus != "Accepted") {
        //     //   this.global.showAlert("Delivery cannot be approved. Shipment delivery is not accepted by the Customs Broker.");
        //     //   return;
        //     // }

        //     this.clearInputs();
        //     this.global.routePage(ApproveDeliverySubmit);
        //   } else {
        //     this.showDiv = true;
        //     this.GPDeliveryStatus = this.GPdetails[0]['GPDeliveryStatus'].toString();
        //   }
        // }

      } else if(this.Prefix == '' || this.MAWBNo == ''){
        console.log('first stage');
        this.OTPInput.setFocus();
      } //new else if for DHL
      
      else {
        this.global.showAlert("MAWB number is invalid.");
        this.clearInputs();
      }
    }, (error) => {

      console.log(error);
    });
  }

  checkProperty(obj, key) {

    return obj.hasOwnProperty(key);
  }


  clearInputs() {
    this.GPNumber = '';
    this.Prefix = '';
    this.MAWBNo = '';
    this.HAWBNo = '';
    this.showDiv = false;
    this.HAWBNumberbool = false;
    this.GPPrefix = 'G' + this.getCurrentTime();
    this.GPOTP = '';
  }

  // Just to animate the fab
  fabGone = false;
  ionViewWillEnter() {
    this.fabGone = false;
    setTimeout(() => {
      this.OTPInput.setFocus();
    }, 800)
  }

  ionViewDidEnter(){  
    if(this.searchByMAWB == true){
      
      this.getGPList();
      // this.OTPInput.setFocus();
    }
    if(this.searchByOTP == true){
      
      this.clearInputs();
      this.OTPInput.setFocus();
    }
  //   setTimeout(() => {
  //    this.OTPInput.setFocus();
  //  }, 800)
   }
   //new didEnter block for DHL
 

  ionViewWillLeave() {
    this.fabGone = true;
  }
  focusNextInput() {
    if (this.Prefix.length == 3) {
      this.myInput.setFocus();
    }
  }
  goGPDelivery(hawb, GP, mawb, IHM_HAWBNo_C, IHM_MAWBNo_C) {
    // debugger
    // if (this.GPDeliveryStatus != "Accepted") {
    //   this.global.showAlert("Delivery cannot be approved. Shipment delivery is not accepted by the Customs Broker.");
    //   return;
    // }
    // localStorage.setItem('MAWBNo', MAWB);
    // localStorage.setItem('HAWBNo', HAWB);

    if (hawb == undefined) {
      localStorage.setItem('HAWBNo', IHM_HAWBNo_C);
    } else if (IHM_HAWBNo_C == undefined) {
      localStorage.setItem('HAWBNo', hawb);
    }

    if (mawb == undefined) {
      localStorage.setItem('MAWBNo', IHM_MAWBNo_C);
    } else if (IHM_MAWBNo_C == undefined) {
      localStorage.setItem('MAWBNo', mawb);
    }
    // localStorage.setItem('MAWBNo', IHM_HAWBNo_C);
    if (this.GPNumber != '') {
      localStorage.setItem('GPNumber', this.GPNumber);
    }

    // this.clearInputs(); //added new // again commented for DHL
    this.global.routePage(ApproveDeliverySubmit);
  }

  scanBarCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);

      
      this.GPNumber = barcodeData.text;
      console.log('check gate pass number: ', this.GPNumber);

      var str = this.GPNumber;
      this.GPPrefix = str.substring(0, 7);
      this.GPOTP = str.substring(7, 11);

      // localStorage.setItem('GPNumber', this.GPNumber); //commented on 22/04

      if (this.GPNumber != '') { //this if block added on 22/04
        localStorage.setItem('GPNumber', this.GPNumber);
      }
      // if (this.GPDeliveryStatus != "Accepted") {
      //   this.global.showAlert("Delivery not approved.");
      //   return;
      // }
      if (barcodeData.cancelled != true) {
        //this.global.routePage(ApproveDeliverySubmit);
        this._allPrams.pi_chrSearchParam = 'G';
        this._allPrams.pi_strGPNo = this.GPNumber;
        this._allPrams.pi_strMAWBNo = '';
        this._allPrams.pi_strHAWBNo = '';
        this.getTSP_Details();
      }


    }).catch(err => {
      console.log('Error', err);
    });
  }

  onChange(){
    if(this.GPOTP.length == 11){
      var gpnum = this.GPOTP;
      this.GPPrefix = this.GPOTP.substring(0,7);
      this.GPOTP = this.GPOTP.substring(7,11);
      this._allPrams.pi_chrSearchParam = 'G';
      this._allPrams.pi_strGPNo = gpnum;
      this._allPrams.pi_strMAWBNo = '';
      this._allPrams.pi_strHAWBNo = '';
      this.getTSP_Details();
    }
    console.log('test for OTP length: ',this.GPOTP);
  }


  searchGPNumber() {

    localStorage.setItem('GPNumber', this.GPNumber);


    // if (this.GPDeliveryStatus != "Approved") {
    //   this.global.showAlert("Delivery Accepted or Not Approve.");
    //   return;
    // }
    //this.global.routePage(ApproveDeliverySubmit);
  }

  onServiceTypeChange(event) {
    if (this.Prefix == '') {
      this.global.showAlert("Please enter Prefix.");
      return;
    }
    if (this.MAWBNo == '') {
      this.global.showAlert("Please enter MAWB Number.");
      return;
    }
    if (event != 0) {
      this.HAWBNumber = event;
      this._allPrams.pi_chrSearchParam = 'M';
      this._allPrams.pi_strGPNo = '';
      this._allPrams.pi_strMAWBNo = this.Prefix + this.MAWBNo;
      this._allPrams.pi_strHAWBNo = this.HAWBNumber.toString();
      this._allPrams.pi_strUserName = this._strUserName;
      this.getTSP_Details_dropDown();
    } else {
      this.GetMAWBDetail()
    }
    // this.isInputDisabled();
  }


  getTSP_Details_dropDown() {

    this.Direct = '';
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetImpGPDetailsForDelivery_HHT_GP, this._allPrams).then((response) => {
      console.log("Response : ", response);
      if (response != null && response != "") {

        if (response.hasOwnProperty('NewDataSet')) {
          this.showDiv = true;
          this.GPdetailsNew = response['NewDataSet']['Table'];

          for (var j = 0; j < this.GPdetailsNew.length; j++) {
            // if (this.GPdetailsNew[j]['GPDeliveryStatus'] == 'Accepted') {
              this.GPdetails = [];
              this.GPdetails.push(this.GPdetailsNew[j]);
              // this.habboNo = this.GPdetailsNew[j]['IHM_HAWBNo_C'].toString();
              // this.ShowHideHAwb = this.GPdetailsNew[j]['IHM_HAWBNo_C'];
              if (this.GPdetails[0].hasOwnProperty('IHM_HAWBNo_C')) { //new
                this.habboNo = this.GPdetails[0]['IHM_HAWBNo_C'].toString();
                this.ShowHideHAwb = this.GPdetails[0]['IHM_HAWBNo_C'];
              } //new if ends
              if (this.habboNo == '') {
                this.Direct = 'Direct';
              }
            // }

          }
        } else {
          this.showDiv = false;
          this.global.showAlert(response['Root']['Output']);

        }
      } else {
        this.global.showAlert("GP Number is not generated.");
        this.clearInputs();
      }
    }, (error) => {
      console.log(error);
    });
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
    this._allPrams.pi_chrSearchParam = 'G';
    this._allPrams.pi_strGPNo = this.GPPrefix + this.GPOTP;// this.GPNumber;
    this._allPrams.pi_strMAWBNo = '';
    this._allPrams.pi_strHAWBNo = '';
    this._allPrams.pi_strUserName = this._strUserName;
    this.searchByOTP = true;
    this.searchByMAWB = false;
    this.getTSP_Details();


  }


  getTSP_Details() {

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetImpGPDetailsForDelivery_HHT_GP, this._allPrams).then((response) => {
      console.log("Response : ", response);
      if (response != null && response != "") {

        if (response.hasOwnProperty('NewDataSet')) {
          this.showDiv = true;
          this.GPdetailsNew = response['NewDataSet']['Table'];

          console.log('data to test------:', this.GPdetailsNew);
          this.GPdetails = [];
          this.GPdetails.push(this.GPdetailsNew[0]);

          this.GpStat = this.GPdetails[0]['GPDeliveryStatus'].toString();
          console.log('end moment requirement: ', this.GpStat);


          // this.habboNo = this.GPdetails[0]['IHM_HAWBNo_C'].toString();
          // this.ShowHideHAwb = this.GPdetails[0]['IHM_HAWBNo_C'];
          if (this.GPdetails[0].hasOwnProperty('IHM_HAWBNo_C')) { //new
            this.habboNo = this.GPdetails[0]['IHM_HAWBNo_C'].toString();
            this.ShowHideHAwb = this.GPdetails[0]['IHM_HAWBNo_C'];
          } //new if ends
          
          if (this.habboNo == '') {
            this.Direct = 'Direct';
          }
        } else {
          this.showDiv = false;
          this.global.showAlert(response['Root']['Output']);

        }
      } else {
        this.global.showAlert("OTP is invalid.");
        this.clearInputs();
      }
      // console.log("Response : ", response);
      // if (response != null && response != "") {

      //   if (response.hasOwnProperty('NewDataSet')) {


      //     // if (this.checkProperty(this.GPdetails[0], 'IHM_HAWBNo_C')) {
      //     //   this._HAWBNo = this.GPdetails[0]['IHM_HAWBNo_C'].toString();
      //     // }
      //     // this._MAWBNo = this.GPdetails[0]['IHM_MAWBNo_C'].toString();

      //   } else {
      //     this.showDiv = false;
      //     //  this.global.showAlert(response['Root']['Output']);
      //     // this.errorMsg = response['Root']['Output'].toString();
      //     //  this.successMsg = response['Root']['Output'];
      //     //  this.showConfirmForVTCancel();
      //   }

      // } else {
      //   this.global.showAlert("OTP is invalid.");
      // }
    }, (error) => {
      console.log(error);
    });
  }

}
