import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpProvider } from '../../../../providers/http/http';
import { Constants } from '../../../../constant';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { VTDashboard } from './VT-Dashboard';
import { HttpClient } from '@angular/common/http';
import { VTGenerateBarCode } from './VT-Generate-BarCode';
import { AIBarcode } from './AI-Barcode';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { IfObservable } from 'rxjs/observable/IfObservable';

export class VehicleToken {
  pieces: number = 0;
  GrWt: number = 0;
  vehicleNo: any = '';
  driverName: any = '';
  licenseNo: any = '';
  mobNo: any = '';
  IsConsignee: any = '';
  shedType: any = 'Air India Terminal';
}
export class VTGenerate {
  pi_strVehicleDetailsXML: any; pi_strClearanceType: any;
  pi_strGPIGMDetailsXML: any; pi_strCreatedBy: any;
  Pi_IsVehicle: any;
}

@Component({
  selector: 'Vehicle-Tokens-AirIndia',
  templateUrl: 'Vehicle-Tokens-AirIndia.html'
})

export class VehicleTokensAirIndia implements OnInit {
  ActiveGPList: any;
  unchecked: boolean;
  vehicleNo: string;
  private _strUserName: any;
  PackDetailXML: string;
  ActiveGPList1d: any[];
  licenseNo: string;
  driverName: string;
  mobNo: string;
  readOnly: boolean;
  MAWBNo: any;
  HAWbNo: any;
  GrWt: any = '';
  Pieces: any = '';
  ActiveGPList1D: any[];
  title: string;
  myFilesXML: any = [];
  myFilesNewXML: any;
  _VTGenerate: any;
  clickedGP: boolean;
  clickedVehicle: boolean;
  objshedType: any;
  shedType: any;
  tokenNumber: any;
  tokenError: any;
  VTNoMsg: string;
  driverDeatailXL: string;
  GPNo: any = '';
  userForm: FormGroup;
  strVehicleNo: string;
  GPButton: any = 0;
  IsConsignee: boolean;
  allValues: string = '<VehicleDetailsInfo>';
  VHNoArr: any = [];
  ShedNameArr: any = [];
  ShedNameArrForShow: any = [];
  VNFormat: string;
  OTPFinal: any;
  smsSendMNo: any;
  addVDisabled: any = 1;
  @ViewChild('textAr') textAre;
  mobNoArr: any = [];
  isConsigneeArr: any = [];
  addVehiclebtn: boolean;
  vehicleNoSms: void;
  ionViewWillEnter() {
    console.log("ionViewWillEnter : ");
    this.unchecked = false;
    this.IsConsignee = false;
    this.addVehiclebtn = false;
  }

  ngOnInit() {
    this.getprefix_forshed();
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    //this.sendSMS();
  }

  private form: FormGroup;
  constructor(public httpClient: HttpClient, private formBuilder: FormBuilder, public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private fb: FormBuilder) {
    this.form = this.formBuilder.group({
      GPNo: ['', Validators.required],
      Pieces: ['', Validators.required],
      GrWt: ['', Validators.required],
      vehicleNo: ['', Validators.required],
      driverName: ['', Validators.required],
      licenseNo: ['', Validators.required],
      mobNo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      IsConsignee: ['', Validators.required],
      shedType: ['', Validators.required],
    });
    this.title = "Shipment and Driver Details";
    this._VTGenerate = new VTGenerate();
    this.userForm = this.fb.group({
      name: [],
      GPNo: this.fb.array([
        this.fb.control(null)
      ]),
      Pieces: this.fb.array([
        this.fb.control(null)
      ]),
      GrWt: this.fb.array([
        this.fb.control(null)
      ])
    })
  }
  ionViewDidLoad() {
    setTimeout(() => {
      this.textAre.setFocus();
    }, 500)
  }
  logForm() {
    console.log(this.form.value)
  }

  isVehicleAdded: any = 0
  objVT: VehicleToken = new VehicleToken();
  objVTGrWT: number = 0
  objVTPieces: number = 0
  arrayVehicleToken: Array<VehicleToken> = new Array<VehicleToken>();
  addVehicle() {

    this.addVehiclebtn = true;

    if (this.objVT.vehicleNo == '') {
      this.global.showAlert("Please enter Vehicle Number.");
      return;
    }
    if (this.objVT.driverName == '') {
      this.global.showAlert("Please enter Driver Name.");
      return;
    }
    if (this.objVT.licenseNo == '') {
      this.global.showAlert("Please enter License Number.");
      return;
    }
    if (this.objVT.mobNo == '') {
      this.global.showAlert("Please enter Mobile Number.");
      return;
    }
    if (this.objVT.IsConsignee == '' || this.objVT.IsConsignee == undefined) {
      this.objVT.IsConsignee = this.IsConsignee
    }


    let objVTArray: VehicleToken
    objVTArray = new VehicleToken();
    objVTArray.driverName = this.objVT.driverName;
    objVTArray.licenseNo = this.objVT.licenseNo;
    objVTArray.mobNo = this.objVT.mobNo;
    objVTArray.shedType = this.objVT.shedType;
    objVTArray.vehicleNo = this.objVT.vehicleNo;
    objVTArray.IsConsignee = this.objVT.IsConsignee;
    console.log(objVTArray)

    this.smsSendMNo = this.objVT.mobNo;
    this.objVTGrWT = Number(this.objVTGrWT) + Number(objVTArray.GrWt)
    this.objVTPieces = Number(this.objVTPieces) + Number(objVTArray.pieces)
    this.arrayVehicleToken.push(objVTArray);

    this.allValues += '<VehicleDet VehicleNo="' + objVTArray.vehicleNo + '" DriverLicenceNo="' + objVTArray.licenseNo + '" DriverName="' + objVTArray.driverName + '" DriverMobileNo="' + objVTArray.mobNo + '" AdditionalMobileNo="' + objVTArray.mobNo + '" Pkgs="' + this.Pieces + '" GrWt="' + this.GrWt + '" Remarks="' + this.GPNo + '" />';
    this.objVT = new VehicleToken();
    this.global.showAlert("Vehicle details added successfully.");
    //this.GPButton = 1;

    this.VHNoArr.push(objVTArray.vehicleNo)
    this.ShedNameArr.push(objVTArray.shedType)
    this.ShedNameArrForShow.push(objVTArray.shedType)
    this.mobNoArr.push(objVTArray.mobNo)
    this.isConsigneeArr.push(objVTArray.IsConsignee)

    // if (Number(objVTArray.GrWt) + Number(this.objVTGrWT) == Number(this.GrWt) || Number(objVTArray.pieces) + Number(this.objVTPieces) == Number(this.Pieces)) {
    //   this.GPButton = 1;
    //   return;
    // }

  }



  addVehicleForSingle() {


    if (this.GPNo == '') {
      this.global.showAlert("Please enter GP Number.");
      return;
    }

    if (this.Pieces == 0) {
      this.global.showAlert("Please enter Pieces.");
      return;
    }

    if (this.GrWt == 0) {
      this.global.showAlert("Please enter GrWt.");
      return;
    }
    if (this.objVT.vehicleNo == '') {
      this.global.showAlert("Please enter Vehicle Number.");
      return;
    }
    if (this.objVT.driverName == '') {
      this.global.showAlert("Please enter Driver Name.");
      return;
    }
    if (this.objVT.licenseNo == '') {
      this.global.showAlert("Please enter License Number.");
      return;
    }
    if (this.objVT.mobNo == '') {
      this.global.showAlert("Please enter Mobile Number.");
      return;
    }

    let objVTArray: VehicleToken
    objVTArray = new VehicleToken();
    objVTArray.driverName = this.objVT.driverName;
    objVTArray.licenseNo = this.objVT.licenseNo;
    objVTArray.mobNo = this.objVT.mobNo;
    objVTArray.shedType = this.objVT.shedType;
    objVTArray.vehicleNo = this.objVT.vehicleNo;
    objVTArray.IsConsignee = this.objVT.IsConsignee;
    console.log(objVTArray)

    this.smsSendMNo = this.objVT.mobNo;
    this.objVTGrWT = Number(this.objVTGrWT) + Number(objVTArray.GrWt)
    this.objVTPieces = Number(this.objVTPieces) + Number(objVTArray.pieces)
    this.arrayVehicleToken.push(objVTArray);

    this.allValues += '<VehicleDet VehicleNo="' + objVTArray.vehicleNo + '" DriverLicenceNo="' + objVTArray.licenseNo + '" DriverName="' + objVTArray.driverName + '" DriverMobileNo="' + objVTArray.mobNo + '" AdditionalMobileNo="' + objVTArray.mobNo + '" Pkgs="' + this.Pieces + '" GrWt="' + this.GrWt + '" Remarks="' + this.GPNo + '" />';

    this.VHNoArr.push(objVTArray.vehicleNo)
    this.ShedNameArr.push(objVTArray.shedType)
    this.ShedNameArrForShow.push(objVTArray.shedType)
    this.mobNoArr.push(objVTArray.mobNo)
    this.isConsigneeArr.push(objVTArray.IsConsignee)
    this.addVehiclebtn = true;

  }

  onChange(e: any) {

    if (e.checked == true) {
      this.objVT.IsConsignee = true;

    } else {
      this.objVT.IsConsignee = false;
    }
    console.log(e);
    console.log(e.checked);
  }
  // addGP() {
  //   this.clickedGP = true;


  // }
  addGP(): void {
    (this.userForm.get('GPNo') as FormArray).push(
      this.fb.control(null)
    ),
      (this.userForm.get('Pieces') as FormArray).push(
        this.fb.control(null)
      ),
      (this.userForm.get('GrWt') as FormArray).push(
        this.fb.control(null)
      );
  }


  // addVehicle() {
  //   this.clickedVehicle = true;

  // }

  IMPCreateToken_HHT() {
    // if(this.addVehiclebtn==false)
    // {
    //    this.addVehicleForSingle();
    //    return;
    //  }
    this.addVehicleForSingle();

    setTimeout(() => {
      // this.strVehicleNo = this.vehicleNo.replace(/\s/g, "");
      //this.driverDeatailXL = '<VehicleDetailsInfo><VehicleDet VehicleNo="' + this.strVehicleNo + '" DriverLicenceNo="' + this.licenseNo + '" DriverName="' + this.driverName + '" DriverMobileNo="' + this.mobNo + '" AdditionalMobileNo="' + this.mobNo + '" Pkgs="' + this.Pieces + '" GrWt="' + this.GrWt + '" Remarks="' + this.GPNo + '" /></VehicleDetailsInfo>';
      this.allValues += '</VehicleDetailsInfo>';
      // this.myFilesNewXML = this.myFilesXML.join('');
      // console.log('<FileList>' + this.myFilesNewXML + '</FileList>')
      //this.PackDetailXML = '<GPDetails>' + this.myFilesNewXML + '</GPDetails>';

      this._VTGenerate.pi_strVehicleDetailsXML = this.allValues;
      this._VTGenerate.pi_strClearanceType = this.ShedNameArr.toString();//'Air India Terminal';//this.shedType;
      this._VTGenerate.pi_strGPIGMDetailsXML = '<GPDetails></GPDetails>';//this.PackDetailXML;
      this._VTGenerate.pi_strCreatedBy = this._strUserName;
      this._VTGenerate.Pi_IsVehicle = "V";
      this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.IMPCreateToken_HHT_VTGen, this._VTGenerate).then((response) => {
        console.log(response)
        if (response != null && response != "") {

          this.tokenError = response['Root']['Output'].toString();
          var vtstr = this.tokenError;
          this.OTPFinal = vtstr.substring(11, 15);
          if (this.tokenError.startsWith("A")) {

            this.VTNoMsg = this.tokenError;

            var barcodeArr = this.tokenError.split(',');
            console.log(barcodeArr);

            localStorage.setItem('comeVT', barcodeArr);

            localStorage.setItem('gadiNo', this.VHNoArr);
            localStorage.setItem('Shed', this.ShedNameArrForShow);

            for (var i = 0; i < this.isConsigneeArr.length; i++) {
              if (this.isConsigneeArr[i] == true) {
                var vToken = barcodeArr[i];
                var OTP = barcodeArr[i].substring(11, 15);
                var str = this.VHNoArr[i];
                var VehNo = str.substring(0, 2) + ' ' + str.substring(2, 4) + ' ' + str.substring(4, 6) + ' ' + str.substring(6, 10)
                var mobNo = this.mobNoArr[i];
                this.sendSMS(vToken, OTP, VehNo, mobNo);
              }
            }
            this.global.routePage(AIBarcode);
          } else {
            this.VTNoMsg = this.tokenError;
            this.showConfirmForVT();
          }


        } else {
          //this.global.showAlert("Record not found.");
        }
      }, (error) => {
        console.log(error);
      });
    }, 500)
  }



  mobileChange(event) {
    if (this.objVT.mobNo.length != 10) {
      this.objVT.mobNo = '';
      this.global.showAlert("Please enter valid 10 digit Mobile No.");
      return;
    }
  }



  showConfirmForVT() {
    let confirm = this.alertCtrl.create({
      title: this.VTNoMsg,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.global.routePage(VTDashboard);
          }
        }
      ]
    });
    confirm.present();
  }



  getprefix_forshed() {
    //
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.getprefix_forshed).then((response) => {
      if (response != null && response != "") {
        console.log(response)
        this.objshedType = response['NewDataSet']['Table'];
        this.shedType = 0;//this.objshedType[0]['ITC_CLEARANCE_NAME'].toString();

      } else {
        // this.global.showAlert("Record not found.");
      }
    }, (error) => {
      console.log(error);
    });
  }


  onServiceTypeChange(event) {
    this.shedType = event;
    // this.isInputDisabled();
  }

  clearInputs() {
    this.Pieces = '';
    this.GrWt = '';
    // this.vehicleNo = '';
    // this.driverName = '';
    // this.licenseNo = '';
    // this.mobNo = '';
    // this.IsConsignee = false;
    // this.shedType = 0;
    this.GPNo = '';
    this.objVT = new VehicleToken();
  }

  // Just to animate the fab
  fabGone = false;


  ionViewWillLeave() {
    this.fabGone = true;
  }



  sendSMS(vToken, OTP, VehNo, mobNo) {
    this.http.post('http://sms.hspsms.com/sendSMS?username=kalelogistics&message= Vehicle Token Number ' + vToken + ' and OTP ' + OTP + ' has been generated against Vehicle Number ' + VehNo + '. Kindly disclose the VT Number to the security staff for entry to the cargo complex.&sendername=VUPLIF&smstype=TRANS&numbers=' + mobNo + '&apikey=1a49629b-664b-4b62-a609-ca254956b301',
      //this.http.post('http://sms.hspsms.com/sendSMS?username=kalelogistics&message="Vehicle Token Number 123456789  has been generated against Vehicle Number 123456789 . Kindly disclose the VT Number to the security staff for entry to the cargo complex."&sendername=VUPLIF&smstype=TRANS&numbers=9960588510&apikey=1a49629b-664b-4b62-a609-ca254956b301',
    )
      .then(data => {

        console.log(data);

      }, error => {
        console.log(error);
      });
  }

  special_charVN(event) {

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.objVT.vehicleNo)) {
      this.objVT.vehicleNo = '';
      this.global.showAlert("Please enter only standard alpha numerics in Vehicle Number.");
      return false;
    }
    if (this.objVT.vehicleNo.match(' ')) {
      this.objVT.vehicleNo = '';
      this.global.showAlert('Spaces not allowed in Vehicle Number.');
      return false;
    }

    // var patternVN = new RegExp("^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$"); //unacceptable chars
    // if (!patternVN.test(this.objVT.vehicleNo)) {
    //   this.objVT.vehicleNo = '';
    //   this.global.showAlert("Please enter valid format in Vehicle Number viz MH04BY3668.");
    //   return false;
    // }

    var patternVN = new RegExp("^[A-Z]{2}[0-9]{2}[A-Z]{1}[0-9]{4}$"); 
    var patternVN1 = new RegExp("^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$"); 
       if (!patternVN1.test(this.objVT.vehicleNo)) 
       if (!patternVN.test(this.objVT.vehicleNo)) {

           this.objVT.vehicleNo = '';
      this.global.showAlert("Please enter valid format in Vehicle Number viz MH04BY3668.");
      return false;
    }

  }


  special_charDN(event) {

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.objVT.driverName)) {
      this.objVT.driverName = '';
      this.global.showAlert("Please enter only standard alpha numerics in Driver Name.");
      return false;
    }

  }

  special_charLN(event) {

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.objVT.licenseNo)) {
      this.objVT.licenseNo = '';
      this.global.showAlert("Please enter only standard alpha numerics in Licence Number.");
      return false;
    }

  }

  special_charGP(event) {

    if (this.GPNo.indexOf(',') != -1) {
      this.addVDisabled = 0;
    } else {
      this.addVDisabled = 1;
    }


    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';/{}|\\":<>.\?]/); //unacceptable chars
    if (pattern.test(this.GPNo)) {
      this.GPNo = '';
      this.global.showAlert("Please enter only standard alpha numerics in Vehicle Number.");
      return false;
    }
    if (this.GPNo.match(' ')) {
      this.GPNo = '';
      this.global.showAlert('Spaces not allowed in Vehicle Number.');
      return false;
    }


  }

}
