import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";

import { Full_ROUTES } from "./shared/routes/full-layout.routes";
import { CONTENT_ROUTES } from "./shared/routes/content-layout.routes";

import { AuthGuard } from './shared/auth/auth-guard.service';
import { UsersViewComponent } from './pages/full-pages/users/users-view/users-view.component';
import { UsersEditComponent } from './pages/full-pages/users/users-edit/users-edit.component';

const appRoutes: Routes = [
  { 
    path: 'pages/users-view/:id', 
    component: UsersViewComponent 
  },
  { 
    path: 'pages/users-edit/:id', 
    component: UsersEditComponent 
  },
  
  {
    path: '',
    redirectTo: 'pages/login',
    pathMatch: 'full',
  },
  { path: '', component: FullLayoutComponent, data: { title: 'full Views' }, children: Full_ROUTES, canActivate: [AuthGuard] },
  { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES },
  {
    path: '**',
    redirectTo: 'pages/error'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
