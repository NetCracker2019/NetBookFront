import { Component, OnInit } from '@angular/core';
import {Menu} from "../_models/Menu";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  Menu = [
    new Menu("Головна сторінка", "announcement"),
    new Menu("Книги", "books"),
    new Menu("Мой профиль", "profile"),
    new Menu("Друзья", "friends"),
    new Menu("Рекомендации", "recommendations"),
    new Menu("Чат", "chat"),
    new Menu("Ачивки", "achievements"),
  ];


  constructor() { }

  ngOnInit() {
  }

}
