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
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
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
import { AWBTrackingCSC } from '../pages/dashboards/csc/export-details/AWB-tracking';
import { VehicleTrackingCSC } from '../pages/dashboards/csc/export-details/Vehicle-tracking';
import { EGMCSC } from '../pages/dashboards/csc/export-details/EGM';
import { DashboardExportCSC } from '../pages/dashboards/csc/dashboard-export';
import { CscMainMenuPage } from '../pages/csc-main-menu/csc-main-menu';
import { HomePage } from '../pages/home/home';
import { VehicleTokenSummary } from '../pages/dashboards/dashboard-export/export-details/Vehicle-tokensummary';
import { DatePipe } from '@angular/common';
import { DeliveryDocket } from '../pages/dashboards/dashboard-import/import-details/Delivery-Docket';
import { AWBGatePassSearch } from '../pages/dashboards/dashboard-import/import-details/AWB-GatePass';
import { AWBGatePassMileStone } from '../pages/dashboards/dashboard-import/import-details/AWB-Milestone';
import { AWBGatePassQRCode } from '../pages/dashboards/dashboard-import/import-details/AWB-GatePass-QRCode';
import { TSPQRCode } from '../pages/dashboards/dashboard-import/import-details/TSP-QRCode';
import { TSPSearch } from '../pages/dashboards/dashboard-import/import-details/TSP-Search';
import { NgxBarcodeModule } from 'ngx-barcode';
import { ScanTSPStaff } from '../pages/dashboards/dashboard-import/import-details/Scan-TSP-Staff';
import { ScanTSPOption } from '../pages/dashboards/dashboard-import/import-details/Scan-TSP-Option';
import { StorageLocationList } from '../pages/dashboards/dashboard-import/import-details/Storage-Location-List';
import { TSPCreate } from '../pages/dashboards/dashboard-import/import-details/TPS-Create';
import { TPSMileStone } from '../pages/dashboards/dashboard-import/import-details/TPS-MileStone';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipsModule } from 'ionic-tooltips';
import { TSPCharges } from '../pages/dashboards/dashboard-import/import-details/TSP_Procced';
import { HAWBDetail } from '../pages/dashboards/dashboard-import/import-details/HAWB-Detail';
import { cancelGP } from '../pages/dashboards/dashboard-import/import-details/Cancel-GP';
import { VTDashboard } from '../pages/dashboards/dashboard-import/import-details/VT-Dashboard';
import { ActiveGatePasses } from '../pages/dashboards/dashboard-import/import-details/Active-GatePasses';
import { ActiveGatePasseslist } from '../pages/dashboards/dashboard-import/import-details/Active-GatePasses-list';
import { DeliveryAcceptance } from '../pages/dashboards/dashboard-import/import-details/Delivery-Acceptance';

import { VehicleTokens } from '../pages/dashboards/dashboard-import/import-details/Vehicle-Tokens';
import { DeliverySubmit } from '../pages/dashboards/dashboard-import/import-details/Delivery-Submit';
import { RecordDelivery } from '../pages/dashboards/dashboard-import/import-details/Record-Delivery';
import { RecordDeliveryDetail } from '../pages/dashboards/dashboard-import/import-details/Record-Delivery-Detail';
import { ApproveDeliverySubmit } from '../pages/dashboards/dashboard-import/import-details/Approve-Delivery-Submit';
import { ApproveDelivery } from '../pages/dashboards/dashboard-import/import-details/Approve-Delivery';
import { AccessVehicleToken } from '../pages/dashboards/dashboard-import/import-details/Access-Vehicle-Token';
import { DOCSUplaod } from '../pages/dashboards/dashboard-import/import-details/DOCS_Uplaod';
import { VTBarcodeDetail } from '../pages/dashboards/dashboard-import/import-details/VT-Barcode-Detail';
import { DOCSUploadOC } from '../pages/dashboards/dashboard-import/import-details/DOCS-Upload-OC';
import { GPDetailDetach } from '../pages/dashboards/dashboard-import/import-details/GP-Detail-Detach';
import { TGDAcceptance } from '../pages/dashboards/dashboard-import/import-details/TGD-Acceptance';
import { ULDLocation } from '../pages/dashboards/dashboard-import/import-details/ULD-Location';
import { VehicleTokenDriverDetails } from '../pages/dashboards/dashboard-import/import-details/Vehicle-Token-DriverDetails';
import { ActiveSingleGatePass } from '../pages/dashboards/dashboard-import/import-details/Active-Single-GatePass';
import { VehicleTokensAirIndia } from '../pages/dashboards/dashboard-import/import-details/Vehicle-Tokens-AirIndia';
import { GPDetailBarcode } from '../pages/dashboards/dashboard-import/import-details/GP-Detail-Barcode';
import { TSPSuccessMessage } from '../pages/dashboards/dashboard-import/import-details/TSP-Success-Message';
import { TSPHAWBDetail } from '../pages/dashboards/dashboard-import/import-details/TSP-HAWB-Detail';
import { VTGenerateBarCode } from '../pages/dashboards/dashboard-import/import-details/VT-Generate-BarCode';
import { AIVTList } from '../pages/dashboards/dashboard-import/import-details/AI-VT-List';
import { AIBarcode } from '../pages/dashboards/dashboard-import/import-details/AI-Barcode';

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
    AccessVehicleToken,
    VehicleTokens,
    UpperCaseText,
    AWBTrackingCSC,
    VehicleTrackingCSC, EGMCSC, DashboardExportCSC,
    CscMainMenuPage, HomePage, VehicleTokenSummary,
    DeliveryDocket, AWBGatePassSearch, AWBGatePassMileStone,
    AWBGatePassQRCode, TSPSearch, TSPQRCode, ScanTSPStaff,
    ScanTSPOption, StorageLocationList, TSPCreate, TPSMileStone, TSPCharges, HAWBDetail,
    cancelGP, VTDashboard, ActiveGatePasses, ActiveGatePasseslist, DeliveryAcceptance, DeliverySubmit,
    RecordDelivery, RecordDeliveryDetail, ApproveDeliverySubmit,
    ApproveDelivery, DOCSUplaod, VTBarcodeDetail, DOCSUploadOC, GPDetailDetach, TGDAcceptance,
    ULDLocation, VehicleTokenDriverDetails, ActiveSingleGatePass,
    VehicleTokensAirIndia, GPDetailBarcode, TSPSuccessMessage, TSPHAWBDetail, VTGenerateBarCode,
    AIVTList,AIBarcode
  ],
  imports: [
    HttpClientModule,
    PipesModule,
    HttpModule,
    BrowserModule,
    NgxBarcodeModule,

    NotiModalPageModule,
    BrowserAnimationsModule,
    TooltipsModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          backButtonIcon: 'ios-arrow-back', backButtonText: 'Back'
        }, android: { backButtonIcon: 'md-arrow-back', backButtonText: '' }
      }, spinner: 'ios', modalEnter: 'modal-slide-in', modalLeave: 'modal-slide-out'
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
    HeaderDirective,
    AccessVehicleToken,
    VehicleTokens,
    AWBTrackingCSC, VehicleTrackingCSC, EGMCSC, DashboardExportCSC,
    CscMainMenuPage, HomePage, VehicleTokenSummary, DeliveryDocket,
    AWBGatePassSearch, AWBGatePassMileStone,
    AWBGatePassQRCode, TSPSearch, TSPQRCode,
    ScanTSPStaff, ScanTSPOption, StorageLocationList, TSPCreate, TPSMileStone, TSPCharges, HAWBDetail,
    cancelGP, VTDashboard, ActiveGatePasses, ActiveGatePasseslist, DeliveryAcceptance, DeliverySubmit,
    RecordDelivery, RecordDeliveryDetail, ApproveDeliverySubmit,
    ApproveDelivery, DOCSUplaod, VTBarcodeDetail, DOCSUploadOC, GPDetailDetach, TGDAcceptance,
    ULDLocation, VehicleTokenDriverDetails, ActiveSingleGatePass,
    VehicleTokensAirIndia, GPDetailBarcode, TSPSuccessMessage, TSPHAWBDetail, VTGenerateBarCode,
    AIVTList,AIBarcode
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,

    { provide: ErrorHandler, useClass: IonicErrorHandler }, HttpProvider, Network,
    NetworkProvider,
    GlobalProvider,
    DatePicker,
    OneSignal,

    PushNotificationServiceProvider, DatePipe
  ]
})
export class AppModule { }
