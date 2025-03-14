/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:45:19
 * @modify date 2018-07-16 11:45:19
 * @desc [description]
*/
import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, Slides, PopoverController, Events } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { DashboardExport } from '../dashboards/dashboard-export/dashboard-export';
import { DashboardImport } from '../dashboards/dashboard-import/dashboard-import';
import { DashboardOther } from '../dashboards/dashboard-other/dashboard-other';
import { IssueCartingOrder } from '../orders/carting-order/issue-carting-order';
import { IssueDeliveryOrder } from '../orders/delivery-order/issue-delivery-order';
import { Notifications } from '../notifications/notifications';
import { HttpProvider } from '../../providers/http/http';
import { Constants } from '../../constant';
import { StatusBar } from '@ionic-native/status-bar';

@Component({
  selector: 'main-menu',
  templateUrl: 'main-menu.html'
})
export class MainMenu implements OnInit {
  // appType = 'Exports';
  appBuildConfig: any;
  loggedIn: true;
  userConfig: any;
  isAndroid: boolean;
  LoginType: any;
  count: number;
  isNotificationSeen: boolean;
  @ViewChild('mySlider') slider: Slides;
  selectedSegment: string;
  slides: any;
  hideClass: boolean;
  delay: 1000;
  constructor(
    public navCtrl: NavController,
    public global: GlobalProvider,
    public popoverCtrl: PopoverController,
    public http: HttpProvider, private statusBar: StatusBar,
    public event: Events) {
    this.selectedSegment = 'Exports';

    this.appBuildConfig = this.global.appBuildConfig;
    // this.userConfig = JSON.parse(this.global.get('userResp')).Organization[0];
    this.LoginType = this.global.get('LoginType');
    this.isAndroid = global._platform('android', 'mobileweb');
    this.checkLoginType();
    // this.fetchNotifications();
    this.getNotificationStatus();
    this.notificationCountReceived();
  }

  ngOnInit() {
    if (this.global.isNative()) {
      // this.statusBar.styleLightContent();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#1EA1CC');
    }
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

  fetchNotifications() {
    this.http.getHttpGetRequest(Constants.ONE_SIGNAL_NOTIFACTION_URL).then((res) => {
      // console.log("all notifications : ", JSON.stringify(res));
      this.count = res['notifications'].length;
      this.event.publish('Notication_badge_count', res['notifications']);
    })
  }

  getNotificationStatus() {
    this.verifyStatus()
    this.event.subscribe('isNotificationsSeen', () => {
      let isNotificationSeen = JSON.parse(window.localStorage.getItem('isNotificationsSeen'));
      this.isNotificationSeen = isNotificationSeen != null ? true : isNotificationSeen;
    })
  }

  verifyStatus() {
    let isNotificationSeen = JSON.parse(window.localStorage.getItem('isNotificationsSeen'));
    this.isNotificationSeen = isNotificationSeen != null ? true : isNotificationSeen;
  }

  notificationCountReceived() {
    this.event.subscribe('incrementCount', (count) => {
      this.isNotificationSeen = false;
      this.count += count;
      this.setAnimatedIconBadgeInterval();
    })
  }

  // setCount() {
  //   this.event.publish('incrementCount', 1);
  //   this.setAnimatedIconBadgeInterval()
  // }

  setAnimatedIconBadgeInterval() {
    setInterval(this.updateBadgeClass, this.delay);
  }

  updateBadgeClass() {
    this.hideClass = !this.hideClass;
  }

}

