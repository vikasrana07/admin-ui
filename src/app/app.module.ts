import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
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
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { AlertComponent } from './_components';

import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor, ErrorInterceptor } from './_helpers';
import { NotFoundComponent } from './notfound/notfound.component';
import { CounterComponent } from './widget/counter/counter.component';
import { NetworkComponent } from './network/network.component';
import { CanvasComponent } from './_components/canvas/canvas.component';
import { ElementComponent } from './_components/canvas/element/element.component';
import { DragDropDirective } from './_directives/drag-drop.directive';
import { LinkComponent } from './_components/canvas/link/link.component';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsSize: 20,
  bgsType: SPINNER.rectangleBounce,
  fgsType: SPINNER.threeStrings,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5
};

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxEchartsModule.forRoot({
      /**
       * This will import all modules from echarts.
       * If you only need custom modules,
       * please refer to [Custom Build] section.
       */
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
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
    AlertComponent,
    CounterComponent,
    NetworkComponent,
    CanvasComponent,
    ElementComponent,
    DragDropDirective,
    LinkComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
