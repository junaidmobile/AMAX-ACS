/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:45:39
 * @modify date 2018-07-16 11:45:39
 * @desc [description]
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { HttpProvider } from '../../../providers/http/http';
import { GlobalProvider } from '../../../providers/global/global';
import { Notifications } from '../../notifications/notifications';
import { Constants } from '../../../constant';
import moment from 'moment';

export class GetAirWayBillHistoryForHHT { pi_strAirwayBillNo: string;pi_strUserName: any;
 }

export class CartingOrder { pi_strMawbNo: string; pi_strAirline: number; pi_strFlightNo: string; pi_strFlightDate: string; pi_strOffpoint: string; pi_intAwbStatus: number; pi_UserName: string }
@Component({
    selector: 'page-issue-carting-order',
    templateUrl: 'issue-carting-order.html'
})

export class IssueCartingOrder implements OnInit {
    @ViewChild('MAWBNoValue') myInput;
    @ViewChild('PrefixValue') PrefixInput;
    @ViewChild('flight2') flightInput;
    cartingOrder: CartingOrder
    Prefix: any;
    MAWBNo: any;
    Resp: any;
    showDiv: boolean;
    flighttxt = '';
    flightnum: any = '';
    appBuildConfig: any;
    flightDate: any = '';
    isNative: any;
    AirwillResp: any;
    cartingOffPoint: any;
    isCOCreated: boolean;
    airWayBillHistory: GetAirWayBillHistoryForHHT;
    ResponseDetails: any;
  private _strUserName: any;
    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider, public datePicker: DatePicker) {
        this.cartingOrder = new CartingOrder();
        this.airWayBillHistory = new GetAirWayBillHistoryForHHT();
        this.appBuildConfig = this.global.appBuildConfig;
        this.isNative = this.global.isNative();
        this.init();
    }

    // on Page Load
    ngOnInit() {
      this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    }

    // fetch the CO Details
    GetCartingDetails() {
        if (this.Prefix == undefined || (this.Prefix == '') || (this.Prefix.length < 3)) {
            this.global.showAlert("Please enter valid Prefix.");
            return;
        }

        if (this.MAWBNo == undefined || (this.MAWBNo == '') || (this.MAWBNo.length < 8)) {
            this.global.showAlert("Please enter valid MAWB No.");
            return;
        }
        this.getDetails();

    }

    // based on the condition this function is invoked for Submit/Approve
    submitOrApprove() {
        this.checkValidation();
    }

    // getting Details for CO
    getDetails() {
        this.showDiv = false;
        this.airWayBillHistory.pi_strAirwayBillNo = this.Prefix + this.MAWBNo;
        this.airWayBillHistory.pi_strUserName = this._strUserName

        this.http.getHttpPostRequest(Constants.GMAX_Services.Orders.cartingOrder.carting_Order_Details, this.airWayBillHistory).then((response) => {
            //console.log("Response : ", JSON.stringify(response));
            if (response != null && response != "" && response.hasOwnProperty('clsAirWayBill')) {
                this.ResponseDetails = response['clsAirWayBill'];
                this.AirwillResp = this.ResponseDetails;

                if (this.AirwillResp.COStatus[0] == 6 || this.AirwillResp.COStatus[0] == 5) {
                    // for CO Approval Submit
                    this.isCOCreated = false;
                    this.flightDate = new Date();
                    this.flighttxt = JSON.parse(this.global.get('userResp')).Organization[0].Airline2Code[0];
                    this.flightnum = '';
                    // this.flightnum = JSON.parse(this.global.get('userResp')).Organization[0].AirLine3Code[0];
                } else if (this.AirwillResp.COStatus[0] == 7) {
                    // for CO Revoke
                    this.isCOCreated = true;
                    if (this.hasProp(this.ResponseDetails, 'FlightNo')) {
                        let FlightNo = this.ResponseDetails['FlightNo'][0];
                        this.flighttxt = FlightNo.substring(0, 2);
                        this.flightnum = FlightNo.substring(2, 5);
                        console.log('flight txt : ' + this.flighttxt + " flight num : " + this.flightnum);

                    }
                    if (this.hasProp(this.ResponseDetails, 'FlightTime')) {
                        this.flightDate = this.ResponseDetails['FlightTime'][0];
                    } else {
                        this.flightDate = '';
                    }
                    if (this.hasProp(this.ResponseDetails, 'CODetails')) {
                        this.cartingOffPoint = this.ResponseDetails['CODetails'][0]['Destination'][0];
                    } else {
                        this.cartingOffPoint = '';
                    }
                }

                this.Resp.FirstCarrier = this.processData('FlightOrg');
                this.Resp.Destination = this.processData('Destination');
                this.Resp.Packets = this.processData('ActualPackageCount');
                this.Resp.GrossWeight = this.processData('ActualGrossWt');
                this.Resp.NetWeight = this.processData('NetWeight');
                // console.log("RESP : ", this.Resp)
                this.showDiv = true;
            } else {
                this.global.showAlert("MAWB number is invalid.");
            }
        }, (error) => { });
    }

    // check is input valid before submit
    checkValidation() {
        if (!this.isCOCreated && (this.flighttxt == undefined || (this.flighttxt == '') || (this.flighttxt.length < 2))) {
            this.global.showAlert("Please enter valid flight Text.");
            return;
        }

        if (!this.isCOCreated && (this.flightnum == undefined || (this.flightnum.length < 4))) {
            this.global.showAlert("Please enter valid flight Number.");
            return;
        }

        if (!this.isCOCreated && (this.flightDate == undefined || (this.flightDate == ''))) {
            this.global.showAlert("Please enter valid flight Date.");
            return;
        }

        if (!this.isCOCreated && (this.cartingOffPoint == undefined || (this.cartingOffPoint == '') || (this.cartingOffPoint.length < 3))) {
            this.global.showAlert("Please enter valid flight Off Point.");
            return;
        }

        if (this.isCOCreated)
            this.deleteCO();
        else if (!this.isCOCreated)
            this.submitCO();
        else { }

    }

    // revoke/delete the CO for particular MAWBNo.
    revoke() {
        let strMAWBNo = this.Prefix + this.MAWBNo;
        let UserName = JSON.parse(this.global.get('userResp')).UserName[0];
        let airline_revokeData = {
            'pi_strMawbNo': strMAWBNo,
            'pi_strCreatedBy': UserName
        }
        this.http.getHttpPostRequest(Constants.GMAX_Services.Orders.cartingOrder.delete_CO, airline_revokeData).then((response) => {
            //console.log("Response : ", JSON.stringify(response));
            if (response != null && response != "" && response.hasOwnProperty('NewDataSet')) {
                let table = response['NewDataSet']['Table'][0];
                if (table.hasOwnProperty('COStatus')) {
                    this.global.showToast(table['COStatus'][0]);
                    this.showDiv = false;
                }
            } else {
                this.global.showToast("Revoke failed");
            }
        })

    }

    // Submit the CO Details
    submitCO() {
        this.cartingOrder.pi_strMawbNo = this.Prefix + this.MAWBNo;
        this.cartingOrder.pi_intAwbStatus = 7;
        this.cartingOrder.pi_strFlightNo = this.flighttxt + this.flightnum;
        if (!this.global.isNative()) {
            this.cartingOrder.pi_strFlightDate = this.global.formatDate(this.flightDate);
        } else {
            this.cartingOrder.pi_strFlightDate = this.flightDate;
        }
        this.cartingOrder.pi_strOffpoint = this.cartingOffPoint;
        this.cartingOrder.pi_UserName = JSON.parse(this.global.get('userResp')).UserName[0];
        // this.cartingOrder.pi_strAirline = 7;
        this.http.getHttpPostRequest(Constants.GMAX_Services.Orders.cartingOrder.create_CO, this.cartingOrder).then((response) => {
            //console.log("Response : ", JSON.stringify(response));
            if (response != null && response != "" && response.hasOwnProperty('NewDataSet') && response['NewDataSet'] != '') {
                let table = response['NewDataSet']['Table'][0];
                if (table.hasOwnProperty('COStatus')) {
                    this.global.showToast(table['COStatus'][0]);
                    this.clearAllFields();
                    this.getDetails();
                }
            } else {
                this.global.showToast("submit failed");
            }
        })
    }

    // check if property exists in the object
    hasProp(o, name) {
        return o.hasOwnProperty(name);
    }

    // generic validation for the response
    processData(Key) {
        return this.ResponseDetails.hasOwnProperty(Key) ? this.ResponseDetails[Key][0] : '--';
    }


    // open native Calendar with current date
    openDatepicker() {
        // if (this.AirwillResp.COStatus[0] == 6 || this.AirwillResp.COStatus[0] == 5) {
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
        }).then(
            date => {
                this.flightDate = moment(date).format('DD/MM/YYYY');
                // console.log("flightDate : ", this.flightDate)
                // console.log("actual date : ", date)
            },
            err => console.log('Error occurred while getting date: ', err)
        );
        // } else {
        //     return;
        // }

    }

    ionViewDidLoad() {
        setTimeout(() => {
            this.PrefixInput.setFocus();
        }, 500);
    }

    focusNextInput() {
        if (this.Prefix.length == 3) {
            this.myInput.setFocus();
        }
    }

    focusElem() {
        if (this.flighttxt.length >= 2) {
            this.flightInput.setFocus();
        }
    }

    logOut() {
        this.global.confirmlogOut();
    }

    notifications() {
        this.global.routePage(Notifications);
    }

    // confirm before deleting the CO Details
    deleteCO() {
        let alert = this.alertCtrl.create({
            title: 'Delete Carting Order?',
            message: 'Do you want to delete this carting order?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.revoke();
                    }
                }
            ]
        });
        alert.present();
    }

    // clear all Inputs
    clearAllFields() {
        this.init();
    }

    // initialistaion
    init() {
        this.Resp = { Destination: "", Packets: "", GrossWeight: "", NetWeight: "" };
        this.flightDate = "";
        this.cartingOffPoint = "";
        this.flighttxt = "";
        this.flightnum = "";
    }

    // clear Prefix and MawbNo.
    clearInputs() {
        this.Prefix = "";
        this.MAWBNo = "";
        this.showDiv = false;
    }

    // Just to animate the fab
    fabGone = false;
    ionViewWillEnter() {
        this.fabGone = false;
    }

    ionViewWillLeave() {
        this.fabGone = true;
    }

}
