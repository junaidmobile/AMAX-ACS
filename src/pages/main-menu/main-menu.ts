/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:45:19
 * @modify date 2018-07-16 11:45:19
 * @desc [description]
*/
import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, PopoverController } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { DashboardExport } from '../dashboards/dashboard-export/dashboard-export';
import { DashboardImport } from '../dashboards/dashboard-import/dashboard-import';
import { DashboardOther } from '../dashboards/dashboard-other/dashboard-other';
import { IssueCartingOrder } from '../orders/carting-order/issue-carting-order';
import { IssueDeliveryOrder } from '../orders/delivery-order/issue-delivery-order';
import { Notifications } from '../notifications/notifications';

@Component({
  selector: 'main-menu',
  templateUrl: 'main-menu.html'
})
export class MainMenu {
  // appType = 'Exports';
  appBuildConfig: any;
  loggedIn: true;
  userConfig: any;
  isAndroid: boolean;
  LoginType: any;
  @ViewChild('mySlider') slider: Slides;
  selectedSegment: string;
  slides: any;
  constructor(public navCtrl: NavController, public global: GlobalProvider, public popoverCtrl: PopoverController) {
    this.selectedSegment = 'Exports';

    this.appBuildConfig = this.global.appBuildConfig;
    this.userConfig = JSON.parse(this.global.get('userResp')).Organization[0];
    this.LoginType = this.global.get('LoginType');
    this.isAndroid = global._platform('android', 'mobileweb');
    this.checkLoginType();
  }


  logOut() {
    this.global.confirmlogOut();
  }

  openExportDashboard() {
    this.global.routePage(DashboardExport);
  }

  openImportDashboard() {
    this.global.routePage(DashboardImport);
  }

  openOthersDashboard() {
    this.global.routePage(DashboardOther);
  }

  openCartingOrder() {
    this.global.routePage(IssueCartingOrder);
  }

  openDeliveryOrder() {
    this.global.routePage(IssueDeliveryOrder);
  }

  notifications() {
    this.global.routePage(Notifications);
  }

  confirmExit() {
    this.global.ExitApp();
  }

  checkLoginType() {
    if (this.LoginType == 'Agent') {
      this.selectedSegment = 'Exports';
      this.slides = [
        {
          id: "Exports",
          name: '<page-dashboard-export></page-dashboard-export>'
        },
        {
          id: "Imports",
          name: '<page-dashboard-import></page-dashboard-import>'
        },
        {
          id: "Others",
          name: '<page-dashboard-other></page-dashboard-other>'
        }
      ];
    }
    else if (this.LoginType == 'Airline') {
      this.selectedSegment = 'Carting Order';
      this.slides = [
        {
          id: "Carting Order",
          name: '<page-issue-carting-order></page-issue-carting-order>'
        },
        {
          id: "Delivery Order",
          name: '<page-issue-delivery-order></page-issue-delivery-order>'
        }
      ];
    } else {
      this.selectedSegment = '';
      this.slides = [];
    }

  }

  onSegmentChanged(segmentButton) {
    // console.log("Segment changed to", segmentButton.value);
    const selectedIndex = this.slides.findIndex((slide) => {
      return slide.id === segmentButton.value;
    });
    this.slider.slideTo(selectedIndex);
  }

  onSlideChanged(slider) {
    // console.log('Slide changed');
    const currentSlide = this.slides[slider.getActiveIndex()];
    if (currentSlide != undefined) {
      this.selectedSegment = currentSlide.id;
    }
  }
}

