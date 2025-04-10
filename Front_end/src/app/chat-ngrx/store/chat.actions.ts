import { Action } from '@ngrx/store';

import { UsersChat } from '../chat-ngrx.model';

export const ADD_CHAT = '[Chat] Add Chat';


export class AddChat implements Action {
    readonly type = ADD_CHAT;

    constructor(public payload: { index: number; newChat: UsersChat }) {}
}


export type ChatActions =
| AddChat;
