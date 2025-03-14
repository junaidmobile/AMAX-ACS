import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { HttpProvider } from '../../providers/http/http';

/**
 * Generated class for the ExportScangroupidCcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export class AwbDetails {
  pi_strAWBNo: String;
  pi_strGrpId: String;
}

export class SaveCartingAWB {
  pi_strCartingDetailsXML: any;
  pi_strUserName: any;
}

@IonicPage()
@Component({
  selector: 'page-export-scangroupid-cc',
  templateUrl: 'export-scangroupid-cc.html',
})
export class ExportScangroupidCcPage {
  strUserName: any;
  groupID: String;
  awbno: String = '';
  groupID1: String = '';
  tableData: Array<{ grpid: string, pieces: string }>;
  hasRows: boolean = false;
  totalPieces: number = 0;
  tdgAwbDetailsParams: AwbDetails;
  SaveCartingAWBParams: SaveCartingAWB;
  tableData1: any;
  isSubmitEnabled = false;
 // @ViewChild('GRPIDValue') grpIDInput;


  constructor(public navCtrl: NavController, public http: HttpProvider, public global: GlobalProvider, public navParams: NavParams) {
    this.tableData = [];
    //   this.awbno = "";
    this.tdgAwbDetailsParams = new AwbDetails();
    this.SaveCartingAWBParams = new SaveCartingAWB();
  }

  ngOnInit() {
    this.strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExportScangroupidCcPage');
    this.isSubmitEnabled = false;
    this.awbno = localStorage.getItem("VCT_AWB");
    //this.tableData.push({ grpid:"112233", pieces: '1' });
  }

  switch($event) {
    console.log($event.value);
    this.groupID = $event.value;
  }

  remove(no: number) {
    (this.tableData).splice(no, 1);
    this.refreshValues();
  };

  refreshValues() {
    this.totalPieces = 0;
    for (let i = 0; i < this.tableData.length; i++) {
      this.totalPieces = Number(this.totalPieces) + Number(this.tableData[i].pieces);
    }

    if (this.tableData.length == 0)
      this.hasRows = false;
  }



  
  scanGroupID()
  {
    if (this.groupID == undefined)
    return;

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.groupID.toString())) {
      this.groupID = "";
      this.global.showAlert("Please enter only standard alpha numerics in Group ID");
      return;
    } else {
      this.groupID = this.groupID.toString().toUpperCase();
      this.getGroupIDDetails();
    }

    //this.getGroupIDDetails();
  }

  getGroupIDDetails() {
    // this.tableData.push({ grpid: this.groupID.toString(), pieces: '1' });
    // this.groupID = "";
    // this.groupID1 = "";
    // console.log(this.tableData);
    // this.hasRows = true;
    // this.totalPieces = 0;
    // for (let i = 0; i < this.tableData.length; i++) {
    //   this.totalPieces = Number(this.totalPieces) + Number(this.tableData[i].pieces);
    // }



    if (this.groupID == undefined) {
      alert("Kindly enter or scan AWB No.");
      return;
    }

    if (this.groupID.toString().trim() == "") {
      alert("Kindly enter or scan AWB No.");
      return;
    }

    console.log("this.groupID ==" + this.groupID);

    //array.some(code => code.name === 'js');

    var chkValueExist = this.tableData.some(code => code.grpid === this.groupID.toString());
    console.log("chkValueExist ==" + chkValueExist);
    if (chkValueExist == true)
    {
      alert(this.groupID + " already exist in the list");
    //  this.grpIDInput.setFocus();
      return;
    }
   // return;

    this.tdgAwbDetailsParams.pi_strAWBNo = this.awbno;
    this.tdgAwbDetailsParams.pi_strGrpId = this.groupID;

    this.http.getHttpPostRequest("Exp_GetCartingChallanDetails_HHT", this.tdgAwbDetailsParams).then((response) => {
      if (response.hasOwnProperty('NewDataSet')) {
        console.log(response['NewDataSet']['Table'][0]);
        this.tableData1 = response['NewDataSet']['Table'][0];
        this.tableData.push({ grpid: this.tableData1.GrpId[0], pieces: this.tableData1.Pieces[0] });
        this.hasRows = true;
        this.groupID = "";
        this.totalPieces = 0;
        for (let i = 0; i < this.tableData.length; i++) {
          this.totalPieces = Number(this.totalPieces) + Number(this.tableData[i].pieces);
        }
      //  this.grpIDInput.setFocus();

      } else {
        this.global.showAlert(response['Root']['Output']);
        this.groupID = "";
        //this.grpIDInput.setFocus();
        // this.clearAll();
      }

    }, (error) => {
      this.global.showAlert(error);
    });
  }


  clearAll() {
    this.groupID = "";
    this.groupID1 = "";
    this.tableData = [];
    this.hasRows = false;
  }

  exitForm() {
    this.navCtrl.pop();
  }

  submitForm() {
    if (this.tableData.length == 0) {
      alert("Kindly enter or scan atleast one Group ID");
      return;
    }

    var saveAWBData = "";

    const now = Date.now();
    var datePipe = new DatePipe('en-US');
    var saveDate = datePipe.transform(now, 'M/d/y h:mm:ss a');
    console.log(saveDate); //12/19/2022 6:48:39 PM

    saveAWBData = '<CCDetails AWBId="' + localStorage.getItem("VCT_AWBID") +
      '" AWBNo="' + localStorage.getItem("VCT_AWB") +
      '" AWBPkgs="' + localStorage.getItem("VCT_PCS") +
      '" AWBGrWt="' + localStorage.getItem("VCT_GRWT") +
      '" FlightNo="' + localStorage.getItem("VCT_FLNO") +
      '" FlightDate ="' + localStorage.getItem("VCT_FLDT") +
      '" Dest="' + localStorage.getItem("VCT_DEST") +
      '" HandOverDt="'  + localStorage.getItem("VCT_HANDDT") +
      '" CartingDt="' + saveDate + //localStorage.getItem("VCT_CARTDT") +
      '" Remarks="' + localStorage.getItem("VCT_Remark") + '"  />';

    saveAWBData = "<Root>" + saveAWBData + "</Root>";

    console.log(this.tableData.length.toString());
    console.log(localStorage.getItem("VCT_PCS").toString());

    console.log(saveAWBData);



    // return;

    this.SaveCartingAWBParams.pi_strCartingDetailsXML = saveAWBData;
    this.SaveCartingAWBParams.pi_strUserName = JSON.parse(this.global.get('userResp')).UserName[0];

    this.http.getHttpPostRequest("Exp_SaveCartingChallanDetails_HHT", this.SaveCartingAWBParams).then((response) => {

      if (response != null && response != "") {
        console.log(response);
        if (response.hasOwnProperty('NewDataSet')) {

          console.log(response['NewDataSet']['Table']);

          this.tableData1 = response['NewDataSet']['Table'];

          try {
            if (this.tableData1.OutputMessage) {
              if (this.tableData1.OutputMessage != "") {

                this.global.showAlert(this.tableData1.OutputMessage);

                // if (this.tableData1.OutputMessage.toString().toLowerCase().includes("ec")) {
                //   this.clearAll();
                //   this.exitForm();
                // }


              }

            }
            else if (this.tableData1.OutputMessage[0]) {
              if (this.tableData1.OutputMessage[0] != "") {
                this.global.showAlert(this.tableData1.OutputMessage[0]);

                // if (this.tableData1.OutputMessage[0].toString().toLowerCase().includes("ec")) {
                //   this.clearAll();
                //   this.exitForm();
                // }
              }

            }
          } catch (err) {
            console.log(err.toString());
          }
        }
        else {
          this.global.showAlert(response['Root']['Output']);
          // var msgvar = (response['Root']['Output'].toString().substring(0,2));
          // if (msgvar == "EC") {
          //   this.clearAll();
          //   this.exitForm();
          // }

          if (response['Root']['Output'].toString().toLowerCase().includes("successfully")) {
            this.clearAll();
            this.exitForm();
          }
        }
      }
    }, (error) => {
      this.global.showAlert(error);
    });

  }

  cancelCarting() {
    if (this.tableData.length == 0) {
      alert("Kindly enter or scan atleast one Group ID");
      return;
    }


  }

  isSubmitDisabled(): boolean {
    if (this.totalPieces < Number(localStorage.getItem("VCT_PCS")))
      return true;
    else
      return false;
  }


}
