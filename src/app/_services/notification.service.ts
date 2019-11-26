import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Notification} from "../_models/interface";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient) {
  }

  getAllNotReadNotificationsForUser(userId: number) {
    return this.http.get<Notification[]>(`${environment.apiUrl}/notifications/${userId}`);
  }
}



