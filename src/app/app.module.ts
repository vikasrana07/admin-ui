import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';
import { ToastrModule } from 'ngx-toastr';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  PB_DIRECTION,
} from 'ngx-ui-loader';

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
import { InventoryComponent } from './inventory/inventory.component';
import { NetworkComponent } from './network/network.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';

import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor, ErrorInterceptor } from './_helpers';
import { NotFoundComponent } from './notfound/notfound.component';
import { CanvasComponent, ElementComponent, LinkComponent, CounterComponent } from './_components';

import { DragDropDirective } from './_directives/drag-drop.directive';



const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsSize: 20,
  bgsType: SPINNER.rectangleBounce,
  fgsType: SPINNER.threeStrings,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5,
  text: 'Please wait...',
  gap: 10
};

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};
@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    ToastrModule.forRoot({
      timeOut: 10000,
      preventDuplicates: true,
    }),
    PerfectScrollbarModule
  ],
  declarations: [AppComponent,
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
    CounterComponent,
    NetworkComponent,
    CanvasComponent,
    ElementComponent,
    DragDropDirective,
    LinkComponent,
    InventoryComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
