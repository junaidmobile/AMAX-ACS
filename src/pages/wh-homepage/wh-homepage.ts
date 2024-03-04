import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Constants } from '../../constant';
import { GlobalProvider } from '../../providers/global/global';
import { ExportAcceptancePage } from '../export-acceptance/export-acceptance';
import { ExportBinningPage } from '../export-binning/export-binning';
import { ExportCartingchallanPage } from '../export-cartingchallan/export-cartingchallan';
import { ExportScanningPage } from '../export-scanning/export-scanning';
import { ExportScreeningPage } from '../export-screening/export-screening';
/**
 * Generated class for the WhHomepagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wh-homepage',
  templateUrl: 'wh-homepage.html',
})
export class WhHomepagePage implements OnInit {
  ExpDashImages: any;
  title: String;
  @ViewChild('mySlider') slider: Slides;
  selectedSegment: string;
  slides: any;
  exportSideString: string;

  constructor(public navCtrl: NavController,public global: GlobalProvider,  public navParams: NavParams) {
    this.title = "Landside";
    this.selectedSegment = 'Exports';
    this.exportSideString = '';
    // this.checkLoginType();
  }

  ngOnInit() {
    this.ExpDashImages = Constants.expDashboardImages;
    //console.log("ExpDashImages : ", this.ExpDashImages)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WhHomepagePage');
  }

  onSegmentChanged(segmentButton) {
    console.log("Segment changed to", segmentButton.value);
    this.selectedSegment = segmentButton.value.toString();
    this.exportSideString = '';
    // const selectedIndex = this.slides.findIndex((slide) => {
    //   return slide.id === segmentButton.value;
    // });
    // this.slider.slideTo(selectedIndex);
  }

  onSlideChanged(slider) {
    console.log('Slide changed');
    // const currentSlide = this.slides[slider.getActiveIndex()];
    // if (currentSlide != undefined) {
    //   this.selectedSegment = currentSlide.id;
    // }
  }

  goToBinning() {
    this.global.routePage(ExportBinningPage);
  }

  goToAcceptance() {
    this.global.routePage(ExportAcceptancePage);
  }

  goToScanning() {
    this.global.routePage(ExportScanningPage);
  }
  
  goToScreening() {
    this.global.routePage(ExportScreeningPage);
  }

  goToCartingORder() {
    this.global.routePage(ExportCartingchallanPage);
  }

  
  goToExportMenu(val) {
    if (val == 1)
      this.exportSideString = "Landside";
    else if (val == 0) {

      this.exportSideString = "";
    }
    else
      this.exportSideString = "Airside";
  }

}
