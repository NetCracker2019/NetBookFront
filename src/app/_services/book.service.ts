import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';


import {map} from "rxjs/operators";


import {Announcement, Book, Data, Genre, NewModelBook, Review} from '../_models/interface';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private titleSource = new BehaviorSubject<string>('');
  currentTitle = this.titleSource.asObservable();

  constructor(private http: HttpClient) {}

  changeTitle(title: string) {
    this.titleSource.next(title);
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
  getGenreList(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${environment.apiUrl}/book-service/genres`);
  }
  getNewBookList(): Observable<NewModelBook[]> {
    console.log('Books in service: ', this.http.get<NewModelBook[]>(`${environment.apiUrl}/home/view-books`));
    return this.http.get<NewModelBook[]>(`${environment.apiUrl}/home/view-books`);
  }

  addBook(book: Book, selectedOrderIds, authors, value) {
    let authorArray: Data[] = [];
    for (let i = 0; i < authors.length; i++) {
      authorArray.push(authors[i].name);
    }
    console.log(authorArray);
    const test = selectedOrderIds.toString();
    const body = {title: book.title, authors: authorArray, genres: selectedOrderIds, imagePath: book.imagePath,
      release_date: book.releaseDate, language: book.language, pages: book.pages, description: book.description};
    console.log(body);
    return this.http.post(`${environment.apiUrl}/book-service/home/books/addBook?value=${value}`, body);
  }

  addAnnouncement(book: Book) {
    const body = {title: book.title, author: book.authors, genre: book.genres, imagePath: book.imagePath,
      release_date: book.releaseDate, language: book.language, pages: book.pages, description: book.description};
    return this.http.post(`${environment.apiUrl}/book-service/home/books/addAnnouncement`, body);
  }

  searchBookByTitle(title: string): Observable<NewModelBook[]> {
    return this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service/home/find-books?title=${title}`);
  }
  getBookReviews(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/book-service/home/search/${id}`);
  }
  getBookById(id: number): Observable<NewModelBook> {
    return this.http.get<NewModelBook>(`${environment.apiUrl}/book-service/home/find-book-by-id?id=${id}`);
  }
}
