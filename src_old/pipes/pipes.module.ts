/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-19 04:31:35
 * @modify date 2018-07-19 04:31:35
 * @desc [description]
*/
import { NgModule } from '@angular/core';
import { DateFilterPipe } from './date-filter/date-filter';
import { SanitizeHtmlPipe } from './sanitize-html/sanitize-html';
@NgModule({
	declarations: [DateFilterPipe,
		SanitizeHtmlPipe],
	imports: [],
	exports: [DateFilterPipe,
		SanitizeHtmlPipe]
})
export class PipesModule { }