import { Component, ViewEncapsulation, ViewChild, ElementRef, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Task } from './taskboard-ngrx.model';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as TaskboadActions from './store/taskboard.actions';
import * as fromApp from '../store/app.reducer';
import { map } from 'rxjs/operators';
import { DragulaService } from 'ng2-dragula';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudModalComponent } from 'app/taskboard/crud-modal/crud-modal.component';

@Component({
  selector: 'app-ngrx-taskboard',
  templateUrl: './taskboard-ngrx.component.html',
  styleUrls: ['./taskboard-ngrx.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class TaskboardNGRXComponent implements OnInit, OnDestroy {

  @ViewChild('todoTitle') titleInputRef: ElementRef;
  @ViewChild('todoMessage') messageInputRef: ElementRef;
  subscription: Subscription;

  BAG = "task-group";


  tasks: Task[];
  marketingTasks: Task[];
  uiDesigningTasks: Task[];
  developingTasks: Task[];
  managementTasks: Task[];

  constructor(private elRef: ElementRef, private dragulaService: DragulaService, private store: Store<fromApp.AppState>,
    private ref: ChangeDetectorRef, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.subscription = this.store
      .select('task')
      .subscribe(data => {
        this.tasks = data.tasks;
        this.loadTasks();
        this.dragulaService.drop(this.BAG)
          .subscribe(({ el, target }) => {
            this.updateTaskStatus(el.getAttribute('task-id'), target.id)
          });
      });
  }

  loadTasks() {
    this.marketingTasks = this.tasks.filter((task: Task) => task.status === 'Marketing');
    this.uiDesigningTasks = this.tasks.filter((task: Task) => task.status === 'UI-Designing');
    this.developingTasks = this.tasks.filter((task: Task) => task.status === 'Developing');
    this.managementTasks = this.tasks.filter((task: Task) => task.status === 'Management');
    this.ref.markForCheck();
  }

  addTask() {
    const modalRef = this.modalService.open(CrudModalComponent);
    modalRef.componentInstance.id = 0; // should be the id
    modalRef.componentInstance.data = { title: '', message: '', type: 'Marketing' }; // should be the data

    modalRef.result.then((result) => {

      let newTask = this.task(result.title, result.message, result.type)

      this.store.dispatch(new TaskboadActions.AddTask(newTask));
    }).catch((error) => {
      console.log(error);
    });
  }


  editTask(task: Task) {
    const modalRef = this.modalService.open(CrudModalComponent);
    modalRef.componentInstance.id = task.taskId; // should be the id
    modalRef.componentInstance.data = { title: task.taskTitle, message: task.taskMessage, type: task.status }; // should be the data

    modalRef.result.then((result) => {

      let newTaskObj = this.createObject(task);

      newTaskObj.taskTitle = result.title;
      newTaskObj.taskMessage = result.message;
      newTaskObj.status = result.type;

      this.updateTaskStatus(newTaskObj.taskId.toString(), newTaskObj.status, newTaskObj);


    }).catch((error) => {
      console.log(error);
    });
  }

  updateTaskStatus(id: string, status: string, task?: Task) {
    let badgeClass = 'primary';

    if (status === 'Marketing') {
      badgeClass = 'primary'
    }
    else if (status === 'UI-Designing') {
      badgeClass = 'warning'
    }
    else if (status === 'Developing') {
      badgeClass = 'success'
    }
    else if (status === 'Management') {
      badgeClass = 'info'
    }

    let currentTask: Task;

    if (task) {
      currentTask = task;
    }
    else {
      currentTask = this.tasks.find(x => x.taskId === +id);
    }

    let newTaskObj = this.createObject(currentTask);

    newTaskObj.status = status;
    newTaskObj.badgeClass = badgeClass;

    let index = this.tasks.indexOf(this.tasks.find(x => x.taskId === currentTask.taskId));

    this.store.dispatch(
      new TaskboadActions.UpdateTask({
        index: index,
        newTask: newTaskObj
      })
    );
  }

  deleteTask(id: number) {
    let task: Task = this.tasks.find(x => x.taskId === id);
    let index = this.tasks.indexOf(task);
    this.store.dispatch(new TaskboadActions.DeleteTask(index));
  }

  task(title: string, message: string, type: string) {

    let badgeClass = 'primary';

    if (type === 'Marketing') {
      badgeClass = 'primary'
    }
    else if (type === 'UI-Designing') {
      badgeClass = 'warning'
    }
    else if (type === 'Developing') {
      badgeClass = 'success'
    }
    else if (type === 'Management') {
      badgeClass = 'info'
    }


    let task: Task = {
      taskId: Math.round(Math.random() * 10000000000),
      taskTitle: title,
      taskMessage: message,
      createdOn: 'Nov 12',
      createdBy: 'Elizabeth Elliott',
      assignedTo: ['assets/img/portrait/small/avatar-s-4.png'],
      status: type,
      badgeClass: badgeClass,
      messageType: 'text',
      messageCount: '',
      linkCount: '',
      isUserImg: true,
    }
    return task;

  }

  createObject(task) {

    return new Task(
      task.taskId,
      task.taskTitle,
      task.badgeClass,
      task.taskMessage,
      task.messageType,
      task.messageCount,
      task.linkCount,
      task.createdOn,
      task.createdBy,
      task.assignedTo,
      task.isUserImg,
      task.status
    )

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
