import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import {Menu} from "../_models/Menu";
=======
import {Menu} from '../_models/Menu';
>>>>>>> master

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  Menu = [
<<<<<<< HEAD
    new Menu("Головна сторінка", "announcement"),
    new Menu("Книги", "books"),
    new Menu("Мой профиль", "profile"),
    new Menu("Друзья", "friends"),
    new Menu("Рекомендации", "recommendations"),
    new Menu("Чат", "chat"),
    new Menu("Ачивки", "achievements"),
=======
    new Menu('Головна сторінка', 'announcement'),
    new Menu('Книги', 'books'),
    new Menu('Мой профиль', 'profile'),
    new Menu('Друзья', 'friends'),
    new Menu('Рекомендации', 'recommendations'),
    new Menu('Чат', 'chat'),
    new Menu('Ачивки', 'achievements'),
>>>>>>> master
  ];


  constructor() { }

  ngOnInit() {
  }

}
