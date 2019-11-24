import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookService} from '../_services/book.service';
import {Announcement, Book, NewModelBook, Review} from '../_models/interface';

@Component({
  selector: 'app-content-book-details',
  templateUrl: './content-book-details.component.html',
  styleUrls: ['./content-book-details.component.css']
})
export class ContentBookDetailsComponent implements OnInit {
  // books: NewModelBook[];
  book: NewModelBook;
  reviews: Review[];
  collectionSize;
  offset = 0;
  public count = 2;
  public finish = false;

  constructor(private route: ActivatedRoute, private bookService: BookService) {
  }

  ngOnInit() {
    // this.bookService.transferBookList$.subscribe((data: NewModelBook[]) => { this.books = data; });
    this.route.paramMap.subscribe(params => {
      const bookId = +params.get('bookId');
      console.log(bookId);
      this.getBook(bookId);
      this.bookService.countBooks().subscribe(data => {this.collectionSize = data as number; });
      this.bookService.getPeaceOfReview(bookId, this.count, this.offset).subscribe(data => {
        this.reviews = data;
      });
      this.bookService.countReviews().subscribe(data => {
        this.collectionSize = data as number;
      });
    });
    this.offset += this.count;
  }

  getBook(id: number) {
    this.bookService.getBookById(id).subscribe(data => {this.book = data; });
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
      console.log(this.offset);
    } else {
      this.finish = false;
      this.bookService.getPeaceOfReview(this.book.bookId, this.count, 0).subscribe(data => {
        console.log(data);
        this.reviews = data;
      });
      this.offset = 2;
    }
  }
}
