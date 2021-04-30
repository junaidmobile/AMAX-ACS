/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:44:29
 * @modify date 2018-07-16 11:44:29
 * @desc [description]
*/
// This Class is Made for future use, when Vehicle Tracking will be available for Imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HttpProvider } from '../../../../providers/http/http';
import { GlobalProvider } from '../../../../providers/global/global';
import { Constants } from '../../../../constant';

export class ImportVehicle { pi_ArrAWBNo: any; 'isDesktop': boolean }
@Component({
    selector: 'page-import-Vehicle-tracking',
    templateUrl: 'Vehicle-tracking-import.html'
})

export class VehicleTrackingImport implements OnInit {
    importVehicle: ImportVehicle
    Prefix: any;
    MAWBNo: any;
    VehicleTrackResp: any;
    showDiv: boolean;
    tableData: any;
    @ViewChild('MAWBNoValue') MAWBInput;
    @ViewChild('PrefixValue') PrefixInput;
    appBuildConfig: any;
    title: String;
    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider) {
        this.importVehicle = new ImportVehicle();
        this.appBuildConfig = this.global.appBuildConfig;
        this.title = "VEHICLE TRACKING";
    }


    ngOnInit() {

    }
    ionViewDidLoad() {
        setTimeout(() => {
            this.PrefixInput.setFocus();
        }, 800)
    }

    GetVehicleDetails() {
        if (this.Prefix == undefined || (this.Prefix == '') || (this.Prefix.length < 3)) {
            this.global.showAlert("Please enter valid Prefix.");
            return;
        }

        if (this.MAWBNo == undefined || (this.MAWBNo == '') || (this.MAWBNo.length < 8)) {
            this.global.showAlert("Please enter valid MAWB No.");
            return;
        }

        this.getVehicleDetails();
    }

    focusNextInput() {
        if (this.Prefix.length >= 3) {
            this.MAWBInput.setFocus();
        }
    }

    getVehicleDetails() {
        this.importVehicle.pi_ArrAWBNo = this.Prefix + this.MAWBNo;
        this.importVehicle.isDesktop = false;
        this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.Vehicle_tracking, this.importVehicle).then((response) => {
            //console.log("Response : ", response);
            if (response != null && response != "") {
                this.showDiv = true;
                this.VehicleTrackResp = response;
                if (response.hasOwnProperty('clsUser')) {
                    this.tableData = response['clsUser'].NewDataSet.Table1;
                }
            } else {
                this.global.showAlert("MAWB number is invalid.");
            }
        }, (error) => { });
    }



}
