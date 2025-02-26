import { Action } from '@ngrx/store';

import { Task } from '../taskboard-ngrx.model';

export const ADD_TASK = 'ADD_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const DELETE_TASK = 'DELETE_TASK';

export class AddTask implements Action {
    readonly type = ADD_TASK;
    constructor(public payload: Task) { }
}

export class UpdateTask implements Action {
  readonly type = UPDATE_TASK;
  constructor(public payload: { index: number; newTask: Task }) {}
}

export class DeleteTask implements Action {
  readonly type = DELETE_TASK;
  constructor(public payload: number) { }
}


export type TaskActions = AddTask | UpdateTask | DeleteTask ;
