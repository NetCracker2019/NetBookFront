import { Component, OnInit } from '@angular/core';
import {User, Achievement, ShortBookDescription} from '../_models/interface';
import {UserService} from '../_services/user.service';
import {AlertService} from '../_services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {AuthenticationService} from '../_services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-content-profile',
  templateUrl: './content-profile.component.html',
  styleUrls: ['./content-profile.component.css']
})
export class ContentProfileComponent implements OnInit {


  public user: User = {} as User;
  public friends: User[] = [];
  public favouriteBooks: ShortBookDescription[] = [];
  public readingBooks: ShortBookDescription[] = [];
  public readBooks: ShortBookDescription[] = [];
  public achievement: Achievement = {} as Achievement;	
  public isFriend: number = -1;	
  public isOwnProfile: boolean = false;
  private login: string;


  constructor(private userService: UserService,
   private activatedRoute: ActivatedRoute,
   private router: Router,
   private authenticationService: AuthenticationService,
   private alertService: AlertService,
   private toastr: ToastrService) {
  }

  ngOnInit() {
    this.login = this.activatedRoute.snapshot.params['login'];
    this.authenticationService.refreshToken();
    this.isFriendFunction();

    this.userService.getUser(this.login)
      .subscribe(
        (data: User) => {
          this.user = data;
        },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });
    
    if(this.authenticationService.currentUserValue.username == this.login){
      this.isOwnProfile = true;
    }
    this.userService.getAchievement(this.login)
      .subscribe(
        (data: Achievement) => {
          this.achievement = data;
        },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });

    this.userService.getFriends(this.login, 4, 0)
      .subscribe(
        (data: User[]) => {
          this.friends = data;
        },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });

    this.userService.getFavouriteBooks(this.login, "", 3, 0)
      .subscribe(
        (data: ShortBookDescription[]) => {
          this.favouriteBooks = data;
        },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });

    this.userService.getReadingBooks(this.login, "", 3, 0)
      .subscribe(
        (data: ShortBookDescription[]) => {
          this.readingBooks = data;
        });

    this.userService.getReadBooks(this.login, "", 3, 0)
      .subscribe(
        (data: ShortBookDescription[]) => {
          this.readBooks = data;
        });

  }
  goEdit() {
    this.router.navigate(['/homeath/profile/' + this.login + '/edit']);
  }
  addFriend(){
    this.userService.addFriend(this.authenticationService.currentUserValue.username, this.login)
      .subscribe(
        data => {
          this.toastr.success(`${this.login} was added to friends`);
          this.isFriendFunction();
        },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });
  }
  isFriendFunction(){
    this.userService.isFriend(this.authenticationService.currentUserValue.username, this.login)
      .subscribe(
        (data: number) => {
          this.isFriend = data;
        },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });
  }
  deleteFriend(){
    this.userService.deleteFriend(this.authenticationService.currentUserValue.username, this.login)
      .subscribe(
        data => {
          this.toastr.success(`${this.login} was removed from friends`);
          this.isFriendFunction();
        },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });
    
  }

  getPhoto(imageName: string) {
    return `${environment.apiUrl}/files/download?filename=${imageName}`;
    //return 'https://ptetutorials.com/images/user-profile.png';
    //return 'https://upload.wikimedia.org/wikipedia/commons/d/d7/F-15C_carrying_AIM-9X_maneuvers_into_a_vertical_climb.jpg';
  }
}
