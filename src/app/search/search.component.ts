import {Component, Input, OnInit} from '@angular/core';
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
    this.bookService.currentTitle.subscribe(title => { this.title = title; this.getBooks(title); });
  }

  getBooks(title: string) {
    this.bookService.searchBookByTitle(title)
      .subscribe(books => { console.log(books) ; this.books = books; });
  }
}
