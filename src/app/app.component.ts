/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:42:19
 * @modify date 2018-07-16 11:42:19
 * @desc [description]
*/
import { Component, ViewChild } from '@angular/core';
import { Platform, Events, ToastController, NavController, App, Keyboard } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { MainMenu } from '../pages/main-menu/main-menu';
import { NetworkProvider } from '../providers/network/network';
import { GlobalProvider } from '../providers/global/global';
import { PushNotificationServiceProvider } from '../providers/push-notification-service/push-notification-service';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;
  @ViewChild('myNav') nav: NavController;
  constructor(
    platform: Platform,
    private statusBar: StatusBar,
    splashScreen: SplashScreen,
    public events: Events,
    public networkProvider: NetworkProvider,
    public toastCtrl: ToastController,
    public global: GlobalProvider,
    public app: App,
    public pushNotificationService: PushNotificationServiceProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // Status Bar
      if (this.global.isNative()) {
        // this.statusBar.styleLightContent();
        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString('#ff8641');

        // Splashscreen Hide
        splashScreen.hide();
        this.pushNotificationService.Init();
      }


      // Network Events
      this.networkProvider.initializeNetworkEvents();

      // Offline event
      this.events.subscribe('network:offline', () => {
        this.global.showToast('No Internet Connection!');
      });

      // Online event
      this.events.subscribe('network:online', () => {
        this.global.showToast('Back Online');
      });
    });

    // handle back button
    platform.registerBackButtonAction(() => {
      let activeNav = this.app.getActiveNavs()[0];
      //console.log("Back button action called");

      let activePage = activeNav.getActive().instance;

      let whitelistPages = ["", LoginPage, MainMenu, HomePage];

      // if current page is not in whitelistPages
      // then back to home or login page first
      (whitelistPages.indexOf(activePage.constructor) > 0) ? this.global.ExitApp() : this.app.goBack();

    }, 0);
  }

}




