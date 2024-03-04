import { IonicPage, NavController, NavParams } from 'ionic-angular';
export class ImportVehicle { pi_strMAWBNo: any; pi_strHAWBNo: any; pi_strUser: any; pi_chrModule: any }
export class TSPSerachClass { pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpProvider } from '../../providers/http/http';
import { GlobalProvider } from '../../providers/global/global';
import { Constants } from '../../constant';
export class scanClass { pi_strVTNo: any; pi_strUser: any }
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import moment from 'moment';

/**
 * Generated class for the ImportScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-import-scan',
  templateUrl: 'import-scan.html',
})
export class ImportScanPage {
  importVehicle: ImportVehicle
  Prefix: any;
  MAWBNo: any;
  SannedToeknNo: any;

  showAdditional: boolean = false;
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

  _scanParams: scanClass;
  encodedData: any;
  scannedBarCode: any;

  isAValid: boolean = false;
  isBValid: boolean = false;

  selectedVehicleType: String = '';
  selectedTerminalType: String = '';

  showBarcode: boolean = false;

  userRole: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpProvider, public global: GlobalProvider, private barcodeScanner: BarcodeScanner) {
    this.importVehicle = new ImportVehicle();
    this._scanParams = new scanClass()

    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "TOKEN SCANNING";
    this.showBarcode = false;

  }




  ngOnInit() {

    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    this.selectedTerminalType = "SL";
    this.selectedVehicleType = "S";
    // this.Prefix = 'IVTG' + this.getCurrentTime();
    //IVTG2212010001 -- 14
    //IVT2212010001 -- 13
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ImportScanPage');
    setTimeout(() => {
      this.MAWBInput.setFocus();
    }, 600)
  }



  onSelectChange(event) {
    this.MAWBNo = '';
    console.log('Selected', event);
    // if (event == "1")//Trolley
    //   this.Prefix = 'ITRG' + this.getCurrentTime();
    // else if (event == "2") // hand
    //   this.Prefix = 'IPHG' + this.getCurrentTime();
    // else // vehicle
    //   this.Prefix = 'IVTG' + this.getCurrentTime();
  }

  onSelectChangeVT(event) {
    // this.MAWBNo = '';
    console.log('Vehicle Type Selected', event);
    this.selectedVehicleType = event;
    this.generatePrefix(this.selectedVehicleType, this.selectedTerminalType);
  }

  onSelectChangeTT(event) {
    //  this.MAWBNo = '';
    console.log('Terminal Type Selected', event);
    this.selectedTerminalType = event;
    this.generatePrefix(this.selectedVehicleType, this.selectedTerminalType);
  }

  generatePrefix(vehicletype: String, terminaltype: String) {
    console.log("************************  generatePrefix function");
    console.log('vehicletype = ' + vehicletype);
    console.log('terminaltype = ' + terminaltype);
    var newGeneratedPrefix = '';
    this.showDiv = false;
    //this.MAWBNo = '';

    if (vehicletype != "" && terminaltype != "") {
      console.log('generatePrefix');

      if (terminaltype == "MIAL") {//MIAL
        // Vehicle	IVTG	IVTG2212010001
        // Trolley	ITRG	ITRG2212010001
        // By Hand	IPHG	IPHG2212010001

        if (vehicletype == "V")
          newGeneratedPrefix = 'IVTG' + this.getCurrentTime();
        else if (vehicletype == "T")
          newGeneratedPrefix = 'ITRG' + this.getCurrentTime();
        else if (vehicletype == "H")
          newGeneratedPrefix = 'IPHG' + this.getCurrentTime();
        else {
          newGeneratedPrefix = '';
          this.Prefix = '';
        }
      }
      else if (terminaltype == "AITL") {//Air India Terminal


        // Vehicle	AIIVTG	AIIVTG2212010001
        // Trolley	AIITRG	AIITRG2212010001
        // By Hand	AIIPHG	AIIPHG2212010001

        if (vehicletype == "V")
          newGeneratedPrefix = 'AIIVTG' + this.getCurrentTime();
        else if (vehicletype == "T")
          newGeneratedPrefix = 'AIITRG' + this.getCurrentTime();
        else if (vehicletype == "H")
          newGeneratedPrefix = 'AIIPHG' + this.getCurrentTime();
        else {
          newGeneratedPrefix = '';
          this.Prefix = '';
        }

      }
      else {
        newGeneratedPrefix = '';
        this.Prefix = '';
      }



      console.log('newGeneratedPrefix = ' + newGeneratedPrefix);
      console.log('this.Prefix = ' + this.Prefix);

      if (this.Prefix == undefined || this.Prefix == '')
        this.Prefix = newGeneratedPrefix;
      else {

        console.log("************************  this.Prefix  is not blank ");
        if (newGeneratedPrefix.substring(0, 1) == "A") {
          if ((this.Prefix).substring(0, 1) == "I")
            this.Prefix = newGeneratedPrefix;
          else {

            if ((this.Prefix).substring(0, 6) != (newGeneratedPrefix).substring(0, 6))
              this.Prefix = newGeneratedPrefix;
            else {
              console.log((this.Prefix).substring(6, 12));
              console.log(this.getCurrentTime());

              if ((this.Prefix).substring(6, 12) == this.getCurrentTime())
                this.Prefix = newGeneratedPrefix;
            }
          }
        }
        else {


          if ((this.Prefix).substring(0, 1) == "A")
            this.Prefix = newGeneratedPrefix;
          else {

            if ((this.Prefix).substring(0, 4) != (newGeneratedPrefix).substring(0, 4))
              this.Prefix = newGeneratedPrefix;
            else {
              console.log((this.Prefix).substring(4, 10));
              console.log(this.getCurrentTime());

              if ((this.Prefix).substring(4, 10) == this.getCurrentTime())
                this.Prefix = newGeneratedPrefix;
            }
          }
        }
      }


      //  this.setVTnTTByScannedNumber(this.Prefix);
    }
  }

  setVTnTTByScannedNumber(barcode: String) {

    console.log("************************  setVTnTTByScannedNumber function");
    var scannedcodePrefix = '', scannedcodePrefixWhole = '', scannedcodeOTP = '';

    if (barcode.startsWith("A")) {
      scannedcodePrefix = barcode.substring(0, 6);
      scannedcodePrefixWhole = barcode.substring(0, 12);
      scannedcodeOTP = barcode.substring(12, barcode.length);
    }
    else {
      scannedcodePrefix = barcode.substring(0, 4);
      scannedcodePrefixWhole = barcode.substring(0, 10);
      scannedcodeOTP = barcode.substring(10, barcode.length);
    }

    console.log("barcode= " + barcode);
    console.log("scannedcodePrefix =" + scannedcodePrefix);
    console.log("scannedcodePrefixWhole =" + scannedcodePrefixWhole);
    console.log("scannedcodeOTP =" + scannedcodeOTP);

    if (scannedcodePrefix == "IVTG")//MIAL // vehicle
    {
      console.log("MIAL // vehicle");
      this.selectedTerminalType = "MIAL";
      this.selectedVehicleType = "V";
    }
    else if (scannedcodePrefix == "ITRG")//MIAL // Trolley
    {
      console.log("MIAL // Trolley");
      this.selectedTerminalType = "MIAL";
      this.selectedVehicleType = "T";
    }
    else if (scannedcodePrefix == "IPHG")//MIAL // By Hand
    {
      console.log("MIAL // By Hand");
      this.selectedTerminalType = "MIAL";
      this.selectedVehicleType = "H";
    }
    else if (scannedcodePrefix == "AIIVTG")//Air India Terminal  //  vehicle
    {
      console.log("Air India Terminal // vehicle");
      this.selectedTerminalType = "AITL";
      this.selectedVehicleType = "V";
    }
    else if (scannedcodePrefix == "AIITRG")//Air India Terminal //  Trolley
    {
      console.log("Air India Terminal // Trolley");
      this.selectedTerminalType = "AITL";
      this.selectedVehicleType = "T";
    }
    else if (scannedcodePrefix == "AIIPHG")//Air India Terminal // By Hand
    {

      console.log("Air India Terminal // By Hand");
      this.selectedTerminalType = "AITL";
      this.selectedVehicleType = "H";
    }

    else {
      console.log(" ");
    }

    console.log("scannedcodePrefixWhole + scannedcodeOTP == " + scannedcodePrefixWhole + scannedcodeOTP);
    this.Prefix = scannedcodePrefixWhole;
    this.MAWBNo = scannedcodeOTP;
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
      if (this.Prefix.substring(0, 1) == "E") {
        alert("Kindly scan Export VT's in Export Token Scanning screen");
        this.Prefix = 'IVTG' + this.getCurrentTime();
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
    // console.log($event);
    this.hawb = $event;

    this.SannedToeknNo = $event.value.toString().toUpperCase();
    console.log("SannedToeknNo = " + this.SannedToeknNo);

    // if (this.SannedToeknNo.toString().start)

    //   var startwithLetter = "E";//this.SannedToeknNo.substring(0, 1);
    //   console.log("startwithLetter = " + this.PrefixInput.text.substring(0, 1));
    // if (startwithLetter == "E") {
    //   alert("Kindly scan export Vt's in Export Toek Scanning screen");
    //   return;
    // }

    if (this.SannedToeknNo.length == 13) {
      this.Prefix = this.MAWBNo.substring(0, 9);
      this.MAWBNo = this.MAWBNo.substring(9, 13);
    }

    if (this.SannedToeknNo.length == 14) {
      this.Prefix = this.MAWBNo.substring(0, 10);
      this.MAWBNo = this.MAWBNo.substring(10, 14);
    }

    if (this.SannedToeknNo.length == 16) {
      this.Prefix = this.MAWBNo.substring(0, 12);
      this.MAWBNo = this.MAWBNo.substring(12, 16);
    }


    // this.SannedToeknNo = this.Prefix.toString() + this.MAWBNo.toString();
    // console.log("SannedToeknNo = " + this.SannedToeknNo);


    if (this.Prefix == undefined || this.Prefix == '')
      return;

    if (this.MAWBNo == undefined || this.MAWBNo == '')
      return;

    this.SannedToeknNo = this.Prefix.toString() + this.MAWBNo.toString();
    console.log("SannedToeknNo = " + this.SannedToeknNo);


    if (this.Prefix.substring(0, 2) == "AI") {
      if (this.SannedToeknNo.length > 15)
        this.scanBarcodeTest();
    }
    else {
      if (this.SannedToeknNo.length > 13)
        this.scanBarcodeTest();
    }
  }

  focusNextInput($event) {
    console.log($event.value.toString());


    this.Prefix = $event.value.toString().toUpperCase();

    if (this.Prefix.substring(0, 2) == "AI") {
      if (this.Prefix.length > 11) {
        this.MAWBInput.setFocus();
      }
    }
    else
      if (this.Prefix.length > 9) {
        this.MAWBInput.setFocus();
      }



    if (this.Prefix == undefined || this.Prefix == '')
      return;

    if (this.MAWBNo == undefined || this.MAWBNo == '')
      return;

    this.SannedToeknNo = this.Prefix.toString() + this.MAWBNo.toString();
    console.log("SannedToeknNo = " + this.SannedToeknNo);
  }

  // showmsg()
  // {
  //   if (this.MAWBNo >=13)
  //   alert("this is showing msg " + this.MAWBNo);
  // }

  scanBarcodeTest() {

    if (this.Prefix == undefined || this.Prefix == '')
      return;

    if (this.MAWBNo == undefined || this.MAWBNo == '')
      return;

    console.log("************************  scanBarcodeTest function");
    console.log("startwithLetter in scanBarcodeTest= " + this.Prefix.substring(0, 1));
    if (this.Prefix.substring(0, 1) == "E") {
      alert("Kindly scan Export VT's in Export Token Scanning screen");
      this.Prefix = '';
      this.MAWBNo = '';
      return;
    }
    // console.log(this.SannedToeknNo);

    if (this.SannedToeknNo == undefined)
      return;

    // alert(this.SannedToeknNo.toString());
    //  this.SannedToeknNumber = this.MAWBNo.toString();//+ this.hawb.toString();
    console.log("SannedToeknNo = " + this.SannedToeknNo);

    this.scannedBarCode = this.SannedToeknNo.toString();
    // alert(this.SannedToeknNo.length.toString());
    if (this.SannedToeknNo.length >= 13) {
      this.setVTnTTByScannedNumber(this.SannedToeknNo);
      //  alert(this.SannedToeknNo.length.toString());
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
    console.log("************************  scanBarcode function");
    this.barcodeScanner.scan({ resultDisplayDuration: 500, }).then((data) => {



      // alert("We got a barcode\n" +
      //   "Result: " + data.text + "\n" +
      //   "Format: " + data.format + "\n" +
      //   "Cancelled: " + data.cancelled);

      this.scannedBarCode = data.text;
      console.log("SannedToeknNo = " + this.scannedBarCode);
      console.log("startwithLetter = " + this.scannedBarCode.substring(0, 1));
      if (this.scannedBarCode.substring(0, 1) == "E") {
        alert("Kindly scan Export VT's in Export Token Scanning screen");
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


  scan() {
    console.log("************************  scan function");

    this.userRole = this.global.get('userRole');
    // "IVT2202180001"; // code 128 IVT220218

    this.showDiv = false;
    //this.scannedBarCode = this.SannedToeknNo.toString();

    this._scanParams.pi_strUser = this._strUserName;
    this._scanParams.pi_strVTNo = this.Prefix + this.MAWBNo;
    this.scannedBarCode = this.Prefix + this.MAWBNo;

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


          // if (this.tableData.GateInDate[0]) {
          //   let d_GateInDate = (new Date(this.tableData.GateInDate[0]).toDateString()).substring(4);
          //   let e_GateInDate = this.tableData.GateInDate[0].substring(11, 16);
          //   let s_GateInDate = d_GateInDate.substring(4, 6).concat(" ").concat(d_GateInDate.substring(0, 3)).concat(" ");
          //   let e1_GateInDate = s_GateInDate.concat(d_GateInDate.substring(7, 11)).concat(" ").concat(e_GateInDate);
          //   this.myGateInDate = e1_GateInDate;
          // }

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

          // if (this.tableData.GateOutDate[0]) {
          //   let d_GateOutDate = (new Date(this.tableData.GateOutDate[0]).toDateString()).substring(4);
          //   let e_GateOutDate = this.tableData.GateOutDate[0].substring(11, 16);
          //   let s_GateOutDate = d_GateOutDate.substring(4, 6).concat(" ").concat(d_GateOutDate.substring(0, 3)).concat(" ");
          //   let e1_GateOutDate = s_GateOutDate.concat(d_GateOutDate.substring(7, 11)).concat(" ").concat(e_GateOutDate);
          //   this.myGateOutDate = e1_GateOutDate;
          // }

          // if (this.tableData.DockOutDate[0]) {
          //   let d_DockOutDate = (new Date(this.tableData.DockOutDate[0]).toDateString()).substring(4);
          //   let e_DockOutDate = this.tableData.DockOutDate[0].substring(11, 16);
          //   let s_DockOutDate = d_DockOutDate.substring(4, 6).concat(" ").concat(d_DockOutDate.substring(0, 3)).concat(" ");
          //   let e1_DockOutDate = s_DockOutDate.concat(d_DockOutDate.substring(7, 11)).concat(" ").concat(e_DockOutDate);
          //   this.myDockOutDate = e1_DockOutDate;
          // }

          // if (this.tableData.DockInDate[0]) {
          //   let d_DockInDate = (new Date(this.tableData.DockInDate[0]).toDateString()).substring(4);
          //   let e_DockInDate = this.tableData.DockInDate[0].substring(11, 16);
          //   let s_DockInDate = d_DockInDate.substring(4, 6).concat(" ").concat(d_DockInDate.substring(0, 3)).concat(" ");
          //   let e1_DockInDate = s_DockInDate.concat(d_DockInDate.substring(7, 11)).concat(" ").concat(e_DockInDate);
          //   this.myDockInDate = e1_DockInDate;
          // }
        } else {
          this.global.showAlert(response['Root']['Output']);
          // this.MAWBNo = '';
          // this.scannedBarCode = '';
          // this.Prefix = '';
          // this.SannedToeknNo = '';
          this.generatePrefix(this.selectedVehicleType, this.selectedTerminalType);

          // this.global.showAlert("Token no. is invalid.");
          // this.errorMsg = response['Root']['Output'].toString();
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
      console.log(response);
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

    // this.showDiv = false;
    // this.MAWBNo = '';

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