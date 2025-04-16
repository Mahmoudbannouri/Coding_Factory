import { Component, ViewEncapsulation, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TaskBoardService } from './taskboard.service';
import { CrudModalComponent } from './crud-modal/crud-modal.component';
import { Task } from './taskboard.model';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-taskboard',
  templateUrl: './taskboard.component.html',
  styleUrls: ['./taskboard.component.scss'],
  providers: [TaskBoardService],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskboardComponent {

  @ViewChild('marketingTitle') titleInputRef: ElementRef;
  @ViewChild('marketingMessage') messageInputRef: ElementRef;

  BAG = "task-group";

  tasks: Task[];
  marketingTasks: Task[];
  uiDesigningTasks: Task[];
  developingTasks: Task[];
  managementTasks: Task[];

  constructor(private dragulaService: DragulaService, private elRef: ElementRef,
     private taskBoardService: TaskBoardService, private modalService: NgbModal,
     private ref: ChangeDetectorRef) {
    this.tasks = this.taskBoardService.tasks;
    this.loadTasks();
    dragulaService.drop(this.BAG)
      .subscribe(({ el, target }) => {
        this.updateTaskStatus(el.getAttribute('task-id'), target.id)
      });
  }

  loadTasks() {
    this.marketingTasks = this.tasks.filter((task: Task) => task.status === 'Marketing');
    this.uiDesigningTasks = this.tasks.filter((task: Task) => task.status === 'UI-Designing');
    this.developingTasks = this.tasks.filter((task: Task) => task.status === 'Developing');
    this.managementTasks = this.tasks.filter((task: Task) => task.status === 'Management');
    this.ref.markForCheck();
  }

  editTask(task: Task) {
    const modalRef = this.modalService.open(CrudModalComponent);
    modalRef.componentInstance.id = task.taskId; // should be the id
    modalRef.componentInstance.data = { title: task.taskTitle, message: task.taskMessage, type: task.status }; // should be the data

    modalRef.result.then((result) => {

      task.taskTitle = result.title;
      task.taskMessage = result.message;
      task.status = result.type;

      this.updateTaskStatus(task.taskId.toString(), task.status, task);


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

    let index = this.tasks.indexOf(currentTask);
    currentTask.status = status;
    currentTask.badgeClass = badgeClass;
    this.tasks.splice(index, 1, currentTask);
    this.tasks = [...this.tasks];
    this.loadTasks();
  }

  deleteTask(id: number) {
    let task: Task = this.tasks.find(x => x.taskId === id);
    let index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);
    this.tasks = [...this.tasks];
    this.loadTasks();
  }

  addTask() {
    const modalRef = this.modalService.open(CrudModalComponent);
    modalRef.componentInstance.id = 0; // should be the id
    modalRef.componentInstance.data = { title: '', message: '', type: 'Marketing' }; // should be the data

    modalRef.result.then((result) => {
      this.taskBoardService.addNewTask(result.title, result.message, result.type).subscribe(data => {
        this.tasks = data;
        this.loadTasks();
      });
    }).catch((error) => {
      console.log(error);
    });
  }


}
