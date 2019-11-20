import { Component, OnInit } from '@angular/core';
import {User, Achievement} from '../_models/interface';
import {UserService} from '../_services/user.service';
import {AlertService} from '../_services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-content-friends',
  templateUrl: './content-friends.component.html',
  styleUrls: ['./content-friends.component.css']
})
export class ContentFriendsComponent implements OnInit {

  public peoples: User[];
  public achievement: Achievement;		
  private login: string;
  private sought: string;
  private page: number;
  private where: string;

  form: FormGroup;
  //TODO fix error msg
  constructor(private userService: UserService,
   private activatedRoute: ActivatedRoute,
   private router: Router,
   private alertService: AlertService) {
    
    this.login = activatedRoute.snapshot.params['login'];
    this.form = new FormGroup({
      sought: new FormControl(),
      where: new FormControl()
  		});
	}

  ngOnInit() {
  	this.activatedRoute.queryParams.subscribe(params => {
      this.sought = params['sought'];
      this.page = params['page'];
      this.where = params['where'];
      });

  	if(this.sought == null) this.sought = "";
  	if(this.page == null) this.page = 1;
  	if(this.where == null) this.where = "friends";



    this.userService.getPersons(this.login, this.sought, this.where, 10, this.page - 1)
      .subscribe(
        (data : User[]) => {
          this.peoples = data;
        },
        (error) => {
          this.alertService.error(error);
          console.log(error);
        });

  }
  find(){
  	console.log(this.activatedRoute);
    this.router.navigate(['homeath/friends/' + this.login + '?sought=' + this.form.controls.sought.value
     + '&where=' + this.form.controls.where.value + '&page=1']);

  }

}
