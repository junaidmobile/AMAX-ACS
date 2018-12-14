/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:44:23
 * @modify date 2018-07-16 11:44:23
 * @desc [description]
*/
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
@Component({
    selector: 'page-import-FAQ',
    templateUrl: 'FAQ-import.html'
})

export class FAQImport implements OnInit {
    appBuildConfig: any;
    title: String;
    constructor(public navCtrl: NavController, public global: GlobalProvider) {
        this.appBuildConfig = this.global.appBuildConfig;
        this.title = "FAQ's-Import";
    }


    ngOnInit() {

    }

}
