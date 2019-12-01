import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookService} from '../_services/book.service';
import {Announcement, Book, NewModelBook, Review, User} from '../_models/interface';
import {AuthenticationService} from '../_services/authentication.service';
import {AlertService} from '../_services/alert.service';
import {ToastrModule, ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-content-book-details',
  templateUrl: './content-book-details.component.html',
  styleUrls: ['./content-book-details.component.css']
})
export class ContentBookDetailsComponent implements OnInit {
  // announcements: NewModelBook[];
  book: NewModelBook;
  reviews: Review[];
  collectionSize;
  offset = 0;
  count = 2;
  finish = false;
  writeReviewFlag = false;
  currentUser: User;
  reviewText: string;
  added = false;

  constructor(private route: ActivatedRoute,
              private bookService: BookService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    // this.bookService.transferBookList$.subscribe((data: NewModelBook[]) => { this.announcements = data; });
    this.route.paramMap.subscribe(params => {
      const bookId = +params.get('bookId');
      console.log(bookId);
      this.getBook(bookId);
      this.bookService.countBooks().subscribe(data => {
        this.collectionSize = data;
      });
      this.bookService.getPeaceOfReview(bookId, this.count, this.offset).subscribe(data => {
        this.reviews = data;
      });
      this.bookService.countReviews(true).subscribe(data => {
        this.collectionSize = data;
      });
      if (this.currentUser) {
        this.checkBookInProfile(this.currentUser.username, bookId);
      }
    });
    this.offset += this.count;
  }
  checkBookInProfile(userName: string, bookId: number) {
    this.bookService.checkBookInProfile(userName, bookId).subscribe(data => {
      this.added = data;
    });
  }
  getBook(id: number) {
    this.bookService.getBookById(id).subscribe(data => {
      this.book = data;
    });
    console.log('Books from det comp:', this.book);
  }

  getNewPeaceOfReviews() {
    if (!this.finish) {
      this.bookService.getPeaceOfReview(this.book.bookId, this.count, this.offset).subscribe(data => {
        console.log(data);
        this.reviews = this.reviews.concat(data);
      });
      if (this.offset < this.collectionSize) {
        this.offset += this.count;
      } else {
        this.finish = true;
      }
    } else {
      this.bookService.getPeaceOfReview(this.book.bookId, this.count, 0).subscribe(data => {
        console.log(data);
        this.reviews = data;
      });
      this.offset = 2;
      this.finish = false;
    }
  }

  writeReview() {
    this.writeReviewFlag = true;
    console.log(this.currentUser);

  }

  addReview(reviewText: string) {
    const review: Review = {} as Review;
    review.bookId = this.book.bookId;
    review.userName = this.currentUser.username;
    review.reviewText = this.reviewText.trim();
    if (this.authenticationService.role != 4) {
      review.approved = true;
    } else {
      review.approved = false;
    }

    this.bookService.addReviewForUserBook(review).subscribe(
      data => {
        if (data) {
          this.toastr.success('The review is sent to moderator confirmation.');
          // this.alertService.success('Рецензія відправлена на підтвердження модератору.', true);
          console.log(data);
        } else {
          this.toastr.success('The review can not be added(');
        }
      });

    this.writeReviewFlag = false;
  }

  cancelReview() {
    this.writeReviewFlag = false;
  }

  addBookToProfile() {
    this.bookService.addBookToProfile(this.currentUser.username, this.book.bookId).subscribe(
      data => {
        if (data) {
          this.toastr.success('The book is added to profile.');
          this.added = true;
        } else {
          this.toastr.error('The book is not added to profile(');
        }
      });
  }

  removeBookFromProfile() {
    this.bookService.removeBookFromProfile(this.currentUser.username, this.book.bookId).subscribe(
      data => {
        console.log(data);
        this.added = false;
      });
  }
}
