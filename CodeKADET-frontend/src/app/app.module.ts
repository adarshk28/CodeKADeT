import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AceEditorModule } from 'ng2-ace-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule} from '@angular/material/tree';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { ContactComponent } from './contact/contact.component';
import { FileComponent } from './file/file.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SignupComponent } from './signup/signup.component';
<<<<<<< HEAD
// import { SidenavComponent } from './sidenav/sidenav.component';

import { HttpClientModule } from '@angular/common/http';
import { ListComponent } from './list/list.component';
import { TryComponent } from './try/try.component';

import { MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
//import {FlatTreeControl} from '@angular/cdk/tree';


=======
import { SidenavComponent } from './sidenav/sidenav.component';
import { HttpClientModule } from '@angular/common/http';
import { ListComponent } from './list/list.component';
import { ClipboardModule } from '@angular/cdk/clipboard'
import { IvyCarouselModule } from 'angular-responsive-carousel'
>>>>>>> 3109e93266012f6e70661f27b63ba8466c83e0c9
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    WorkspaceComponent,
    ContactComponent,
    FileComponent,
    HomepageComponent,    
    SignupComponent,
    ListComponent,
    TryComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    AceEditorModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatListModule,
<<<<<<< HEAD
    BrowserModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    TryComponent,
=======
    MatTreeModule,
    ClipboardModule,
    IvyCarouselModule
>>>>>>> 3109e93266012f6e70661f27b63ba8466c83e0c9
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
