import { Component, OnInit } from '@angular/core';
import {Book} from '../_models/interface';
import {BookService} from '../_services/book.service';
import {AlertService} from '../_services/alert.service';

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrls: ['./add-announcement.component.css']
})
export class AddAnnouncementComponent implements OnInit {
  bookModel: Book = {} as Book;

  constructor(private bookService: BookService,
              private alertService: AlertService) { }

  ngOnInit() {
  }

  addBookComponent() {
    this.bookService.addAnnouncement(this.bookModel)
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

}
