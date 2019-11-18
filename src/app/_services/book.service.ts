import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

import {Announcement, Book} from '../_models/interface';
import {map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }



  // getAnnouncementList(page: number, booksPerPage: number): Observable<Page> {
  //   let books = this.http.get<Announcement[]>(`${environment.apiUrl}/book-service/home/announcement`);
  //   return this.getPageItems(books, page, booksPerPage);
  // }
  //
  // private getPageItems(books: Observable<Announcement[]>, page: number, booksPerPage: number): Observable<Page> {
  //   return books.pipe(
  //     map(b => {
  //       let startIndex = booksPerPage * (page - 1);
  //       return new Page(b.length, b.slice(startIndex, startIndex + booksPerPage));
  //     })
  //   );
  // }
  getAnnouncementListPeace(page: number, booksPerPage: number): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${environment.apiUrl}/book-service/home/announcementListPeace?page=` + page
      + `&booksPerPage=` + booksPerPage);
  }
  getAmountOfAnnouncement() {
    return this.http.get(`${environment.apiUrl}/book-service/home/amountOfAnnouncement`);
  }
  getBookList(): Observable<Book[]> {
    return this.http.get<Book[]>(`${environment.apiUrl}/book-service/home/books`);
  }

  addBook(book: Book) {
    const body = {title: book.title, like: book.like, imagePath: book.imagePath,
      release_date: book.release_date, language: book.language, pages: book.pages, approved: book.approved};
    return this.http.post(`${environment.apiUrl}/book-service/home/books/addBook`, body);
  }
}


