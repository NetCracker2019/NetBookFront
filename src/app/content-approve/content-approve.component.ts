import {Component, OnInit} from '@angular/core';
import {Announcement, Book, NewModelBook, Review, ViewAnnouncement} from '../_models/interface';
import {ApproveService} from '../_services/approve.service';
import {BookService} from '../_services/book.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-content-approve',
  templateUrl: './content-approve.component.html',
  styleUrls: ['./content-approve.component.css']
})
export class ContentApproveComponent implements OnInit {
  announcements: ViewAnnouncement[];
  reviews: Review[];
  text: any;
  itemsPerPage = 4;
  reviewPage = 0;
  collectionSize: number;
  book: NewModelBook;
  sortingBy: string;

  constructor(private approveService: ApproveService,
              private bookService: BookService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.loadAnnouncements();
  }

  sort(event) {
    if (this.sortingBy === 'date') {
      this.announcements.sort((object1, object2) => {
        if (object1.releaseDate > object2.releaseDate) {
          return 1;
        }
        if (object1.releaseDate < object2.releaseDate) {
          return -1;
        }
        return 0;
      });
    }
    if (this.sortingBy === 'username') {
      this.reviews.sort((object1, object2) => {
        if (object1.userName > object2.userName) {
          return 1;
        }
        if (object1.userName < object2.userName) {
          return -1;
        }
        return 0;
      });
    }
    if (this.sortingBy === 'title') {
      this.reviews.sort((object1, object2) => {
        if (object1.title > object2.title) {
          return 1;
        }
        if (object1.title < object2.title) {
          return -1;
        }
        return 0;
      });
      this.announcements.sort((object1, object2) => {
        if (object1.title > object2.title) {
          return 1;
        }
        if (object1.title < object2.title) {
          return -1;
        }
        return 0;
      });
    }
    // window.location.reload();
  }

  loadAnnouncements() {
    this.reviews = [];
    this.approveService.getUnApproveBookList()
      .subscribe(books => {
        console.log(books);
        this.announcements = books;
      });
  }

  confirmAnnouncement(book) {
    this.approveService.confirmAnnouncement(book)
      .subscribe(text => this.text = text);
    // window.location.reload();
  }

  cancelAnnouncement(book) {
    this.approveService.cancelAnnouncement(book)
      .subscribe(text => this.text = text);
    // window.location.reload();
  }

  showPersonalize() {
  }

  loadReviews(event) {
    this.announcements = [];
    this.bookService.countReviews(false).subscribe(data => {
      console.log(data);
      this.collectionSize = data;
    });
    this.approveService.getReviewForApprove(this.reviewPage, this.itemsPerPage).subscribe(data => {
      console.log(data);
      this.reviews = data;
    });
  }

  confirmReview(review) {
    this.approveService.confirmReview(review.reviewId, review.userId)
      .subscribe(data => {
        if (data) {
          this.toastr.success('The review is confirmed.');
          // this.alertService.success('Рецензія відправлена на підтвердження модератору.', true);
          console.log(data);
        } else {
          this.toastr.success('Something is wrong(');
        }
      });
    // window.location.reload();
  }

  cancelReview(review) {
    this.approveService.cancelReview(review.reviewId)
      .subscribe(data => {
        if (data) {
          this.toastr.success('The review is canceled.');
          // this.alertService.success('Рецензія відправлена на підтвердження модератору.', true);
          console.log(data);
        } else {
          this.toastr.success('Something is wrong(');
        }
      });
  }


}
