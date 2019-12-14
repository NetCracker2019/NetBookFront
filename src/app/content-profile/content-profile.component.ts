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
  public achievements: Achievement[] = [];
  public isFriend = -1;
  public canEditable = false;
  private login: string;


  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.login = this.activatedRoute.snapshot.params.login;
    this.authenticationService.refreshToken();

    this.userService.getUser(this.login)
      .subscribe(
        (data: User) => {
          this.user = data;
        },
        error => {
          this.toastr.info(`User not found`);
          this.router.navigate(['/homeath/announcement']);
        });

    this.canEdit();

    this.userService.getAchievements(this.login)
      .subscribe(
        (data: Achievement[]) => {
          this.achievements = data;
        },
        error => {
          // this.toastr.error(`${environment.errorMessage}`);
        });

    this.userService.getFriends(this.login, 4, 0)
      .subscribe(
        (data: User[]) => {
          this.friends = data;
        },
        error => {
          // this.toastr.error(`${environment.errorMessage}`);
        });

    this.userService.getFavouriteBooks(this.login, '', 3, 0)
      .subscribe(
        (data: ShortBookDescription[]) => {
          this.favouriteBooks = data;
        },
        error => {
          // this.toastr.error(`${environment.errorMessage}`);
        });

    this.userService.getReadingBooks(this.login, '', 3, 0)
      .subscribe(
        (data: ShortBookDescription[]) => {
          this.readingBooks = data;
        });

    this.userService.getReadBooks(this.login, '', 3, 0)
      .subscribe(
        (data: ShortBookDescription[]) => {
          this.readBooks = data;
        });
  }
  goEdit() {
    this.router.navigate([`/homeath/profile/${this.login}/edit`]);
  }
  addFriend() {
    this.userService.addFriend(this.authenticationService.currentUserValue.username, this.login)
      .subscribe(
        () => {
          this.toastr.success(`${this.login} was added to friends`);
          this.isFriendFunction();
        },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });
  }
  isFriendFunction() {
    this.userService.isFriend(this.authenticationService.currentUserValue.username, this.login)
      .subscribe(
        (data: number) => {
          this.isFriend = data;
        },
        error => {
          // this.toastr.info(`${environment.errorMessage}`);
        });
  }
  deleteFriend() {
    this.userService.deleteFriend(this.authenticationService.currentUserValue.username, this.login)
      .subscribe(
        () => {
          this.toastr.success(`${this.login} was removed from friends`);
          this.isFriendFunction();
        },
        error => {
          this.toastr.info(`${environment.errorMessage}`);
        });

  }

  canEdit() {
    this.userService.isEditable(this.login)
    .subscribe(
      data => {
        if (!data && this.authenticationService.currentUserValue.role !== 4) {
          this.isFriend = -2;
        } else { this.isFriendFunction(); }

        this.canEditable = data;
        });
  }

  getPhoto(imageName: string) {
    return `${environment.apiUrl}/files/download?filename=${imageName}`;
  }
}
