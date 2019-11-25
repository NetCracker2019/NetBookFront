import { Component, OnInit } from '@angular/core';
import {Author, Book, Genre, Data} from '../_models/interface';
import {BookService} from '../_services/book.service';
import {Router} from '@angular/router';
import {AlertService} from '../_services/alert.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';



@Component({
  selector: 'app-content-book',
  templateUrl: './content-book.component.html',
  styleUrls: ['./content-book.component.css']
})
export class ContentBookComponent implements OnInit {

  books: Book[];
  bookModel: Book = {} as Book;
  form: FormGroup;
  ordersData: Genre[] = [];
  author: Author = new Author();
  dataarray: Data[] = [];
  value = 'book';

  constructor(private bookService: BookService,
              private alertService: AlertService,
              private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      orders: new FormArray([])
    });

  }
  private addCheckboxes() {
      this.ordersData.forEach((o, i) => {
        const control = new FormControl(i === 0); // if first item set to true, else false
        (this.form.controls.orders as FormArray).push(control);
      });
  }

  ngOnInit() {
    this.reloadData();
    this.dataarray.push(this.author);
  }

  addForm() {
    this.author = new Author();
    this.dataarray.push(this.author);
  }
  removeForm(i) {
    this.dataarray.splice(i);
  }

  reloadData() {
    this.bookService.getBookList().subscribe(book => { console.log(book); this.books = book; });
    this.bookService.getGenreList().subscribe(genres => {console.log(genres); this.ordersData = genres; this.addCheckboxes(); });
  }
  addBookComponent() {
    const selectedOrderIds = this.form.value.orders
      .map((v, i) => v ? this.ordersData[i].genreName : null)
      .filter(v => v !== null);
    console.log(selectedOrderIds);


    this.bookService.addBook(this.bookModel, selectedOrderIds, this.dataarray, this.value)
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

  openForm() {
    document.getElementById('myForm').style.display = 'block';
  }
  closeForm() {
    document.getElementById('myForm').style.display = 'none';
  }

}
