/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:45:47
 * @modify date 2018-07-16 11:45:47
 * @desc [description]
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HttpProvider } from '../../../providers/http/http';
import { GlobalProvider } from '../../../providers/global/global';
import { Constants } from '../../../constant';
export class DeliveryOrder { strMAWBNO: any; strHAWBNO: any; intIGMNo: any; intIGMYear: any }
@Component({
    selector: 'page-issue-delivery-order',
    templateUrl: 'issue-delivery-order.html'
})

export class IssueDeliveryOrder implements OnInit {
    @ViewChild('MAWBNoValue') myInput;
    @ViewChild('PrefixValue') PrefixInput;
    @ViewChild('IGMNumber') IGMNumber;
    deliveryOrder: DeliveryOrder
    Prefix: any;
    MAWBNo: any;
    AWBResponse: any;
    showDiv: boolean;
    appBuildConfig: any;
    IGMNo: any;
    masterDataResp: any;
    isDOCreated: boolean;
    HAWBNO: any;
    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider) {
        this.deliveryOrder = new DeliveryOrder();
        this.appBuildConfig = this.global.appBuildConfig;
    }

    // On Page Load
    ngOnInit() {

    }

    // fetch DO Details for  IGMNo. and MAWBNo.
    GetDeliveryDetails() {
        if (this.IGMNo == undefined || (this.IGMNo == '') || (this.IGMNo.length < 7)) {
            this.global.showAlert("Please enter valid IGMNO.");
            return;
        }

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


    // fetching details
    getDetails() {
        this.showDiv = false;
        this.deliveryOrder.strMAWBNO = this.Prefix + this.MAWBNo;
        this.deliveryOrder.intIGMNo = (this.IGMNo == undefined || this.IGMNo == '') ? 0 : this.IGMNo;
        this.deliveryOrder.strHAWBNO = (this.HAWBNO == undefined) ? '' : this.HAWBNO;
        this.deliveryOrder.intIGMYear = new Date().getFullYear();
        this.http.getHttpPostRequest(Constants.GMAX_Services.Orders.deliveryOrder.delivery_Order_Details, this.deliveryOrder).then((response) => {
            //console.log("Response : ", JSON.stringify(response));
            if (response != null && response != "" && response.hasOwnProperty('NewDataSet') && response["NewDataSet"] != '') {
                this.showDiv = true;
                let dataSet = response['NewDataSet'];
                if (dataSet.hasOwnProperty('Table')) {
                    let table = dataSet['Table'][0];
                    this.masterDataResp = table;
                    if (table['HAWBDOStatus'][0] == "1" || table['HAWBDOStatus'][0] == "true") {
                        this.isDOCreated = true;
                    } else if (table['HAWBStatus'][0] == "0" || table['HAWBStatus'][0] == "false") {
                        this.isDOCreated = false;
                    } else {

                    }
                }
            } else {
                this.global.showAlert("MAWB number is invalid.");
            }
        }, (error) => { });

    }

    // this fuction is invoked when to create or revoke DO
    createDO(service_name) {
        this.createOrRevoke(service_name);
    }

    // based on condition this function is called
    createOrRevoke(service_name) {
        let strMAWBNo = this.Prefix + this.MAWBNo;
        let UserName = JSON.parse(this.global.get('userResp')).UserName[0];
        let DeliveryOrder = {
            'strMAWBNo': strMAWBNo,
            'UserName': UserName
        }
        this.http.getHttpPostRequest(service_name, DeliveryOrder).then((response) => {
            //console.log("Response : ", JSON.stringify(response));
            if (response != null && response != "" && response.hasOwnProperty('NewDataSet') && response["NewDataSet"] != '') {
                let table = response['NewDataSet']['Table'][0];
                if (table.hasOwnProperty('DOStatus')) {
                    this.global.showToast(table['DOStatus'][0]);
                    this.showDiv = false;
                    if (this.isDOCreated) {
                        this.GetDeliveryDetails();
                    }
                } else { }

            } else {
                this.global.showToast("Delivery order creation/revoke failed");
            }
        })

    }

    // on Submit or Revoke Button is Clicked
    submitOrRevoke() {

        if (this.IGMNo == undefined || (this.IGMNo == '') || (this.IGMNo.length < 7)) {
            this.global.showAlert("Please enter valid IGMNO.");
            return;
        }

        if (this.Prefix == undefined || (this.Prefix == '') || (this.Prefix.length < 3)) {
            this.global.showAlert("Please enter valid Prefix.");
            return;
        }

        if (this.MAWBNo == undefined || (this.MAWBNo == '') || (this.MAWBNo.length < 8)) {
            this.global.showAlert("Please enter valid MAWB No.");
            return;
        }
        if (!this.isDOCreated) {
            //Submit
            this.createDO(Constants.GMAX_Services.Orders.deliveryOrder.create_DO);
        } else if (this.isDOCreated) {
            //Revoke
            this.deleteDO(Constants.GMAX_Services.Orders.deliveryOrder.delete_DO);
        } else {

        }
    }

    // set Input Focus
    focusNextInput() {
        if (this.Prefix.length == 3) {
            this.myInput.setFocus();
        }
    }

    ionViewDidLoad() {
        setTimeout(() => {
            this.IGMNumber.setFocus();
        }, 500);
    }

    // delete the DO
    deleteDO(service_name) {
        let alert = this.alertCtrl.create({
            title: 'Delete Delivery Order?',
            message: 'Do you want to delete this Delivery order?',
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
                        this.createOrRevoke(service_name);
                    }
                }
            ]
        });
        alert.present();
    }

    // clear all the inputs
    clearInputs() {
        this.Prefix = "";
        this.MAWBNo = "";
        this.IGMNo = "";
        this.HAWBNO = "";
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
