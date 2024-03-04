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
import moment from 'moment';
import { TSPCharges } from './TSP_Procced';
import { TSPCreate } from './TPS-Create';
//export class TSPSerachClass { pi_chrSearchParam: any; pi_strTSPNo: any; pi_strMAWBNo: any; pi_strHAWBNo: any; po_strMessage: any; po_chrAlert: any }
export class TSPSerachClass {
  pi_strMAWBNo: any;
  pi_strUserName: any; po_strMessage: any;
  pi_chrSearchParam: any; pi_strGPNo: any; pi_strHAWBNo: any;
}

export class calculation {
  pi_strHAWBNo: any;
  pi_strMAWBNo: any;
  pi_strReceiptType: any;
  pi_decExamPercentage: any;
  pi_dtReceiptDate: any;
  pi_chrCustomClrnce: any;
  pi_strServiceType: any;
  pi_blnRMS: any;
  strModule: any;

}
export class ddlDerviceType {
  strModule: any;
}

@Component({
  selector: 'TSP-HAWB-Detail',
  templateUrl: 'TSP-HAWB-Detail.html'
})
export class TSPHAWBDetail implements OnInit {
  scanData: {};
  options: BarcodeScannerOptions;
  appBuildConfig: any;
  title: String;

  GPNumber: any = '';
  MAWBNo: any = '';
  _allPrams: TSPSerachClass;

  _strUserName: any;
  showDiv: boolean;
  GPdetails: any;
  TSPPaidAmount: any;
  tspdetails_set: any;
  CardexNumber: any;
  NoP: any;
  NoPdis: any;
  chanumber: any;
  Remark: any = '';
  CHAName: any;
  OCNumber: any;
  term: boolean = false;
  @ViewChild('CardexVal') cardex;
  @ViewChild('NoPVal') NopInput;
  HAWBNo: any = '';
  GatepassNo: any;
  DASuccess: any;
  successMsg: any;
  GPDeliveryStatus: any;
  HAWBId: string;
  calExamPieces: any;
  ServiceType: any;
  _ServiceType: any;
  _ExamPercentage: number;
  GPStatus: any;

  currentDate: string;
  allXLforChar: string;
  ChWt: any;
  GrWt: any;
  ConsigneeName: any;
  Pieces: any;
  PaymentType: any;
  TSPSuccess: any;
  PassWord: any;
  OOCStatus: string;
  TSPNoMsg: string;
  private _pi_strPDActNo: any;
  TSPCalculated: any = '';
  ServiceTaxCalculated: any = '';
  PayableAmount: any = '';
  PureAgentStatus: any;
  ConsigneeGSTNo: any = '';
  IsConsignee: boolean = false;
  showCon: boolean;
  calClass: calculation;
  calculatedData: any;
  calculatedDataTb1: any;
  _ddlDerviceType: ddlDerviceType;
  ExamPieces: any;
  _pi_decExamPercentage: any;
  temp: any;
  ExamPerZero: any = '';

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private barcodeScanner: BarcodeScanner) {
    this._allPrams = new TSPSerachClass();

    this.appBuildConfig = this.global.appBuildConfig;

    this.options = { prompt: 'Scan the Barcode to Enter', resultDisplayDuration: 0 };

    this.HAWBId = localStorage.getItem('HAWBId');
    this.MAWBNo = localStorage.getItem('MAWBNo');
    this.HAWBNo = localStorage.getItem('HAWBNo');

    this.currentDate = this.getCurrentTime();

    if (this.HAWBNo == null || this.HAWBNo == "") {
      this.HAWBNo = ""
      this.title = "AWB Details";
    } else {
      this.title = "HAWB Details";
    }
    this._ddlDerviceType = new ddlDerviceType();
    this.calClass = new calculation();

  }
  // ionViewDidLoad() {
  //   setTimeout(() => {
  //     this.cweight.setFocus();
  //   }, 800)
  // }
  ngOnInit() {

    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    this.GetServicetype_HHT_dropDown();


  }

  getCurrentTime() {
    return moment().format('DD MMM YYYY HH:mm:ss');
  }

  GetServicetype_HHT_dropDown() {
    this._ddlDerviceType.strModule = "I";
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetServicetype_HHT_dropDown, this._ddlDerviceType).then((response) => {
      if (response != null && response != "") {
        this.ServiceType = response['NewDataSet']['Table'];
        this._ServiceType = this.ServiceType[0]['ServiceCode'].toString();
        this.ExamPiecesPercentage();


      } else {
        // this.global.showAlert("Record not found.");
      }
    }, (error) => {
      console.log(error);
    });
  }

  ExamPiecesPercentage() {
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.ExamPiecesPercentage).then((response) => {
      if (response != null && response != "") {
        this.ExamPieces = response['Root']['Output'].toString();
        this._ExamPercentage = this.ExamPieces;
        this.IMPCalculateTSP_HHT();

      } else {
        // this.global.showAlert("TSP number is invalid.");
      }
    }, (error) => {
      console.log(error);
    });
  }

  onServiceTypeChange(event) {
    this._ServiceType = event;
    // this.isInputDisabled();
  }


  IMPCalculateTSP_HHT() {

    this.calClass.pi_strMAWBNo = this.MAWBNo;
    if (this.HAWBNo == null) {
      this.calClass.pi_strHAWBNo = '';
    } else {
      this.calClass.pi_strHAWBNo = this.HAWBNo;
    }

    this.calClass.pi_strReceiptType = 'IMPTSP';
    this.calClass.pi_dtReceiptDate = this.currentDate;
    // if (this.OOCStatus == 'Pending') {
    //   this.calClass.pi_decExamPercentage = 0;//this._ExamPercentage;
    // } else {
    //   this.calClass.pi_decExamPercentage = this._ExamPercentage;
    // }

    if (this.ExamPerZero == '') {
      this.calClass.pi_decExamPercentage = '0';
    } else {
      this.calClass.pi_decExamPercentage = this.ExamPerZero;
    }

    this.calClass.pi_chrCustomClrnce = 'C';
    this.calClass.pi_strServiceType = this._ServiceType;
    this.calClass.pi_blnRMS = 'false';

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.IMPCalculateTSP_HHT_Cal, this.calClass).then((response) => {
      if (response != null && response != "") {
        console.log('My data ==>' + response);

        if (response.hasOwnProperty('NewDataSet')) {
          this.showDiv = true;
          this.calculatedData = response['NewDataSet']['Table'];
          this.calculatedDataTb1 = response['NewDataSet']['Table1'];

          this.temp = this.calculatedData[0]['Pieces'];

          //this._pi_decExamPercentage = Math.round(this.temp * this.ExamPieces / 100.0);

          this._pi_decExamPercentage = Math.ceil(this.temp * this.ExamPerZero / 100.0);
          // this._pi_strTSPRegisterXML = '<TSP>' + this.allXLforChar + '</TSP>';
          // // this._pi_blnIsRMS = 'false';
          // this._pi_strServiceType = this._ServiceType;

          this.ChWt = this.calculatedData[0]['ChWt'].toString();
          this.GrWt = this.calculatedData[0]['GrWt'].toString();
          this.ConsigneeName = this.calculatedData[0]['ConsigneeName'].toString();
          this.Pieces = this.calculatedData[0]['Pieces'].toString();

        } else {
          debugger
          this.showDiv = false;
          this.TSPNoMsg = response['Root']['Output'];
          // this.global.showAlert(response['Root']['Output']);
          this.showConfirmForError();

        }

      } else {
        this.global.showAlert("Record not found.");
      }
    }, (error) => {
      console.log(error);
    });
  }


  showConfirmForError() {
    let confirm = this.alertCtrl.create({
      title: this.TSPNoMsg,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // this.global.routePage(TSPCreate);
            // this.navCtrl.remove(this.navCtrl.getActive().index - 1, 2); //added by Himesh on 05/11/2020
            this.navCtrl.pop(); //added by Himesh on 19/11/2020
          }
        }
      ]
    });
    confirm.present();
  }


  calculateExampieces() {


    if (this.ExamPerZero > 100) {
      this.ExamPerZero = '';
      this.global.showAlert("% of Examination cannot be greater than 100%.");
      return;
    }


    this._pi_decExamPercentage = Math.ceil(this.calculatedData[0]['Pieces'] * this.ExamPerZero / 100.0);

    console.log('lets test for pieces******', this._pi_decExamPercentage);
  }

  navToTSPPay() {
    if (this.ChWt == '') {
      this.global.showAlert("Please enter chargeable weight.");
      return;
    }

    // if (this.ExamPerZero == '') {
    //   // this.global.showAlert("Please enter % of Examination.");
    //   // return;
    //   localStorage.setItem('ExamPieces', '0');
    // } else {
    //   localStorage.setItem('ExamPieces', this.ExamPerZero);
    // }

    console.log('test pieces*******: ', this.ExamPerZero);
    //added by himesh on 24/03 for TSP showstopper
    // if (this.ExamPerZero == '') {
    //   // this.global.showAlert("Please enter % of Examination.");
    //   // return;
    //   localStorage.setItem('ExamPieces', '0');
    //   localStorage.setItem('decExamPer', '0'); //new on 20/04
    // } else {
    //   localStorage.setItem('ExamPieces', this._pi_decExamPercentage);
    //   localStorage.setItem('decExamPer', this.ExamPerZero);
    // } // this BLOCK was working fine !!!!

    // line 319-329 is new for RMS/Non-RMS issue
    //added by himesh on 24/03 for TSP showstopper
    if (this.ExamPerZero == '') {
      // this.global.showAlert("Please enter % of Examination.");
      // return;
      localStorage.setItem('ExamPieces', '0');
      localStorage.setItem('decExamPer', '0'); //new on 20/04
    } else if(this.ExamPerZero != '' && this.global.checkRMS == false) {
      localStorage.setItem('ExamPieces', this._pi_decExamPercentage);
      localStorage.setItem('decExamPer', this.ExamPerZero);
    }
    else if(this.ExamPerZero != '' && this.global.checkRMS == true) {
      localStorage.setItem('ExamPieces', '0');
      localStorage.setItem('decExamPer', '0');
    }



    localStorage.setItem('ChWt', this.ChWt)
    //localStorage.setItem('OOCStatus', this.ExPaer)
    this.global.routePage(TSPCharges);
  }
  // onlyNumber() {
  //   if (isNaN(this.NoP)) {
  //     this.NoP = '';
  //     this.global.showAlert("Please enter only number in % for Examination.");
  //     return false;
  //   }
  //   return true;
  // }

  onlyNumberChWt() {

    if (isNaN(this.ChWt)) {
      this.ChWt = '';
      this.global.showAlert("Please enter only number in Chargeable Wt.");
      return false;
    }
    return true;
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
