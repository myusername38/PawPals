import { Component, OnInit } from '@angular/core';
import { AddDogDialogComponent } from '../add-dog-dialog/add-dog-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore/';
import { AngularFireStorage } from '@angular/fire/storage';
import { Dog } from '../../interfaces/dog';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  picture = 'src/assets/pictures/chuck_norris.jpg'
  userInfo = {
    name: 'Chuck Norris',
    location: 'Chapel Hill, NC'
  }
  loading = false;
  dogs = [];
  userUid = '';
  storageRef = null;

  constructor(public dialog: MatDialog, private authService: AuthService, private db: AngularFirestore, private afStorage: AngularFireStorage) { }

  ngOnInit(): void {
    this.userUid = this.authService._user.uid
    this.getDogs();
  }

  async getDogs() {
    try {
      this.loading = true;
      this.dogs = [];
      (await this.db.collection('dogs').ref.where('owner', '==', this.userUid).get()).docs.forEach(async doc => {
        const dog = doc.data() as Dog;
        this.afStorage.refFromURL(`${ environment.storageUrl }/${ dog.picture }`).getDownloadURL().subscribe(url => {
          dog.picture = url;
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

  async addDog() {
    const dialogRef = this.dialog.open(AddDogDialogComponent, {
      width: '600px',
      data: {}
    })
    dialogRef.afterClosed().subscribe(result => {
      this.getDogs();
    })
  }

}
