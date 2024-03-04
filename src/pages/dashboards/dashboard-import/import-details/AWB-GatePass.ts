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
import { AWBGatePassMileStone } from './AWB-Milestone';
import { TPSMileStone } from './TPS-MileStone';
//export class TSPSerachClass { pi_chrSearchParam: any; pi_strTSPNo: any; pi_strMAWBNo: any; pi_strHAWBNo: any; po_strMessage: any; po_chrAlert: any }
export class TSPSerachClass { pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }


@Component({
  selector: 'AWB-Gate',
  templateUrl: 'AWB-GatePass.html'
})



export class AWBGatePassSearch implements OnInit {
  appBuildConfig: any;
  title: String;
  Prefix: any = '';
  TSPNumber: any = '';
  MAWBNo: any = '';
  _allPrams: TSPSerachClass
  _strUserName: any;
  showDiv: boolean;
  tspdetails: any;
  TSPPaidAmount: any;
  tspdetails_set: any;
  @ViewChild('PrefixValue') PrefixInput;
  @ViewChild('MAWBNoValue') myInput;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {

    this._allPrams = new TSPSerachClass()
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Search MAWB";


  }


  ngOnInit() {

    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
  }
  ionViewDidLoad() {
    setTimeout(() => {
      this.PrefixInput.setFocus();
    }, 800)
  }
  GetMAWBDetail() {
    if (this.Prefix == '') {
      this.global.showAlert("Please enter Prefix.");
      return;
    }
    if (this.MAWBNo == '') {
      this.global.showAlert("Please enter MAWB Number.");
      return;
    }
    this.getTSP_MAWB_Details();
  }

  getTSP_MAWB_Details() {
    this._allPrams.pi_strMAWBNo = this.Prefix + this.MAWBNo;
    this._allPrams.pi_strUserName = this._strUserName;
    // this._allPrams.po_strMessage = '';
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetHAWBNosBasedOnMAWBNos_HHT_MAWB, this._allPrams).then((response) => {
      if (response != null && response != "") {
        this.showDiv = true;
        this.tspdetails = response['NewDataSet']['Table'];
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
  focusNextInput() {
    if (this.Prefix.length == 3) {
      this.myInput.setFocus();
    }
  }

  goTOGatePassMileStone(HawbId, HAWBNo) {

    localStorage.setItem('HAWBId', HawbId);
    localStorage.setItem('MAWBNo', this.Prefix + this.MAWBNo);
    localStorage.setItem('HAWBNo', HAWBNo);
    this.clearInputs();
    if (this.tspdetails != null || this.tspdetails != '') {
      this.global.routePage(TPSMileStone);
    }
  }
  getTSP_Details() {
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetTSPDetails_HHT_for_AWBTSP, this._allPrams).then((response) => {
      // console.log("Response : ", response);
      if (response != null && response != "") {
        //  this.showDiv = true;
        this.tspdetails = response['NewDataSet']['Table1'];
        this.tspdetails_set = response['NewDataSet']['Table'];


      } else {
        this.global.showAlert("TSP number is invalid.");
        this.global.routePage(AWBGatePassSearch);
      }
    }, (error) => {
      console.log(error);
    });
  }

  clearInputs() {
    this.TSPNumber = '';
    this.Prefix = '';
    this.MAWBNo = '';
    this.showDiv = false;
  }

}
