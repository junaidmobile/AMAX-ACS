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
import { myClass } from '../../../revoke-gate-pass/revoke-gate-pass';
import { ImportScanPage } from '../../../import-scan/import-scan';
import moment from 'moment';


// export class ImportVehicle { pi_ArrAWBNo: any; 'isDesktop': boolean }
export class ImportVehicle { pi_strMAWBNo: any; pi_strHAWBNo: any; pi_strUser: any; pi_chrModule: any }
export class TSPSerachClass { pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }

export class scanClass { pi_strVTNo: any; pi_strUser: any }

@Component({
    selector: 'page-import-Vehicle-tracking',
    templateUrl: 'Vehicle-tracking-import.html'
})

export class VehicleTrackingImport implements OnInit {
    importVehicle: ImportVehicle
    Prefix: any;
    MAWBNo: any;
    VehicleTrackResp: any;
    tspdetails: any;
    w: any;
    HAWBS: any = [];
    EVTS: any = [];

    hawb: any;
    _strUserName: any;
    _allPrams: TSPSerachClass
    showDiv: boolean;
    @ViewChild('MAWBNoValue') MAWBInput;
    @ViewChild('PrefixValue') PrefixInput;
    @ViewChild('spinner') SpinnerInput;

    appBuildConfig: any;
    title: String;
    myGateInDate: any = [];
    myGateOutDate: any = [];
    myDockOutDate: any = [];
    myDockInDate: any = [];

    _scanParams: scanClass;
    HAWBNumber: any;

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider) {
        this.importVehicle = new ImportVehicle();
        this._allPrams = new TSPSerachClass()

        this.appBuildConfig = this.global.appBuildConfig;
        this.title = "VEHICLE TRACKING";
        this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
        this._scanParams = new scanClass();
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
        } else
            this.getTSP_HAWB_Details();


        console.log(this.hawb);
        if (this.hawb == "Select")
            this.global.showAlert("Please select HAWB No.");
        else
            this.getVehicleDetails();
    }

    onHAWBChange(event) {
        console.log("onHAWBChange");
        console.log(event);
        if (this.Prefix == '') {
            this.global.showAlert("Please enter valid Prefix.");
            return;
        } else {
            if (this.Prefix.length < 3) {
                this.global.showAlert("Please enter valid Prefix.");
                return;
            }
        }

        if (event != 0) {
            this.hawb = event;

            if (this.hawb == "Select") {
                this.EVTS = [];
                this.myGateInDate = [];
                this.myGateOutDate = [];
                this.myDockInDate = [];
            }
            else
                this.getVehicleDetails();
            // this.HAWBNumber = event;
            // console.log(event);
        }
        else {
            this.EVTS = [];
            this.myGateInDate = [];
            this.myGateOutDate = [];
            this.myDockInDate = [];
        }
        // this.isInputDisabled();
    }

    switch($event) {
        console.log($event);
        this.hawb = $event;
    }

    focusNextInput() {
        if (this.Prefix.length == 3) {
            this.MAWBInput.setFocus();
        }
    }

    focusSpinner() {
        if (this.MAWBInput.value.length >= 8) {
            this.getTSP_HAWB_Details();
        }
    }


    getTSP_HAWB_Details() {
        this.HAWBS = [];
        this._allPrams.pi_strMAWBNo = this.Prefix + this.MAWBNo;
        this._allPrams.pi_strUserName = this._strUserName;
        this._allPrams.po_strMessage = '';
        this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetHAWBNosBasedOnMAWBNos_HHT_MAWB, this._allPrams).then((response) => {

            // this.showDiv = true;
            // this.tspdetails = this.w;

            if (response != null && response != "") {
                //this.HAWBS.push("Select");
                for (let i = 0; i < response['NewDataSet']['Table'].length; i++) {
                    this.HAWBS.push(response['NewDataSet']['Table'][i].HAWBNo[0]);
                }

                console.log(this.HAWBS);
            } else {
                this.global.showAlert("MAWB number is invalid.");
            }
        }, (error) => {
            console.log(error);
        });
    }

    toggleSection(i) {
        this.EVTS[i].open = !this.EVTS[i].open;
        console.log(this.EVTS[i].open);
    }

    
    getVehicleDetails() {
        // this.importVehicle.pi_ArrAWBNo = this.Prefix + this.MAWBNo;
        // this.importVehicle.isDesktop = false;
        this.EVTS = [];
        this.myGateInDate = [];
        this.myGateOutDate = [];
        this.myDockInDate = [];
        this.myDockOutDate = [];

        this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
        console.log(this._strUserName);

        this.importVehicle.pi_strMAWBNo = this.Prefix + this.MAWBNo;//"12598098011";
        this.importVehicle.pi_strHAWBNo = this.hawb;//HAWB1
        this.importVehicle.pi_chrModule = "I";
        this.importVehicle.pi_strUser = this._strUserName;

        this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.Vehicle_tracking, this.importVehicle).then((response) => {
            console.log("Response : ", response);
            /* if (response != null && response != "") {
                this.showDiv = true;
                this.VehicleTrackResp = response;
                if (response.hasOwnProperty('clsUser')) {
                    response['NewDataSet']['Table'][i] = response['clsUser'].NewDataSet.Table1;
                }
            } else {
                this.global.showAlert("MAWB number is invalid.");
            }
     */

            if (response != null && response != "") {
                if (response.hasOwnProperty('NewDataSet')) {
                    this.showDiv = true;

                    for (let i = 0; i < response['NewDataSet']['Table'].length; i++) {
                        this.EVTS.push(response['NewDataSet']['Table'][i]);

                        // console.log("response['NewDataSet']['Table'][i].GateInDate[0]===" + response['NewDataSet']['Table'][i].GateInDate[0]);

                        let blankdt = "";
                        if (response['NewDataSet']['Table'][i].GateInDate[0] == "") {
                            this.myGateInDate.push(blankdt);
                        }
                        else {
                            var e1_GateInDate = moment(response['NewDataSet']['Table'][i].GateInDate[0]).format('DD MMM YYYY HH:mm');
                            this.myGateInDate.push(e1_GateInDate);

                            // console.log("momentDate===" + momentDate);
                            // console.log("date===" + date);
                            // let d_GateInDate = (new Date(response['NewDataSet']['Table'][i].GateInDate[0]).toDateString()).substring(4);
                            // let e_GateInDate = response['NewDataSet']['Table'][i].GateInDate[0].substring(11, 16);
                            // let s_GateInDate = d_GateInDate.substring(4, 6).concat(" ").concat(d_GateInDate.substring(0, 3)).concat(" ");
                            // let e1_GateInDate = s_GateInDate.concat(d_GateInDate.substring(7, 11)).concat(" ").concat(e_GateInDate);


                        }

                        if (response['NewDataSet']['Table'][i].GateOutDate[0] == "") {
                            this.myGateOutDate.push(blankdt);
                        } else {

                            var e1_GateOutDate = moment(response['NewDataSet']['Table'][i].GateOutDate[0]).format('DD MMM YYYY HH:mm');
                            this.myGateOutDate.push(e1_GateOutDate);

                            // let d_GateOutDate = (new Date(response['NewDataSet']['Table'][i].GateOutDate[0]).toDateString()).substring(4);
                            // let e_GateOutDate = response['NewDataSet']['Table'][i].GateOutDate[0].substring(11, 16);
                            // let s_GateOutDate = d_GateOutDate.substring(4, 6).concat(" ").concat(d_GateOutDate.substring(0, 3)).concat(" ");
                            // let e1_GateOutDate = s_GateOutDate.concat(d_GateOutDate.substring(7, 11)).concat(" ").concat(e_GateOutDate);
                            // this.myGateOutDate.push(e1_GateOutDate);
                        }

                        if (response['NewDataSet']['Table'][i].DockInDate[0] == "") {
                            this.myDockInDate.push(blankdt);
                        } else {
                            var e1_DockInDate = moment(response['NewDataSet']['Table'][i].DockInDate[0]).format('DD MMM YYYY HH:mm');
                            this.myDockInDate.push(e1_DockInDate);

                            //     let d_DockInDate = (new Date(response['NewDataSet']['Table'][i].DockInDate[0]).toDateString()).substring(4);
                            // let e_DockInDate = response['NewDataSet']['Table'][i].DockInDate[0].substring(11, 16);
                            // let s_DockInDate = d_DockInDate.substring(4, 6).concat(" ").concat(d_DockInDate.substring(0, 3)).concat(" ");
                            // let e1_DockInDate = s_DockInDate.concat(d_DockInDate.substring(7, 11)).concat(" ").concat(e_DockInDate);
                            // this.myDockInDate.push(e1_DockInDate);
                        }

                        if (response['NewDataSet']['Table'][i].DockOutDate[0] == "") {
                            this.myDockOutDate.push(blankdt);
                        }
                        else {
                            var e1_DockOutDate = moment(response['NewDataSet']['Table'][i].DockOutDate[0]).format('DD MMM YYYY HH:mm');
                            this.myDockOutDate.push(e1_DockOutDate);
                            console.log("e1_DockOutDate===" + e1_DockOutDate);
                            // let d_DockOutDate = (new Date(response['NewDataSet']['Table'][i].DockOutDate[0]).toDateString()).substring(4);
                            // let e_DockOutDate = response['NewDataSet']['Table'][i].DockOutDate[0].substring(11, 16);
                            // let s_DockOutDate = d_DockOutDate.substring(4, 6).concat(" ").concat(d_DockOutDate.substring(0, 3)).concat(" ");
                            // let e1_DockOutDate = s_DockOutDate.concat(d_DockOutDate.substring(7, 11)).concat(" ").concat(e_DockOutDate);

                            // this.myDockOutDate.push(e1_DockOutDate);




                        }
                    }
                    console.log("this.myDockOutDate");
                    console.log(this.myDockOutDate);
                    // console.log(new Date(response['NewDataSet']['Table'][i].GateInDate[0]).toISOString().substring(11, 16));
                    if (this.EVTS.length < 3)
                        for (let k = 0; k < this.EVTS.length; k++) {

                            this.EVTS[k].open = true;
                        }

                }
                else {
                    this.global.showAlert(response['Root']['Output']);
                }
            }
        }, (error) => { });
    }

    scan() {
        this._scanParams.pi_strUser = this._strUserName;
        this._scanParams.pi_strVTNo = "IVT2202180001";

        // {
        //     "d": "<NewDataSet>\r\n  <Table>\r\n    <TokenNo>IVT2202180001</TokenNo>\r\n    <TokenDate>2022-02-18T11:09:08</TokenDate>\r\n    <VehicleNo>MH15FY6462</VehicleNo>\r\n    <Shed>CLF AREA</Shed>\r\n    <IsGateIn>0</IsGateIn>\r\n    <GateInDate />\r\n    <IsDockIn>0</IsDockIn>\r\n    <DockInDate />\r\n    <IsDockOut>0</IsDockOut>\r\n    <DockOutDate />\r\n    <IsGateOut>0</IsGateOut>\r\n    <GateOutDate />\r\n    <OutputMessage />\r\n  </Table>\r\n</NewDataSet>"
        // }
        // this.http.getHttpPostRequest("ImpTokenScanning_HHT", this._scanParams).then((response) => {
        //     console.log(response['NewDataSet']['Table'][0]);

        this.global.routePage(ImportScanPage);

        // });
    }


}

/*   this.w = {
                        "TokenNo": "IVT2202100001",
                        "TokenDate": "2022-02-10T11:17:28",
                        "VehicleNo": "MH34589023",
                        "IsDLMArea": "false",
                        "DLMAreaDate": [],
                        "IsGateIn": "true",
                        "GateInDate": "2022-02-10T20:00:08",
                        "IsDockIn": "true",
                        "DockInDate": "2022-02-10T20:09:44",
                        "IsDockOut": "true",
                        "DockOutDate": "2022-02-10T20:10:00",
                        "IsGateOut": "true",
                        "GateOutDate": "2022-02-10T20:11:40"
                    } */