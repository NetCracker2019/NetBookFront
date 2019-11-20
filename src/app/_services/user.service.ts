import { Injectable } from '@angular/core';

import {HttpClient, HttpParams} from '@angular/common/http';

import {User, Achievement, ShortBookDescription} from '../_models/interface';
import {AuthenticationService} from '../_services/authentication.service';

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
    return this.http.post<Map<string, string>>(`${environment.apiUrl}/user-service/register/user`, user);
  }
  registerAdmin(user: User, token: string) {
    user.role = "ROLE_ADMIN";
    return this.http.post<Map<string, string>>(
      `${environment.apiUrl}/user-service/register/admin?token=${token}`, user );

  }

  confirmUserAccountRequest(token: string) {
    return this.http.put<Map<string, string>>(
      `${environment.apiUrl}/user-service/verification/user?token=${token}`, token);//
  }

  //change password 
  recoveryPass(token: string, pass: string) {
    return this.http.put<Map<string, string>>(
      `${environment.apiUrl}/user-service/change/password?token=${token}&pass=${pass}`, token);//
  }
  //request for recovery password
  recoveryPassRequest(email: string) {
    return this.http.post<Map<string, string>>(
      `${environment.apiUrl}/user-service/recovery/password?email=${email}`, email);//
  }

  getUser(login: string) {
    return this.http.get<User>(`${environment.apiUrl}/profile/${login}`);
  }

  getAchievement(login: string) {
    return this.http.get<Achievement>(`${environment.apiUrl}/profile/${login}/get-achievement`);
  }

  getFriends(login: string, cnt: number, offset: number) {
    return this.http.get< User[]>(`${environment.apiUrl}/profile/${login}/friends?cnt=${cnt}&offset=${offset}`);
  }
  getFavouriteBooks(login: string, cnt: number, offset: number) {
    return this.http.get<ShortBookDescription[]>(
      `${environment.apiUrl}/profile/${login}/favourite-books?cnt=${cnt}&offset=${offset}`);
  }
  getReadingBooks(login: string, cnt: number, offset: number) {
    return this.http.get<ShortBookDescription[]>(
      `${environment.apiUrl}/profile/${login}/reading-books?cnt=${cnt}&offset=${offset}`);
  }
  getReadBooks(login: string, cnt: number, offset: number) {
    return this.http.get<ShortBookDescription[]>(
      `${environment.apiUrl}/profile/${login}/read-books?cnt=${cnt}&offset=${offset}`);
  }

  edit(user: User) {
    return this.http.put<User>(`${environment.apiUrl}/profile/${user.username}/edit`, user );
  }

  getPersons(login: string, sought: string, where: string, cnt: number, offset: number) {
    return this.http.get<User[]>(`${environment.apiUrl}/find-persons/${login}?sought=${sought}&where=${
      where}&cnt=${cnt}&offset=${offset}`);
  }


}




