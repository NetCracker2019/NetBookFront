import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Announcement, Kniga} from '../_models/interface';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }


  getAnnouncmentList(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${environment.apiUrl}/home/announcement`);
  }

  getBookList(): Observable<Kniga[]> {
    return this.http.get<Kniga[]>(`${environment.apiUrl}/home/books`);
  }

  addBook(kniga: Kniga) {
    const body = {idbook: kniga.idbook, title: kniga.title, like: kniga.like, imagePath: kniga.imagePath,
      release_date: kniga.release_date, language: kniga.language, pagess: kniga.pagess, approved: kniga.approved};
    return this.http.post(`${environment.apiUrl}/home/books/addBook`, body);
  }
}


