/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 04:00:52
 * @modify date 2018-07-16 04:00:52
 * @desc [description]
*/
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'notification-detail-modal',
    templateUrl: 'notification-detail.html'
})
export class NotificationDetail {
    notification: string;

    constructor(
        public viewCtrl: ViewController,
        params: NavParams
    ) {
        this.notification = params.get('notification');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
