import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../_services/notification.service";
import {Notification} from "../_models/interface";
import {environment} from "../../environments/environment";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})

export class NotificationListComponent implements OnInit {

  notifications: Notification[];

  constructor(public notificationService: NotificationService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.notificationService.getAllNotifications().subscribe((notifications) => {

      this.notifications = notifications
    })
  }

//getting link to go
  getNavigationLink(notification: Notification): string {
    switch (notification.notifTypeId) {
      case NotifType.addToFriend :
        return "/homeath/profile/" + notification.fromUserName.toString();
        break;
      case NotifType.friendAddBook :
        return "/homeath/search/" + notification.bookId.toString();
        break;
      case NotifType.friendGetAchiev :
        return "/homeath/profile/" + notification.fromUserName.toString();
        break;
      case NotifType.friendAddReview :
        return "/homeath/search/" + notification.bookId.toString();
        break;
      case NotifType.friendAddOverview :
        return "/homeath/search/" + notification.bookId.toString();
        break;
    }
  }

  AllNotifsMarkAsRead() {
    this.notificationService.markAllAsRead(this.notifications[0].userId).subscribe(() => {
    }, error => {
      this.toastr.error(`${environment.errorMessage}`);
    });
  }

  markOneNotifAsReadByNotifId(notification: Notification) {
    this.notificationService.markNotifAsReadByNotifId(notification).subscribe(() => {
    }, error => {
      this.toastr.error(`${environment.errorMessage}`);
    });
  }

  deleteAllNotifs() {
    this.notificationService.deleteAllNotificationsByUserId(this.notifications[0].userId).subscribe(() => {
    }, error => {
      this.toastr.error(`${environment.errorMessage}`);
    });
  }

}

//enum to understand what in switch-case, every case mean
enum NotifType {
  addToFriend = 1,
  friendAddBook,
  friendGetAchiev,
  friendAddReview,
  friendAddOverview,
}
