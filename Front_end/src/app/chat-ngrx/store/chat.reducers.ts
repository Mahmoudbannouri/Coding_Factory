import { UsersChat, Chat } from '../chat-ngrx.model';
import * as ChatActions from './chat.actions';

export interface State {
  usersChat: UsersChat[];
}

const initialState: State = {


  usersChat: [
    {
      userId: "1",
      index: 0,
      name: "Elizabeth Elliott",
      avatar: "assets/img/portrait/small/avatar-s-2.png",
      lastChatTime: "9:04 PM",
      status: "online",
      isPinnedUser: true,
      isMuted: false,
      unreadMessageCount: "",
      isActiveChat: false,
      lastChatMessage: "Okay",
      chats: [
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
      ]
    },
    {
      userId: "2",
      index: 1,
      name: "Lucas Howell",
      avatar: "assets/img/portrait/small/avatar-s-7.png",
      lastChatTime: "4:14 AM",
      status: "busy",
      isPinnedUser: false,
      isMuted: false,
      unreadMessageCount: "3",
      isActiveChat: false,
      lastChatMessage: "Thank you",
      chats: [
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
      ]
    },
    {
      userId: "3",
      index: 2,
      name: "Sarah Woods",
      avatar: "assets/img/portrait/small/avatar-s-8.png",
      lastChatTime: "2:14 AM",
      status: "away",
      isPinnedUser: false,
      isMuted: true,
      unreadMessageCount: "12",
      isActiveChat: true,
      lastChatMessage: "Hello John!",
      chats: [
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
      ]
    },
    {
      userId: "4",
      index: 3,
      name: "Layla Allen",
      avatar: "assets/img/portrait/small/avatar-s-20.png",
      lastChatTime: "Yesterday",
      status: "online",
      isPinnedUser: false,
      isMuted: false,
      unreadMessageCount: "",
      isActiveChat: false,
      lastChatMessage: "I love you",
      chats: [
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
      ]
    },
    {
      userId: "5",
      index: 4,
      name: "Bruce Reid",
      avatar: "assets/img/portrait/small/avatar-s-5.png",
      lastChatTime: "Yesterday",
      status: "offline",
      isPinnedUser: false,
      isMuted: false,
      unreadMessageCount: "",
      isActiveChat: false,
      lastChatMessage: "Will connect you",
      chats: [
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
      ]
    },
    {
      userId: "6",
      index: 5,
      name: "Krish Candy",
      avatar: "assets/img/portrait/small/avatar-s-9.png",
      lastChatTime: "Wednesday",
      status: "away",
      isPinnedUser: false,
      isMuted: false,
      unreadMessageCount: "4",
      isActiveChat: false,
      lastChatMessage: "Thank you",
      chats: [
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
      ]
    },
    {
      userId: "7",
      index: 6,
      name: "Kelly Reyes",
      avatar: "assets/img/portrait/small/avatar-s-4.png",
      lastChatTime: "Thrusday",
      status: "busy",
      isPinnedUser: false,
      isMuted: false,
      unreadMessageCount: "",
      isActiveChat: false,
      lastChatMessage: "😎🙂😃",
      chats: [
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
      ]
    },
    {
      userId: "8",
      index: 7,
      name: "Vincent Nelson",
      avatar: "assets/img/portrait/small/avatar-s-14.png",
      lastChatTime: "Friday",
      status: "online",
      isPinnedUser: false,
      isMuted: false,
      unreadMessageCount: "",
      isActiveChat: false,
      lastChatMessage: "Who you are?",
      chats: [
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
      ]
    },
    {
      userId: "9",
      index: 8,
      name: "William Wright",
      avatar: "assets/img/portrait/small/avatar-s-23.png",
      lastChatTime: "1 week ago",
      status: "offline",
      isPinnedUser: false,
      isMuted: false,
      unreadMessageCount: "6",
      isActiveChat: false,
      lastChatMessage: "How was the day?",
      chats: [
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
      ]
    },
    {
      userId: "10",
      index: 9,
      name: "Novah Miller",
      avatar: "assets/img/portrait/small/avatar-s-26.png",
      lastChatTime: "1 month ago",
      status: "away",
      isPinnedUser: false,
      isMuted: false,
      unreadMessageCount: "",
      isActiveChat: false,
      lastChatMessage: "There you are!",
      chats: [
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
      ]
    }
  ]

};

export function chatReducer(state = initialState, action: ChatActions.ChatActions) {
  switch (action.type) {
    case (ChatActions.ADD_CHAT):

      const updatedChat = {
        ...state.usersChat[action.payload.index],
        ...action.payload.newChat
      };


      const updatedChats = [...state.usersChat];
      updatedChats[action.payload.index] = updatedChat;

      return {
        ...state,
        usersChat: updatedChats
      };

    default:
      return state;
  }
}
