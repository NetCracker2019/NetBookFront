import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';


import {map} from 'rxjs/operators';


import {Announcement, Book, Genre, NewModelBook, Review} from '../_models/interface';


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
  getNewBookList(): Observable<NewModelBook[]> {
    console.log('Books in service: ', this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service/home/view-books`));
    return this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service/home/view-books`);
  }

  addBook(book: Book) {
    const body = {title: book.title, author: book.authors, genre: book.genres, imagePath: book.imagePath,
      release_date: book.releaseDate, language: book.language, pages: book.pages, description: book.description};
    return this.http.post(`${environment.apiUrl}/book-service/home/books/addBook`, body);
  }

  addAnnouncement(book: Book) {
    const body = {title: book.title, author: book.authors, genre: book.genres, imagePath: book.imagePath,
      release_date: book.releaseDate, language: book.language, pages: book.pages, description: book.description};
    return this.http.post(`${environment.apiUrl}/book-service/home/books/addAnnouncement`, body);
  }

  searchBookByTitle(title: string): Observable<NewModelBook[]> {
    return this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service/find-books?title=${title}`);
  }

  searchBookAdvanced(title: string, genre: string, author: string, dateFrom: Date, dateTo: Date): Observable<NewModelBook[]> {
    if (dateFrom < dateTo) {
      const formattedDateFrom = dateFrom.toISOString().substring(0, 10);
      const formattedDateTo = dateTo.toISOString().substring(0, 10);
      if (genre === 'all' && author === '') {
        return this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service` +
          `/filter-books?title=${title}&from=${formattedDateFrom}&to=${formattedDateTo}`);
      } else if (genre !== 'all' && author === '') {
        return this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service` +
          `/filter-books-genre?title=${title}&genre=${genre}&from=${formattedDateFrom}&to=${formattedDateTo}`);
      } else if (genre === 'all' && author !== '') {
        return this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service` +
          `/filter-books-author?title=${title}&author=${author}&from=${formattedDateFrom}&to=${formattedDateTo}`);
      } else {
        return this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service` +
          `/filter-books-author-genre?title=${title}&author=${author}&genre=${genre}&from=${formattedDateFrom}&to=${formattedDateTo}`);
      }
    }
  }

  getMinDateRelease(): Observable<Date> {
    return this.http.get<Date>(`${environment.apiUrl}/book-service/min-date-release`);
  }

  getMaxDateRelease(): Observable<Date> {
    return this.http.get<Date>(`${environment.apiUrl}/book-service/max-date-release`);
  }

  getPeaceOfFoundBook(title: string, count: number, booksPerPage: number): Observable<NewModelBook[]> {
    return this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service/home/find-books?title=${title}`);
  }
  getPeaceOfReview(id: number, count: number, offset: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/book-service/home/search/${id}?count=${count}&offset=${offset}`);
  }

  getBookReviews(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/book-service/home/search/${id}`);
  }
  getBookById(id: number): Observable<NewModelBook> {
    return this.http.get<NewModelBook>(`${environment.apiUrl}/book-service/home/find-book-id?id=${id}`);
  }
  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${environment.apiUrl}/book-service/genres`);
  }
  countBooks() {
    return this.http.get(`${environment.apiUrl}/book-service/home/books/amount`);
  }
  countReviews(){
    return this.http.get(`${environment.apiUrl}/book-service/count-reviews`);
  }
}
