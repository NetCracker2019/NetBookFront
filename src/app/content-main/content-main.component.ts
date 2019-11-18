import { Component, OnInit } from '@angular/core';
import {BookService} from '../_services/book.service';
import {Announcement} from '../_models/interface';




@Component({
  selector: 'app-content-main',
  templateUrl: './content-main.component.html',
  styleUrls: ['./content-main.component.css']
})


export class ContentMainComponent implements OnInit {



  // Books = [
  //   new Book (0,"../../assets/img/Harry.jpg","Potniy Harry i filosovskiy kamen", "Граевский Александр Моисеевич", "Советская классическая проза, Военная проза","03.11.1999", "Russian"),
  //   new Book (1,"../../assets/img/Harry.jpg","Potniy Harry i filosovskiy kamen", "Граевский Александр Моисеевич", "Советская классическая проза, Военная проза","03.11.1999", "Russian"),
  //   new Book (2,"../../assets/img/Harry.jpg","Potniy Harry i filosovskiy kamen", "Граевский Александр Моисеевич", "Советская классическая проза, Военная проза","03.11.1999", "Russian"),
  //   new Book (3,"../../assets/img/Harry.jpg","Potniy Harry i filosovskiy kamen", "Граевский Александр Моисеевич", "Советская классическая проза, Военная проза","03.11.1999", "Russian"),
  //   new Book (4,"../../assets/img/Harry.jpg","Potniy Harry i filosovskiy kamen", "Граевский Александр Моисеевич", "Советская классическая проза, Военная проза","03.11.1999", "Russian")
  // ];
  books: Announcement[] = [] as Announcement[];
  collectionSize: number;
  page: number;
  public booksPerPage = 2;

  constructor(private bookService: BookService) {
    this.page = 1;
    this.loadPage();
  }

  books: Announcement[];



  ngOnInit() {

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
    // this.bookService.getAnnouncementList(this.page, this.booksPerPage)
    //   .subscribe(data => {
    //     this.books = data.rows;
    //     this.collectionSize = data.totalCount;
    //   });
    this.bookService.getAnnouncementListPeace(this.page, this.booksPerPage)
      .subscribe(data => {
        console.log(data);
        this.books = data;
        // this.collectionSize = data.length;
      });

    this.reloadData();
    console.log(this.books);
  }

  reloadData() {
    this.bookService.getAnnouncementList().subscribe(data => { this.books = data; });

  }

}
