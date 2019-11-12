import { Component, OnInit } from '@angular/core';
import {Kniga} from '../_models/interface';
import {BookService} from '../_services/book.service';
import {Router} from '@angular/router';
import {AlertService} from '../_services/alert.service';

@Component({
  selector: 'app-content-book',
  templateUrl: './content-book.component.html',
  styleUrls: ['./content-book.component.css']
})
export class ContentBookComponent implements OnInit {
  knigas: Kniga[];
  model: any = {};
  constructor(private knigaService: BookService,
              private router: Router,
              private alertService: AlertService) { }

  ngOnInit() {
    this.reloadData();
  }

  reloadData() {
    this.knigaService.getBookList().subscribe(kniga => { console.log(kniga); this.knigas = kniga; });
  }
  addKniga() {
    this.knigaService.addBook(this.model)
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
