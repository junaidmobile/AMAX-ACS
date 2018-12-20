/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:52
 * @modify date 2018-07-16 11:43:52
 * @desc [description]
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HttpProvider } from '../../../../providers/http/http';
import { GlobalProvider } from '../../../../providers/global/global';
import moment from 'moment';
import { Constants } from '../../../../constant';

export class ExportVehicle { pi_ArrAWBNo: any; isDesktop: boolean }
export class VehicleModel { LaneMarkingArea: any; GateIn: any; DockIn: any; DockOut: any; GateOut: any }
@Component({
    selector: 'page-export-Vehicle-tracking',
    templateUrl: 'Vehicle-tracking.html'
})

export class VehicleTracking implements OnInit {
    exportVehicle: ExportVehicle
    Prefix: any;
    MAWBNo: any;
    VehicleTrackResp: any;
    showDiv: boolean;
    VehicleResp: any;
    vehicleModel: any;
    appBuildConfig: any;
    @ViewChild('PrefixValue') PrefixInput;
    @ViewChild('MAWBNoValue') myInput;
    title: String;
    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider) {
        this.exportVehicle = new ExportVehicle();
        this.vehicleModel = new VehicleModel();
        this.appBuildConfig = this.global.appBuildConfig;
        this.title = "VEHICLE TRACKING";
    }


    ngOnInit() {

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

        this.exportVehicle.pi_ArrAWBNo = this.Prefix + this.MAWBNo;
        this.exportVehicle.isDesktop = false;
        this.fetchVehicleDetails();

    }

    fetchVehicleDetails() {
        // Check if records is not available from first service. then fetch records from the other service
        this.http.getHttpPostRequest(Constants.GMAX_Services.Exports.Vehicle_tracking, this.exportVehicle).then((response) => {
            //console.log("Response : ", response);
            if (response != null && response != "") {
                this.setVehicleDetails(response);
            } else if (response == null || response == '') {
                this.getVehicleDetails(Constants.GMAX_CSC_perishabe_URL, Constants.GMAX_Services.Exports.Vehicle_tracking);
            } else {
                this.global.showAlert("Shipment does not exist.");
            }
        }, (error) => { });
    }

    getVehicleDetails(url, service_name) {
        this.http.getHttpPostRequest1(url, service_name, this.exportVehicle).then((response) => {
            //console.log("Response : ", response);
            if (response != null && response != "") {
                this.setVehicleDetails(response)
            } else {
                this.global.showAlert("Shipment does not exist.");
            }
        }, (error) => { });
    }


    setVehicleDetails(response) {
        this.VehicleTrackResp = response;
        if (response.hasOwnProperty('NewDataSet')) {
            this.VehicleResp = response['NewDataSet'];
            let table_1 = this.VehicleResp.Table1[0];
            if (table_1.hasOwnProperty('LaneMarkingArea')) {
                this.vehicleModel.LaneMarkingArea = this.processData(table_1.LaneMarkingArea[0]);
            }

            if (table_1.hasOwnProperty('GateIn')) {
                this.vehicleModel.GateIn = this.processData(table_1.GateIn[0]);
            }

            if (table_1.hasOwnProperty('DockIn')) {
                this.vehicleModel.DockIn = this.processData(table_1.DockIn[0]);
            }

            if (table_1.hasOwnProperty('DockOut')) {
                this.vehicleModel.DockOut = this.processData(table_1.DockOut[0]);
            }

            if (table_1.hasOwnProperty('GateOut')) {
                this.vehicleModel.GateOut = this.processData(table_1.GateOut[0]);
            }

            this.showDiv = true;
            //console.log("VehicleResp : ", this.VehicleResp);
        }
    }

    processData(data) {
        return moment(data).format('DD-MMM-YYYY HH:mm');
    }


    focusNextInput() {
        if (this.Prefix.length >= 3) {
            this.myInput.setFocus();
        }
    }

    ionViewDidLoad() {
        setTimeout(() => {
            this.PrefixInput.setFocus();
        }, 800);
    }


    // Just to animate the fab
    fabGone = false;
    ionViewWillEnter() {
        this.fabGone = false;
    }

    ionViewWillLeave() {
        this.fabGone = true;
    }

    // clear all the inputs
    clearInputs() {
        this.Prefix = "";
        this.MAWBNo = "";
        this.showDiv = false;
    }



}
