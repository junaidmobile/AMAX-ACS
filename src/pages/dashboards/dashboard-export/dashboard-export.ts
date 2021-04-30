/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:59
 * @modify date 2018-07-16 11:43:59
 * @desc [description]
*/
import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../constant';
import { AWBTracking } from './export-details/AWB-tracking';
import { VehicleTracking } from './export-details/Vehicle-tracking';
import { EGM } from './export-details/EGM';
import { FAQ } from './export-details/FAQ';
import { ApplicableCharges } from './export-details/Applicable-charges';
import { GlobalProvider } from '../../../providers/global/global';
import { Notifications } from '../../notifications/notifications';
import { CscMainMenuPage } from '../../csc-main-menu/csc-main-menu';
import { VehicleTokenSummary } from './export-details/Vehicle-tokensummary';
import { TGDAcceptance } from '../dashboard-import/import-details/TGD-Acceptance';
@Component({
  selector: 'page-dashboard-export',
  templateUrl: 'dashboard-export.html'
})

export class DashboardExport implements OnInit {
  ExpDashImages: any;
  appBuildConfig: any;
  DOStat: any;
  constructor(public global: GlobalProvider) {
    this.appBuildConfig = this.global.appBuildConfig;

    this.DOStat = JSON.parse(this.global.get('userResp')).Organization[0].Type[0];
  }


  ngOnInit() {
    this.ExpDashImages = Constants.expDashboardImages;
    //console.log("ExpDashImages : ", this.ExpDashImages)
  }

  logOut() {
    this.global.confirmlogOut();
  }

  notifications() {
    this.global.routePage(Notifications);
  }

  goToAWBTracking() {
    this.global.routePage(AWBTracking);
  }

  goToVehicleTracking() {
    this.global.routePage(VehicleTracking);
  }


  goToEGM() {
    this.global.routePage(EGM);
  }


  goToFAQ() {
    this.global.routePage(FAQ);
  }

  goToAppCharges() {
    this.global.routePage(ApplicableCharges);
  }

  goToCscPage() {
    this.global.routePage(CscMainMenuPage);
  }

  goToVehicleTokenSummary() {
    this.global.routePage(VehicleTokenSummary);
  }

  goToTGD() {
    this.global.routePage(TGDAcceptance);
  }

  goToLocation() {
    // this.global.routePage(VehicleTokenSummary);
  }

}
