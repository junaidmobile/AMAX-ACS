
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpProvider } from '../../../../providers/http/http';
import { Constants } from '../../../../constant';
import { AWBGatePassMileStone } from './AWB-Milestone';
import { TPSMileStone } from './TPS-MileStone';
import { VehicleTokenDriverDetails } from './Vehicle-Token-DriverDetails';
import { ActiveSingleGatePass } from './Active-Single-GatePass';
//export class TSPSerachClass { pi_chrSearchParam: any; pi_strTSPNo: any; pi_strMAWBNo: any; pi_strHAWBNo: any; po_strMessage: any; po_chrAlert: any }
export class TSPSerachClass { pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }


@Component({
  selector: 'Active-GatePasses-list',
  templateUrl: 'Active-GatePasses-list.html'
})

export class ActiveGatePasseslist implements OnInit {
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
  ActiveGPList: any[];
  @ViewChild('PrefixValue') PrefixInput;
  @ViewChild('MAWBNoValue') myInput;
  arr1d: any[];
  name: string;
  activeGpListArrLength: any;
  readonly: boolean;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {

    this._allPrams = new TSPSerachClass()
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Vehicle Token Shipment Details";
    this.ActiveGPList = JSON.parse(localStorage.getItem("ActiveGPList"));

  }


  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
   // this.GetImpActiveGPDetails_HHT();
   this.readonly = true;
   console.log("ActiveGPList=====",(this.ActiveGPList));
   console.log("ActiveGPList length=====",this.ActiveGPList.length);


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

  Next() {
    this.global.multiGpSingleVT = 1;
    this.global.routePage(VehicleTokenDriverDetails);

  }

}
