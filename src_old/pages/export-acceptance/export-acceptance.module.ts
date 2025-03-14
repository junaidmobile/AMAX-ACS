import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExportAcceptancePage } from './export-acceptance';

@NgModule({
  declarations: [
    ExportAcceptancePage,
  ],
  imports: [
    IonicPageModule.forChild(ExportAcceptancePage),
  ],
})
export class ExportAcceptancePageModule {}
