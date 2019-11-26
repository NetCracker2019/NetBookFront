import { Component, OnInit } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {BookService} from "../_services/book.service";


@Component({
  selector: 'app-content-chat',
  templateUrl: './content-chat.component.html',
  styleUrls: ['./content-chat.component.css']
})
export class ContentChatComponent implements OnInit {
  calendarPlugins = [dayGridPlugin];
  calendarEvents: EventInput[] = [
    // { title: 'Test', date: '2019-11-11', url: '/home' },
    // { title: 'Test2', date: '2019-11-12', allDay: true }
  ];
  value: string;

  constructor(private bookService: BookService) {
    this.showAll();
  }

  ngOnInit() {
  }

  showPersonalize() {
    this.value = 'personalize';
    this.bookService.getCalendarAnnouncement(this.value)
      .subscribe(data => { console.log(data); this.calendarEvents = data; });
  }

  showAll() {
    this.value = 'all';
    this.bookService.getCalendarAnnouncement(this.value)
      .subscribe(data => { console.log(data); this.calendarEvents = data; });
  }

}
