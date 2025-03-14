
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpProvider } from '../../../../providers/http/http';
import { Constants } from '../../../../constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VehicleTokens } from './Vehicle-Tokens';
import { VTGenerateBarCode } from './VT-Generate-BarCode';

//export class TSPSerachClass { pi_chrSearchParam: any; pi_strTSPNo: any; pi_strMAWBNo: any; pi_strHAWBNo: any; po_strMessage: any; po_chrAlert: any }
export class VTGenerate {
  pi_strVehicleDetailsXML: any; pi_strClearanceType: any;
  pi_strGPIGMDetailsXML: any; pi_strCreatedBy: any;
  Pi_IsVehicle: any;
}


@Component({
  selector: 'Vehicle-Token-DriverDetails',
  templateUrl: 'Vehicle-Token-DriverDetails.html'
})

export class VehicleTokenDriverDetails implements OnInit {
  ActiveGPList: any;
  unchecked: boolean;
  _VTGenerate: VTGenerate;
  vehicleNo: string;
  private _strUserName: any;
  PackDetailXML: string;
  ActiveGPList1d: any[];
  licenseNo: string;
  driverName: string;
  mobNo: string;
  addmobNo: string;
  myFilesXML: any = [];
  myFilesNewXML: any;
  title: string;
  objshedType: any;
  shedType: any;
  notify: boolean;
  driverDeatailXL: string;
  tokenNumber: any;
  tokenError: any;
  VTNoMsg: string;
  GrWt: string;
  pieces: string;
  strVehicleNo: string;
  pcsTotal: any = [];
  wtTotal: any = [];
  sumOfpcs: any;
  sumOfwt: any;
  OTPFinal: any;
  VNFormat: string;
  IsConsignee: boolean = false;

  selectedOption;

  // freeze: boolean;
  @ViewChild('vehicleN') vehic;
  ionViewWillEnter() {
    console.log("ionViewWillEnter : ");
    this.unchecked = false;
  }

  ngOnInit() {
    this.ActiveGPList = JSON.parse(localStorage.getItem("ActiveGPList"));
    console.log('test for -----****-----', this.ActiveGPList);

    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    this.getprefix_forshed();
    var sunoftotal = "";
    for (var i = 0; i < this.ActiveGPList.length; i++) {
      // if(this.ActiveGPList[i] != null){
      for (var j = 0; j < this.ActiveGPList[i].length; j++) {
        this.pcsTotal.push(parseInt(this.ActiveGPList[i][j].Pieces));
        this.wtTotal.push(parseFloat(this.ActiveGPList[i][j].GrWt));
      }
    // } // if end
    }
    this.sumOfpcs = this.pcsTotal.reduce((acc, cur) => acc + cur);
    this.sumOfwt = this.wtTotal.reduce((acc, cur) => acc + cur);
    console.log(this.sumOfpcs)
    console.log(this.sumOfwt)

    // this.freeze = false;
  }

  private form: FormGroup;

  constructor(private formBuilder: FormBuilder, public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {
    this.form = this.formBuilder.group({
      vehicleNo: ['', Validators.required],
      driverName: ['', Validators.required],
      licenseNo: ['', Validators.required],
      mobNo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      addmobNo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      notify: ['', Validators.required],
      shedType: ['', Validators.required],
    });
    this.title = "Vehicle Token Driver Details";
    this._VTGenerate = new VTGenerate();
  }
  ionViewDidLoad() {
    this.selectedOption = 'V';
    setTimeout(() => {
      this.vehic.setFocus();
    }, 500)
  }
  logForm() {
    console.log(this.form.value)
  }

  onDeliveryOptionSelected(event){
    console.log('Delivery option selected: ', event);
    this.selectedOption = event;

    if(this.selectedOption == 'H'){
      this.vehicleNo = '----------';
    } else {
      this.vehicleNo = '';
    }
  }


  IMPCreateToken_HHT() {

    if (this.shedType == '0') {
      this.global.showAlert("Please select Shed.");
      return;
    }

    this.strVehicleNo = this.vehicleNo.replace(/\s/g, "");
    // this.driverDeatailXL = '<VehicleDetailsInfo><VehicleDet VehicleNo="' + this.strVehicleNo + '" DriverLicenceNo="' + this.licenseNo + '" DriverName="' + this.driverName + '" DriverMobileNo="' + this.mobNo + '" AdditionalMobileNo="' + this.mobNo + '" Pkgs="' + '1' + '" GrWt="' + '1' + '" Remarks="" /></VehicleDetailsInfo>';
    for (var i = 0; i < this.ActiveGPList.length; i++) {
      for (var j = 0; j < this.ActiveGPList[i].length; j++) {



        this.myFilesXML.push('<Data GDRowID="' + this.ActiveGPList[i][j].GPId + '" Pkgs="' + this.ActiveGPList[i][j].Pieces + '" GrWt="' + this.ActiveGPList[i][j].GrWt + '" ChWt="' + this.ActiveGPList[i][j].GrWt + '" />');
        this.driverDeatailXL = '<VehicleDetailsInfo><VehicleDet VehicleNo="' + this.strVehicleNo + '" DriverLicenceNo="' + this.licenseNo + '" DriverName="' + this.driverName + '" DriverMobileNo="' + this.mobNo + '" AdditionalMobileNo="' + this.addmobNo + '" Pkgs="' + this.sumOfpcs + '" GrWt="' + this.sumOfwt + '" Remarks="" /></VehicleDetailsInfo>';

      }
    }

    this.myFilesNewXML = this.myFilesXML.join('');
    console.log('<FileList>' + this.myFilesNewXML + '</FileList>')
    this.PackDetailXML = '<GPDetails>' + this.myFilesNewXML + '</GPDetails>';


    this._VTGenerate.pi_strVehicleDetailsXML = this.driverDeatailXL;
    this._VTGenerate.pi_strClearanceType = this.shedType.trim();
    this._VTGenerate.pi_strGPIGMDetailsXML = this.PackDetailXML;
    this._VTGenerate.pi_strCreatedBy = this._strUserName;
    // this._VTGenerate.Pi_IsVehicle = "V";
    this._VTGenerate.Pi_IsVehicle = this.selectedOption;
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.IMPCreateToken_HHT_VTGen, this._VTGenerate).then((response) => {
      console.log(response)
      if (response != null && response != "") {

        this.tokenError = response['Root']['Output'].toString();

        var vtstr = this.tokenError;
        this.OTPFinal = vtstr.substring(9, 13);

        if (this.tokenError.startsWith("I")) {
          // this.VTNoMsg = 'VT No. ' + this.tokenError + ' has been generated successfully.'
          this.sendSMS();
          this.VTNoMsg = this.tokenError;
          localStorage.setItem('comeVT', this.tokenError);
          localStorage.setItem('gadiNo', this.vehicleNo);
          localStorage.setItem('Shed', this.shedType);

          var str = this.vehicleNo.toString();
          this.VNFormat = str.substring(0, 2) + ' ' + str.substring(2, 4) + ' ' + str.substring(4, 6) + ' ' + str.substring(6, 10)
          if (this.IsConsignee == true) {
            this.sendSMS();
          }
          // this.showConfirmForVT(); //new
          this.showSuccessForVT();
          this.global.routePage(VTGenerateBarCode);
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
  }


  onChange(e: any) {

    if (e.checked == true) {
      this.IsConsignee = true;

    } else {
      this.IsConsignee = false;
    }
    console.log(e);
    console.log(e.checked);
  }

  // freezeShed(){
  //   this.freeze = true;
  //   console.log('shed status: ', this.freeze);
  // }

  showConfirmForVT() {
    let confirm = this.alertCtrl.create({
      title: this.VTNoMsg,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.global.routePage(VehicleTokens);
          }
        }
      ]
    });
    confirm.present();
  }

  showSuccessForVT() {
    let confirm = this.alertCtrl.create({
      // title: this.VTNoMsg,
      title: 'Token Generated Successfully',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // this.global.routePage(VTGenerateBarCode);
          }
        }
      ]
    });
    confirm.present();
  }


  getprefix_forshed() {
    // debugger
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.getprefix_forshed).then((response) => {
      if (response != null && response != "") {
        console.log(response)
        this.objshedType = response['NewDataSet']['Table'];
        this.shedType = 0;//this.objshedType[0]['ITC_CLEARANCE_NAME'].toString();
        this.objshedType =
          this.objshedType.filter(
            HAWB => HAWB.ITC_CLEARANCE_NAME != 'AIR INDIA'
          );
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
    this.pieces = '';
    this.GrWt = '';
    this.vehicleNo = '';
    this.driverName = '';
    this.licenseNo = '';
    this.mobNo = '';
    this.addmobNo = '';
    this.notify = false;
    this.shedType = 0;
  }

  // Just to animate the fab
  fabGone = false;


  ionViewWillLeave() {
    this.fabGone = true;
  }


  sendSMS() {

    if(this.selectedOption == 'V'){
      this.http.post('http://sms.hspsms.com/sendSMS?username=kalelogistics&message=Token Number ' + this.tokenError + ' and OTP ' + this.OTPFinal + ' has been generated against Vehicle Number ' + this.strVehicleNo + '. Kindly disclose the Token Number to the security staff for entry to the cargo complex.&sendername=VUPLIF&smstype=TRANS&numbers=' + this.mobNo + '&apikey=1a49629b-664b-4b62-a609-ca254956b301',)
      .then(data => {

        console.log(data);

      }, error => {
        console.log(error);
      });
    }
    if(this.selectedOption == 'T'){
      this.http.post('http://sms.hspsms.com/sendSMS?username=kalelogistics&message=Token Number ' + this.tokenError + ' and OTP ' + this.OTPFinal + ' has been generated against Trolley Number ' + this.strVehicleNo + '. Kindly disclose the Token Number to the security staff for entry to the cargo complex.&sendername=VUPLIF&smstype=TRANS&numbers=' + this.mobNo + '&apikey=1a49629b-664b-4b62-a609-ca254956b301',)
      .then(data => {

        console.log(data);

      }, error => {
        console.log(error);
      });
    }
    if(this.selectedOption == 'H'){
      this.http.post('http://sms.hspsms.com/sendSMS?username=kalelogistics&message=Token Number ' + this.tokenError + ' and OTP ' + this.OTPFinal + ' has been generated for By Hand Delivery' + '. Kindly disclose the Token Number to the security staff for entry to the cargo complex.&sendername=VUPLIF&smstype=TRANS&numbers=' + this.mobNo + '&apikey=1a49629b-664b-4b62-a609-ca254956b301',)
      .then(data => {

        console.log(data);

      }, error => {
        console.log(error);
      });
    }

    //old code
    // this.http.post('http://sms.hspsms.com/sendSMS?username=kalelogistics&message=Vehicle Token Number ' + this.tokenError + ' and OTP ' + this.OTPFinal + ' has been generated against Vehicle Number ' + this.strVehicleNo + ' . Kindly disclose the VT Number to the security staff for entry to the cargo complex.&sendername=VUPLIF&smstype=TRANS&numbers=' + this.mobNo + '&apikey=1a49629b-664b-4b62-a609-ca254956b301',
    //   //this.http.post('http://sms.hspsms.com/sendSMS?username=kalelogistics&message="Vehicle Token Number 123456789  has been generated against Vehicle Number 123456789 . Kindly disclose the VT Number to the security staff for entry to the cargo complex."&sendername=VUPLIF&smstype=TRANS&numbers=9960588510&apikey=1a49629b-664b-4b62-a609-ca254956b301',
    // )
    //   .then(data => {

    //     console.log(data);

    //   }, error => {
    //     console.log(error);
    //   });
  }



  special_charVN(event) {

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.vehicleNo)) {
      this.vehicleNo = '';
      this.global.showAlert("Please enter only standard alpha numerics in Vehicle Number.");
      return false;
    }
    if (this.vehicleNo.match(' ')) {
      this.vehicleNo = '';
      this.global.showAlert('Spaces not allowed in Vehicle Number.');
      return false;
    }

    // var patternVN = new RegExp("^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$"); //unacceptable chars
    // if (!patternVN.test(this.vehicleNo)) {
    //   this.vehicleNo = '';
    //   this.global.showAlert("Please enter valid format in Vehicle Number viz MH04BY3668.");
    //   return false;
    // }

 //var patternVN = new RegExp("^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$"); //unacceptable chars
 var patternVN = new RegExp("^[A-Z]{2}[0-9]{2}[A-Z]{1}[0-9]{4}$"); 
 var patternVN1 = new RegExp("^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$"); 
    if (!patternVN1.test(this.vehicleNo)) 
    if (!patternVN.test(this.vehicleNo)) {
      this.vehicleNo = '';
      this.global.showAlert("Please enter valid format in Vehicle Number viz MH04BY3668.");
      return false;
    }
    


  }

  special_charTN(event) {

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.vehicleNo)) {
      this.vehicleNo = '';
      this.global.showAlert("Please enter only standard alpha numerics in Trolley Number.");
      return false;
    }
    if (this.vehicleNo.match(' ')) {
      this.vehicleNo = '';
      this.global.showAlert('Spaces not allowed in Trolley Number.');
      return false;
    }

    var patternVN = new RegExp("^[A-Z]{2}[a-zA-Z0-9]{2}[0-9]{4}$"); //unacceptable chars
    if (!patternVN.test(this.vehicleNo)) {
      this.vehicleNo = '';
      this.global.showAlert("Please enter valid format in Trolley Number viz TR4A1234.");
      return false;
    }


  }


  special_charDN(event) {

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.\?]/); //unacceptable chars
    if (pattern.test(this.driverName)) {
      this.driverName = '';
      this.global.showAlert("Please enter only standard alpha numerics in Driver Name.");
      return false;
    }

  }

  special_charLN(event) {

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.\?]/); //unacceptable chars
    if (pattern.test(this.licenseNo)) {
      this.licenseNo = '';
      this.global.showAlert("Please enter only standard alpha numerics in Licence Number.");
      return false;
    }

  }

  mobileChange(event) {
    if (this.mobNo.length != 10) {
      this.mobNo = '';
      this.global.showAlert("Please enter valid 10 digit Mobile No.");
      return;
    }

    if (this.addmobNo.length != 10) {
      this.addmobNo = '';
      this.global.showAlert("Please enter valid 10 digit Mobile No.");
      return;
    }
  }

}
