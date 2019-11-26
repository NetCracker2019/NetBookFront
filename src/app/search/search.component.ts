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
  isCollapsed = true;
  control = new FormControl('');
  minDate: Date;
  maxDate: Date;
  dateFrom: FormControl;
  dateTo: FormControl;
  subscriptionOnTitle: Subscription;
  genres: Genre[];
  selectedGenre = 'all';
  authors: Author[] = [];
  filteredAuthors: Observable<Author[]>;
  books: NewModelBook[] = [];
  title: string;
  page = 1;
  booksPerPage = 2;
  collectionSize: number;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService
  ) {}

  ngOnInit(): void {
    this.subscriptionOnTitle = this.bookService.currentTitle
      .subscribe(title => {
        this.title = title;
        this.getBooks(title);
      });

    this.bookService.getMinDateRelease()
      .subscribe(minDate => { this.minDate = new Date(minDate); console.log(minDate); });

    this.bookService.getMaxDateRelease()
      .subscribe(maxDate => { this.maxDate = new Date(maxDate); console.log(maxDate); });

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

  advanced() {
    if (this.isCollapsed) {
      this.dateFrom = new FormControl(this.minDate);
      this.dateTo = new FormControl(this.maxDate);
    }
    this.isCollapsed = !this.isCollapsed;
  }

  getBooks(title: string) {
    if (this.dateFrom === undefined || this.dateTo === undefined) {
      this.bookService.getAmountOfSearchResult(title)
        .subscribe(amount => { this.collectionSize = amount; console.log(amount); });
      this.bookService.searchBookByTitle(title, this.booksPerPage, this.page)
        .subscribe(books => { console.log(books) ; this.books = books; });
    } else {
      this.bookService.getAmountOfAdvancedSearchResult(title, this.selectedGenre, this.control.value, this.dateFrom.value,
        this.dateTo.value)
        .subscribe(amount => this.collectionSize = amount);
      this.bookService.searchBookAdvanced(title, this.selectedGenre, this.control.value,
        this.dateFrom.value, this.dateTo.value, this.booksPerPage, this.page)
        .subscribe(books => { console.log(books) ; this.books = books; });
    }
  }

  onPageChanged() {
    if (this.dateFrom === undefined || this.dateTo === undefined) {
      this.bookService.searchBookByTitle(this.title, this.booksPerPage, this.page)
        .subscribe(books => { console.log(books) ; this.books = books; });
    } else {
      this.bookService.searchBookAdvanced(this.title, this.selectedGenre, this.control.value,
        this.dateFrom.value, this.dateTo.value, this.booksPerPage, this.page)
        .subscribe(books => { console.log(books) ; this.books = books; });
    }
  }
}
