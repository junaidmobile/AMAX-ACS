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
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import moment from 'moment';
//export class TSPSerachClass { pi_chrSearchParam: any; pi_strTSPNo: any; pi_strMAWBNo: any; pi_strHAWBNo: any; po_strMessage: any; po_chrAlert: any }
export class GPerachClass { pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }

@Component({
  selector: 'TSP-Search',
  templateUrl: 'TSP-Search.html'
})
export class TSPSearch implements OnInit {

  appBuildConfig: any;
  title: String;
  Prefix: any = '';
  TSPNumber: any = '';
  MAWBNo: any = '';
  _allPrams: GPerachClass
  _strUserName: any;
  showDiv: boolean;
  tspdetails: any;
  TSPPaidAmount: any;
  tspdetails_set: any;
  @ViewChild('PrefixValue') PrefixInput;
  @ViewChild('MAWBNoValue') myInput;
  @ViewChild('OTPValue') OTPInput;
  TSPPrefix: any = '';
  TSPOTP: any = '';
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private barcodeScanner: BarcodeScanner) {

    this._allPrams = new GPerachClass()
    this.appBuildConfig = this.global.appBuildConfig;

    this.title = "Search Import TSP (BC)";
  }
  ngOnInit() {

    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    this.TSPPrefix = 'I' + this.getCurrentTime();
  }

  getCurrentTime() {
    return moment().format('YYMMDD');
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.OTPInput.setFocus();
    }, 800)
  }

  ionViewDidEnter(){
    setTimeout(() => {
      this.OTPInput.setFocus();
    }, 800)
  }

  ionViewDidLeave(){
   this.clearInputs();
  }

  GetTSPDetail() {

    // if (this.TSPNumber == '') {
    //   this.global.showAlert("Please enter TSP Number.");
    //   return;
    // }
    if (this.TSPPrefix == '') {
      this.global.showAlert("Please enter GP Prefix.");
      return;
    }
    if (this.TSPOTP == '') {
      this.global.showAlert("Please enter OTP.");
      return;
    }
    this._allPrams.pi_chrSearchParam = 'T';
    this._allPrams.pi_strTSPNo = this.TSPPrefix + this.TSPOTP;
    this._allPrams.pi_strMAWBNo = '';
    this._allPrams.pi_strHAWBNo = '';
    this._allPrams.pi_strUserName = this._strUserName;
    this.getTSP_Details();
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

  getTSP_MAWB_Details() {
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

        this.tspdetails = response['NewDataSet']['Table'];
        console.log('test1111----: ', this.tspdetails);
        // if (this.checkProperty(this.tspdetails[0], 'HAWBNo')) {
        if (this.tspdetails[0]['HAWBNo'] == "") {
          localStorage.setItem('HAWBId', this.tspdetails[0]['HAWBId']);
          localStorage.setItem('MAWBNo', this.tspdetails[0]['MAWBNo']);
          localStorage.setItem('GPStatus', this.tspdetails[0]['GPStatus']);
          this.clearInputs();
          localStorage.setItem('flag', 'M');
          this.global.routePage(TSPQRCode);
        } if(this.tspdetails[0]['TSPStatus'] == "0"){
          // this.global.showAlert('Details cannot be displayed. TSP has not been generated.');
          this.TSPnotPaidAlert();
        }
        
        else {
          this.showDiv = true;
        }

        //  }

      } else {
        this.global.showAlert("MAWB Number is Invalid.");
        this.clearInputs();
      }
    }, (error) => {

      console.log(error);
    });
  }

  getTSP_Details() {
    localStorage.removeItem('TSPNo');
    localStorage.removeItem('GrWt');
    localStorage.removeItem('ChWt');
    localStorage.removeItem('Pieces');
    localStorage.removeItem('GPStatus');
    localStorage.removeItem('HAWBId');
    localStorage.removeItem('MAWBNo');
    localStorage.removeItem('HAWBNo');
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetTSPDetails_HHT_for_AWBTSP, this._allPrams).then((response) => {
      // console.log("Response : ", response);
      if (response != null && response != "") {
        //  this.showDiv = true;

        if (response.hasOwnProperty('NewDataSet')) {
          this.tspdetails = response['NewDataSet']['Table1'];
          this.tspdetails_set = response['NewDataSet']['Table'];
          console.log('-----TSPDETAILS----', this.tspdetails);
          console.log('-----TSPDETAILS_SET----', this.tspdetails_set);
          //this.TSPPaidAmount = this.tspdetails[0]['RR_PayableAmount'][0];
          if (this.TSPPaidAmount != '') {

            localStorage.setItem('MAWBNo', this.tspdetails_set[0]['MAWBNo'][0]);
            if (this.checkProperty(this.tspdetails_set[0], 'HAWBNo')) {
              localStorage.setItem('HAWBNo', this.tspdetails_set[0]['HAWBNo'][0]);
            }
            // if(this.tspdetails_set[0]['TSPNo'] != 'undefined' ){
            //   localStorage.setItem('TSPNo', this.tspdetails_set[0]['TSPNo'][0]);
            // }
            // if( 'TSPNo' in this.tspdetails_set[0] ){
            //   localStorage.setItem('TSPNo', this.tspdetails_set[0]['TSPNo'][0]);
            // }
            if (this.checkProperty(this.tspdetails_set[0], 'TSPNo')) {
              localStorage.setItem('TSPNo', this.tspdetails_set[0]['TSPNo'][0]);
            } 
            // from above line of codes line 172 was commented on 02/02, because it was impacting
            // tsp search results
            

            if (this._allPrams.pi_chrSearchParam == 'T') {
              localStorage.setItem('flag', 'T');
            } else if (this._allPrams.pi_chrSearchParam == 'M') {

              localStorage.setItem('flag', 'M');
            }

            this.clearInputs();
            this.global.routePage(TSPQRCode);
          }
        } else {
          // this.TSPError = response['Root']['Output'].toString();
          this.clearInputs();
          this.global.showAlert(response['Root']['Output'].toString());
        }



      } else {
        //  this.global.showAlert("OTP is invalid.");
        //OTP is invalid.
        this.clearInputs();
      }
    }, (error) => {
      console.log(error);
    });
  }

  TSPnotPaidAlert() {
    let confirm = this.alertCtrl.create({
      subTitle: 'Details cannot be displayed. TSP has not been generated.', 
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }

  checkProperty(obj, key) {
    return obj.hasOwnProperty(key);
  }

  clearInputs() {
    this.TSPNumber = '';
    this.Prefix = '';
    this.MAWBNo = '';
    this.showDiv = false;
    // this.TSPPrefix = '';
    this.TSPPrefix = 'I' + this.getCurrentTime();
    this.TSPOTP = '';
  }

  // Just to animate the fab
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
  focusNextInput() {
    if (this.Prefix.length == 3) {
      this.myInput.setFocus();
    }
  }

  goTOTSPQRCode(HawbVal) {
    this._allPrams.pi_chrSearchParam = 'M';
    this._allPrams.pi_strTSPNo = '';
    this._allPrams.pi_strMAWBNo = this.Prefix + this.MAWBNo;
    this._allPrams.pi_strHAWBNo = HawbVal;
    this._allPrams.pi_strUserName = this._strUserName;

    this.getTSP_Details();
  }
  goTOTSPQRCodeMaster() {
    this._allPrams.pi_chrSearchParam = 'M';
    this._allPrams.pi_strTSPNo = '';
    this._allPrams.pi_strMAWBNo = this.Prefix + this.MAWBNo;
    this._allPrams.pi_strHAWBNo = '';
    this._allPrams.pi_strUserName = this._strUserName;

    this.getTSP_Details();
  }

  scanBarCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.TSPNumber = barcodeData.text;

      var str = this.TSPNumber;
      this.TSPPrefix = str.substring(0, 7);
      this.TSPOTP = str.substring(7, 11);

      //localStorage.setItem('TSPNumber', this.TSPNumber);
      if (barcodeData.cancelled != true) {
        this.GetTSPDetail();
      }

      // if (this.GPDeliveryStatus != "Approved") {
      //   this.global.showAlert("Delivery not Approved.");
      //   return;
      // }
      // localStorage.setItem('flag', 'T');
      // this.global.routePage(TSPQRCode);
    }).catch(err => {
      console.log('Error', err);
    });
  }

  onChange(){
    if(this.TSPOTP.length == 11){
      // var gpnum = this.TSPOTP;
      this.TSPPrefix = this.TSPOTP.substring(0,7);
      this.TSPOTP = this.TSPOTP.substring(7,11);
      this.GetTSPDetail();
    }
    console.log('test for OTP length: ',this.TSPOTP);
  }
}
