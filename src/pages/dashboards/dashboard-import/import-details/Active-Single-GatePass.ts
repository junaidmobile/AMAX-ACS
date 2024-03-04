import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, Platform, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpProvider } from '../../../../providers/http/http';
import { Constants } from '../../../../constant';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { VehicleTokens } from './Vehicle-Tokens';
import { VTGenerateBarCode } from './VT-Generate-BarCode';
export class VehicleToken {
  pieces: number = 0;
  GrWt: any = 0;
  vehicleNo: any = '';
  driverName: any = '';
  licenseNo: any = '';
  mobNo: any = '';
  addmobNo: any = '';
  IsConsignee: any = '';
  shedType: any;
}
export class VTGenerate {
  pi_strVehicleDetailsXML: any; pi_strClearanceType: any;
  pi_strGPIGMDetailsXML: any; pi_strCreatedBy: any;
  Pi_IsVehicle: any;
}

@Component({
  selector: 'Active-Single-GatePass',
  templateUrl: 'Active-Single-GatePass.html'
})

export class ActiveSingleGatePass implements OnInit {
  ActiveGPList: any;
  unchecked: boolean;
  vehicleNo: any = '';
  private _strUserName: any;
  PackDetailXML: string;
  ActiveGPList1d: any[];
  licenseNo: any = '';
  driverName: any = '';
  mobNo: any = '';
  addmobNo: any = '';
  readOnly: boolean;
  MAWBNo: any;
  HAWbNo: any;
  GrWt: any;
  Pieces: number;
  ActiveGPList1D: any[];
  title: string;
  @ViewChild('piecesval') _pcs;
  myFilesNewXML: any;
  _VTGenerate: any;
  shedType: any;
  objshedType: any;
  GPId: any;
  tokenNumber: any;
  tokenError: any;
  VTNoMsg: string;
  pieces: any;
  strVehicleNo: string;
  GrWtFor: any;
  PiecesFor: any;
  GrWtShow: any;
  PiecesShow: any;
  GPButton: any = 0;
  IsConsignee: boolean;
  allValues: string = '<VehicleDetailsInfo>';
  prefixFor: string = '<VehicleDetailsInfo>';
  myFilesXML: any = [];// = '<GPDetails>';
  VHNoArr: any = [];
  ShedNameArr: any = [];
  OTPFinal: any;
  VNFormat: string;
  smsSendMNo: string;
  vehicleDisable: any = 0;
  shed: void;
  isConsigneeArr: any = [];
  mobNoArr: any = [];
  addmobNoArr: any = [];
  addVehiclebtn: boolean;
  allWTSum: any;

  displayPieces = 0;
  displayWt = 0;

  // vtDetails = 0;
  vtDetails: any = 0;

  freeze: boolean;

  edPieces;
  edGrWt;
  edVTNop;
  edVTWt;
  edVehicleNo;
  edDriverName;
  edLicenseNo;
  edMobile;
  edAddMobile;
  edShed;
  edHAWB;
  edAWB;

  edGPID;
  // edPieces;
  // edGRWT;
  edToken;
  edTokenSuff;

  selectedOption;

  tempVehicle;

  oneGPMultiVT: any = 0;


  objVTArray2;

  addedPkgs: any = 0;
  addedGrWT: any = 0;

  ionViewWillEnter() {
    console.log("ionViewWillEnter : ");
    this.unchecked = false;
    this.IsConsignee = false;
    this.addVehiclebtn = false;

    this.objVT.pieces = this.PiecesShow;
    this.objVT.GrWt = this.GrWtShow;

    console.log("ionViewWillEnter : ", this.objVT.pieces);


    // this.selectedOption == 'hand';


    // console.log('Vt Details from previous page: ', this.vtDetails);
    // console.log('Pieces***** Details from previous page: ', this.vtDetails[0].Pieces);
    // this.edPieces = this.vtDetails[0].Pieces;


    // this.calculateRemaining();
  }
  ngOnInit() {
    this.ActiveGPList = JSON.parse(localStorage.getItem("ActiveGPList"));
    console.log("****ActiveGPList****", this.ActiveGPList);
    //this.GetImpActiveGPDetails_HHT();
    this.readOnly = true;
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    this.ActiveGPList1D = [].concat(...this.ActiveGPList);

    if (this.vtDetails != 0) {
      this.vtDetails = this.navParams.get('vtDetails');
      console.log('check for vehicle type: ', this.vtDetails[0].TokenNo);

      this.oneGPMultiVT = this.navParams.get('oneGPMultiVT');
      console.log('check for edit module here as well: ', this.oneGPMultiVT);
    }

    if (this.vtDetails == 0) {
      this.MAWBNo = this.ActiveGPList1D[0].MAWbNo;
      this.HAWbNo = this.ActiveGPList1D[0].HAWBNo;

      this.GrWt = this.ActiveGPList1D[0].GrWt;
      this.Pieces = this.ActiveGPList1D[0].Pieces;

      this.GrWtShow = this.ActiveGPList1D[0].GrWt;
      this.PiecesShow = this.ActiveGPList1D[0].Pieces;

      this.GrWtFor = this.ActiveGPList1D[0].GrWt;
      this.PiecesFor = this.ActiveGPList1D[0].Pieces;

      // this.ActiveGPList1D[0].GPId
      this.GPId = this.ActiveGPList1D[0].GPId;
    } //if end
    this.getprefix_forshed();

    this.objVT.pieces = this.PiecesShow;
    this.objVT.GrWt = this.GrWtShow;

    console.log("ngOnInt : ", this.objVT.pieces);
    // this.GPButton = 1;

    this.freeze = false;

    if (this.global.edTokenFlag != 1) {
      this.selectedOption = "V";
    }


  }

  public vForm: FormGroup;
  constructor(private formBuilder: FormBuilder, public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, public navParams: NavParams) {
    this.vForm = this.formBuilder.group({

      pieces: ['', Validators.required],
      GrWt: ['', Validators.required],
      vehicleNo: ['', Validators.required],
      driverName: ['', Validators.required],
      licenseNo: ['', Validators.required],
      mobNo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      addmobNo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      IsConsignee: ['', Validators.required],
      shedType: ['', Validators.required],
      entPieces: new FormControl('', Validators.required),
      entWt: new FormControl('', Validators.required)
    });
    this.title = "Token Details";
    this._VTGenerate = new VTGenerate();

    this.MAWBNo = this.navParams.get('MAWBNo');

    console.log('passed MAWBNo: ', this.MAWBNo);

  }
  logForm() {
    console.log(this.vForm.value)
  }


  ionViewDidEnter() {

    if (this.global.edTokenFlag != 1) { //new if
      this.objVT.pieces = this.PiecesShow;
      this.objVT.GrWt = this.GrWtShow;

      // this.displayPieces = this.PiecesShow;
      // this.displayWt = this.GrWtShow;

      this.global.showPieces = this.PiecesShow;
      this.global.showWt = this.GrWtShow;

      this.selectedOption = 'V'; //new on 01/03

    } //new if ends


    console.log('ionViewDidEnter: ', this.objVT.pieces);
    console.log('ionViewDidEnter: ', this.objVT.GrWt);

    if (this.global.edTokenFlag == 1) {
      this.vtDetails = this.navParams.get('vtDetails');
      console.log('check for vehicle type 2****: ', this.vtDetails);

      console.log('check the length of vtDetails: ', this.vtDetails.length);

      this.oneGPMultiVT = this.navParams.get('oneGPMultiVT');
      console.log('check for vehicle type 3****: ', this.oneGPMultiVT);

      this.edToken = this.vtDetails[0].TokenNo;
      this.edTokenSuff = this.vtDetails[0].TokenNo[0].slice(0, 3);
      if (this.edTokenSuff == 'IVT') {
        this.selectedOption = 'V';
      } else if (this.edTokenSuff == 'IPH') {
        this.selectedOption = 'H';
      } else if (this.edTokenSuff == 'ITR') {
        this.selectedOption = 'T';
      }
      this.showDataForEdit();
      this.objVT.pieces = this.edPieces;
      this.objVT.GrWt = this.edGrWt;

    }

    // if(this. == 1){
    //   this.vtDetails = this.navParams.get('vtDetails');
    //   this.showDataForEdit();
    // }

    // if(this.vtDetails != 0 ){
    //   this.showDataForEdit();
    // }

    // this.calculateRemaining();

  }


  showDataForEdit() {

    // console.log(' this.vtDetails[0]');
    // console.log( this.vtDetails[0]);

    this.edPieces = this.vtDetails[0].Pieces;
    this.edGrWt = this.vtDetails[0].GrWt;
    this.edDriverName = this.vtDetails[0].DriverName;
    this.objVT.driverName = this.vtDetails[0].DriverName
    this.edMobile = this.vtDetails[0].DriverMobNo;
    this.objVT.mobNo = this.vtDetails[0].DriverMobNo;
    this.edAddMobile = this.vtDetails[0].DriverMobNo;
    this.objVT.addmobNo = this.vtDetails[0].DriverMobNo;
    this.edLicenseNo = this.vtDetails[0].LicenceNo;
    this.objVT.licenseNo = this.vtDetails[0].LicenceNo;
    this.edShed = this.vtDetails[0].Shed;
    this.edVTNop = this.vtDetails[0].VTPieces;
    this.edVTWt = this.vtDetails[0].VTGrWt;
    this.tempVehicle = this.vtDetails[0].VehicleNo;
    this.edVehicleNo = this.tempVehicle.toString().replace(/\s/g, "");
    this.objVT.vehicleNo = this.vtDetails[0].VehicleNo;
    this.edHAWB = this.vtDetails[0].HAWBNo;
    this.edAWB = this.vtDetails[0].MAWBNo;

    this.objVT.shedType = this.vtDetails[0].Shed;

    this.edGPID = this.vtDetails[0].GPId;
    console.log('test for vehicle no.: ', this.edVehicleNo);
    console.log('test for Token no.: ', this.vtDetails[0].TokenNo);

    console.log('test for Token no.: ', this.vtDetails[0]);

  }

  // ionViewDidLoad() {
  //   setTimeout(() => {
  //     this._pcs.setFocus();
  //   }, 500)
  // }

  onChange(e: any) {
    console.log("onchanged");
    if (e.checked == true) {
      this.IsConsignee = true;

    } else {
      this.IsConsignee = false;
    }
    console.log(e);
    console.log(e.checked);
  }

  freezeShed() {
    this.freeze = true;
    console.log('shed status: ', this.freeze);
  }

  onDeliveryOptionSelected(event) {
    console.log('Delivery option selected: ', event);
    this.selectedOption = event;
  }

  showAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // this.global.routePage(VTGenerateBarCode);
            this.freeze = false;
            // this.checkShed();
          }
        }
      ]
    });
    return alert.present();
  }



  isVehicleAdded: any = 0
  objVT: VehicleToken = new VehicleToken();
  objVTGrWT: any = 0;
  objVTPieces: number = 0;
  arrayVehicleToken: Array<VehicleToken> = new Array<VehicleToken>();

  //check shed freeze/unfreeze
  checkShed() {
    this.objVTArray2 = new VehicleToken();
    if (Object.keys(this.objVTArray2).length == 7) {
      console.log('One length of objVTArray: ', Object.keys(this.objVTArray2).length);
      console.log('--------', this.objVTArray2);
      this.freeze = false;
    } //new ends
    //new if condition for shed
    else if (Object.keys(this.objVTArray2).length == 8) {
      console.log('One length of objVTArray: ', Object.keys(this.objVTArray2).length);
      console.log('--------', this.objVTArray2);
      this.freeze = true;
    } //new ends



  }
  addVehicle(isVehicleAdded: any) {
    this.addVehiclebtn = true;
    debugger
    if (isVehicleAdded == 1) {

      if (this.objVT.pieces == 0) {
        this.global.showAlert("Please enter Pieces.");
        return;
      }
      if (this.objVT.GrWt == 0) {
        this.global.showAlert("Please enter GrWt.");
        return;
      }
      // new block for shed
      this.objVTArray2 = new VehicleToken();
      if (Object.keys(this.objVTArray2).length == 7) {
        console.log('One length of objVTArray: ', Object.keys(this.objVTArray2).length);
        console.log('--------', this.objVTArray2);
        this.addVehiclebtn = false;
        // this.freeze = false;
      } //new ends

      // if (this.displayPieces == 0) {
      //   this.global.showAlert("Please enter Pieces.");
      //   return;
      // }
      // if (this.displayWt == 0) {
      //   this.global.showAlert("Please enter GrWt.");
      //   return;
      // }
      if (this.selectedOption == 'V') {
        if (this.objVT.vehicleNo == '') {
          this.global.showAlert("Please enter Vehicle Number.");
          // this.showAlert("Please enter Vehicle Numberrrr.");
          return;
        }
        if (this.objVT.driverName == '') {
          this.global.showAlert("Please enter Driver Name.");
          // this.showAlert("Please enter Driver Name.");
          return;
        }
        if (this.objVT.licenseNo == '') {
          this.global.showAlert("Please enter License Number.");
          // this.showAlert("Please enter License Number.");
          return;
        }
        if (this.objVT.mobNo == '') {
          this.global.showAlert("Please enter Mobile Number.");
          // this.showAlert("Please enter Mobile Number.");
          return;
        }
      }

      if (this.selectedOption == 'H') {
        // if (this.objVT.vehicleNo == '') {
        //   this.global.showAlert("Please enter Vehicle Number.");
        //   return;
        // }
        if (this.objVT.driverName == '') {
          this.global.showAlert("Please enter Operator Name.");
          // this.showAlert("Please enter Operator Name.");
          return;
        }
        if (this.objVT.licenseNo == '') {
          this.global.showAlert("Please enter MIAL Cargo Entry Permit Number.");
          // this.showAlert("Please enter MIAL Cargo Entry Permit Number.");
          return;
        }
        if (this.objVT.mobNo == '') {
          this.global.showAlert("Please enter Mobile Number.");
          // this.showAlert("Please enter Mobile Number.");
          return;
        }
      }

      if (this.selectedOption == 'T') {
        if (this.objVT.vehicleNo == '') {
          this.global.showAlert("Please enter Trolley Number.");
          // this.showAlert("Please enter Trolley Number.");
          return;
        }
        if (this.objVT.driverName == '') {
          this.global.showAlert("Please enter Operator Name.");
          // this.showAlert("Please enter Operator Name.");
          return;
        }
        if (this.objVT.licenseNo == '') {
          this.global.showAlert("Please enter MIAL Cargo Entry Permit Number.");
          // this.showAlert("Please enter MIAL Cargo Entry Permit Number.");
          return;
        }
        if (this.objVT.mobNo == '') {
          this.global.showAlert("Please enter Mobile Number.");
          // this.showAlert("Please enter Mobile Number.");
          return;
        }
      }

      // if (this.objVT.vehicleNo == '') {
      //   this.global.showAlert("Please enter Vehicle Number.");
      //   return;
      // }
      // if (this.objVT.driverName == '') {
      //   this.global.showAlert("Please enter Driver Name.");
      //   return;
      // }
      // if (this.objVT.licenseNo == '') {
      //   this.global.showAlert("Please enter License Number.");
      //   return;
      // }
      // if (this.objVT.mobNo == '') {
      //   this.global.showAlert("Please enter Mobile Number.");
      //   return;
      // }
      // above piece of code commented on 27/02

      if (this.objVT.shedType == undefined) {
        this.objVT.shedType = this.shed
      }
      if (this.objVT.IsConsignee == '' || this.objVT.IsConsignee == undefined) {
        this.objVT.IsConsignee = this.IsConsignee
      }

    }
    if ((isVehicleAdded == 0 && this.arrayVehicleToken.length == 0) || (isVehicleAdded == 1)) {


      let objVTArray: VehicleToken
      objVTArray = new VehicleToken();
      objVTArray.GrWt = this.objVT.GrWt;
      objVTArray.driverName = this.objVT.driverName;
      objVTArray.licenseNo = this.objVT.licenseNo;
      objVTArray.mobNo = this.objVT.mobNo;
      objVTArray.addmobNo = this.objVT.addmobNo;
      objVTArray.pieces = this.objVT.pieces;
      objVTArray.shedType = this.objVT.shedType;
      objVTArray.vehicleNo = this.objVT.vehicleNo;
      this.shed = objVTArray.shedType
      objVTArray.IsConsignee = this.objVT.IsConsignee;
      console.log("objVTArray===", objVTArray);

      this.objVTArray2 = new VehicleToken();
      this.objVTArray2 = objVTArray;
      console.log('two length of objVTArray: ', Object.keys(this.objVTArray2).length);

      console.log('test for multi shed: ', objVTArray.shedType);

      //new if condition for shed
      if (Object.keys(this.objVTArray2).length == 8) {
        console.log('One length of objVTArray: ', Object.keys(this.objVTArray2).length);
        console.log('--------', this.objVTArray2);
        // this.freeze = true;
        this.freezeShed();
      } //new ends

      var wtSum = parseFloat(this.objVTGrWT) + parseFloat(objVTArray.GrWt);
      this.allWTSum = wtSum.toFixed(2)
      if (this.allWTSum > parseFloat(this.GrWt) || (Number(this.objVTPieces) + Number(objVTArray.pieces)) > Number(this.Pieces)) {
        this.global.showAlert("VT NoP and Wt. is greater than NoP and weight of shipment.");
        return;
      }
      else {



        this.objVTGrWT = Number(this.objVTGrWT) + Number(objVTArray.GrWt)
        // this.GrWtShow=this.objVTGrWT;
        this.objVTPieces = Number(this.objVTPieces) + Number(objVTArray.pieces)
        // this.PiecesShow= this.objVTPieces;



        this.arrayVehicleToken.push(objVTArray);
        this.smsSendMNo = this.objVT.mobNo;
        // this.myFilesXML += '<Data GDRowID="' + this.GPId + '" Pkgs="' + this.objVT.pieces + '" GrWt="' + this.objVT.GrWt + '" ChWt="' + this.objVT.GrWt + '" />';


        if (this.global.edTokenFlag == 1) {
          this.allValues += '<VehicleDet TokenNo="' + this.vtDetails[0].TokenNo + '" VehicleNo="'
            + this.edVehicleNo + '" DriverLicenceNo="' + objVTArray.licenseNo + '" DriverName="'
            + objVTArray.driverName + '" DriverMobileNo="' + objVTArray.mobNo + '" AdditionalMobileNo="'
            + objVTArray.addmobNo + '" Pkgs="' + this.edVTNop + '" GrWt="' + this.edVTWt + '" Remarks="" IsNotifyMobile="' + this.objVT.IsConsignee + '" />';
        }
        //for edit module below if /for is new
        if (this.global.edTokenFlag == 1 && this.vtDetails.length == 1 && this.selectedOption != 'H') { //&& condition is new on 26/03
          for (let d of this.oneGPMultiVT) {
            if (this.tempVehicle != d.VehicleNo[0]) {
              console.log('not matched: ', d.VehicleNo[0])
              this.allValues += '<VehicleDet TokenNo="' + d.TokenNo + '" VehicleNo="' + d.VehicleNo.toString().replace(/\s/g, "")
                + '" DriverLicenceNo="' + d.LicenceNo + '" DriverName="' + d.DriverName + '" DriverMobileNo="' + d.DriverMobNo
                + '" AdditionalMobileNo="" Pkgs="' + d.VTPieces + '" GrWt="' + d.VTGrWt + '" Remarks="" IsNotifyMobile="' + this.objVT.IsConsignee + '" />';
            }
          }

        }

        //newly added for issue with BYHand edit token---147975
        if (this.global.edTokenFlag == 1 && this.vtDetails.length == 1 && this.selectedOption == 'H') { //&& condition is new on 26/03
          for (let d of this.oneGPMultiVT) {
            if (this.edToken != d.TokenNo[0]) {
              console.log('not matched: ', d.TokenNo[0])
              this.allValues += '<VehicleDet TokenNo="' + d.TokenNo + '" VehicleNo="'
                + d.VehicleNo.toString().replace(/\s/g, "") + '" DriverLicenceNo="' + d.LicenceNo + '" DriverName="'
                + d.DriverName + '" DriverMobileNo="' + d.DriverMobNo + '" AdditionalMobileNo="" Pkgs="' + d.VTPieces + '" GrWt="' + d.VTGrWt + '" Remarks="" IsNotifyMobile="' + this.objVT.IsConsignee + '" />';
            }
          }

        }


        console.log('check length here as well: ', this.vtDetails.length);
        //added on 26/03 of oneVTMultiGP
        if (this.global.edTokenFlag == 1 && this.vtDetails.length > 1) { //&& condition is new
          for (let d of this.vtDetails) {
            this.addedPkgs += parseInt(d.VTPieces);
            this.addedGrWT += parseInt(d.VTGrWt);
          }

          console.log('check total pkgs: ', this.addedPkgs);
          console.log('check total GrWt: ', this.addedGrWT);

          // this.allValues = this.prefixFor + '<VehicleDet TokenNo="' + d.TokenNo + '" VehicleNo="' + d.VehicleNo.toString().replace(/\s/g, "") + '" DriverLicenceNo="' + d.LicenceNo + '" DriverName="' + d.DriverName + '" DriverMobileNo="' + d.DriverMobNo + '" AdditionalMobileNo="" Pkgs="' + this.addedPkgs + '" GrWt="' + this.addedGrWT + '" Remarks="" />';

          this.allValues = this.prefixFor + '<VehicleDet TokenNo="' + this.vtDetails[0].TokenNo + '" VehicleNo="'
            + this.edVehicleNo + '" DriverLicenceNo="' + this.edLicenseNo + '" DriverName="' + this.edDriverName
            + '" DriverMobileNo="' + this.edMobile + '" AdditionalMobileNo="' + this.edAddMobile + '" Pkgs="' + this.addedPkgs + '" GrWt="'
            + this.addedGrWT + '" Remarks=""  IsNotifyMobile="' + this.objVT.IsConsignee + '"/>';
          //changes made on line 585 02/03 for tickbox/checkbox issue
        }
        // if(this.global.edTokenFlag != 1){
        //   this.allValues += '<VehicleDet VehicleNo="' + objVTArray.vehicleNo + '" DriverLicenceNo="' + objVTArray.licenseNo + '" DriverName="' + objVTArray.driverName + '" DriverMobileNo="' + objVTArray.mobNo + '" AdditionalMobileNo="" Pkgs="' + objVTArray.pieces + '" GrWt="' + objVTArray.GrWt + '" Remarks="" />';
        // }

        //new on 03/04
        if (this.global.edTokenFlag != 1 && this.selectedOption != 'T') { // && condition on 03/04
          this.allValues += '<VehicleDet VehicleNo="' + objVTArray.vehicleNo + '" DriverLicenceNo="' + objVTArray.licenseNo
            + '" DriverName="' + objVTArray.driverName + '" DriverMobileNo="' + objVTArray.mobNo + '" AdditionalMobileNo="'
            + objVTArray.addmobNo + '" Pkgs="' + objVTArray.pieces + '" GrWt="' + objVTArray.GrWt + '" Remarks="" IsNotifyMobile="' + this.objVT.IsConsignee + '" />';
        }

        //new on 03/04 for trolley number display
        if (this.global.edTokenFlag != 1 && this.selectedOption == 'T') {
          var txt2 = this.objVT.vehicleNo.slice(0, 4) + "--" + this.objVT.vehicleNo.slice(4, 8);
          console.log('test for trolley no.: ', txt2);
          this.allValues += '<VehicleDet VehicleNo="' + txt2 + '" DriverLicenceNo="' + objVTArray.licenseNo + '" DriverName="'
            + objVTArray.driverName + '" DriverMobileNo="' + objVTArray.mobNo + '" AdditionalMobileNo="' + objVTArray.addmobNo + '" Pkgs="'
            + objVTArray.pieces + '" GrWt="' + objVTArray.GrWt + '" Remarks="" IsNotifyMobile="' + this.objVT.IsConsignee + '" />';
        }

        //new on above

        this.objVT = new VehicleToken();


        this.VHNoArr.push(objVTArray.vehicleNo)
        this.ShedNameArr.push(objVTArray.shedType)
        this.isConsigneeArr.push(objVTArray.IsConsignee)
        this.mobNoArr.push(objVTArray.mobNo)
        this.addmobNoArr.push(objVTArray.addmobNo)
        // this.calculateRemaining(); // new added by Himesh on 28th October
        //  this.GPButton = 1;
        if (Number(this.objVTGrWT) == Number(this.GrWt) || Number(this.objVTPieces) == Number(this.Pieces)) {
          this.GPButton = 1;
          this.vehicleDisable = 1;
          //   return;
        } else {
          // this.global.showAlert("Vehicle details added successfully."); common message commented on 27/02
          if (this.selectedOption == 'V') {
            this.global.showAlert("Vehicle details added successfully.")
          }
          if (this.selectedOption == 'T') {
            this.global.showAlert("Trolley details added successfully.")
          }
          if (this.selectedOption == 'H') {
            this.global.showAlert("By Hand details added successfully.")
          }
          if (this.vtDetails == 0) {
            this.calculateRemaining();
          }
          if (this.vtDetails != 0) {
            this.GPButton = 1;
          }
          // this.calculateRemaining(); // new added by Himesh on 28th October
          //this.global.showAlert('Added Pieces = ' + this.objVTPieces + 'Added Weight = ' + this.objVTGrWT );
        }
      }
      // if (Number(objVTArray.GrWt) + Number(this.objVTGrWT) == Number(this.GrWt) || Number(objVTArray.pieces) + Number(this.objVTPieces) == Number(this.Pieces)) {
      //   this.GPButton = 1;
      //   return;
      // }
    }
  }

  sendDataForEdit() {
    for (let d of this.oneGPMultiVT) {
      if (this.vtDetails[0].VehicleNo != this.oneGPMultiVT[d]) {

      }
    }

  }





  onChangeNoP() {
    if (Number(this.objVT.GrWt) == Number(this.GrWt) && Number(this.objVT.pieces) == Number(this.Pieces)) {
      this.GPButton = 1;
      // return;
    } else {
      this.GPButton = 0;
    }
  }

  calculateRemaining() {

    //working for 2 VT's
    // this.objVT.pieces = this.PiecesShow - this.vForm.value.entPieces;
    // this.objVT.GrWt = this.GrWtShow - this.vForm.value.entWt;

    // console.log('test for 405: ', this.objVT.pieces);
    // this.objVT.pieces = this.objVT.pieces - this.vForm.value.entPieces;
    // this.objVT.GrWt = this.objVT.GrWt - this.vForm.value.entWt;

    console.log('test for 405: ', this.global.showPieces + ' ' + this.global.showWt);
    this.objVT.pieces = this.global.showPieces - this.vForm.value.entPieces;
    this.global.showPieces = this.objVT.pieces;
    this.objVT.GrWt = this.global.showWt - this.vForm.value.entWt;
    this.global.showWt = this.objVT.GrWt;

  }

  // below function added by Himesh on 11/11/2020 to enable/disbale generate VT button
  // for defect
  showButton() {
    if ((this.PiecesShow) == (this.vForm.value.entPieces) && (this.GrWtShow) == (this.vForm.value.entWt)) {
      this.GPButton = 1;
      this.vehicleDisable = 0;
    }
  }


  IMPCreateToken_HHT() {

    if (this.addVehiclebtn == false) {
      this.addVehicle(0);
      //  return;
    }

    // this.addVehicle(0);

    // setTimeout(() => {

    // this.myFilesXML.push('<Data GDRowID="' + this.GPId + '" Pkgs="' + this.Pieces + '" GrWt="' + this.GrWt + '" ChWt="' + this.GrWt + '" />');

    if (this.global.edTokenFlag == 1) {

      this.myFilesXML = '<Data GDRowID="' + this.edGPID + '" Pkgs="' + this.edPieces + '" GrWt="' + this.edGrWt + '" ChWt="' + this.edGrWt + '" />';
    }
    else if (this.global.edTokenFlag != 1) {
      this.myFilesXML = '<Data GDRowID="' + this.GPId + '" Pkgs="' + this.Pieces + '" GrWt="' + this.GrWt + '" ChWt="' + this.GrWt + '" />';
    }


    //  this.myFilesNewXML = this.myFilesXML.join('');
    // console.log('<FileList>' + this.myFilesNewXML + '</FileList>')
    //console.log("ShedNameArr===", this.ShedNameArr);

    //console.log(" this.objVT.shedType===", this.objVT.shedType);


    this.PackDetailXML = '<GPDetails>' + this.myFilesXML + '</GPDetails>';

    let unique = this.ShedNameArr.filter((item, i, ar) => ar.indexOf(item) === i);
    var shedStore = "";
    if (unique != null)
      if (unique.length > 0) {
        shedStore = unique[0];
      }

    // console.log("unique SHED");
    //console.log(shedStore);

    this.strVehicleNo = this.vehicleNo.replace(/\s/g, "");
    this.allValues += '</VehicleDetailsInfo>';
    this.myFilesXML += '</GPDetails>';
    this._VTGenerate.pi_strVehicleDetailsXML = this.allValues;// '<VehicleDetailsInfo><VehicleDet VehicleNo="' + this.strVehicleNo + '" DriverLicenceNo="' + this.licenseNo + '" DriverName="' + this.driverName + '" DriverMobileNo="' + this.mobNo + '" AdditionalMobileNo="" Pkgs="' + this.Pieces + '" GrWt="' + this.GrWt + '" Remarks="" /></VehicleDetailsInfo>';
    this._VTGenerate.pi_strClearanceType = shedStore// unique;//(this.ShedNameArr).toString();
    this._VTGenerate.pi_strGPIGMDetailsXML = this.PackDetailXML;
    this._VTGenerate.pi_strCreatedBy = this._strUserName;
    // this._VTGenerate.Pi_IsVehicle = "V";
    this._VTGenerate.Pi_IsVehicle = this.selectedOption;
    console.log("***** chnaged by shruti");
    console.log(this._VTGenerate)
   // return;

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.IMPCreateToken_HHT_VTGen, this._VTGenerate).then((response) => {
      console.log(response)
      if (response != null && response != "") {

        this.tokenError = response['Root']['Output'].toString();

        var vtstr = this.tokenError;
        this.OTPFinal = vtstr.substring(9, 13);


        if (this.tokenError.startsWith("I")) {

          this.objVT = new VehicleToken();
          this.VTNoMsg = this.tokenError;

          var barcodeArr = this.tokenError.split(',');
          console.log(barcodeArr);

          localStorage.setItem('comeVT', barcodeArr);

          // localStorage.setItem('comeVT', this.tokenError);
          localStorage.setItem('gadiNo', this.VHNoArr);
          localStorage.setItem('Shed', this.ShedNameArr);

          for (var i = 0; i < this.isConsigneeArr.length; i++) {
            if (this.isConsigneeArr[i] == true) {
              var vToken = barcodeArr[i];
              var OTP = barcodeArr[i].substring(9, 13);
              var str = this.VHNoArr[i];
              var VehNo = str.substring(0, 2) + ' ' + str.substring(2, 4) + ' ' + str.substring(4, 6) + ' ' + str.substring(6, 10)
              var mobNo = this.mobNoArr[i];
              var addmobNo = this.addmobNoArr[i];
              this.sendSMS(vToken, OTP, VehNo, mobNo);
              this.sendSMS(vToken, OTP, VehNo, addmobNo);
              // if (this.mobNoArr != null)
              //   if (this.mobNoArr.length > 0)
              //     if (this.mobNoArr.length >= 1) {
              //       var addmobNo = this.mobNoArr[1];
              //       this.sendSMS(vToken, OTP, VehNo, addmobNo);
              //     }

            }
          }
          // this.global.routePage(VTGenerateBarCode);
          this.showSuccessForVT();
          this.global.routePage(VTGenerateBarCode); // added on 12/11/2020 by Himesh as per Ankit's need
        } else {
          this.VTNoMsg = this.tokenError;
          this.showConfirmForVT();
          this.objVT = new VehicleToken();
        }


      } else {
        //this.global.showAlert("Record not found.");
      }
    }, (error) => {
      console.log(error);
    });
  }


  // new edit function
  IMPUpdateToken_HHT() {

    if (this.addVehiclebtn == false) {
      this.addVehicle(0);
      //  return;
    }
    //commented on 26/02

    //   if(this.selectedOption == 'V'){
    //   if (this.objVT.vehicleNo == '') {
    //     this.global.showAlert("Please enter Vehicle Number.....");
    //     return;
    //   }
    //   if (this.objVT.driverName == '') {
    //     this.global.showAlert("Please enter Driver Name.");
    //     return;
    //   }
    //   if (this.objVT.licenseNo == '') {
    //     this.global.showAlert("Please enter License Number.");
    //     return;
    //   }
    //   if (this.objVT.mobNo == '') {
    //     this.global.showAlert("Please enter Mobile Number.");
    //     return;
    //   }
    // }

    // if(this.selectedOption == 'H'){
    //   // if (this.objVT.vehicleNo == '') {
    //   //   this.global.showAlert("Please enter Vehicle Number.");
    //   //   return;
    //   // }
    //   if (this.objVT.driverName == '') {
    //     this.global.showAlert("Please enter Operator Name.");
    //     return;
    //   }
    //   if (this.objVT.licenseNo == '') {
    //     this.global.showAlert("Please enter MIAL Cargo Entry Permit Number.");
    //     return;
    //   }
    //   if (this.objVT.mobNo == '') {
    //     this.global.showAlert("Please enter Mobile Number.");
    //     return;
    //   }
    // }

    // if(this.selectedOption == 'T'){
    //   if (this.objVT.vehicleNo == '') {
    //     this.global.showAlert("Please enter Trolley Number.");
    //     return;
    //   }
    //   if (this.objVT.driverName == '') {
    //     this.global.showAlert("Please enter Operator Name.");
    //     return;
    //   }
    //   if (this.objVT.licenseNo == '') {
    //     this.global.showAlert("Please enter MIAL Cargo Entry Permit Number.");
    //     return;
    //   }
    //   if (this.objVT.mobNo == '') {
    //     this.global.showAlert("Please enter Mobile Number.");
    //     return;
    //   }
    // }

    // this.addVehicle(0);

    // setTimeout(() => {

    // this.myFilesXML.push('<Data GDRowID="' + this.GPId + '" Pkgs="' + this.Pieces + '" GrWt="' + this.GrWt + '" ChWt="' + this.GrWt + '" />');

    if (this.global.edTokenFlag == 1 && this.vtDetails.length == 1) {

      this.myFilesXML = '<Data GDRowID="' + this.edGPID + '" Pkgs="' + this.edPieces + '" GrWt="' + this.edGrWt + '" ChWt="' + this.edGrWt + '" />';
    }

    //new on 27/03 for tick issue 163033
    if (this.global.edTokenFlag == 1 && this.vtDetails.length > 1) {

      for (let d of this.vtDetails) {
        // if(this.objVT.vehicleNo != d.VehicleNo[0]){
        // console.log('not matched: ', d.VehicleNo[0])
        // this.allValues += '<VehicleDet TokenNo="' + d.TokenNo + '" VehicleNo="' + d.VehicleNo.toString().replace(/\s/g, "") + '" DriverLicenceNo="' + d.LicenceNo + '" DriverName="' + d.DriverName + '" DriverMobileNo="' + d.DriverMobNo + '" AdditionalMobileNo="" Pkgs="' + d.VTPieces + '" GrWt="' + d.VTGrWt + '" Remarks="" />';
        this.myFilesXML += '<Data GDRowID="' + d.GPId + '" Pkgs="' + d.VTPieces + '" GrWt="' + d.VTGrWt + '" ChWt="' + d.VTGrWt + '" />';
        // }
      }


    }

    else if (this.global.edTokenFlag != 1) {
      this.myFilesXML = '<Data GDRowID="' + this.GPId + '" Pkgs="' + this.Pieces + '" GrWt="' + this.GrWt + '" ChWt="' + this.GrWt + '" />';
    }


    //  this.myFilesNewXML = this.myFilesXML.join('');
    // console.log('<FileList>' + this.myFilesNewXML + '</FileList>')
    console.log("ShedNameArr===", this.ShedNameArr);
    this.PackDetailXML = '<GPDetails>' + this.myFilesXML + '</GPDetails>';

    this.strVehicleNo = this.vehicleNo.replace(/\s/g, "");
    this.allValues += '</VehicleDetailsInfo>';
    this.myFilesXML += '</GPDetails>';
    this._VTGenerate.pi_strVehicleDetailsXML = this.allValues;// '<VehicleDetailsInfo><VehicleDet VehicleNo="' + this.strVehicleNo + '" DriverLicenceNo="' + this.licenseNo + '" DriverName="' + this.driverName + '" DriverMobileNo="' + this.mobNo + '" AdditionalMobileNo="" Pkgs="' + this.Pieces + '" GrWt="' + this.GrWt + '" Remarks="" /></VehicleDetailsInfo>';
    this._VTGenerate.pi_strClearanceType = (this.edShed).toString();
    this._VTGenerate.pi_strGPIGMDetailsXML = this.PackDetailXML;
    this._VTGenerate.pi_strCreatedBy = this._strUserName;
    // this._VTGenerate.Pi_IsVehicle = "V";
    this._VTGenerate.Pi_IsVehicle = this.selectedOption;
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.IMPUpdateToken_HHT_VTGen, this._VTGenerate).then((response) => {
      console.log(response)
      if (response != null && response != "") {

        this.tokenError = response['Root']['Output'].toString();

        var vtstr = this.tokenError;
        this.OTPFinal = vtstr.substring(9, 13);


        if (this.tokenError.startsWith("I")) {

          this.objVT = new VehicleToken();
          this.VTNoMsg = this.tokenError;

          var barcodeArr = this.tokenError.split(',');
          console.log(barcodeArr);

          localStorage.setItem('comeVT', barcodeArr);

          // localStorage.setItem('comeVT', this.tokenError);
          // localStorage.setItem('gadiNo', this.VHNoArr);
          localStorage.setItem('gadiNo', this.edVehicleNo); //added by Himesh on 24/03 for defect 163250
          // localStorage.setItem('Shed', this.ShedNameArr);

          localStorage.setItem('Shed', this.edShed[0].split(',')[0]); //new as per ankit's need, shed getting changed
          console.log('display shed 1: ', localStorage.getItem('Shed'));

          for (var i = 0; i < this.isConsigneeArr.length; i++) {
            if (this.isConsigneeArr[i] == true) {
              var vToken = barcodeArr[i];
              var OTP = barcodeArr[i].substring(9, 13);
              var str = this.VHNoArr[i];
              var VehNo = str.substring(0, 2) + ' ' + str.substring(2, 4) + ' ' + str.substring(4, 6) + ' ' + str.substring(6, 10)
              var mobNo = this.mobNoArr[i];
              var addmobNo = this.addmobNoArr[i];
              this.sendSMS(vToken, OTP, VehNo, mobNo);
              this.sendSMS(vToken, OTP, VehNo, addmobNo);
              // this.sendSMS(vToken, OTP, VehNo, mobNo);
              // if (this.mobNoArr != null)
              // if (this.mobNoArr.length > 0)
              //   if (this.mobNoArr.length >= 1) {
              //     var addmobNo = this.mobNoArr[1];
              //     this.sendSMS(vToken, OTP, VehNo, addmobNo);
              //   }
            }
          }
          // this.global.routePage(VTGenerateBarCode);
          if (this.vtDetails == 0) {
            this.showSuccessForVT();
          } else if (this.vtDetails != 0) {
            this.showSuccessForEditVT();
          }
          // above if and else if are new and added on 27/02
          // this.showSuccessForVT(); // commented on 27/02
          this.global.routePage(VTGenerateBarCode); // added on 12/11/2020 by Himesh as per Ankit's need
        } else {
          this.VTNoMsg = this.tokenError;
          this.showConfirmForVT();
          this.objVT = new VehicleToken();
        }


      } else {
        //this.global.showAlert("Record not found.");
      }
    }, (error) => {
      console.log('token error', error);
    });
    // }, 500)
  }


  showConfirmForVT() {
    let confirm = this.alertCtrl.create({
      title: this.VTNoMsg,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // this.global.routePage(VehicleTokens);
            this.navCtrl.remove(this.navCtrl.getActive().index - 1, 2); //added by Himesh on
            this.global.edTokenFlag = 0;
          }
        }
      ]
    });
    confirm.present();
  }

  // added by Himesh on 11/11/2020 for defect id 153971
  showSuccessForVT() {
    let confirm = this.alertCtrl.create({
      // title: this.VTNoMsg,
      title: 'Token Generated Successfully',
      // title: 'Token Number ' + localStorage.getItem('comeVT').split(',') + '<br/>' + ' generated against vehicle number ' + localStorage.getItem('gadiNo').split(',') +'.' +'<br/>'+ 'Kindly discolse the Token Number ' + '<br/>' + 'to the security staff for entry to the cargo complex',
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

  showSuccessForEditVT() {
    let confirm = this.alertCtrl.create({
      // title: this.VTNoMsg,
      title: 'Token Number ' + this.vtDetails[0].TokenNo + ' Updated Successfully',
      // title: 'Token Number ' + localStorage.getItem('comeVT').split(',') + '<br/>' + ' generated against vehicle number ' + localStorage.getItem('gadiNo').split(',') +'.' +'<br/>'+ 'Kindly discolse the Token Number ' + '<br/>' + 'to the security staff for entry to the cargo complex',
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

        //this.objshedType[0]['ITC_CLEARANCE_NAME'].toString();
        this.objshedType =
          this.objshedType.filter(
            HAWB => HAWB.ITC_CLEARANCE_NAME != 'AIR INDIA'
          );
        this.objVT.shedType = this.objshedType[0]['ITC_CLEARANCE_NAME'].toString();;
      } else {
        // this.global.showAlert("Record not found.");
      }
    }, (error) => {
      console.log(error);
    });
  }

  onServiceTypeChange(event) {

    this.objVT.shedType = event;


    // this.isInputDisabled();
  }


  clearInputs() {
    // // this.Pieces = '';
    // // this.GrWt = '';
    // this.vehicleNo = '';
    // this.driverName = '';
    // this.licenseNo = '';
    // this.mobNo = '';
    // this.IsConsignee = false;
    // this.shedType = 0;
    this.objVT = new VehicleToken();
    this.GPButton = 0;  //added by Himesh on 11/11/2020 to disable generate VT button
    // this.showButton();

  }

  // Just to animate the fab
  fabGone = false;


  ionViewWillLeave() {
    this.fabGone = true;
    // this.global.edTokenFlag = 0;
    this.vtDetails = 0;
  }


  sendSMS(vToken, OTP, VehNo, mobNo) {
    console.log('check vehicle/trolley no. here: ', VehNo);
    if (this.selectedOption == 'V') {
      this.http.post('http://sms.hspsms.com/sendSMS?username=kalelogistics&message=Token Number ' + vToken + ' and OTP ' + OTP + ' has been generated against Vehicle Number ' + VehNo + '. Kindly disclose the Token Number to the security staff for entry to the cargo complex.&sendername=VUPLIF&smstype=TRANS&numbers=' + mobNo + '&apikey=1a49629b-664b-4b62-a609-ca254956b301',)
        .then(data => {

          console.log(data);

        }, error => {
          console.log(error);
        });
    }
    if (this.selectedOption == 'T') {
      this.http.post('http://sms.hspsms.com/sendSMS?username=kalelogistics&message=Token Number ' + vToken + ' and OTP ' + OTP + ' has been generated against Trolley Number ' + VehNo + '. Kindly disclose the Token Number to the security staff for entry to the cargo complex.&sendername=VUPLIF&smstype=TRANS&numbers=' + mobNo + '&apikey=1a49629b-664b-4b62-a609-ca254956b301',)
        .then(data => {

          console.log(data);

        }, error => {
          console.log(error);
        });
    }
    if (this.selectedOption == 'H') {
      this.http.post('http://sms.hspsms.com/sendSMS?username=kalelogistics&message=Token Number ' + vToken + ' and OTP ' + OTP + ' has been generated for By Hand Delivery' + '. Kindly disclose the Token Number to the security staff for entry to the cargo complex.&sendername=VUPLIF&smstype=TRANS&numbers=' + mobNo + '&apikey=1a49629b-664b-4b62-a609-ca254956b301',)
        .then(data => {

          console.log(data);

        }, error => {
          console.log(error);
        });
    }

    // old code
    // this.http.post('http://sms.hspsms.com/sendSMS?username=kalelogistics&message= Vehicle Token Number ' + vToken + ' and OTP ' + OTP + ' has been generated against Vehicle Number ' + VehNo + '. Kindly disclose the VT Number to the security staff for entry to the cargo complex.&sendername=VUPLIF&smstype=TRANS&numbers=' + mobNo + '&apikey=1a49629b-664b-4b62-a609-ca254956b301',
    // //   //this.http.post('http://sms.hspsms.com/sendSMS?username=kalelogistics&message="Vehicle Token Number 123456789 has been generated against Vehicle Number 123456789 . Kindly disclose the VT Number to the security staff for entry to the cargo complex."&sendername=VUPLIF&smstype=TRANS&numbers=9960588510&apikey=1a49629b-664b-4b62-a609-ca254956b301',
    // )
    //   .then(data => {

    //     console.log(data);

    //   }, error => {
    //     console.log(error);
    //   });
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

    // var patternVN = new RegExp("^[A-Z]{1-2}[0-9]{2}[A-Z]{2}[0-9]{4}$"); //unacceptable chars
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
        this.global.showAlert("Please enter valid format in Vehicle Number viz MH04BY3668 OR MH04Y3668.");
        return false;
      }
  }

  special_charTN(event) {

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.objVT.vehicleNo)) {
      this.objVT.vehicleNo = '';
      this.global.showAlert("Please enter only standard alpha numerics in Trolley Number.");
      return false;
    }
    if (this.objVT.vehicleNo.match(' ')) {
      this.objVT.vehicleNo = '';
      this.global.showAlert('Spaces not allowed in Trolley Number.');
      return false;
    }

    //     var patternVN = new RegExp("^[A-Z]{2}[0-9]{2}[A-Z]{1}[0-9]{4}$"); //unacceptable chars
    //     var patternVN1 = new RegExp("^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$"); //unacceptable chars
    // //"^[A-Z]{2}[A-Z0-9]{2}[0-9]{4}$"
    var patternVN = new RegExp("^[A-Z]{2}[A-Z0-9]{2}[0-9]{4}$");
    if (!patternVN.test(this.objVT.vehicleNo)) {
      this.objVT.vehicleNo = '';
      this.global.showAlert("Please enter valid format in Trolley Number viz TR4A1234.");
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

  mobileChange(event) {
    if (this.objVT.mobNo.length != 10) {
      this.objVT.mobNo = '';
      this.global.showAlert("Please enter valid 10 digit Mobile No.");
      return;
    }
  }

  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

}
