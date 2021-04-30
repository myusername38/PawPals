import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LandingComponent } from './components/landing/landing.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { HomeComponent } from './components/home/home.component';
import { UserInterfaceComponent } from './components/user-interface/user-interface.component';
import { SwipingInterfaceComponent } from './components/swiping-interface/swiping-interface.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { MessengerComponent } from './components/messenger/messenger.component';
import { LikedUsersComponent } from './components/liked-users/liked-users.component';
import { AddDogDialogComponent } from './components/add-dog-dialog/add-dog-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddUserInfoDialogComponent } from './components/add-user-info-dialog/add-user-info-dialog.component';
import { InterestsDialogComponent } from './components/interests-dialog/interests-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ViewDogsDialogComponent } from './components/view-dogs-dialog/view-dogs-dialog.component';
import { MatchDialogComponent } from './components/match-dialog/match-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LandingComponent,
    VerifyEmailComponent,
    HomeComponent,
    UserInterfaceComponent,
    SwipingInterfaceComponent,
    UserProfileComponent,
    MessengerComponent,
    LikedUsersComponent,
    AddDogDialogComponent,
    AddUserInfoDialogComponent,
    InterestsDialogComponent,
    ConfirmationDialogComponent,
    ViewDogsDialogComponent,
    MatchDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'pawpals-api'),
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatRadioModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatMenuModule,
    MatToolbarModule,
    MatInputModule,
    HttpClientModule,
  ],
  providers: [
    AngularFireAuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
