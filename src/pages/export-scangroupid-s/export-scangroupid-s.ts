import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { HttpProvider } from '../../providers/http/http';
import { trigger } from '@angular/core/src/animation/dsl';
/**
 * Generated class for the ExportScangroupidSPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-export-scangroupid-s',
  templateUrl: 'export-scangroupid-s.html',
})
export class ExportScangroupidSPage {
  strUserName: any;
  awbno: any;
  groupID: String;
  groupID1: String = '';

  screeningmethod: String = '';
  securitystatus: String = '';
  securitytype: String = '';
  exemptc: String = '';

  awbData: any = [];
  savedDataResponse: any = [];

  //tableData: Array<{ grpid: string, pieces: string }>;
  tableData: Array<{
    ID: string,
    AWBNumber: string,
    GroupID: string,
    AWBID: string,
    Pieces: number,
    CreatedByID: string,
    IsScreened: boolean,
    ScreeningMethod: string,
    Status: string,
    ErrorMessage: string,
    CreatedByLoginID: string,
    ScreenedByLoginID: string,
  }>;

  tableDataTemp: Array<{
    ID: string,
    AWBNumber: string,
    GroupID: string,
    AWBID: string,
    Pieces: number,
    CreatedByID: string,
    IsScreened: boolean,
    ScreeningMethod: string,
    Status: string,
    ErrorMessage: string,
    CreatedByLoginID: string,
    ScreenedByLoginID: string,
  }>;


  // tableDataSave: Array<{

  //   RowID_I: number,// 0,
  //   AWBNumber: string,// 77781181111,
  //   Pieces: number,// 2,
  //   ScreenedPieces: number,// 2,
  //   unScreenedPieces: number,// 1,
  //   GrossWt: number,// 2.5,
  //   ChWt: number,// 2.5,
  //   Origin: string,// BOM,
  //   SecurityId: number,// 0,
  //   SecurityStatusID: string,// null,
  //   Destination: string,// BKK,
  //   Commodity: string,// testing cargo,
  //   CommodityGroup: string,// ,
  //   Remarks: string,// ,
  //   CreatedBy: string,// ConsolMIALUAT,
  //   CreatedOn: string,// 2023-04-13T13: ,//35: ,//19.71,
  //   UpdatedBy: string,// null,
  //   UpdatedOn: string,// null,
  //   ExemptCargo: string,// null,
  //   FlightNo: string,// ZZ2423 ,
  //   FlightDate: string,// 13/04/2023,
  //   MachineNo: string,// ,
  //   Status: string,// S,
  //   ErrorMessage: string,// Record Found,
  //   lstScreningMethod: Array<{
  //     Pieces: number,

  //     ScreningMethodName: string,
  //     PiecesPercentage: string,
  //   }>,// [],
  //   Security: string,// null,
  //   SecurityStatus: string,// null,
  //   Remark: string,// null,
  //   StickerStart: string,// null,
  //   StickerEnd: string,// null,
  //   StickerNoP: string,// null,
  //   lstScreeningGroupID: Array<{
  //     AWBNumber: string,
  //     GroupID: string,
  //     AWBID: string,
  //     Pieces: number,
  //     CreatedByID: string,
  //     CreatedBy: string,
  //     IsScreened: boolean,
  //     ScreeningMethod: string,
  //     Status: string,
  //     ErrorMessage: string
  //   }>,// []

  // }>;


  tableDataSave: Array<{

    RowID_I: number,// 0,
    AWBNumber: string,// 77781181111,
    Pieces: number,// 2,
    ScreenedPieces: number,// 2,
    unScreenedPieces: number,// 1,
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
    lstScreningMethod: Array<{
      Pieces: number,

      ScreningMethodName: string,
      PiecesPercentage: string,
    }>,// [],
    Security: string,// null,
    SecurityStatus: string,// null,
    Remark: string,// null,
    StickerStart: string,// null,
    StickerEnd: string,// null,
    StickerNoP: string,// null,
    lstScreeningGroupID: Array<{
      ID: string,
      AWBNumber: string,
      GroupID: string,
      AWBID: string,
      Pieces: number,
      CreatedByID: string,
      IsScreened: boolean,
      ScreeningMethod: string,
      Status: string,
      ErrorMessage: string,
      CreatedByLoginID: string,
      ScreenedByLoginID: string,
    }>,// []

  }>;


  hasRows: boolean = false;
  totalPieces: number = 0;
  groupIDScreeningTable: any = [];

  constructor(public navCtrl: NavController, public http: HttpProvider, public global: GlobalProvider, public navParams: NavParams) {
    this.tableData = [];
    this.tableDataTemp = [];
    this.tableDataSave = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExportScangroupidSPage');
    this.awbno = localStorage.getItem('AWBNO');
    this.screeningmethod = localStorage.getItem('screeningmethod');
    this.securitystatus = localStorage.getItem('securitystatus');
    this.securitytype = localStorage.getItem('securitytype');
    this.exemptc = localStorage.getItem('exemptc');


    localStorage.setItem('isSaved', "false");

    // localStorage.setItem('screeningmethod', "");
    // localStorage.setItem('securitystatus', "");
    // localStorage.setItem('securitytype', "");
  }
  ngOnInit() {
    this.strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
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
      this.totalPieces = Number(this.totalPieces) + Number(this.tableData[i].Pieces);
    }

    if (this.tableData.length == 0)
      this.hasRows = false;
  }

  scanGroupID() {
    if (this.groupID == undefined)
      return;

    this.getGroupIDDetails();
  }

  // getGroupIDDetails() {
  //   // this.tableData.push({ grpid: this.groupID.toString(), pieces: '1' });
  //   // this.groupID = "";
  //   // this.groupID1 = "";
  //   // console.log(this.tableData);
  //   // this.hasRows = true;
  //   // this.totalPieces = 0;
  //   // for (let i = 0; i < this.tableData.length; i++) {
  //   //   this.totalPieces = Number(this.totalPieces) + Number(this.tableData[i].pieces);
  //   // }

  // }


  getGroupIDDetails() {
    if (this.groupID == undefined) {
      alert("Kindly enter or scan Group ID");
      return;
    }

    if (this.groupID.toString().trim() == "") {
      alert("Kindly enter or scan Group ID");
      return;
    }

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.groupID.toString())) {
      this.groupID = "";
      this.global.showAlert("Please enter only standard alpha numerics in Group ID");
      return;
    }

    console.log("this.groupID ==" + this.groupID);





    var requestURL = "GetGroupIDDetails?MAWBNo=" + this.awbno.toString()
      + "&GroupID=" + this.groupID.toString();
    console.log(requestURL);
    this.http.httpGETRequestAMAX(requestURL).then((response) => {
      //  console.log(response);
      this.groupIDScreeningTable = response;
      this.tableDataTemp = this.groupIDScreeningTable['lstScreeningGroupID'];

      if (this.tableDataTemp.length == 0) {
        this.global.showAlert("Group ID " + this.groupID + " does not exists");
        this.groupID = "";
        this.groupID1 = "";
        return;
      }

      var chkValueExist = this.tableDataTemp.some(code => (code.GroupID == this.groupID.toString()
        && code.IsScreened == true && code.ScreeningMethod.toLocaleUpperCase() == this.screeningmethod));
      console.log("chkValueExist ==" + chkValueExist);

      if (chkValueExist == true) {
        this.global.showAlert(this.groupID + " already scanned for method " + this.screeningmethod.toUpperCase());

        this.groupID = "";
        this.groupID1 = "";
      }
      else {

        console.log("this.tableData.length >>> 0");
        console.log("this.tableDataTemp.length =" + this.tableDataTemp.length.toString());

        if (this.tableData.length > 0) {
          var chkValueExistinTable = this.tableData.some(code => (code.GroupID == this.groupID.toString()
            && code.IsScreened == true && code.ScreeningMethod.toLocaleUpperCase() == this.screeningmethod));
          console.log("chkValueExistinTable ==" + chkValueExistinTable);

          if (chkValueExistinTable == true) {
            this.global.showAlert(this.groupID + " already scanned for method " + this.screeningmethod.toUpperCase());

            this.groupID = "";
            this.groupID1 = "";
          }
          else {


            for (let i = 0; i < this.tableDataTemp.length; i++) {
              console.log("this.tableDataTemp[i].IsScreened = " + this.tableDataTemp[i].IsScreened);
              console.log("this.tableDataTemp[i].ScreeningMethod = " + this.tableDataTemp[i].ScreeningMethod);
              if (this.tableDataTemp[i].IsScreened == false && this.tableDataTemp[i].ScreeningMethod == "") {
                this.hasRows = true;
                this.tableData.push(
                  {

                    ID: this.tableDataTemp[i].ID,
                    AWBNumber: this.tableDataTemp[i].AWBNumber,
                    GroupID: this.tableDataTemp[i].GroupID,
                    AWBID: this.tableDataTemp[i].AWBID,
                    Pieces: this.tableDataTemp[i].Pieces,
                    CreatedByID: this.tableDataTemp[i].CreatedByID,
                    IsScreened: true,// this.tableDataTemp[i].IsScreened'],
                    ScreeningMethod: this.screeningmethod.toString(), // this.tableDataTemp[i].GroupID'],
                    Status: this.tableDataTemp[i].Status,
                    ErrorMessage: this.tableDataTemp[i].ErrorMessage,

                    CreatedByLoginID: this.tableDataTemp[i].CreatedByLoginID,
                    ScreenedByLoginID: this.tableDataTemp[i].ScreenedByLoginID,
                  }

                );
                // }
              }

            }
          }
        }
        else {

          for (let i = 0; i < this.tableDataTemp.length; i++) {
            console.log("this.tableDataTemp[i].IsScreened = " + this.tableDataTemp[i].IsScreened);
            console.log("this.tableDataTemp[i].ScreeningMethod = " + this.tableDataTemp[i].ScreeningMethod);
            if (this.tableDataTemp[i].IsScreened == false && this.tableDataTemp[i].ScreeningMethod == "") {
              this.hasRows = true;
              this.tableData.push(
                {
                  ID: this.tableDataTemp[i].ID,
                  AWBNumber: this.tableDataTemp[i].AWBNumber,
                  GroupID: this.tableDataTemp[i].GroupID,
                  AWBID: this.tableDataTemp[i].AWBID,
                  Pieces: this.tableDataTemp[i].Pieces,
                  CreatedByID: this.tableDataTemp[i].CreatedByID,
                  IsScreened: true,
                  ScreeningMethod: this.screeningmethod.toString(),
                  Status: this.tableDataTemp[i].Status,
                  ErrorMessage: this.tableDataTemp[i].ErrorMessage,

                  CreatedByLoginID: this.tableDataTemp[i].CreatedByLoginID,
                  ScreenedByLoginID: this.tableDataTemp[i].ScreenedByLoginID,
                }
              );
              // }
            }
          }
        }


      }

      if (this.tableData.length > 0) {
        this.totalPieces = 0;
        for (let i = 0; i < this.tableData.length; i++) {
          this.totalPieces = Number(this.totalPieces) + Number(this.tableData[i].Pieces);
        }
      }

    }, (error) => {
      this.global.showAlert("An Error has occured while processing the request.");
      //  this.global.showAlert(error);
    });


  }


  clearAll() {
    this.groupID = "";
    this.groupID1 = "";
    this.tableData = [];
    this.tableDataTemp = [];
    this.tableDataSave = [];
    this.hasRows = false;
    localStorage.setItem('isSaved', "false");
  }


  saveData() {

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.groupID.toString())) {
      this.groupID = "";
      this.global.showAlert("Please enter only standard alpha numerics in Group ID");
      return;
    }

    if (this.tableData.length == 0)
      return;

    var requestURL = "GetScreeningDetails?MAWBNo=" + this.awbno.toString();
    this.http.httpGETRequestAMAX(requestURL).then((response) => {
      this.awbData = response;

      this.tableDataSave = [];
      this.tableDataSave.push(
        {
          RowID_I: this.awbData['RowID_I'],// 0,
          AWBNumber: this.awbData['AWBNumber'],// 77781181111,
          Pieces: this.awbData['Pieces'],// 2,
          ScreenedPieces: this.awbData['ScreenedPieces'],// 2,
          unScreenedPieces: this.awbData['unScreenedPieces'],// 1,
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
          UpdatedBy: this.strUserName,//this.awbData['UpdatedBy'],// null,
          UpdatedOn: this.awbData['UpdatedOn'],// null,
          ExemptCargo: this.exemptc.toString(), //this.awbData['ExemptCargo'],// null,
          FlightNo: this.awbData['FlightNo'],// ZZ2423 ,
          FlightDate: this.awbData['FlightDate'],// 13/04/2023,
          MachineNo: this.awbData['MachineNo'],// ,
          Status: this.awbData['Status'],// S,
          ErrorMessage: this.awbData['ErrorMessage'],// Record Found,
          lstScreningMethod: [],
          Security: this.securitytype.toString(),//// this.awbData['Security'],// null,
          SecurityStatus: this.securitystatus.toString(),//this.awbData['SecurityStatus'],// null,
          Remark: this.awbData['Remark'],// null,
          StickerStart: this.awbData['StickerStart'],// null,
          StickerEnd: this.awbData['StickerEnd'],// null,
          StickerNoP: this.awbData['StickerNoP'],// null,
          lstScreeningGroupID: []
        });
      console.log("this.tableDataSave.length =" + this.tableDataSave.length.toString());
      console.log(this.tableDataSave);
      this.tableDataSave[0].lstScreningMethod.push(
        {
          Pieces: this.totalPieces,
          ScreningMethodName: this.screeningmethod.toString(),
          PiecesPercentage: "",
        }
      );
      console.log(this.tableDataSave);

      for (let i = 0; i < this.tableData.length; i++) {
        this.tableDataSave[0].lstScreeningGroupID.push(
          {
            ID: this.tableData[i].ID,
            AWBNumber: this.tableData[i].AWBNumber,
            GroupID: this.tableData[i].GroupID,
            AWBID: this.tableData[i].AWBID,
            Pieces: Number(this.tableData[i].Pieces),
            CreatedByID: this.tableData[i].CreatedByID,
            IsScreened: true,
            ScreeningMethod: this.tableData[i].ScreeningMethod,
            Status: this.tableData[i].Status,
            ErrorMessage: this.tableData[i].ErrorMessage,
            CreatedByLoginID: this.strUserName,
            ScreenedByLoginID: this.strUserName,
          }
        );
      }

      // var myJSON = JSON.stringify(this.tableDataSave);
      // myJSON = myJSON.substring(1, myJSON.length - 1);
      // console.log(myJSON);



      // let dataToSave = '{"RowID_I": 0,' +
      //   '"AWBNumber":"'  + this.tableDataSave[0].AWBNumber.toString() + '",' + 
      // '"Pieces":' + this.tableDataSave[0].Pieces + ','+
      // '"ScreenedPieces":' + this.tableDataSave[0].ScreenedPieces + ','+
      // '"unScreenedPieces":' + this.tableDataSave[0].unScreenedPieces + ','+
      // '"GrossWt":'  + this.tableDataSave[0].GrossWt + ','+
      // '"ChWt":'  + this.tableDataSave[0].ChWt + ','+
      // '"Origin":"'  + this.tableDataSave[0].Origin.toString() + '",' + 
      // '"SecurityId":'  + this.tableDataSave[0].SecurityId + ','+
      // '"SecurityStatusID": null ,' +
      // '"Destination":"'  + this.tableDataSave[0].Destination.toString() + '",' + 
      // '"Commodity":"'  + this.tableDataSave[0].Commodity.toString() + '",' + 
      // '"CommodityGroup":"'  + this.tableDataSave[0].CommodityGroup.toString() + '",' + 
      // '"Remarks": null,'+
      // '"CreatedBy":"'  + this.tableDataSave[0].CreatedBy.toString() + '",' + 
      // '"CreatedOn":"'  + this.tableDataSave[0].CreatedOn.toString() + '",' + 
      // '"UpdatedBy": null,'+
      // '"UpdatedOn": null,'+
      // '"ExemptCargo": null,'+
      // '"FlightNo":"'  + this.tableDataSave[0].FlightNo.toString() + '",' + 
      // '"FlightDate":"'  + this.tableDataSave[0].FlightDate.toString() + '",' + 
      // '"MachineNo":"'  + this.tableDataSave[0].Status.toString() + '",' + 
      // '"Status":"'  + this.tableDataSave[0].Status.toString() + '",' + 
      // '"ErrorMessage": null,'+
      //   '"lstScreningMethod": [{' +
      //   '"Pieces":'  + this.tableDataSave[0].lstScreningMethod[0].Pieces + ','+
      // '"ScreningMethodName":"'  + this.tableDataSave[0].lstScreningMethod[0].ScreningMethodName.toString() + '",' + 
      // '"PiecesPercentage": ""}],' +
      // '"Security":"'  + this.tableDataSave[0].Security.toString() + '",' + 
      // '"SecurityStatus":"'  + this.tableDataSave[0].SecurityStatus.toString() + '",' + 
      // '"Remark": null,'+
      // '"StickerStart": null,'+
      // '"StickerEnd": null,'+
      // '"StickerNoP": null,'+
      // '"lstScreeningGroupID": [{ ' +
      //   '"ID":'  + this.tableDataSave[0].lstScreeningGroupID[0].ID + ','+
      // '"AWBNumber":"'  + this.tableDataSave[0].lstScreeningGroupID[0].AWBNumber.toString() + '",' + 
      // '"GroupID":"'  + this.tableDataSave[0].lstScreeningGroupID[0].GroupID.toString() + '",' + 
      // '"AWBID":'  + this.tableDataSave[0].lstScreeningGroupID[0].AWBID + ','+
      // '"Pieces":'  + this.tableDataSave[0].lstScreeningGroupID[0].Pieces + ','+
      // '"CreatedByID":'  + this.tableDataSave[0].lstScreeningGroupID[0].CreatedByID + ','+
      // '"IsScreened":"'  + this.tableDataSave[0].lstScreeningGroupID[0].IsScreened.toString() + '",' + 
      // '"ScreeningMethod":"'  + this.tableDataSave[0].lstScreeningGroupID[0].ScreeningMethod.toString() + '",' + 
      // '"Status":"'  + this.tableDataSave[0].lstScreeningGroupID[0].Status.toString() + '",' + 
      // '"ErrorMessage":"'  + this.tableDataSave[0].lstScreeningGroupID[0].ErrorMessage.toString() + '",' + 
      // '"CreatedByLoginID":"'  + this.tableDataSave[0].lstScreeningGroupID[0].CreatedByLoginID.toString() + '",' + 
      // '"ScreenedByLoginID":"'  + this.tableDataSave[0].lstScreeningGroupID[0].ScreenedByLoginID.toString() + '"}]}';




      // console.log(dataToSave);



      var myJSON = JSON.stringify(this.tableDataSave);
      myJSON = myJSON.substring(1, myJSON.length - 1);
      console.log(myJSON);

     // this.http.httpPostRequestAMAX("SaveScreeningDetails", myJSON);

      this.http.httpPostRequestAMAX("SaveScreeningDetails", myJSON).then((response) => {
        //   this.http.httpPostRequestAMAX("SaveScreeningDetails", this.tableDataSave).then((response) => {
        this.savedDataResponse = response;
        console.log(this.savedDataResponse);
        if (this.savedDataResponse['Status'].toString().toLowerCase() == "e") {
          this.global.showAlert(this.savedDataResponse['ErrorMessage'].toString());
        }
        else {
        
          this.global.showAlert(this.savedDataResponse['ErrorMessage'].toString());
          this.clearAll();
          localStorage.setItem('isSaved', "true");
        }
      });

    }, (error) => {
      this.global.showAlert("An Error has occured while processing the request.");
    });
  }




  isSaveDisabled(): boolean {
    if (this.hasRows == true)
      return false;
    else
      return true;

  }

}
