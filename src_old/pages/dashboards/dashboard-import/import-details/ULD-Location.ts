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
//export class TSPSerachClass { pi_chrSearchParam: any; pi_strTSPNo: any; pi_strMAWBNo: any; pi_strHAWBNo: any; po_strMessage: any; po_chrAlert: any }
export class GPerachClass {
  pi_strAirwayBillNo: any; pi_strUserName: any;
}
export class tgdSave {
  pi_strTDGDetails: any;
  pi_strPkgDetails: any;
  pi_blnAmendment: any;
  pi_blnXRAYAmendment: any;
}

@Component({
  selector: 'ULD-Location',
  templateUrl: 'ULD-Location.html'
})
export class ULDLocation implements OnInit {

  appBuildConfig: any;
  title: String;
  IGMNo: any = '';
  TSPNumber: any = '';
  MAWBNo: any = '';
  _allPrams: GPerachClass;
  _tgdSave: tgdSave;
  _strUserName: any;
  showDiv: boolean;
  @ViewChild('IGMNoValue') PrefixInput;
  @ViewChild('MAWBNoValue') myInput;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private barcodeScanner: BarcodeScanner) {
    this._tgdSave = new tgdSave();
    this._allPrams = new GPerachClass();
    this.appBuildConfig = this.global.appBuildConfig;

    this.title = "Location";
  }
  ngOnInit() {

    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
  }
  ionViewDidLoad() {
    setTimeout(() => {
      this.PrefixInput.setFocus();
    }, 800)
  }
  SearchTDGAcceptance_HHT() {

  }
  // SearchTDGAcceptance_HHT() {
  //   debugger
  //   if (this.IGMNo == '') {
  //     this.global.showAlert("Please enter IGM No.");
  //     return;
  //   }
  //   if (this.MAWBNo == '') {
  //     this.global.showAlert("Please enter MAWB Number.");
  //     return;
  //   }

  //   this._allPrams.pi_strAirwayBillNo = this.Prefix + this.MAWBNo;
  //   this._allPrams.pi_strUserName = this._strUserName;
  //   // this._allPrams.po_strMessage = '';
  //   this.http.getHttpPostRequest(Constants.GMAX_Services.Exports.GetAirWayBillByAWBForHHT_get, this._allPrams).then((response) => {
  //     console.log(response);
  //     if (response != null && response != "") {
  //       this.showDiv = true;
  //       this.TDGDetails = response['NewDataSet']['Table'];


  //       this.Commodity = this.TDGDetails[0]['Commodity'];
  //       this.FltofPoint = this.TDGDetails[0]['AL_DestinationCode_C'];
  //       this.TotalPkgs = this.TDGDetails[0]['AL_TotalPackageCount_I'];
  //       this.RcvdGrossWt = this.TDGDetails[0]['AL_ActualGrossWeight_I'];
  //       this.RcvdChrgWt = this.TDGDetails[0]['AL_ActualNetWeight_I'];
  //       this.ExporterName = this.TDGDetails[0]['ExporterName'];
  //       this.CHAName = this.TDGDetails[0]['ShipperName'];
  //       this.FlightNo = this.TDGDetails[0]['AL_Airline2Code_C'];
  //       this.FlightDate = this.TDGDetails[0]['Cl_FlightTime_C'];
  //       this.AWBDestination = this.TDGDetails[0]['AL_DestinationCode_C'];
  //       this.IATACode = this.TDGDetails[0]['IECode'];
  //       this.ReceivedPackages = this.TDGDetails[0]['AL_ActualPackageCount_I'];

  //       this.TDGStatus = this.TDGDetails[0]['AL_TDGStatus_I'];


  //       this._pi_strTDGDetails = '<TDGInfo><TDGDetail ALRowId="' + this.TDGDetails[0]['AL_ROWID_I']
  //         + '" TLRowId ="' + this.TDGDetails[0]['TDGRowId']
  //         + '" ScannedPkgs ="' + this.TDGDetails[0]['AL_TotalPackageCount_I']
  //         + '" ScannedGrossWt ="' + this.TDGDetails[0]['AL_ActualGrossWeight_I']
  //         + '" VolumetricWt ="' + this.TDGDetails[0]['AL_ActualNetWeight_I']
  //         + '" CreatedBy ="' + this._strUserName + '" Remarks ="' + this.TDGDetails[0]['ScreeningRemarks']
  //         + '" TDGDate ="' + this.TDGDetails[0]['TDGDate']
  //         + '"/><TDGTrolleyInfo></TDGTrolleyInfo></TDGInfo>'

  //       this._pi_blnAmendment = this.TDGDetails[0]['AL_IsAmndtReq_B'].toString();
  //       this._pi_blnXRAYAmendment = this.TDGDetails[0]['AL_XRayApplicable_I'].toString();

  //       this._pi_strPkgDetails = '<Pkg><Info Cd="' + this.TDGDetails[0]['CommodityCode']
  //         + '" Pcs="' + this.TDGDetails[0]['AL_TotalPackageCount_I']
  //         + '" Gwt="' + this.TDGDetails[0]['AL_ActualGrossWeight_I']
  //         + '" CWt="' + this.TDGDetails[0]['AL_ActualNetWeight_I']
  //         + '" /></Pkg>'




  //     } else {
  //       // this.global.showAlert("Details cannot be displayed. TSP has not been generated.");
  //     }
  //   }, (error) => {

  //     console.log(error);
  //   });
  // }

  // CreateTDGAcceptance_HHT() {
  //   debugger
  //   this._tgdSave.pi_strTDGDetails = this._pi_strTDGDetails;
  //   this._tgdSave.pi_strPkgDetails = this._pi_strPkgDetails;
  //   this._tgdSave.pi_blnAmendment = this._pi_blnAmendment
  //   this._tgdSave.pi_blnXRAYAmendment = this._pi_blnXRAYAmendment


  //   this.http.getHttpPostRequest(Constants.GMAX_Services.Exports.CreateTDGAcceptance_HHT_Save, this._tgdSave).then((response) => {
  //     console.log(response);
  //     if (response != null && response != "") {




  //     } else {
  //       // this.global.showAlert("Details cannot be displayed. TSP has not been generated.");
  //     }
  //   }, (error) => {

  //     console.log(error);
  //   });
  // }


  checkProperty(obj, key) {
    return obj.hasOwnProperty(key);
  }

  clearInputs() {
    this.IGMNo = '';
    this.showDiv = false;

  }

  // Just to animate the fab
  fabGone = false;
  ionViewWillEnter() {
    this.fabGone = false;
  }

  ionViewWillLeave() {
    this.fabGone = true;
  }


}
