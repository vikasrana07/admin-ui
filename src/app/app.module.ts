import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppComponent } from './app.component';
import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';
import { SiteLayoutComponent } from './_layout/site-layout/site-layout.component';
import { AppHeaderComponent } from './_layout/app-header/app-header.component';
import { AppFooterComponent } from './_layout/app-footer/app-footer.component';
import { AppSidebarComponent } from './_layout/app-sidebar/app-sidebar.component';
import { SiteHeaderComponent } from './_layout/site-header/site-header.component';
import { SiteFooterComponent } from './_layout/site-footer/site-footer.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { AlertComponent } from './_components';

import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor, ErrorInterceptor } from './_helpers';
import { NotFoundComponent } from './notfound/notfound.component';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  declarations: [ AppComponent,
      AppLayoutComponent,
      SiteLayoutComponent,
      AppHeaderComponent,
      SiteHeaderComponent,
      AppFooterComponent,
      AppSidebarComponent,
      SiteFooterComponent,
      LoginComponent,
      DashboardComponent,
      HomeComponent,
      AboutComponent,
      RegisterComponent,
      ProfileComponent,
      NotFoundComponent,
	  AlertComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider
],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
