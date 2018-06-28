import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgFlashMessagesModule } from 'ng-flash-messages';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { Router } from '@angular/router/src/router';
import { AuthService } from './service/auth.service';
import { AuthGuard } from './service/auth.guard';
import { RootComponent } from './components/root/root.component';
import { TestComponent } from './components/test/test.component';
import { FoodrecipeComponent } from './components/foodrecipe/foodrecipe.component';

const applicationRoutes:Routes = [
  {path:'',component:RootComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'profile',component:ProfileComponent, canActivate: [AuthGuard]},
  {path:'foodrecipe',component:FoodrecipeComponent},
  {path:'test',component:TestComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    RootComponent,
    TestComponent,
    FoodrecipeComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(applicationRoutes),
    NgFlashMessagesModule.forRoot()
  ],
  providers: [AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
