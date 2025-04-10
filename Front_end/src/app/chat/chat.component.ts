import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy, Renderer2, Inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ChatService } from './chat.service';
import { Chat, UsersChat } from './chat.model';
import { DOCUMENT } from '@angular/common';
import { ConfigService } from 'app/shared/services/config.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./chat.component.scss'],
  providers: [ChatService]
})
export class ChatComponent implements OnInit, OnDestroy {

  chats: Chat[] = [];
  activeChat: UsersChat;
  usersChat: UsersChat[] = [];
  activeChatUser: string;
  activeChatUserImg: string;
  loggedInUserImg: string;
  newMessage = "";
  searchQuery: string = '';
  placement = "bottom-right";
  isContentOverlay = false;


  public config: any = {};
  layoutSub: Subscription;


  messages = new Array();
  item: number = 0;
  constructor(private elRef: ElementRef, private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private configService: ConfigService, private cdr: ChangeDetectorRef,
    private chatService: ChatService) {
    this.config = this.configService.templateConf;
    this.usersChat = chatService.usersChat;
    this.activeChat = chatService.usersChat.find(_ => _.isActiveChat);
    this.chats = this.activeChat.chats;
    this.activeChatUser = this.activeChat.name;
    this.activeChatUserImg = this.activeChat.avatar;
    this.loggedInUserImg = "assets/img/portrait/small/avatar-s-1.png"
    this.renderer.addClass(this.document.body, "chat-application");
  }

  ngOnInit() {
  }

  ngOnDestroy() {

    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }

    this.renderer.removeClass(this.document.body, "chat-application");
  }




  //send button function calls
  onAddMessage() {
    if (this.newMessage != "") {
      this.activeChat.chats.push({
        isReceived: false,
        time: "",
        messages: [this.newMessage],
        messageType: 'text'
      })
      this.newMessage = "";
    }
  }

  viewChat(chat: UsersChat) {

    this.usersChat.forEach(chat => {
      if (chat.userId === this.activeChat.userId) {
        chat.isActiveChat = false;
      }
    })

    this.activeChat = chat;
    this.activeChat.isActiveChat = true;
    this.chats = this.activeChat.chats;
    this.activeChatUser = this.activeChat.name;
    this.activeChatUserImg = this.activeChat.avatar;
    this.isContentOverlay = false;
  }


  onSidebarToggle() {
    this.isContentOverlay = true;
  }

  onContentOverlay() {
    this.isContentOverlay = false;
  }

}
