export class UsersChat {
  userId: string;
  index: number;
  name: string;
  avatar: string;
  lastChatTime: string;
  status: string;
  isPinnedUser: boolean;
  isMuted: boolean;
  unreadMessageCount: string;
  isActiveChat: boolean;
  lastChatMessage: string;
  chats: Chat[];


  constructor(userId: string, index: number, name: string, avatar: string, lastChatTime: string, status: string, isPinnedUser: boolean, isMuted: boolean, unreadMessageCount: string, isActiveChat: boolean, lastChatMessage: string, chats: Chat[], ) {
    this.userId = userId;
    this.index = index;
    this.name = name;
    this.avatar = avatar;
    this.lastChatTime = lastChatTime;
    this.status = status;
    this.isPinnedUser = isPinnedUser;
    this.isMuted = isMuted;
    this.unreadMessageCount = unreadMessageCount;
    this.isActiveChat = isActiveChat;
    this.lastChatMessage = lastChatMessage;
    this.chats = chats;
  }

}

export class Chat {
  public isReceived: boolean; // true = received, false = sent
  public time: string;
  public messages: string[];
  public messageType: string; // text, audio, video

  constructor(isReceived: boolean, time: string, messages: string[], messageType: string) {
    this.isReceived = isReceived;
    this.time = time;
    this.messages = messages;
    this.messageType = messageType;
  }
}

