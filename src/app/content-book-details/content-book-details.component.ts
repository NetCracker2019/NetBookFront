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
  likedBook: number;
  bookLikes: number;
  loading = false;

  constructor(private route: ActivatedRoute,
              private bookService: BookService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.route.paramMap.subscribe(params => {
      const bookId = +params.get('bookId');
      this.getBook(bookId);
      // this.bookService.countBooks().subscribe(data => {
      //   this.collectionSize = data;
      // });
      this.bookService.countReviewsForBook(bookId).subscribe(data => {
        this.collectionSize = data;
        console.log('Collection size:' + data);
      });
      this.bookService.getPeaceOfReview(bookId, this.count, this.offset).subscribe(data => {
        this.reviews = data;
      });
      if (this.currentUser) {
        this.checkBookInProfile(this.currentUser.username, bookId);
        this.checkLikedBook(this.currentUser.username, bookId);
      }
    });
    this.offset += this.count;
  }

  checkBookInProfile(userName: string, bookId: number) {
    this.bookService.checkBookInProfile(userName, bookId).subscribe(data => {
      this.added = data;
    });
  }

  checkLikedBook(userLogin: string, bookId: number) {
    this.bookService.checkLikedBook(bookId, userLogin).subscribe(data => {
      this.likedBook = data;
    });
  }

  getBook(id: number) {
    this.bookService.getBookById(id).subscribe(data => {
      this.book = data;
      this.bookLikes = data.likes;
      console.log('Book likes: ' + data.likes);
    });
  }

  getNewPeaceOfReviews() {
    this.loading = true;
    if (!this.finish) {
      this.bookService.getPeaceOfReview(this.book.bookId, this.count, this.offset).subscribe(data => {
        console.log(data);
        this.reviews = this.reviews.concat(data);
      });
      if (this.offset < this.collectionSize - this.count) {
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
    this.loading = false;
  }

  writeReview() {
    if (this.currentUser) {
      this.writeReviewFlag = true;
    } else {
      this.toastr.error('You must be authorized in system!');
    }
  }

  addReview(reviewText: string) {
    const review: Review = {} as Review;
    review.reviewId = null;
    review.bookId = this.book.bookId;
    review.userName = this.currentUser.username;
    review.reviewText = this.reviewText.trim();
    review.approved = false;

    this.bookService.addReviewForUserBook(review).subscribe(
      data => {
        if (data) {
          this.toastr.success('The review is sent to moderator confirmation.');
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
    if (this.currentUser) {
      this.bookService.addBookToProfile(this.currentUser.username, this.book.bookId).subscribe(
        data => {
          if (data) {
            this.toastr.success('The book is added to profile.');
            this.added = true;
          } else {
            this.toastr.error('The book is not added to profile(');
          }
        });
    } else {
      this.toastr.error('You must be authorized in system!');
    }
  }

  removeBookFromProfile() {
    if (this.currentUser) {
      this.bookService.removeBookFromProfile(this.currentUser.username, this.book.bookId).subscribe(
        data => {
          console.log(data);
          this.added = false;
        });
    } else {
      this.toastr.error('You must be authorized in system!');
    }
  }

  likeBook() {
    if (this.likedBook === 1) {
      this.bookLikes--;
      this.likedBook = 0;
    } else if (this.likedBook === -1) {
      this.bookLikes += 2;
      this.likedBook = 1;
    } else {
      this.bookLikes++;
      this.likedBook = 1;
      console.log(this.bookLikes);
    }
    console.log('You want like the review');
    if (this.currentUser) {
      this.bookService.likeBook(this.book.bookId, this.currentUser.username).subscribe(data => {
      });
    } else {
      this.toastr.error('You must be authorized in system!');
    }
  }

  dislikeBook() {
    if (this.likedBook === 1) {
      this.bookLikes -= 2;
      this.likedBook = -1;
    } else if (this.likedBook === -1) {
      this.bookLikes++;
      this.likedBook = 0;
    } else {
      this.bookLikes--;
      this.likedBook = -1;
    }
    if (this.currentUser) {
      this.bookService.dislikeBook(this.book.bookId, this.currentUser.username).subscribe(data => {
      });
    } else {
      this.toastr.error('You must be authorized in system!');
    }

  }

  likeReview(review: Review) {
    if (this.currentUser) {
      this.bookService.likeReview(review.reviewId, this.currentUser.username).subscribe(data => {
        review.rating = data;
      });
    } else {
      this.toastr.error('You must be authorized in system!');
    }
  }

  dislikeReview(review: Review) {
    if (this.currentUser) {
      this.bookService.dislikeReview(review.reviewId, this.currentUser.username).subscribe(data => {
        review.rating = data;
      });
    } else {
      this.toastr.error('You must be authorized in system!');
    }
  }
}
