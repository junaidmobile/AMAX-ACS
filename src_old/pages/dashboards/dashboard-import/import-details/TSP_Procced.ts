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
import { TSPSearch } from './TSP-Search';
import moment from 'moment';
import { HAWBDetail } from './HAWB-Detail';
import { TSPSuccessMessage } from './TSP-Success-Message';
import { TPSMileStone } from './TPS-MileStone';
export class TSPSerachClass { pi_intHAWBRowId: any; pi_strUserName: any; }
export class calculateTSPCharge {
  pi_strReceiptType: any;
  pi_intHAWBId: any;
  pi_chrPayMode: any;
  pi_decTotalAmount: any;
  pi_decTotalTax: any;
  pi_decAdjustableAmount: any;
  pi_decWaiverAmount: any;
  pi_decWaiverTaxAmount: any;
  pi_decPayableAmount: any;
  pi_strUserName: any;
  pi_strTSPNarration: any;
  pi_chrCAVEStatus: any;
  pi_chrCustomClearance: any;
  pi_decExamPercentage: any;
  pi_intExamPieces: any;
  pi_strTSPRegisterXML: any;
  pi_strIPAdd: any;
  pi_blnIsRMS: any;
  pi_strServiceType: any;
  pi_strNotifyMobileNo: any;
  pi_strPDActNo: any;
  pi_blnPureAgent: boolean;
  pi_strConsigneeGSTNo: string;
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
export class chkPsw {
  pi_strTransactionPwd: any;
  pi_strUserName: any;
}

@Component({
  selector: 'TSP_Procced',
  templateUrl: 'TSP_Procced.html'
})

export class TSPCharges implements OnInit {
  btnStatus: boolean;
  appBuildConfig: any;
  title: String;
  _allPrams: TSPSerachClass
  _calculateTSPCharge: calculateTSPCharge;
  pCheck: chkPsw;
  _strUserName: any;
  HAWBID: any;
  TransactionPassword: any;
  _ddlDerviceType: ddlDerviceType;
  calClass: calculation;
  @ViewChild('_MobileNumber') _MobileNumber;
  @ViewChild('_OCNumber') _OCNumber;
  @ViewChild('_PartyName') _PartyName;
  calculatedData: any;
  calculatedDataTb1: any;
  XMLFomate: string;
  ExamPieces: any;
  _pi_strReceiptType: any;
  _pi_intHAWBId: any;
  _pi_chrPayMode: any;
  _pi_decTotalAmount: any;
  _pi_decTotalTax: any;
  _pi_decAdjustableAmount: any;
  _pi_decWaiverAmount: any;
  _pi_decWaiverTaxAmount: any;
  _pi_decPayableAmount: any;
  _pi_strUserName: any;
  _pi_strTSPNarration: any;
  _pi_chrCAVEStatus: any;
  _pi_chrCustomClearance: any;
  _pi_decExamPercentage: any;
  _pi_intExamPieces: any;
  _pi_strTSPRegisterXML: any;
  _pi_strIPAdd: any;
  _pi_blnIsRMS: any;
  _pi_strServiceType: any;
  MAWBNo: any;
  HAWBNo: any;
  calExamPieces: any;
  ServiceType: any;
  _ServiceType: any;
  _ExamPercentage: any = '';
  GPStatus: any;
  HAWBId: string;
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

  decExamPer;
  @ViewChild('paswordval') password;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {

    this.currentDate = this.getCurrentTime();
    this.HAWBId = localStorage.getItem('HAWBId');
    this.MAWBNo = localStorage.getItem('MAWBNo');
    this.HAWBNo = localStorage.getItem('HAWBNo');

    this.ExamPieces = localStorage.getItem('ExamPieces');
    console.log('check exam pieces: ', this.ExamPieces);
    this.ChWt = localStorage.getItem('ChWt');

    this.OOCStatus = localStorage.getItem('OOCStatus')

    this.GPStatus = localStorage.getItem('GPStatus');
    // this.XMLFomate = localStorage.getItem('pi_strIGMDetailsXML');
    this._calculateTSPCharge = new calculateTSPCharge();
    this._allPrams = new TSPSerachClass();
    this._ddlDerviceType = new ddlDerviceType();
    this.pCheck = new chkPsw();
    this.calClass = new calculation();
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "TSP Charges";
    this.PaymentType = 'Pre-Deposit';

    this._ExamPercentage = localStorage.getItem('ExamPieces');
    this.decExamPer = localStorage.getItem('decExamPer');
    console.log('check exam pieces2: ', this.decExamPer);
    this.GetServicetype_HHT_dropDown();

  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.password.setFocus();
    }, 500)
  }
  onServiceTypeChange(event) {
    this._ServiceType = event;
    // this.isInputDisabled();
  }

  getCurrentTime() {
    return moment().format('DD MMM YYYY HH:mm:ss');
  }

  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
  }

  onChange(e: any) {

    if (e.checked == true) {
      this.IsConsignee = true;

    } else {
      this.IsConsignee = false;
      this.ConsigneeGSTNo = '';
    }
    console.log(e);
    console.log(e.checked);
  }

  special_char(event) {



    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.\?]/); //unacceptable chars
    if (pattern.test(this.ConsigneeGSTNo)) {
      this.ConsigneeGSTNo = '';
      this.global.showAlert("Please enter only alphanumerics value in Consignee GSTN.");
      return false;
    }

    if (this.ConsigneeGSTNo.length != 15) {
      this.ConsigneeGSTNo = '';
      this.global.showAlert("Please enter valid 15 digit consignee GSTN.");
      return;
    }
    // return true; //good user input
    if (this.ConsigneeGSTNo.match(' ')) {
      this.ConsigneeGSTNo = '';
      this.global.showAlert('Spaces not allowed in Consignee GSTN.');
      return false;
    }

    var inputvalues = this.ConsigneeGSTNo;
    var gstinformat = new RegExp("^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})|([0-9]{2}[A-Z]{5}[A-Z]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$");
    if (gstinformat.test(inputvalues)) {
      return true;
    } else {
      this.ConsigneeGSTNo = '';
      this.global.showAlert('Please enter valid Consignee GSTN viz 22AAAAA0000A1Z5.');
    }



    // var gstinformat = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
    // if (gstinformat.test(this.ConsigneeGSTNo)) {
    //   return true;
    // } else {
    //   alert('Please Enter Valid GSTIN Number');

    // }
  }

  GetServicetype_HHT_dropDown() {
    this._ddlDerviceType.strModule = "I";
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetServicetype_HHT_dropDown, this._ddlDerviceType).then((response) => {
      if (response != null && response != "") {
        this.ServiceType = response['NewDataSet']['Table'];
        this._ServiceType = this.ServiceType[0]['ServiceCode'].toString();
        // this.ExamPiecesPercentage();
        this.IMPCalculateTSP_HHT();

      } else {
        // this.global.showAlert("Record not found.");
      }
    }, (error) => {
      console.log(error);
    });
  }
  // ExamPiecesPercentage() {
  //   this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.ExamPiecesPercentage).then((response) => {
  //     if (response != null && response != "") {
  //       this.ExamPieces = response['Root']['Output'].toString();
  //       //this._ExamPercentage = this.ExamPieces;
  //       this._ExamPercentage = localStorage.getItem('ExamPieces');
  //       this.IMPCalculateTSP_HHT();

  //     } else {
  //       // this.global.showAlert("TSP number is invalid.");
  //     }
  //   }, (error) => {
  //     console.log(error);
  //   });
  // }

  IMPCalculateTSP_HHT() {

    if (this.GPStatus == 1) {
      this.global.showAlert("Gate Pass already generate.");
      return;
    }
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
    this.calClass.pi_decExamPercentage = this._ExamPercentage;
    this.calClass.pi_chrCustomClrnce = 'C';
    this.calClass.pi_strServiceType = this._ServiceType;
    this.calClass.pi_blnRMS = 'false';

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.IMPCalculateTSP_HHT_Cal, this.calClass).then((response) => {
      if (response != null && response != "") {

        console.log('before paid --- ' + response)
        console.log('check response here-----', response);
        this.calculatedData = response['NewDataSet']['Table'];
        this.calculatedDataTb1 = response['NewDataSet']['Table1'];

        console.log('check table 0: ', this.calculatedData);
        console.log('check table 1: ', this.calculatedDataTb1);

        this.TSPCalculated = this.calculatedData[0]['TSPCalculated'];
        this.ServiceTaxCalculated = this.calculatedData[0]['ServiceTaxCalculated'];
        this.PayableAmount = this.calculatedData[0]['PayableAmount'];

        this.allXLforChar = '';
        for (var i = 0; i < this.calculatedDataTb1.length; i++) {
          this.XMLFomate = '<Chg Type="' + this.calculatedDataTb1[i]['ChargeType'] + '" CalAmt="' + this.calculatedDataTb1[i]['TotalAmount'] + '" CalTax="' + this.calculatedDataTb1[i]['TaxAmount'] + '" IsWaiv="0" TaxWaiv="0" WaiAmt="' + this.calculatedDataTb1[i]['WaiverAmount'] + '" ModTax="' + this.calculatedDataTb1[i]['ModifiedTax'] + '" PTCAmt="0"><CDtl Type="' + this.calculatedDataTb1[i]['ChargeType'] + '" AttNme="WEIGHT" AttVal="' + this.calculatedData[0]['ChWt'] + '" /></Chg>';
          this.allXLforChar += this.XMLFomate;
        }

        this._pi_strReceiptType = '';//localStorage.getItem('pi_strReceiptType');
        this._pi_intHAWBId = this.HAWBId;

        this._pi_decWaiverAmount = this.calculatedData[0]['WaivedAmount'];
        this._pi_decTotalAmount = this.calculatedData[0]['TSPCalculated'];
        this._pi_decTotalTax = this.calculatedData[0]['ServiceTaxCalculated'];
        this._pi_decAdjustableAmount = this.calculatedData[0]['AdjustibleAmount'];
        this._pi_decWaiverAmount = this.calculatedData[0]['WaivedAmount'];
        this._pi_decWaiverTaxAmount = this.calculatedData[0]['ServiceTaxPaid'];
        this._pi_decPayableAmount = this.calculatedData[0]['PayableAmount'];
        this._pi_strTSPNarration = '';// this.calculatedData[0]['TSPPaid'];
        this._pi_chrCAVEStatus = 'A';//this.calculatedData[0]['ChargeType'];

        this._pi_intExamPieces = this.calClass.pi_decExamPercentage
        this._pi_strIPAdd = '';
        this._pi_chrPayMode = 'P';

        this._pi_strPDActNo = this.calculatedData[0]['PDAccountId'];

        this._pi_strUserName = this._strUserName
        this._pi_chrCustomClearance = '';// localStorage.getItem('pi_chrCustomClrnce');
        this._pi_decExamPercentage = this.calculatedData[0]['Pieces'] * this.ExamPieces / 100.0;
        this._pi_strTSPRegisterXML = '<TSP>' + this.allXLforChar + '</TSP>';
        // this._pi_blnIsRMS = 'false';
        this._pi_strServiceType = this._ServiceType;

        //this.ChWt = this.calculatedData[0]['ChWt'].toString();
        this.GrWt = this.calculatedData[0]['GrWt'].toString();
        this.ConsigneeName = this.calculatedData[0]['ConsigneeName'].toString();
        this.Pieces = this.calculatedData[0]['Pieces'].toString();


        this.PureAgentStatus = this.calculatedData[0]['PureAgentStatus'];

        if (this.PureAgentStatus == true) {
          this.showCon = true;
        } else {
          this.showCon = false;
        }


      } else {
        this.global.showAlert("Record not found.");
      }
    }, (error) => {
      console.log(error);
    });
  }

  CompareTransactionPassword_TSP() {

    this.pCheck.pi_strTransactionPwd = this.TransactionPassword;
    this.pCheck.pi_strUserName = this._strUserName;
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.CompareTransactionPassword_TSP, this.pCheck).then((response) => {
      console.log('psw' + response);
      if (response != null && response != "") {
        this.PassWord = response['Root']['Output'];
        if (this.PassWord != "True") {
          this.global.showAlert("Please enter valid Password.");
        }

      } else {
        // this.global.showAlert("Record not found.");
      }
    }, (error) => {
      console.log(error);
    });
  }

  // showConfirm() {
  //   let confirm = this.alertCtrl.create({
  //     title: 'Record not found.',
  //     buttons: [
  //       {
  //         text: 'Ok',
  //         handler: () => {
  //           this.global.routePage(TPSMileStone);
  //         }
  //       }
  //     ]
  //   });
  //   confirm.present();
  // }

  IMPCreateTSP_HHT() {

    if (this.IsConsignee == true && this.ConsigneeGSTNo == '') {
      this.global.showAlert("Please enter Consignee GSTN.");
      return;
    }


    this._calculateTSPCharge.pi_strReceiptType = "IMPTSP";
    this._calculateTSPCharge.pi_intHAWBId = this._pi_intHAWBId;
    this._calculateTSPCharge.pi_chrPayMode = this._pi_chrPayMode;
    this._calculateTSPCharge.pi_decTotalAmount = this._pi_decTotalAmount.toString();
    this._calculateTSPCharge.pi_decTotalTax = this._pi_decTotalTax.toString();
    this._calculateTSPCharge.pi_decAdjustableAmount = this._pi_decAdjustableAmount.toString();
    this._calculateTSPCharge.pi_decWaiverAmount = this._pi_decWaiverAmount.toString();
    this._calculateTSPCharge.pi_decWaiverTaxAmount = this._pi_decWaiverTaxAmount.toString();
    this._calculateTSPCharge.pi_decPayableAmount = this._pi_decPayableAmount.toString();
    this._calculateTSPCharge.pi_strUserName = this._pi_strUserName;
    this._calculateTSPCharge.pi_strTSPNarration = this._pi_strTSPNarration;
    this._calculateTSPCharge.pi_chrCAVEStatus = this._pi_chrCAVEStatus;
    this._calculateTSPCharge.pi_chrCustomClearance = "C";

    // this._calculateTSPCharge.pi_decExamPercentage = JSON.stringify(this._pi_decExamPercentage);
    // this._calculateTSPCharge.pi_intExamPieces = 

    // this._calculateTSPCharge.pi_decExamPercentage = this._pi_intExamPieces;
    // this._calculateTSPCharge.pi_intExamPieces = JSON.stringify(this._pi_decExamPercentage);

    // this._calculateTSPCharge.pi_decExamPercentage = JSON.stringify(this._pi_decExamPercentage);
    // this._calculateTSPCharge.pi_intExamPieces = this._pi_intExamPieces;

    this._calculateTSPCharge.pi_decExamPercentage = this.decExamPer;
    this._calculateTSPCharge.pi_intExamPieces = this.ExamPieces;


    //changes made above for showstopper

    this._calculateTSPCharge.pi_strTSPRegisterXML = this._pi_strTSPRegisterXML;
    this._calculateTSPCharge.pi_strIPAdd = this._pi_strIPAdd;
    this._calculateTSPCharge.pi_blnIsRMS = "false";
    this._calculateTSPCharge.pi_strServiceType = this._pi_strServiceType;
    this._calculateTSPCharge.pi_strPDActNo = this._pi_strPDActNo.toString();

    if (this.PureAgentStatus == true) {
      this._calculateTSPCharge.pi_blnPureAgent = this.IsConsignee;
      this._calculateTSPCharge.pi_strConsigneeGSTNo = this.ConsigneeGSTNo;
    } else {
      this._calculateTSPCharge.pi_blnPureAgent = false;
      this._calculateTSPCharge.pi_strConsigneeGSTNo = "";
    }

    //this._calculateTSPCharge.pi_strNotifyMobileNo = '';


    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.IMPCreateTSP_HHT_Gen, this._calculateTSPCharge).then((response) => {
      //console.log(response)
      if (response != null && response != "") {
        this.TSPSuccess = response['Root']['Output'].toString();
        console.log(this.TSPSuccess.length)
        console.log('check for msg: ', response);
        if (this.TSPSuccess.startsWith("I")) {

          // this.TSPNoMsg = 'TSP No. ' + this.TSPSuccess + ' has been generated successfully.'
          localStorage.setItem('tspNo', this.TSPSuccess);
          localStorage.setItem('amount', this.PayableAmount);
          this.global.routePage(TSPSuccessMessage); // disabled by Himesh on 10/11/2020
          // this.navCtrl.push(TSPSuccessMessage); // added by Himesh on 10/11/2020 for disabling back navigation 
          // set global variable here for GP button hide/unhide
        } else {
          this.TSPNoMsg = this.TSPSuccess;
          this.showConfirmForTSP();
        }
        // this.global.showAlert(this.TSPSuccess);

        this.TransactionPassword = '';
      } else {
        this.global.showAlert("Record not found.");
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
  }
  showConfirmForTSP() {
    let confirm = this.alertCtrl.create({
      title: this.TSPNoMsg,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // this.global.routePage(TPSMileStone);
            this.navCtrl.remove(this.navCtrl.getActive().index - 1, 2); //added by Himesh on 05/12/2020
            localStorage.removeItem('ExamPieces');
            localStorage.removeItem('decExamPer');
          }
        }
      ]
    });
    confirm.present();
  }
  HAWBDetail() {
    localStorage.setItem('ChWt', this.ChWt);
    localStorage.setItem('GrWt', this.GrWt);
    localStorage.setItem('ConsigneeName', this.ConsigneeName);
    localStorage.setItem('Pieces', this.Pieces);
    this.global.routePage(HAWBDetail);
  }
}
