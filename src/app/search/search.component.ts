import {Component, OnDestroy, OnInit} from '@angular/core';
import {BookService} from '../_services/book.service';
import {Genre, NewModelBook} from '../_models/interface';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  subscriptionOnTitle: Subscription;
  genres: Genre[];
  selectedGenre = 'all';
  books: NewModelBook[] = [];
  title: string;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.subscriptionOnTitle = this.bookService.currentTitle
      .subscribe(title => { this.title = title; this.getBooks(title, this.selectedGenre); });

    this.bookService.getGenres()
      .subscribe(genres => { this.genres = genres; console.log(genres); });
  }

  ngOnDestroy(): void {
    this.subscriptionOnTitle.unsubscribe();
  }

  getBooks(title: string, genre: string) {
    this.bookService.searchBookByTitle(title, genre)
      .subscribe(books => { console.log(books) ; this.books = books; });
  }
}
