import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import { GlobalProvider } from '../../providers/global/global';
import { HttpProvider } from '../../providers/http/http';
import { ExportScangroupidCcPage } from '../export-scangroupid-cc/export-scangroupid-cc';

/**
 * Generated class for the ExportCartingchallanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export class AwbDetails {
  pi_strAWBNo: String;
  pi_strGrpId: String;
}

export class CancelCartingAWB {
  pi_strCartingChallanNo: any;
  pi_strCartingDetailsXML: any;
  pi_strUserName: any;
}


@IonicPage()
@Component({
  selector: 'page-export-cartingchallan',
  templateUrl: 'export-cartingchallan.html',
})
export class ExportCartingchallanPage {

  awbno: String;
  awbid: any;
  strUserName: any;

  pieces: String;
  grwt: String;
  origin: String;
  destination: String;
  flno: String;
  fldt: String;
  hoDate: String;
  hoTime: String;
  cDate: String;
  cTime: String;
  tdgAwbDetailsParams: AwbDetails;
  CancelCartingAWBParams: CancelCartingAWB;
  tableData: any;
  Remark: any;
  challanNo: String;

  isCartingDone: boolean = false;

  constructor(public navCtrl: NavController, public http: HttpProvider, public global: GlobalProvider, public navParams: NavParams) {
    this.awbno = "";
    this.awbid = "";
    this.pieces = "";
    this.grwt = "";
    this.origin = "";
    this.destination = "";
    this.flno = "";
    this.fldt = "";
    this.hoDate = "";
    this.hoTime = "";
    this.cDate = "";
    this.cTime = "";
    this.Remark = "";
    this.challanNo = "";
    this.isCartingDone = false;
    this.tdgAwbDetailsParams = new AwbDetails();
    this.CancelCartingAWBParams = new CancelCartingAWB();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExportCartingchallanPage');
    this.isCartingDone = true;
    this.clearAllValues();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ExportCartingchallanPage');

    if (this.awbno != undefined)
      if (this.awbno != "")
       this.getAwbDetails();
  }

  ngOnInit() {
    this.strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
  }

  switchAWB($event) {
    console.log($event.value);
    this.awbno = $event.value;
    console.log(this.awbno);
  }

  // scanAWBNO() {
  //   if (this.awbno == undefined)
  //     return;

  //   this.getAwbDetails();
  // }


  scanAWBNO() {
    if (this.awbno == undefined)
      return;

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.awbno.toString())) {
      this.awbno = "";
      this.global.showAlert("Please enter only standard alpha numerics in VCT No.");
    } else {
      this.awbno = this.awbno.toString().toUpperCase();
      this.getAwbDetails();
    }


  }



  getAwbDetails() {

    if (this.awbno == undefined) {
      alert("Kindly enter or scan AWB No.");
      return;
    }

    if (this.awbno.toString().trim() == "") {
      alert("Kindly enter or scan AWB No.");
      return;
    }

    this.pieces = "";
    this.grwt = "";
    this.origin = "";
    this.destination = "";
    this.flno = "";
    this.fldt = "";
    this.hoDate = "";
    this.hoTime = "";
    this.cDate = "";
    this.cTime = "";
    this.awbid = "";
    this.Remark = "";
    this.challanNo = "";
    this.isCartingDone = false;

    this.tdgAwbDetailsParams.pi_strAWBNo = this.awbno;
    localStorage.setItem('VCT_AWB', this.awbno.toString());

    this.tdgAwbDetailsParams.pi_strGrpId = "";


    this.http.getHttpPostRequest("Exp_GetCartingChallanDetails_HHT", this.tdgAwbDetailsParams).then((response) => {

      console.log(response);
      if (response.hasOwnProperty('NewDataSet')) {
        console.log(response['NewDataSet']['Table']);
        this.tableData = response['NewDataSet']['Table'][0];

        this.awbid = this.tableData.AWBId[0];
        localStorage.setItem('VCT_AWBID', this.awbid.toString());
        this.pieces = this.tableData.Pieces[0];
        this.grwt = this.tableData.GrWt[0];
        this.origin = this.tableData.Origin[0];
        this.destination = this.tableData.Dest[0];
        this.flno = this.tableData.FlightNo[0];
        this.fldt = this.tableData.FlightDate[0];
        this.challanNo = this.tableData.CartingChallanNo[0];
        this.Remark = this.tableData.Remarks[0];

        localStorage.setItem('VCT_PCS', this.pieces.toString());
        localStorage.setItem('VCT_GRWT', this.grwt.toString());
        localStorage.setItem('VCT_ORG', this.origin.toString());
        localStorage.setItem('VCT_DEST', this.destination.toString());
        localStorage.setItem('VCT_FLNO', this.flno.toString());
        localStorage.setItem('VCT_FLDT', this.tableData.FlightDate[0].toString());
        localStorage.setItem('VCT_CNO', this.challanNo.toString());
        localStorage.setItem('VCT_Remark', this.Remark.toString());

        localStorage.setItem('VCT_HANDDT', this.tableData.HandoverDate[0].toString());
        localStorage.setItem('VCT_CARTDT', this.tableData.CartingDate[0].toString());

        if (this.challanNo.toString() != '')
          this.isCartingDone = true;

        if (this.tableData.FlightDate[0].toString() != "")
          if (!this.tableData.FlightDate[0].includes("1900")) {
            let dateString = this.tableData.FlightDate[0].toString();
            let newDate = new Date(dateString);
            this.fldt = moment(newDate).format('DD-MMM-y');
            console.log(moment(newDate).format('H:mm'));
          }
        // this.hoDate = this.tableData.HandoverDate[0];
        // this.hoTime = this.tableData.HandoverDate[0];
        // this.cDate = this.tableData.CartingDate[0];
        // this.cTime = this.tableData.CartingDate[0];

        if (this.tableData.HandoverDate[0].toString() != "")
          if (!this.tableData.HandoverDate[0].includes("1900")) {
            let dateString = this.tableData.HandoverDate[0].toString();
            let newDate = new Date(dateString);
            this.hoDate = moment(newDate).format('DD-MMM-y');
            this.hoTime = moment(newDate).format('H:mm');
          }

        if (this.tableData.CartingDate[0].toString() != "")
          if (!this.tableData.CartingDate[0].includes("1900")) {
            let dateString = this.tableData.CartingDate[0].toString();
            let newDate = new Date(dateString);
            this.cDate = moment(newDate).format('DD-MMM-y');
            this.cTime = moment(newDate).format('H:mm');
          }

      } else {
        this.global.showAlert(response['Root']['Output']);
        this.clearAllValues();
      }


    }, (error) => {
      this.global.showAlert(error);
    });
  }

  

  clearAllValues() {
    this.awbno = "";
    this.pieces = "";
    this.grwt = "";
    this.origin = "";
    this.destination = "";
    this.flno = "";
    this.fldt = "";
    this.hoDate = "";
    this.hoTime = "";
    this.cDate = "";
    this.cTime = "";
    this.Remark = "";
    this.challanNo = "";
    this.isCartingDone = false;
    localStorage.setItem('VCT_AWB', "");
    localStorage.setItem('VCT_AWBID', "");
    localStorage.setItem('VCT_PCS', "");
    localStorage.setItem('VCT_GRWT', "");
    localStorage.setItem('VCT_ORG', "");
    localStorage.setItem('VCT_DEST', "");
    localStorage.setItem('VCT_FLNO', "");
    localStorage.setItem('VCT_FLDT', "");
    localStorage.setItem('VCT_HANDDT', "");
    localStorage.setItem('VCT_CARTDT', "");
    localStorage.setItem('VCT_Remark', "");
    localStorage.setItem('VCT_CNO', "");
  }
  


  openNextForm() {

    if (this.awbno == undefined) {
      alert("Kindly enter or scan AWB No.");
      return;
    }

    if (this.awbno.toString().trim() == "") {
      alert("Kindly enter or scan AWB No.");
      return;
    }

    localStorage.setItem('VCT_Remark', this.Remark.toString());

    this.global.routePage(ExportScangroupidCcPage);
  }

  exitForm() {
    this.navCtrl.pop();
  }

  holdCarting() {
    if (this.awbno == undefined) {
      alert("Kindly enter or scan AWB No.");
      return;
    }

    if (this.awbno.toString().trim() == "") {
      alert("Kindly enter or scan AWB No.");
      return;
    }

    var saveAWBData = "";

    saveAWBData = '<CCDetails AWBId="' + this.awbid +
      '" AWBNo="' + this.awbno +
      '" AWBPkgs="' + this.pieces +
      '" AWBGrWt="' + this.grwt +
      '" FlightNo="' + this.flno +
      '" FlightDate ="' +localStorage.getItem('VCT_FLDT') +
      '" Dest="' + this.destination +
      '" HandOverDt="' +localStorage.getItem('VCT_HANDDT') +
      '" CartingDt="'   +localStorage.getItem('VCT_CARTDT') +
      '" Remarks="' + this.Remark + '"  />';
  
    saveAWBData = "<Root>" + saveAWBData + "</Root>";

    console.log(saveAWBData);
    
    this.CancelCartingAWBParams.pi_strCartingChallanNo = localStorage.getItem('VCT_CNO');
    this.CancelCartingAWBParams.pi_strCartingDetailsXML = saveAWBData;
    this.CancelCartingAWBParams.pi_strUserName =JSON.parse(this.global.get('userResp')).UserName[0];

    this.http.getHttpPostRequest("Exp_CancelCartingChallanDetails_HHT", this.CancelCartingAWBParams).then((response) => {
      // console.log(response['NewDataSet']['Table'][0]);
      if (response != null && response != "") {
        console.log(response);
        if (response.hasOwnProperty('NewDataSet')) {

          console.log(response['NewDataSet']['Table']);

          this.tableData = response['NewDataSet']['Table'];
          //this.VehicleTrackResp = response['NewDataSet']['Table'][0];

          try {
            if (this.tableData.OutputMessage) {
              if (this.tableData.OutputMessage != "")
                this.global.showAlert(this.tableData.OutputMessage);
            }
            else if (this.tableData.OutputMessage[0]) {
              if (this.tableData.OutputMessage != "")
                this.global.showAlert(this.tableData.OutputMessage[0]);
            }
          } catch (err) {
            console.log(err.toString());
          }
        }
        else {
          this.global.showAlert(response['Root']['Output']);
          if (response['Root']['Output'].toString().toLowerCase().includes("success")) {
            this.clearAllValues();
          }
        }
      }
    }, (error) => {
      this.global.showAlert(error);
    });

  }

  isNextDisabled(): boolean {
    if (this.isCartingDone == true)
      return true;
    else
      return false;
  }


  isCancelDisabled(): boolean {
    if (this.isCartingDone == true)
      return false;
    else
      return true;

  }



}
