/**
 * @author Mohammaed Junaid
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:30
 * @modify date 2018-07-16 11:43:30
 * @desc [description]
*/
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpProvider } from '../../../../providers/http/http';
import { Constants } from '../../../../constant';
import { TSPQRCode } from './TSP-QRCode';
import { VTBarcodeDetail } from './VT-Barcode-Detail';
import { DeliveryDocket } from './Delivery-Docket';
import { ActiveGatePasseslist } from './Active-GatePasses-list';
import { ActiveSingleGatePass } from './Active-Single-GatePass';
import { VehicleTokensAirIndia } from './Vehicle-Tokens-AirIndia';
import { VTGenerateBarCode } from './VT-Generate-BarCode';
import { AIBarcode } from './AI-Barcode';
//export class TSPSerachClass { pi_chrSearchParam: any; pi_strTSPNo: any; pi_strMAWBNo: any; pi_strHAWBNo: any; po_strMessage: any; po_chrAlert: any }
export class GPerachClass { pi_strClient: any; pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }

@Component({
  selector: 'AI-VT-List',
  templateUrl: 'AI-VT-List.html'
})
export class AIVTList implements OnInit {

  appBuildConfig: any;
  title: String;
  Prefix: any = '';
  HAWBList: any;
  MAWBList: any;
  MAWBNo: any = '';
  _allPrams: GPerachClass
  _strUserName: any;
  showDiv: boolean;
  tspdetails: any;
  TSPPaidAmount: any;
  tspdetails_set: any;
  showSearchField = false;
  chkMAWB: any;
  isChecked; boolean;
  public items: any = [];
  @ViewChild('PrefixValue') PrefixInput;
  @ViewChild('MAWBNoValue') myInput;
  @Input("plus") plus: any;
  segment: string;
  aarry: Array<{ title2: string, details2: string, icon2: string, showDetails2: boolean }> = [];
  data: Array<{ title: string, icon: string, showDetails: boolean, selected: boolean }> = [];
  gpCount: any;
  arrayObj: any[];
  objectData: any[];
  filterHAWBLst: any[];
  gatePassesListArr: any = [];
  activeVTs: any;
  vtCount: any = '0';
  vehicleDetail: any;
  VTtData: any;
  temp_MAWBList: Array<any> = [];
  filteredData: any[];
  checkall: boolean;
  aBooleanVariable: boolean;
  selectedAll: boolean;
  filterHAWBLstArr: any = [];
  check: boolean;

  GPError: string = '';
  staticbarcode: string = '';
  msg: string = '';
  // data1: Array<{ details1: string, showDetails1: boolean }> = [];
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {

    this._allPrams = new GPerachClass()
    this.appBuildConfig = this.global.appBuildConfig;
    this.segment = "VTList";
    this.title = "Summary";


  }


  ionViewWillEnter() {


  }

  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    // this.GetImpActiveGPDetails_HHT();
    this.GetImpActiveTokenDetails_HHT();
    localStorage.removeItem('ActiveGPList');
    console.log("ngOnInit : ");

  }



  GetImpActiveTokenDetails_HHT() {

    this._allPrams.pi_strClient = 'A';
    this._allPrams.pi_strUserName = this._strUserName;
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetImpActiveTokenDetails_HHT_List, this._allPrams).then((response) => {
      console.log("AAAIII Active : ", response);

      if (response != null && response != "") {
        this.activeVTs = response['NewDataSet']['Table'];
        this.VTtData = response['NewDataSet']['Table1'];
        this.vtCount = this.activeVTs.length;
        // GPId: ["44010"]
        // TokenNo: ["IVT2009010005"]
        // VehicleNo: ["KO 02 20 2525"]
      } else {
        // this.global.showAlert("Record not found.");
        // this.GPError = 'No Active Gate Passes';
        // this.staticbarcode = '123456789';
        // this.msg = 'Create Gate Pass to select records for VT generation.';
        this.GPError = 'No Active Vehicle Token';
        this.staticbarcode = '123456789';
        this.msg = 'To view records in the list, generate Vehicle Token.';
      }
    }, (error) => {
      console.log(error);
    });
  }

  goTOVTPQRCode(VNo, gadiNo, shed) {

    localStorage.setItem('comeVT', VNo);
    localStorage.setItem('gadiNo', gadiNo);
    localStorage.setItem('Shed', shed);

    this.global.routePage(AIBarcode);
  }

  navigateTOGenAI() {
    this.global.routePage(VehicleTokensAirIndia);
  }


}

