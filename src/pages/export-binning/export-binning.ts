import { Component } from '@angular/core';
import { Console } from '@angular/core/src/console';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { HttpProvider } from '../../providers/http/http';

/**
 * Generated class for the ExportBinningPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export class GroupIDDetails {
  pi_strUserName: any;
  pi_strGrpId: any;
}


export class LocationMaster {
  pi_strQueryType: any;
}

export class saveBinning {
  pi_strLocationDetailsXML: any;
  pi_strGrpId: any;
  pi_strUserName: any;
  pi_strawbno: any;
}



@IonicPage()
@Component({
  selector: 'page-export-binning',
  templateUrl: 'export-binning.html',
})
export class ExportBinningPage {
  title: String;
  strUserName: any;
  locParams: LocationMaster;
  grpParams: GroupIDDetails;
  locParamsSave: saveBinning;
  groupID: String;
  tableData: any;
  tableData1: any;

  locationList: any;
  searchValue: string = '';
  eqtValue:string = '';
  binninggroupid: string = '';

  filteredList: Array<{ LD_LocationCode_C: string, LM_AreaCode_C: string, LM_ShedNo_C: string }>;

  awbNumber: String;
  pieces: String;
  locCode: String;
  nog: String;

  locshed: String;
  locCodenew: String;
  locarecode: String;

  locid: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public global: GlobalProvider, public http: HttpProvider, public navParams: NavParams) {
    this.title = "Exports Dashboard";
    this.grpParams = new GroupIDDetails();
    this.locParams = new LocationMaster();
    this.locParamsSave = new saveBinning();
    this.locParams.pi_strQueryType = "E";

    this.awbNumber = "";
    this.pieces = "";
    this.locCode = "";
    this.nog = "";

    this.locshed = "";
    this.locCodenew = "";
    this.locarecode = "";

    this.locid = 0;


  }



  ngOnInit() {

    this.strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExportBinningPage');
    this.getLocationsList();
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

  
  scanGroupID()
  {
    if (this.groupID == undefined)
    return;

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.groupID.toString())) {
      this.groupID = "";
      this.binninggroupid = '';
      this.global.showAlert("Please enter only standard alpha numerics in Group ID");
      return;
    }

    this.getGroupIDDetails();
  }

  clearAllValues() {
    this.awbNumber = "";
    this.pieces = "";
    this.locCode = "";
    this.nog = "";

    this.locshed = "";
    this.locCodenew = "";
    this.locarecode = "";

    this.groupID = "";
    this.searchValue = '';
    this.eqtValue ='';
    this.binninggroupid = '';


    this.locid = 0;
  }

  // function called in the html whenever you change the ion searchbar value
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

        this.locCodenew = localFilteredList[0].LD_LocationCode_C;
        this.locarecode = localFilteredList[0].LM_AreaCode_C;
        this.locshed = localFilteredList[0].LM_ShedNo_C;

      }
      else {

        // this.locshed = "";
        // this.locCodenew = "";
        // this.locarecode = "";
        // //this.filteredList = [];
        // this.locid = 0;
      }
    }   else this.filteredList = [];
  }

  
  fetchLocationDetails(selectedVal) {
    const localFilteredList = this.filteredList.filter((el) => el.LD_LocationCode_C[0].toLowerCase().includes(selectedVal.toLowerCase()));

    // console.log(localFilteredList);
    // console.log(localFilteredList.length.toString());
    // this.filteredList = localFilteredList;


    if (localFilteredList.length == 1) {
      console.log("localFilteredList[0]");
      console.log(localFilteredList[0]);

      this.locCodenew = localFilteredList[0].LD_LocationCode_C;
      this.locarecode = localFilteredList[0].LM_AreaCode_C;
      this.locshed = localFilteredList[0].LM_ShedNo_C;

    }
  }

  switch($event) {
    console.log($event.value);
    this.groupID = $event.value;

    // console.log(this.groupID.length.toString());
    // if (this.groupID.length >= 3) {
    //   this.getLocations();
    // }

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
    this.nog = "";

    this.locshed = "";
    this.locCodenew = "";
    this.locarecode = "";
    this.searchValue = '';
    this.eqtValue ='';

    this.locid = 0;

    this.grpParams.pi_strUserName = this.strUserName;
    this.grpParams.pi_strGrpId = this.groupID;
    //Exp_GetLocDetailsForIM_HHT
    this.http.getHttpPostRequest("Exp_GetLocDetails_HHT", this.grpParams).then((response) => {
      if (response.hasOwnProperty('NewDataSet')) {

        console.log(response['NewDataSet']['Table3'][0]);
        console.log(response['NewDataSet']['Table1'][0]);

        this.tableData = response['NewDataSet']['Table3'][0];
        this.tableData1 = response['NewDataSet']['Table1'][0];

        console.log(this.tableData1.AL_AWBNumber_C[0]);
        console.log(this.tableData.ELD_Pieces_I[0]);
        console.log(this.tableData.ELD_LocationCode_C[0]);
        console.log(this.tableData.NOG[0]);


        this.awbNumber = this.tableData1.AL_AWBNumber_C[0];
        this.pieces = this.tableData.ELD_Pieces_I[0];
        this.locCode = this.tableData.ELD_LocationCode_C[0];
        this.nog = this.tableData.NOG[0];
        this.locid = this.tableData.ELD_RowId_I[0];

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

    if (this.locCodenew == undefined) {
      alert("Kindly select new Location");
      return;
    }

    if (this.locCodenew == "") {
      alert("Kindly select new Location");
      return;
    }

    if (this.awbNumber == "") {
      alert("MAWB No. cannot be blank");
      return;
    }


    var locationData = "";

    // <Loc Shed="H" Area ="I" LocCode ="T07" GroupId ="GR200L" Pieces ="4" LocationId ="45" Temperature ="" TempTimestamp =""/>
    locationData = '<Loc Shed="' + this.locshed + '" Area="' + this.locarecode + '" LocCode="' + this.locCodenew + '" GroupId="' + this.groupID + '" Pieces="' + this.pieces + '" LocationId ="' + this.locid + '" Temperature="' + "" + '" TempTimestamp="' + "" + '"  />';

    locationData = "<LocDetails>" + locationData + "</LocDetails>";

    this.locParamsSave.pi_strLocationDetailsXML = locationData;
    this.locParamsSave.pi_strGrpId = this.groupID;
    this.locParamsSave.pi_strUserName = this.strUserName;
    this.locParamsSave.pi_strawbno = this.awbNumber;

    console.log(this.locParamsSave);

    this.http.getHttpPostRequest("Exp_SaveLocDetails_HHT", this.locParamsSave).then((response) => {
      // console.log(response['NewDataSet']['Table'][0]);
      if (response != null && response != "") {
        if (response.hasOwnProperty('NewDataSet')) {

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

  // this.myFilesXML = '<Data GDRowID="' + this.GPId + '" Pkgs="' + this.Pieces + '" GrWt="' + this.GrWt + '" ChWt="' + this.GrWt + '" />';
  // this.PackDetailXML = '<GPDetails>' + this.myFilesXML + '</GPDetails>';   


  //   <LocDetails>
  //   <Loc Shed="H" Area ="I" LocCode ="T07" GroupId ="GR200L" Pieces ="4" LocationId ="45" Temperature ="" TempTimestamp =""/>
  //   <Loc Shed="H" Area ="I" LocCode ="T103" GroupId ="GFL" Pieces ="4" LocationId ="0" Temperature ="" TempTimestamp =""/>
  // </LocDetails>

}
