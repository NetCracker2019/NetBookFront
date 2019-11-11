import { Component, OnInit } from '@angular/core';
import {Book} from "../_models/Book";
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
  books: Announcement[];

  constructor(private knigaService: BookService) { }

  ngOnInit() {
    this.reloadData();
  }

  reloadData() {
    this.knigaService.getAnnouncmentList().subscribe(data => { console.log(data); this.books = data; });
  }

}
