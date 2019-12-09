import { Component, OnInit } from '@angular/core';
import {Menu} from '../_models/interface';
import {AuthenticationService} from '../_services/authentication.service';
import {NotificationService} from "../_services/notification.service";


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  count:number ;
  role: number;
  securityApprove: boolean;
  securityAchievement: boolean;



  // Menu = [
  //   new Menu('Головна сторінка', 'announcement'),
  //   new Menu('Книги', 'announcements'),
  //   new Menu('Мой профиль', 'profile'),
  //   new Menu('Друзья', 'friends'),
  //   new Menu('Рекомендации', 'recommendations'),
  //   new Menu('Чат', 'chat'),
  //   new Menu('Ачивки', 'achievements'),
  // ];

// <<<<<<< HEAD
//
//   constructor(role: AuthenticationService) {
//     this.role = role.role;
//     if (role as any === 4) {
//       this.securityApprove = false;
//     } else {
//       this.securityApprove = true;
//     }
//   }
// =======
  constructor(private authenticationService: AuthenticationService,
  public notificationService:NotificationService) {
    this.role = authenticationService.role;
    this.securityApprove = this.role != 4;
    this.securityAchievement = this.role == 1 || this.role == 2;
    console.log(this.role);
   }


  ngOnInit() {

    this.notificationService.getCountForNotifs().subscribe(data => {
      this.count = data;
    });
  }

  Menu: Menu[] = [

    {name: 'Main page', url: 'announcement'},
    {name: 'Books', url: 'books'},
    {name: 'My profile', url: 'profile/' + this.authenticationService.currentUserValue.username},
    {name: 'Friends', url: 'friends/' + this.authenticationService.currentUserValue.username},
   // {name: 'Notification', url: 'notifications'},
    {name: 'Recommendation', url: 'recommendations'},
    {name: 'My books', url: `profile/${this.authenticationService.currentUserValue.username}/book-list`},
    {name: 'Calendar', url: 'calendar'},
    {name: 'Chat', url: 'chat'},
    // {name: 'Achievements', url: 'achievements'},
    {name: 'Add book/announcement', url: 'newAnnouncement'}];


}
