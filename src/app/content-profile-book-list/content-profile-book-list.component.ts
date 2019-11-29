import { Component, OnInit } from '@angular/core';
import {User, ShortBookDescription} from '../_models/interface';
import {UserService} from '../_services/user.service';
import {AlertService} from '../_services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthenticationService} from '../_services/authentication.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-content-profile-book-list',
  templateUrl: './content-profile-book-list.component.html',
  styleUrls: ['./content-profile-book-list.component.css']
})
export class ContentProfileBookListComponent implements OnInit {

  private login: string;
  private sought: string = "";
  public page: number = 1;
  private where: string = "read";
  public books: ShortBookDescription[] = [];
  public disableEdit: boolean = false;

  constructor(private userService: UserService,
   private activatedRoute: ActivatedRoute,
   private router: Router,
   private authenticationService: AuthenticationService,
   private alertService: AlertService) {
    
    this.login = activatedRoute.snapshot.params['login'];
    this.authenticationService.refreshToken();
    if(this.login == this.authenticationService.currentUserValue.username){
    	this.disableEdit = true;
    }

  }

  ngOnInit() {
    this.find();

  }
  onSearchChange(searchValue: string) {  
    this.page = 1;
    this.books = [];
    this.sought = searchValue;
    this.find();
  }
  onWhereChange(whereValue: string) {  
    this.page = 1;
    this.where = whereValue;
    this.books = [];
    this.find();
  }
  onPageChanged() {
    this.page++;
    this.find();
  }
  onClick(bookIndex: number) {
    //console.log(bookIndex);
    //console.log(this.books[bookIndex].reading);
    //console.log(this.books[bookIndex].favourite);
    //console.log(this.books[bookIndex].remove);
    this.updateBook(bookIndex);
    this.page = 1;
    //
  }
  onReadingChange(bookIndex: number, reading: boolean){
  	this.books[bookIndex].reading = reading;
  }


  getFavouriteBooks(){
  	this.userService.getFavouriteBooks(this.login, this.sought, 3, this.page - 1)
      .subscribe(
        (data : ShortBookDescription[]) => {
          this.books = this.books.concat(data);
        });
  }
  getReadingBooks(){
  	this.userService.getReadingBooks(this.login, this.sought, 3, this.page - 1)
      .subscribe(
        (data : ShortBookDescription[]) => {
          this.books = this.books.concat(data);
        });
  }
  getReadBooks(){
  	this.userService.getReadBooks(this.login, this.sought, 3, this.page - 1)
      .subscribe(
        (data : ShortBookDescription[]) => {
          this.books = this.books.concat(data);
        });
  }
  find(){
    if(this.where == "read") this.getReadBooks();
    else if(this.where == "reading") this.getReadingBooks();
    else this.getFavouriteBooks();
  }
  updateBook(bookIndex: number){
    console.log(this.books[bookIndex]);
  	if(this.books[bookIndex].remove === undefined) this.books[bookIndex].remove = false;
  	this.userService.updateUserBookList(
  		this.login, this.books[bookIndex].bookId, this.books[bookIndex].reading,
  		 this.books[bookIndex].favourite, this.books[bookIndex].remove)
      .subscribe(
        (data) => {
          this.alertService.success('Книга успішно оновлена', true);
          window.location.reload();
        });
  }


  getPhoto(imageName: string) {
  		return 'https://i.dailymail.co.uk/1s/2019/04/18/10/12427172-0-image-a-20_1555581069374.jpg';
        //return `${environment.apiUrl}/files/download?filename=${imageName}`;
  }

}
