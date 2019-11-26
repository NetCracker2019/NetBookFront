import { Component, OnInit, } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import {User, Message} from '../_models/interface';
import {AuthenticationService} from '../_services/authentication.service';
import {ChatService} from '../_services/chat.service';
import {UserService} from '../_services/user.service';

@Component({
  selector: 'app-content-chat',
  templateUrl: './content-chat.component.html',
  styleUrls: ['./content-chat.component.css']
})
export class ContentChatComponent implements OnInit {
  private stompClient;
  public msg: string = "";
  public messages: Message[] = [];
  public chats: string[] = [];
  private username: string = "";
  private activeChat: string = "";
  private chatNameAlreadyExistError: boolean = false;
  public friends: User[] = [];
  public chatMembers: User[] = [];
  //friendsWhoAbleToAddToChat
  public friendsWhoAbleToAdd: User[] = [];

  constructor(private toastr: ToastrService,
  	private chatService: ChatService,
  	private userService: UserService,
  	private authenticationService: AuthenticationService) {

  	this.username = this.authenticationService.currentUserValue.username;
  	this.getChats();

    this.userService.getFriends(this.username, 50, 0)///////TODO infinity scroll
      .subscribe(
        (data : User[]) => {
          this.friends = data;
        });
  }

  ngOnInit() {
  	
  }
  ngOnDestroy(){
	  this.disconnect();
  }

  getChats(){
  	this.chatService.getChats(this.username)
      .subscribe(
        (data : string[]) => {
          this.chats = data;
        });
  }

  onClickCheckBox(username: string){
  	let checkbox = document.getElementById('checkbox' + username) as HTMLInputElement;
	checkbox.checked = !checkbox.checked;
  }

  onClickCheckBoxEditChat(username: string){
	let checkbox = document.getElementById('checkboxEditChat' + username) as HTMLInputElement;
	checkbox.checked = !checkbox.checked;
  }

  getMessagesHistory(chatName: string){
  	this.chatService.getMessagesHistory(chatName)
      .subscribe(
        (data : Message[]) => {
          this.messages = data;
        });
  }
  checkNameIfExist(){
  	let chatName = (document.getElementById('chat-name') as HTMLInputElement).value;
  	if(chatName != ""){
  		this.chatService.isExistChatName(chatName)
  		.subscribe(
        (data : boolean) => {
          if(!data){
          	this.createNewChat(chatName);
          }else{
          	this.chatNameAlreadyExistError = true;
          }
        });
  	}else{
  		this.chatNameAlreadyExistError = true;
  	}  	
  }

  createNewChat(chatName: string){
  	document.getElementById('closeModal').click();
  	let addingFriends: string[] = [];
  	for (let friend of this.friends) {
    	if((document.getElementById('checkbox' + friend.username) as HTMLInputElement).checked){
    		addingFriends.push(friend.username);
    	}
	}
	addingFriends.push(this.username);
	this.chatService.createNewChat(chatName, addingFriends)
      .subscribe((data) => {this.getChats()});
  }

  isExistPerson(persons: User[], soughtPerson: User){
  	for(let person of persons){
  		if(person.username == soughtPerson.username){
  			return true;
  		}
  	}
  	return false;
  }

  getChatMembers(chatName: string){
  	this.chatService.getChatMembers(chatName)
      .subscribe(
        (data : User[]) => {
          this.chatMembers = data;
          this.friendsWhoAbleToAdd = this.friends.filter(
          	x => !this.isExistPerson(this.chatMembers, x));
        });
  }

  editChat(){ //TODO refactor
  	let chatName = (document.getElementById('chat-name2') as HTMLInputElement).value;

  	if(chatName == ""){
  		this.chatNameAlreadyExistError = true;
  		console.log("fffff");
  	}else if(chatName != this.activeChat) {
  		this.chatService.isExistChatName(chatName)
  		.subscribe(
        (data : boolean) => {
        	console.log("qqqqq"  +data);
          if(!data){
          	document.getElementById('closeModal2').click();
          	let addingFriends: string[] = [];
          	for (let friend of this.friendsWhoAbleToAdd) {
          		if((document.getElementById('checkboxEditChat' + 
          			friend.username) as HTMLInputElement).checked){
          			addingFriends.push(friend.username);
          		}
          	}
			this.chatService.changeChatName(this.activeChat, chatName)
		      .subscribe((data) => {this.getChats()});

		    this.chatService.addFriendsToChat(chatName, addingFriends)
		      .subscribe((data) => {this.getChats()});
		     //TODO remove members
          }else{

          	document.getElementById('closeModal2').click();
          	let addingFriends: string[] = [];
          	for (let friend of this.friendsWhoAbleToAdd) {
          		if((document.getElementById('checkboxEditChat' + 
          			friend.username) as HTMLInputElement).checked){
          			addingFriends.push(friend.username);
          		}
          	}
		    this.chatService.addFriendsToChat(chatName, addingFriends)
		      .subscribe((data) => {this.getChats()});

		    //TODO remove members
          }
        });
  	}  	
  }


  /*----websocket service block--------*/
  //onClick Chat select
  onClick(chatName: string){
  	this.activeChat = chatName;
  	this.messages = [];
  	this.initializeWebSocketConnection();
  	this.getMessagesHistory(chatName);
  	this.getChatMembers(chatName);
  }
  sendMessage() {
      let message: Message = { message: this.msg,
       fromName: this.username, toName: this.activeChat, dateTimeSend: null };
      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(message));
      this.msg = '';
  }

  initializeWebSocketConnection() {
    //let ws = new SockJS(`${environment.apiUrl}/end-point`);
    let socket = new WebSocket(`${environment.webSocket}`);
    this.stompClient = Stomp.over(socket);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      that.openSocket()
    });
  }

  openSocket() {
    this.stompClient.subscribe(`/socket-publisher/${this.activeChat}`, (message) => {
      this.handleResult(message);
    });
  }

  handleResult(message){
    if (message.body) {
      let messageResult: Message = JSON.parse(message.body);
      console.log(messageResult);
      this.messages.push(messageResult);
    }
  }

  disconnect(){
  	this.stompClient.ws.close();
  	console.log("disconnectttt");
  }
  /*------------------*/
  getPhoto(imageName: string) {
        //return `${environment.apiUrl}/files/download?filename=${imageName}`;
        return 'https://ptetutorials.com/images/user-profile.png';
  }
}
