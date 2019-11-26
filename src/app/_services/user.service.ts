import { Injectable } from '@angular/core';

import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';

import {User, Achievement, ShortBookDescription, Message} from '../_models/interface';
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
  getFavouriteBooks(login: string, sought: string, cnt: number, offset: number) {
    return this.http.get<ShortBookDescription[]>(
      `${environment.apiUrl}/profile/${login}/favourite-books?cnt=${cnt}&offset=${offset}&sought=${sought}`);
  }
  getReadingBooks(login: string, sought: string, cnt: number, offset: number) {
    return this.http.get<ShortBookDescription[]>(
      `${environment.apiUrl}/profile/${login}/reading-books?cnt=${cnt}&offset=${offset}&sought=${sought}`);
  }
  getReadBooks(login: string, sought: string, cnt: number, offset: number) {
    return this.http.get<ShortBookDescription[]>(
      `${environment.apiUrl}/profile/${login}/read-books?cnt=${cnt}&offset=${offset}&sought=${sought}`);
  }

  edit(user: User) {
    return this.http.put<User>(`${environment.apiUrl}/profile/${user.username}/edit`, user );
  }

  getPersons(login: string, sought: string, where: string, cnt: number, offset: number) {
    return this.http.get<User[]>(`${environment.apiUrl}/find-persons/${login}?sought=${sought}&where=${
      where}&cnt=${cnt}&offset=${offset}`);
  }
  getCountOfPersons(login: string, sought: string, where: string) {
    return this.http.get<number>(
      `${environment.apiUrl}/find-persons/${login}/collection-size?sought=${sought}&where=${where}`);
  }
  addFriend(ownLogin:string, friendLogin: string) {
    return this.http.post<void>(
      `${environment.apiUrl}/profile/add-friend/${ownLogin}/${friendLogin}`, friendLogin);
  }
  isFriend(ownLogin:string, friendLogin: string) {
    return this.http.get<boolean>(
      `${environment.apiUrl}/profile/is-friend/${ownLogin}/${friendLogin}`);
  }
  deleteFriend(ownLogin:string, friendLogin: string) {
    return this.http.delete<void>(
      `${environment.apiUrl}/profile/delete-friend/${ownLogin}/${friendLogin}`);
  }
  updateUserBookList(login:string, bookId: number, reading: boolean, favourite: boolean, remove: boolean) {
    return this.http.put<void>(
      `${environment.apiUrl}/profile/${login}/${bookId}?reading=${reading}&favourite=${favourite}&remove=${remove}`, reading);
  }

  postFile(fileToUpload: File, fileName: string): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('name', fileName);
    return this.http.post<boolean>(`${environment.apiUrl}/files/upload/`, formData);
  }
}




