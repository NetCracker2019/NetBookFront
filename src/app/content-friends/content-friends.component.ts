import { Component, OnInit } from '@angular/core';
import {User, Achievement} from '../_models/interface';
import {UserService} from '../_services/user.service';
import {AlertService} from '../_services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthenticationService} from '../_services/authentication.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-content-friends',
  templateUrl: './content-friends.component.html',
  styleUrls: ['./content-friends.component.css']
})
export class ContentFriendsComponent implements OnInit {

  public peoples: User[];	
  private login: string;
  private sought: string = "";
  public page: number = 1;
  private where: string = "friends";
  public collectionSize: number = 0;

  constructor(private userService: UserService,
   private activatedRoute: ActivatedRoute,
   private router: Router,
   private authenticationService: AuthenticationService,
   private alertService: AlertService) {
    
    this.login = activatedRoute.snapshot.params['login'];
    this.authenticationService.refreshToken();
	}

  ngOnInit() {
    this.getCountOfPersons();
    this.getPersons();
  }
  onSearchChange(searchValue: string) {  
    this.page = 1;
    this.sought = searchValue;
    this.getCountOfPersons();
    this.getPersons();
  }
  onWhereChange(whereValue: string) {  
    this.page = 1;
    this.where = whereValue;
    this.getCountOfPersons();
    this.getPersons();
  }
  onPageChanged(pageNumber: number) {
    this.page = pageNumber;
    this.getPersons();
  }

  getPersons(){
    this.userService.getPersons(this.login, this.sought, this.where, 6, this.page - 1)
      .subscribe(
        (data : User[]) => {
          this.peoples = data;
        });
  }
  getCountOfPersons(){
    this.userService.getCountOfPersons(this.login, this.sought, this.where)
      .subscribe(
        (data : number) => {
          console.log(data);
          this.collectionSize = data;
        });
  }
  find(){
    this.getCountOfPersons();
    this.getPersons();
  }
  getPhoto(imageName: string) {
        return `${environment.apiUrl}/files/download?filename=${imageName}`;
  }

}
