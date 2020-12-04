import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { WorkspaceComponent } from './workspace/workspace.component';

import { TryComponent } from './try/try.component';

const routes: Routes = [
  {
    path: 'homepage',component: HomepageComponent
  },
  {
    path: 'workspace',component: WorkspaceComponent
  },
  {
    path: 'login',component: LoginComponent
  },
  {
    path: 'contact',component: ContactComponent
  },
  {
    path: 'try',component: TryComponent
  },
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
