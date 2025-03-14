import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationDetail } from './notification-detail';

@NgModule({
    declarations: [
        NotificationDetail,
    ],
    imports: [
        IonicPageModule.forChild(NotificationDetail),
    ],
    exports: [
        NotificationDetail
    ]
})

export class NotiModalPageModule { }
