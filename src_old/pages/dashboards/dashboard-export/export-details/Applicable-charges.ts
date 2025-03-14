/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:30
 * @modify date 2018-07-16 11:43:30
 * @desc [description]
*/
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
@Component({
    selector: 'page-export-appcharges',
    templateUrl: 'Applicable-charges.html'
})

export class ApplicableCharges implements OnInit {
    appBuildConfig: any;
    title: String;
    constructor(public navCtrl: NavController, public global: GlobalProvider) {
        this.appBuildConfig = this.global.appBuildConfig;
        this.title = "Applicable charges";
    }


    ngOnInit() {

    }





}
