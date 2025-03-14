import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { HttpProvider } from '../../providers/http/http';


/**
 * Generated class for the ExportScanningPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


export class GroupIDDetails {
  pi_strUserName: any;
  pi_strGrpId: any;
  pi_strAWBNo: any;
}

export class LocationMaster {
  pi_strQueryType: any;
}

export class saveSplitting {
  pi_strGroupId: any;
  pi_intOldLocId: any;
  pi_strOldLocation: any;
  pi_intOldLocPieces: any;
  pi_strNewGroupId: any;
  pi_strNewLoc: any;
  pi_intNewLocPieces: any;
  pi_intAWBId: any;
  pi_strLoaderName: any;
  pi_strCreatedBy: any;
}


@IonicPage()
@Component({
  selector: 'page-export-scanning',
  templateUrl: 'export-scanning.html',
})
export class ExportScanningPage {

  title: String;
  strUserName: any;

  locParams: LocationMaster;
  grpParams: GroupIDDetails;
  locParamsSave: saveSplitting;

  groupID: String;
  tableData: any;

  locationList: any;
  searchValue: string = '';
  eqtValue: String ='';
  splitgroupid: string = '';

  filteredList: Array<{ LD_LocationCode_C: string, LM_AreaCode_C: string, LM_ShedNo_C: string }>;

  awbNumber: String;
  pieces: String;
  locCode: String;

  newGroupID: String;
  newPieces: String;
  newLoc: String;

  loadername: String;


  awbID: any;
  locationID: any;


  constructor(public navCtrl: NavController, public http: HttpProvider, public alertCtrl: AlertController, public global: GlobalProvider, public navParams: NavParams) {


    this.grpParams = new GroupIDDetails();
    this.locParams = new LocationMaster();
    this.locParamsSave = new saveSplitting();
    this.locParams.pi_strQueryType = "E";

    this.awbNumber = "";
    this.pieces = "";
    this.locCode = "";

    this.newGroupID = "";
    this.newPieces = "";
    this.newLoc = "";
    this.loadername = "";

    this.awbID = 0;
    this.locationID = 0;
  }


  ngOnInit() {

    this.strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExportScanningPage');
    this.getLocationsList();

  }

  scanGroupID()
  {
    if (this.groupID == undefined)
    return;

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.groupID.toString())) {
      this.groupID = "";
      this.splitgroupid = '';
      this.global.showAlert("Please enter only standard alpha numerics in Group ID");
      return;
    }

    this.getGroupIDDetails();
  }
 

  getLocationsList() {
    this.http.getHttpPostRequest("GetDetails", this.locParams).then((response) => {
      console.log(response['NewDataSet']['Table']);
      this.locationList = response['NewDataSet']['Table'];
      this.filteredList = this.locationList;

    }, (error) => {
      this.global.showAlert(error);
    });
  }

  clearAllValues() {
    this.awbNumber = "";
    this.pieces = "";
    this.locCode = "";

    this.newGroupID = "";
    this.newPieces = "";
    this.newLoc = "";

    this.groupID = "";
    this.searchValue = '';
    this.eqtValue ='';
    this.splitgroupid = '';
    this.loadername = "";

    this.awbID = 0;
    this.locationID = 0;
  }

  private filterList() {

    if (this.locationList.length == 0)
      return;

    if (this.searchValue.length >= 2) {
      console.log(this.searchValue);
      this.filteredList = this.locationList;
      //Make a variable so as to avoid any flashing on the screen if you set it to an empty array
      //localFilteredList = any;
      const localFilteredList = this.filteredList.filter((el) => el.LD_LocationCode_C[0].toLowerCase().includes(this.searchValue.toLowerCase()));

      console.log(localFilteredList);
      console.log(localFilteredList.length.toString());
      this.filteredList = localFilteredList;


      if (localFilteredList.length == 1) {
        console.log("localFilteredList[0]");
        console.log(localFilteredList[0]);

        this.newLoc = localFilteredList[0].LD_LocationCode_C[0];
        console.log(this.newLoc);
      }
      else {

      //  this.newLoc = "";
        
       // this.filteredList = [];
      }
    }
    else this.filteredList = [];
  }

  fetchLocationDetails(selectedVal) {
    const localFilteredList = this.filteredList.filter((el) => el.LD_LocationCode_C[0].toLowerCase().includes(selectedVal.toLowerCase()));

    // console.log(localFilteredList);
    // console.log(localFilteredList.length.toString());
    // this.filteredList = localFilteredList;


    if (localFilteredList.length == 1) {
      console.log("localFilteredList[0]");
      console.log(localFilteredList[0]);

      this.newLoc = localFilteredList[0].LD_LocationCode_C[0];

    }
  }


  switch($event) {
    console.log($event.value);
    this.groupID = $event.value;

  }


  getGroupIDDetails() {

    if (this.groupID == undefined) {
      alert("Kindly enter or scan Group ID");
      return;
    }

    if (this.groupID.toString().trim() == "") {
      alert("Kindly enter or scan Group ID");
      return;
    }

    this.awbNumber = "";
    this.pieces = "";
    this.locCode = "";

    this.newGroupID = "";
    this.newPieces = "";
    this.newLoc = "";
    this.loadername = "";

    this.searchValue = '';
    this.eqtValue ='';
    this.awbID = 0;
    this.locationID = 0;

    this.grpParams.pi_strUserName = this.strUserName;
    this.grpParams.pi_strGrpId = this.groupID;
    this.grpParams.pi_strAWBNo = "";

    //Exp_GetLocDetailsForIM_HHT
    this.http.getHttpPostRequest("Exp_GetLocDetailsForIM_HHT", this.grpParams).then((response) => {
      if (response.hasOwnProperty('NewDataSet')) {
        console.log(response['NewDataSet']);
        console.log(response['NewDataSet']['Table'][0]);

        this.tableData = response['NewDataSet']['Table'][0];


        console.log(this.tableData.AWBId[0]);
        console.log(this.tableData.AWBNo[0]);
        console.log(this.tableData.LocatedPieces[0]);
        console.log(this.tableData.Location[0]);
        console.log(this.tableData.LocationId[0]);
        console.log(this.tableData.LoaderName[0]);



        this.awbID = this.tableData.AWBId[0];
        this.awbNumber = this.tableData.AWBNo[0];
        this.pieces = this.tableData.LocatedPieces[0];
        this.locCode = this.tableData.Location[0];
        this.locationID = this.tableData.LocationId[0];
        this.loadername = this.tableData.LoaderName[0];

      } else {
        this.global.showAlert(response['Root']['Output']);
        this.clearAllValues();
      }


    }, (error) => {
      this.global.showAlert(error);
    });
  }

  saveLocationData() {

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
      this.splitgroupid = '';
      this.global.showAlert("Please enter only standard alpha numerics in Group ID");
      return;
    }

    if (this.newGroupID == undefined) {
      alert("Kindly enter new Group ID");
      return;
    }

    if (this.newGroupID.toString().trim() == "") {
      alert("Kindly enter new Group ID");
      return;
    }


    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.newGroupID.toString())) {
      this.newGroupID = "";
      this.global.showAlert("Please enter only standard alpha numerics in New Group ID");
      return;
    }


    if (this.newPieces == undefined) {
      alert("Kindly enter pieces");
      return;
    }

    if (this.newPieces.toString().trim() == "") {
      alert("Kindly enter pieces");
      return;
    }

    if (this.newLoc == "") {
      alert("Kindly select new Location");
      return;
    }

    if (this.awbNumber == "") {
      alert("MAWB No. cannot be blank");
      return;
    }

    // pi_strGroupId: any;
    // pi_intOldLocId: any;
    // pi_strOldLocation: any;
    // pi_intOldLocPieces: any;
    // pi_strNewGroupId: any;
    // pi_intNewLocPieces: any;
    // pi_intAWBId: any;
    // pi_strLoaderName: any;
    // pi_strCreatedBy: any;

   
    this.locParamsSave.pi_strGroupId = this.groupID;
    this.locParamsSave.pi_intOldLocId = Number(this.locationID);
    this.locParamsSave.pi_strOldLocation = this.locCode;
    this.locParamsSave.pi_intOldLocPieces = Number(this.pieces);
    this.locParamsSave.pi_strNewGroupId = this.newGroupID;
    this.locParamsSave.pi_strNewLoc = this.newLoc;
    this.locParamsSave.pi_intNewLocPieces = Number(this.newPieces);
    this.locParamsSave.pi_intAWBId = Number(this.awbID);
    this.locParamsSave.pi_strLoaderName = this.loadername;
    this.locParamsSave.pi_strCreatedBy = this.strUserName;;


    console.log(this.locParamsSave);

    this.http.getHttpPostRequest("Exp_SaveLocDetailsForIM_HHT", this.locParamsSave).then((response) => {
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


        } else {
          var msgText = (response['Root']['Output']).toString();
          console.log(response['Root']['Output'].toString());
          if (msgText.toLowerCase().includes("success")) {

            console.log("save sucess");

            let confirm = this.alertCtrl.create({
              // title: this.VTNoMsg,
              title: msgText,
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    this.navCtrl.pop();
                  }
                }
              ]
            });
            confirm.present();


          }
          else
            this.global.showAlert(response['Root']['Output']);
        }
      }
    }, (error) => {
      this.global.showAlert(error);
    });


  }


}
