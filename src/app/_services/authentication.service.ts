import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import {User} from '../_models/interface';

const headers = new HttpHeaders({'Content-Type': 'application/json'});

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    console.log(this.currentUserSubject.value);
    console.log(this.currentUserSubject);
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }


  login(username: string, password: string) {
    const body = {login: username, password};
    return this.http.post<any>(`${environment.apiUrl}/user-service/signin`, body , {headers})

      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logoutuser() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
