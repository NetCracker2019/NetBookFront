import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Announcement, Book} from '../_models/interface';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private titleSource = new BehaviorSubject<string>('');
  currentTitle = this.titleSource.asObservable();

  constructor(private http: HttpClient) { }

  changeTitle(title: string) {
    this.titleSource.next(title);
  }

  getAnnouncementList(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${environment.apiUrl}/home/announcement`);
  }

  getBookList(): Observable<Book[]> {
    return this.http.get<Book[]>(`${environment.apiUrl}/home/books`);
  }

  addBook(book: Book) {
    const body = {title: book.title, like: book.like, imagePath: book.imagePath,
      release_date: book.release_date, language: book.language, pages: book.pages, approved: book.approved};
    return this.http.post(`${environment.apiUrl}/home/books/addBook`, body);
  }

  searchBookByTitle(title: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${environment.apiUrl}/home/find-books?title=${title}`);
  }
}
