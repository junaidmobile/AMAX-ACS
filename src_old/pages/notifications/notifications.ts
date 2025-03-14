/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:45:24
 * @modify date 2018-07-16 11:45:24
 * @desc [description]
*/
import { Component } from '@angular/core';
import { Modal, ModalController, ModalOptions, ViewController, Events } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { HttpProvider } from '../../providers/http/http';
import { Constants } from '../../constant';
import { NotificationDetail } from './notification-details/notification-detail';

@Component({
    selector: 'notifications',
    templateUrl: 'notifications.html'
})
export class Notifications {
    appBuildConfig: any;
    notification_list: any;
    isNotified: boolean;
    constructor(public global: GlobalProvider, private http: HttpProvider, public modalCtrl: ModalController, public viewCtrl: ViewController, public event: Events) {
        this.appBuildConfig = this.global.appBuildConfig;
    }


    logOut() {
        this.global.confirmlogOut();
    }


    confirmExit() {
        this.global.ExitApp();
    }

    fetchNotifications() {
        this.http.getHttpGetRequest(Constants.ONE_SIGNAL_NOTIFACTION_URL).then((res) => {
            // console.log("all notifications : ", JSON.stringify(res));
            this.notification_list = res;
            this.isNotified = true;
            window.localStorage.setItem('isNotificationsSeen', "true");
            this.event.publish('isNotificationsSeen');
        })
    }

    // fetchNotifications() {
    //     this.notification_list = { "total_count": 53, "offset": 0, "limit": 50, "notifications": [{ "contents": { "en": "We are pleased to inform you that the Dangerous Goods training programs conducted by GVK MIAL, has got the prestigious IATA ATS (Accredited Training School) status." }, "delivery_time_of_day": "5:12PM", "headings": { "en": "Notification1" } }, { "contents": { "en": "MIAL can conduct DGR training programs with IATA certification for shippers, freight forwarders and airlines personnel, involved in the transportation of dangerous goods." }, "delivery_time_of_day": "2:40PM", "headings": { "en": "Notification2" } }, { "contents": { "en": "For enquiries, kindly contact MIAL Cargo Training Section on MIAL.CargoTraining@gvk.com or call on +91 9820742209/+91 9930144166." }, "delivery_time_of_day": "3:22PM", "headings": { "en": "Notification3" } }] };
    //     this.isNotified = true;
    // }

    ionViewDidLoad() {
        this.fetchNotifications();
    }

    openModal1(notification) {
        const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false,
            cssClass: 'inset-modal'
        };
        const myModal: Modal = this.modalCtrl.create(NotificationDetail, { 'notification': notification }, myModalOptions);

        myModal.present();
        myModal.onDidDismiss((data) => {
            //console.log("I have dismissed.");
            //console.log(data);
        });

        myModal.onWillDismiss((data) => {
            //console.log("I'm about to dismiss");
            //console.log(data);
        });
    }


}

