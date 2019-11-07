import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../_models";
import { environment } from '../../environments/environment';
import {Observable} from 'rxjs';
import {throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  getAll() {
    return this.http.get<User[]>('/api/users');
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/register`, user);
}

  confirmUserAccountRequest(token: string) {
    return this.http.get(`${environment.apiUrl}/verification-account?token=` + token);
  }



}




