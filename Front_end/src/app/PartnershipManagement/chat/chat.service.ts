import { Injectable } from '@angular/core';
import { Chat, UsersChat } from './chat.model';

@Injectable()
export class ChatService {

  constructor() { }

  public chat1: Chat[] = [
    new Chat(true, '', ['👋 Hey there!'], 'text'),
    new Chat(true, '', ['I am Kazem El Maker 🤖'], 'text'),
    new Chat(true, '', ['Your personal assistant 🌟'], 'text'),
    new Chat(true, '', ['How can I help you today? 😊'], 'text')
];

  


  public usersChat: UsersChat[] = [
    {
      userId: "1",
      name: "Elizabeth Elliott",
      avatar: "assets/img/portrait/small/avatar-s-2.png",
      lastChatTime: "9:04 PM",
      status: "online",
      isPinnedUser: true,
      isMuted: false,
      unreadMessageCount: "",
      isActiveChat: false,
      lastChatMessage: "Okay",
      chats: this.chat1
    },
   
    {
      userId: "3",
      name: "Kazem El maker",
      avatar: "assets/img/kazem.jpeg",
      lastChatTime: "2:14 AM",
      status: "away",
      isPinnedUser: false,
      isMuted: true,
      unreadMessageCount: "12",
      isActiveChat: true,
      lastChatMessage: "How can I help you",
      chats: this.chat1
    },
    
  ]





}
