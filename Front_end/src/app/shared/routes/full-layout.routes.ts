import { Routes, RouterModule } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'courses',
    loadChildren: () => import('../../courses/course.module').then(m => m.CourseModule)
  },

  {
    path: 'events',
    loadChildren: () => import('../../event/event.module').then(m => m.EventModule)
  },


  {
    path: 'tables',
    loadChildren: () => import('../../tables/tables.module').then(m => m.TablesModule)
  },
  {
    path: 'datatables',
    loadChildren: () => import('../../data-tables/data-tables.module').then(m => m.DataTablesModule)
  },



  {
    path: 'cards',
    loadChildren: () => import('../../cards/cards.module').then(m => m.CardsModule)
  },


  {
    path: 'courses',
    loadChildren: () => import('../../courses/course.module').then(m => m.CourseModule)
  },

{
  path: 'modules',
  children: [
    {
      path: 'exams', // accès via /modules/exams
      loadChildren: () => import('../../modules/exams/exam.module').then(m => m.ExamModule)
    },
    {
      path: 'exman-quiz', // accès via /modules/exman-quiz
      loadChildren: () => import('../../modules/ExmanQuiz/ExmanQuiz.module').then(m => m.ExmanQuizModule)
    }
  ]
},
  

{
    path: 'pages',
    loadChildren: () => import('../../pages/full-pages/full-pages.module').then(m => m.FullPagesModule)
  },
 {
    path: 'calendar',
    loadChildren: () => import('../../calendar/calendar.module').then(m => m.CalendarsModule)
  },
   {
    path: 'components',
    loadChildren: () => import('../../components/ui-components.module').then(m => m.UIComponentsModule)
  },

];
