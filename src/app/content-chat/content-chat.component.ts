import {Component, OnInit, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import {User, Message, Chat} from '../_models/interface';
import {AuthenticationService} from '../_services/authentication.service';
import {ChatService} from '../_services/chat.service';
import {UserService} from '../_services/user.service';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-content-chat',
  templateUrl: './content-chat.component.html',
  styleUrls: ['./content-chat.component.css']
})
export class ContentChatComponent implements OnInit, OnDestroy {
  private stompClient;
  public msg = '';
  public messages: Message[] = [];
  public chats: Chat[] = [];
  public username = '';
  public activeChat: number;
  public friends: User[] = [];
  public chatName = '';
  public editedChatName = '';
  public chatMembers: User[] = [];
  // friendsWhoAbleToAddToChat
  public friendsWhoAbleToAdd: User[] = [];
  public editChatTab = 0;
  public activeChatAvatar = '';
  public namePattern = '^\\s*[a-zA-Z0-9а-яёАЯЁ_]+(?:\\s*[a-zA-Z0-9а-яёАЯЁ_]+)*\\s*$';
  private headers = {
    Authorization: this.authenticationService.currentUserValue.token};

  constructor(private toastr: ToastrService,
              private chatService: ChatService,
              private userService: UserService,
              private authenticationService: AuthenticationService) {  }

  ngOnInit() {
    this.authenticationService.refreshToken();
    this.username = this.authenticationService.currentUserValue.username;
    this.headers = {
      Authorization: this.authenticationService.currentUserValue.token };
    this.getChats();
    this.userService.getFriends(this.username, 500, 0)/////// TODO infinity scroll
      .subscribe(
        (data: User[]) => {
          this.friends = data;
        });
  }

  ngOnDestroy() {
    if (this.stompClient) {
      this.disconnect();
    }
    this.removeTempImage();
  }

  getChats() {
    this.chatService.getChats(this.username)
      .subscribe(
        (data: Chat[]) => {
          this.chats = data;
        });
  }

  clearCheckedFriendsAndName() {
    this.chatName = '';
    for (const friend of this.friends) {
      friend.checked = false;
    }
  }
  // for add frined into new chat
  onClickCheckBox(friend: User) {
    friend.checked = !friend.checked;
  }

  getMessagesHistory(chatId: number) {
    this.chatService.getMessagesHistory(chatId)
      .subscribe(
        (data: Message[]) => {
          this.messages = data;
        });
  }

  createNewChat() {
    const addingFriends: string[] = [];
    for (const friend of this.friends) {
      if (friend.checked) {
        addingFriends.push(friend.username);
      }

    }
    addingFriends.push(this.username);
    this.chatService.createNewChat(this.userService.escaping(this.chatName), addingFriends)
      .subscribe(() => {
        this.getChats();
        this.toastr.success(`Chat ${this.chatName} successfully created`);
      },
        error => {
          this.toastr.info(error);
        });
  }

  isExistPerson(persons: User[], soughtPerson: User) {
    for (const person of persons) {
      if (person.username === soughtPerson.username) {
        return true;
      }
    }
    soughtPerson.checked = false;
    return false;
  }

  getChatMembers(chatId: number) {
    this.chatService.getChatMembers(chatId)
      .subscribe(
        (data: User[]) => {
          this.chatMembers = data;
          this.friendsWhoAbleToAdd = this.friends.filter(
            x => !this.isExistPerson(this.chatMembers, x));
        },
        error => {
          this.toastr.info(error);
        });
  }

  editChat() {
    const removedMembers: string[] = [];
    for (const friend of this.chatMembers) {
      if (friend.checked) {
        removedMembers.push(friend.username);
      }
    }

    const addedMembers: string[] = [];
    for (const friend of this.friendsWhoAbleToAdd) {
      if (friend.checked) {
        addedMembers.push(friend.username);
      }
    }
    if (removedMembers.length > 0) {
      if (window.confirm(`This will completely remove members from ${this.chatName}.`)) {
        this.commitEditChat(addedMembers, removedMembers);
      }
    } else { this.commitEditChat(addedMembers, removedMembers); }
  }
  commitEditChat(addedMembers: string[], removedMembers: string[]) {
    this.chatService.updateChat(this.activeChat, this.userService.escaping(this.editedChatName),
     addedMembers, removedMembers, this.activeChatAvatar)
      .subscribe(
          () => {
            this.toastr.success(`Chat successfully updated`);
            this.getChats();
            this.activeChat = null;
          },
          error => {
            this.toastr.info(error);
          });
  }

  handleFileInput(files: FileList) {
    const fileToUpload = files.item(0);

    if ( fileToUpload != null) {
      const newFileName: string = uuid();
      this.userService.postFile(fileToUpload, newFileName).subscribe(
        () => {
          this.removeTempImage();
          this.activeChatAvatar = newFileName;
        },
        error => {
          this.toastr.info(`Picture size must be < 1 MB`);
        });
    }
  }
  removeTempImage() {
    if (this.activeChat && this.activeChatAvatar !== '' &&
      this.activeChatAvatar !== this.getChatAvatar()) {
      this.userService.removeFile(this.activeChatAvatar)
        .subscribe(() => {});
    }
  }
  prepareEditMenu() {
    this.editedChatName = this.chats.find(x => x.chatId === this.activeChat).chatName;
    this.getChatMembers(this.activeChat);
    this.activeChatAvatar = this.getChatAvatar();
    this.editChatTab = 0;
  }
  getAvatarPathByLogin(login: string) {
    return this.getPhoto(this.chatMembers.find(x => x.username === login).avatarFilePath);
  }
  getChatAvatar() {
    return this.chats.find(x => x.chatId === this.activeChat).chatAvatar;
  }
  /*----websocket service block--------*/
  // onClick Chat select
  onClick(chatId: number) {
    if (this.stompClient) { this.disconnect(); }
    this.removeTempImage();
    this.activeChat = chatId;
    this.messages = [];
    this.chatName = this.chats.find(x => x.chatId === this.activeChat).chatName;
    this.getChatMembers(this.activeChat);
    this.initializeWebSocketConnection();
    this.getMessagesHistory(chatId);
  }
  sendMessage() {
    if (this.msg.length < 1) { return; }
    const message: Message = { message: this.msg,
      fromName: this.username, toId: this.activeChat, dateTimeSend: null };
    this.stompClient.send(`/socket-subscriber/send/message/${this.activeChat}`,
      this.headers, JSON.stringify(message));
    this.msg = '';
  }

  initializeWebSocketConnection() {
    const socket = new WebSocket(`${environment.webSocket}`);
    this.stompClient = Stomp.over(socket);
    const that = this;
    this.stompClient.connect({
      Authorization: this.authenticationService.currentUserValue.token }, frame => {
      that.openSocket();
    });
  }

  openSocket() {
    this.stompClient.subscribe(`/socket-publisher/${this.activeChat}`, (message) => {
      this.handleResult(message);
    }, this.headers);
  }

  handleResult(message) {
    if (message.body) {
      const messageResult: Message = JSON.parse(message.body);
      this.messages.push(messageResult);
    }
  }

  disconnect() {
    this.stompClient.ws.close();
  }
  /*------------------*/
  getPhoto(imageName: string) {
    return `${environment.apiUrl}/files/download?filename=${imageName}`;
  }
}
