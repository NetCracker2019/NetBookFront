import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../_services/notification.service";
import {Notification} from "../_models/interface";


@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})

export class NotificationListComponent implements OnInit {

  notifications: Notification[];


  constructor(public notificationService: NotificationService) {
  }

  ngOnInit() {
    this.notificationService.getAllNotifications().subscribe((notifications) => {

      this.notifications = notifications
    })

  }

  getNavigationLink(notification: Notification) {
    switch (notification.notifTypeId) {
      case 1 :
        'friends';
        break;


    }

  }
}
