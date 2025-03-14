import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';

import { Constants } from '../../../constant';
import { GlobalProvider } from '../../../providers/global/global';
import { HttpProvider } from '../../../providers/http/http';
import { ImportScanPage, scanClass } from '../../import-scan/import-scan';
import moment from 'moment';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ReturnStatement } from '@angular/compiler';
/**
 * Generated class for the TokenScanningPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



export class ExportVehicle { pi_strMAWBNo: any; pi_strHAWBNo: any; pi_strUser: any; pi_chrModule: any }
export class TSPSerachClass { pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }



@Component({
  selector: 'page-token-scanning',
  templateUrl: 'token-scanning.html',
})
export class TokenScanningPage implements OnInit {
  exportVehicle: ExportVehicle
  Prefix: any;
  MAWBNo: any;
  SannedToeknNo: any; showAdditional: boolean = false;
  VehicleTrackResp: any;
  tspdetails: any;
  w: any;
  HAWBS: any = [];
  hawb: any;
  _strUserName: any;
  _allPrams: TSPSerachClass
  showDiv: boolean;
  tableData: any;
  @ViewChild('MAWBNoValue') MAWBInput;
  @ViewChild('PrefixValue') PrefixInput;
  @ViewChild('spinner') SpinnerInput;
  @ViewChild('SannedToeknNoValue') SannedToeknNumberInput;



  appBuildConfig: any;
  title: String;
  myGateInDate: any = "";
  myGateOutDate: any = "";
  myDockOutDate: any = "";
  myDockInDate: any = "";

  selectedVehicleType: String = '';
  selectedTerminalType: String = '';

  //SannedToeknNumber: String = "";

  _scanParams: scanClass;
  encodedData: any;
  scannedBarCode: any;

  isAValid: boolean = false;
  isBValid: boolean = false;

  showBarcode: boolean = false;
  isDisableSelect: boolean = false;

  userRole: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpProvider, public global: GlobalProvider, private barcodeScanner: BarcodeScanner) {
    this.exportVehicle = new ExportVehicle();
    this._allPrams = new TSPSerachClass()

    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "TOKEN SCANNING";
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    this._scanParams = new scanClass();
    this.showBarcode = false;
    //this.barcodeScanner.
  }
  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];

    this.selectedTerminalType = "SL";
    this.selectedVehicleType = "S";

    //this.Prefix = 'EVTG' + this.getCurrentTime();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TokenScanningPage');
    setTimeout(() => {
      this.MAWBInput.setFocus();
    }, 600)
  }
  GetBarcodeDetails() {

    console.log("************************   GetBarcodeDetails");

    if (this.Prefix == undefined || (this.Prefix == '') || (this.Prefix.length < 9)) {
      this.global.showAlert("Please enter valid Prefix.");
      this.isAValid = false;
      return;
    } else {
      this.isAValid = true;
    }

    if (this.MAWBNo == undefined || (this.MAWBNo == '') || (this.MAWBNo.length < 4)) {
      this.global.showAlert("Please enter valid OTP No.");
      this.isBValid = false;
      return;
    } else {
      this.isBValid = true;
    }

    console.log("_____________________************************___________________________");
    console.log(this.MAWBNo);



    if (this.isAValid && this.isBValid) {

      console.log("startwithLetter = " + this.Prefix.substring(0, 1));
      if (this.Prefix.substring(0, 1) == "I") {
        alert("Kindly scan Import VT's in Import Token Scanning screen");
        this.Prefix = 'EVTG' + this.getCurrentTime();
        this.MAWBNo = '';
        return;
      }


      this._scanParams.pi_strUser = this._strUserName;
      this._scanParams.pi_strVTNo = this.Prefix + this.MAWBNo;
      this.scannedBarCode = this.Prefix + this.MAWBNo;
      this.setVTnTTByScannedNumber(this.scannedBarCode);
      this.scan();
    }
  }

  switch($event) {
    // alert("*****  switch function");
    //console.log(event);

    // if ($event.value.length == 4)
    //   $event.cancelled = true;

    // AIIVTG2212010004
    // IVTG2212010001
    // IVT2212010001
    //console.log("************************  scan function");
    // return;

    this.hawb = $event;
    //this.MAWBNo = $event;
    console.log($event.value);
    this.SannedToeknNo = $event.value.toString().toUpperCase();

    // alert("SannedToeknNo = " + this.SannedToeknNo);

    console.log("SannedToeknNo = " + this.SannedToeknNo);

    if (this.SannedToeknNo.length == 13) {
      this.Prefix = this.MAWBNo.substring(0, 9);
      this.MAWBNo = this.MAWBNo.substring(9, 13);
      //this.scanBarcodeTest();
    }

    if (this.SannedToeknNo.length == 14) {
      this.Prefix = this.MAWBNo.substring(0, 10);
      this.MAWBNo = this.MAWBNo.substring(10, 14);
      //this.scanBarcodeTest();
    }

    if (this.SannedToeknNo.length == 16) {
      this.Prefix = this.MAWBNo.substring(0, 12);
      this.MAWBNo = this.MAWBNo.substring(12, 16);
      // this.scanBarcodeTest();
    }

    if (this.Prefix == undefined || this.Prefix == '')
      return;

    if (this.MAWBNo == undefined || this.MAWBNo == '')
      return;

    this.SannedToeknNo = this.Prefix.toString() + this.MAWBNo.toString();
    console.log("SannedToeknNo = " + this.SannedToeknNo);

    if (this.SannedToeknNo.length > 13)
      this.scanBarcodeTest();


    // if (this.Prefix == undefined || this.Prefix == '')
    //   return;

    // if (this.MAWBNo == undefined || this.MAWBNo == '')
    //   return;

    // this.SannedToeknNo = this.Prefix.toString() + this.MAWBNo.toString();
    // console.log("SannedToeknNo = " + this.SannedToeknNo);


    // if (eventtype == 'P')
    //   this.focusNextInput();

  }


  focusNextInput($event) {

    this.Prefix = $event.value.toString().toUpperCase();

    // console.log("************************  focusNextInput function");
    // return;
    // if (this.SannedToeknNo == undefined || this.SannedToeknNo == '')
    //   return;



    // if (this.SannedToeknNo.length == 13) {
    //   this.Prefix = this.MAWBNo.substring(0, 9);
    //   this.MAWBNo = this.MAWBNo.substring(9, 13);
    // }

    // if (this.SannedToeknNo.length == 14) {
    //   this.Prefix = this.MAWBNo.substring(0, 10);
    //   this.MAWBNo = this.MAWBNo.substring(10, 14);
    // }

    // if (this.SannedToeknNo.length == 16) {
    //   this.Prefix = this.MAWBNo.substring(0, 12);
    //   this.MAWBNo = this.MAWBNo.substring(12, 16);
    // }

    if (this.Prefix.length > 9) {
      this.MAWBInput.setFocus();
    }

    if (this.Prefix == undefined || this.Prefix == '')
      return;

    if (this.MAWBNo == undefined || this.MAWBNo == '')
      return;

    this.SannedToeknNo = this.Prefix.toString() + this.MAWBNo.toString();
    console.log("SannedToeknNo = " + this.SannedToeknNo);

    // if (this.Prefix.length > 9) {
    //   this.MAWBInput.setFocus();
    // }
  }

  onSelectChangeVT(event) {
    // this.MAWBNo = '';
    console.log('Vehicle Type Selected', event);
    this.selectedVehicleType = event;
    this.generatePrefix(this.selectedVehicleType, this.selectedTerminalType);



    // if (event == "1")//Trolley
    //   this.Prefix = 'ETRG' + this.getCurrentTime();
    // else if (event == "2") // hand
    //   this.Prefix = 'EPHG' + this.getCurrentTime();
    // else // vehicle
    //   this.Prefix = 'EVTG' + this.getCurrentTime();
  }

  onSelectChangeTT(event) {
    //   this.MAWBNo = '';
    console.log('Terminal Type Selected', event);
    this.selectedTerminalType = event;
    this.generatePrefix(this.selectedVehicleType, this.selectedTerminalType);
    // if (event == "1")//Trolley
    //   this.Prefix = 'ETRG' + this.getCurrentTime();
    // else if (event == "2") // hand
    //   this.Prefix = 'EPHG' + this.getCurrentTime();
    // else // vehicle
    //   this.Prefix = 'EVTG' + this.getCurrentTime();
  }

  generatePrefix(vehicletype: String, terminaltype: String) {
    // alert("*****  setVTnTTByScannedNumber function");
    console.log("************************  generatePrefix function");
    console.log('vehicletype = ' + vehicletype);
    console.log('terminaltype = ' + terminaltype);
    var newGeneratedPrefix = '';
    this.showDiv = false;
    //this.MAWBNo = '';
    if (vehicletype != "" && terminaltype != "") {
      console.log('generatePrefix');
      this.isDisableSelect = false;
      if (terminaltype == "MCSCL") {//MCSC-Light
        // Vehicle	EVTG	EVTG2212010001
        // Trolley	ETRG	ETRG2212010001
        // By Hand	EPHG	EPHG2212010001
        if (vehicletype == "V")
          newGeneratedPrefix = 'EVTG' + this.getCurrentTime();
        else if (vehicletype == "T")
          newGeneratedPrefix = 'ETRG' + this.getCurrentTime();
        else if (vehicletype == "H")
          newGeneratedPrefix = 'EPHG' + this.getCurrentTime();
        else {
          newGeneratedPrefix = '';
          this.Prefix = '';
        }

      }
      else if (terminaltype == "MCSCH") {//MCSC - Heavy & Bonded 
        // Vehicle	EHVG       EHVG2212010001
        // if (vehicletype == "V")

        this.isDisableSelect = true;
        this.selectedVehicleType = "V";
        if (vehicletype == "S") {
          newGeneratedPrefix = '';
          this.Prefix = '';
        }
        else
          newGeneratedPrefix = 'EHVG' + this.getCurrentTime();
      }
      else if (terminaltype == "MCSCP") {//MCSC-Perishable(CSC -PER)
        // Vehicle	EVTP	EVTP2212010001
        // Trolley	ETRP	ETRP2212010001
        // By Hand	EPHP	EPHP2212010001

        if (vehicletype == "V")
          newGeneratedPrefix = 'EVTP' + this.getCurrentTime();
        else if (vehicletype == "T")
          newGeneratedPrefix = 'ETRP' + this.getCurrentTime();
        else if (vehicletype == "H")
          newGeneratedPrefix = 'EPHP' + this.getCurrentTime();
        else {
          newGeneratedPrefix = '';
          this.Prefix = '';
        }
      }

      else if (terminaltype == "AIGEN") {//AI-GEN
        // Vehicle	EVAG	EVAG2212010001
        // Trolley	ETAG	ETAG2212010001
        // By Hand	EHAG	EHAG2212010001

        if (vehicletype == "V")
          newGeneratedPrefix = 'EVAG' + this.getCurrentTime();
        else if (vehicletype == "T")
          newGeneratedPrefix = 'ETAG' + this.getCurrentTime();
        else if (vehicletype == "H")
          newGeneratedPrefix = 'EHAG' + this.getCurrentTime();

        else {
          newGeneratedPrefix = '';
          this.Prefix = '';
        }
      }
      else if (terminaltype == "AIAPD") {//AIAPD //AI-APEDA 


        // Vehicle	EVPG	EVPG2212010001
        // Trolley	ETPG	ETPG2212010001
        // By Hand	EHPG	EHPG2212010001

        if (vehicletype == "V")
          newGeneratedPrefix = 'EVPG' + this.getCurrentTime();
        else if (vehicletype == "T")
          newGeneratedPrefix = 'ETPG' + this.getCurrentTime();
        else if (vehicletype == "H")
          newGeneratedPrefix = 'EHPG' + this.getCurrentTime();
        else {
          newGeneratedPrefix = '';
          this.Prefix = '';
        }

      }
      else {
        newGeneratedPrefix = '';
        this.Prefix = '';
      }

      // console.log('generated  Prefix');
      // console.log('this.scannedBarCode = ' + this.scannedBarCode);
      // console.log('this.SannedToeknNo = ' + this.SannedToeknNo);
      // if (this.scannedBarCode != undefined)
      //   if (this.scannedBarCode != '') {
      //     console.log("(this.Prefix).substring(0, 4) == " + (this.Prefix).substring(0, 4));
      //     console.log("(this.scannedBarCode).substring(0, 4) == " + (this.scannedBarCode).substring(0, 4));

      //     if ((this.Prefix).substring(0, 4) != (this.scannedBarCode).substring(0, 4))
      //       this.MAWBNo = '';
      //   }

      // alert("this.Prefix = " + this.Prefix);
      // alert("this.newGeneratedPrefix = " + newGeneratedPrefix);

      if (this.Prefix == undefined || this.Prefix == '')
        this.Prefix = newGeneratedPrefix;
      else {

        console.log("************************  this.Prefix  is not blank ");
        console.log((this.Prefix).substring(4, 10));
        //console.log((newGeneratedPrefix).substring(4, 10));
        console.log(this.getCurrentTime());
        if ((this.Prefix).substring(0, 4) != (newGeneratedPrefix).substring(0, 4))
          this.Prefix = newGeneratedPrefix;
        else {

          if ((this.Prefix).substring(4, 10) == this.getCurrentTime())
            this.Prefix = newGeneratedPrefix;
        }
      }



      //this.setVTnTTByScannedNumber(this.Prefix);
    }
  }

  setVTnTTByScannedNumber(barcode: String) {
    //  // alert("*****  setVTnTTByScannedNumber function");
    console.log("************************  setVTnTTByScannedNumber function");
    var scannedcodePrefix = '', scannedcodePrefixWhole = '', scannedcodeOTP = '';
    //substring(0, 4) = EHVG
    //substring(0, 10) = EHVG221201 
    //substring(10, barcode.length)  0001
    //EVTG2301210001

    scannedcodePrefix = barcode.substring(0, 4);
    scannedcodePrefixWhole = barcode.substring(0, 10);
    scannedcodeOTP = barcode.substring(10, barcode.length);

    console.log("barcode= " + barcode);
    console.log("scannedcodePrefix =" + scannedcodePrefix);
    console.log("scannedcodePrefixWhole =" + scannedcodePrefixWhole);
    console.log("scannedcodeOTP =" + scannedcodeOTP);

    // alert("barcode= " + barcode);
    // alert("scannedcodePrefix =" + scannedcodePrefix);
    // alert("scannedcodePrefixWhole =" + scannedcodePrefixWhole);
    // alert("scannedcodeOTP =" + scannedcodeOTP);


    if (scannedcodePrefix == "EVTG")//MCSC - Light // vehicle

    {
      console.log("MCSC - Light // vehicle");
      this.selectedTerminalType = "MCSCL";
      this.selectedVehicleType = "V";
    }
    else if (scannedcodePrefix == "ETRG")//MCSC - Light // Trolley
    {
      console.log("MCSC - Light // Trolley");
      this.selectedTerminalType = "MCSCL";
      this.selectedVehicleType = "T";
    }
    else if (scannedcodePrefix == "EPHG")//MCSC - Light // By Hand
    {
      console.log("MCSC - Light // Hand");
      this.selectedTerminalType = "MCSCL";
      this.selectedVehicleType = "H";
    }
    else if (scannedcodePrefix == "EHVG")//MCSC - Heavy & Bonded  //  vehicle
    {
      console.log("MCSC - Heavy & Bonded //vehicle ");
      this.selectedTerminalType = "MCSCH";
      this.selectedVehicleType = "V";
    }
    else if (scannedcodePrefix == "EVTP")//MCSC – Perishable (CSC -PER) //  vehicle
    {
      console.log("MCSC-Perishable (CSC -PER) //  vehicle");
      this.selectedTerminalType = "MCSCP";
      this.selectedVehicleType = "V";
    }
    else if (scannedcodePrefix == "ETRP")//MCSC – Perishable (CSC -PER) // Trolley
    {

      console.log("MCSC- Perishable (CSC -PER) //  Trolley");
      this.selectedTerminalType = "MCSCP";
      this.selectedVehicleType = "T";
    }
    else if (scannedcodePrefix == "EPHP")//MCSC – Perishable (CSC -PER) // By Hand
    {

      console.log("MCSC- Perishable (CSC -PER) //  Hand");
      this.selectedTerminalType = "MCSCP";
      this.selectedVehicleType = "H";
    }
    else if (scannedcodePrefix == "EVAG")//AI-GEN //  vehicle
    {
      console.log("AI-GEN  //  vehicle");
      this.selectedTerminalType = "AIGEN";
      this.selectedVehicleType = "V";
    }
    else if (scannedcodePrefix == "ETAG")//AI-GEN // Trolley
    {
      console.log("AI-GEN  //  Trolley");
      this.selectedTerminalType = "AIGEN";
      this.selectedVehicleType = "T";
    }
    else if (scannedcodePrefix == "EHAG")//AI-GEN // By Hand
    {
      console.log("AI-GEN  //  Hand");
      this.selectedTerminalType = "AIGEN";
      this.selectedVehicleType = "H";
    }
    else if (scannedcodePrefix == "EVPG")//AI-APEDA //  vehicle
    {
      console.log("AI-APEDA  //  vehicle");
      this.selectedTerminalType = "AIAPD";
      this.selectedVehicleType = "V";
    }
    else if (scannedcodePrefix == "ETPG")//AI-APEDA // Trolley
    {
      console.log("AI-APEDA  //  Trolley");
      this.selectedTerminalType = "AIAPD";
      this.selectedVehicleType = "T";
    }
    else if (scannedcodePrefix == "EHPG")//AI-APEDA // By Hand
    {
      console.log("AI-APEDA  //  Hand");
      this.selectedTerminalType = "AIAPD";
      this.selectedVehicleType = "H";
    }
    else {
      console.log(" ");
    }

    console.log("scannedcodePrefixWhole + scannedcodeOTP == " + scannedcodePrefixWhole + scannedcodeOTP);

    // alert("scannedcodePrefixWhole + scannedcodeOTP == " + scannedcodePrefixWhole + scannedcodeOTP);

    this.Prefix = scannedcodePrefixWhole;
    this.MAWBNo = scannedcodeOTP;

    //  console.log(this.Prefix);
  }


  scanBarcodeTest() {

    // if (this.Prefix != 4)
    //   return;

    // alert("*****  scanBarcodeTest function");
    // alert(this.SannedToeknNo.toString());
    //  this.SannedToeknNumber = this.MAWBNo.toString();//+ this.hawb.toString();



    //return;

    if (this.Prefix == undefined || this.Prefix == '')
      return;

    if (this.MAWBNo == undefined || this.MAWBNo == '')
      return;


    console.log("************************  scanBarcodeTest function");
    console.log("startwithLetter in scanBarcodeTest= " + this.Prefix.substring(0, 1));
    if (this.Prefix.substring(0, 1) == "I") {
      alert("Kindly scan Import VT's in Import Token Scanning screen");
      this.Prefix = '';
      this.MAWBNo = '';
      return;
    }

    if (this.SannedToeknNo == undefined)
      return;

    console.log("SannedToeknNo = " + this.SannedToeknNo);
    this.scannedBarCode = this.SannedToeknNo.toString();
    console.log("this.scannedBarCode in scanBarcodeTest=" + this.scannedBarCode);
    // alert("this.scannedBarCode in scanBarcodeTest=" + this.scannedBarCode);
    // alert("this.SannedToeknNo in SannedToeknNo=" + this.SannedToeknNo);
    //alert(this.SannedToeknNo.length.toString());
    if (this.SannedToeknNo.length >= 13) {

      // this.setVTnTTByScannedNumber(this.scannedBarCode);
      // this._scanParams.pi_strUser = this._strUserName;
      // console.log(this.scannedBarCode);
      // this._scanParams.pi_strVTNo = this.scannedBarCode;
      // this.scan();


      this.setVTnTTByScannedNumber(this.SannedToeknNo);
      // alert(this.SannedToeknNo.length.toString());
      this._scanParams.pi_strUser = this._strUserName;
      console.log(this.SannedToeknNo);
      this._scanParams.pi_strVTNo = this.SannedToeknNo;
      this.scan();
    }

    // this._scanParams.pi_strUser = this._strUserName;
    // console.log(this.scannedBarCode);
    // this._scanParams.pi_strVTNo = this.scannedBarCode;
    // this.scan();
  }

  scanBarcode() {
    // alert("*****  scanBarcode function");
    console.log("************************  scanBarcode function");
    // return;

    this.barcodeScanner.scan({
      // beepOnScan: true, 
      // orientation: "landscape",     

      //formats: "QR_CODE,PDF_417",   // Pass in of you want to restrict scanning to certain types
      resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
    }).then((data) => {
      console.log("data = " + data.text);
      // alert("We got a barcode\n" +
      //   "Result: " + data.text + "\n" +
      //   "Format: " + data.format + "\n" +
      //   "Cancelled: " + data.cancelled);

      this.scannedBarCode = data.text;
      console.log("SannedToeknNo = " + this.scannedBarCode);
      console.log("startwithLetter = " + this.scannedBarCode.substring(0, 1));
      if (this.scannedBarCode.substring(0, 1) == "I") {
        alert("Kindly scan Import VT's in Import Token Scanning screen");
        this.Prefix = '';
        this.MAWBNo = '';
        return;
      }

      this.setVTnTTByScannedNumber(this.scannedBarCode);
      this._scanParams.pi_strUser = this._strUserName;
      console.log(this.scannedBarCode);
      this._scanParams.pi_strVTNo = this.scannedBarCode;
      this.scan();
    }, (err) => {
      console.log(err);
    })

  }

  getCurrentTime() {
    return moment().format('YYMMDD');
  }

  chkDisable(): boolean {

    return this.isDisableSelect;
  }



  scan() {
    // alert("*****  scan function");
    console.log("************************  scan function");
    // return;

    this.showDiv = false;
    //this.scannedBarCode = this.SannedToeknNo.toString();

    // alert("scan funtion this.Prefix + t/his.MAWBNo = " + this.Prefix + this.MAWBNo);

    this._scanParams.pi_strUser = this._strUserName;
    this._scanParams.pi_strVTNo = this.Prefix + this.MAWBNo;
    this.scannedBarCode = this.Prefix + this.MAWBNo;

    // alert("this.scannedBarCode in scan=" + this.scannedBarCode);

    // this._scanParams.pi_strUser = this._strUserName;
    // console.log(this.scannedBarCode);
    // this._scanParams.pi_strVTNo = this.scannedBarCode;

    this.userRole = this.global.get('userRole');

    console.log('user role === ' + this.userRole)
    this.http.getHttpPostRequest("ImpSearchTokenScanning_HHT", this._scanParams).then((response) => {
      // console.log(response['NewDataSet']['Table'][0]);
      if (response != null && response != "") {
        if (response.hasOwnProperty('NewDataSet')) {

          this.tableData = response['NewDataSet']['Table'][0];
          this.VehicleTrackResp = response['NewDataSet']['Table'][0];

          try {
            if (this.tableData.OutputMessage) {
              if (this.tableData.OutputMessage != "")
                this.global.showAlert(this.tableData.OutputMessage);
            }
            else if (this.tableData.OutputMessage[0]) {
              if (this.tableData.OutputMessage != "")
                this.global.showAlert(this.tableData.OutputMessage[0]);
            }
          } catch (err) {
            console.log(err.toString());
          }



          this.showDiv = true;
          console.log(this.VehicleTrackResp);
          console.log(this.tableData.IsGateIn);

          let blankdt = "";
          if (this.tableData.GateInDate[0] == "") {
            this.myGateInDate = blankdt;
          }
          else {
            var e1_GateInDate = moment(this.tableData.GateInDate[0]).format('DD MMM YYYY HH:mm');
            this.myGateInDate = e1_GateInDate;
          }

          if (this.tableData.GateOutDate[0] == "") {
            this.myGateOutDate = blankdt;
          }
          else {
            var e1_GateOutDate = moment(this.tableData.GateOutDate[0]).format('DD MMM YYYY HH:mm');
            this.myGateOutDate = e1_GateOutDate;
          }



          if (this.tableData.DockInDate[0] == "") {
            this.myDockInDate = blankdt;
          } else {
            var e1_DockInDate = moment(this.tableData.DockInDate[0]).format('DD MMM YYYY HH:mm');
            this.myDockInDate = e1_DockInDate;
          }

          if (this.tableData.DockOutDate[0] == "") {
            this.myDockOutDate = blankdt;
          } else {
            var e1_DockOutDate = moment(this.tableData.DockOutDate[0]).format('DD MMM YYYY HH:mm');
            this.myDockOutDate = e1_DockOutDate;
          }
        } else {
          this.global.showAlert(response['Root']['Output']);
          this.MAWBNo = '';
          this.scannedBarCode = '';
          this.Prefix = '';
          this.SannedToeknNo = '';
          this.generatePrefix(this.selectedVehicleType, this.selectedTerminalType);

        }
      }
    }, (error) => {
      this.global.showAlert(error);
    });
  }

  performEvent() {
    console.log("************************  performEvent function");

    //this.userRole =  this.global.get('userRole');
    // "IVT2202180001"; // code 128 IVT220218

    this.http.getHttpPostRequest("ImpTokenScanning_HHT", this._scanParams).then((response) => {
      // console.log(response['NewDataSet']['Table'][0]);
      if (response != null && response != "") {
        if (response.hasOwnProperty('NewDataSet')) {

          this.tableData = response['NewDataSet']['Table'][0];
          this.VehicleTrackResp = response['NewDataSet']['Table'][0];

          try {
            if (this.tableData.OutputMessage) {
              if (this.tableData.OutputMessage != "")
                this.global.showAlert(this.tableData.OutputMessage);
              // if (this.tableData.OutputMessage.toString().contains())
            }
            else if (this.tableData.OutputMessage[0]) {
              if (this.tableData.OutputMessage != "")
                this.global.showAlert(this.tableData.OutputMessage[0]);
            }
          } catch (err) {
            console.log(err.toString());
          }



          this.showDiv = true;
          console.log(this.VehicleTrackResp);
          console.log(this.tableData.IsGateIn);

          let blankdt = "";
          if (this.tableData.GateInDate[0] == "") {
            this.myGateInDate = blankdt;
          }
          else {
            var e1_GateInDate = moment(this.tableData.GateInDate[0]).format('DD MMM YYYY HH:mm');
            this.myGateInDate = e1_GateInDate;
          }

          if (this.tableData.GateOutDate[0] == "") {
            this.myGateOutDate = blankdt;
          }
          else {
            var e1_GateOutDate = moment(this.tableData.GateOutDate[0]).format('DD MMM YYYY HH:mm');
            this.myGateOutDate = e1_GateOutDate;
          }



          if (this.tableData.DockInDate[0] == "") {
            this.myDockInDate = blankdt;
          } else {
            var e1_DockInDate = moment(this.tableData.DockInDate[0]).format('DD MMM YYYY HH:mm');
            this.myDockInDate = e1_DockInDate;
          }

          if (this.tableData.DockOutDate[0] == "") {
            this.myDockOutDate = blankdt;
          } else {
            var e1_DockOutDate = moment(this.tableData.DockOutDate[0]).format('DD MMM YYYY HH:mm');
            this.myDockOutDate = e1_DockOutDate;
          }
        } else {
          console.log("This is message display else");
          this.global.showAlert(response['Root']['Output']);
          this.GetBarcodeDetails();
        }
      }
    }, (error) => {
      this.global.showAlert(error);
    });
  }

  clearInputs() {
    console.log("************************  clearInputs function");

    this.showDiv = false;
    this.MAWBNo = '';
    this.scannedBarCode = '';
    this.Prefix = '';
    this.SannedToeknNo = '';

    this.selectedTerminalType = "SL";
    this.selectedVehicleType = "S";



  }
}