import { Component, OnInit } from '@angular/core';
import {Announcement, Book, ViewAnnouncement} from '../_models/interface';
import {ApproveService} from '../_services/approve.service';

@Component({
  selector: 'app-content-approve',
  templateUrl: './content-approve.component.html',
  styleUrls: ['./content-approve.component.css']
})
export class ContentApproveComponent implements OnInit {
  books: ViewAnnouncement[];
  text: any;

  constructor(private approveService: ApproveService) {
    this.loadBooks();
  }

  ngOnInit() {
  }

  loadBooks() {
    this.approveService.getUnApproveBookList()
      .subscribe(books => {
        console.log(books);
        this.books = books;
      });
  }

  save(book) {
    this.approveService.confirmAnnouncement(book)
      .subscribe(text => this.text = text);
  }

  cancel(book) {
    this.approveService.cancelAnnouncement(book)
      .subscribe(text => this.text = text);
  }

}
