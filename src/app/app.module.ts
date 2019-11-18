import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { HomeComponent } from './home/home.component';
import {RouterModule, Routes} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { HomeAuthComponent } from './home-auth/home-auth.component';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {ErrorInterceptor} from './_helpers/error.interceptor';
import {AuthGuard} from './_helpers/auth.guard';
import {fakeBackendProvider} from './_helpers/fake-backend';
import {AlertService} from './_services/alert.service';
import { VerificationAccountComponent } from './verification-account/verification-account.component';
import { ContentBookComponent } from './content-book/content-book.component';
import { ContentChatComponent } from './content-chat/content-chat.component';
import { ContentFriendsComponent } from './content-friends/content-friends.component';
import { ContentProfileComponent } from './content-profile/content-profile.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { ContentMainComponent } from './content-main/content-main.component';
import { ContentRecommendationsComponent } from './content-recommendations/content-recommendations.component';
import {ContentAchievementsComponent} from './content-achievements/content-achievements.component';
import { HeaderauthComponent } from './headerauth/headerauth.component';
import { AlertComponent } from './alert/alert.component';
import { VerificationAdminComponent } from './verification-admin/verification-admin.component';
import { RecoveryPassComponent } from './recovery-pass/recovery-pass.component';
import { RecoveryPassRequestComponent } from './recovery-pass-request/recovery-pass-request.component';
import { SuperadminRequest } from './superadmin-request/superadmin-request.component';
import { SearchComponent } from './search/search.component';
import {ContentBookDetailsComponent} from './content-book-details/content-book-details.component';



const componentRoutes: Routes = [
  { path: 'books', component: ContentBookComponent},
  { path: 'profile', component: ContentProfileComponent},
  { path: 'friends', component: ContentFriendsComponent},
  { path: 'recommendations', component: ContentRecommendationsComponent},
  { path: 'chat', component: ContentChatComponent},
  { path: 'achievements', component: ContentAchievementsComponent},
  { path: 'superadmin-request', component: SuperadminRequest},
];

const componentNotAllRoutes: Routes = [
  { path: 'books', component: ContentBookComponent},
  { path: 'announcement', component: ContentMainComponent},
  { path: 'superadmin-request', component: SuperadminRequest},
  { path: 'search', component: SearchComponent},
  { path: 'search/:bookId', component: ContentBookDetailsComponent},
  { path: 'announcement/:bookId', component: ContentBookDetailsComponent}
];



const appRoutes: Routes = [
  { path: 'home', component: HomeComponent, children: componentNotAllRoutes },
  { path: 'login', component: AuthorizationComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'homeath', component: HomeAuthComponent , canActivate: [AuthGuard], children: componentRoutes },
  { path: 'verification-account', component: VerificationAccountComponent},
  { path: 'verification-admin', component: VerificationAdminComponent },
  { path: 'recovery-password', component: RecoveryPassComponent },
  { path: 'recovery-password-request', component: RecoveryPassRequestComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: 'home/announcement' }
];




@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    AuthorizationComponent,
    HomeComponent,
    HomeAuthComponent,
    VerificationAccountComponent,
    ContentBookComponent,
    ContentChatComponent,
    ContentFriendsComponent,
    ContentProfileComponent,
    HeaderComponent,
    MenuComponent,
    ContentMainComponent,
    ContentRecommendationsComponent,
    ContentAchievementsComponent,
    HeaderauthComponent,
    AlertComponent,
    VerificationAdminComponent,
    RecoveryPassComponent,
    RecoveryPassRequestComponent,
    SuperadminRequest,
    SearchComponent,
    ContentBookDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AlertService],

  bootstrap: [AppComponent]
})
export class AppModule { }
