import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Constants } from '../../constant';
/**
 * @name DateFilterPipe
 * @author Sachin Semlety
 * @description
 * This Filter is used for Date Filter in particular format for the app.
**/
@Pipe({
  name: 'dateFilter',
})
export class DateFilterPipe extends DatePipe implements PipeTransform {
  /**
   * It takes the date as a parameter value and converts it to the desired format of date.
   */
  transform(value: any, args?: any): any {
    return super.transform(value, Constants.DATE_TIME_FMT);
  }
}
