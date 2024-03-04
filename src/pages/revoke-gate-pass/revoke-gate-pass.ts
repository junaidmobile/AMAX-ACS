import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersService } from '../../providers/users.service';
import { HttpProvider } from '../../providers/http/http';
import { GlobalProvider } from '../../providers/global/global';
export class GPerachClass { pi_strUser: any }
export class myClass { pi_strGPNos: any; pi_strUser: any }
import moment from 'moment';
import { Console } from '@angular/core/src/console';
/**
 * Generated class for the RevokeGatePassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-revoke-gate-pass',
  templateUrl: 'revoke-gate-pass.html',
})
export class RevokeGatePassPage {
  @ViewChild('OTPValue') OTPInput;
  gatepasses: any = [];
  title: String;
  myData: any = [];
  indeterminateState: boolean;
  checkParent: boolean;
  indices: any = [];
  selectedArray: any = [];
  _strUserName: any;
  _allPrams: GPerachClass;
  _myPrams: myClass;
  gatepassChecked: boolean = false;
  VTNo: any = '';
  VTOTP: any = '';
  filename: any = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpProvider, public userService: UsersService, public global: GlobalProvider) {
    this._allPrams = new GPerachClass();
    this._myPrams = new myClass();

    this.title = "Revoke Gate pass";
    //this.loadGatePassList();
    // this.loadUsers("maddy");
    //this.VTNo = 'IVT' + this.getCurrentTime();
  }

  focusNextInput() {
    console.log("this.VTNo.length");
    console.log(this.VTNo.length);
    if (this.VTNo.length >= 7) {
      this.OTPInput.setFocus();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RevokeGatePassPage');
  }

  ngOnInit() {
    // console.log("ngOinit revoke gatepass ----------------------------------------");
    // console.log(this.global.get('userResp'));
    // console.log(JSON.parse(this.global.get('userResp')).UserName[0]);
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    console.log(this._strUserName);

    //this.VTNo = 'IVT' + this.getCurrentTime();
  }

  getCurrentTime() {
    return moment().format('YYMMDD');
  }
  onChangeSelect(gatepassIndex) {

    this.gatepasses[gatepassIndex].isItemChecked = !this.gatepasses[gatepassIndex].isItemChecked;

    if (this.gatepasses[gatepassIndex].isItemChecked) {
      this.indices.push(gatepassIndex);
      this.selectedArray.push(this.gatepasses[gatepassIndex]['GPNo']);
    }
    else
      this.selectedArray.pop(this.gatepasses[gatepassIndex]['GPNo']);

    this._myPrams.pi_strGPNos = this.selectedArray.join(',');
    this._myPrams.pi_strUser = this._strUserName;
    // console.log(JSON.stringify(this.selectedArray.join(',')));
    // console.log(this.gatepasses);
  }

  onChangeAllSelect() {
    this.gatepassChecked = !this.gatepassChecked;
    if (this.gatepassChecked) {
      for (let i = 0; i < this.gatepasses.length; i++) {
        this.indices.push(i);
        this.selectedArray.push(this.gatepasses[i]['GPNo']);
      }
      this._myPrams.pi_strGPNos = this.selectedArray.join(',');
      this._myPrams.pi_strUser = this._strUserName;
    }
    else {
      this.selectedArray = [];
      this.indices = [];
    }
    console.log(JSON.stringify(this.selectedArray.join(',')));
    console.log(this.gatepasses);
    console.log(this.selectedArray);
    console.log(this.indices);
  }

  loadGatePassList() {
    this.gatepasses = [];
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];

    // console.log(this._strUserName);
    //this._myPrams.pi_strUser = this._strUserName;
    this._myPrams.pi_strUser = this._strUserName;
    this._myPrams.pi_strGPNos = this.VTNo + this.VTOTP;//this.VTNo;

    let json = { "pi_strUser": this._myPrams.pi_strUser, "pi_strGPNo": this._myPrams.pi_strGPNos };

    this.http.getHttpPostRequest("GetImpExpiredGPDetails", json).then((response) => {
      if (response != null && response != "") {
        this.myData = response['NewDataSet']['Table'];
        if (this.myData != null) {
          console.log(this.myData.length);
          console.log(new Date(this.myData[0].GPDate).toLocaleTimeString());

          for (let i = 0; i < this.myData.length; i++) {
            // for (let i = 0; i < 10; i++) {
            let d = (new Date(this.myData[i].GPDate).toDateString()).substring(4);
            let e = (new Date(this.myData[i].GPDate).toLocaleTimeString()).substring(0, 4);
            let s = d.substring(4, 6).concat("th ").concat(d.substring(0, 3)).concat(" ");
            let e1 = s.concat(d.substring(7, 11)).concat(" ").concat(e).concat(" hrs");
            this.gatepasses.push({
              "MAWBNo": this.myData[i].MAWBNo,
              "HAWBNo": this.myData[i].HAWBNo,
              "GPNo": this.myData[i].GPNo,
              "GPDate": e1,
              //  .
              //2020-09-21T00:23:21.937+05:30
              isItemChecked: false
            });
          }
        }
      }

      // console.log(this.gatepasses);
    });
  }

  revokeGatePass() {
    console.log(this.selectedArray.length);
    if (this.selectedArray.length > 0) {
      this.http.getHttpPostRequest("ImpRevokeExpiredGP", this._myPrams).then((response) => {

        for (let index = this.indices.length - 1; index >= 0; index--) {
          console.log(this.indices[index]);
          this.gatepasses.splice(this.indices[index], 1);
          console.log(this.gatepasses);
        }
        this.global.showAlert(response['Root']['Output']);

      });
    }
    else
      this.global.showAlert("Please select gatepass");
  }

  searchGP() {
    console.log("searchGP");
    console.log(this.filename);
    //var uDate = "15-20-2022";

    //var FileName = "MAWB_125-98098000_15022022";
    var FileName = this.filename;
    console.log("FileName == " + FileName);

    var Datesubstring = FileName.substring(18, 26);
    console.log("substring == " + Datesubstring);

    if (Datesubstring.length != 8) {
      console.log(" INVALID DATE");
      return;
    }

    // console.log("substring 1 == " + Datesubstring.substring(0, 2));
    // console.log("substring 2== " + Datesubstring.substring(2, 4));
    // console.log("substring 3 == " + Datesubstring.substring(4, 8));

    var DatesubstringNEW = Datesubstring.substring(0, 2) + "-" +Datesubstring.substring(2, 4) + "-" + Datesubstring.substring(4, 8);

    let parsedDate = moment(DatesubstringNEW, "DD-MM-YYYY");
    console.log("parsedDate == " + parsedDate);
    //    console.log("parsedDate == " + parsedDate.valueOf());

    if (isNaN(parsedDate.valueOf()))
    {
      console.log("DATE NAN ");
    }

    else
    {
      console.log("DATE VALID ");
      let outputDate = parsedDate.format("DD-MMM-YYYY")
      console.log("outputDate == " + outputDate);
    }
   


  

    //     if (outputDate == "Invalid date")
    // {
    //   console.log("DATE INVALID ");
    // }
    // else
    // console.log("DATE VALID ");
    //   if (isNaN(parsedDate))
    //   {
    //     console.log("user input date is NULL  ");
    //   }
    //   else


    //  console.log("user input date=  " +  moment(uDate, "DD-MM-YYYY"));

    // let outputDate = parsedDate.format("DD-MMM-YYYY");
    // console.log("user input date DD-MMM-YYYY=  " + outputDate);

    // var currentTime = new Date();
    // let parsedDateCurr = moment(currentTime, "DD-MM-YYYY");

    // console.log("Curr date= " + parsedDateCurr.format("DD-MMM-YYYY"));

    // if (parsedDate >parsedDateCurr )
    // console.log("user input date is greater than curr date");
    // else
    // console.log("user input date is less than curr date");

    //console.log(currentTime.getFullYear());
  }

}


// {
//   "d": "<NewDataSet>\r\n  <Table>\r\n    <TokenNo>IVT2202180001</TokenNo>\r\n  
//     <TokenDate>2022-02-18T11:09:08</TokenDate>\r\n    <VehicleNo>MH15FY6462</VehicleNo>\r\n  
//       <Shed>CLF AREA</Shed>\r\n    <IsGateIn>0</IsGateIn>\r\n    <GateInDate />\r\n    <IsDockIn>0</IsDockIn>\r\n  
//         <DockInDate />\r\n    <IsDockOut>0</IsDockOut>\r\n    <DockOutDate />\r\n    <IsGateOut>0</IsGateOut>\r\n  
//           <GateOutDate />\r\n    <OutputMessage />\r\n  </Table>\r\n</NewDataSet>"
// }
// https://GalaxyMIALUAT.KaleLogistics.Com/CSCGENHHTWS/HHTService.asmx/ImpTokenScanning_HHT

// {"pi_strVTNo": "IVT2202180001", "pi_strUser": "kale"}