import { Component, OnInit } from '@angular/core';
import {BookService} from '../_services/book.service';
import {Announcement} from '../_models/interface';

@Component({
  selector: 'app-content-main',
  templateUrl: './content-main.component.html',
  styleUrls: ['./content-main.component.css']
})
export class ContentMainComponent implements OnInit {

  books: Announcement[];

  constructor(private bookService: BookService) { }

  ngOnInit() {
    this.reloadData();
    console.log(this.books);
  }

  reloadData() {
    this.bookService.getAnnouncementList().subscribe(data => { this.books = data; });
  }

}
