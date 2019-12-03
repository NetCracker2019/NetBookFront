import { Component, OnInit } from '@angular/core';
import {User, Achievement} from '../_models/interface';
import {UserService} from '../_services/user.service';
import {AlertService} from '../_services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthenticationService} from '../_services/authentication.service';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

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
  public collectionSize: number = 6;
  public endOfFriends: boolean = false;

  constructor(private userService: UserService,
   private activatedRoute: ActivatedRoute,
   private router: Router,
   private authenticationService: AuthenticationService,
   private alertService: AlertService,
   private toastr: ToastrService) {
    
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
    this.endOfFriends = false;
    this.getPersons();
  }
  onWhereChange(whereValue: string) {  
    this.page = 1;
    this.where = whereValue;
    this.peoples = [];
    this.endOfFriends = false;
    this.getPersons();
  }
  onPageChanged() {
    this.page = this.page + 1;
    this.getPersons();
  }

  getPersons(){
    this.userService.getPersons(this.login, this.sought, this.where, this.collectionSize, this.page - 1)
      .subscribe(
        (data : User[]) => {
          if(data.length < this.collectionSize) this.endOfFriends = true;
          this.peoples = this.peoples.concat(data);
        },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });
  }
  find(){
    this.getPersons();
  }
  getPhoto(imageName: string) {
    return `https://www.imgworlds.com/wp-content/uploads/2015/12/18-CONTACTUS-HEADER.jpg`;
    //return `${environment.apiUrl}/files/download?filename=${imageName}`;
  }

}
