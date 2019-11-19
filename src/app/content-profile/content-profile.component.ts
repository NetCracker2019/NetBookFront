import { Component, OnInit } from '@angular/core';
import {User, Achievement, ShortBookDescription} from '../_models/interface';
import {UserService} from '../_services/user.service';
import {AlertService} from '../_services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content-profile',
  templateUrl: './content-profile.component.html',
  styleUrls: ['./content-profile.component.css']
})
export class ContentProfileComponent implements OnInit {


  private user: User = {} as User;
  private friends: User[];
  private favouriteBooks: ShortBookDescription[];
  private readingBooks: ShortBookDescription[];
  private readBooks: ShortBookDescription[];
  private achievement: Achievement = {} as Achievement;		
  private IsOwnProfile: boolean = false;
  private login: string;

  constructor(private userService: UserService,
   private activatedRoute: ActivatedRoute,
   private router: Router,
   private alertService: AlertService) {
    
    this.login = activatedRoute.snapshot.params['login'];
  }

  ngOnInit() {
  	
  	this.userService.getUser(this.login)
      .subscribe(
        (data : User) => {
          this.user = data;
        },
        (error) => {
          this.alertService.error(error);
          console.log(error);
        });

    this.userService.getAchievement(this.login)
      .subscribe(
        (data : Achievement) => {
          this.achievement = data;
        },
        (error) => {
          this.alertService.error(error);
          console.log(error);
        });

    this.userService.getFriends(this.login, 4, 0)
      .subscribe(
        (data : User[]) => {
          this.friends = data;
        },
        (error) => {
          this.alertService.error(error);
          console.log(error);
        });

    this.userService.getFavouriteBooks(this.login, 3, 0)
      .subscribe(
        (data : ShortBookDescription[]) => {
          this.favouriteBooks = data;
        },
        (error) => {
          this.alertService.error(error);
          console.log(error);
        });

    this.userService.getReadingBooks(this.login, 3, 0)
      .subscribe(
        (data : ShortBookDescription[]) => {
          this.readingBooks = data;
        },
        (error) => {
          this.alertService.error(error);
          console.log(error);
        });

    this.userService.getReadBooks(this.login, 3, 0)
      .subscribe(
        (data : ShortBookDescription[]) => {
          this.readBooks = data;
        },
        (error) => {
          this.alertService.error(error);
          console.log(error);
        });

  }
  goEdit(){
    this.router.navigate(['/homeath/profile/' + this.login + '/edit']);
  }

}
