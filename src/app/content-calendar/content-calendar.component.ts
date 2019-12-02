import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {EventInput} from '@fullcalendar/core/structs/event';
import {SubscriptionLike} from 'rxjs';
import {BookService} from '../_services/book.service';
import {AuthorService} from "../_services/author.service";
import {AuthenticationService} from "../_services/authentication.service";

@Component({
  selector: 'app-content-calendar',
  templateUrl: './content-calendar.component.html',
  styleUrls: ['./content-calendar.component.css']
})
export class ContentCalendarComponent implements OnInit {

  currentUser: string;
  calendarPlugins = [dayGridPlugin];
  calendarEvents: EventInput[] = [
     { title: 'Test', date: '2019-11-11', url: '/home', color: '#378006'},
    // { title: 'Test2', date: '2019-11-12', allDay: true }
  ];
  value: string;
  subscription: SubscriptionLike;

  constructor(private bookService: BookService,
              private authenticationService: AuthenticationService) {
    this.currentUser = this.authenticationService.currentUserValue.username;
    this.showAll();
  }


  ngOnInit() {

  }

  showPersonalize() {
    this.value = 'personalize';
    this.subscription = this.bookService.getCalendarAnnouncement(this.value, this.currentUser)
      .subscribe(data => { console.log(data); this.calendarEvents = data; });
  }

  showAll() {
    this.value = 'all';
    this.bookService.getCalendarAnnouncement(this.value, this.currentUser)
      .subscribe(data => { console.log(data); this.calendarEvents = data; });
  }

}
