//ScanTSPOption

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
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { StorageLocationList } from './Storage-Location-List';
//export class TSPSerachClass { pi_chrSearchParam: any; pi_strTSPNo: any; pi_strMAWBNo: any; pi_strHAWBNo: any; po_strMessage: any; po_chrAlert: any }
export class TSPSerachClass { pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }

@Component({
  selector: 'HAWB-Detail',
  templateUrl: 'HAWB-Detail.html'
})
export class HAWBDetail implements OnInit {
  appBuildConfig: any;
  title: any;
  ChWt: any;
  GrWt: any;
  ConsigneeName: any;
  Pieces: any;
  MAWBNo: any;
  HAWBNo: any;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private barcodeScanner: BarcodeScanner) {

    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "HAWB Detailsss";

    this.MAWBNo = localStorage.getItem('MAWBNo');
    this.HAWBNo = localStorage.getItem('HAWBNo');
    this.ChWt = localStorage.getItem('ChWt')
    this.GrWt = localStorage.getItem('GrWt')
    this.ConsigneeName = localStorage.getItem('ConsigneeName')
    this.Pieces = localStorage.getItem('Pieces')
  }
  ngOnInit() {

  }


}
