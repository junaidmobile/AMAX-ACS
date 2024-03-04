/**
 * @author Mohammaed Junaid
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:30
 * @modify date 2018-07-16 11:43:30
 * @desc [description]
*/
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpProvider } from '../../../../providers/http/http';
import { Constants } from '../../../../constant';
import { DeliveryDocket } from './Delivery-Docket';
import { TSPSearch } from './TSP-Search';
export class TSPSerachClass { pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }
@Component({
  selector: 'TSP Barcode',
  templateUrl: 'TSP-QRCode.html'
})

export class TSPQRCode implements OnInit {
  appBuildConfig: any;
  title: String;
  TSPNumber: any = '';
  MAWBNo: any = '';
  _allPrams: TSPSerachClass
  _strUserName: any;
  showDiv: boolean;
  tspdetails: any;
  TSPPaidAmount: any;
  tspdetails_set: any;
  HAWBNo: any;
  flag: any;
  MultipleTSP: any;
  lblTSP: boolean;
  ddlTSP: boolean;
  dateTSP: any = [];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {

    this.MAWBNo = localStorage.getItem('MAWBNo');
    this.HAWBNo = localStorage.getItem('HAWBNo');

    this.flag = localStorage.getItem('flag');
    this._allPrams = new TSPSerachClass()
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "TSP (BC) Barcode";

  }

  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    //this.getTSP_Details();

    if (this.flag == 'T') {
      this.ddlTSP = false;
      this.lblTSP = true;
      this.TSPNumber = localStorage.getItem('TSPNo');
      this.showDiv = true;

    } else if (this.flag == 'M') {
      this.getTSP_Details();
      this.ddlTSP = true;
      this.lblTSP = false;
    }
  }

  getTSP_Details_TSP() {

    this._allPrams.pi_chrSearchParam = 'T';
    this._allPrams.pi_strTSPNo = this.TSPNumber;
    this._allPrams.pi_strMAWBNo = '';;
    this._allPrams.pi_strHAWBNo = '';
    this._allPrams.pi_strUserName = this._strUserName;

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetTSPDetails_HHT_for_AWBTSP, this._allPrams).then((response) => {
      if (response != null && response != "") {

        this.showDiv = true;
        this.MultipleTSP = response['NewDataSet']['Table2'];
        this.TSPNumber = this.MultipleTSP[0]['TSPNo'];

      } else {
        this.global.showAlert("TSP number is Invalid.");
        this.showDiv = false;
      }
    }, (error) => {
      console.log(error);
    });
  }

  backToImp() {

    // this.global.routePage(TSPSearch);
    // this.navCtrl.remove(this.navCtrl.getActive().index - 0, 1); //new
    this.navCtrl.pop();
  }

  getTSP_Details() {

    this._allPrams.pi_chrSearchParam = 'M';
    this._allPrams.pi_strTSPNo = '';
    this._allPrams.pi_strMAWBNo = this.MAWBNo;
    if (this.HAWBNo == null) {
      this._allPrams.pi_strHAWBNo = '';
    } else {
      this._allPrams.pi_strHAWBNo = this.HAWBNo;
    }
    this._allPrams.pi_strUserName = this._strUserName;


    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetTSPDetails_HHT_for_AWBTSP, this._allPrams).then((response) => {
      if (response != null && response != "") {
        this.MultipleTSP = response['NewDataSet']['Table2'];
      
        for (var j = 0; j < this.MultipleTSP.length; j++) {
          this.dateTSP.push(this.MultipleTSP[j]['TSPNo']);

        }
        // this.TSPNumber = this.MultipleTSP[0]['TSPNo'];
        this.TSPNumber = this.dateTSP.reduce((a, b) => (a.RR_ReceiptDate > b.RR_ReceiptDate ? a : b));


        this.showDiv = true;
      } else {
        this.showConfirmForTSP()
        //this.global.showAlert("Details cannot be displayed. TSP has not been generated.");
        this.showDiv = false;
      }
    }, (error) => {
      console.log(error);
    });
  }

  showConfirmForTSP() {
    let confirm = this.alertCtrl.create({
      title: "TSP number is Invalid.",
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.global.routePage(DeliveryDocket);
          }
        }
      ]
    });
    confirm.present();
  }

  onCustodianChange(event) {
    this.TSPNumber = event;
    // this.isInputDisabled();
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
