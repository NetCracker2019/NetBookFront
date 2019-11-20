import {Component, OnDestroy, OnInit} from '@angular/core';
import {BookService} from '../_services/book.service';
import {NewModelBook} from '../_models/interface';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  subscriptionOnTitle: Subscription;
  books: NewModelBook[] = [];
  title: string;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.subscriptionOnTitle = this.bookService.currentTitle
      .subscribe(title => { this.title = title; this.getBooks(title); });
  }

  ngOnDestroy(): void {
    this.subscriptionOnTitle.unsubscribe();
  }

  getBooks(title: string) {
    this.bookService.searchBookByTitle(title)
      .subscribe(books => { console.log(books) ; this.books = books; });
  }
}
