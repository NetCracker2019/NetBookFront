import { Component, OnInit, OnDestroy } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {BookService} from "../_services/book.service";
import {SubscriptionLike} from "rxjs";


@Component({
  selector: 'app-content-chat',
  templateUrl: './content-chat.component.html',
  styleUrls: ['./content-chat.component.css']
})
export class ContentChatComponent implements OnInit, OnDestroy {
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
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
