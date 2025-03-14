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
  pi_strRemarks: any;
  pi_strGPXML: any;
  pi_strCustomsOfficerName: string = '';
  pi_strCustomsOfficerDesignation: string = '';

}

@Component({
  selector: 'Delivery-Submit',
  templateUrl: 'Delivery-Submit.html'
})
export class DeliverySubmit implements OnInit {
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
  NoP: any = '';
  NoPdis: any = '';
  chanumber: any;
  term: boolean = false;
  @ViewChild('CardexVal') cardex;
  @ViewChild('NoPVal') NopInput;
  HAWBNo: any = '';
  GatepassNo: any;
  DASuccess: any;
  GPDeliveryStatus: any;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private barcodeScanner: BarcodeScanner) {
    this._allPrams = new TSPSerachClass();
    this._postParm = new postParm();
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Delivery Acceptance.. ";
    this.options = { prompt: 'Scan the Barcode to Enter', resultDisplayDuration: 0 };

    this.MAWBNo = localStorage.getItem('MAWBNo');
    this.HAWBNo = localStorage.getItem('HAWBNo');
    this.GPNumber = localStorage.getItem('GPNumber');

    if (this.HAWBNo == null) {
      this.HAWBNo = "HAWB";
    }

  }
  ionViewDidLoad() {
    console.log('*****hawb*****', this.HAWBNo);
    setTimeout(() => {
      this.cardex.setFocus();
    }, 800)
  }

  ngOnInit() {

    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    this.GetTSPDetail();
    //  if (this.flag == 'T') {
    //   this.ddlTSP = false;
    //   this.lblTSP = true;
    //   this.TSPNumber = localStorage.getItem('TSPNo');
    // } else if (this.flag == 'M') {
    //   this.getTSP_Details();
    //   this.ddlTSP = true;
    //   this.lblTSP = false ;
    // }

  }

  special_char(event) {


    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.\?]/); //unacceptable chars
    if (pattern.test(this.CardexNumber)) {
      this.CardexNumber = '';
      this.global.showAlert("Please enter only standard alphanumerics in Cardex Number.");
      return false;
    }
    if (this.CardexNumber.match(' ')) {
      this.CardexNumber = '';
      this.global.showAlert('Spaces not allowed in Cardex Number.');
      return false;
    }
    // return true; //good user input

    // var k;
    // document.all ? k = event.keyCode : k = event.which;
    // return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));

    // var regex = new RegExp("^[a-zA-Z0-9]+$");
    // var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    // if (!regex.test(key)) {
    //   event.preventDefault();
    //   return false;
    // }

  }

  countChange(event) {

    // var pattern = new RegExp(/^[0-9]+$/); //unacceptable chars
    // var pattern = /^[0-9]+$/;
    // if (pattern.test(this.NoP)) {
    //   this.NoP = '';
    //   this.global.showAlert("Please enter only number in NoP.");
    //   return false;
    // }
    // return true; //good user input

    // this.NoP += event.target.value.replace(/[^0-9]*/g, '');
    // this.NoP += event.target.value.replace(/[^0-9]*/g, '');

    // if (Number.isInteger(this.NoP)) {

    // } else {
    //   this.NoP = '';
    //   this.global.showAlert("Please enter only number in NoP.");
    // }

    if (isNaN(this.NoP)) {
      this.NoP = '';
      this.global.showAlert("Please enter only number in NoP.");
      return false;
    }
    if (this.NoP == 0) {
      this.NoP = '';
      this.global.showAlert("NoP should be greater than zero.");
      return;
    }

    var pattern = new RegExp(/\./g); //unacceptable chars
    if (pattern.test(this.NoP)) {
      this.NoP = '';
      this.global.showAlert("Dot not allowed in NoP.");
      return false;
    }
    //return true;

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
      this._allPrams.pi_strUserName = this._strUserName;
      if (this.MAWBNo == null) {
        this.MAWBNo = '';
      } else {
        this._allPrams.pi_strHAWBNo = this.HAWBNo;
      }

      this.getTSP_Details();
    }

  }


  getTSP_Details() {

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetImpGPDetailsForDelivery_HHT_GP, this._allPrams).then((response) => {
      console.log("Check Response : ", response);
      if (response != null && response != "") {

        if (response.hasOwnProperty('NewDataSet')) {
          // Approved
          // GPDeliveryStatus
          this.showDiv = true;
          this.GPdetails = response['NewDataSet']['Table'];

          console.log('check details: ',this.GPdetails);

          for (var j = 0; j < this.GPdetails.length; j++) {
            if (this.GPdetails[j]['GPDeliveryStatus'] == 'Approved') {
              this.NoPdis = this.GPdetails[j]['GD_Packages_I'].toString();
              this.NoP = this.GPdetails[j]['GD_Packages_I'].toString();
              this.chanumber = this.GPdetails[j]['MO_CHANumber_C'];

              // this.NoP = this.GPdetails[0]['GD_Packages_I'].toString();
              this.GatepassNo = this.GPdetails[j]['GD_GatePassNo_C'].toString();

              // if (this.checkProperty(this.GPdetails[j], 'GPDeliveryStatus')) {
              //   this.GPDeliveryStatus = this.GPdetails[j]['GPDeliveryStatus'].toString();
              //   if (this.GPDeliveryStatus == '' || this.GPDeliveryStatus == 'Accepted') {
              //     this.showDiv = false;
              //     this.global.showAlert("Shipment delivery cannot be accepted. Shipment is not approved.");
              //     return;
              //   }
              // }
            }


          }




        } else {
          this.showDiv = false;
          this.global.showAlert(response['Root']['Output']);

        }
      } else {
        this.global.showAlert("OTP is invalid");
        this.clearInputs();
      }
    }, (error) => {
      console.log(error);
    });
  }

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

    let one; let two;
    one = parseInt(this.NoPdis);
    two = parseInt(this.NoP);
    if (one < two) {
      this.global.showAlert("Transaction failed. Number of Pieces received are greater than the total pieces.");
      return;
    }



    this._postParm.pi_strDeliveryOpeartion = 'AGPDBYCHA';
    this._postParm.pi_strGatePassNo = this.GatepassNo;
    this._postParm.pi_strUserName = this._strUserName;
    this._postParm.pi_strCardexNo = this.CardexNumber
    this._postParm.pi_intPieces = this.NoP;
    this._postParm.pi_strRemarks = '';
    this._postParm.pi_strGPXML = ''; //new on 02/03
    this._postParm.pi_strCustomsOfficerName = this.global.get('officer'); //new CR
    this._postParm.pi_strCustomsOfficerDesignation = this.global.get('designation'); //new CR

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.ImpRecordDelivery_HHT_save, this._postParm).then((response) => {
      // console.log("Response : ", response);
      if (response != null && response != "") {

        this.DASuccess = response['Root']['Output'].toString();
        this.showConfirmForDA();

      } else {
        this.global.showAlert("OTP is invalid.");
        this.clearInputs();
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
            // this.global.routePage(DeliveryAcceptance);
            this.navCtrl.remove(this.navCtrl.getActive().index - 0, 1); //added by Himesh on 03/11/2020
            //changes here as on 10/02
            //changes again made from -1,2 to -0,1 on DHL requests
          }
        }
      ]
    });
    confirm.present();
  }

  isInputValid(): boolean {

    if (this.CardexNumber != undefined
      && this.NoP != undefined
      && this.CardexNumber.trim() !== '' && this.CardexNumber.length <= 10
      && this.NoP !== '' && this.term != false
    )
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
