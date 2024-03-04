/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:59
 * @modify date 2018-07-16 11:43:59
 * @desc [description]
*/
import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../constant';
import { AWBTrackingCSC } from './export-details/AWB-tracking';
import { VehicleTrackingCSC } from './export-details/Vehicle-tracking';
import { EGMCSC } from './export-details/EGM';
import { GlobalProvider } from '../../../providers/global/global';
import { Notifications } from '../../notifications/notifications';
import { CscMainMenuPage } from '../../csc-main-menu/csc-main-menu';
@Component({
  selector: 'page-dashboard-export-csc',
  templateUrl: 'dashboard-export-csc.html'
})

export class DashboardExportCSC implements OnInit {
  ExpDashImages: any;
  appBuildConfig: any;
  loaded: boolean
  constructor(public global: GlobalProvider) {
    this.appBuildConfig = this.global.appBuildConfig;
  }


  ngOnInit() {
    this.ExpDashImages = Constants.expCSCDashboardImages;
    this.loaded = true;
    //console.log("ExpDashImages : ", this.ExpDashImages)
  }

  logOut() {
    this.global.confirmlogOut();
  }

  notifications() {
    this.global.routePage(Notifications);
  }

  goToAWBTracking() {
    this.global.routePage(AWBTrackingCSC);
  }

  goToVehicleTracking() {
    this.global.routePage(VehicleTrackingCSC);
  }


  goToEGM() {
    this.global.routePage(EGMCSC);
  }



  goToCscPage() {
    this.global.routePage(CscMainMenuPage);
  }


}
