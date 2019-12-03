import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Announcement, Book, Review, ViewAnnouncement} from '../_models/interface';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class ApproveService {


  constructor(private http: HttpClient) {
  }


  getUnApproveBookList(): Observable<ViewAnnouncement[]> {
    return this.http.get<ViewAnnouncement[]>(`${environment.apiUrl}/approve-service/books`);
  }


  confirmAnnouncement(book: ViewAnnouncement) {
    console.log(book);
    const body = {
      title: book.title, authors: book.authors, genres: book.genres, imagePath: book.imagePath,
      release_date: book.releaseDate, announcmentId: book.announcmentId, description: book.description
    };
    console.log(body);
    return this.http.post(`${environment.apiUrl}/approve-service/confirm-announcement`, body);
  }

  cancelAnnouncement(book: ViewAnnouncement) {
    const body = {
      title: book.title, authors: book.authors, genres: book.genres, imagePath: book.imagePath,
      release_date: book.releaseDate, announcmentId: book.announcmentId, description: book.description
    };
    return this.http.post(`${environment.apiUrl}/approve-service/cancel-announcement`, body);
  }

  getReviewForApprove(page: number, offset: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/approve-service/reviews-for-approve?page=${page}&itemPerPage=${offset}`);
  }


  confirmReview(reviewId: number, userId:number): Observable<boolean> {
    const body = {reviewId: reviewId, userId: userId};
    return this.http.post<boolean>(`${environment.apiUrl}/approve-service/confirm-review?reviewId=${reviewId}&userId=${userId}`, body);
  }

  cancelReview(reviewId: number): Observable<boolean> {
    const body = {reviewId: reviewId};
    return this.http.post<boolean>(`${environment.apiUrl}/approve-service/cancel-review?reviewId=${reviewId}`, body);
  }

  // cancelAnnouncement(book): Observable<Book[]> {
  //   return this.http.put<Book[]>(`${environment.apiUrl}/approve/confirm?bookId=`, book.announcmentId);
  // }
}
