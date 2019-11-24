import {Component, OnDestroy, OnInit} from '@angular/core';
import {BookService} from '../_services/book.service';
import {Author, Genre, NewModelBook} from '../_models/interface';
import {Observable, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {AuthorService} from '../_services/author.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  control = new FormControl('');
  minDate = new Date(1800, 0, 1);
  maxDate = new Date(2020, 0, 1);
  dateFrom = new FormControl(this.minDate);
  dateTo = new FormControl(this.maxDate);
  subscriptionOnTitle: Subscription;
  genres: Genre[];
  selectedGenre = 'all';
  authors: Author[] = [];
  filteredAuthors: Observable<Author[]>;
  books: NewModelBook[] = [];
  title: string;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService
  ) {}

  ngOnInit(): void {
    this.subscriptionOnTitle = this.bookService.currentTitle
      .subscribe(title => {
        this.title = title;
        this.getBooks(title, this.selectedGenre, this.control.value, this.dateFrom.value, this.dateTo.value);
      });

    this.bookService.getGenres()
      .subscribe(genres => { this.genres = genres; console.log(genres); });

    this.authorService.getAuthors()
      .subscribe(authors => { this.authors = authors; console.log(authors); });

    this.filteredAuthors = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this.filterString(value))
    );
  }

  filterString(value: string): Author[] {
    const filterValue = value.trim().toLowerCase();
    return this.authors.filter(author => author.fullName.toLowerCase().includes(filterValue));
  }

  ngOnDestroy(): void {
    this.subscriptionOnTitle.unsubscribe();
  }

  getBooks(title: string, genre: string, author: string, dateFrom: Date, dateTo: Date) {
    this.bookService.searchBookByTitle(title, genre, author, dateFrom, dateTo)
      .subscribe(books => { console.log(books) ; this.books = books; });
  }
}
