import { Injectable } from '@angular/core';
import { Chat, UsersChat } from './chat.model';

@Injectable()
export class ChatService {

  constructor() { }

  public chat1: Chat[] = [
    new Chat(
      false,
      '',
      [
        'How can we help? We are here for you!'
      ],
      'text'),
    new Chat(
      true,
      '',
      [
        'Hey John, I am looking for the best admin template.',
        'Could you please help me to find it out?',
        'It should be angular 9 bootstrap compatible.'
      ]
      , 'text'),
    new Chat(
      false,
      '30 minutes ago',
      [
        'Absolutely!',
        'Apex admin is the responsive angular 9 bootstrap admin template.'
      ]
      , 'text'),
    new Chat(
      true,
      '1 hour ago',
      [
        'Looks clean and fresh UI.',
        'It is perfect for my next project.',
        'How can I purchase it?'
      ]
      , 'text'),
    new Chat(
      false,
      '',
      [
        'Thanks, from ThemeForest.'
      ]
      , 'text'),
    new Chat(
      true,
      '',
      [
        'I will purchase it for sure.',
        'Thanks.'
      ]
      , 'text'),
  ];
  public chat2: Chat[] = [
    new Chat(
      false,
      '',
      [
        'How can we help? We are here for you!'
      ],
      'text'),
    new Chat(
      true,
      '',
      [
        'Hey John, I am looking for the best admin template.',
        'Could you please help me to find it out?',
        'It should be angular 9 bootstrap compatible.'
      ]
      , 'text'),
    new Chat(
      false,
      '30 minutes ago',
      [
        'Absolutely!',
        'Apex admin is the responsive angular 9 bootstrap admin template.'
      ]
      , 'text'),
    new Chat(
      true,
      '1 hour ago',
      [
        'Looks clean and fresh UI.',
        'It is perfect for my next project.',
        'How can I purchase it?'
      ]
      , 'text'),
    new Chat(
      false,
      '',
      [
        'Thanks, from ThemeForest.'
      ]
      , 'text'),
    new Chat(
      true,
      '',
      [
        'I will purchase it for sure.',
        'Thanks.'
      ]
      , 'text'),
  ];
  public chat3: Chat[] = [
    new Chat(
      false,
      '',
      [
        'How can we help? We are here for you!'
      ],
      'text'),
    new Chat(
      true,
      '',
      [
        'Hey John, I am looking for the best admin template.',
        'Could you please help me to find it out?',
        'It should be angular 9 bootstrap compatible.'
      ]
      , 'text'),
    new Chat(
      false,
      '30 minutes ago',
      [
        'Absolutely!',
        'Apex admin is the responsive angular 9 bootstrap admin template.'
      ]
      , 'text'),
    new Chat(
      true,
      '1 hour ago',
      [
        'Looks clean and fresh UI.',
        'It is perfect for my next project.',
        'How can I purchase it?'
      ]
      , 'text'),
    new Chat(
      false,
      '',
      [
        'Thanks, from ThemeForest.'
      ]
      , 'text'),
    new Chat(
      true,
      '',
      [
        'I will purchase it for sure.',
        'Thanks.'
      ]
      , 'text'),
  ];
  public chat4: Chat[] = [
    new Chat(
      false,
      '',
      [
        'How can we help? We are here for you!'
      ],
      'text'),
    new Chat(
      true,
      '',
      [
        'Hey John, I am looking for the best admin template.',
        'Could you please help me to find it out?',
        'It should be angular 9 bootstrap compatible.'
      ]
      , 'text'),
    new Chat(
      false,
      '30 minutes ago',
      [
        'Absolutely!',
        'Apex admin is the responsive angular 9 bootstrap admin template.'
      ]
      , 'text'),
    new Chat(
      true,
      '1 hour ago',
      [
        'Looks clean and fresh UI.',
        'It is perfect for my next project.',
        'How can I purchase it?'
      ]
      , 'text'),
    new Chat(
      false,
      '',
      [
        'Thanks, from ThemeForest.'
      ]
      , 'text'),
    new Chat(
      true,
      '',
      [
        'I will purchase it for sure.',
        'Thanks.'
      ]
      , 'text'),
  ];
  public chat5: Chat[] = [
    new Chat(
      false,
      '',
      [
        'How can we help? We are here for you!'
      ],
      'text'),
    new Chat(
      true,
      '',
      [
        'Hey John, I am looking for the best admin template.',
        'Could you please help me to find it out?',
        'It should be angular 9 bootstrap compatible.'
      ]
      , 'text'),
    new Chat(
      false,
      '30 minutes ago',
      [
        'Absolutely!',
        'Apex admin is the responsive angular 9 bootstrap admin template.'
      ]
      , 'text'),
    new Chat(
      true,
      '1 hour ago',
      [
        'Looks clean and fresh UI.',
        'It is perfect for my next project.',
        'How can I purchase it?'
      ]
      , 'text'),
    new Chat(
      false,
      '',
      [
        'Thanks, from ThemeForest.'
      ]
      , 'text'),
    new Chat(
      true,
      '',
      [
        'I will purchase it for sure.',
        'Thanks.'
      ]
      , 'text'),
  ];
  public chat6: Chat[] = [
    new Chat(
      false,
      '',
      [
        'How can we help? We are here for you!'
      ],
      'text'),
    new Chat(
      true,
      '',
      [
        'Hey John, I am looking for the best admin template.',
        'Could you please help me to find it out?',
        'It should be angular 9 bootstrap compatible.'
      ]
      , 'text'),
    new Chat(
      false,
      '30 minutes ago',
      [
        'Absolutely!',
        'Apex admin is the responsive angular 9 bootstrap admin template.'
      ]
      , 'text'),
    new Chat(
      true,
      '1 hour ago',
      [
        'Looks clean and fresh UI.',
        'It is perfect for my next project.',
        'How can I purchase it?'
      ]
      , 'text'),
    new Chat(
      false,
      '',
      [
        'Thanks, from ThemeForest.'
      ]
      , 'text'),
    new Chat(
      true,
      '',
      [
        'I will purchase it for sure.',
        'Thanks.'
      ]
      , 'text'),
  ];
  public chat7: Chat[] = [
    new Chat(
      false,
      '',
      [
        'How can we help? We are here for you!'
      ],
      'text'),
    new Chat(
      true,
      '',
      [
        'Hey John, I am looking for the best admin template.',
        'Could you please help me to find it out?',
        'It should be angular 9 bootstrap compatible.'
      ]
      , 'text'),
    new Chat(
      false,
      '30 minutes ago',
      [
        'Absolutely!',
        'Apex admin is the responsive angular 9 bootstrap admin template.'
      ]
      , 'text'),
    new Chat(
      true,
      '1 hour ago',
      [
        'Looks clean and fresh UI.',
        'It is perfect for my next project.',
        'How can I purchase it?'
      ]
      , 'text'),
    new Chat(
      false,
      '',
      [
        'Thanks, from ThemeForest.'
      ]
      , 'text'),
    new Chat(
      true,
      '',
      [
        'I will purchase it for sure.',
        'Thanks.'
      ]
      , 'text'),
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
      userId: "2",
      name: "Lucas Howell",
      avatar: "assets/img/portrait/small/avatar-s-7.png",
      lastChatTime: "4:14 AM",
      status: "busy",
      isPinnedUser: false,
      isMuted: false,
      unreadMessageCount: "3",
      isActiveChat: false,
      lastChatMessage: "Thank you",
      chats: this.chat2
    },
    {
      userId: "3",
      name: "Sarah Woods",
      avatar: "assets/img/portrait/small/avatar-s-8.png",
      lastChatTime: "2:14 AM",
      status: "away",
      isPinnedUser: false,
      isMuted: true,
      unreadMessageCount: "12",
      isActiveChat: true,
      lastChatMessage: "Hello John!",
      chats: this.chat3
    },
    {
      userId: "4",
      name: "Layla Allen",
      avatar: "assets/img/portrait/small/avatar-s-20.png",
      lastChatTime: "Yesterday",
      status: "online",
      isPinnedUser: false,
      isMuted: false,
      unreadMessageCount: "",
      isActiveChat: false,
      lastChatMessage: "I love you",
      chats: this.chat4
    },
    {
      userId: "5",
      name: "Bruce Reid",
      avatar: "assets/img/portrait/small/avatar-s-5.png",
      lastChatTime: "Yesterday",
      status: "offline",
      isPinnedUser: false,
      isMuted: false,
      unreadMessageCount: "",
      isActiveChat: false,
      lastChatMessage: "Will connect you",
      chats: this.chat5
    },
    {
      userId: "6",
      name: "Krish Candy",
      avatar: "assets/img/portrait/small/avatar-s-9.png",
      lastChatTime: "Wednesday",
      status: "away",
      isPinnedUser: false,
      isMuted: false,
      unreadMessageCount: "4",
      isActiveChat: false,
      lastChatMessage: "Thank you",
      chats: this.chat6
    },
    {
      userId: "7",
      name: "Kelly Reyes",
      avatar: "assets/img/portrait/small/avatar-s-4.png",
      lastChatTime: "Thrusday",
      status: "busy",
      isPinnedUser: false,
      isMuted: false,
      unreadMessageCount: "",
      isActiveChat: false,
      lastChatMessage: "😎🙂😃",
      chats: this.chat7
    },
    {
      userId: "8",
      name: "Vincent Nelson",
      avatar: "assets/img/portrait/small/avatar-s-14.png",
      lastChatTime: "Friday",
      status: "online",
      isPinnedUser: false,
      isMuted: false,
      unreadMessageCount: "",
      isActiveChat: false,
      lastChatMessage: "Who you are?",
      chats: this.chat1
    },
    {
      userId: "9",
      name: "William Wright",
      avatar: "assets/img/portrait/small/avatar-s-23.png",
      lastChatTime: "1 week ago",
      status: "offline",
      isPinnedUser: false,
      isMuted: false,
      unreadMessageCount: "6",
      isActiveChat: false,
      lastChatMessage: "How was the day?",
      chats: this.chat3
    },
    {
      userId: "10",
      name: "Novah Miller",
      avatar: "assets/img/portrait/small/avatar-s-26.png",
      lastChatTime: "1 month ago",
      status: "away",
      isPinnedUser: false,
      isMuted: false,
      unreadMessageCount: "",
      isActiveChat: false,
      lastChatMessage: "There you are!",
      chats: this.chat5
    }
  ]





}
