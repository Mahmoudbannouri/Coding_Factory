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


];
