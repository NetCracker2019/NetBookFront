import { Component, OnInit } from '@angular/core';
import {Author, Book, Data, Genre} from '../_models/interface';
import {BookService} from '../_services/book.service';
import {AlertService} from '../_services/alert.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrls: ['./add-announcement.component.css']
})
export class AddAnnouncementComponent implements OnInit {
  bookModel: Book = {} as Book;
  form: FormGroup;
  author: Author = new Author();
  dataarray: Data[] = [];
  ordersData: Genre[] = [];
  value = 'announcement';

  constructor(private bookService: BookService,
              private alertService: AlertService,
              private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      orders: new FormArray([])
    });
  }

  ngOnInit() {
    this.reloadData();
    this.dataarray.push(this.author);
  }

  private addCheckboxes() {
    this.ordersData.forEach((o, i) => {
      const control = new FormControl(i === 0); // if first item set to true, else false
      (this.form.controls.orders as FormArray).push(control);
    });
  }

  reloadData() {
    this.bookService.getGenreList().subscribe(genres => {console.log(genres); this.ordersData = genres; this.addCheckboxes(); });
  }

  addForm() {
    this.author = new Author();
    this.dataarray.push(this.author);
  }
  removeForm(i) {
    this.dataarray.splice(i);
  }

  addAnnouncementComponent() {
    const selectedOrderIds = this.form.value.orders
      .map((v, i) => v ? this.ordersData[i].genreName : null)
      .filter(v => v !== null);
    console.log(selectedOrderIds);


    this.bookService.addBook(this.bookModel, selectedOrderIds, this.dataarray, this.value)
      .subscribe(
        data => {
          this.alertService.success('Add successful', true);
          console.log(data);
        });
  }

}
