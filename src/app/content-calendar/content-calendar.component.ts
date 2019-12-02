import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {EventInput} from '@fullcalendar/core/structs/event';
import {SubscriptionLike} from 'rxjs';
import {BookService} from '../_services/book.service';

@Component({
  selector: 'app-content-calendar',
  templateUrl: './content-calendar.component.html',
  styleUrls: ['./content-calendar.component.css']
})
export class ContentCalendarComponent implements OnInit {

  calendarPlugins = [dayGridPlugin];
  calendarEvents: EventInput[] = [
    // { title: 'Test', date: '2019-11-11', url: '/home' },
    // { title: 'Test2', date: '2019-11-12', allDay: true }
  ];
  value: string;
  subscription: SubscriptionLike;

  constructor(private bookService: BookService) {
    this.showAll();
  }


  ngOnInit() {

  }

  showPersonalize() {
    this.value = 'personalize';
    this.subscription = this.bookService.getCalendarAnnouncement(this.value)
      .subscribe(data => { console.log(data); this.calendarEvents = data; });
  }

  showAll() {
    this.value = 'all';
    this.bookService.getCalendarAnnouncement(this.value)
      .subscribe(data => { console.log(data); this.calendarEvents = data; });
  }

}
