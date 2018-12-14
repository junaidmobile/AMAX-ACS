/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:45:12
 * @modify date 2018-07-16 11:45:12
 * @desc [description]
*/
import { Component, OnInit } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { MainMenu } from '../main-menu/main-menu';
import { HttpProvider } from '../../providers/http/http';
import { GlobalProvider } from '../../providers/global/global';
import { Constants } from '../../constant';
export class User { pi_strUserName: string; pi_strPassword: string; pi_blnIsPIN: boolean };
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage implements OnInit {
  user: User;
  isRemembered: boolean;
  loggedIn: true;
  appBuildConfig: any;

  constructor(public global: GlobalProvider, public http: HttpProvider, public alertCtrl: AlertController) {
    this.user = new User();
    this.appBuildConfig = this.global.appBuildConfig;
  }

  // when users login in through the app this function is called
  logIn() {
    if (this.isValidUser()) {
      this.user.pi_blnIsPIN = false;
      this.http.getHttpPostRequest(Constants.GMAX_Services.Login.validateUser, this.user).then((response) => {
        //console.log("Response : ", response);
        if (response != null && response != "") {
          if (this.isRemembered) {
            this.global.store('userName', this.user.pi_strUserName);
            this.global.store('password', this.user.pi_strPassword);
            this.global.store('isRemembered', "true");
          } else {
            this.global.store("userName", "");
            this.global.store("password", "");
            window.localStorage.removeItem("isRemembered");
          }
          this.global.store('isLogged', 'true');
          this.global.store('userResp', JSON.stringify(response['clsUser']));
          this.goToMenu(response['clsUser'].Organization[0])
        } else {
          this.user.pi_strPassword = '';
          this.global.showToast('Invalid username and password.')
        }
      }, (error) => { });
    } else if (this.isInValidDetails()) {
      this.global.showToast("Please fill all the details");
    } else { }
  }

  //check the input username and password is Valid
  isValidUser(): boolean {
    return this.user.pi_strUserName != null && this.user.pi_strUserName.trim() !== '' && this.user.pi_strPassword != null && this.user.pi_strPassword.trim() !== '';
  }

  //check if the input username and password is Invalid
  isInValidDetails(): boolean {
    return this.user.pi_strUserName == undefined || this.user.pi_strUserName.trim() == '' || this.user.pi_strPassword == undefined || this.user.pi_strPassword.trim() == '';
  }

  //On page Load
  ngOnInit() {
    if (window.localStorage.hasOwnProperty('isRemembered')) {
      this.isRemembered = this.global.convertToBoolean(this.global.get('isRemembered'));
      if (this.isRemembered) {
        this.user.pi_strUserName = this.global.get('userName');
        this.user.pi_strPassword = this.global.get('password')
      }
    } else {
      this.isRemembered = false;
    }
  }

  // check input Valid
  isInputValid(): boolean {
    if (this.user.pi_strPassword != undefined && this.user.pi_strUserName != undefined && this.user.pi_strPassword.trim() !== '' && this.user.pi_strUserName.trim() !== '')
      return false;
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

    (Organization.Type[0] == '1' || Organization.Type[0] == '3' || Organization.Type[0] == '4' || Organization.Type[0] == '7' || Organization.Type[0] == '8') ? this.gotoMenuPage('Agent') : (Organization.Type[0] == '2') ? this.gotoMenuPage('Airline') : this.global.showAlert('Invalid username and password.');

  }

  gotoMenuPage(LoginType) {
    this.global.store('LoginType', LoginType);
    this.global.setRootPage(MainMenu);
  }


}
