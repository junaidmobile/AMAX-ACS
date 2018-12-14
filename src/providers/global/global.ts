import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { App, AlertController, Platform, ToastController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import * as CryptoJS from 'crypto-js';
import { Constants } from '../../constant';


/**
 * @name GlobalProvider
 * @author Sachin Semlety
 * @description
 * This Class is used to set the global Operations for the app.
**/
@Injectable()
export class GlobalProvider {
  /*Configuration of the app build */
  appBuildConfig = {
    version: 'V1.0.8',
    fullYear: (new Date).getFullYear().toString()
  }
  constructor(public http: HttpClient, private app: App, public alertCtrl: AlertController, public toastCtrl: ToastController, public platform: Platform) {
  }

  /* To set the RootPage in App*/
  setRootPage(page) {
    this.app.getRootNavs()[0].setRoot(page);
  }

  /* To Route the Page in the App*/
  routePage(page) {
    this.app.getActiveNavs()[0].push(page);
  }

  /* Route To other Page with the data params*/
  routePageWithData(page, data) {
    this.app.getActiveNavs()[0].push(page, data);
  }

  /*Logout PopupModal*/
  confirmlogOut() {
    let alert = this.alertCtrl.create({
      title: 'Logout',
      message: 'Do you want to Logout?',
      buttons: [{
        text: "Confirm",
        handler: () => { window.localStorage.removeItem('isLogged'); this.routePage(LoginPage) }
      }, {
        text: "Cancel",
        role: 'cancel'
      }]
    })
    alert.present();
  }


  /* To Exit the App */
  ExitApp(): void {
    this.platform.exitApp();
  }

  /* Toast for the App*/
  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      //console.log('Dismissed toast');
    });
    toast.present();
  }

  /* PopupModal Alert*/
  showAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  /* check is cordova Available*/
  isNative(): boolean {
    return !!window['cordova'];
  }

  /* To Convert String into Boolean*/
  convertToBoolean(input: string): boolean | undefined {
    try {
      return JSON.parse(input);
    }
    catch (e) {
      return undefined;
    }
  }

  /* Encrypt and store the local storage data*/
  store(key: string, value: any) {
    let encryptedData = CryptoJS.AES.encrypt(JSON.stringify(value), Constants.SECRET_KEY).toString();
    window.localStorage.setItem(key, encryptedData);
  }

  /* get the stored localStorage Value after decryption */
  get(key: string) {
    let encryptedData = window.localStorage.getItem(key);
    if (encryptedData != null)
      return JSON.parse(CryptoJS.AES.decrypt(encryptedData, Constants.SECRET_KEY).toString(CryptoJS.enc.Utf8));
    return null;
  }

  /* to check the Platform current running*/
  _platform(platform_name1: string, platform_name2: string) {
    return this.platform.is(platform_name1) || this.platform.is(platform_name2);
  }

  /* To format the date in DD/MM/YYYY format */
  formatDate(date: string) {
    let splitArr = date.split('-');
    return splitArr[2] + "/" + splitArr[1] + "/" + splitArr[0];
  }


}
