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
  }

  reloadData() {
    this.bookService.getAnnouncementList().subscribe(data => { console.log(data); this.books = data; });
  }

}
