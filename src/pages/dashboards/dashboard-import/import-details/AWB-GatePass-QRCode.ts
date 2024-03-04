import { HomePage } from './../../../home/home';
import { Input } from '@angular/core';
/**
 * @author Mohammaed Junaid
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:30
 * @modify date 2018-07-16 11:43:30
 * @desc [description]
*/
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpProvider } from '../../../../providers/http/http';
import { Constants } from '../../../../constant';
import { DeliveryDocket } from './Delivery-Docket';
import { AWBGatePassSearch } from './AWB-GatePass';
import { TSPCreate } from './TPS-Create';
export class TSPSerachClass {
  pi_strIGMDetailsXML: any; pi_strUserName: any; pi_intHAWBId: any;
  pi_intGPPieces: any; pi_decGPGrWt: any; pi_decChWt: any; pi_intOCNo: any; pi_strPartyName; pi_strNotifyMobileNo: any
}
@Component({
  selector: 'AWB-GatePass-QRCode',
  templateUrl: 'AWB-GatePass-QRCode.html'
})



export class AWBGatePassQRCode implements OnInit {
  @Input('title') title: string;
  @Input('isCSC') isCsc: boolean;
  color: String; // added by Himesh on 10/11/2020 to disable back navigation

  appBuildConfig: any;
  // title: String;
  _allPrams: TSPSerachClass
  _strUserName: any;
  showDiv: boolean;
  HAWBID: any;
  mileStoneData: any;
  MAWBNo: string;
  HAWBNo: string;
  genrateData: any;
  pi_strIGMDetailsXML: string;
  GPNo: any;
  DlvblChWt: any;
  DlvblGrWt: any;
  DlvblPkgs: any;
  IGMId: any;
  PartyName: any;
  OCNumber: any;
  XMLFomate: any;
  gpStatus: any;
  gpNumber: any;
  successMsg: string = '';
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {
    this.HAWBID = localStorage.getItem('HAWBId');
    this.MAWBNo = localStorage.getItem('MAWBNo');
    this.HAWBNo = localStorage.getItem('HAWBNo');

    this.DlvblChWt = localStorage.getItem('DlvblChWt');
    this.DlvblGrWt = localStorage.getItem('DlvblGrWt');
    this.DlvblPkgs = localStorage.getItem('DlvblPkgs');
    this.IGMId = localStorage.getItem('IGMId');

    this.OCNumber = localStorage.getItem('OCNumber');
    this.PartyName = localStorage.getItem('PartyName');

    this.XMLFomate = localStorage.getItem('pi_strIGMDetailsXML');
    this._allPrams = new TSPSerachClass()
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "GP Barcode";


  }


  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    // this.getTSP_Details();
  }

  ionViewDidEnter(){
   this.getTSP_Details();
  }

  getTSP_Details() {

    this._allPrams.pi_intHAWBId = this.HAWBID;
    this._allPrams.pi_intGPPieces = this.DlvblPkgs;
    this._allPrams.pi_decGPGrWt = this.DlvblGrWt;
    this._allPrams.pi_decChWt = this.DlvblChWt;
    this._allPrams.pi_intOCNo = this.OCNumber;
    this._allPrams.pi_strPartyName = this.PartyName
    this._allPrams.pi_strNotifyMobileNo = '';
    this._allPrams.pi_strUserName = this._strUserName;
    this._allPrams.pi_strIGMDetailsXML = this.XMLFomate;

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.IMPCreateGP_HHT_BarCode, this._allPrams).then((response) => {
      console.log("Response : ", JSON.stringify(response));
      
      console.log('test for bug: ', this._allPrams);
      
      if (response != null && response != "") {

        this.gpStatus = response['Root']['Output'].toString();
        if (this.gpStatus == 'Consol Agent Delivery Order is pending; Action Cancelled.' || this.gpStatus == 'Airline Delivery Order is pending; Action Cancelled.') {
          //this.global.showAlert(this.gpStatus);
          //this.global.routePage(AWBGatePassQRCode);
          this.showConfirm();
        } else {

          this.gpNumber = this.gpStatus;


          // if (this.gpStatus.startsWith("G")) {
          //   if (this.gpStatus == 'Gate Pass cannot be generated. OoC document has not been uploaded. Please upload OoC document through eDocket to proceed with Gate Pass generation.') {
          //     this.global.showAlert(this.gpStatus);
          //   }
          //   if (this.gpStatus == 'Gatepass cannot be generated. Airline DO is not released.' || this.gpStatus == 'Gatepass cannot be created. Shipment documents are not uploaded. Upload documents through eDocket to proceed with Gatepass creation.') {
          //     this.global.showAlert(this.gpStatus);
          //   } //new if for BC issue. added on 31/05
          //   // if (this.gpStatus == 'Gatepass cannot be generated. House DO is not released.') {
          //   //   this.global.showAlert(this.gpStatus);
          //   // } //new if for BC issue. added on 31/05
          //   else {
          //     this.showDiv = true;
          //     this.global.showAlert("Gate Pass  " + this.gpStatus + "  has been generated successfully.");
          //     // this.global.oocCount = 0; //new on 03/03
          //   }


          // } else {
          //   this.showDiv = false;
          //   this.global.showAlert(this.gpStatus);
          //   // this.global.showAlert('Please try Generating Gate Pass again');
          // } //end of old if block

          //new if block
          if (this.gpStatus.startsWith("Gate")) {
            
              this.global.showAlert(this.gpStatus);
          }
            
            
            else if(!this.gpStatus.startsWith("Gate")) {
              this.showDiv = true;
              this.global.showAlert("Gate Pass  " + this.gpStatus + " has been generated successfully.");
              // this.global.oocCount = 0; //new on 03/03
            }


          // } 
          else {
            this.showDiv = false;
            this.global.showAlert(this.gpStatus);
            // this.global.showAlert('Please try Generating Gate Pass again');
          }//end of new if block



          // this.TSPNoMsg = 'TSP No. ' + this.TSPSuccess + ' has been generated successfully.'
          //this.global.showAlert("Barcode is generated.");
          //this.successMsg = 'Transaction completed successfully.';

        }
      } else {
        // this.global.showAlert("Record not found.");
      }
    }, (error) => {
      console.log(error);
    });
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: this.gpStatus,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.global.routePage(AWBGatePassSearch);
          }
        }
      ]
    });
    confirm.present();
  }

  // Just to animate the fab
  fabGone = false;
  ionViewWillEnter() {
    this.fabGone = false;
  }

  ionViewWillLeave() {
    this.fabGone = true;
  }

  logOut() {
    this.global.confirmlogOut();
  }

  homeButton() {
    this.global.setRootPage(HomePage);
  }
  goToMAWB() {
    // this.global.routePage(TSPCreate);
    this.navCtrl.remove(this.navCtrl.getActive().index - 1, 2); //added by Himesh on 02/11/2020
  }

}
