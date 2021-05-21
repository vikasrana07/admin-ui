import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteLayoutComponent } from './_layout/site-layout/site-layout.component';
import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';

import { AuthGuard } from './_helpers/auth.guard';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { NotFoundComponent } from './notfound/notfound.component';

const routes: Routes = [
    // Site routes goes here
    {
        path: '',
        component: SiteLayoutComponent,
        children: [
          { path: '', component: HomeComponent, pathMatch: 'full'},
          { path: 'about', component: AboutComponent },
          { path: 'test/:id', component: AboutComponent }
        ]
    },
    // App routes goes here here
    {
        path: '',
        component: AppLayoutComponent,
        children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'profile', component: ProfileComponent }
        ],
        canActivate: [ AuthGuard ]
    },

    // no layout routes
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent },
    { path: '404', component: NotFoundComponent},
    // otherwise redirect to 404
    { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


