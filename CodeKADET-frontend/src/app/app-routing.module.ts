import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { WorkspaceComponent } from './workspace/workspace.component';
<<<<<<< HEAD
import { TryComponent } from './try/try.component';

=======
>>>>>>> 3109e93266012f6e70661f27b63ba8466c83e0c9
const routes: Routes = [
  {
    path: 'homepage',component: HomepageComponent
  },
  {
    path: 'workspace/:username',component: WorkspaceComponent
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
