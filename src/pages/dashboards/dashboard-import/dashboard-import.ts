/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:44:35
 * @modify date 2018-07-16 11:44:35
 * @desc [description]
*/
import { Component, OnInit } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Constants } from '../../../constant';
import { AWBTrackingImport } from './import-details/AWB-tracking';
import { IGMImport } from './import-details/IGM-import';
import { FAQImport } from './import-details/FAQ';
import { ApplicableChargesImport } from './import-details/Applicable-charges';
import { GlobalProvider } from '../../../providers/global/global';
import { Notifications } from '../../notifications/notifications';
import { IssueDOImport } from './import-details/Issue-DO';

@Component({
  selector: 'page-dashboard-import',
  templateUrl: 'dashboard-import.html'
})

export class DashboardImport implements OnInit {
  ExpDashImages: any;
  appBuildConfig: any;
  DOStat: any;
  constructor(public global: GlobalProvider, public alertCtrl: AlertController) {
    this.appBuildConfig = this.global.appBuildConfig;
    this.DOStat = JSON.parse(this.global.get('userResp')).Organization[0].Type[0];
    // console.log(" DOStat : ", this.DOStat);

  }


  ngOnInit() {
    this.ExpDashImages = Constants.ImportImages;
    //console.log("ExpDashImages : ", this.ExpDashImages)
  }

  logOut() {
    this.global.confirmlogOut();
  }

  notifications() {
    this.global.routePage(Notifications);
  }

  goToAWBTracking() {
    this.global.routePage(AWBTrackingImport);
  }

  goToVehicleTracking() {
    // this.global.routePage(VehicleTrackingImport);
    this.global.showAlert("COMING SOON");
  }


  goToEGM() {
    this.global.routePage(IGMImport);
  }


  goToFAQ() {
    this.global.routePage(FAQImport);
  }

  goToAppCharges() {
    this.global.routePage(ApplicableChargesImport);
  }

  goToissueDO() {
    this.global.routePage(IssueDOImport);
  }

}
