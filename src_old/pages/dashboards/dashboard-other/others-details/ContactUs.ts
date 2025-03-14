/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:44:48
 * @modify date 2018-07-16 11:44:48
 * @desc [description]
*/
import { Component, OnInit, Renderer } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Constants } from '../../../../constant';
import { GlobalProvider } from '../../../../providers/global/global';
@Component({
    selector: 'page-others-ContactUs',
    templateUrl: 'ContactUs.html'
})

export class ContactUs implements OnInit {
    contactUS: any[];
    appBuildConfig: any;
    title: String;
    constructor(public navCtrl: NavController, public renderer: Renderer, public global: GlobalProvider) {
        this.contactUS = Constants.getContactUsJSON;
        this.appBuildConfig = this.global.appBuildConfig;
        this.title = "ContactUs";
    }


    toggleSection(i) {
        this.contactUS[i].open = !this.contactUS[i].open;
    }

    toggleItem(i, j) {
        this.contactUS[i].children[j].open = !this.contactUS[i].children[j].open;
    }
    ngOnInit() {

    }
}
