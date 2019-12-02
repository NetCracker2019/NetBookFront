import { Component, OnInit } from '@angular/core';
import {Menu} from '../_models/interface';
import {AuthenticationService} from '../_services/authentication.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  role: number;
  security: boolean;



  // Menu = [
  //   new Menu('Головна сторінка', 'announcement'),
  //   new Menu('Книги', 'books'),
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
//       this.security = false;
//     } else {
//       this.security = true;
//     }
//   }
// =======
  constructor(private authenticationService: AuthenticationService) {
    this.role = authenticationService.role;
    this.security = this.role != 4;
    console.log(this.security);
   }


  ngOnInit() {

  }

  Menu: Menu[] = [
    {name: 'Main page', url: 'announcement'},
    {name: 'Books', url: 'books'},
    {name: 'My profile', url: 'profile/' + this.authenticationService.currentUserValue.username},
    {name: 'Friends', url: 'friends/' + this.authenticationService.currentUserValue.username},
    {name: 'Recommendation', url: 'recommendations'},
    {name: 'Chat', url: 'chat'},
    {name: 'Achievements', url: 'achievements'},
    {name: 'Add book/announcement', url: 'newAnnouncement'}];

}
