import {Component, OnInit} from '@angular/core';
import {Notification} from '../_models/interface';
import {NotificationsService} from '../_services/notification.service';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  serviceNotifications?: Notification[] = [];
  troubleTicketsNotifications?: Notification[] = [];
  messageNotifications?: Notification[] = [];

  notifications?: Notification[] = [];
  role = null;
  userId = null;

  constructor(private notificationService: NotificationsService) {
  }

  ngOnInit() {
   this.notificationService.getAllNotReadNotificationsForUser(this.userId).subscribe();
   window.scrollTo(0, 0);
  }
}
