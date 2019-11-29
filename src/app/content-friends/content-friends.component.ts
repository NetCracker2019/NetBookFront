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

  public peoples: User[] = [];	
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
    this.getPersons();
  }
  onSearchChange(searchValue: string) {  
    this.page = 1;
    this.sought = searchValue;
    this.peoples = [];
    this.getPersons();
  }
  onWhereChange(whereValue: string) {  
    this.page = 1;
    this.where = whereValue;
    this.peoples = [];
    this.getPersons();
  }
  onPageChanged() {
    this.page = this.page + 1;
    this.getPersons();
  }

  getPersons(){
    this.userService.getPersons(this.login, this.sought, this.where, 6, this.page - 1)
      .subscribe(
        (data : User[]) => {
          this.peoples = this.peoples.concat(data);
        });
  }
  find(){
    this.getPersons();
  }
  getPhoto(imageName: string) {
    return `${environment.apiUrl}/files/download?filename=${imageName}`;
  }

}
