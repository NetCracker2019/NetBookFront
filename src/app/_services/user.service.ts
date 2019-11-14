import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
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
    return this.http.get<User[]>('/user-service/users');
  }

  register(user: User) {
    const body = {login: user.firstName, password: user.password, email: user.username, name: user.lastName, role: "ROLE_CLIENT"};
    return this.http.post(`${environment.apiUrl}/user-service/register/user`, body);
  }

  registerAdmin(user: User, token: string) {
    const body = {login: user.firstName, password: user.password, email: user.username, name: user.lastName, role: "ROLE_ADMIN"};
    return this.http.post(`${environment.apiUrl}/user-service/register/admin?token=` + token, body );
  }

  confirmUserAccountRequest(token: string) {
    return this.http.get(`${environment.apiUrl}/user-service/verification/user?token=` + token);
  }

  recoveryPass(token: string, pass: string) {
    return this.http.get(`${environment.apiUrl}/user-service/change/password?token=` + token + `&pass=` + pass);
  }

  recoveryPassRequest(email: string) {
    return this.http.get(`${environment.apiUrl}/user-service/recovery/password?email=` + email);
  }



}




