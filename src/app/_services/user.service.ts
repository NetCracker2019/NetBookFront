import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../_models/interface';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  getAll() {
    return this.http.get<User[]>('/api/users');
  }

  register(user: User) {
    const body = {login: user.firstName, password: user.password, email: user.username, name: user.lastName, role: 'ROLE_CLIENT'};
    console.log(body);
    return this.http.post(`${environment.apiUrl}/register`, body);
  }

  registerAdmin(user: User, token: string) {
    const body = {login: user.firstName, password: user.password, email: user.username, name: user.lastName, role: 'ROLE_ADMIN'};
    return this.http.post(`${environment.apiUrl}/verification-admin?token=` + token, body );
  }

  confirmUserAccountRequest(token: string) {
    return this.http.get(`${environment.apiUrl}/verification-account?token=` + token);
  }

  recoverypass(token: string, pass: string) {
    return this.http.get(`${environment.apiUrl}/recovery-pass?token=` + token + `&pass=` + pass);
  }

  recoverypassrequest(email: string) {
    return this.http.get(`${environment.apiUrl}/recovery-pass-request?email=` + email);
  }



}




