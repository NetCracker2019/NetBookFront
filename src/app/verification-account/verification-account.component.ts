import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../_services/user.service";

@Component({
  selector: 'app-verification-account',
  templateUrl: './verification-account.component.html',
  styleUrls: ['./verification-account.component.css']
})
export class VerificationAccountComponent implements OnInit {



  public token: string;
  public status: string;

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];

    });


    this.userService.confirmUserAccountRequest(this.token)
      .subscribe(
        data => {
          //this.alertService.success('Registration successful', true);
          this.router.navigate(['/login']);
          console.log(data);
        },
        error => {
          //this.alertService.error(error);

          if (error.error instanceof Error) {
            console.log('Client-side error occured.');
          } else {
            console.log('Server-side error occured.');
          }
          console.log(error.name);
          console.log(error.message);
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        });
  }


}
