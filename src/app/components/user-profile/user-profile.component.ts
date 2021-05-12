import { Component, OnInit } from '@angular/core';
import { AddDogDialogComponent } from '../add-dog-dialog/add-dog-dialog.component';
import { AddUserInfoDialogComponent } from '../add-user-info-dialog/add-user-info-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore/';
import { AngularFireStorage } from '@angular/fire/storage';
import { Dog } from '../../interfaces/dog';
import { environment } from '../../../environments/environment';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  picture = 'src/assets/pictures/chuck_norris.jpg'
  userInfo: User = null;

  loading = false;
  dogs: Dog[] = [];
  userUid = '';
  storageRef = null;

  constructor(public dialog: MatDialog, private authService: AuthService, private db: AngularFirestore, private afStorage: AngularFireStorage, private router: Router) { }

  ngOnInit(): void {
    this.userUid = this.authService._user.uid
    this.getDogs();
    this.getUser();
  }

  async getUser() {
    try {
      this.loading = true;
      this.userInfo = (await this.db.doc(`/users/${ this.userUid }`).ref.get()).data() as User;
      if (this.userInfo.bio) {
        this.afStorage.refFromURL(`${ environment.storageUrl }/${ this.userInfo.picture }`).getDownloadURL().subscribe(url => {
          this.picture = url;
        })
      } else {
        this.addUserInfo();
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  async getDogs() {
    try {
      this.loading = true;
      this.dogs = [];
      (await this.db.collection('dogs').ref.where('owner', '==', this.userUid).get()).docs.forEach(async doc => {
        const dog = doc.data() as Dog;
        this.afStorage.refFromURL(`${ environment.storageUrl }/${ dog.picture }`).getDownloadURL().subscribe(url => {
          dog.url = url;
        })
        this.dogs.push(dog);
      });
      console.log(this.dogs);
    } catch (err) {
      console.log(err)
    } finally {
      this.loading = false;
    }
  }

  async addDog(dog = null) {
    const dialogRef = this.dialog.open(AddDogDialogComponent, {
      width: '600px',
      data: {
        dog
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      this.getDogs();
    })
  }

  async addUserInfo() {
    const dialogRef = this.dialog.open(AddUserInfoDialogComponent, {
      width: '600px',
      data: {
        user: this.userInfo
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      this.getUser();
    })
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
