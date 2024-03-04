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
import { AWBGatePassQRCode } from './AWB-GatePass-QRCode';
import { AWBGatePassSearch } from './AWB-GatePass';
export class TSPSerachClass { pi_intHAWBRowId: any; pi_strUserName: any; }
@Component({
  selector: 'AWB-Milestone',
  templateUrl: 'AWB-Milestone.html'
})



export class AWBGatePassMileStone implements OnInit {
  appBuildConfig: any;
  title: String;
  _allPrams: TSPSerachClass
  _strUserName: any;
  showDiv: boolean;
  HAWBID: any;
  mileStoneData: any;
  MAWBNo: string;
  HAWBNo: string;
  genrateData: any;
  pi_strIGMDetailsXML: string;
  DlvblChWt: any;
  DlvblGrWt: any;
  DlvblPkgs: any;
  IGMId: any;
  PartyName: any = '';
  OCNumber: any = '';
  @ViewChild('_OCNumber') _OCNumber;
  @ViewChild('_PartyName') _PartyName;
  OoCNo: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {

    this.HAWBID = localStorage.getItem('HAWBId');
    this.MAWBNo = localStorage.getItem('MAWBNo');
    this.HAWBNo = localStorage.getItem('HAWBNo');
    this._allPrams = new TSPSerachClass()
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Milestone Status";


  }


  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    this.getTSP_Details();
  }



  goTOGatePassQRCode() {

    if (this.OCNumber == '' || this.OCNumber == 0) {
      this.global.showAlert("Please enter OC Number.");
      return;
    }

    localStorage.setItem('DlvblChWt', this.DlvblChWt);
    localStorage.setItem('DlvblGrWt', this.DlvblGrWt);
    localStorage.setItem('DlvblPkgs', this.DlvblPkgs);
    localStorage.setItem('OCNumber', this.OCNumber);
    localStorage.setItem('PartyName', this.PartyName);
    localStorage.setItem('pi_strIGMDetailsXML', this.pi_strIGMDetailsXML);

    this.global.routePage(AWBGatePassQRCode);
  }
  getTSP_Details() {

    this._allPrams.pi_intHAWBRowId = this.HAWBID;
    this._allPrams.pi_strUserName = this._strUserName;

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetHawbStatusBasedOnHAWBNo_HHT_HAWB, this._allPrams).then((response) => {
      console.log(response)
      if (response != null && response != "") {
        this.mileStoneData = response['NewDataSet']['Table'];
        this.genrateData = response['NewDataSet']['Table1'];


        this.DlvblChWt = this.genrateData[0]['DlvblChWt'][0]
        this.DlvblGrWt = this.genrateData[0]['DlvblGrWt'][0]
        this.DlvblPkgs = this.genrateData[0]['DlvblPkgs'][0]
        this.IGMId = this.genrateData[0]['IGMId'][0]
        this.OCNumber = this.genrateData[0]['OoCNo'][0]
        this.PartyName = this.genrateData[0]['PartyName'][0]

        this.pi_strIGMDetailsXML = '<GPIGM><Data IGMRowID="' + this.genrateData[0]['IGMId'][0] + '" Pkgs="' + this.genrateData[0]['DlvblPkgs'][0] + '" GrWt="' + this.genrateData[0]['DlvblGrWt'][0] + '" ChWt="' + this.genrateData[0]['DlvblChWt'][0] + '" /></GPIGM>'


      } else {
        //this.global.showAlert("TSP paid for this Number.");
        //this.showConfirm();
      }
    }, (error) => {
      console.log(error);
    });
  }
  // showConfirm() {
  //   let confirm = this.alertCtrl.create({
  //     title: 'Record not found.',
  //     buttons: [
  //       {
  //         text: 'Ok',
  //         handler: () => {
  //           this.global.routePage(AWBGatePassSearch);
  //         }
  //       }
  //     ]
  //   });
  //   confirm.present();
  // }

  clearInputs() {

    this.MAWBNo = '';
    this.HAWBNo = '';
    this.showDiv = false;
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
