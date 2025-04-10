import { Task } from '../taskboard-ngrx.model';
import * as TaskActions from './taskboard.actions';

// export interface FeatureState {
//   task: State;
// }

export interface State {
tasks: Task[];
}

const initialState: State = {
  tasks: [
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
  ],


};

export function taskReducer(state = initialState, action: TaskActions.TaskActions) {
  switch (action.type) {
    case TaskActions.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
    case TaskActions.UPDATE_TASK:
      const updatedRecipe = {
        ...state.tasks[action.payload.index],
        ...action.payload.newTask
      };

      const updatedRecipes = [...state.tasks];
      updatedRecipes[action.payload.index] = updatedRecipe;

      return {
        ...state,
        tasks: updatedRecipes
      };
    case TaskActions.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((recipe, index) => {
          return index !== action.payload;
        })
      };
    default:
      return state;
  }
}
