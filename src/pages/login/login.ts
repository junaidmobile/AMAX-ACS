/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:45:12
 * @modify date 2018-07-16 11:45:12
 * @desc [description]
*/
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { MainMenu } from '../main-menu/main-menu';
import { HttpProvider } from '../../providers/http/http';
import { GlobalProvider } from '../../providers/global/global';
import { Constants } from '../../constant';
import { HomePage } from '../home/home';
import { WhHomepagePage } from '../wh-homepage/wh-homepage';
import { TSPSuccessMessage } from '../dashboards/dashboard-import/import-details/TSP-Success-Message';
export class User { pi_strUserName: string; pi_strPassword: string; pi_blnIsPIN: boolean };
import { ImportScanPage } from '../import-scan/import-scan';
import { RevokeGatePassPage } from '../revoke-gate-pass/revoke-gate-pass';
import { VehicleTrackingImport } from '../dashboards/dashboard-import/import-details/Vehicle-tracking-import';



export class postParm {
  pi_strUserName: any;
  pi_strCustomsOfficerName: string = '';
  pi_strCustomsOfficerDesignation: string = '';

}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {//implements OnInit {//implements AfterViewChecked {//
  user: User;
  isRemembered: boolean;
  loggedIn: true;
  appBuildConfig: any;
  versionCode: any;

  showAdditional: boolean = false;
  organizationType: any = '';
  officerName: any = '';
  designation: any = '';

  checkOff;
  checkDesignation;
  loginClicked: boolean = false;

  appVersion;
  _postParm: postParm;
  showPwd;
  @ViewChild('PrefixValue') PrefixInput; //new for ion input issue };
  needsFocus: boolean;



  source: string;

  constructor(public global: GlobalProvider, public http: HttpProvider, public alertCtrl: AlertController, private _changeDetectionRef: ChangeDetectorRef) {
    this.user = new User();
    this.appBuildConfig = this.global.appBuildConfig;
    this._postParm = new postParm();

    this.checkOff = this.global.get('officer');
    this.checkDesignation = this.global.get('designation');
  }

  tapOut() {
    console.log('******************  tapOut called here');
    if (this.user.pi_strUserName == '') {
      this.showAdditional = false;
    }

    if (this.isValidUser()) {
      this.user.pi_blnIsPIN = false;
      this.http.getHttpPostRequest(Constants.GMAX_Services.Login.validateUser, this.user).then((response) => {
        console.log('check tapout response: ', response);
        // if(response != 'undefined'){
        // console.log(response['clsUser'].Organization[0]['Type']);
        // }
        if (typeof (response) != 'undefined') {
          this.organizationType = response['clsUser'].Organization[0]['Type'];
        }

        if (this.organizationType == '5') { //20/08
          this.showAdditional = true;
        }
        if (this.organizationType != '5') {
          // this.logIn();
          this.showAdditional = false;
          this.global.store('userOffType', '');
        }

      })
    }
  }

  // logIn() {
  //   this.global.setRootPage(WhHomepagePage);
  // }

  // when users login in through the app this function is called
  logIn() {
    console.log('******************  logIn called here');

    // console.log('check offType: ', this.global.get('offType'));
    // console.log('check user offType: ', this.global.get('userOffType'));

    // main login was from here
    if (this.global.get('userOffType') == '5') {
      this.showAdditional = true;
    }

    if (this.isValidUser()) {
      this.user.pi_blnIsPIN = false;
      this.http.getHttpPostRequest(Constants.GMAX_Services.Login.validateUser, this.user).then((response) => {
        console.log("Response 123 : ", response);
        if (response != null && response != "") {
          this.organizationType = response['clsUser'].Organization[0]['Type'];
          console.log('check org type: ', this.organizationType);
          debugger
          if (this.isRemembered) {
            this.global.store('userName', this.user.pi_strUserName);
            this.global.store('password', this.user.pi_strPassword);
            this.global.store('isRemembered', "true");
            this.global.store('userOffType', response['clsUser'].Organization[0]['Type']); // new for CR
            // this.organizationType = response['clsUser'].Organization[0]['Type']; //newwww

          } else {
            this.global.store("userName", "");
            this.global.store("password", "");
            window.localStorage.removeItem("isRemembered");
            // this.organizationType = response['clsUser'].Organization[0]['Type']; //newwww
          }
          this.global.store('isLogged', 'true');
          this.global.store('userResp', JSON.stringify(response['clsUser']));

          //junaid 16052024
         // this.global.store('userRole', response['clsUser'].FName[0]);
          
          //junaid 07032024
           var permitFlag = response['clsUser']['RolePermissionCollection'][0]['clsRolePermissions'][0].RoleName
           this.global.store('userRole', permitFlag);
          // if (permitFlag == 'true') {
          //   this.global.store('userRole', 'MainGateIn');
          // }
          //  this.global.store('userRole', response['clsUser'].FName);
          // this.goToMenu(response['clsUser'].Organization[0]);

          // console.log(JSON.parse(this.global.get('userResp')).RolePermissionCollection[0]);
          // console.log(JSON.parse(this.global.get('userResp')).RolePermissionCollection[0].clsRolePermissions[0]);
          // console.log(JSON.parse(this.global.get('userResp')).RolePermissionCollection[0].clsRolePermissions[1].PermissionDesc[0]);
          // console.log(JSON.parse(this.global.get('userResp')).Organization[0].Type[0]);

          if (this.organizationType != '5') {
            this.goToMenu(response['clsUser'].Organization[0]);
            this.global.store('userOffType', '');
          } //newwww if


          // this.organizationType = response['clsUser'].Organization[0]['Type']; //new from here
          if (this.organizationType == '5') {
            this.showAdditional = true;
            this.global.store('officer', this.officerName);
            this.global.store('designation', this.designation);
            this.global.store('offType', this.organizationType);
            this.storeOfficerData(); //new api to store officer data at backend
            // this.goToMenu(response['clsUser'].Organization[0]);
          } //new ends here

          if (this.organizationType == '5' && this.isValidUserTap()) {
            this.goToMenu(response['clsUser'].Organization[0]);
          }


        } else {
          this.user.pi_strPassword = '';
          this.global.showToast('Invalid username and password.')
        }
      }, (error) => { });
    } else if (this.isInValidDetails()) {
      this.global.showToast("Please fill all the details");
    }
    else { }
    // }
  }

  nextPage() {

    // this.global.setRootPage(MainMenu);
  }

  //check the input username and password is Valid
  isValidUser(): boolean {
    console.log('******************  isValidUser called here');
    return this.user.pi_strUserName != null && this.user.pi_strUserName.trim() !== '' && this.user.pi_strPassword != null && this.user.pi_strPassword.trim() !== '';
  }

  isValidUserTap(): boolean {
    console.log('******************  isValidUserTap called here');
    if (this.showAdditional) {
      return this.officerName != null && this.officerName.trim() !== '' && this.designation != null && this.designation.trim() !== '';
    } else
      return true;

  }

  //check if the input username and password is Invalid
  isInValidDetails(): boolean {
    console.log('******************  isInValidDetails called here');
    return this.user.pi_strUserName == undefined || this.user.pi_strUserName.trim() == '' || this.user.pi_strPassword == undefined || this.user.pi_strPassword.trim() == '';
  }

  checkAppVersion() {


    console.log('******************  checkAppVersion called here');
    //this.PrefixInput.setFocus();
    this.http.getHttpPostRequest(Constants.GMAX_Services.Login.GetAppVersion).then((response) => {
      console.log('App version check: ', response);
      this.versionCode = response['Root']['Output'];
      console.log('version code: ', this.versionCode);

      if (this.global.appVersion < this.versionCode) {
        console.log('app does not matches');
        this.global.showAlert('Please update your app, else some functions may not work.');
      } else {
        console.log('this is latest application');


        // console.log('setting focus on username in ionViewLoaded');
        // setTimeout(() => {
        //   this.PrefixInput.setFocus();
        // },150);


        //document.getElementById('username').focus();



        //   this.setFocusOnInput();
        //  this.PrefixInput.setFocus();
      }
    });
    // this.PrefixInput.setFocus();
    // this.global.setRootPage(VehicleTrackingImport);

  }

  //new for ion input isse
  ionViewDidLoad() {
    console.log('******************  ionViewDidLoad called here');
    // setTimeout(() => {
    //   this.PrefixInput.setFocus();
    // }, 150)

    // console.log('setting focus on username in ionViewDidLoad');

    // //     document.getElementById('username').focus();
    // //this.PrefixInput.setFocus();

    // setTimeout(() => {
    //   this.PrefixInput.setFocus();
    // }, 200)

    // this.checkAppVersion();
  }

  ionViewLoaded() {
    console.log('******************  ionViewLoaded called here');
    // console.log('setting focus on username in ionViewLoaded');
    // setTimeout(() => {
    //   this.PrefixInput.setFocus();
    // },150);

  }



  //On page Load
  ngOnInit() {
    console.log('******************  ngOnInit called here');
    if (window.localStorage.hasOwnProperty('isRemembered')) {
      this.isRemembered = this.global.convertToBoolean(this.global.get('isRemembered'));
      if (this.isRemembered) {
        this.user.pi_strUserName = this.global.get('userName');
        this.user.pi_strPassword = this.global.get('password')
      }
    } else {
      this.isRemembered = false;
    }

    this.checkAppVersion();



  }

  ngAfterViewInit() {
    console.log('******************  ngAfterViewInit called here');
    //   setTimeout(() => {
    //      this.PrefixInput.setFocus();
    // }, 400);
  }

  // check input Valid
  isInputValid(): boolean {
    console.log('******************  isInputValid called here');
    if (this.user.pi_strPassword != undefined && this.user.pi_strUserName != undefined
      && this.user.pi_strPassword.trim() !== '' && this.user.pi_strUserName.trim() !== ''
      // && this.showAdditional == true && (this.officerName.trim() == '' || this.designation.trim() == '')
    )
      return false;
    // else if(){
    //   return false;
    // }
    else
      return true;
  }

  //to Exit the App
  confirmExit() {
    this.global.ExitApp();
  }

  // Based on Agent/Airline Login Type the MenuPage is Opened
  goToMenu(Organization) {
    /* 1. Agent Login Type = 1,3,4,7,8.
       2. Airline Login Type = 2. */

    (Organization.Type[0] == '1' || Organization.Type[0] == '3' || Organization.Type[0] == '4' || Organization.Type[0] == '7' || Organization.Type[0] == '8' || Organization.Type[0] == '5') ? this.gotoMenuPage('Agent') : (Organization.Type[0] == '2') ? this.gotoMenuPage('Airline') : this.global.showAlert('Invalid username and password.');

  }

  gotoMenuPage(LoginType) {
    this.global.store('LoginType', LoginType);
    if (LoginType == "Agent") { this.global.setRootPage(HomePage); } else if (LoginType == "Airline") {
      this.global.setRootPage(MainMenu);
    } else { }
  }

  setSource(isTrusted: boolean) {
    console.log('******************  setSource called here');
    this.source = isTrusted ? 'login' : 'other'

    console.log('check patel: ', this.source);
  }


  loginCl(ev: any) {
    console.log('******************  loginCl called here');
    console.log('hiiiiiii', ev);
  }


  storeOfficerData() {
    this._postParm.pi_strUserName = this.user.pi_strUserName;
    this._postParm.pi_strCustomsOfficerName = this.officerName;
    this._postParm.pi_strCustomsOfficerDesignation = this.designation;

    this.http.getHttpPostRequest(Constants.GMAX_Services.Login.SaveCustomsLoginDetails_HHT, this._postParm).then((response) => {
      console.log('check officer api res: ', response);
    })


  }

  isOfficerDataValid(): boolean {
    if (this.showAdditional) {
      this.global.showAlert('Please enter Officer Name / Designation');
      return this.officerName == undefined || this.officerName.trim() == '' || this.designation == undefined || this.designation.trim() == '';
    }
  }

  checkOfficer() {
    if (this.officerName == '' || this.designation == '') {
      this.global.showAlert('Please enter officer details');
    }
  }

  ionViewDidEnter() {
    console.log('******************  ionViewDidEnter called here');
    // console.log("document.activeElement");
    // console.log(document.activeElement.id.toString);

    //     setTimeout(() => {
    //       this.PrefixInput.setFocus();
    // }, 1000);
    //this.needsFocus = true;


    // console.log('setting focus on ionViewDidEnter');
    // this.needsFocus = true;
  }

  //  public ngAfterViewChecked(): void {
  //   console.log('******************  ngAfterViewChecked called here');
  //   this.PrefixInput.setFocus();
  //     //  if (this.PrefixInput.nee) {
  //     //   console.log('Needs focus: focus');
  //     //      this.needsFocus = false;
  //     //    this.PrefixInput.setFocus();
  //     //      this._changeDetectionRef.detectChanges();
  //     //  }
  //  }

  public ngAfterViewChecked(): void {
    // if (this.needsFocus) {
    //     this.needsFocus = false;
    //     this.PrefixInput.setFocus();
    //     this._changeDetectionRef.detectChanges();
    // }
  }


  // testMethod() {

  //   this.global.setRootPage(TSPSuccessMessage);


  // }


  // scanP(){
  //   this.global.setRootPage(ImportScanPage);
  // }
}
