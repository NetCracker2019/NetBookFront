import { Component, OnInit } from '@angular/core';
import {BookService} from '../_services/book.service';
import {Book, NewModelBook} from '../_models/interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  books: NewModelBook[] = [];
  title: string;

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.bookService.searchEvent
      .subscribe((data: string) => {
        // console.log('Event message from Component Header: ' + data);
        this.title = data;
        console.log(this.title);
        this.getBooks();
        console.log('Books in search', this.books);
      });
  }

  getBooks() {
    this.bookService.searchBookByTitle(this.title)
      .subscribe(books => { console.log( books) ; this.books = books; });
  }
}
