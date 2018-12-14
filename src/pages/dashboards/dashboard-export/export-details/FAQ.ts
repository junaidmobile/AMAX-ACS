/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:49
 * @modify date 2018-07-16 11:43:49
 * @desc [description]
*/
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';

@Component({
    selector: 'page-export-FAQ',
    templateUrl: 'FAQ.html'
})

export class FAQ implements OnInit {
    appBuildConfig: any;
    title: String;
    constructor(public navCtrl: NavController, public global: GlobalProvider) {
        this.appBuildConfig = this.global.appBuildConfig;
        this.title = "FAQ's-Export";
    }


    ngOnInit() {

    }
}
