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
import { VehicleTokens } from './Vehicle-Tokens';
import { AIVTList } from './AI-VT-List';
export class TSPSerachClass { pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }
@Component({
  selector: 'AI-Barcode',
  templateUrl: 'AI-Barcode.html'
})

export class AIBarcode implements OnInit {
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
  comeVT: string;
  gadiNo: string;
  Shed: string;


  barcodeArr: string[];
  gadiNoRPT: string[];
  shedRPT: string[];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {

    this.MAWBNo = localStorage.getItem('MAWBNo');
    this.HAWBNo = localStorage.getItem('HAWBNo');

    this.comeVT = localStorage.getItem('comeVT');

    this.barcodeArr = this.comeVT.split(',');
    console.log(this.barcodeArr);

    this.gadiNo = localStorage.getItem('gadiNo');

    this.gadiNoRPT = this.gadiNo.split(',');
    console.log(this.gadiNoRPT);

    this.Shed = localStorage.getItem('Shed');

    this.shedRPT = this.Shed.split(',');
    console.log(this.shedRPT);

    this._allPrams = new TSPSerachClass()
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Vehicle Token Barcode";

  }

  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    //this.getTSP_Details();
  }
  backToImp() {

    this.global.routePage(AIVTList);
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
