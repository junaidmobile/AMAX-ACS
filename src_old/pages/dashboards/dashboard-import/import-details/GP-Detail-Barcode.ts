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
//export class TSPSerachClass { pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }
@Component({
  selector: 'GP-Detail-Barcode',
  templateUrl: 'GP-Detail-Barcode.html'
})

export class GPDetailBarcode implements OnInit {
  appBuildConfig: any;
  title: String;
  TSPNumber: any = '';
  MAWBNo: any = '';
  // _allPrams: TSPSerachClass
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
  vehicleDetail: any;
  objRemoveGPDetail: any;
  VehicleNo: string;
  TokenNo: string;
  GPNo: string;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {


    this.vehicleDetail = JSON.parse(localStorage.getItem("vehicleDetail"));
    this.objRemoveGPDetail = JSON.parse(localStorage.getItem("objRemoveGPDetail"));
    // this._allPrams = new TSPSerachClass()

    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Gate Pass Details";

    this.VehicleNo = localStorage.getItem('VehicleNo');
    this.TokenNo = localStorage.getItem('TokenNo');
    this.HAWBNo = localStorage.getItem('HAWBNo');
    this.MAWBNo = localStorage.getItem('MAWBNo');
    this.GPNo = localStorage.getItem('GPNo');

  }

  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];

  }



  // Just to animate the fab
  fabGone = false;
  ionViewWillEnter() {
    this.fabGone = false;
  }

  ionViewWillLeave() {
    this.fabGone = true;
  }


  backToImp() {

    // this.global.routePage(VehicleTokens);
    this.navCtrl.remove(this.navCtrl.getActive().index - 2, 3); //new
    this.global.showSegment = 2;
  }

}
