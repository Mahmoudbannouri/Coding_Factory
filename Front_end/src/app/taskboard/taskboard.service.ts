import { Injectable } from '@angular/core';
import { Task } from './taskboard.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';


@Injectable()
export class TaskBoardService {

  constructor() { }

  public tasks: Task[] = [
    new Task(
      1,
      'Responsive',
      'primary',
      'Check responsive and change SCSS accordingly.',
      'text',
      "1",
      "3",
      'Feb 6',
      'Elizabeth Elliott',
      ['assets/img/portrait/small/avatar-s-2.png', 'assets/img/portrait/small/avatar-s-3.png'],
      true,
      'Marketing'),
    new Task(
      2,
      'Users',
      'primary',
      'Companies of all shapes and sizes use Apex.',
      'text',
      "",
      "",
      'March 19',
      'Elizabeth Elliott',
      [{name: 'E', class: 'warning'}],
      false,
      'Marketing'),
    new Task(
      3,
      'Laptops',
      'primary',
      'Dell laptops are among the most well known laptops.',
      'text',
      "2",
      "1",
      '',
      'Elizabeth Elliott',
      ['assets/img/portrait/small/avatar-s-6.png'],
      true,
      'Marketing'),
    new Task(
      4,
      'Pick up Jane',
      'warning',
      'assets/img/banner/banner-10.jpg',
      'image',
      "",
      "",
      '',
      'Elizabeth Elliott',
      [],
      true,
      'UI-Designing'),
    new Task(
      5,
      'Navigation',
      'warning',
      'Design a prototype.',
      'text',
      "",
      "6",
      '',
      'Elizabeth Elliott',
      ['assets/img/portrait/small/avatar-s-7.png', 'assets/img/portrait/small/avatar-s-8.png', 'assets/img/portrait/small/avatar-s-9.png', 'assets/img/portrait/small/avatar-s-10.png'],
      true,
      'UI-Designing'),
    new Task(
      6,
      'Bootstrap 4',
      'warning',
      'Bootstrap is an open source toolkit for developing with HTML, CSS, and JS.',
      'text',
      "4",
      "",
      'Dec 3',
      'Elizabeth Elliott',
      ['assets/img/portrait/small/avatar-s-11.png', 'assets/img/portrait/small/avatar-s-12.png'],
      true,
      'UI-Designing'),
    new Task(
      7,
      'Meeting Agenda',
      'success',
      'Polish brand idea.',
      'text',
      "3",
      "2",
      '',
      'Elizabeth Elliott',
      ['assets/img/portrait/small/avatar-s-13.png', 'assets/img/portrait/small/avatar-s-14.png', 'assets/img/portrait/small/avatar-s-15.png'],
      true,
      'Developing'),
    new Task(
      8,
      'Angular 9',
      'success',
      'Angular is a platform for building mobile and desktop web applications.',
      'text',
      "",
      "",
      'Oct 16',
      'Elizabeth Elliott',
      ['assets/img/portrait/small/avatar-s-16.png', 'assets/img/portrait/small/avatar-s-17.png'],
      true,
      'Developing'),
    new Task(
      9,
      'Task',
      'success',
      'Develop & design feedback form.',
      'text',
      "8",
      "",
      '',
      'Elizabeth Elliott',
      [{name: 'S', class: 'primary'}, {name: 'J', class: 'success'}],
      false,
      'Developing'),
    new Task(
      10,
      'Assessment',
      'info',
      `Don't let the outtakes take you out!`,
      'text',
      "",
      "",
      'Sept 10',
      'Elizabeth Elliott',
      ['assets/img/portrait/small/avatar-s-26.png'],
      true,
      'Management'),
    new Task(
      11,
      'Photo shoot',
      'info',
      'assets/img/banner/banner-22.jpg',
      'image',
      "2",
      "5",
      '',
      'Elizabeth Elliott',
      [{name: 'L', class: 'secondary'}, {name: 'F', class: 'danger'}, {name: 'T', class: 'info'}],
      false,
      'Management'),
    new Task(
      12,
      'Unit tests',
      'info',
      'Implement performance improvements.',
      'text',
      "5",
      "4",
      'Jan 14',
      'Elizabeth Elliott',
      ['assets/img/portrait/small/avatar-s-24.png', 'assets/img/portrait/small/avatar-s-20.png'],
      true,
      'Management')
  ];


  addNewTask(title: string, message: string, type: string) {

    let badgeClass = 'primary';

    if(type === 'Marketing') {
      badgeClass = 'primary'
    }
    else if(type === 'UI-Designing') {
      badgeClass = 'warning'
    }
    else if(type === 'Developing') {
      badgeClass = 'success'
    }
    else if(type === 'Management') {
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
    this.tasks.unshift(task);
    return of(this.tasks.slice()).pipe(delay(100));

  }

}
