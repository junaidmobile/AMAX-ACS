import { Component } from '@angular/core';
import { Console } from '@angular/core/src/console';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { HttpProvider } from '../../providers/http/http';
import { ExportAwbacceptancePage } from '../export-awbacceptance/export-awbacceptance';
import { ExportUnscannedawbPage } from '../export-unscannedawb/export-unscannedawb';


export class TDGAcceptance {
  pi_strVCTNo: any;
}

export class TdgDockInDockOut {
  pi_strVCTNo: any;
  pi_strUserId: any;
  pi_strMode: any; //"I" for dockin process and "O" for dock out 
  pi_strDoor: any;
}



export class CloseRevokeVCT {
  pi_strVCTNo: any;
  pi_strUserId: any;
}

@IonicPage()
@Component({
  selector: 'page-export-acceptance',
  templateUrl: 'export-acceptance.html',
})
export class ExportAcceptancePage {

  VCT: String;
  trkDockNo: String;
  totPieces: String;
  totGRWT: String;
  totAccPieces: String;
  remPieces: String;
  awbCount: String;
  strUserName: any;

  VCTacc: string = '';

  tdgAcceptanceParams: TDGAcceptance;
  tdgDockInDockOutParams: TdgDockInDockOut;
  tdgCloseRevokeVCTParams: CloseRevokeVCT;

  dockInPerformed: boolean = false;
  dockOutPerformed: boolean = false;
  vctClosed: boolean = false;

  tableData: any;


  totAccPiecesMsg: String;
  remPiecesMsg: String;
  totAccWTMsg: String;
  totremWTMsg: String;

  constructor(public navCtrl: NavController, public http: HttpProvider, public alertCtrl: AlertController, public global: GlobalProvider, public navParams: NavParams) {

    this.trkDockNo = "";
    this.totPieces = "";
    this.totGRWT = "";

    this.totAccPieces = "";
    this.remPieces = "";
    this.awbCount = "";

    this.totAccPiecesMsg = "";
    this.remPiecesMsg = "";
    this.totAccWTMsg = "";
    this.totremWTMsg = "";

    this.tdgAcceptanceParams = new TDGAcceptance();
    this.tdgDockInDockOutParams = new TdgDockInDockOut();
    this.tdgCloseRevokeVCTParams = new CloseRevokeVCT();
  }


  ngOnInit() {
    console.log('ngOnInit ExportAcceptancePage');
    this.strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    localStorage.setItem('VCT_ACC', "");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExportAcceptancePage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ExportAcceptancePage');

    if (this.VCT != undefined)
      if (this.VCT != "")
        this.refreshVctDetails();
  }

  async gotoAwbAcceptance() {

    if (this.VCT == undefined) {
      alert("Kindly enter or scan VCT No.");
      return;
    }

    if (this.VCT.toString().trim() == "") {
      alert("Kindly enter or scan VCT No.");
      return;
    }


    // var abc = 
    this.global.routePage(ExportAwbacceptancePage);
    // console.log(abc);
  }

  gotoUnscanned() {

    if (this.VCT == undefined) {
      alert("Kindly enter or scan VCT No.");
      return;
    }

    if (this.VCT.toString().trim() == "") {
      alert("Kindly enter or scan VCT No.");
      return;
    }

    this.global.routePage(ExportUnscannedawbPage);
  }

  switch($event) {
    console.log($event.value);
    this.VCT = $event.value.toString().toUpperCase();
    this.VCTacc = $event.value.toString().toUpperCase();
    console.log(this.VCT);

  }

  clearAllValues() {
    this.VCT = "";
    this.trkDockNo = "";
    this.totPieces = "";
    this.totGRWT = "";

    this.totAccPieces = "";
    this.remPieces = "";
    this.awbCount = "";
    this.VCTacc = "";

    this.totAccPiecesMsg = "";
    this.remPiecesMsg = "";
    this.totAccWTMsg = "";
    this.totremWTMsg = "";

    this.dockInPerformed = false;
    this.dockOutPerformed = false;
    this.vctClosed = false;

    localStorage.setItem('VCT_ACC', "");
  }

  scanVCTNO() {
    if (this.VCT == undefined)
      return;

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.VCT.toString())) {
      this.VCT = "";

      this.VCTacc = "";
      this.global.showAlert("Please enter only standard alpha numerics in VCT No.");
      // return false;
    } else {
      this.VCT = this.VCT.toString().toUpperCase();
      this.VCTacc = this.VCTacc.toString().toUpperCase();
      this.getVctDetails();
    }


  }


  scanTruckDoorNO() {
    if (this.trkDockNo == undefined)
      return;

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.VCT.toString())) {
      this.trkDockNo = "";

      //  this.trkDockNo = "";
      this.global.showAlert("Please enter only standard alpha numerics in Truck Dock No.");
      // return false;
    } else {
      this.trkDockNo = this.VCT.toString().toUpperCase();
      this.trkDockNo = this.VCTacc.toString().toUpperCase();
      //   this.getVctDetails();
    }


  }

  getVctDetails() {

    if (this.VCT == undefined) {
      alert("Kindly enter or scan VCT No.");
      return;
    }

    if (this.VCT.toString().trim() == "") {
      alert("Kindly enter or scan VCT No.");
      return;
    }

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.VCT.toString())) {

      this.VCT = "";

      this.VCTacc = "";
      this.global.showAlert("Please enter only standard alpha numerics in VCT No.");
      return;
    }

    console.log('******************  getVctDetails called here after validation');

    this.trkDockNo = "";
    this.totPieces = "";
    this.totGRWT = "";

    this.totAccPieces = "";
    this.remPieces = "";
    this.awbCount = "";

    this.totAccPiecesMsg = "";
    this.remPiecesMsg = "";
    this.totAccWTMsg = "";
    this.totremWTMsg = "";

    this.dockInPerformed = false;
    this.dockOutPerformed = false;
    this.vctClosed = false;

    localStorage.setItem('VCT_ACC', "");


    this.tdgAcceptanceParams.pi_strVCTNo = this.VCT;
    localStorage.setItem('VCT_ACC', this.VCT.toString());



    this.http.getHttpPostRequest("GetVCTDetailsForTDGAcceptance", this.tdgAcceptanceParams).then((response) => {
      if (response.hasOwnProperty('NewDataSet')) {
        console.log(response['NewDataSet']['Table'][0]);
        this.tableData = response['NewDataSet']['Table'][0];

        console.log(this.tableData.TotalVCTPieces[0]);
        console.log(this.tableData.TotalVCTGrWt[0]);
        console.log(this.tableData.TotalAcceptedPieces[0]);
        console.log(this.tableData.TotalRemaingingPieces[0]);
        console.log(this.tableData.AWBCount[0]);
        console.log(this.tableData.DockInStatus[0]);
        console.log(this.tableData.DockOutStatus[0]);
        console.log(this.tableData.DockInDoor[0]);

        this.totPieces = this.tableData.TotalVCTPieces[0];
        this.totGRWT = this.tableData.TotalVCTGrWt[0];
        this.totAccPieces = this.tableData.TotalAcceptedPieces[0];
        this.remPieces = this.tableData.TotalRemaingingPieces[0];
        this.awbCount = this.tableData.AWBCount[0];

        this.totAccPiecesMsg = this.tableData.TotalAcceptedPieces[0];
        this.remPiecesMsg = this.tableData.TotalRemaingingPieces[0];
        this.totAccWTMsg = this.tableData.TotalVCTGrWt[0];
        this.totremWTMsg = this.tableData.TotalRemaingingWt[0];

        this.trkDockNo = this.tableData.DockInDoor[0];

        localStorage.setItem('VCT_PCS', this.totPieces.toString());


        if (this.tableData.DockInStatus[0].toString().toLowerCase() == 'true')
          this.dockInPerformed = true;
        else
          this.dockInPerformed = false;

        if (this.tableData.DockOutStatus[0].toString().toLowerCase() == 'true')
          this.dockOutPerformed = true;
        else
          this.dockOutPerformed = false;


        if (this.tableData.IsVCTClosed[0].toString().toLowerCase() == 'true')
          this.vctClosed = true;
        else
          this.vctClosed = false;






        // this.dockInPerformed = this.tableData.DockInStatus[0];
        // this.dockOutPerformed = this.tableData.DockOutStatus[0];


        // if (this.dockOutPerformed)
        //   console.log(" return dock out done;");
        // else
        //   console.log(" return dock out is NOT done;");

      } else {
        this.global.showAlert(response['Root']['Output']);
        this.clearAllValues();
      }


    }, (error) => {
      this.global.showAlert(error);
    });
  }


  refreshVctDetails() {


    this.tdgAcceptanceParams.pi_strVCTNo = this.VCT;
    localStorage.setItem('VCT_ACC', this.VCT.toString());



    this.http.getHttpPostRequest("GetVCTDetailsForTDGAcceptance", this.tdgAcceptanceParams).then((response) => {
      if (response.hasOwnProperty('NewDataSet')) {
        console.log(response['NewDataSet']['Table'][0]);
        this.tableData = response['NewDataSet']['Table'][0];

        console.log(this.tableData.TotalVCTPieces[0]);
        console.log(this.tableData.TotalVCTGrWt[0]);
        console.log(this.tableData.TotalAcceptedPieces[0]);
        console.log(this.tableData.TotalRemaingingPieces[0]);
        console.log(this.tableData.AWBCount[0]);
        console.log(this.tableData.DockInStatus[0]);
        console.log(this.tableData.DockOutStatus[0]);
        console.log(this.tableData.DockInDoor[0]);
        //DockInDoor
        // : 
        // ['dock1']

        this.totPieces = this.tableData.TotalVCTPieces[0];
        this.totGRWT = this.tableData.TotalVCTGrWt[0];
        this.totAccPieces = this.tableData.TotalAcceptedPieces[0];
        this.remPieces = this.tableData.TotalRemaingingPieces[0];
        this.awbCount = this.tableData.AWBCount[0];

        this.totAccPiecesMsg = this.tableData.TotalAcceptedPieces[0];
        this.remPiecesMsg = this.tableData.TotalRemaingingPieces[0];
        this.totAccWTMsg = this.tableData.TotalVCTGrWt[0];
        this.totremWTMsg = this.tableData.TotalRemaingingWt[0];

        this.trkDockNo = this.tableData.DockInDoor[0];

        localStorage.setItem('VCT_PCS', this.totPieces.toString());


        if (this.tableData.DockInStatus[0].toString().toLowerCase() == 'true')
          this.dockInPerformed = true;
        else
          this.dockInPerformed = false;

        if (this.tableData.DockOutStatus[0].toString().toLowerCase() == 'true')
          this.dockOutPerformed = true;
        else
          this.dockOutPerformed = false;

        if (this.tableData.IsVCTClosed[0].toString().toLowerCase() == 'true')
          this.vctClosed = true;
        else
          this.vctClosed = false;






        // this.dockInPerformed = this.tableData.DockInStatus[0];
        // this.dockOutPerformed = this.tableData.DockOutStatus[0];


        if (this.dockOutPerformed)
          console.log(" return dock out done;");
        else
          console.log(" return dock out is NOT done;");

      } else {
        this.global.showAlert(response['Root']['Output']);
        this.clearAllValues();
      }


    }, (error) => {
      this.global.showAlert(error);
    });
  }

  performDockInDockOut(mode: String) {
    console.log(mode.toString());

    if (this.VCT == undefined) {
      alert("Kindly enter or scan VCT No.");
      return;
    }

    if (this.VCT.toString().trim() == "") {
      alert("Kindly enter or scan VCT No.");
      return;
    }

    if (mode == "I") {
      if (this.trkDockNo == undefined) {
        alert("Kindly enter Truck Dock No. ");
        return;
      }

      if (this.trkDockNo.toString().trim() == "") {
        alert("Kindly enter Truck Dock No. ");
        return;
      }
    }

    if (this.totPieces.toString().trim() == "") {
      alert("Total Pieces cannot be blank ");
      return;

    }

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.trkDockNo.toString())) {
      this.trkDockNo = "";
      this.global.showAlert("Please enter only standard alpha numerics in Truck Dock No.");
      return;
    }

    console.log('******************  performDockInDockOut called here after validation');

    this.tdgDockInDockOutParams.pi_strVCTNo = this.VCT;
    this.tdgDockInDockOutParams.pi_strUserId = this.strUserName;
    this.tdgDockInDockOutParams.pi_strMode = mode;
    this.tdgDockInDockOutParams.pi_strDoor = this.trkDockNo;

    this.http.getHttpPostRequest("UpdateVCTDokInDockOutStatus", this.tdgDockInDockOutParams).then((response) => {
      // console.log(response['NewDataSet']['Table'][0]);
      if (response != null && response != "") {
        if (response.hasOwnProperty('NewDataSet')) {

          this.tableData = response['NewDataSet']['Table'][0];

          console.log(this.tableData);
          // console.log(this.tableData[0].OutMsg[0]);
          console.log(this.tableData.OutMsg[0]);

          this.global.showAlert(this.tableData.OutMsg[0]);

          if (this.tableData.Status[0] == 'S' && mode == "I")
            this.dockInPerformed = true;

          if (this.tableData.Status[0] == 'S' && mode == "O")
            this.dockOutPerformed = true;
          //this.VehicleTrackResp = response['NewDataSet']['Table'][0];

          // try {
          //   if (this.tableData.OutputMessage) {
          //     if (this.tableData.OutputMessage != "")
          //       this.global.showAlert(this.tableData.OutputMessage);
          //   }
          //   else if (this.tableData.OutputMessage[0]) {
          //     if (this.tableData.OutputMessage != "")
          //       this.global.showAlert(this.tableData.OutputMessage[0]);
          //   }
          //   else if (this.tableData.OutMsg[0]) {
          //     if (this.tableData.OutMsg[0] != "")
          //       this.global.showAlert(this.tableData.OutMsg[0]);
          //   }
          // } catch (err) {
          //   console.log(err.toString());
          // }


        } else {
          this.global.showAlert(response['Root']['Output']);
        }
      }
    }, (error) => {
      this.global.showAlert(error);
    });

  }

  performCloseRevokeVCT(evetName: String) {
    if (this.VCT == undefined) {
      alert("Kindly enter or scan VCT No.");
      return;
    }

    if (this.VCT.toString().trim() == "") {
      alert("Kindly enter or scan VCT No.");
      return;
    }

    // if (this.trkDockNo == undefined) {
    //   alert("Kindly enter Truck Dock No. ");
    //   return;
    // }

    // if (this.trkDockNo.toString().trim() == "") {
    //   alert("Kindly enter Truck Dock No. ");
    //   return;
    // }

    if (this.totPieces.toString().trim() == "") {
      alert("Total Pieces cannot be blank ");
      return;
    }

    if (evetName.toString().includes("Close")) {

      console.log("Number(this.remPiecesMsg) == " + Number(this.remPiecesMsg).toString());

      if (Number(this.remPiecesMsg) == 0) {
        console.log("pieces are 0");
        this.tdgCloseRevokeVCTParams.pi_strVCTNo = this.VCT;
        this.tdgCloseRevokeVCTParams.pi_strUserId = this.strUserName;

        this.http.getHttpPostRequest(evetName.toString(), this.tdgCloseRevokeVCTParams).then((response) => {

          if (response != null && response != "") {
            if (response.hasOwnProperty('NewDataSet')) {
              this.tableData = response['NewDataSet']['Table'][0];
              this.vctClosed = true;
              try {
                if (this.tableData.OutputMessage) {
                  if (this.tableData.OutputMessage != "")
                    this.global.showAlert(this.tableData.OutputMessage);
                }
                else if (this.tableData.OutputMessage[0]) {
                  if (this.tableData.OutputMessage != "")
                    this.global.showAlert(this.tableData.OutputMessage[0]);
                }
                else if (this.tableData.OutMsg[0]) {
                  if (this.tableData.OutMsg[0] != "")
                    this.global.showAlert(this.tableData.OutMsg[0]);
                }

              } catch (err) {
                console.log(err.toString());
              }


            } else {
              this.global.showAlert(response['Root']['Output']);
            }
          }
        }, (error) => {
          this.global.showAlert(error);
        });
      } else {



        if (this.totAccPiecesMsg != this.remPiecesMsg) {
          let alert = this.alertCtrl.create({
            title: 'Acceptance',
            message: 'Few of the Shipments are pending for Acceptance. <br/><br/> Do you still want to exit? ',
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
                  console.log('Yes clicked');
                  this.tdgCloseRevokeVCTParams.pi_strVCTNo = this.VCT;
                  this.tdgCloseRevokeVCTParams.pi_strUserId = this.strUserName;

                  this.http.getHttpPostRequest(evetName.toString(), this.tdgCloseRevokeVCTParams).then((response) => {
                    console.log(response);
                    if (response != null && response != "") {
                      if (response.hasOwnProperty('NewDataSet')) {

                        this.tableData = response['NewDataSet']['Table'][0];
                        this.vctClosed = true;

                        try {
                          if (this.tableData.OutputMessage) {
                            if (this.tableData.OutputMessage != "")
                              this.global.showAlert(this.tableData.OutputMessage);
                          }
                          else if (this.tableData.OutputMessage[0]) {
                            if (this.tableData.OutputMessage != "")
                              this.global.showAlert(this.tableData.OutputMessage[0]);
                          }
                          else if (this.tableData.OutMsg[0]) {
                            if (this.tableData.OutMsg[0] != "")
                              this.global.showAlert(this.tableData.OutMsg[0]);
                          }

                        } catch (err) {
                          console.log(err.toString());
                        }


                      } else {
                        this.global.showAlert(response['Root']['Output']);
                      }
                    }
                  }, (error) => {
                    this.global.showAlert(error);
                  });
                }
              }
            ]
          });
          alert.present();
        }
      }
    }
    else {

      this.tdgCloseRevokeVCTParams.pi_strVCTNo = this.VCT;
      this.tdgCloseRevokeVCTParams.pi_strUserId = this.strUserName;

      this.http.getHttpPostRequest(evetName.toString(), this.tdgCloseRevokeVCTParams).then((response) => {

        if (response != null && response != "") {
          if (response.hasOwnProperty('NewDataSet')) {
            this.tableData = response['NewDataSet']['Table'][0];
            this.vctClosed = false;

            try {
              if (this.tableData.OutputMessage) {
                if (this.tableData.OutputMessage != "")
                  this.global.showAlert(this.tableData.OutputMessage);
              }
              else if (this.tableData.OutputMessage[0]) {
                if (this.tableData.OutputMessage != "")
                  this.global.showAlert(this.tableData.OutputMessage[0]);
              }
              else if (this.tableData.OutMsg[0]) {
                if (this.tableData.OutMsg[0] != "")
                  this.global.showAlert(this.tableData.OutMsg[0]);
              }

            } catch (err) {
              console.log(err.toString());
            }


          } else {
            this.global.showAlert(response['Root']['Output']);
          }
        }
      }, (error) => {
        this.global.showAlert(error);
      });

    }


  }

  isDockedIn(): boolean {
    // console.log('******************  isDockedIn called here');
    // console.log(this.dockInPerformed)
    if (this.dockInPerformed)
      return false;
    else
      return true;
  }

  isDockedInPerformed(): boolean {
    // console.log('******************  isDockedIn called here');
    // console.log(this.dockInPerformed)
    if (this.dockInPerformed)
      return true;
    else
      return false;
  }

  isDockedOUTPerformed(): boolean {

    if (this.dockOutPerformed == true && this.dockInPerformed == true)
      return true;
    else
      return false;
  }

  isClosedVCTPerformed(): boolean {

    // if (this.isDockedInPerformed)
    // return true;

    if (this.dockOutPerformed == true && this.dockInPerformed == true) {
      if (this.vctClosed == true)
        return true;
      else
        return false;
    }
    else
      return true;

  }


  isNextDisabled(): boolean {
    if (this.vctClosed == true)
      return true;
    else
      return false;

  }


  canPerformRevokeVCT(): boolean {

    // if (this.isDockedInPerformed)
    // return true;

    if (this.dockOutPerformed == true && this.dockInPerformed == true) {
      if (this.vctClosed == true)
        return false;
      else
        return true;
    }
    else
      return true;

  }

  textareaMaxLengthValidation() {
    if (this.trkDockNo.length >= 8) {
      this.trkDockNo = '';
      alert('Please enter only 8 digit in Dock No.')
    }
  }

}
