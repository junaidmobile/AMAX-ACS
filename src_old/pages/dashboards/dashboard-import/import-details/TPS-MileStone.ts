/**
 * @author Mohammaed Junaid
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:30
 * @modify date 2018-07-16 11:43:30
 * @desc [description]
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpProvider } from '../../../../providers/http/http';
import { Constants } from '../../../../constant';
import { AWBGatePassQRCode } from './AWB-GatePass-QRCode';
import { TSPSearch } from './TSP-Search';
import moment from 'moment';
import { TSPCharges } from './TSP_Procced';
import { AWBGatePassSearch } from './AWB-GatePass';
import { DOCSUplaod } from './DOCS_Uplaod';
import { DOCSUploadOC } from './DOCS-Upload-OC';
import { TSPHAWBDetail } from './TSP-HAWB-Detail';

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
}

export class dueChharge {
  pi_strMAWBNo: any;
  pi_strHAWBNo: any;
  pi_strDestination: any;
  pi_chrCustClr: any;
  pi_strServiceType: any;
  pi_blnIsRMS: any;
}

@Component({
  selector: 'TPS-MileStone',
  templateUrl: 'TPS-MileStone.html'
})

export class TPSMileStone implements OnInit {
  appBuildConfig: any;
  title: String;
  _allPrams: TSPSerachClass;
  _dueChharge: dueChharge;
  _calculateTSPCharge: calculateTSPCharge;
  _strUserName: any;
  showDiv: boolean;
  HAWBID: any;
  mileStoneData: any;
  MAWBNo: string;
  HAWBNo: string;
  genrateData: any;
  pi_strIGMDetailsXML: string;
  DlvblChWt: any;
  DlvblGrWt: any;
  DlvblPkgs: any;
  IGMId: any;
  PartyName: any = '';
  OCNumber: any = '';
  MobileNumber: any = '';
  _ServiceType: any;
  currentDate: string;
  GPButton: any;
  @ViewChild('_MobileNumber') _MobileNumber;
  @ViewChild('_OCNumber') _OCNumber;
  @ViewChild('_PartyName') _PartyName;
  calculatedData: any;
  calculatedDataTb1: any;
  XMLFomate: string;
  loading;
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
  ExPaer: string;
  destination: any;
  Destination: any;
  dueChargeStatus: any;
  duecharge: string;
  isDueCharge: boolean;
  tspValidation: string;
  private _StatusDet: any;
  private _EventCode: any;
  private _EventDt: any;
  TSPBool: boolean;
  tspStatus: any;
  pcsTotal: any = [];
  GrwtTotal: any = [];
  ChwtTotal: any = [];
  sumOfpcs: any;
  sumOfGrwt: any;
  sumOfChwt: any;
  IGMXMl: string;

  boeValidation: string;

  // showGPButton
  oocBtn;

  checkTick;


  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private _loadingCtrl: LoadingController) {

    this.HAWBID = localStorage.getItem('HAWBId');
    this.MAWBNo = localStorage.getItem('MAWBNo');
    this.HAWBNo = localStorage.getItem('HAWBNo');
    this._ServiceType = localStorage.getItem('ServiceType');
    this.ExamPieces = localStorage.getItem('ExamPieces');

    this.DlvblChWt = localStorage.getItem('DlvblChWt');
    this.DlvblGrWt = localStorage.getItem('DlvblGrWt');
    this.DlvblPkgs = localStorage.getItem('DlvblPkgs');
    this.IGMId = localStorage.getItem('IGMId');

    this.OCNumber = localStorage.getItem('OCNumber');
    this.PartyName = localStorage.getItem('PartyName');

    this.XMLFomate = localStorage.getItem('pi_strIGMDetailsXML');


    this.currentDate = this.getCurrentTime();
    this._calculateTSPCharge = new calculateTSPCharge();
    this._allPrams = new TSPSerachClass();
    this._dueChharge = new dueChharge();
    this.appBuildConfig = this.global.appBuildConfig;

    this.title = "Milestone Status";

    // this.getTSP_Details();

  }

  getCurrentTime() {
    return moment().format('DD MMM YYYY HH:mm:ss');
  }

  showLoading() {
    if (!this.loading) {
      this.loading = this._loadingCtrl.create({
        content: 'Please Wait...'
      });
      this.loading.present();
    }
  }

  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }


  ngOnInit() {
    localStorage.removeItem('DlvblChWt');
    localStorage.removeItem('DlvblGrWt');
    localStorage.removeItem('DlvblPkgs');
    localStorage.removeItem('OCNumber');
    localStorage.removeItem('PartyName');
    localStorage.removeItem('pi_strIGMDetailsXML');

    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    // this.getTSP_Details();

    // this.showButton();

    // this.getOOcDetails();

  }



  showButton(){
    // this.getOOcDetails();
    console.log("I am from showButton function....");
    console.log('for GP1: ', this.global.generateGP);
    console.log('for GP2: ', this.oocBtn);
    if(this.global.generateGP == 1){
        this.GPButton = 1
        console.log('test for btns1: ', this.GPButton);
    }
    if(this.global.dueBtn == 1){
      // this.TSPBool = false;
      this.global.TSPBool = false; //new
      console.log('test for btns: ', this.TSPBool);
    } else if(this.global.dueBtn != 1) {
      console.log('No match');
      // this.TSPBool = true; //added on 05/01 by Himesh bcoz due charges row was getting vanished when only navigation performed on document upload
      //above line of code again blocked, bcoz due charges was getting displayed before TSP paid
    }
  }

  showOocButton(){
    // if(this.global.oocBtn == false){
      // this.oocBtn = false;
      this.getOOcDetails();
      console.log('test for ooc btns: ', this.oocBtn);
    // }
  }

  getTSP_Details() {
    
    // this.mileStoneData = '';
    // this.genrateData = '';
    this.sumOfChwt = 0;
    this.sumOfGrwt = 0;
    this.sumOfpcs = 0;
    localStorage.removeItem('OOCStatus')
    // this.showLoading();
    this._allPrams.pi_intHAWBRowId = this.HAWBID;
    this._allPrams.pi_strUserName = this._strUserName;

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetHawbStatusBasedOnHAWBNo_HHT_HAWB, this._allPrams).then((response) => {
      console.log('LKLK===>' + response)
      // this.mileStoneData = '';
      if (response != null && response != "") {
        this.mileStoneData = response['NewDataSet']['Table'];
        this.genrateData = response['NewDataSet']['Table1'];
        this.showDiv = true;
        this.IGMXMl = '';
        if(this.genrateData.length > 0){ //new
        for (var j = 0; j < this.genrateData.length; j++) {

          this.pcsTotal.push(parseInt(this.genrateData[j].DlvblPkgs));
          this.GrwtTotal.push(parseFloat(this.genrateData[j].DlvblGrWt));
          this.ChwtTotal.push(parseFloat(this.genrateData[j].DlvblChWt));

          this.IGMXMl += '<Data IGMRowID="' + this.genrateData[j]['IGMId'] + '" Pkgs="' + this.genrateData[j]['DlvblPkgs'] + '" GrWt="' + this.genrateData[j]['DlvblGrWt'] + '" ChWt="' + this.genrateData[j]['DlvblChWt'] + '" />'

        }
      }// if end

        this.pi_strIGMDetailsXML = '<GPIGM>' + this.IGMXMl + '</GPIGM>';


        this.sumOfpcs = this.pcsTotal.reduce((acc, cur) => acc + cur);
        this.sumOfGrwt = this.GrwtTotal.reduce((acc, cur) => acc + cur);
        this.sumOfChwt = this.ChwtTotal.reduce((acc, cur) => acc + cur);

        // this.sumOfpcs = this.sumOfpcs + this.pcsTotal.reduce((acc, cur) => acc + cur);
        // this.sumOfGrwt = this.sumOfGrwt + this.GrwtTotal.reduce((acc, cur) => acc + cur);
        // this.sumOfChwt = this.sumOfChwt + this.ChwtTotal.reduce((acc, cur) => acc + cur);


        console.log('sum of pieces',this.sumOfpcs)
        console.log('sum of GrWt', this.sumOfGrwt)
        console.log('sum of ChWt',this.sumOfChwt)

        console.log('----------milestone time: ', this.mileStoneData);

        this.DlvblChWt = this.sumOfChwt
        this.DlvblGrWt = this.sumOfGrwt
        this.DlvblPkgs = this.sumOfpcs;
        this.IGMId = this.genrateData[0].IGMId
        this.OCNumber = this.genrateData[0].OoCNo
        this.PartyName = this.genrateData[0].PartyName

        this.Destination = this.genrateData[0].Destination;




        // for (var j = 0; j < this.genrateData.length; j++) {
        //   if (this.genrateData[j].DlvblPkgs != "0") {
        //     this.DlvblChWt = this.genrateData[j].DlvblChWt
        //     this.DlvblGrWt = this.genrateData[j].DlvblGrWt
        //     this.DlvblPkgs = this.genrateData[j].DlvblPkgs
        //     this.IGMId = this.genrateData[j].IGMId
        //     this.OCNumber = this.genrateData[j].OoCNo
        //     this.PartyName = this.genrateData[j].PartyName

        //     this.Destination = this.genrateData[j].Destination;
        //     this.pi_strIGMDetailsXML = '<GPIGM><Data IGMRowID="' + this.genrateData[j]['IGMId'] + '" Pkgs="' + this.genrateData[j]['DlvblPkgs'] + '" GrWt="' + this.genrateData[j]['DlvblGrWt'] + '" ChWt="' + this.genrateData[j]['DlvblChWt'] + '" /></GPIGM>'
        //   }

        // }




        var ids = [];
        for (var i = 0; i < this.mileStoneData.length; i++) {
          if (this.mileStoneData[i]['StatusDet'] == 'Pending' && this.mileStoneData[i]['EventCode'] == 'OOC') {
            this.ExPaer = 'Pending';
            this.global.checkRMS = false; //added on 20/04 for rms/non-rms
            // this.checkTick = 'DontRestrict'; //added on 20/04 for rms/non-rms
            // localStorage.setItem('checkRMS', this.checkTick); //added on 20/04 for rms/non-rms
          }
          //new if condition 
          if (this.mileStoneData[i]['StatusDet'] == 'Done' && this.mileStoneData[i]['EventCode'] == 'OOC') {
            this.ExPaer = 'Pending';
            this.global.checkRMS = true;
            // this.checkTick = 'Restrict';
            // localStorage.setItem('checkRMS', this.checkTick);
          } // new if for rms/non-rms added on 20/04
          
          else {
            this.ExPaer = 'Pending';
          }
          if ((this.mileStoneData[i]['StatusDet'] == 'Pending' && this.mileStoneData[i]['EventCode'] == 'OOC') || (this.mileStoneData[i]['StatusDet'] == 'Pending' && this.mileStoneData[i]['EventCode'] == 'Recon')) {
            this.tspValidation = 'Pending';
          } else {
            this.tspValidation = 'Done';
          }

          //new for bc change
          if ((this.mileStoneData[i]['StatusDet'] == 'Pending' && this.mileStoneData[i]['EventCode'] == 'BOE')) {
            this.boeValidation = 'Pending';
          } else {
            this.boeValidation = 'Done';
          }

          if (this.mileStoneData[i]['StatusDet'] == 'Done' && this.mileStoneData[i]['EventCode'] == 'TSP') {

            // this.TSPBool = true;
            this.global.TSPBool = true; //new
          }
          // else{
          //   this.tspStatus = 'Pending';
          // }

          // if (this.mileStoneData[i]['StatusDet'] == 'Pending') {
          //   this.GPButton = 0;
          // }

          if ((this.mileStoneData[i]['StatusDet'] == 'Pending'
            && this.mileStoneData[i]['EventCode'] == 'BOE')
            || (this.mileStoneData[i]['StatusDet'] == 'Pending' &&
              this.mileStoneData[i]['EventCode'] == 'ADO')
            || (this.mileStoneData[i]['StatusDet'] == 'Pending'
              && this.mileStoneData[i]['EventCode'] == 'Recon')
            || (this.mileStoneData[i]['StatusDet'] == 'Pending'
              && this.mileStoneData[i]['EventCode'] == 'TSP')

            || 
              (this.mileStoneData[i]['StatusDet'] == 'Pending'
                && this.mileStoneData[i]['EventCode'] == 'CDO')
            // || 
            // (this.mileStoneData[i]['StatusDet'] == 'Pending'
            //   && this.mileStoneData[i]['EventCode'] == 'OOC')
              ) {
            this.GPButton = 0;
            this.global.generateGP = 0; //added by Himesh on 06/11/2020
            // this.oocBtn = true;

            // this.global.oocBtn = true;
          }

          if (this.mileStoneData[i]['StatusDet'] == 'Pending'
          && this.mileStoneData[i]['EventCode'] == 'OOC'){
            // this.global.oocBtn = true;
            this.GPButton = 0;
            this.global.generateGP = 0;
            this.oocBtn = true;

            this.oocBtn = true; //now
            this.global.oocBtn = true; //now
            this.global.checkRMS = false; //new on 20/04
          }
          // BOE
          // ADO
          // Recon
          // MAWBRecon
          // HAWBRecon
          // HChWtRecon
          // TSP
          // OOC

          //  debugger
          // if (this.mileStoneData[i]['StatusDet'] == 'Done' && this.mileStoneData[i]['EventCode'] == 'TSP') {
          //   this._StatusDet = this.mileStoneData[i]['StatusDet']
          //   this._EventCode = this.mileStoneData[i]['EventCode']
          //   this._EventDt = this.mileStoneData[i]['EventDt']
          // }

        }

        // for (var j = 0; j < this.mileStoneData.length; j++) {

        //   if (this.mileStoneData[j]['StatusDet'] == 'Done') {

        //   }
        // }
        this.IsTherePaymentDues_HHT();
        //this.IsTherePaymentDues_HHT_for_check_part();

        // this.dismissLoading();

      } else {
        //this.global.showAlert("Record not found.");
        this.showConfirm();

      }
    }, (error) => {
      console.log(error);
    });
  }

  clearInputs() {
    this.OCNumber = '';

    this.showDiv = false;
  }

  getOOcDetails(){
    console.log('in get OOC details');
    localStorage.removeItem('OOCStatus')
    // this.showLoading();
    this._allPrams.pi_intHAWBRowId = this.HAWBID;
    this._allPrams.pi_strUserName = this._strUserName;

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetHawbStatusBasedOnHAWBNo_HHT_HAWB, this._allPrams).then((response) => {
      console.log('in ooc details===>' + response)
      this.mileStoneData = '';
      if (response != null && response != "") {
        this.mileStoneData = response['NewDataSet']['Table'];
        this.genrateData = response['NewDataSet']['Table1'];
        this.showDiv = true;
        this.IGMXMl = '';
        for (var j = 0; j < this.genrateData.length; j++) {

        //   this.pcsTotal.push(parseInt(this.genrateData[j].DlvblPkgs));
        //   this.GrwtTotal.push(parseFloat(this.genrateData[j].DlvblGrWt));
        //   this.ChwtTotal.push(parseFloat(this.genrateData[j].DlvblChWt));

          this.IGMXMl += '<Data IGMRowID="' + this.genrateData[j]['IGMId'] + '" Pkgs="' + this.genrateData[j]['DlvblPkgs'] + '" GrWt="' + this.genrateData[j]['DlvblGrWt'] + '" ChWt="' + this.genrateData[j]['DlvblChWt'] + '" />'

        }

        // this.pi_strIGMDetailsXML = '<GPIGM>' + this.IGMXMl + '</GPIGM>';


        // this.sumOfpcs = this.pcsTotal.reduce((acc, cur) => acc + cur);
        // this.sumOfGrwt = this.GrwtTotal.reduce((acc, cur) => acc + cur);
        // this.sumOfChwt = this.ChwtTotal.reduce((acc, cur) => acc + cur);

        // console.log(this.sumOfpcs)
        // console.log(this.sumOfGrwt)
        // console.log(this.sumOfChwt)

        // this.DlvblChWt = this.sumOfChwt
        // this.DlvblGrWt = this.sumOfGrwt
        // this.DlvblPkgs = this.sumOfpcs;
        // this.IGMId = this.genrateData[0].IGMId
        // this.OCNumber = this.genrateData[0].OoCNo
        // this.PartyName = this.genrateData[0].PartyName

        this.Destination = this.genrateData[0].Destination;


        var ids = [];
        for (var i = 0; i < this.mileStoneData.length; i++) {
          if (this.mileStoneData[i]['StatusDet'] == 'Pending' && this.mileStoneData[i]['EventCode'] == 'OOC') {
            this.ExPaer = 'Pending';
          } else {
            this.ExPaer = 'Pending';
          }
          if ((this.mileStoneData[i]['StatusDet'] == 'Pending' && this.mileStoneData[i]['EventCode'] == 'OOC') || (this.mileStoneData[i]['StatusDet'] == 'Pending' && this.mileStoneData[i]['EventCode'] == 'Recon')) {
            this.tspValidation = 'Pending';
          } else {
            this.tspValidation = 'Done';
          }

          //new for bc change
          if ((this.mileStoneData[i]['StatusDet'] == 'Pending' && this.mileStoneData[i]['EventCode'] == 'BOE')) {
            this.boeValidation = 'Pending';
          } else {
            this.boeValidation = 'Done';
          }

          if (this.mileStoneData[i]['StatusDet'] == 'Done' && this.mileStoneData[i]['EventCode'] == 'TSP') {

            // this.TSPBool = true;
            this.global.TSPBool = true; //new
          }
          if (this.mileStoneData[i]['StatusDet'] == 'Done' && this.mileStoneData[i]['EventCode'] == 'OOC') {

            this.oocBtn = false;
            this.global.oocBtn = false
          }
          // else{
          //   this.tspStatus = 'Pending';
          // }

          // if (this.mileStoneData[i]['StatusDet'] == 'Pending') {
          //   this.GPButton = 0;
          // }

          if ((this.mileStoneData[i]['StatusDet'] == 'Pending'
            && this.mileStoneData[i]['EventCode'] == 'BOE')
            || (this.mileStoneData[i]['StatusDet'] == 'Pending' &&
              this.mileStoneData[i]['EventCode'] == 'ADO')
            || (this.mileStoneData[i]['StatusDet'] == 'Pending'
              && this.mileStoneData[i]['EventCode'] == 'Recon')
            || (this.mileStoneData[i]['StatusDet'] == 'Pending'
              && this.mileStoneData[i]['EventCode'] == 'TSP')
            || 
            (this.mileStoneData[i]['StatusDet'] == 'Pending'
              && this.mileStoneData[i]['EventCode'] == 'OOC')
            
            || 
            (this.mileStoneData[i]['StatusDet'] == 'Pending'
              && this.mileStoneData[i]['EventCode'] == 'CDO')

              ) {
            this.GPButton = 0;
            this.global.generateGP = 0; //added by Himesh on 06/11/2020
            // this.oocBtn = true;

            this.oocBtn = true; // on 28/12
            this.global.oocBtn = true; //on 28/12

            // this.global.oocBtn = true;
          }

          //new if block on 27/03 for OOC issue
          if ((this.mileStoneData[i]['StatusDet'] == 'Done'
            && this.mileStoneData[i]['EventCode'] == 'BOE')
            || (this.mileStoneData[i]['StatusDet'] == 'Done' &&
              this.mileStoneData[i]['EventCode'] == 'ADO')
            || (this.mileStoneData[i]['StatusDet'] == 'Done'
              && this.mileStoneData[i]['EventCode'] == 'Recon')
            || (this.mileStoneData[i]['StatusDet'] == 'Done'
              && this.mileStoneData[i]['EventCode'] == 'TSP')
            || 
            (this.mileStoneData[i]['StatusDet'] == 'Done'
              && this.mileStoneData[i]['EventCode'] == 'OOC')

            || 
              (this.mileStoneData[i]['StatusDet'] == 'Done'
                && this.mileStoneData[i]['EventCode'] == 'CDO')
              ) {
            this.GPButton = 1;
            this.global.generateGP = 1; //added by Himesh on 06/11/2020
            // this.oocBtn = true;

            // this.oocBtn = true; // on 28/12
            // this.global.oocBtn = true; //on 28/12

            // this.global.oocBtn = true;
          }


          
          // if(this.mileStoneData[i]['StatusDet'] == 'Done'
          // && this.mileStoneData[i]['EventCode'] == 'OOC'){
          //   this.global.oocBtn = false;
          //   this.oocBtn = false;
          //   console.log('from oocdetail function: ', this.global.oocBtn);
          // }
          
          // else{ // on 28/12
          //   this.global.generateGP = 1;
          //   this.GPButton = 1;
          // }
          // above else condition added on 28/12 by Himesh for Generate Gp after OOc issue

          // if (this.mileStoneData[i]['StatusDet'] == 'Pending'
          // && this.mileStoneData[i]['EventCode'] == 'OOC'){
          //   // this.global.oocBtn = true;
          //   this.GPButton = 0;
          //   this.global.generateGP = 0;
          //   this.oocBtn = true;
          // }
        }

        this.IsTherePaymentDues_HHT();
        
      } else {
        // this.showConfirm();

      }
    }, (error) => {
      console.log(error);
    });
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Record not found.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.global.routePage(AWBGatePassSearch);
          }
        }
      ]
    });
    confirm.present();
  }
  // IMPCreateTSP_HHT() {
  //   this._calculateTSPCharge.pi_strReceiptType = this._pi_strReceiptType
  //   this._calculateTSPCharge.pi_intHAWBId = this._pi_intHAWBId
  //   this._calculateTSPCharge.pi_chrPayMode = this._pi_chrPayMode
  //   this._calculateTSPCharge.pi_decTotalAmount = this._pi_decTotalAmount
  //   this._calculateTSPCharge.pi_decTotalTax = this._pi_decTotalTax
  //   this._calculateTSPCharge.pi_decAdjustableAmount = this._pi_decAdjustableAmount
  //   this._calculateTSPCharge.pi_decWaiverAmount = this._pi_decWaiverAmount
  //   this._calculateTSPCharge.pi_decWaiverTaxAmount = this._pi_decWaiverTaxAmount
  //   this._calculateTSPCharge.pi_decPayableAmount = this._pi_decPayableAmount
  //   this._calculateTSPCharge.pi_strUserName = this._pi_strUserName
  //   this._calculateTSPCharge.pi_strTSPNarration = this._pi_strTSPNarration
  //   this._calculateTSPCharge.pi_chrCAVEStatus = this._pi_chrCAVEStatus
  //   this._calculateTSPCharge.pi_chrCustomClearance = this._pi_chrCustomClearance
  //   this._calculateTSPCharge.pi_decExamPercentage = this._pi_decExamPercentage
  //   this._calculateTSPCharge.pi_intExamPieces = this._pi_intExamPieces
  //   this._calculateTSPCharge.pi_strTSPRegisterXML = this._pi_strTSPRegisterXML
  //   this._calculateTSPCharge.pi_strIPAdd = this._pi_strIPAdd
  //   this._calculateTSPCharge.pi_blnIsRMS = this._pi_blnIsRMS
  //   this._calculateTSPCharge.pi_strServiceType = this._pi_strServiceType


  //   this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.IMPCreateTSP_HHT_Gen, this._calculateTSPCharge).then((response) => {
  //     console.log(response)
  //     if (response != null && response != "") {


  //     } else {
  //       this.global.showAlert("TSP number is invalid.");
  //     }
  //   }, (error) => {
  //     console.log(error);
  //   });
  // }

  navToCreateTSPPAge() {

    // if (this.tspValidation == 'Pending') {
    //   this.global.showAlert("TSP cannot be paid. Please submit the shipment documents through eDocket before paying TSP charge.");
    //   return;
    // }

    if (this.boeValidation == 'Pending') {
      this.global.showAlert("TSP cannot be paid. BOE pending.");
      return;
    }
    else {

    localStorage.setItem('OOCStatus', this.ExPaer)
    this.global.routePage(TSPHAWBDetail);
    }
  }

  navToDocsUploadOC() {
    localStorage.setItem('HAWBID', this.HAWBID);
    this.global.routePage(DOCSUploadOC);
  }

  navToDocsUploadRecon() {
    localStorage.setItem('HAWBID', this.HAWBID);
    this.global.routePage(DOCSUplaod);
  }

  // ionViewDidLoad(){
  //  this.getOOcDetails();
  // }

  // Just to animate the fab
  fabGone = false;
  ionViewWillEnter() {
    this.fabGone = false;
    // this.getTSP_Details(); //added by Himesh on 02/11/2020
    // this.getOOcDetails();
    console.log('test for due charges time: ', this.mileStoneData);
    // this.showButton();
    // this.global.oocCount = 0;
    console.log('check ooc count: ', this.global.oocCount);
  }


  ionViewDidEnter(){
   this.showButton();
   this.showOocButton();
   this.getTSP_Details();
  }

  ionViewWillLeave() {
    this.fabGone = true;
    // this.TSPBool = true; //added by Himesh on 13/11/2020
    // this.sumOfpcs = 0;
    // this.sumOfGrwt = 0;
    // this.sumOfChwt = 0;
  }

  ionViewDidLeave(){
    
    this.mileStoneData = null;
    this.genrateData = null;
    this.sumOfpcs = 0;
    this.sumOfGrwt = 0;
    this.sumOfChwt = 0;
    this.DlvblChWt = 0;
    this.DlvblGrWt = 0;
    this.DlvblPkgs = 0;
    this.pcsTotal = [];
    this.GrwtTotal = [];
    this.ChwtTotal = [];


    console.log('sum of pieces from leave',this.sumOfpcs)
    console.log('sum of GrWt', this.sumOfGrwt)
    console.log('sum of ChWt',this.sumOfChwt)

  }



  IsTherePaymentDues_HHT() {

    this._dueChharge.pi_strMAWBNo = this.MAWBNo;

    if (this.HAWBNo == null) {
      this._dueChharge.pi_strHAWBNo = '';
    } else {
      this._dueChharge.pi_strHAWBNo = this.HAWBNo
    }

    this._dueChharge.pi_strDestination = this.Destination.toString();
    this._dueChharge.pi_chrCustClr = "C";
    this._dueChharge.pi_strServiceType = "NSI";
    this._dueChharge.pi_blnIsRMS = false;

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.IsTherePaymentDues_HHT_Due, this._dueChharge).then((response) => {
      console.log('Dues   -  ' + response)
      if (response != null && response != "") {
        this.dueChargeStatus = response['Root']['Output'].toString();
        if (this.dueChargeStatus == 'True') {
          //this.global.showAlert("Shipment is having uncleared payment due; action cancelled.");
          this.GPButton = 0;
          this.global.generateGP = 0; // added by Himesh on 06/11/2020
          this.duecharge = 'Due Charges';
          this.isDueCharge = true;
          return;

        } else {
          // this.TSPBool = false;
          this.global.TSPBool = false; //new
        }

      }
    }, (error) => {
      console.log(error);
    });
  }


  IsTherePaymentDues_HHT_for_check_part() {
    this._dueChharge.pi_strMAWBNo = this.MAWBNo;

    if (this.HAWBNo == null) {
      this._dueChharge.pi_strHAWBNo = '';
    } else {
      this._dueChharge.pi_strHAWBNo = this.HAWBNo
    }

    this._dueChharge.pi_strDestination = this.Destination;
    this._dueChharge.pi_chrCustClr = "C";
    this._dueChharge.pi_strServiceType = "NSI";
    this._dueChharge.pi_blnIsRMS = false;

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.IsTherePaymentDues_HHT_Due, this._dueChharge).then((response) => {
      console.log('Dues   -  ' + response)
      if (response != null && response != "") {

        this.dueChargeStatus = response['Root']['Output'].toString();


      }
    }, (error) => {
      console.log(error);
    });
  }



  goTOGatePassQRCode() {

    localStorage.removeItem('DlvblChWt');
    localStorage.removeItem('DlvblGrWt');
    localStorage.removeItem('DlvblPkgs');
    localStorage.removeItem('OCNumber');
    localStorage.removeItem('PartyName');
    localStorage.removeItem('pi_strIGMDetailsXML');

    localStorage.setItem('DlvblChWt', this.DlvblChWt);
    localStorage.setItem('DlvblGrWt', this.DlvblGrWt);
    localStorage.setItem('DlvblPkgs', this.DlvblPkgs);
    localStorage.setItem('OCNumber', this.OCNumber);
    localStorage.setItem('PartyName', this.PartyName);

    localStorage.setItem('pi_strIGMDetailsXML', this.pi_strIGMDetailsXML);
    // this.clearInputs();
    this.global.routePage(AWBGatePassQRCode);
    // localStorage.setItem('DlvblChWt', this.DlvblChWt);
    // localStorage.setItem('DlvblGrWt', this.DlvblGrWt);
    // localStorage.setItem('DlvblPkgs', this.DlvblPkgs);
    // localStorage.setItem('OCNumber', this.OCNumber);
    // localStorage.setItem('PartyName', this.PartyName);
    // localStorage.setItem('pi_strIGMDetailsXML', this.pi_strIGMDetailsXML);
    // this.clearInputs();
    // this.global.routePage(AWBGatePassQRCode);
    // if (this.OCNumber == '' || this.OCNumber == 0) {
    //   this.global.showAlert("Please enter OC Number.");
    //   return;
    // }


    // this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }


  validationForDocs() {
    this.global.showAlert("Please upload document before paid TSP charge.");
  }

}
