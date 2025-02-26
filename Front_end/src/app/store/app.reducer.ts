import { ActionReducerMap } from '@ngrx/store';

import * as fromChat from '../chat-ngrx/store/chat.reducers';
import * as fromTaskboard from '../taskboard-ngrx/store/taskboard.reducers';

export interface AppState {
  chat: fromChat.State;
  task: fromTaskboard.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  chat: fromChat.chatReducer,
  task: fromTaskboard.taskReducer
};
