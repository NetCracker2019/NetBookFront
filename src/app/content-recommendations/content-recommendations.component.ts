import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import {NewModelBook, User} from '../_models/interface';
import {BookService} from '../_services/book.service';

@Component({
  selector: 'app-content-recommendations',
  templateUrl: './content-recommendations.component.html',
  styleUrls: ['./content-recommendations.component.css']
})
export class ContentRecommendationsComponent implements OnInit {
  currentUser: User;
  books: NewModelBook[];

  constructor(private authenticationService: AuthenticationService,
              private bookService: BookService) { }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;

    this.bookService.getSuggestions(this.currentUser.username)
      .subscribe(books => this.books = books);
  }

}
