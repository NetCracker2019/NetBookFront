import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';


import {map} from 'rxjs/operators';


import {Announcement, Author, Book, Data, Genre, NewModelBook, Review, Event} from '../_models/interface';


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

  getCalendarAnnouncement(value: string, userName: string): Observable<Event[]> {
    console.log(userName);
    return this.http.get<Event[]>(`${environment.apiUrl}/book-service/calendar-announcement?value=${value}` + `&userName=` + userName);
  }

  getAnnouncementListPeace(page: number, booksPerPage: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${environment.apiUrl}/book-service/announcementListPeace?page=` + page
      + `&booksPerPage=` + booksPerPage);
  }
  getAmountOfAnnouncement() {
    return this.http.get(`${environment.apiUrl}/book-service/amountOfAnnouncement`);
  }


  getBookListPeace(page: number, booksPerPage: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${environment.apiUrl}/book-service/bookListPeace?page=` + page
      + `&booksPerPage=` + booksPerPage);
  }
  getAmountOfBook() {
    return this.http.get(`${environment.apiUrl}/book-service/amountOfBook`);
  }


  getBookList(): Observable<Book[]> {
    return this.http.get<Book[]>(`${environment.apiUrl}/book-service/books`);
  }
  getGenreList(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${environment.apiUrl}/book-service/genres`);
  }
  getNewBookList(): Observable<NewModelBook[]> {
    console.log('Books in service: ', this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service/view-books`));
    return this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service/view-books`);
  }

  addBook(book: Book, authors, userName: string) {
    let authorArray: Data[] = [];
    for (let i = 0; i < authors.length; i++) {
      authorArray.push(authors[i].fullName);
    }
    const body = {title: book.title, authors: authorArray, genres: book.genres, imagePath: book.imagePath,
      release_date: book.releaseDate, language: book.language, pages: book.pages, description: book.description, user: userName};
    console.log(body);
    return this.http.post(`${environment.apiUrl}/book-service/book`, body);
  }

  // addAnnouncement(book: Book) {
  //   const body = {title: book.title, author: book.authors, genre: book.genres, imagePath: book.imagePath,
  //     release_date: book.releaseDate, language: book.language, pages: book.pages, description: book.description};
  //   return this.http.post(`${environment.apiUrl}/book-service/books/addAnnouncement`, body);
  // }

  searchBookByTitle(title: string, pageSize: number, page: number): Observable<NewModelBook[]> {
    return this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service/find-books?title=${title}&size=${pageSize}&page=${page}`);
  }

  getAmountOfSearchResult(title: string): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/book-service/amount-of-search-result?title=${title}`);
  }

  searchBookAdvanced(title: string, genre: string, author: string,
                     dateFrom: Date, dateTo: Date, pageSize: number, page: number): Observable<NewModelBook[]> {
    if (dateFrom < dateTo) {
      const formattedDateFrom = dateFrom.toISOString().substring(0, 10);
      const formattedDateTo = dateTo.toISOString().substring(0, 10);
      if (genre === 'all' && author === '') {
        return this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service` +
          `/filter-books?title=${title}&from=${formattedDateFrom}&to=${formattedDateTo}&size=${pageSize}&page=${page}`);
      } else if (genre !== 'all' && author === '') {
        return this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service` +
          `/filter-books-genre?title=${title}&genre=${genre}` +
          `&from=${formattedDateFrom}&to=${formattedDateTo}&size=${pageSize}&page=${page}`);
      } else if (genre === 'all' && author !== '') {
        return this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service` +
          `/filter-books-author?title=${title}&author=${author}` +
          `&from=${formattedDateFrom}&to=${formattedDateTo}&size=${pageSize}&page=${page}`);
      } else {
        return this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service` +
          `/filter-books-author-genre?title=${title}&author=${author}&genre=${genre}` +
          `&from=${formattedDateFrom}&to=${formattedDateTo}&size=${pageSize}&page=${page}`);
      }
    }
  }

  getAmountOfAdvancedSearchResult(title: string, genre: string, author: string, dateFrom: Date, dateTo: Date): Observable<number> {
    if (dateFrom < dateTo) {
      const formattedDateFrom = dateFrom.toISOString().substring(0, 10);
      const formattedDateTo = dateTo.toISOString().substring(0, 10);
      if (genre === 'all' && author === '') {
        return this.http.get<number>(`${environment.apiUrl}/book-service` +
          `/amount-filter-books?title=${title}&from=${formattedDateFrom}&to=${formattedDateTo}`);
      } else if (genre !== 'all' && author === '') {
        return this.http.get<number>(`${environment.apiUrl}/book-service` +
          `/amount-filter-books-genre?title=${title}&genre=${genre}&from=${formattedDateFrom}&to=${formattedDateTo}`);
      } else if (genre === 'all' && author !== '') {
        return this.http.get<number>(`${environment.apiUrl}/book-service` +
          `/amount-filter-books-author?title=${title}&author=${author}&from=${formattedDateFrom}&to=${formattedDateTo}`);
      } else {
        return this.http.get<number>(`${environment.apiUrl}/book-service` +
          `/amount-filter-books-author-genre?title=${title}&author=${author}&genre=${genre}` +
          `&from=${formattedDateFrom}&to=${formattedDateTo}`);
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
    return this.http.get<NewModelBook[]>(`${environment.apiUrl}/book-service/find-books?title=${title}`);
  }
  getPeaceOfReview(id: number, count: number, offset: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/book-service/search/${id}?count=${count}&offset=${offset}`);
  }
  addReviewForUserBook(review: Review) {
    const body = {reviewId: null,
      userId: null,
      bookId: review.bookId,
      userName: review.userName,
      userAvatarPath: null,
      reviewText: review.reviewText,
      rating: 0,
      approved: review.approved};
    console.log(body);
    // return this.http.post(`${environment.apiUrl}/book-service/add-review-user-book?userId=1&bookId=4&reviewText=erge`);
    return this.http.post<Review>(`${environment.apiUrl}/book-service/add-review-user-book`, body);
  }
  likeBook(bookId: number): Observable<boolean> {
    const body = {bookId: bookId};
    return this.http.put<boolean>(`${environment.apiUrl}/book-service/like-book?bookId=${bookId}`, body);
  }
  likeReview(reviewId: number): Observable<boolean> {
    const body = {reviewId: reviewId};
    return this.http.put<boolean>(`${environment.apiUrl}/book-service/like-review?reviewId=${reviewId}`, body);
  }
  addBookToProfile(userName: string, bookId: number): Observable<boolean> {
    const body = {username: userName, bookId: bookId};
    return this.http.post<boolean>(
      `${environment.apiUrl}/book-service/add-book-profile?userName=${userName}&bookId=${bookId}`, body);
    // return this.http.get(`${environment.apiUrl}/book-service/add-book-profile?userName=${userName}&bookId=${bookId}`);
  }
  removeBookFromProfile(userName: string, bookId: number): Observable<boolean> {
    const body = {username: userName, bookId: bookId};
    return this.http.delete<boolean>(
      `${environment.apiUrl}/book-service/remove-book-profile?userName=${userName}&bookId=${bookId}`);
    // return this.http.get(`${environment.apiUrl}/book-service/add-book-profile?userName=${userName}&bookId=${bookId}`);
  }
  checkBookInProfile(userName: string, bookId: number): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/book-service/check-book-profile?userName=${userName}&bookId=${bookId}`);
  }

  getBookReviews(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/book-service/search/${id}`);
  }
  getBookById(id: number): Observable<NewModelBook> {
    return this.http.get<NewModelBook>(`${environment.apiUrl}/book-service/find-book-id?id=${id}`);
  }
  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${environment.apiUrl}/book-service/genres`);
  }
  countBooks(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/book-service/books/amount`);
  }
  countReviews(approved: boolean): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/book-service/count-reviews?approved=${approved}`);
  }
}
