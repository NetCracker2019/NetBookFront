import {Component, OnDestroy, OnInit} from '@angular/core';
import {BookService} from '../_services/book.service';
import {Author, Genre, NewModelBook, Page} from '../_models/interface';
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
  selectedGenre: number;
  authors: Author[] = [];
  filteredAuthors: Observable<Author[]>;
  currentPage: Page;
  title: string;
  pageNumber: number;
  pageSize: number;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService
  ) {}

  ngOnInit(): void {
    this.pageNumber = 1;
    this.pageSize = 2;

    this.subscriptionOnTitle = this.bookService.currentTitle
      .subscribe(title => {
        this.title = title;
        this.onPageChanged();
      });

    this.bookService.getMinDateRelease()
      .subscribe(minDate => { this.minDate = new Date(minDate); console.log(minDate); });

    this.bookService.getMaxDateRelease()
      .subscribe(maxDate => { this.maxDate = new Date(maxDate); console.log(maxDate); });

    this.bookService.getGenres()
      .subscribe(genres => this.genres = genres);

    this.authorService.getAuthors()
      .subscribe(authors => this.authors = authors);

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
      this.selectedGenre = -1;
      this.dateFrom = new FormControl(this.minDate);
      this.dateTo = new FormControl(this.maxDate);
    }
    this.isCollapsed = !this.isCollapsed;
  }

  onPageChanged() {
    if (this.isCollapsed) {
      this.bookService.searchBookByTitle(this.title, this.pageSize, this.pageNumber)
        .subscribe(page => { console.log(page) ; this.currentPage = page; });
    } else {
      this.bookService.searchBookAdvanced(this.title, this.selectedGenre, this.control.value,
        this.dateFrom.value, this.dateTo.value, this.pageSize, this.pageNumber)
        .subscribe(page => { console.log(page) ; this.currentPage = page; });
    }
  }
}
