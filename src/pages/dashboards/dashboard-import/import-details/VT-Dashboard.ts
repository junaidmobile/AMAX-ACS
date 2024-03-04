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
import { VehicleTokens } from './Vehicle-Tokens';
import { VehicleTokensAirIndia } from './Vehicle-Tokens-AirIndia';
import { AIVTList } from './AI-VT-List';

export class ScanTSPStaffVar { pi_dtfromdate: any; pi_dttodate: any; pi_strclientcode: any; }
@Component({
  selector: 'VT-Dashboard',
  templateUrl: 'VT-Dashboard.html'
})

export class VTDashboard implements OnInit {
  appBuildConfig: any;
  title: String;
  exportVehicleVehicletokensummary: any;
  custodianData: any[] = [];
  _fromDate: any = '';
  _toDate: any = '';
  _custodian: any = '';
  showDiv: boolean;
  slotDetail: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {

    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Vehicle Token Terminal";

  }

  ngOnInit() {
    // this.ExpDashImages = Constants.ImportImages;
    //console.log("ExpDashImages : ", this.ExpDashImages)
  }

  logOut() {
    this.global.confirmlogOut();
  }

  notifications() {
    //this.global.routePage(Notifications);
  }


  goToMIAL() {
    this.global.routePage(VehicleTokens);
    //this.global.showAlert("COMING SOON");
  }
  goToAirIndia() {
    // this.global.showAlert("COMING SOON");
    this.global.routePage(AIVTList);

  }


}
