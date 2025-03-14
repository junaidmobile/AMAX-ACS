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
import { ScanTSPOption } from './Scan-TSP-Option';
import { TSPSearch } from './TSP-Search';
import { RecordDelivery } from './Record-Delivery';
import { ApproveDelivery } from './Approve-Delivery';
import { ApproveDeliverySubmit } from './Approve-Delivery-Submit';
import { AccessVehicleToken } from './Access-Vehicle-Token';
import { ApprovedGatePassCountPage } from '../../../approved-gate-pass-count/approved-gate-pass-count';

import { RevokeGatePassPage } from '../../../revoke-gate-pass/revoke-gate-pass';
import { TestPage } from '../../../test/test';
import { ImportScanPage } from '../../../import-scan/import-scan';

export class ScanTSPStaffVar { pi_dtfromdate: any; pi_dttodate: any; pi_strclientcode: any; }
@Component({
  selector: 'Scan-TSP-Staff',
  templateUrl: 'Scan-TSP-Staff.html'
})

export class ScanTSPStaff implements OnInit {
  appBuildConfig: any;
  title: String;
  exportVehicleVehicletokensummary: any;
  custodianData: any[] = [];
  _fromDate: any = '';
  _toDate: any = '';
  _custodian: any = '';
  showDiv: boolean;
  slotDetail: any;
  DOStat: any;

showRevokeGatepass: boolean = false; //Revoke Gatepass
showRecordDelivery: boolean = false;//Record Delivery'
isAccessToken: boolean = false;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {

    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Digital Delivery Docket";
    this.DOStat = JSON.parse(this.global.get('userResp')).Organization[0].Type[0];
    console.log(this.DOStat);
    if(JSON.parse(this.global.get('userResp')).RolePermissionCollection){
    for(let i = 2; i < JSON.parse(this.global.get('userResp')).RolePermissionCollection[0].clsRolePermissions.length; i++){
      if(JSON.stringify(JSON.parse(this.global.get('userResp')).RolePermissionCollection[0].clsRolePermissions[i]).includes("Revoke Gatepass"))
      this.showRevokeGatepass = true;

      if(JSON.stringify(JSON.parse(this.global.get('userResp')).RolePermissionCollection[0].clsRolePermissions[i]).includes("Record Delivery"))
      this.showRecordDelivery = true;

      if(JSON.stringify(JSON.parse(this.global.get('userResp')).RolePermissionCollection[0].clsRolePermissions[i]).includes("Access Token"))
      this.isAccessToken = true;
    }  
    console.log(this.showRevokeGatepass);

    console.log(this.showRecordDelivery);

    console.log(this.isAccessToken);



    }
  }

  ngOnInit() {
    // this.ExpDashImages = Constants.ImportImages;
    //console.log("ExpDashImages : ", this.ExpDashImages)
  }

  logOut() {
    this.global.confirmlogOut();
  }

  notifications() {
    //this.global.routePage(Notifications);
  }

  goToScanTSPDetail() {
    this.global.routePage(ScanTSPOption);
  }
  goToQRCodeSearch() {
    this.global.routePage(TSPSearch);
  }
  goToRecordDelivery() {
    this.global.routePage(RecordDelivery);
  }
  goToApproveDelivery() {
    this.global.routePage(ApproveDelivery);
  }
  goToAccessVehicleToken(){
    // this.global.routePage(AccessVehicleToken);
    this.global.routePage(ImportScanPage);

  }
  goToReports(){
    this.global.routePage(ApprovedGatePassCountPage);
  }

  
  // Madhuri 10-02-2022
  goToRevokeGatePass(){
    this.global.routePage(RevokeGatePassPage);
  }

}
