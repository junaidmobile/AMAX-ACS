import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constants } from '../../constant';
import { GlobalProvider } from '../../providers/global/global';
import { HttpProvider } from '../../providers/http/http';

export class postParm {  
  pi_strUserName: any;
  pi_strCustomsOfficerName: string = '';
  pi_strCustomsOfficerDesignation: string = '';

}

@IonicPage({ name: "main", segment: "app" })
@Component({
  selector: 'page-approved-gate-pass-count',
  templateUrl: 'approved-gate-pass-count.html',
})
export class ApprovedGatePassCountPage implements OnInit {
  title: String;
  _postParm: postParm;
  _strUserName: any;
  count;
  verifiedCount;
  totalCount;
  today;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public global: GlobalProvider, public http: HttpProvider) {
              
                this.title = "Approved GatePass Count";
                this._postParm = new postParm();
  }

  ngOnInit(){
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    console.log('check username: ', this._strUserName);
    this.today = Date.now();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApprovedGatePassCountPage');
    this.checkCounts();
    console.log('check username: ', this._strUserName);
    console.log('check officer: ', this.global.get('officer'));
    console.log('check desination: ', this.global.get('designation'));
  }

  ionviewDidEnter(){
    this.checkCounts();
    console.log('check officer: ', this.global.get('officer'));
    console.log('check desination: ', this.global.get('designation'));
  }

  checkCounts(){
    var countArr = [];
    this._postParm.pi_strUserName = this._strUserName;
    this._postParm.pi_strCustomsOfficerName = this.global.get('officer');
    this._postParm.pi_strCustomsOfficerDesignation = this.global.get('designation');

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetVerifiedGPCntByCustomsOfficer_HHT, this._postParm).then((response)=>{
      console.log('response: ', response['Root']['Output'][0]);
      console.log('response: ', response['Root']);
      this.count = response['Root']['Output'][0];
      countArr = this.count.split(',');

      console.log('first: ', countArr[0]);
      console.log('second: ', countArr[1]);

      this.verifiedCount = countArr[0];
      this.totalCount = countArr[1];
    })
  }

}
