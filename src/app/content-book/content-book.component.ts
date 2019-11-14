import { Component, OnInit } from '@angular/core';
import {Book} from '../_models/interface';
import {BookService} from '../_services/book.service';
import {Router} from '@angular/router';
import {AlertService} from '../_services/alert.service';

@Component({
  selector: 'app-content-book',
  templateUrl: './content-book.component.html',
  styleUrls: ['./content-book.component.css']
})
export class ContentBookComponent implements OnInit {
  books: Book[];
  bookModel: Book;
  constructor(private bookService: BookService,
              private router: Router,
              private alertService: AlertService) { }

  ngOnInit() {
    this.reloadData();
  }

  reloadData() {
    this.bookService.getBookList().subscribe(book => { console.log(book); this.books = book; });
  }
  addBookComponent() {
    this.bookService.addBook(this.bookModel)
      .subscribe(
        data => {
          this.alertService.success('Add successful', true);
          console.log(data);
        },
        (error) => {
          this.alertService.error(error);
          console.log(error);
        });
  }

}
