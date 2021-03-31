import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component'
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { UserInterfaceComponent } from './components/user-interface/user-interface.component';
import { MessengerComponent } from './components/messenger/messenger.component';
import { SwipingInterfaceComponent } from './components/swiping-interface/swiping-interface.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LikedUsersComponent } from './components/liked-users/liked-users.component';
import { AuthGuard } from './guards/auth-guard.service';

const routes: Routes = [
  { path: '', component: LandingComponent, children: [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'verify-email', component: VerifyEmailComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'verify-email', component: VerifyEmailComponent },
  ] },
  { path: 'pawpals', component: UserInterfaceComponent, children: [
    { path: 'liked', component: LikedUsersComponent, canActivate: [AuthGuard] },
    { path: '', component: SwipingInterfaceComponent, canActivate: [AuthGuard] },
    { path: 'user-interface', component: UserInterfaceComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  ] },
  { path: 'messanger', component: MessengerComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
