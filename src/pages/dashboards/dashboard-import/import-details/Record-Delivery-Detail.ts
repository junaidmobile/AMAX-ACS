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
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { RecordDelivery } from './Record-Delivery';
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
  selector: 'Record-Delivery-Detail',
  templateUrl: 'Record-Delivery-Detail.html'
})
export class RecordDeliveryDetail implements OnInit {
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
  NoPdis: any;
  IGM: any;
  chanumber: any;
  Remark: any = '';
  CHAName: any;
  OCNumber: any;
  term: boolean = false;
  @ViewChild('CardexVal') cardex;

  HAWBNo: any = '';
  GatepassNo: any;
  DASuccess: any;
  successMsg: any;
  GPDeliveryStatus: any;
  VTNo: any;
  VehicleNo: any;

  GPdetails2: any;
  NopDelivered: any;

  pi_intPkgs = 0;
  pi_chWt = 0;
  pi_grWt = 0;

  grossWt;
  ChrgblWt;

  st_grossWt;
  st_chargbleWt;

  mn_grossWt;
  mn_chargbleWt;

  myFilesXML: any = [];
  allValues: string = '<Root>';

  GPDate;
  newNop

  @ViewChild('NoPVal') NopInput;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private barcodeScanner: BarcodeScanner) {
    this._allPrams = new TSPSerachClass();
    this._postParm = new postParm();
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Record Delivery Details";
    this.options = { prompt: 'Scan the Barcode to Enter', resultDisplayDuration: 0 };
    this.MAWBNo = localStorage.getItem('MAWBNo');
    this.HAWBNo = localStorage.getItem('HAWBNo');
    this.GPNumber = localStorage.getItem('GPNumber');

    if (this.HAWBNo == null) {
      this.HAWBNo = "";
    }

  }
  // ionViewDidLoad() {
  //   setTimeout(() => {
  //     this.NopInput.setFocus();
  //   }, 800)
  // }
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


  countChange(event) {

    if (isNaN(this.NoP)) {
      this.NoP = '';
      this.global.showAlert("Please enter only number in NoP.");
      return false;
    }
    if (this.NoP.match(' ')) {
      this.NoP = '';
      this.global.showAlert('Spaces not allowed in NoP.');
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

    // return textarea.value.match(/^\d+(\.\d+)?$/);
    //return true;

    // var pattern = new RegExp("^[0-9]"); //unacceptable chars
    // if (pattern.test(this.NoP)) {
    //   this.NoP = '';
    //   this.global.showAlert("Please enter only number in NoP.");
    //   return false;
    // }
    // return true; //good user input

  }

  getTSP_Details() {

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetImpGPDetailsForDelivery_HHT_GP, this._allPrams).then((response) => {
      // console.log("Response : ", response);
      if (response != null && response != "") {
        if (response != null && response != "") {
          console.log( response)
          if (response.hasOwnProperty('NewDataSet')) {
            this.showDiv = true;
            this.GPdetails = response['NewDataSet']['Table'];

            console.log('check for data here also: ', this.GPdetails);

            // if (response.hasOwnProperty('NewDataSet')['Table1']){

            
            this.GPdetails2 = response['NewDataSet']['Table1'];
            console.log('GPdetails 2 here: ', this.GPdetails2);
            // }
            //new for as on 01/03
            if(this.GPdetails2 != undefined){
            for(let data of this.GPdetails2){
              this.pi_intPkgs =  parseInt(data.GPDelPieces) + this.pi_intPkgs ;
              this.pi_chWt =  parseFloat(data.GD_ChrgeableWt_D) + this.pi_chWt;
              this.pi_grWt =  parseFloat(data.GD_GrossWt_D) + this.pi_grWt ;
            }
          }

            console.log('check for pkgs: ', this.pi_intPkgs);
            console.log('check for chWt: ', this.pi_chWt);
            console.log('check for grWt: ', this.pi_grWt);

            for (var j = 0; j < this.GPdetails.length; j++) {
              if (this.GPdetails[j]['GPDeliveryStatus'] == 'Verified' || this.GPdetails[j]['GPDeliveryStatus'] == 'Part Delivered') {
                //above or condition added on 17/03 by Himesh
                this.NoPdis = this.GPdetails[j]['GD_Packages_I'].toString();

                this.IGM = this.GPdetails[j]['IIM_IGMNo_I'].toString(); //new on 11/05 for displaying IGM

                if(this.GPdetails[j].hasOwnProperty('GPDelPieces')){
                this.NopDelivered = this.GPdetails[j]['GPDelPieces'].toString();
                }
                this.chanumber = this.GPdetails[j]['MO_CHANumber_C'];
                this.GatepassNo = this.GPdetails[j]['GD_GatePassNo_C'].toString();
                this.OCNumber = this.GPdetails[j]['IHM_OCNUMBER_I'].toString();
                this.CHAName = this.GPdetails[j]['MO_OrgName_C'].toString();

                //new on 01/03
                this.GPDate = this.GPdetails[j]['GD_GatePassDate_Dt'].toString();

                this.st_grossWt = this.GPdetails[j]['GD_GrossWt_D'].toString();
                this.st_chargbleWt = this.GPdetails[j]['GD_ChargeableWt_D'].toString();

                if(this.GPdetails[j].hasOwnProperty('ITD_TOKENNO_C')) { //new
                  this.VTNo = this.GPdetails[j]['ITD_TOKENNO_C'].toString();
                  console.log('check token here: ', this.VTNo);
                } //new if ends
                
                if(this.GPdetails[j].hasOwnProperty('ITD_VEHICLENO_C')) { //new
                  this.VehicleNo = this.GPdetails[j]['ITD_VEHICLENO_C'].toString();
                  console.log('check Vehicle no here: ', this.VehicleNo);
                } // new if ends
                

                this.NoP = this.GPdetails[j]['GD_Packages_I'].toString();

                if(this.GPdetails2 != undefined){ //if is new on 02/03
                this.NoP = this.NoP - this.NopDelivered; //new on 26/02
                }
                
                if(this.GPdetails2 == undefined){
                this.NoP = this.NoP - 0; //new on 02/03
                }


                if (this.GPdetails[j].hasOwnProperty('CardexNo')) {
                  this.CardexNumber = this.GPdetails[j]['CardexNo'].toString();
                }

                if (this.GPdetails[j].hasOwnProperty('GPDeliveryStatus')) {
                  this.GPDeliveryStatus = this.GPdetails[j]['GPDeliveryStatus'].toString();

                  if (this.GPDeliveryStatus == '' || this.GPDeliveryStatus == 'Accepted') {
                    this.showDiv = false;
                    this.global.showAlert("Delivery cannot be Verified. Shipment delivery has not been Approve.");
                    return;
                  }
                }

                this.MAWBNo = this.GPdetails[j]['IHM_MAWBNo_C'].toString();


                if (this.GPdetails[j].hasOwnProperty('IHM_HAWBNo_C')) {
                  this.HAWBNo = this.GPdetails[j]['IHM_HAWBNo_C'].toString();
                }
              }
            }
            // this.NoPdis = this.GPdetails[0]['GD_Packages_I'].toString();
            // this.chanumber = this.GPdetails[0]['MO_CHANumber_C'];
            // this.GatepassNo = this.GPdetails[0]['GD_GatePassNo_C'].toString();
            // this.OCNumber = this.GPdetails[0]['IHM_OCNUMBER_I'].toString();
            // this.CHAName = this.GPdetails[0]['MO_OrgName_C'].toString();

            // this.VTNo = this.GPdetails[0]['ITD_TOKENNO_C'].toString();
            // this.VehicleNo = this.GPdetails[0]['ITD_VEHICLENO_C'].toString();

            // this.NoP = this.GPdetails[0]['GD_Packages_I'].toString();


            // if (this.GPdetails[0].hasOwnProperty('CardexNo')) {
            //   this.CardexNumber = this.GPdetails[0]['CardexNo'].toString();
            // }

            // if (this.GPdetails[0].hasOwnProperty('GPDeliveryStatus')) {
            //   this.GPDeliveryStatus = this.GPdetails[0]['GPDeliveryStatus'].toString();

            //   if (this.GPDeliveryStatus == '' || this.GPDeliveryStatus == 'Accepted') {
            //     this.showDiv = false;
            //     this.global.showAlert("Delivery cannot be Verified. Shipment delivery has not been Approve.");
            //     return;
            //   }
            // }

            // this.MAWBNo = this.GPdetails[0]['IHM_MAWBNo_C'].toString();


            // if (this.GPdetails[0].hasOwnProperty('IHM_HAWBNo_C')) {
            //   this.HAWBNo = this.GPdetails[0]['IHM_HAWBNo_C'].toString();
            // }


          } else {
            this.showDiv = false;
            //  this.global.showAlert(response['Root']['Output']);
            // this.errorMsg = response['Root']['Output'].toString();
            this.successMsg = response['Root']['Output'];
            this.showConfirmForVTCancel();
          }

        }

      } else {
        this.global.showAlert("OTP is invalid.");
        this.clearInputs();
      }
    }, (error) => {
      console.log(error);
    });
  }

  showConfirmForVTCancel() {
    let confirm = this.alertCtrl.create({
      title: this.successMsg,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.global.routePage(RecordDelivery);
          }
        }
      ]
    });
    confirm.present();
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
  recordDeliveryNew(){
    this.mn_grossWt = (this.pi_intPkgs + this.NoP)/(this.NoPdis)*(this.st_grossWt-this.pi_grWt);
    this.mn_chargbleWt = (this.pi_intPkgs + this.NoP)/(this.NoPdis)*(this.st_chargbleWt-this.pi_chWt);
  }
  ImpRecordDelivery_HHT() {

    let one; let two;
    let three;
    one = parseInt(this.NoPdis);
    two = parseInt(this.NoP);
    three = this.NoPdis - this.NopDelivered //new
    if (three < two) { // it was one < two
      this.global.showAlert("Transaction failed. Number of Pieces received are greater than the total pieces.");
      return;
    }
    if (this.NoP == '') {
      this.global.showAlert("Please enter NoP.");
      return false;
    }
    let a,b,c;
    let d,e,f;
    a = this.pi_intPkgs + parseInt(this.NoP);
    b = a/this.NoPdis;
    c = this.st_grossWt - this.pi_grWt;
    this.mn_grossWt = b * c;
    
    // this.mn_grossWt = ((this.pi_intPkgs + this.NoP)/((this.NoPdis))*(this.st_grossWt-this.pi_grWt));
    // this.mn_chargbleWt = ((this.pi_intPkgs + this.NoP)/((this.NoPdis))*(this.st_chargbleWt-this.pi_chWt));

    d = this.pi_intPkgs + parseInt(this.NoP);
    e = d/this.NoPdis;
    f = this.st_chargbleWt - this.pi_chWt;
    this.mn_chargbleWt = e * f;

    //for addition of existing data
    if(this.GPdetails2 != undefined){ //new if as on 02/03
    for(let d of this.GPdetails2){
      this.allValues += '<GPDetails GPNo="' + this.GatepassNo + '" GPDate="' + this.GPDate + '" Packages="' + d.GPDelPieces  + '" GrossWt="' + d.GD_GrossWt_D + '" ChrgblWt="' + d.GD_ChrgeableWt_D + '" Remarks="' + d.GD_Remarks_C + '" DlvDate="' + d.GPDelDateTime + '" DataId="' + d.GD_RowId_I + '" />'; 
      
    }
    }

    var date = new Date();

    this.allValues += '<GPDetails GPNo="' + this.GatepassNo + '" GPDate="' + this.GPDate + '" Packages="' + this.NoP  + '" GrossWt="' + this.mn_grossWt + '" ChrgblWt="' + this.mn_chargbleWt + '" Remarks="' + this.Remark + '" DlvDate="' + new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString() + '" DataId="' + 0 + '" />';

    this._postParm.pi_strDeliveryOpeartion = 'FGPDBYSSM';
    this._postParm.pi_strGatePassNo = this.GatepassNo;
    this._postParm.pi_strUserName = this._strUserName;
    this._postParm.pi_strCardexNo = this.CardexNumber
    // this._postParm.pi_strCardexNo = '123123' //ew
    this._postParm.pi_intPieces = this.NoP;
    this._postParm.pi_strRemarks = this.Remark;
    this.allValues += '</Root>';
    this._postParm.pi_strGPXML = this.allValues; //new
    this._postParm.pi_strCustomsOfficerName = this.global.get('officer'); //new CR
    this._postParm.pi_strCustomsOfficerDesignation = this.global.get('designation'); //new CR
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.ImpRecordDelivery_HHT_save, this._postParm).then((response) => {
      // console.log("Response : ", response);
      console.log("Check for false Response : ", response);
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
            // this.global.routePage(RecordDelivery);
            this.navCtrl.pop();
            // this.navCtrl.remove(this.navCtrl.getActive().index - 0, 1); //added by Himesh on 04/12/2020
          }
        }
      ]
    });
    confirm.present();
  }

  isInputValid(): boolean {
    if (this.NoP != undefined)
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
    console.log('test for MAWB: ', this.MAWBNo);
    console.log('test for hAWB: ', this.HAWBNo);
    console.log('test for type: ', this.VTNo);
    console.log('test for vehicle number: ', this.VehicleNo);
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
