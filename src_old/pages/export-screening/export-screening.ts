import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import { GlobalProvider } from '../../providers/global/global';
import { HttpProvider } from '../../providers/http/http';
import { ExportScangroupidSPage } from '../export-scangroupid-s/export-scangroupid-s';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
/**
 * Generated class for the ExportScreeningPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


export class AwbDetails {
  MAWBNo: String;
  goupID: String;
}

export class ScreeningMasters {
  TypeID: String;
}

// export class AWBDetailsDate {
//   TypeID: String;

// }






@IonicPage()
@Component({
  selector: 'page-export-screening',
  templateUrl: 'export-screening.html',
})
export class ExportScreeningPage {

  films: any = [];//Observable<any>;

  awbno: String;
  strUserName: any;

  pieces: String;
  grwt: String;
  origin: String;
  destination: String;
  screenedp: String;
  uscreenedp: String;

  screeningmethod: String = '';
  securitystatus: String = '';
  securitytype: String = '';
  exemptc: String = '';

  screeningAwbDetailsParams: AwbDetails;
  screeningMst: ScreeningMasters;

  //Scanning method , security status , security type , exempt cargo
  scanningMethod: any = [];
  securityStatus: any = [];
  securityType: any = [];
  exemptCargo: any = [];

  awbData: any = [];
  savedDataResponse: any = [];

  tableDataSaveFinal: Array<{

    RowID_I: number,// 0,
    AWBNumber: string,// 77781181111,
    Pieces: number,// 2,
    GrossWt: number,// 2.5,
    ChWt: number,// 2.5,
    Origin: string,// BOM,
    SecurityId: number,// 0,
    SecurityStatusID: string,// null,
    Destination: string,// BKK,
    Commodity: string,// testing cargo,
    CommodityGroup: string,// ,
    Remarks: string,// ,
    CreatedBy: string,// ConsolMIALUAT,
    CreatedOn: string,// 2023-04-13T13: ,//35: ,//19.71,
    UpdatedBy: string,// null,
    UpdatedOn: string,// null,
    ExemptCargo: string,// null,
    FlightNo: string,// ZZ2423 ,
    FlightDate: string,// 13/04/2023,
    MachineNo: string,// ,
    Status: string,// S,
    ErrorMessage: string,// Record Found,
    lstScreningMethod: string,// [],
    Security: string,// null,
    SecurityStatus: string,// null,
    Remark: string,// null,
    StickerStart: string,// null,
    StickerEnd: string,// null,
    StickerNoP: string,// null,
    lstScreeningGroupID: string,// []

  }>;



  constructor(public navCtrl: NavController, public http: HttpProvider,
    public global: GlobalProvider, public navParams: NavParams,
    private httpClient: HttpClient) {

    //   this.httpClient.get('https://galaxymialuat.kalelogistics.com/AMAXScreningAPI/api/Screning/GetScreeningMasters/4')
    // //  .map(res => res.json())
    //   .subscribe(data => { console.log(data);  });
    //   console.log("this.films");
    //   console.log(this.films);

    this.awbno = "";

    this.pieces = "";
    this.screenedp = "";
    this.uscreenedp = "";

    this.grwt = "";
    this.origin = "";
    this.destination = "";

    this.securitystatus = '';
    this.securitytype = '';

    // this.origin = "";
    // this.destination = "";
    // this.screenedp = "";
    // this.uscreenedp = "";

    this.screeningAwbDetailsParams = new AwbDetails();
    this.screeningMst = new ScreeningMasters();
    this.tableDataSaveFinal = [];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExportScreeningPage');
    this.getScanningMethod();
    this.getsecurityStatus();
    this.getsecurityType();
    this.getexemptCargo();

    // console.log(this.screeningmethod);
    // console.log(this.securitystatus);
    // console.log(this.securitytype);
    // console.log(this.exemptc);

    localStorage.setItem('AWBNO', "");
    localStorage.setItem('screeningmethod', "");
    localStorage.setItem('securitystatus', "");
    localStorage.setItem('securitytype', "");
    localStorage.setItem('exemptc', "");
    localStorage.setItem('Pieces', "");
    localStorage.setItem('ScreenedPieces', "");
    localStorage.setItem('unScreenedPieces', "");
    localStorage.setItem('isSaved', "false");
  }

  ngOnInit() {
    this.strUserName = JSON.parse(this.global.get('userResp')).UserName[0];

  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ExportAcceptancePage');

    if (localStorage.getItem('isSaved') == "true")
      if (this.awbno != undefined)
        if (this.awbno != "")
          this.scanAWBNO();
  }


  switchAWB($event) {
    console.log($event.value);
    this.awbno = $event.value;
    console.log(this.awbno);
  }

  checkValueSS($event) {
    console.log("securitystatus chnages");
    console.log(this.securityStatus);
  }

  scanAWBNO() {
    if (this.awbno == undefined)
      return;

    this.getAwbDetails();
  }

  // getAwbDetails() {
  //   this.pieces = "1";
  //   this.grwt = "1";
  //   this.origin = "wqq";
  //   this.destination = "wqw";

  //   this.screenedp = "ee";
  //   this.uscreenedp = "ee";
  // }

  //Scanning method , security status , security type , exempt cargo
  //  scanningMethod: any = [];
  //  securityStatus: any = [];
  //  securityType: any = [];
  //  exemptCargo: any = [];

  getScanningMethod() {
    this.http.httpGETRequestAMAX("GetScreeningMasters/1").then((response) => {
      this.scanningMethod = response; console.log(response);
    }, (error) => {
      this.global.showAlert(error);
    });
  }

  getsecurityStatus() {
    this.http.httpGETRequestAMAX("GetScreeningMasters/2").then((response) => {
      this.securityStatus = response; console.log(response);
    }, (error) => {
      this.global.showAlert(error);
    });
  }

  getsecurityType() {
    this.http.httpGETRequestAMAX("GetScreeningMasters/3").then((response) => {
      this.securityType = response; console.log(response);
    }, (error) => {
      this.global.showAlert(error);
    });
  }

  getexemptCargo() {
    this.http.httpGETRequestAMAX("GetScreeningMasters/4").then((response) => {
      this.exemptCargo = response;
      console.log(response);
    }, (error) => {
      this.global.showAlert(error);
    });
  }

  setScreeningMethod(selectedVal) {
    console.log("setScreeningMethod");
    console.log(selectedVal);


  }

  getAwbDetails() {
    //console.log("this.strUserName = " + this.strUserName );
    if (this.awbno == undefined) {
      alert("Kindly enter or scan AWB No.");
      return;
    }

    if (this.awbno.toString().trim() == "") {
      alert("Kindly enter or scan AWB No.");
      return;
    }

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.awbno.toString())) {
      this.awbno = "";
      this.global.showAlert("Please enter only standard alpha numerics in AWB No.");
      return;
    }


    // this.pieces = "";
    // this.grwt = "";
    // this.origin = "";
    // this.destination = "";
    // this.pieces = "";
    // this.screenedp = "";
    // this.uscreenedp = "";

    // this.awbno = "";
    // // this.pieces = "";
    this.grwt = "";
    this.origin = "";
    this.destination = "";

    this.pieces = "";
    this.screenedp = "";
    this.uscreenedp = "";

    this.screeningmethod = "";
    this.securitystatus = "";
    this.securitytype = "";
    this.exemptc = "";

    localStorage.setItem('AWBNO', "");
    localStorage.setItem('screeningmethod', "");
    localStorage.setItem('securitystatus', "");
    localStorage.setItem('securitytype', "");
    localStorage.setItem('exemptc', "");
    localStorage.setItem('Pieces', "");
    localStorage.setItem('ScreenedPieces', "");
    localStorage.setItem('unScreenedPieces', "");
    localStorage.setItem('isSaved', "false");


    this.screeningAwbDetailsParams.MAWBNo = this.awbno;
    // localStorage.setItem('VCT_AWB', this.awbno.toString());

    // this.tdgAwbDetailsParams.pi_strGrpId = "";


    var requestURL = "GetScreeningDetails?MAWBNo=" + this.screeningAwbDetailsParams.MAWBNo.toString();
    requestURL = requestURL + "&LoginID=" + this.strUserName.toString();
    // console.log(requestURL);LoginID=KSonawane
    this.http.httpGETRequestAMAX(requestURL).then((response) => {

      this.awbData = response;

      //if (this.awbData.length > 0) {

      console.log(this.awbData);

      if (this.awbData['AWBNumber'] == null && this.awbData['Status'] == null)
        return;

      if (this.awbData['Status'].toString().toLowerCase() == "e") {
        this.global.showAlert(this.awbData['ErrorMessage'].toString());
        this.awbno = "";
        localStorage.setItem('AWBNO', "");
      }
      else {
        localStorage.setItem('AWBNO', this.awbno.toString());
        //  if (this.awbData.length > 0) {
        console.log(this.awbData['AWBNumber']);
        console.log(this.awbData['Pieces']);
        console.log(this.awbData['GrossWt']);
        console.log(this.awbData['Origin']);
        console.log(this.awbData['Destination']);
        console.log(this.awbData['SecurityStatus']);
        console.log(this.awbData['Destination']);

        this.pieces = this.awbData['Pieces'];
        this.grwt = this.awbData['GrossWt'];
        this.origin = this.awbData['Origin'];
        this.destination = this.awbData['Destination'];
        this.screenedp = this.awbData['ScreenedPieces'];
        this.uscreenedp = this.awbData['unScreenedPieces'];

        if (this.awbData['SecurityStatus'] != null)
          this.securitystatus = this.awbData['SecurityStatus'];
        if (this.awbData['Security'] != null)
          this.securitytype = this.awbData['Security'];

        localStorage.setItem('Pieces', this.pieces.toString());
        localStorage.setItem('ScreenedPieces', this.screenedp.toString());
        localStorage.setItem('unScreenedPieces', this.uscreenedp.toString());

      }

    }, (error) => {
      this.global.showAlert("Error occured while performing this operation.");
    });
  }


  clearAllValues() {
    this.awbno = "";
    // this.pieces = "";
    this.grwt = "";
    this.origin = "";
    this.destination = "";

    this.pieces = "";
    this.screenedp = "";
    this.uscreenedp = "";

    this.screeningmethod = "";
    this.securitystatus = "";
    this.securitytype = "";
    this.exemptc = "";

    localStorage.setItem('AWBNO', "");
    localStorage.setItem('screeningmethod', "");
    localStorage.setItem('securitystatus', "");
    localStorage.setItem('securitytype', "");
    localStorage.setItem('exemptc', "");
    localStorage.setItem('Pieces', "");
    localStorage.setItem('ScreenedPieces', "");
    localStorage.setItem('unScreenedPieces', "");
    localStorage.setItem('isSaved', "false");
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

    if (this.screeningmethod.toString().trim() == "") {
      alert("Kindly select Screening Method");
      return;
    }

    if (this.securitystatus.toString().trim() == "") {
      alert("Kindly select Security Status");
      return;
    }

    if (this.securitytype.toString().trim() == "") {
      alert("Kindly select Security Type");
      return;
    }
    else {
      if (this.securitytype.toString().trim().toLowerCase() == "exempt cargo") {
        if (this.exemptc.toString().trim() == "") {
          alert("Kindly select Exempt Cargo");
          return;
        }
      }
    }

    console.log(this.screeningmethod);
    console.log(this.securitystatus);
    console.log(this.securitytype);
    console.log(this.exemptc);

    localStorage.setItem('screeningmethod', this.screeningmethod.toString());
    localStorage.setItem('securitystatus', this.securitystatus.toString());
    localStorage.setItem('securitytype', this.securitytype.toString());
    localStorage.setItem('exemptc', this.exemptc.toString());

    this.global.routePage(ExportScangroupidSPage);
  }

  exitForm() {
    this.navCtrl.pop();
  }


  isFinalSubmitDisabled(): boolean {
    if (Number(this.pieces) == 0)
      return true;
    else {
      if (this.screenedp == this.pieces)
        return false;
      else
        return true;
    }

  }

  isExemptCargoDisabled(): boolean {

    // if (this.securitytype.toString().trim() == "") 
    // return false;
    // else{
    if (this.securitytype.toString().trim().toLowerCase() == "exempt cargo")
      return false;
    else
      return true;
    // }
  }

  saveDataFinal() {

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.awbno.toString())) {
      this.awbno = "";
      this.global.showAlert("Please enter only standard alpha numerics in AWB No.");
      return;
    }

    var requestURL = "GetScreeningDetails?MAWBNo=" + this.awbno.toString();
    this.http.httpGETRequestAMAX(requestURL).then((response) => {
      this.awbData = response;

      this.tableDataSaveFinal = [];
      this.tableDataSaveFinal.push(
        {
          RowID_I: this.awbData['RowID_I'],// 0,
          AWBNumber: this.awbData['AWBNumber'],// 77781181111,
          Pieces: this.awbData['Pieces'],// 2,
          // ScreenedPieces: this.awbData['ScreenedPieces'],// 2,
          // unScreenedPieces: this.awbData['unScreenedPieces'],// 1,
          GrossWt: this.awbData['GrossWt'],// 2.5,
          ChWt: this.awbData['ChWt'],// 2.5,
          Origin: this.awbData['Origin'],// BOM,
          SecurityId: this.awbData['SecurityId'],// 0,
          SecurityStatusID: this.awbData['SecurityStatusID'],// null,
          Destination: this.awbData['Destination'],// BKK,
          Commodity: this.awbData['Commodity'],// testing cargo,
          CommodityGroup: this.awbData['CommodityGroup'],// ,
          Remarks: this.awbData['Remarks'],// ,
          CreatedBy: this.strUserName,//this.awbData['CreatedBy'],// ConsolMIALUAT,
          CreatedOn: this.awbData['CreatedOn'],// 2023-04-13T13: ,//35: ,//19.71,
          UpdatedBy:this.strUserName,// this.awbData['UpdatedBy'],// null,
          UpdatedOn: this.awbData['UpdatedOn'],// null,
          ExemptCargo: this.awbData['ExemptCargo'],// null,
          FlightNo: this.awbData['FlightNo'],// ZZ2423 ,
          FlightDate: this.awbData['FlightDate'],// 13/04/2023,
          MachineNo: this.awbData['MachineNo'],// ,
          Status: this.awbData['Status'],// S,
          ErrorMessage: this.awbData['ErrorMessage'],// Record Found,
          lstScreningMethod: null,
          Security: this.securitytype.toString(),//// this.awbData['Security'],// null,
          SecurityStatus: this.securitystatus.toString(),//this.awbData['SecurityStatus'],// null,
          Remark: this.awbData['Remark'],// null,
          StickerStart: this.awbData['StickerStart'],// null,
          StickerEnd: this.awbData['StickerEnd'],// null,
          StickerNoP: this.awbData['StickerNoP'],// null,
          lstScreeningGroupID: null
        });
      console.log("this.tableDataSaveFinal.length =" + this.tableDataSaveFinal.length.toString());
      console.log(this.tableDataSaveFinal);

      var myJSON = JSON.stringify(this.tableDataSaveFinal);
      myJSON = myJSON.substring(1, myJSON.length - 1);
      console.log(myJSON);

      this.http.httpPostRequestAMAX("SubmitScreeningDetails", myJSON).then((response) => {
        this.savedDataResponse = response;
        console.log(this.savedDataResponse);
        if (this.savedDataResponse['Status'].toString().toLowerCase() == "e") {
          this.global.showAlert(this.savedDataResponse['ErrorMessage'].toString());
        }
        else {
          this.global.showAlert(this.savedDataResponse['ErrorMessage'].toString());
          this.clearAllValues();
        }
      });

    }, (error) => {
      this.global.showAlert("Error occured while performing this operation.");
    });
  }


}
