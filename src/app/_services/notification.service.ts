import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Notification, User} from "../_models/interface";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient) {}


  /*getPersons(login: string, sought: string, where: string, cnt: number, offset: number) {
    return this.http.get<User[]>(`${environment.apiUrl}/find-persons/${login}?sought=${sought}&where=${
      where}&cnt=${cnt}&offset=${offset}`);
  }*/
  getAllNotifications(cnt: number, offset: number): Observable<Notification[]>{
    return this.http.get<Notification[]>(`${environment.apiUrl}/notifications?cnt=${cnt}&offset=${offset}`);
  }

  markAllAsRead(userId:number){
    return this.http.put(`${environment.apiUrl}/notifications/mark`,userId);

  }
  markNotifAsReadByNotifId(notification:Notification){
    return this.http.put(`${environment.apiUrl}/notifications/mark-one`,notification);
  }

  getCountForNotifs(){
    return this.http.get<number>(`${environment.apiUrl}/notifications/count`);
  }

  deleteAllNotificationsByUserId(userId:number){
    return this.http.delete(`${environment.apiUrl}/notifications/delete-all`);
  }

}
