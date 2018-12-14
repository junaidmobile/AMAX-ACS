/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:42:43
 * @modify date 2018-07-16 11:42:43
 * @desc [description]
*/
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HttpProvider } from '../providers/http/http';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { NetworkProvider } from '../providers/network/network';
import { Network } from '@ionic-native/network';
import { MainMenu } from '../pages/main-menu/main-menu';
import { GlobalProvider } from '../providers/global/global';
import { DashboardExport } from '../pages/dashboards/dashboard-export/dashboard-export';
import { DashboardImport } from '../pages/dashboards/dashboard-import/dashboard-import';
import { DashboardOther } from '../pages/dashboards/dashboard-other/dashboard-other';
import { AWBTracking } from '../pages/dashboards/dashboard-export/export-details/AWB-tracking';
import { VehicleTracking } from '../pages/dashboards/dashboard-export/export-details/Vehicle-tracking';
import { EGM } from '../pages/dashboards/dashboard-export/export-details/EGM';
import { FAQ } from '../pages/dashboards/dashboard-export/export-details/FAQ';
import { ApplicableCharges } from '../pages/dashboards/dashboard-export/export-details/Applicable-charges';
import { ChargeCalculator } from '../pages/dashboards/dashboard-other/others-details/Charge-Calculator';
import { PDBalance } from '../pages/dashboards/dashboard-other/others-details/PD-Balance';
import { ContactUs } from '../pages/dashboards/dashboard-other/others-details/ContactUs';
import { AWBTrackingImport } from '../pages/dashboards/dashboard-import/import-details/AWB-tracking';
import { VehicleTrackingImport } from '../pages/dashboards/dashboard-import/import-details/Vehicle-tracking-import';
import { IGMImport } from '../pages/dashboards/dashboard-import/import-details/IGM-import';
import { FAQImport } from '../pages/dashboards/dashboard-import/import-details/FAQ';
import { ApplicableChargesImport } from '../pages/dashboards/dashboard-import/import-details/Applicable-charges';
import { IssueCartingOrder } from '../pages/orders/carting-order/issue-carting-order';
import { IssueDeliveryOrder } from '../pages/orders/delivery-order/issue-delivery-order';
import { DatePicker } from '@ionic-native/date-picker';
import { Notifications } from '../pages/notifications/notifications';
import { FooterDirective } from '../directives/footer/footer';
import { NotiModalPageModule } from '../pages/notifications/notification-details/notification-details-module';
import { PipesModule } from '../pipes/pipes.module';
import { IssueDOImport } from '../pages/dashboards/dashboard-import/import-details/Issue-DO';
import { HeaderDirective } from '../directives/header/header';
import { UpperCaseText } from '../directives/upper-case/upper-case';
import { OneSignal } from '@ionic-native/onesignal';
import { PushNotificationServiceProvider } from '../providers/push-notification-service/push-notification-service';
@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    MainMenu,
    DashboardExport,
    DashboardImport,
    DashboardOther,
    AWBTracking,
    VehicleTracking,
    EGM,
    FAQ,
    ApplicableCharges,
    ChargeCalculator,
    PDBalance,
    ContactUs,
    AWBTrackingImport,
    VehicleTrackingImport,
    IGMImport,
    FAQImport,
    ApplicableChargesImport,
    IssueCartingOrder,
    IssueDeliveryOrder,
    Notifications,
    FooterDirective,
    IssueDOImport,
    HeaderDirective,
    UpperCaseText
  ],
  imports: [
    HttpClientModule,
    PipesModule,
    HttpModule,
    BrowserModule,
    NotiModalPageModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          backButtonIcon: 'ios-arrow-back', backButtonText: 'Back'
        }, android: { backButtonIcon: 'md-arrow-back', backButtonText: '' }
      }, spinner: 'ios', pageTransition: 'ios-transition', modalEnter: 'modal-slide-in', modalLeave: 'modal-slide-out'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    MainMenu,
    DashboardExport,
    DashboardImport,
    DashboardOther,
    AWBTracking,
    VehicleTracking,
    EGM,
    FAQ,
    ApplicableCharges,
    ChargeCalculator,
    PDBalance,
    ContactUs,
    AWBTrackingImport,
    VehicleTrackingImport,
    IGMImport,
    FAQImport,
    ApplicableChargesImport,
    IssueCartingOrder,
    IssueDeliveryOrder,
    Notifications,
    FooterDirective,
    IssueDOImport,
    HeaderDirective
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }, HttpProvider, Network,
    NetworkProvider,
    GlobalProvider,
    DatePicker,
    OneSignal,
    PushNotificationServiceProvider
  ]
})
export class AppModule { }
