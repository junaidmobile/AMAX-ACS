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
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DeliveryAcceptance } from './Delivery-Acceptance';
import { ApproveDelivery } from './Approve-Delivery';
import { flatten } from '@angular/compiler';
import { jsonpFactory } from '@angular/http/src/http_module';
import moment from 'moment';
//export class TSPSerachClass { pi_chrSearchParam: any; pi_strTSPNo: any; pi_strMAWBNo: any; pi_strHAWBNo: any; po_strMessage: any; po_chrAlert: any }
export class TSPSerachClass {
  pi_strMAWBNo: any;
  pi_strUserName: any; po_strMessage: any;
  pi_chrSearchParam: any; pi_strGPNo: any; pi_strHAWBNo: any;
}

export class postParm {
  pi_strDeliveryOpeartion: any;
  pi_strGatePassNo: any;
  pi_strUserName: any;
  pi_strCardexNo: any;
  pi_intPieces: any;
  pi_strRemarks: string;
  pi_strGPXML: any;
  pi_strCustomsOfficerName: string = '';
  pi_strCustomsOfficerDesignation: string = '';

}

@Component({
  selector: 'Approve-Delivery-Submit',
  templateUrl: 'Approve-Delivery-Submit.html'
})
export class ApproveDeliverySubmit implements OnInit {
  scanData: {};
  options: BarcodeScannerOptions;
  appBuildConfig: any;
  title: String;

  GPNumber: any = '';
  MAWBNo: any = '';
  _allPrams: TSPSerachClass;
  _postParm: postParm
  _strUserName: any;
  showDiv: boolean;
  GPdetails: any;
  TSPPaidAmount: any;
  tspdetails_set: any;
  CardexNumber: any;
  NoP: any;
  NoPdis: any;
  chanumber: any;
  Remark: any;
  CHAName: any;
  OCNumber: any;
  term: boolean = false;
  @ViewChild('CardexVal') cardex;
  @ViewChild('NoPVal') NopInput;
  HAWBNo: any = '';
  GatepassNo: any;
  DASuccess: any;
  _MAWBNo: any;
  _HAWBNo: any;
  successMsg: any;
  GPDeliveryStatus: any;


consigneeName : any;
boeNo : any;
boedate : any;
weightc: any;
contents : any;




  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private barcodeScanner: BarcodeScanner) {
    this._allPrams = new TSPSerachClass();
    this._postParm = new postParm();
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Custom Gate officer Verification";
    this.options = { prompt: 'Scan the Barcode to Enter', resultDisplayDuration: 0 };
    this.MAWBNo = localStorage.getItem('MAWBNo');
    this.HAWBNo = localStorage.getItem('HAWBNo');
    this.GPNumber = localStorage.getItem('GPNumber');

    if (this.HAWBNo == null) {
      this.HAWBNo = "";
    }

  }
  ngOnInit() {

    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    this.GetTSPDetail();

  }


  GetTSPDetail() {
    if (this.GPNumber != null) {
      this._allPrams.pi_chrSearchParam = 'G';
      this._allPrams.pi_strGPNo = this.GPNumber;
      this._allPrams.pi_strMAWBNo = '';
      this._allPrams.pi_strHAWBNo = '';
      this._allPrams.pi_strUserName = this._strUserName;
      this.getTSP_Details();
    } else {
      this._allPrams.pi_chrSearchParam = 'M';
      this._allPrams.pi_strGPNo = '';
      this._allPrams.pi_strMAWBNo = this.MAWBNo;
      this._allPrams.pi_strHAWBNo = this.HAWBNo;
      this._allPrams.pi_strUserName = this._strUserName;
      this.getTSP_Details();
    }

  }


  getTSP_Details() {

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetImpGPDetailsForDelivery_HHT_GP, this._allPrams).then((response) => {
      console.log("check Response for otp invalid issue : ", response);
      console.log("check gate pass number: ", this.GPNumber);
      if (response != null && response != "") {



        if (response.hasOwnProperty('NewDataSet')) {
          this.showDiv = true;
          this.GPdetails = response['NewDataSet']['Table'];
          // this.NoPdis = this.GPdetails[0]['GD_Packages_I'].toString();
          // this.chanumber = this.GPdetails[0]['MO_CHANumber_C'];
          // this.GatepassNo = this.GPdetails[0]['GD_GatePassNo_C'].toString();
          // this.OCNumber = this.GPdetails[0]['IHM_OCNUMBER_I'].toString();
          // this.CHAName = this.GPdetails[0]['MO_OrgName_C'].toString();


          // if (this.checkProperty(this.GPdetails[0], 'CardexNo')) {
          //   this.CardexNumber = this.GPdetails[0]['CardexNo'].toString();
          // }

          // if (this.checkProperty(this.GPdetails[0], 'IHM_HAWBNo_C')) {
          //   this._HAWBNo = this.GPdetails[0]['IHM_HAWBNo_C'].toString();
          // }
          // this._MAWBNo = this.GPdetails[0]['IHM_MAWBNo_C'].toString();

          // if (this.checkProperty(this.GPdetails[0], 'GPDeliveryStatus')) {
          //   this.GPDeliveryStatus = this.GPdetails[0]['GPDeliveryStatus'].toString();

          //   // if (this._HAWBNo == '') {
          //   if (this.GPDeliveryStatus == '') {
          //     this.showDiv = false;
          //     this.global.showAlert("Delivery cannot be Approved. Shipment delivery has not been Accepted.");
          //     return;
          //   }
          //   if (this.GPDeliveryStatus != 'Accepted') {
          //     this.showDiv = false;
          //     this.global.showAlert("Delivery already " + this.GPDeliveryStatus + ".");
          //     return;
          //   }
          //   //  }
          // }

          //debugger
          for (var j = 0; j < this.GPdetails.length; j++) {
            if (this.GPdetails[j]['GPDeliveryStatus'] == 'Accepted') {


              this.NoPdis = this.GPdetails[j]['GD_Packages_I'].toString();
              this.chanumber = this.GPdetails[j]['MO_CHANumber_C'];
              this.GatepassNo = this.GPdetails[j]['GD_GatePassNo_C'].toString();
              this.OCNumber = this.GPdetails[j]['IHM_OCNUMBER_I'].toString();
              this.CHAName = this.GPdetails[j]['MO_OrgName_C'].toString();

              this.consigneeName = this.GPdetails[j]['ConsigneeName'].toString();
              this.boeNo = this.GPdetails[j]['BOENo'].toString();
              var abc = this.GPdetails[j]['BOEDate'].toString();
              this.boedate = moment(abc).format('DD-MMM-YYYY HH:mm');
             // this.boedate = 
              this.contents = this.GPdetails[j]['Contents'].toString();
              this.weightc = this.GPdetails[j]['GD_GrossWt_D'].toString();

                    

              

              if (this.checkProperty(this.GPdetails[j], 'CardexNo')) {
                this.CardexNumber = this.GPdetails[j]['CardexNo'].toString();
              }

              if (this.checkProperty(this.GPdetails[j], 'IHM_HAWBNo_C')) {
                this._HAWBNo = this.GPdetails[j]['IHM_HAWBNo_C'].toString();
              }
              this._MAWBNo = this.GPdetails[j]['IHM_MAWBNo_C'].toString();

              // if (this.checkProperty(this.GPdetails[0], 'GPDeliveryStatus')) {
              //   this.GPDeliveryStatus = this.GPdetails[0]['GPDeliveryStatus'].toString();

              //   // if (this._HAWBNo == '') {
              //   if (this.GPDeliveryStatus == '') {
              //     this.showDiv = false;
              //     this.global.showAlert("Delivery cannot be Approved. Shipment delivery has not been Accepted.");
              //     return;
              //   }
              //   if (this.GPDeliveryStatus != 'Accepted') {
              //     this.showDiv = false;
              //     this.global.showAlert("Delivery already " + this.GPDeliveryStatus + ".");
              //     return;
              //   }
              //   //  }
              // }
            }
          }

        } else {
          this.showDiv = false;
          //  this.global.showAlert(response['Root']['Output']);
          // this.errorMsg = response['Root']['Output'].toString();
          this.successMsg = response['Root']['Output'];
          this.showConfirmForVTCancel();
        }

      } else {
        this.global.showAlert("OTP is invalid.");
        this.clearInputs();
      }
    }, (error) => {
      console.log(error);
    });
  }

  chkDate()
  {
    var dtgiven = this.boedate;
    console.log("dtgiven = " + dtgiven.toString());
    var boeDT = moment(dtgiven).format('DD-MMM-YYYY HH:mm');

    console.log("boeDT formatted = " + boeDT.toString());
  }

  showConfirmForVTCancel() {
    let confirm = this.alertCtrl.create({
      title: this.successMsg,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.global.routePage(ApproveDelivery);
          }
        }
      ]
    });
    confirm.present();
  }

  // refreshEvent(){
  //   this.GetTSPDetail();
  // }


  checkProperty(obj, key) {

    return obj.hasOwnProperty(key);
  }

  GetMAWBDetail() {
    // if (this.CardexNumber == '') {
    //   this.global.showAlert("Please enter Cardex Number.");
    //   return;
    // }
    // if (this.NoP == '') {
    //   this.global.showAlert("Please enter NoP.");
    //   return;
    // }
    this.ImpRecordDelivery_HHT();

  }
  ImpRecordDelivery_HHT() {
    debugger
    // let one; let two;
    // one = this.NoPdis;
    // two = this.NoP;
    // if (one >= two) {
    //   this.global.showAlert("Transaction failed. Number of Pieces received are greater than the total pieces");
    //   return;
    // }

    this._postParm.pi_strDeliveryOpeartion = 'APGPDBYCGO';
    this._postParm.pi_strGatePassNo = this.GatepassNo;
    this._postParm.pi_strUserName = this._strUserName;
    this._postParm.pi_strCardexNo = '';// this.CardexNumber
    this._postParm.pi_intPieces = this.NoPdis;
    this._postParm.pi_strRemarks = '';// this.Remark;
    this._postParm.pi_strGPXML = ''; //new on 02/03
    this._postParm.pi_strCustomsOfficerName = this.global.get('officer'); //new CR
    this._postParm.pi_strCustomsOfficerDesignation = this.global.get('designation'); //new CR
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.ImpRecordDelivery_HHT_save, this._postParm).then((response) => {
      // console.log("Response : ", response);
      if (response != null && response != "") {

        this.DASuccess = response['Root']['Output'].toString();
        this.showConfirmForDA();

      } else {
        // this.global.showAlert("Data not found.");
      }
    }, (error) => {
      console.log(error);
    });

  }

  showConfirmForDA() {
    let confirm = this.alertCtrl.create({
      title: this.DASuccess,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // this.global.routePage(ApproveDelivery);
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }

  isInputValid(): boolean {
    if (this.NoP != undefined && this.NoP.trim() !== '' && this.Remark != '' && this.Remark != undefined)
      return false;
    else
      return true;
  }


  clearInputs() {
    this.CardexNumber = '';
    this.NoP = '';
    this.term = false;

  }
  // ionViewDidLoad() {
  //   setTimeout(() => {
  //     this.cardex.setFocus();
  //   }, 800)
  // }

  // Just to animate the fab
  fabGone = false;
  ionViewWillEnter() {
    this.fabGone = false;
  }

  ionViewWillLeave() {
    this.fabGone = true;
  }
  // focusNextInput() {

  //   if (this.CardexNumber.length >= 10) {
  //     console.log(this.CardexNumber.length)
  //     this.NopInput.setFocus();
  //   }
  // }
  handleSelected($event) {

    if ($event.target.checked === true) {
      this.term = true;
    }
  }

}
