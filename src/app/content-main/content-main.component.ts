import { Component, OnInit } from '@angular/core';
import {BookService} from '../_services/book.service';
import {Announcement, Genre} from '../_models/interface';




@Component({
  selector: 'app-content-main',
  templateUrl: './content-main.component.html',
  styleUrls: ['./content-main.component.css']
})


export class ContentMainComponent implements OnInit {
  books: Announcement[] = [] as Announcement[];
  collectionSize: number;
  page: number;
  public booksPerPage = 4;
  genres: Genre[];

  constructor(private bookService: BookService) {
    this.page = 1;
    this.loadPage();
  }


  ngOnInit() {
    this.bookService.getGenres()
      .subscribe(genres => { this.genres = genres; console.log(genres); });

   // this.reloadData();
  }
  onPageChanged(pageNumber) {
    this.loadPage();
  }

  loadPage() {
    this.bookService.getAmountOfAnnouncement()
      .subscribe(data => {
        console.log(data);
        this.collectionSize = data as number;
      });
    // this.bookService.getAnnouncementList(this.reviewPage, this.booksPerPage)
    //   .subscribe(data => {
    //     this.announcements = data.rows;
    //     this.collectionSize = data.totalCount;
    //   });
    this.bookService.getAnnouncementListPeace(this.page, this.booksPerPage)
      .subscribe(data => {
        console.log(data);
        this.books = data;
        // this.collectionSize = data.length;
      });

    // this.reloadData();
    console.log(this.books);
  }

  // reloadData() {
  //   this.bookService.getAnnouncementListPeace(this.reviewPage, this.booksPerPage).subscribe(data => { this.announcements = data; });
  //
  // }

}
