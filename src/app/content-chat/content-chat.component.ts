import { Component, OnInit, ElementRef, ViewChild, QueryList} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import {User, Message, Chat} from '../_models/interface';
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
  public chats: Chat[] = [];
  public username: string = "";
  public activeChat: number;
  public friends: User[] = [];
  public chatName: string = "";
  public editedChatName: string = "";
  public chatMembers: User[] = [];
  //friendsWhoAbleToAddToChat
  public friendsWhoAbleToAdd: User[] = [];
  public editChatTab: number = 0;

  constructor(private toastr: ToastrService,
    private chatService: ChatService,
    private userService: UserService,
    private authenticationService: AuthenticationService) {  }

  ngOnInit() {
    this.authenticationService.refreshToken();
    this.username = this.authenticationService.currentUserValue.username;
    this.getChats();

    this.userService.getFriends(this.username, 500, 0)///////TODO infinity scroll
      .subscribe(
        (data : User[]) => {
          this.friends = data;
        });
  }
  ngOnDestroy(){
    if(this.stompClient){
      this.disconnect();
    }
  }

  getChats(){
    this.chatService.getChats(this.username)
      .subscribe(
        (data : Chat[]) => {
          this.chats = data;
        });
  }

  clearCheckedFriendsAndName(){
    this.chatName = "";
    for (let friend of this.friends){
      friend.checked = false;
    }
  }
  //for add frined into new chat
  onClickCheckBox(friend: User){
    friend.checked = !friend.checked;
  }

  getMessagesHistory(chatId: number){
    this.chatService.getMessagesHistory(chatId)
      .subscribe(
        (data : Message[]) => {
          this.messages = data;
        });
  }

  createNewChat(){
    let addingFriends: string[] = [];
    for (let friend of this.friends) {
      if(friend.checked){
        addingFriends.push(friend.username);
      }

    }
    addingFriends.push(this.username);
    this.chatService.createNewChat(this.chatName, addingFriends)
      .subscribe((data) => {
        this.getChats();
        this.toastr.success(`Chat ${this.chatName} successfully created`);
      },
        error => {
          this.toastr.info(`${environment.errorMessage}`);
        });
  }

  isExistPerson(persons: User[], soughtPerson: User){
    for(let person of persons){
      if(person.username == soughtPerson.username){
        return true;
      }
    }
    soughtPerson.checked = false;
    return false;
  }

  getChatMembers(chatId: number){
    this.chatService.getChatMembers(chatId)
      .subscribe(
        (data : User[]) => {
          this.chatMembers = data;
          this.friendsWhoAbleToAdd = this.friends.filter(
            x => !this.isExistPerson(this.chatMembers, x));
        },
        error => {
          this.toastr.info(`${environment.errorMessage}`);
        });
  }

  editChat(){ 
    let removedMembers: string[] = [];
    for (let friend of this.chatMembers) {
      if(friend.checked){
        removedMembers.push(friend.username);
      }
    }

    let addedMembers: string[] = [];
    for (let friend of this.friendsWhoAbleToAdd) {
      if(friend.checked){
        addedMembers.push(friend.username);
      }
    }
    if(removedMembers.length > 0){
      if(window.confirm(`This will completely remove members from ${this.chatName}.`))
        this.commitEditChat(addedMembers, removedMembers);
    }
    else this.commitEditChat(addedMembers, removedMembers);
  }
  commitEditChat(addedMembers: string[], removedMembers: string[]){
    this.chatService.updateChat(this.activeChat, this.editedChatName, addedMembers, removedMembers)
      .subscribe(
          (data) => {
            this.toastr.success(`Chat successfully updated`);
            this.getChats();
          },
          error => {
            this.toastr.info(`${environment.errorMessage}`);
          });
  }
  prepareEditMenu(){
    this.editedChatName = this.chats.find(x => x.chatId === this.activeChat).chatName;
    //this.editChatTab = 0;
    this.getChatMembers(this.activeChat);
  }
  getAvatarPathByLogin(login: string){
    return this.getPhoto(this.chatMembers.find(x => x.username === login).avatarFilePath);
  }
  /*----websocket service block--------*/
  //onClick Chat select
  onClick(chatId: number){
    this.activeChat = chatId;
    this.messages = [];
    this.chatName = this.chats.find(x => x.chatId === this.activeChat).chatName;
    this.getChatMembers(this.activeChat);
    this.initializeWebSocketConnection();
    this.getMessagesHistory(chatId);
  }
  sendMessage() {
      let message: Message = { message: this.msg,
       fromName: this.username, toId: this.activeChat, dateTimeSend: null };
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
        return `${environment.apiUrl}/files/download?filename=${imageName}`;
        //return 'https://ptetutorials.com/images/user-profile.png';
  }
}
