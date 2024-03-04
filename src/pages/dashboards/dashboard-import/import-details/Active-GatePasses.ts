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
import { AWBGatePassMileStone } from './AWB-Milestone';
import { TPSMileStone } from './TPS-MileStone';
import { ActiveGatePasseslist } from './Active-GatePasses-list';
//export class TSPSerachClass { pi_chrSearchParam: any; pi_strTSPNo: any; pi_strMAWBNo: any; pi_strHAWBNo: any; po_strMessage: any; po_chrAlert: any }
export class TSPSerachClass { pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }


@Component({
  selector: 'Active-GatePasses',
  templateUrl: 'Active-GatePasses.html'
})

export class ActiveGatePasses implements OnInit {
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
  showDetailField = false;
  @ViewChild('PrefixValue') PrefixInput;
  @ViewChild('MAWBNoValue') myInput;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {

    this._allPrams = new TSPSerachClass()
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Summary";

  }


  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    //this.GetImpActiveGPDetails_HHT();
  }


  GetImpActiveGPDetails_HHT() {
    this._allPrams.pi_strUserName = this._strUserName;
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetImpActiveGPDetails_HHT_List, this._allPrams).then((response) => {
      console.log(response);
      if (response != null && response != "") {

      }
    }, (error) => {
      console.log(error);
    });
  }
  tempnextbtn(){
    this.global.routePage(ActiveGatePasseslist);
  }
  // Just to animate the fab
  fabGone = false;
  ionViewWillEnter() {
    this.fabGone = false;
  }

  ionViewWillLeave() {
    this.fabGone = true;
  }
  clearInputs() {
    this.TSPNumber = '';
    this.Prefix = '';
    this.MAWBNo = '';
    this.showDiv = false;
  }

}
