import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy, Renderer2, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { Chat, UsersChat } from './chat-ngrx.model';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as ChatActions from './store/chat.actions';
import * as fromApp from '../store/app.reducer';
import { ConfigService } from 'app/shared/services/config.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-ngrx-chat',
  templateUrl: './chat-ngrx.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./chat-ngrx.component.scss']
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
  subscription: Subscription;

  public config: any = {};
  layoutSub: Subscription;

  messages = new Array();
  item: number = 0;
  constructor(private elRef: ElementRef, private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private configService: ConfigService, private cdr: ChangeDetectorRef,
    private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {

    this.config = this.configService.templateConf;

    this.subscription = this.store
      .select('chat')
      .subscribe(data => {
        this.usersChat = data.usersChat;
        this.activeChat = data.usersChat.find(_ => _.isActiveChat);
        this.chats = this.activeChat ? this.activeChat.chats : [];
        this.activeChatUser = this.activeChat ? this.activeChat.name : '';
        this.activeChatUserImg = this.activeChat ? this.activeChat.avatar : '';
        this.loggedInUserImg = "assets/img/portrait/small/avatar-s-1.png"
      });

    this.renderer.addClass(this.document.body, "chat-application");

  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }

    this.renderer.removeClass(this.document.body, "chat-application");
  }

  onSidebarToggle() {
    this.isContentOverlay = true;
  }

  onContentOverlay() {
    this.isContentOverlay = false;
  }

  //send button function calls
  onAddMessage() {

    if (this.newMessage != "") {

      const newChat = new UsersChat(

        this.activeChat.userId,
        this.activeChat.index,
        this.activeChat.name,
        this.activeChat.avatar,
        this.activeChat.lastChatTime,
        this.activeChat.status,
        this.activeChat.isPinnedUser,
        this.activeChat.isMuted,
        this.activeChat.unreadMessageCount,
        this.activeChat.isActiveChat,
        this.activeChat.lastChatMessage,
        this.activeChat.chats.concat({
          isReceived: false,
          time: "",
          messages: [this.newMessage],
          messageType: 'text'
        })
      );
      this.store.dispatch(new ChatActions.AddChat({
        index: newChat.index,
        newChat: newChat
      })
      );
    }
    this.newMessage = "";
  }

  viewChat(chat: UsersChat) {

    let allChats = [...this.usersChat];

    let deactivateChat: UsersChat;

    allChats.forEach(thisChat => {
      if (thisChat.userId === this.activeChat.userId) {

        deactivateChat = new UsersChat(
          thisChat.userId,
          thisChat.index,
          thisChat.name,
          thisChat.avatar,
          thisChat.lastChatTime,
          thisChat.status,
          thisChat.isPinnedUser,
          thisChat.isMuted,
          thisChat.unreadMessageCount,
          false,
          thisChat.lastChatMessage,
          thisChat.chats
        );
      }
    });

    const activeNewChat = new UsersChat(
      chat.userId,
      chat.index,
      chat.name,
      chat.avatar,
      chat.lastChatTime,
      chat.status,
      chat.isPinnedUser,
      chat.isMuted,
      chat.unreadMessageCount,
      true,
      chat.lastChatMessage,
      chat.chats
    );

    [new ChatActions.AddChat({
      index: deactivateChat.index,
      newChat: deactivateChat
    }), new ChatActions.AddChat({
      index: activeNewChat.index,
      newChat: activeNewChat
    })].forEach(action => this.store.dispatch(action));

    this.isContentOverlay = false;

  }

}
