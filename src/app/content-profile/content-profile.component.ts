import { Component, OnInit } from '@angular/core';
import {User, Achievement, ShortBookDescription} from '../_models/interface';
import {UserService} from '../_services/user.service';
import {AlertService} from '../_services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {AuthenticationService} from '../_services/authentication.service';

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
  public isFriend: boolean = false;	
  public isOwnProfile: boolean = false;
  private login: string;


  constructor(private userService: UserService,
   private activatedRoute: ActivatedRoute,
   private router: Router,
   private authenticationService: AuthenticationService,
   private alertService: AlertService) {

   this.login = activatedRoute.snapshot.params['login'];
   this.authenticationService.refreshToken();
   this.isFriendFunction();
  }

  ngOnInit() {
  	this.userService.getUser(this.login)
      .subscribe(
        (data : User) => {
          this.user = data;
        });
    
    if(this.authenticationService.currentUserValue.username == this.login){
      this.isOwnProfile = true;
    }
    this.userService.getAchievement(this.login)
      .subscribe(
        (data : Achievement) => {
          this.achievement = data;
        });

    this.userService.getFriends(this.login, 4, 0)
      .subscribe(
        (data : User[]) => {
          this.friends = data;
        });

    this.userService.getFavouriteBooks(this.login, "", 3, 0)
      .subscribe(
        (data : ShortBookDescription[]) => {
          this.favouriteBooks = data;
        });

    this.userService.getReadingBooks(this.login, "", 3, 0)
      .subscribe(
        (data : ShortBookDescription[]) => {
          this.readingBooks = data;
        });

    this.userService.getReadBooks(this.login, "", 3, 0)
      .subscribe(
        (data : ShortBookDescription[]) => {
          this.readBooks = data;
        });

  }
  goEdit(){
    this.router.navigate(['/homeath/profile/' + this.login + '/edit']);
  }
  addFriend(){
    this.userService.addFriend(this.authenticationService.currentUserValue.username, this.login)
      .subscribe(
        data => {
          this.alertService.success(this.login + 'додано до друзів');
          window.location.reload();
        });
  }
  isFriendFunction(){
    this.userService.isFriend(this.authenticationService.currentUserValue.username, this.login)
      .subscribe(
        (data: boolean) => {
          this.isFriend = data;
        });
  }
  deleteFriend(){
    this.userService.deleteFriend(this.authenticationService.currentUserValue.username, this.login)
      .subscribe(
        data => {
          this.alertService.success(this.login + 'видалено з друзів');
          window.location.reload();
        });
    
  }

  getPhoto(imageName: string) {
        return `${environment.apiUrl}/files/download?filename=${imageName}`;
  }
}
