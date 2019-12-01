import { Injectable } from '@angular/core';

import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';

import {User, Message} from '../_models/interface';
import {AuthenticationService} from '../_services/authentication.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) { }

  getChats(login: string) {
    return this.http.get<string[]>(`${environment.apiUrl}/chat/${login}/chats`);
  }

  getMessagesHistory(chatName: string){
  	return this.http.get<Message[]>(`${environment.apiUrl}/chat/${chatName}`);
  }

  isExistChatName(chatName: string){
  	return this.http.get<boolean>(`${environment.apiUrl}/chat/is-exist/${chatName}`);
  }

  createNewChat(chatName: string, members: string[]){
    return this.http.post<void>(`${environment.apiUrl}/chat/create/${chatName}`,members);
  }
  
  getChatMembers(chatName: string) {
    return this.http.get<User[]>(`${environment.apiUrl}/chat/${chatName}/members`);
  }

  changeChatName(oldChatName: string, newChatName: string){
    return this.http.put<void>(`${environment.apiUrl}/chat/rename/${oldChatName}`, newChatName);
  }

  addFriendsToChat(chatName: string, members: string[]){
    //console.log(JSON.stringify(members));
    return this.http.put<void>(`${environment.apiUrl}/chat/${chatName}/add-members`, members);
  }
}




