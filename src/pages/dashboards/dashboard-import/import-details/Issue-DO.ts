/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:44:19
 * @modify date 2018-07-16 11:44:19
 * @desc [description]
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HttpProvider } from '../../../../providers/http/http';
import { GlobalProvider } from '../../../../providers/global/global';
export class IssueDO { IGMNo: any; ddlYear: any; strMAWBNo: any; strHAWBNo: any; UserName: any }

import moment from 'moment';
import { Constants } from '../../../../constant';

@Component({
    selector: 'page-import-Issue-DO',
    templateUrl: 'Issue-DO.html'
})

export class IssueDOImport implements OnInit {
    @ViewChild('MAWBNoValue') myInput;
    @ViewChild('PrefixValue') PrefixInput;
    @ViewChild('IGMNumber') IGMNumber;

    Prefix: string = '';
    MAWBNo: string = '';
    HAWBNO: string = '';
    appBuildConfig: any;
    consoleDO: IssueDO;
    showAWBDetails: boolean;
    IGMNO: any;
    consolDOStat: any;
    title: String;
    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider) {
        this.consoleDO = new IssueDO();
        this.appBuildConfig = this.global.appBuildConfig;
        this.title = "Issue DO";
    }


    ngOnInit() {
    }


    issueDO() {
        if (this.IGMNO == undefined || (this.IGMNO == '') || (this.IGMNO.length < 7)) {
            this.global.showAlert("Please enter valid IGMNO.");
            return;
        }

        if (this.Prefix == undefined || (this.Prefix == '') || (this.Prefix.length < 3)) {
            this.global.showAlert("Please enter valid Prefix.");
            return;
        }

        if (this.MAWBNo == undefined || (this.MAWBNo == '') || (this.MAWBNo.length < 8)) {
            this.global.showAlert("Please enter valid MAWB No.");
            return;
        }

        this.getConsoleDODetails();
    }

    getConsoleDODetails() {
        this.showAWBDetails = false;
        if (this.Prefix.length >= 3 && this.MAWBNo.length >= 8) {
            this.consoleDO.IGMNo = (this.IGMNO == undefined || this.IGMNO == '') ? 0 : this.IGMNO;
            this.consoleDO.ddlYear = new Date().getFullYear();
            this.consoleDO.strMAWBNo = this.Prefix + this.MAWBNo;
            this.consoleDO.strHAWBNo = (this.HAWBNO == undefined) ? '' : this.HAWBNO;
            this.consoleDO.UserName = JSON.parse(this.global.get('userResp')).UserName[0];

            this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.IssueDOStatus, this.consoleDO).then((response) => {
                //console.log("Response : ", JSON.stringify(response));
                if (response != null && response != "" && response.hasOwnProperty('NewDataSet') && response["NewDataSet"] != '') {
                    // console.log('Response : ', response);
                    this.showAWBDetails = true;
                    let table = response['NewDataSet']['Table'][0];
                    if (table.hasOwnProperty('ConsolDOStatus')) {
                        this.consolDOStat = table['ConsolDOStatus'][0]
                        this.global.showToast(this.consolDOStat);
                    } else {
                        this.global.showAlert("Issue DO failed");
                    }
                } else {
                    this.global.showAlert("Issue DO failed");
                }
            }, (error) => { });
        }
    }

    focusNextInput() {
        if (this.Prefix.length == 3) {
            this.myInput.setFocus();
        }
    }



    checkStatus(status) {
        return (status == 'true' || status == true) ? 'Done' : (status == 'false' || status == false) ? 'Pending' : moment(status).format('DD-MMM-YYYY HH:mm');
    }

    ionViewDidLoad() {
        setTimeout(() => {
            this.IGMNumber.setFocus();
        }, 800)
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
        this.IGMNO = "";
        this.HAWBNO = "";
        this.showAWBDetails = true;
    }



}
