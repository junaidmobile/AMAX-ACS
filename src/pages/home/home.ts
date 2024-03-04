import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { MainMenu } from '../main-menu/main-menu';
import { CscMainMenuPage } from '../csc-main-menu/csc-main-menu';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  title: String;
  DOStat: any;
  cscHide: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public global: GlobalProvider) {
    this.title = "Home"
    this.DOStat = JSON.parse(this.global.get('userResp')).Organization[0].Type[0];

    if (this.DOStat == 3 || this.DOStat == 5) { // Kale staff ID
      this.cscHide = false;
    } else if (this.DOStat == 4 || this.DOStat == 1) { // Mial staff
      this.cscHide = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    console.log('check stored officer: ', this.global.get('officer'));
    console.log('check stored officer designation: ', this.global.get('designation'));
  }

  routePage(page) {
    if (page == "MainMenu") {
      this.global.routePage(MainMenu)
    } else {
      this.global.routePage(CscMainMenuPage);
    }

  }

}
