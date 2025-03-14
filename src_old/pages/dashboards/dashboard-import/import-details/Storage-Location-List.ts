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


//export class TSPSerachClass { pi_chrSearchParam: any; pi_strTSPNo: any; pi_strMAWBNo: any; pi_strHAWBNo: any; po_strMessage: any; po_chrAlert: any }
export class TSPSerachClass { pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }

@Component({
  selector: 'Storage-Location-List',
  templateUrl: 'Storage-Location-List.html'
})
export class StorageLocationList implements OnInit {

  appBuildConfig: any;
  title: String;
  TSPNumber: any = '';
  MAWBNo: any = '';
  _allPrams: TSPSerachClass
  _strUserName: any;
  showDiv: boolean;
  objStorageLocation: any;
  @ViewChild('PrefixValue') PrefixInput;
  @ViewChild('MAWBNoValue') myInput;
  HAWBNo: any = '';
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {
    this._allPrams = new TSPSerachClass()
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Storage Location";
    this.MAWBNo = localStorage.getItem('MAWBNo');
    this.HAWBNo = localStorage.getItem('HAWBNo');
  }
  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    this.getTSP_MAWB_Details();
  }


  getTSP_MAWB_Details() {
    this._allPrams.pi_chrSearchParam = 'M';
    this._allPrams.pi_strTSPNo = '';
    this._allPrams.pi_strMAWBNo = this.MAWBNo;
    this._allPrams.pi_strHAWBNo = this.HAWBNo;
    this._allPrams.pi_strUserName = this._strUserName;
    // this._allPrams.po_strMessage = '';
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetTSPDetails_HHT_for_AWBTSP, this._allPrams).then((response) => {
      if (response != null && response != "") {
        console.log(response)
        this.showDiv = true;
        this.objStorageLocation = response['NewDataSet']['Table1'];
      } else {
        this.global.showAlert("MAWB number is invalid.");
      }
    }, (error) => {

      console.log(error);
    });
  }



  // Just to animate the fab
  fabGone = false;
  ionViewWillEnter() {
    this.fabGone = false;
  }

  ionViewWillLeave() {
    this.fabGone = true;
  }


}




