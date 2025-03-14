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
import { TSPQRCode } from './TSP-QRCode';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { StorageLocationList } from './Storage-Location-List';
//export class TSPSerachClass { pi_chrSearchParam: any; pi_strTSPNo: any; pi_strMAWBNo: any; pi_strHAWBNo: any; po_strMessage: any; po_chrAlert: any }
export class TSPSerachClass { pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }

@Component({
  selector: 'Scan-TSP-Option',
  templateUrl: 'Scan-TSP-Option.html'
})
export class ScanTSPOption implements OnInit {
  scanData: {};
  options: BarcodeScannerOptions;
  appBuildConfig: any;
  title: String;
  Prefix: any = '';
  TSPNumber: any = '';
  MAWBNo: any = '';
  _allPrams: TSPSerachClass
  _strUserName: any;
  showDiv: boolean;
  tspdetails: any;
  TSPPaidAmount: any;
  tspdetails_set: any;
  @ViewChild('PrefixValue') PrefixInput;
  @ViewChild('MAWBNoValue') myInput;
  HAWBNo: any = '';
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private barcodeScanner: BarcodeScanner) {
    this._allPrams = new TSPSerachClass()
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "TSP Search";
    this.options = { prompt: 'Scan the Barcode to Enter', resultDisplayDuration: 0 };
  }
  ngOnInit() {

    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
  }
  ionViewDidLoad() {
    setTimeout(() => {
      this.PrefixInput.setFocus();
    }, 800)
  }


  GetTSPDetail() {

    if (this.TSPNumber == '') {
      this.global.showAlert("Please enter TSP Number.");
      return;
    }
    this._allPrams.pi_chrSearchParam = 'T';
    this._allPrams.pi_strTSPNo = this.TSPNumber;
    this._allPrams.pi_strMAWBNo = '';
    this._allPrams.pi_strHAWBNo = '';
    this._allPrams.pi_strUserName = this._strUserName;
    this.getTSP_Details();
  }

  GetMAWBDetail() {
    if (this.Prefix == '') {
      this.global.showAlert("Please enter Prefix.");
      return;
    }
    if (this.MAWBNo == '') {
      this.global.showAlert("Please enter MAWB Number.");
      return;
    }
    if (this.HAWBNo == '') {
      this.global.showAlert("Please enter HAWB Number.");
      return;
    }
    this.getTSP_MAWB_Details();
  }

  getTSP_MAWB_Details() {
    this._allPrams.pi_chrSearchParam = 'M';
    this._allPrams.pi_strTSPNo = '';
    this._allPrams.pi_strMAWBNo = this.Prefix + this.MAWBNo;
    this._allPrams.pi_strHAWBNo = this.HAWBNo;
    this._allPrams.pi_strUserName = this._strUserName;
    // this._allPrams.po_strMessage = '';
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetTSPDetails_HHT_for_AWBTSP, this._allPrams).then((response) => {
      if (response != null && response != "") {
        console.log(response)
        this.showDiv = true;
        this.tspdetails = response['NewDataSet']['Table'];
      } else {
        this.global.showAlert("MAWB number is invalid.");
        this.clearInputs();
      }
    }, (error) => {

      console.log(error);
    });
  }

  getTSP_Details() {
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetTSPDetails_HHT_for_AWBTSP, this._allPrams).then((response) => {
      // console.log("Response : ", response);
      if (response != null && response != "") {
        this.showDiv = true;
        this.tspdetails = response['NewDataSet']['Table'];

      } else {
        this.global.showAlert("TSP number is invalid.");
      }
    }, (error) => {
      console.log(error);
    });
  }

  clearInputs() {
    this.TSPNumber = '';
    this.Prefix = '';
    this.MAWBNo = '';
    this.HAWBNo = '';
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
  focusNextInput() {
    if (this.Prefix.length == 3) {
      this.myInput.setFocus();
    }
  }
  goToStorageLocation() {
    // this._allPrams.pi_chrSearchParam = 'M';
    // this._allPrams.pi_strTSPNo = '';
    // this._allPrams.pi_strMAWBNo = this.Prefix + this.MAWBNo;
    // this._allPrams.pi_strHAWBNo = HawbVal;
    // this._allPrams.pi_strUserName = this._strUserName;
    // this.getTSP_Details();

    localStorage.setItem('MAWBNo', this.tspdetails[0]['MAWBNo'][0]);
    localStorage.setItem('HAWBNo', this.tspdetails[0]['HAWBNo'][0]);
    this.global.routePage(StorageLocationList);
  }

  scanBarCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.TSPNumber = barcodeData.text;

      if (barcodeData.cancelled != true) {
        this.GetTSPDetail();
      }

    }).catch(err => {
      console.log('Error', err);
    });
  }

}
