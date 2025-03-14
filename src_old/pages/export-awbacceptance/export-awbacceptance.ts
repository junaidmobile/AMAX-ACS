import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { IonicPage, Keyboard, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { HttpProvider } from '../../providers/http/http';


/**
 * Generated class for the ExportAwbacceptancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export class AwbDetails {
  pi_strVCTNo: any;
  pi_strAWBNumber: any;
}

export class TDGAcceptanceAWB {
  pi_strInputXML: any;
  pi_strGroupId: any;
}

@IonicPage()
@Component({
  selector: 'page-export-awbacceptance',
  templateUrl: 'export-awbacceptance.html',
})
export class ExportAwbacceptancePage {

  VCT: String;
  awbno: String;
  awbid: String;
  mawbno: String;
  groupID: String;
  pieces: String;
  grwt: String;
  eqTrolley: String;
  eqTrolleyRowID: any = 0;
  tarepieces: String;
  tarevol: string = '';
  tarewidth: string = '';
  tareheight: string = '';
  tareuom: any;

  dmgNop: any;
  dmgNopPrev: any;
  dmgWT: any;
  dmgWTPrev: any;
  dmgType: any;

  tdgAwbDetailsParams: AwbDetails;
  TDGAcceptanceAWBparams: TDGAcceptanceAWB;
  awbnoAcc: string = '';
  tableData: any;

  awbList: any = [];
  eqTrolleyList: any = [];
  damageTypesList: any = [];

  searchValue: string = '';
  strUserName: any;

  filteredList: Array<{ IsActive: string, TLRowId: string, TrolleyGrossWt: string, TrolleyNo: string, TrolleyTareWt: string }>;
  autoCompleteVar: any;
  lenthArray: string[];
  WidthArray: string[];
  HeightArray: string[];
  finalLenthArray: string[];
  finalWidthArray: string[];
  finalHeightArray: string[];
  public lenth_list: string[];
  public Width_list: string[];
  public Height_list: string[];

  public lenthList_return: string[];
  public WidthList_return: string[];
  public HeightList_return: string[];

  constructor(public navCtrl: NavController, public http: HttpProvider, public global: GlobalProvider, public navParams: NavParams, private keyboard: Keyboard) {

    // this.VCT = "";
    this.awbno = "";
    this.awbid = "";
    this.mawbno = "";
    this.groupID = "";
    this.pieces = "";
    this.grwt = "";
    this.eqTrolley = "";
    this.eqTrolleyRowID = 0;
    this.tarepieces = "";
    this.tarevol = "";
    this.tarewidth = "";
    this.tareheight = "";
    this.tareuom = "";


    this.dmgNop = "";
    this.dmgNopPrev = "";
    this.dmgWT = "";
    this.dmgWTPrev = "";
    this.dmgType = "";

    this.tdgAwbDetailsParams = new AwbDetails();
    this.TDGAcceptanceAWBparams = new TDGAcceptanceAWB();

  }

  ngOnInit() {
    this.strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave ExportAwbacceptancePage');
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave ExportAwbacceptancePage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExportAwbacceptancePage');
    this.getEquipmentTrolleyList();
    this.getDamageTypes();
    this.VCT = localStorage.getItem("VCT_ACC");
  }

  getEquipmentTrolleyList() {
    this.http.getHttpPostRequest("GetTrolleyListDetails_HHT").then((response) => {
      console.log(response['NewDataSet']['Table']);
      this.eqTrolleyList = response['NewDataSet']['Table'];
      this.filteredList = this.eqTrolleyList;

    }, (error) => {
      this.global.showAlert(error);
    });
  }

  getDamageTypes() {
    this.http.getHttpPostRequest("Exp_GetDamageDetails_HHT").then((response) => {
      console.log(response);
      console.log(response['NewDataSet']['Table']);
      this.damageTypesList = response['NewDataSet']['Table'];
      //this.filteredList = this.eqTrolleyList;

    }, (error) => {
      this.global.showAlert(error);
    });
  }

  //Exp_GetDamageDetails_HHT 


  switchAWB($event) {
    console.log($event.value);
    this.awbno = $event.value;
    console.log(this.awbno);
  }



  switchGRP($event) {
    console.log($event.value);
    this.awbno = $event.value;
    console.log(this.awbno);
  }





  fetchLocationDetails(selectedVal) {

    console.log(selectedVal);
    this.eqTrolley = selectedVal;

    const localFilteredList = this.filteredList.filter((el) => el.TrolleyNo[0].toLowerCase().includes(this.eqTrolley.toString().toLowerCase()));

    // // console.log(localFilteredList);
    // // console.log(localFilteredList.length.toString());
    // // this.filteredList = localFilteredList;


    if (localFilteredList.length == 1) {
      console.log("localFilteredList[0]");
      console.log(localFilteredList[0]);

      this.eqTrolley = localFilteredList[0].TrolleyNo;
      this.eqTrolleyRowID = Number(localFilteredList[0].TLRowId);

      console.log(this.eqTrolley);
      console.log(this.eqTrolleyRowID);

    }
  }

  fetchDamageType(selectedVal) {
    console.log(selectedVal);
    this.dmgType = selectedVal;
  }


  fetchUOM(selectedVal) {
    console.log(selectedVal);
    this.tareuom = selectedVal;
  }






  clearAllValues() {

    // localStorage.setItem('VCT_PCS', "999");
    // return;
    // this.VCT = "";
    this.awbno = "";
    this.awbnoAcc = "";
    this.awbid = "";
    this.mawbno = "";
    this.groupID = "";
    this.pieces = "";
    this.grwt = "";
    this.tarepieces = "";
    this.tarevol = "";
    this.tarewidth = "";
    this.tareheight = "";
    this.tareuom = "";
    this.eqTrolley = "";
    this.eqTrolleyRowID = 0;

    this.dmgNop = "";
    this.dmgNopPrev = "";
    this.dmgWT = "";
    this.dmgWTPrev = "";
    this.dmgType = "";
    this.searchValue = '';

    localStorage.setItem('VCT_ACC', "");
  }

  // function called in the html whenever you change the ion searchbar value
  private filterList() {

    if (this.eqTrolleyList.length == 0)
      return;

    this.filteredList = this.eqTrolleyList;
    if (this.searchValue.length >= 2) {
      console.log(this.searchValue);
      // this.filteredList = this.eqTrolleyList;
      //Make a variable so as to avoid any flashing on the screen if you set it to an empty array
      //localFilteredList = any;
      const localFilteredList = this.filteredList.filter((el) => el.TrolleyNo[0].toLowerCase().includes(this.searchValue.toLowerCase()));

      console.log(localFilteredList);
      console.log(localFilteredList.length.toString());
      this.filteredList = localFilteredList;


      if (localFilteredList.length == 1) {
        console.log("localFilteredList[0]");
        console.log(localFilteredList[0]);

        this.eqTrolley = localFilteredList[0].TrolleyNo;
        this.eqTrolleyRowID = Number(localFilteredList[0].TLRowId);

      }
      else {

        // this.eqTrolley = "";

        // this.eqTrolleyRowID = 0;
      }
    }
  }

  scanAWBNO() {
    if (this.awbno == undefined)
      return;

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.awbno.toString())) {
      this.awbno = "";
      this.awbnoAcc = "";
      this.global.showAlert("Please enter only standard alpha numerics in AWB No.");
      return;
    } else {

      this.getVctDetails();
    }
  }

  scanGroupID() {
    if (this.groupID == undefined)
      return;

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.groupID.toString())) {
      this.groupID = "";
      this.global.showAlert("Please enter only standard alpha numerics in Group ID");
      return;
    }

    // this.getVctDetails();
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
      this.awbnoAcc = "";
      this.global.showAlert("Please enter only standard alpha numerics in AWB No.");
      return;
    }

    // this.awbno = "";
    this.mawbno = "";
    this.awbid = "";
    this.groupID = "";
    this.pieces = "";
    this.grwt = "";
    this.eqTrolley = "";

    this.eqTrolleyRowID = 0;
    this.tarepieces = "";
    this.tarevol = "";
    this.tarewidth = "";
    this.tareheight = "";
    this.tareuom = "";

    this.dmgNop = "";
    this.dmgNopPrev = "";
    this.dmgWT = "";
    this.dmgWTPrev = "";
    this.dmgType = "";

    this.tdgAwbDetailsParams.pi_strVCTNo = this.VCT;
    this.tdgAwbDetailsParams.pi_strAWBNumber = this.awbno;


    this.http.getHttpPostRequest("GetAWBDetail_HHT", this.tdgAwbDetailsParams).then((response) => {
      if (response.hasOwnProperty('NewDataSet')) {

        console.log(response['NewDataSet']['Table']);
        this.tableData = response['NewDataSet']['Table'][0];

        this.autoCompleteVar = response['NewDataSet']['Table1'].length;
        for (var i = 0; i < this.autoCompleteVar; i++) {
          this.lenthArray = response['NewDataSet']['Table1'][i]['Length'];
          this.WidthArray = response['NewDataSet']['Table1'][i]['Width'];
          this.HeightArray = response['NewDataSet']['Table1'][i]['Height'];
          // this.lenthArray.push(i);

        }
        this.finalLenthArray = this.lenthArray;
        this.finalWidthArray = this.WidthArray;
        this.finalHeightArray = this.HeightArray;
        this.lenth_list = this.finalLenthArray;
        this.Width_list = this.finalWidthArray;
        this.Height_list = this.finalHeightArray;

        // this.autoCompleteVar = JSON.stringify(response['NewDataSet']['Table1'].length);

        // alert(this.tableData .length)


        // console.log('Auto Complete Data  ' + this.autoCompleteVar);

        console.log(this.tableData.AWBNo[0]);
        console.log(this.tableData.AWBId[0]);
        console.log(this.tableData.RemainingGrWt[0]);
        console.log(this.tableData.RemainingPieces[0]);

        console.log(this.tableData.DmgPkgs[0]);
        console.log(this.tableData.DmgWt[0]);


        this.pieces = this.tableData.RemainingPieces[0]
        this.grwt = this.tableData.RemainingGrWt[0]
        this.mawbno = this.tableData.AWBNo[0]
        this.awbid = this.tableData.AWBId[0];

        this.dmgNopPrev = this.tableData.DmgPkgs[0]
        this.dmgWTPrev = this.tableData.DmgWt[0];

        if (Number(this.pieces) <= 0) {
          this.pieces = "";
          this.grwt = "";
        }


      } else {
        this.global.showAlert(response['Root']['Output']);
        this.clearAllValues();
      }


    }, (error) => {
      this.global.showAlert(error);
    });
  }




  performAcceptance() {




    if (this.awbno == undefined) {
      alert("Kindly enter or scan AWB No.");
      return;
    }

    if (this.awbno == "") {
      alert("Kindly enter or scan AWB No.");
      return;
    }


    if (this.groupID == undefined) {
      alert("Kindly enter or scan Group ID");
      return;
    }

    if (this.groupID.toString().trim() == "") {
      alert("Kindly enter or scan Group ID");
      return;
    }

    if (this.eqTrolley == "") {
      alert("Kindly select euipment/trolley");
      return;
    }

    if (this.eqTrolleyRowID == "") {
      alert("Kindly select euipment/trolley");
      return;
    }


    if (this.pieces == "") {
      alert("Kindly enter Pieces");
      return;
    }

    if (this.grwt == "") {
      alert("Kindly enter GR. WT.");
      return;
    }


    if (this.tarepieces.toString().trim() == "") {
      alert("Kindly enter Tare Pieces");
      return;
    }

    if (this.tarevol == "") {
      alert("Kindly enter Tare volume");
      return;
    }

    if (this.tarewidth == "") {
      alert("Kindly enter Tare width");
      return;
    }

    if (this.tareheight == "") {
      alert("Kindly enter Tare height");
      return;
    }

    // if (this.tareuom == "") {
    //   alert("Kindly select Tare UOM");
    //   return;
    // }

    if (this.tareuom == undefined) {
      alert("Kindly select UOM");
      return;
    }


    if (this.tareuom == "") {
      alert("Kindly select UOM");
      return;
    }

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.awbno.toString())) {
      this.awbno = "";
      this.global.showAlert("Please enter only standard alpha numerics in AWB No.");
      return;
    }

    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>.@\?]/); //unacceptable chars
    if (pattern.test(this.groupID.toString())) {
      this.groupID = "";
      this.global.showAlert("Please enter only standard alpha numerics in Group ID");
      return;
    }


    console.log("all okay");

    const now = Date.now();
    var datePipe = new DatePipe('en-US');
    var saveDate = datePipe.transform(now, 'M/d/y h:mm:ss a');
    console.log(saveDate); //12/19/2022 6:48:39 PM

    var locationData = "";

    if (this.dmgNop == '')
      this.dmgNop = 0;
    else
      if (this.dmgNop.trim() == '')
        this.dmgNop = 0;

    if (this.dmgWT == '')
      this.dmgWT = 0;
    else
      if (this.dmgWT.trim() == '')
        this.dmgWT = 0;

    locationData = '<TDGInfo><TDGDetail ALRowId="' + this.awbid + '" TLRowId="' + "0" +
      '" ScannedPkgs="' + this.pieces +
      '" ScannedGrossWt="' + this.grwt +
      '" VolumetricWt="' + this.grwt +
      '" CreatedBy ="' + this.strUserName + '" Remarks="' + "" +
      '" TDGDate = "' + saveDate +
      '" DmgPkgs ="' + this.dmgNop +
      '" DmgWt ="' + this.dmgWT +
      '" DmgType ="' + this.dmgType + '">';

    locationData = locationData + '<Dims P="' + this.tarepieces +
      '" L="' + this.tarevol +
      '" W="' + this.tarewidth +
      '" H="' + this.tareheight +
      '" U="' + this.tareuom +
      '" V ="' + 0 + '" /></TDGDetail><TDGTrolleyInfo>';

    locationData = locationData + '<TDGTrolleyDetail TrolleyNo="' + this.eqTrolley +
      '" TDRowId="' + 0 +
      '" TLRowId="' + this.eqTrolleyRowID +
      '" TrolleyPkgs="' + 0 +
      '" TrolleyGrossWt="' + 0 +
      '" CreatedBy="' + this.strUserName +
      '" Status ="' + 0 + '" /></TDGTrolleyInfo></TDGInfo>';

    console.log(locationData);

    // return;


    this.TDGAcceptanceAWBparams.pi_strInputXML = locationData;
    this.TDGAcceptanceAWBparams.pi_strGroupId = this.groupID;

    this.http.getHttpPostRequest("CreateTDGAcceptance_GroupId_HHT", this.TDGAcceptanceAWBparams).then((response) => {
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
        }
      }
    }, (error) => {
      this.global.showAlert(error);
    });



  }

  // <TDGInfo>
  // <TDGDetail ALRowId="29403" TLRowId ="0" ScannedPkgs ="3" 
  // ScannedGrossWt ="30" VolumetricWt ="40" CreatedBy ="kale" 
  // Remarks ="accepted by nriii" TDGDate ="10/17/2022 2:57:43 PM"
  // DmgPkgs="1" DmgWt="5.000" DmgType="BRK">
  // <Dims P = "4" L = "50" W = "60" H = "20" U = "cm" V = "80"/>
  // </TDGDetail>
  // <TDGTrolleyInfo>
  // <TDGTrolleyDetail TrolleyNo="AI BLUE-1" TDRowId ="0" 
  // TLRowId ="33" TrolleyPkgs ="0" TrolleyGrossWt ="0" 
  // CreatedBy ="kale" Status ="0"/></TDGTrolleyInfo>
  // <Dims P ="" L="" W="" H="" U="" V=""/>
  // </TDGInfo>





  addLenth(item: string) {
    this.tarevol = item;
    this.lenthList_return = [];
  }

  removeFocusLenth() {
    this.keyboard.close();
  }

  searchLenth() {

    if (!this.tarevol.length || !this.keyboard.isOpen()) {
      this.lenthList_return = [];
      return;
    }

    this.lenthList_return = this.lenth_list.filter(item => item.includes(this.tarevol));
  }

  addWidth(item: string) {
    this.tarewidth = item;
    this.WidthList_return = [];
  }

  removeFocusWidth() {
    this.keyboard.close();
  }

  searchWidth() {

    if (!this.tarewidth.length || !this.keyboard.isOpen()) {
      this.WidthList_return = [];
      return;
    }

    this.WidthList_return = this.Width_list.filter(item => item.includes(this.tarewidth));
  }


  addHeight(item: string) {
    this.tareheight = item;
    this.HeightList_return = [];
  }

  removeFocusHeight() {
    this.keyboard.close();
  }

  searchHeight() {

    if (!this.tareheight.length || !this.keyboard.isOpen()) {
      this.HeightList_return = [];
      return;
    }

    this.HeightList_return = this.Height_list.filter(item => item.includes(this.tareheight));
  }

}
