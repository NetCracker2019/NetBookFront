import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {Announcement, Book, NewModelBook, Review} from '../_models/interface';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  @Output() searchEvent = new EventEmitter<string>();
  transferBookList$: Observable<NewModelBook[]>;
  private bookListAsSubject = new Subject<NewModelBook[]>();

  constructor(private http: HttpClient) {
    this.transferBookList$ = this.bookListAsSubject.asObservable();
  }

  search(title: string) {
    this.searchEvent.emit(title);
  }

  getAnnouncementList(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${environment.apiUrl}/home/announcement`);
  }

  getBookList(): Observable<Book[]> {
    return this.http.get<Book[]>(`${environment.apiUrl}/home/books`);
  }
  getNewBookList(): Observable<NewModelBook[]> {
    console.log('Books in service: ', this.http.get<NewModelBook[]>(`${environment.apiUrl}/home/view-books`));
    return this.http.get<NewModelBook[]>(`${environment.apiUrl}/home/view-books`);
  }

  addBook(book: Book) {
    const body = {title: book.title, like: book.like, imagePath: book.imagePath,
      release_date: book.release_date, language: book.language, pages: book.pages, approved: book.approved};
    return this.http.post(`${environment.apiUrl}/home/books/addBook`, body);
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

  transferBookList(data){
    console.log('Books in transfer: ', data);
    this.bookListAsSubject.next(data);
  }
}
