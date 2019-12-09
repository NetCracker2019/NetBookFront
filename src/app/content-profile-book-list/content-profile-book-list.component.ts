import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription, interval, fromEvent } from 'rxjs';
import { map, switchMap, tap, take, reduce} from 'rxjs/operators'
import {User, ShortBookDescription, SearchParams} from '../_models/interface';
import {UserService} from '../_services/user.service';
import {AlertService} from '../_services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthenticationService} from '../_services/authentication.service';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-content-profile-book-list',
  templateUrl: './content-profile-book-list.component.html',
  styleUrls: ['./content-profile-book-list.component.css']
})
export class ContentProfileBookListComponent implements OnInit {

  private login: string;
  public searchParams: SearchParams = {
    reading: true,
    read: true,
    favourite: true,
    notSet: true,
    sortBy: "title",
    order: "asc",
    sought: "",
    page: 0,
    size: 3
  };
  public books: ShortBookDescription[] = [];
  public disableEdit: boolean = false;
  public enableBathEdit: boolean = false;  
  public visibleTitle: boolean = true;
  public visibleAuthors: boolean = true;
  public visibleLikes: boolean = true;
  public visibleShelves: boolean = true;
  public visibleDatePub: boolean = true;
  public batchEditShelf: string = "read";
  public endOfBooks: boolean = false;
  private changeSoughtSubscription: Subscription;

  @ViewChild('searchInput', {static: true}) 
  private input: ElementRef;

  constructor(private userService: UserService,
   private activatedRoute: ActivatedRoute,
   private router: Router,
   private authenticationService: AuthenticationService,
   private alertService: AlertService,
   private toastr: ToastrService) {}

  ngOnInit() {
    this.login = this.activatedRoute.snapshot.params['login'];
    this.authenticationService.refreshToken();
    if(this.login == this.authenticationService.currentUserValue.username){
      this.disableEdit = true;
    }
   this.getBookList();

   //------------------ subscribe when sought changing 
   this.changeSoughtSubscription =  fromEvent(this.input.nativeElement, 'keyup')
    .pipe(
    switchMap(event => {
      this.searchParams.page = 0;
      this.endOfBooks = false;
      this.books = [];
      return this.userService.getBookList(this.login, this.searchParams);
    })
    )
    .subscribe(
      (data : ShortBookDescription[]) => {
          this.books = data;
        },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        }
      );
    //------------------------
  }

  ngOnDestroy(){
    this.changeSoughtSubscription.unsubscribe();
  }

  selectAll(){
    for (let book of this.books) {
      book.checked = true;
    }
  }
  selectNone(){
    for (let book of this.books) {
      book.checked = false;
    }
  }
  addBookBatchTo(shelf: string){
    let booksId: number[] = [];
    for (let book of this.books) {
      if(book.checked){
        booksId.push(book.bookId);
      }
    }
    this.userService.addBookBatchTo(this.login, shelf, booksId)
      .subscribe(
        data => {
          this.toastr.success(`Books successfully added into "${shelf}" shelf`);
          this.books = [];
          this.find();
        },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });

  }
  removeBookBatchFrom(shelf: string){
    let booksId: number[] = [];
    for (let book of this.books) {
      if(book.checked){
        booksId.push(book.bookId);
      }
    }
    this.userService.removeBookBatchFrom(this.login, shelf, booksId)
      .subscribe(
        data => {
          this.toastr.success(`Books successfully removed from "${shelf}" shelf`);
          this.books = [];
          this.find();
        },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });
  }
  removeBook(bookId: number){
    if ( window.confirm("This will completely remove the selected books from your shelves.") ) {
      let booksId: number[] = [];
      booksId.push(bookId);
      this.userService.removeBookBatch(this.login, booksId)
        .subscribe(
          data => {
            this.toastr.success(`Book successfully removed from all shelves`);
            this.books = [];
            this.find();
          },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });
    }
  }
  removeBookBatch(){
    if ( window.confirm("This will completely remove the selected books from your shelves.") ) {
      let booksId: number[] = [];
      for (let book of this.books) {
        if(book.checked){
          booksId.push(book.bookId);
        }
      }
      this.userService.removeBookBatch(this.login, booksId)
        .subscribe(
          data => {
            this.toastr.success(`Books successfully removed from all shelves`);
            this.books = [];
            this.find();
          },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });
    }
    
  }
  changeBookShelfRead(book: ShortBookDescription){
    book.reading = false;
    let booksId: number[] = [];
    booksId.push(book.bookId);
    this.userService.addBookBatchTo(this.login, "read", booksId)
      .subscribe(data => {},
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });
  }
  changeBookShelfReading(book: ShortBookDescription){
    book.read = false;
    let booksId: number[] = [];
    booksId.push(book.bookId);
    this.userService.addBookBatchTo(this.login, "reading", booksId)
      .subscribe(data => {},
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });
  }
  changeBookShelfFavourite(book: ShortBookDescription){
    let booksId: number[] = [];
    booksId.push(book.bookId);
    this.userService.addBookBatchTo(this.login, "favourite", booksId)
      .subscribe(data => {},
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });
  }
  

  onSearchChange(searchValue: string) {
    this.searchParams.sought = searchValue;
  }

  find(){
    this.searchParams.page = 0;
    this.endOfBooks = false;
    this.books = [];
    this.getBookList();
  }
  
  getBookList(){
  	this.userService.getBookList(this.login, this.searchParams)
      .subscribe(
        (data : ShortBookDescription[]) => {
          if(data.length < this.searchParams.size) this.endOfBooks = true;
          this.books = this.books.concat(data);
        },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });
  }
  onPageChanged(){
    this.searchParams.page++;
    this.getBookList();
  }
  getPhoto(imageName: string) {
  		return 'https://i.dailymail.co.uk/1s/2019/04/18/10/12427172-0-image-a-20_1555581069374.jpg';
        //return `${environment.apiUrl}/files/download?filename=${imageName}`;
  }

}
