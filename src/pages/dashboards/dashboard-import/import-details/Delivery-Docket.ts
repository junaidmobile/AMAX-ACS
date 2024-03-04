/**
 * @author Mohammaed Junaid
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:30
 * @modify date 2018-07-16 11:43:30
 * @desc [description]
*/
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpProvider } from '../../../../providers/http/http';
import { Constants } from '../../../../constant';
import { AWBGatePassSearch } from './AWB-GatePass';
import { TSPSearch } from './TSP-Search';
import { TSPCreate } from './TPS-Create';
import { ScanTSPOption } from './Scan-TSP-Option';
import { VTDashboard } from './VT-Dashboard';
import { DeliveryAcceptance } from './Delivery-Acceptance';


export class DeliveryDocketforVariable { pi_dtfromdate: any; pi_dttodate: any; pi_strclientcode: any; }
@Component({
  selector: 'Delivery-Docket',
  templateUrl: 'Delivery-Docket.html'
})




export class DeliveryDocket implements OnInit {
  appBuildConfig: any;
  title: String;
  _allPrams: DeliveryDocketforVariable;
  exportVehicleVehicletokensummary: any;
  custodianData: any[] = [];
  _fromDate: any = '';
  _toDate: any = '';
  _custodian: any = '';
  showDiv: boolean;
  slotDetail: any;
  OrganizationType: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {
    this._allPrams = new DeliveryDocketforVariable()
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Digital Delivery Docket";

  }

  ngOnInit() {
    // this.ExpDashImages = Constants.ImportImages;
    //console.log("ExpDashImages : ", this.ExpDashImages)
    this.OrganizationType = JSON.parse(this.global.get('userResp')).Organization[0].Type[0];
    console.log("OrganizationType : ", this.OrganizationType)
  }

  logOut() {
    this.global.confirmlogOut();
  }

  notifications() {
    //this.global.routePage(Notifications);
  }

  goToImportTPS() {
    // if (this.OrganizationType == 3) {
    //   this.global.routePage(TSPSearch);
    // } else if (this.OrganizationType == 4) {
    //   this.global.routePage(TSPCreate);
    // }
    this.global.routePage(TSPSearch);
  }

  goToGatePass() {
    // this.global.routePage(AWBGatePassSearch);
    this.global.routePage(TSPCreate);

  }

  goVehicleToken() {
    this.global.routePage(VTDashboard);
    //this.global.showAlert("COMING SOON");
  }

  goToDeliveryAcceptance() {
    this.global.routePage(DeliveryAcceptance);
    //this.global.showAlert("COMING SOON");
  }


}
