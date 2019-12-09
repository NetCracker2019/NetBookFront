import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Achievement} from '../_models/interface';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})
export class AchievementService {

  constructor(private http: HttpClient) {}

  addAchievement(achievement: Achievement): Observable<boolean> {
    // const body = {achievementId: null,
    // title: achievement.title,
    // description: achievement.description,
    // amount: achievement.amount,
    // image_path: achievement.image_path;
    // achvType: string;
    // achvRuleId: number;
    // authorName: string;
    // genreName: string;
    // favourite: boolean;
    // readBook: boolean;};
    console.log('Achievement: ', achievement);
    return this.http.post<boolean>(
      `${environment.apiUrl}/achievement-manager/add-achievement`, achievement);
  }
  postFile(fileToUpload: File, fileName: string): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('name', fileName);
    return this.http.post<boolean>(`${environment.apiUrl}/files/upload/`, formData);
  }
  getAllAchievement(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${environment.apiUrl}/achievement-manager/achievements`);
  }
}
