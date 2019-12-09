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
  unreadNotifs:Notification[];

  constructor(public notificationService: NotificationService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.notificationService.getAllNotifications().subscribe((notifications) => {

      this.notifications = notifications
    })
  }



  /*1 add to friend
  2 add book
  3 friend achiev
  4 friend add review
  5 friend add overview
  */
  getNavigationLink(notification: Notification): string {
    switch (notification.notifTypeId) {
      case 1 :
        return "/homeath/profile/" + notification.fromUserName.toString();
        break;
      case 2 :
        return "/homeath/search/" + notification.bookId.toString();
        break;
      case 3 :
        return "/homeath/profile/" + notification.fromUserName.toString();
        break;
      case 4 :
        return "/homeath/search/" + notification.bookId.toString();
        break;
      case 5 :
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
  /*deleteAllNotifs() {
    this.notificationService.deleteAllNotificationsByUserId(this.notifications[0].userId).subscribe(() => {
    }, error => {
      this.toastr.error(`${environment.errorMessage}`);
    });
  }*/

  markOneNotifAsReadByNotifId(notification: Notification) {
    this.notificationService.markNotifAsReadByNotifId(notification).subscribe(() => {
    }, error => {
      this.toastr.error(`${environment.errorMessage}`);
    });
  }




}
