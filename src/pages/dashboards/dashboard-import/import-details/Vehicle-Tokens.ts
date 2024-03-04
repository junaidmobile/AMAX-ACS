/**
 * @author Mohammaed Junaid
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:30
 * @modify date 2018-07-16 11:43:30
 * @desc [description]
*/
import { Component, OnInit, ViewChild, Input, DebugNode } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpProvider } from '../../../../providers/http/http';
import { Constants } from '../../../../constant';
import { TSPQRCode } from './TSP-QRCode';
import { VTBarcodeDetail } from './VT-Barcode-Detail';
import { DeliveryDocket } from './Delivery-Docket';
import { ActiveGatePasseslist } from './Active-GatePasses-list';
import { ActiveSingleGatePass } from './Active-Single-GatePass';
//export class TSPSerachClass { pi_chrSearchParam: any; pi_strTSPNo: any; pi_strMAWBNo: any; pi_strHAWBNo: any; po_strMessage: any; po_chrAlert: any }
export class GPerachClass { pi_strMAWBNo: any; pi_strUserName: any; po_strMessage: any; pi_chrSearchParam: any; pi_strTSPNo: any; pi_strHAWBNo: any; }
export class vtParm {
  pi_strUserName: any;
  pi_strClient: string;
}
@Component({
  selector: 'Vehicle-Tokens',
  templateUrl: 'Vehicle-Tokens.html'
})
export class VehicleTokens implements OnInit {

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
  _vtParm: vtParm;
  public items: any = [];
  @ViewChild('PrefixValue') PrefixInput;
  @ViewChild('MAWBNoValue') myInput;
  @Input("plus") plus: any;
  segment: string;
  aarry: Array<{ title2: string, details2: string, icon2: string, showDetails2: boolean }> = [];
  data: Array<{ title: string, icon: string, showDetails: boolean, selected: boolean }> = [];
  gpCount: any = '0';
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
  msg2: string = '';
  vtGPError: string = '';
  vtstaticbarcode: string = '';
  vtmsg: string = '';
  vtmsg2: string = '';
  Table1Data: any;
  private _activeVTs: any;
  oneGPMultiVT: any;
  allVtsWithGP: any =[];

  showNext = false;
  showDeselect = false;

  // IsMultipleGP: any;

  vtNullFlag: boolean;
  // data1: Array<{ details1: string, showDetails1: boolean }> = [];
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform) {

    this._allPrams = new GPerachClass();
    this._vtParm = new vtParm();
    this.appBuildConfig = this.global.appBuildConfig;
    // this.segment = "GPList";
    this.title = "Summary";
    // for (let i = 0; i < 10; i++) {
    //   this.aarry.push({
    //     title2: 'Title ' + i,
    //     details2: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    //     icon2: 'ios-add-circle-outline',
    //     showDetails2: false
    //   });
    // }

  }
  toggleDetails(data) {

    if (data.showDetails) {
      data.showDetails = false;

      data.icon = 'ios-list-outline';
      this.showNext = false;
      this.showDeselect = false;
      this.gatePassesListArr = [];
    } else {
      data.showDetails = true;
      data.icon = 'ios-list-outline';
      this.showNext = true;
      this.showDeselect = true;
    }
  }
  // toggleDetails2(arr) {

  //   if (arr.showDetails2) {
  //     arr.showDetails2 = false;
  //     arr.icon2 = 'ios-add-circle-outline';
  //   } else {
  //     arr.showDetails2 = true;
  //     arr.icon2 = 'ios-remove-circle-outline';
  //   }
  // }

  ionViewWillEnter() {
    console.log("ionViewWillEnter : ");
    for (var i = 0; i < this.data.length; i++) {
      this.data[i].selected = false;
    }
    this.gatePassesListArr = [];

    // this.GetImpActiveGPDetails_HHT(); // added by Himesh on 04/11/2020
    // this.GetImpActiveTokenDetails_HHT(); // added by Himesh on 04/11/2020

  }

  ionViewDidEnter(){
    //test for date time
    console.log('check date time here: ', new Date().toLocaleDateString());
    
    this.global.edTokenFlag = 0; //new on 02/03
    this.GetImpActiveGPDetails_HHT(); // added by Himesh on 11/11/2020
    this.GetImpActiveTokenDetails_HHT(); // added by Himesh on 11/11/2020

    if(this.global.showSegment == 2){
      this.segment = 'VTList'
      // this.GetImpActiveTokenDetails_HHT(); // new
    } else 
    this.segment = "GPList";
  }

  ionViewWillLeave(){
  //  this.segment = "GPList";
   this.global.showSegment = 1;
  }

  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    // this.GetImpActiveGPDetails_HHT();
    // this.GetImpActiveTokenDetails_HHT();
    localStorage.removeItem('ActiveGPList');
    console.log("ngOnInit : ");

  }

  GetImpActiveGPDetails_HHT() {
    this.data = [];

    this._allPrams.pi_strUserName = this._strUserName;
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetImpActiveGPDetails_HHT_List, this._allPrams).then((response) => {
      // console.log("GP Active : ", response);
      if (response != null && response != "") {

        this.MAWBList = response['NewDataSet']['Table'];
        this.HAWBList = response['NewDataSet']['Table1'];
        this.arrayObj = this.MAWBList;
        this.objectData = this.HAWBList;
        console.log("arrayObj", this.arrayObj);
        console.log("objectData", this.objectData);

        //  this.filterHAWBLst = this.MAWBList.concat(this.HAWBList);


        // this.filterHAWBLst = this.MAWBList.concat(this.HAWBList);
        // var d = this.filterHAWBLst.filter((item, pos) => this.filterHAWBLst.indexOf(item) === pos)

        // console.log(d) // d is [1, 2, 3, 101, 10]


        this.Data(this.MAWBList, this.HAWBList)

        this.gpCount = this.MAWBList.length;
        for (let i = 0; i < this.MAWBList.length; i++) {
          this.data.push({
            title: this.MAWBList[i]['MAWBNo'],
            icon: 'ios-list-outline',
            showDetails: false,
            selected: false
          });
        }
        // for (let j = 0; j < this.HAWBList.length; j++) {
        //   this.data1.push({
        //     details1: this.HAWBList[j]['HAWBNo'],
        //     showDetails1: false
        //   });
        // }

      } else {
        // this.global.showAlert("Record not found.");
        this.GPError = 'No Active Gate Passes';
        this.staticbarcode = '123456789';
        this.msg = 'Create Gate Passes to proceed with';
        this.msg2 = ' Vehicle Token generation.'
      }
    }, (error) => {
      console.log(error);
    });
  }


  Data(subjec: string[], compar: string[]) {
    this.filteredData = [];
    for (var i = 0; i < subjec.length; i++) {
      if (compar.indexOf(subjec[i]) === -1) {
        this.filteredData.push(subjec[i]);
      }
    }
    for (var j = 0; j < compar.length; j++) {
      if (subjec.indexOf(compar[j]) === -1) {
        // this.filteredData.push(compar[j]);
        //this.filterHAWBLst = this.objectData.filter(t => t.MAWbNo == Mno);
      }
    }

    console.log("Filtered data=========", this.filteredData);
    return this.filteredData;

  }


  onChange(hawbNo: string, mawbNo: string, isChecked: boolean) {

    console.log('HAWBS CLICKED !!!!!')
    // this.check = true;

    if (isChecked) {

      // console.log("hawbNo", hawbNo);
      // console.log("mawbNo", mawbNo);
      // console.log("isChecked", isChecked);
      this.filterHAWBLstArr = this.objectData.filter(t => t.HAWBNo == hawbNo);
      this.gatePassesListArr.push(this.filterHAWBLstArr);
      //  console.log("gatePassesListArr======", this.gatePassesListArr);
    } 
    else {
      
      for (var i = 0; i < this.gatePassesListArr.length; i++) {
        // if (this.gatePassesListArr[i].length != 0){
        for (var j = 0; j < this.gatePassesListArr[i].length; j++) {
          if (this.gatePassesListArr[i][j].HAWBNo == hawbNo) {

            this.gatePassesListArr.splice(i, 1);
          }
        }
      // }//if ends
    } 
      // console.log("gatePassesListArr in else 222======", this.gatePassesListArr);
    }
  }

  //   GetImpActiveTokenDetails_HHT() {
  // debugger
  //   //  this._vtParm.pi_chrClient = 'M';
  //     this._vtParm.pi_strUserName = this._strUserName;
  //     this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetImpActiveTokenDetails_HHT_List, this._vtParm).then((response) => {
  //       console.log("VT Active : ", response);
  //       if (response != null && response != "") {
  //         this.activeVTs = response['NewDataSet']['Table'];
  //         this.VTtData = response['NewDataSet']['Table1'];
  //         this.vtCount = this.activeVTs.length;
  //       } else {
  //         this.global.showAlert("Record not found.");
  //       }
  //     }, (error) => {
  //       console.log(error);
  //     });
  //   }


  // getMAWBNo(Mno: string) {

  //   this.filterHAWBLst = this.objectData.filter(t => t.MAWbNo == Mno);
  //   console.log("filterHAWBLst======", this.filterHAWBLst);
  // }


  GetImpActiveTokenDetails_HHT() {
    // this.vtCount = '';
    this._vtParm.pi_strClient = "M";
    this._vtParm.pi_strUserName = this._strUserName;
    console.log('check post ONE');
    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetImpActiveTokenDetails_HHT_List, this._vtParm).then((response) => {
      console.log('check post TWO');
      console.log('test for empty VTs here:' , response);

      if (response != null && response != "") {
        console.log("VT Active : ", response);
        if (response != null && response != "") {

          this.vtNullFlag = false; //new on 26/05

          this.activeVTs = response['NewDataSet']['Table']; //table1 from table

          // let arr = [this.activeVTs];
          //  let arr2 = arr.reduce((p,c)=> p.filter(e=> c.includes(e)));

           console.log('experimented array: ', this.activeVTs);

         this._activeVTs = this.activeVTs.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
          })

          // this.activeVTs = this.activeVTs.map(item=> item.TokenNo).filter((elem, index, self) =>
          //     self.indexOf(elem) === index)

          // console.log('***active vts***', this.activeVTs);

          this.activeVTs = this.activeVTs.filter(
            (elem, i, arr) => arr.findIndex(t => t.TokenNo[0] === elem.TokenNo[0]) === i
          );

          //above line of codes for duplicate VT's being generated when multiple GP's v/s Single VT by Himesh



          this.VTtData = response['NewDataSet']['Table1'];
          this.vtCount = this.activeVTs.length;
        } else {
          this.global.showAlert("Record not found.");
        }

      } if(response == null || response == ""){
          this.activeVTs == '';
          this.vtNullFlag = true;
      } //this if block is new, added on 26/05
      
      else {
        // this.global.showAlert("Record not found.");
        this.vtGPError = 'No Active Vehicle Token';
        this.vtstaticbarcode = '123456789';
        this.vtmsg = 'To view records in the list, select active Gate Pass';
        this.vtmsg2 = ' and create Vehicle Token.'
      }
    }, (error) => {
      console.log(error);
    });
  }


  checked(event: any, task: any) {
    console.log('MAWB CLICKED !!!!!!')
    // this.check = true;
    console.log("task", task);
    console.log("event", event);
    this.isChecked = event.checked;
    console.log("isChecked", this.isChecked);
    this.MAWBNo = task;

    // Here you can include your custom logic
    // to handle what happens when the checkbox
    // is checked or unchecked :)
    if (this.isChecked) {
      console.log(`The task ${task} is checked!`);
      this.filterHAWBLst = this.objectData.filter(t => t.MAWbNo == task);
      console.log("this.filterHAWBLst ", this.filterHAWBLst.length);
      for (var i = 0; i < this.filterHAWBLst.length; i++) {
        console.log("this.filterHAWBLst HAWBNo ", this.filterHAWBLst[i].HAWBNo);
        if (this.filterHAWBLst.length == 1) {
          this.gatePassesListArr.push(this.filterHAWBLst);

        }
        // this.check = false;
        this.check = true; //new
        if(this.filterHAWBLst.length > 1){ //new
        this.onChange(this.filterHAWBLst[i].HAWBNo,task,this.check); //new
        } //end if
      }
      if (this.filterHAWBLst[0].HAWBNo != "" && (this.filterHAWBLst.length == 1)) {
        console.log("Hawb number exists!!!!!!, I am from single");
        this.check = true;
      }
      // if (this.filterHAWBLst[0].HAWBNo != "" && (this.filterHAWBLst.length > 1)) {
      //   console.log("Multiple Hawb number exists!!!!!!");
      //   // this.check = true;
      //   if(this.isChecked){
      //   for(var t = 0; t < this.filterHAWBLst.length; t++){
      //     this.gatePassesListArr.push(this.filterHAWBLst[t]);
      //     if (this.gatePassesListArr.length > 1){
      //       // this.calculateForMultipleGPs(this.filterHAWBLst[t].HAWBNo);
      //       this.onChange(this.filterHAWBLst[t].HAWBNo,task,this.check);
      //     }
      //     this.check = false;
      //   } //for end
      // } //if ends
      // }
      // it was & (this.filterHAWBLst.length == 1). changes made by himesh on 22/12
      // for defect 157098

    } else {
      // console.log(`The task ${task} is unchecked!`);
      for (var i = 0; i < this.gatePassesListArr.length; i++) {
        for (var j = 0; j < this.gatePassesListArr[i].length; j++) {
          if (this.gatePassesListArr[i][j].MAWbNo == task) {

            this.gatePassesListArr.splice(i, 1);
            // this.check = true;
          }
        }
      }
      // console.log("gatePassesListArr in else 222======", this.gatePassesListArr);
    }
  }

  calculateForMultipleGPs(task){
    this.check = true;
    // this.filterHAWBLstArr = this.objectData.filter(t => t.HAWBNo == task );
    //   this.gatePassesListArr.push(this.filterHAWBLstArr);

    for (var i = 0; i < this.gatePassesListArr.length; i++) {
      for (var j = 0; j < this.gatePassesListArr[i].length; j++) {
        if (this.gatePassesListArr[i][j].HAWBNo == task) {

          this.gatePassesListArr.splice(i, 1);
        }
      }
    }
  }


  // filteredArray(arr: any, elem: any) {
  //   let newArr = [];
  //   // change code below this line
  //   for(var i=0; i<arr.length; i++){
  //     if(arr[i].indexOf(elem) === -1){
  //       for(var j=0; j<arr[i].length; j++){
  //         if(arr[i][j] === elem){
  //          // arr.splice((i,j), 1);
  //           arr[i].splice(j, 1);
  //         }
  //       }
  //       newArr.push(arr[i]);
  //       console.log("newArr 0000",newArr);
  //     }
  //     else{
  //       newArr.push(arr[i]);
  //       console.log("newArr 1111",newArr);
  //     }
  //   }
  //   // change code above this line
  //   return newArr;
  // }


  getHAWBNo(Hno: string) {
    console.log(`The HAB number===`, Hno)
  }

  goTOVTPQRCode(VNo, GPNo) {



    this.vehicleDetail = this.VTtData.filter(t => t.TokenNo == VNo);
    console.log('token no.: ',this.vehicleDetail);

    this.oneGPMultiVT = this.VTtData.filter(t => t.GPNo == GPNo);
    console.log('token no.: ',this.oneGPMultiVT);

    for (var i = 0; i < this.oneGPMultiVT.length; i++) {
      var vts = [];
      vts = this.oneGPMultiVT[i].TokenNo;
      this.allVtsWithGP.push(vts);
      console.log('check all data: ', this.allVtsWithGP);   
    }
    debugger
    this.Table1Data = this.VTtData
    localStorage.setItem('vehicleDetail', JSON.stringify(this.vehicleDetail));
    localStorage.setItem('ActiveVTData', JSON.stringify(this.vehicleDetail));
    localStorage.setItem("Table1Data", JSON.stringify(this.allVtsWithGP.toString()));

    //new on 04/03 for edit module
    localStorage.setItem('oneGPMultiVT', JSON.stringify(this.oneGPMultiVT));

    this.global.routePage(VTBarcodeDetail);
  }

  backToDelDoc() {
    // this.global.routePage(DeliveryDocket);
    this.navCtrl.remove(this.navCtrl.getActive().index - 1, 2); //added by Himesh on 03/11/2020
  }

  deSelectAll() {
    for (var i = 0; i < this.data.length; i++) {
      this.data[i].selected = false;
    }
    this.gatePassesListArr = [];
  }

  Next() {

    console.log('length of gate pass list array: ', this.gatePassesListArr.length);
    localStorage.removeItem('ActiveGPList');
    localStorage.setItem('ActiveGPList', JSON.stringify(this.gatePassesListArr));
    // if (this.gatePassesListArr.length > 0) {
    if (this.gatePassesListArr.length == 1) {
      this.global.routePage(ActiveSingleGatePass);
    } else if (this.gatePassesListArr.length > 1)
      this.global.routePage(ActiveGatePasseslist);
    // } else {

    //  this.global.showAlert("Please select atleast one Gate Pass.");
    // }
  }
}

