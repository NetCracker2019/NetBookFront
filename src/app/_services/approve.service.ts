import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Announcement, Book, ViewAnnouncement} from '../_models/interface';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class ApproveService {


  constructor(private http: HttpClient) { }


  getUnApproveBookList(): Observable<ViewAnnouncement[]> {
    return this.http.get<ViewAnnouncement[]>(`${environment.apiUrl}/approve-service/books`);
  }



  confirmAnnouncement(book: ViewAnnouncement) {
    console.log(book);
    const body = {title: book.title, authors: book.authors, genres: book.genres, imagePath: book.imagePath,
      release_date: book.releaseDate, announcmentId: book.announcmentId, description: book.description};
    console.log(body);
    return this.http.post(`${environment.apiUrl}/approve-service/confirm-announcement`, body);
  }

  cancelAnnouncement(book: ViewAnnouncement) {
    const body = {title: book.title, authors: book.authors, genres: book.genres, imagePath: book.imagePath,
      release_date: book.releaseDate, announcmentId: book.announcmentId, description: book.description};
    return this.http.post(`${environment.apiUrl}/approve-service/cancel-announcement`, body);
  }

  // cancel(book): Observable<Book[]> {
  //   return this.http.put<Book[]>(`${environment.apiUrl}/approve/confirm?bookId=`, book.announcmentId);
  // }
}
