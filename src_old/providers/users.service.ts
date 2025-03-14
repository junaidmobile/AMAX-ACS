import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { reject } from 'q';
import { HttpProvider } from '../providers/http/http';


@Injectable()
export class UsersService {

  data: any;
  constructor( public http: HttpClient) { }

  getUsers() {
    console.log("getUsers");

    let headers = { 'Content-Type': 'application/json' };

    return new Promise(resolve => {

      this.http.get('https://reqres.in/api/users', { headers }) 
        .subscribe(data => {

          this.data = data;
          // console.log(this.data.data);

          resolve(this.data.data);
        }, (err) => {
          console.log(err);
          reject(err);
        });
    });

  }
}
