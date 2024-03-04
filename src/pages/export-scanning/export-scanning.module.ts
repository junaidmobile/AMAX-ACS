import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExportScanningPage } from './export-scanning';

@NgModule({
  declarations: [
    ExportScanningPage,
  ],
  imports: [
    IonicPageModule.forChild(ExportScanningPage),
  ],
})
export class ExportScanningPageModule {}
