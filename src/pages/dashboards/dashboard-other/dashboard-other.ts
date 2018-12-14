/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:45:02
 * @modify date 2018-07-16 11:45:02
 * @desc [description]
*/
import { Component, OnInit } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Constants } from '../../../constant';
import { PDBalance } from './others-details/PD-Balance';
import { ChargeCalculator } from './others-details/Charge-Calculator';
import { ContactUs } from './others-details/ContactUs';
import { GlobalProvider } from '../../../providers/global/global';
import { HttpProvider } from '../../../providers/http/http';
import { Notifications } from '../../notifications/notifications';

@Component({
  selector: 'page-dashboard-other',
  templateUrl: 'dashboard-other.html'
})

export class DashboardOther implements OnInit {
  OtherImages: any;
  appBuildConfig: any;
  constructor(public global: GlobalProvider, public http: HttpProvider, public alertCtrl: AlertController) {
    this.appBuildConfig = this.global.appBuildConfig;
  }

  logOut() {
    this.global.confirmlogOut();
  }

  notifications() {
    this.global.routePage(Notifications);
  }

  ngOnInit() {
    this.OtherImages = Constants.OthersImages;
  }

  goToPDbalance() {
    this.global.routePage(PDBalance);
  }

  goToChargeCalculator() {
    this.getCommodityDetails();
  }


  goToContactUs() {
    this.global.routePage(ContactUs);
  }


  getCommodityDetails() {
    this.http.getHttpPostRequest(Constants.GMAX_Services.Others.Commodity_details, {}).then((response) => {
      //console.log("Response : ", JSON.stringify(response));
      if (response != null && response != "" && response.hasOwnProperty('NewDataSet')) {
        let commDetails = response['NewDataSet'].Table;
        //console.log("commDetails : ", commDetails)
        this.global.routePageWithData(ChargeCalculator, { 'commDetails': commDetails });
      } else {
        this.global.showAlert("Shipment does not exist.");
      }
    }, (error) => { });
  }
}
