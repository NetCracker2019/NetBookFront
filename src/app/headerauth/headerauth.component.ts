import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../_services/authentication.service";
import {User} from "../_models";

@Component({
  selector: 'app-headerauth',
  templateUrl: './headerauth.component.html',
  styleUrls: ['./headerauth.component.css']
})
export class HeaderauthComponent implements OnInit {



  currentUser: User;

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
  }



  logout() {
    this.authenticationService.logoutuser();
    this.router.navigate(['/login']);
  }

}
