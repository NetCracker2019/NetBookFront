import { Component, OnInit } from '@angular/core';
import {Menu} from '../_models/interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  Menu: Menu[] = [
    {name: 'Главная страница', url: 'announcement'},
    {name: 'Книги', url: 'books'},
    {name: 'Мой профиль', url: 'profile'},
    {name: 'Друзья', url: 'friends'},
    {name: 'Рекомендации', url: 'recommendations'},
    {name: 'Чат', url: 'chat'},
    {name: 'Достижения', url: 'achievements'},
    {name: 'Добавить анонс', url: 'newAnnouncement'},
    ];

  // Menu = [
  //   new Menu('Головна сторінка', 'announcement'),
  //   new Menu('Книги', 'books'),
  //   new Menu('Мой профиль', 'profile'),
  //   new Menu('Друзья', 'friends'),
  //   new Menu('Рекомендации', 'recommendations'),
  //   new Menu('Чат', 'chat'),
  //   new Menu('Ачивки', 'achievements'),
  // ];


  constructor() { }

  ngOnInit() {
  }

}
