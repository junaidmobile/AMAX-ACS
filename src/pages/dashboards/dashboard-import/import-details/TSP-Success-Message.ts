import { HomePage } from './../../../home/home';
import { Input } from '@angular/core';
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
import { TSPQRCode } from './TSP-QRCode';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { TPSMileStone } from './TPS-MileStone';
//export class TSPSerachClass { pi_chrSearchParam: any; pi_strTSPNo: any; pi_strMAWBNo: any; pi_strHAWBNo: any; po_strMessage: any; po_chrAlert: any }
//export class GPerachClass { pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }

@Component({
  selector: 'TSP-Success-Message',
  templateUrl: 'TSP-Success-Message.html'
})
export class TSPSuccessMessage implements OnInit {
  @Input('title') title: string;
  @Input('isCSC') isCsc: boolean;
  color: String;  // added by Himesh on 10/11/2020 to disable back navigation

  appBuildConfig: any;
  // title: String;
  MAWBNo: any = '';
  _strUserName: any;
  amount: string;
  tspNo: string;
  
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private barcodeScanner: BarcodeScanner) {

    //this._allPrams = new GPerachClass()
    this.appBuildConfig = this.global.appBuildConfig;
    this.amount = localStorage.getItem('amount');
    this.tspNo = localStorage.getItem('tspNo');
    this.title = "Payment Status";
  }
  ngOnInit() {

    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    this.color = this.isCsc ? "primaryCsc" : "primary";
  }


  backToImp() {
    // this.global.routePage(TPSMileStone);
    this.navCtrl.remove(this.navCtrl.getActive().index - 2, 3); //added by Himesh on 02/11/2020
    // add global variable here for GP hide/unhide
    this.global.generateGP = 1; //added by Himesh on 06/11/2020 for GP button to get enabled;
    this.global.dueBtn = 1;
  }

  // Just to animate the fab
  fabGone = false;
  ionViewWillEnter() {
    this.fabGone = false;
  }

  ionViewWillLeave() {
    this.fabGone = true;
  }

  logOut() {
    this.global.confirmlogOut();
  }

  homeButton() {
    this.global.setRootPage(HomePage);
  }
  // focusNextInput() {
  //   if (this.Prefix.length >= 3) {
  //     this.myInput.setFocus();
  //   }
  // }


}
