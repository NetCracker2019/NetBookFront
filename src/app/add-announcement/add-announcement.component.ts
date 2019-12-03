import { Component, OnInit } from '@angular/core';
import {Author, Book, Data, Genre} from '../_models/interface';
import {BookService} from '../_services/book.service';
import {AlertService} from '../_services/alert.service';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {AuthorService} from "../_services/author.service";
import {AuthenticationService} from "../_services/authentication.service";

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrls: ['./add-announcement.component.css']
})
export class AddAnnouncementComponent implements OnInit {
  bookModel: Book = {} as Book;
  optionsSelect: Array<any>;
  selectedOption: Array<any>;
  authors: Author[] = [];
  authorsSend: Array<Author>;
  counter = 0;
  currentUser: string;
  // author: Author = new Author();
  // dataarray: Data[] = [];
  // ordersData: Genre[] = [];
  // value = 'announcement';

  addForm: FormGroup;
  control = new FormControl('');
  filteredAuthors: Observable<Author[]>;
  accountValidationMessages = {
    title: [
      { type: 'required', message: 'Title is required' },
      { type: 'minlength', message: 'Username must be at least 2 characters long' },
      { type: 'maxlength', message: 'Username cannot be more than 15 characters long' },
    ],
    date: [
      { type: 'required', message: 'Date is required' },
    ],
    genres: [
      { type: 'required', message: 'Genre is required' }
    ],
    imagePath: [
      { type: 'required', message: 'Image url is required' }
    ],
    pages: [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 5 characters long' },
      { type: 'maxlength', message: 'Your password cannot be more than 15 characters long' }
    ],
  };

  constructor(private authorService: AuthorService,
              private bookService: BookService,
              private authenticationService: AuthenticationService) {
    this.authorsSend = [];
    this.addForm = new FormGroup({

      title: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15)
      ]),
      date: new FormControl('', [
        Validators.required
      ]),
      genres: new FormControl('', [
        Validators.required
      ]),
      imagePath: new FormControl('', [
        Validators.required
      ]),
      pages: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(5)
      ]),
      description: new FormControl(''),
    });
    bookService.getGenreList().subscribe(genres => {console.log(genres); this.optionsSelect = genres; });
    this.currentUser = this.authenticationService.currentUserValue.username;
  }

  ngOnInit() {
    // this.reloadData();
    // this.dataarray.push(this.author);
    this.optionsSelect = [];
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
  getValidationMessage(controlName: string) {
    const controlErrors: ValidationErrors = this.addForm.get(controlName).errors;
    let error = null;
    if (controlErrors != null) {
      for (const controlError in controlErrors) {
        if (controlErrors[controlError]) {

          error = this.accountValidationMessages[controlName].find((valMsg) => {
            return valMsg.type === controlError;
          });
          break;
        }
      }
    }
    return error;
  }

  addContact(name) {
    let tmp: Author = {authorId: this.counter, fullName: name};
    this.authorsSend.push(tmp);
    this.counter = this.counter + 1;
  }

  removeContact(name) {
    let index = this.authors.indexOf(name);
    this.authorsSend.splice(index, 1);
  }


  addAnnouncementComponent() {
    this.bookModel.title = this.addForm.controls.title.value;
    this.bookModel.releaseDate = this.addForm.controls.date.value;
    this.bookModel.genres = this.addForm.controls.genres.value;
    this.bookModel.description = this.addForm.controls.description.value;
    this.bookModel.pages = this.addForm.controls.pages.value;
    this.bookModel.imagePath = this.addForm.controls.imagePath.value;

    this.bookService.addBook(this.bookModel, this.authorsSend, this.currentUser)
      .subscribe(
        data => {
          console.log(data);
        });
  }

}
