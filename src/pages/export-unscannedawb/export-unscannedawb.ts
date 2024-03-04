import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { HttpProvider } from '../../providers/http/http';

/**
 * Generated class for the ExportUnscannedawbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


export class unscannedawbParams {
  pi_strVTNo: any;
}

@IonicPage()
@Component({
  selector: 'page-export-unscannedawb',
  templateUrl: 'export-unscannedawb.html',
})
export class ExportUnscannedawbPage {


  title: String;
  strUserName: any;
  vctno: String = '';
  //UnscannedAWBList: Array<{ LD_LocationCode_C: string, LM_AreaCode_C: string, LM_ShedNo_C: string }>;
  usAWBParams: unscannedawbParams;
  hasRows: boolean = false;
  tableData: any;

  constructor(public http: HttpProvider, public navCtrl: NavController, public global: GlobalProvider, public navParams: NavParams) {
    this.usAWBParams = new unscannedawbParams();
  }

  ngOnInit() {

    this.strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ExportUnscannedawbPage');
    this.vctno = localStorage.getItem("VCT_ACC");
    this.getUnscannedAWBList();
  }

  // isDockedIn(): boolean {
   
  //     return this.hasRows;
  // }


  getUnscannedAWBList() {

    this.usAWBParams.pi_strVTNo = this.vctno;
    this.http.getHttpPostRequest("GetUnSacnnedTDGDetails_HHT", this.usAWBParams).then((response) => {
      // console.log(response['NewDataSet']);
      if (response.hasOwnProperty('NewDataSet')) {
        this.tableData = response['NewDataSet']['Table'];
        console.log(this.tableData);
        this.hasRows = true;
      }
      else
        this.global.showAlert(response['Root']['Output']);
      // this.UnscannedAWBList = response['NewDataSet']['Table'];

    }, (error) => {
      this.global.showAlert(error);
    });
  }


// OutMsg :  ['']
// SDA_HAWBNo_C : ['12']
// SDA_PackageCount_I :  ['5']
// SDA_SBNo_C: ['212']
// al_awbnumber_c : ['12523782640']
// al_rowid_i :  ['28917']

}
