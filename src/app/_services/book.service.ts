import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';


import {map} from "rxjs/operators";


import {Announcement, Book, NewModelBook, Review} from '../_models/interface';


@Injectable({
  providedIn: 'root'
})
export class BookService {
  @Output() searchEvent = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  search(title: string) {
    this.searchEvent.emit(title);
  }


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
  getNewBookList(): Observable<NewModelBook[]> {
    console.log('Books in service: ', this.http.get<NewModelBook[]>(`${environment.apiUrl}/home/view-books`));
    return this.http.get<NewModelBook[]>(`${environment.apiUrl}/home/view-books`);
  }

  addBook(book: Book) {
    const body = {title: book.title, author: book.author, genre: book.genre, imagePath: book.imagePath,
      release_date: book.release_date, language: book.language, pages: book.pages, description: book.description};
    return this.http.post(`${environment.apiUrl}/book-service/home/books/addBook`, body);
  }

  searchBookByTitle(title: string): Observable<NewModelBook[]> {
    return this.http.get<NewModelBook[]>(`${environment.apiUrl}/home/find-books?title=${title}`);
  }
  getBookReviews(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/home/search/${id}`);
  }
  getBookById(id: number): Observable<NewModelBook> {
    return this.http.get<NewModelBook>(`${environment.apiUrl}/home/find-book-by-id?id=${id}`);
  }
}
