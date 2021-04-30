import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';
import { GlobalProvider } from '../global/global';
import { Constants } from '../../constant';
import { Notifications } from '../../pages/notifications/notifications';
import { Events } from 'ionic-angular';

@Injectable()
export class PushNotificationServiceProvider {

    constructor(private oneSignal: OneSignal, public global: GlobalProvider, public event: Events) {
        // console.log('Hello PushNotificationServiceProvider Provider');
    }

    Init() {
        this.oneSignal.startInit(Constants.APP_ID, Constants.GOOOGLE_PROJECT_NUMBER);

        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

        this.oneSignal.handleNotificationReceived().subscribe(() => {
            // do something when notification is received
            this.event.publish('incrementCount', 1);
        });

        this.oneSignal.handleNotificationOpened().subscribe(() => {
            // do something when a notification is opened
            // this.global.setRootPage(Notifications);
            this.global.routePage(Notifications);
        });

        // console.log(this.oneSignal.getPermissionSubscriptionState)

        this.oneSignal.endInit();
    }


}
