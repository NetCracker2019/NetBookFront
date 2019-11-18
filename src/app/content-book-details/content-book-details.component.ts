import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookService} from '../_services/book.service';
import {Book, NewModelBook, Review} from '../_models/interface';

@Component({
  selector: 'app-content-book-details',
  templateUrl: './content-book-details.component.html',
  styleUrls: ['./content-book-details.component.css']
})
export class ContentBookDetailsComponent implements OnInit {
  // books: NewModelBook[];
  book: NewModelBook;
  reviews: Review[];

  constructor(private route: ActivatedRoute, private bookService: BookService) {
  }

  ngOnInit() {
    // this.bookService.transferBookList$.subscribe((data: NewModelBook[]) => { this.books = data; });
    this.route.paramMap.subscribe(params => {
      const bookId = +params.get('bookId');
      console.log(bookId);
      this.getBook(bookId);
      this.getReviews(bookId);
    });
  }

  getBook(id: number) {
    this.bookService.getBookById(id).subscribe(data => {this.book = data; });
    console.log('Books from det comp:', this.book);
  }
  getReviews(id: number) {
    this.bookService.getBookReviews(id).subscribe(data2 => {
      console.log(data2);
      this.reviews = data2;
    });
  }

}
