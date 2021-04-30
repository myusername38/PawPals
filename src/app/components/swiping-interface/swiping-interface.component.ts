import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { Dog } from '../../interfaces/dog';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';
import { AngularFireStorage } from '@angular/fire/storage';
import { InterestsDialogComponent } from '../interests-dialog/interests-dialog.component';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { MatchDialogComponent } from '../match-dialog/match-dialog.component';

@Component({
  selector: 'app-swiping-interface',
  templateUrl: './swiping-interface.component.html',
  styleUrls: ['./swiping-interface.component.scss']
})
export class SwipingInterfaceComponent implements OnInit {

  userPicture = '../../../assets/pictures/OakyBaby.jpg';
  user: User = null;
  uid = '';
  otherUsers: User[] = [];
  loading = false;
  currentProfile: User = null;
  dogDescription = 'Likes to be a big gamer energy'
  dogs: Dog[] = [];
  breading = true;
  playdates = true;
  adoption = true;

  constructor(private db: AngularFirestore,
              private authService: AuthService,
              private afStorage: AngularFireStorage,
              private dialog: MatDialog,
              private snackbar: SnackbarService) { }

  async ngOnInit() {
    this.uid = this.authService._user.uid;
    this.initApp();
  }

  async initApp() {
    try {
      this.loading = true;
      this.user = (await this.db.doc(`/users/${ this.uid }`).ref.get()).data() as User;
      this.getUsers();
    } catch (err) {
      console.log(err)
    } finally {
      this.loading = false;
    }
  }

  async getUsers() {
    try {
      this.loading = true;
      (await this.db.collection('users').ref.where('uid', '!=', this.user.uid).get()).docs.forEach(doc => {
        let user = doc.data() as User;
        if (!user.disliked.includes(this.user.uid) &&
            !this.user.disliked.includes(user.uid) &&
            !this.user.liked.includes(user.uid) &&
            user.dogs.length >= 1) {
              this.otherUsers.push(user);
            }
            this.afStorage.refFromURL(`${ environment.storageUrl }/${ user.picture }`).getDownloadURL().subscribe(url => {
              user.picture = url;
            });
      })
      this.currentProfile = this.otherUsers.pop();
      if (this.currentProfile) {
        this.loadDogs();
      }
    } catch (err) {
      console.log(err)
    } finally {
      this.loading = false;
    }
  }

  likeUser(user: User = this.currentProfile) {
    this.snackbar.showInfo('Liked User')
    this.user.liked.push(user.uid);
    this.checkMatch();
    this.updateUser();
    this.loadNextUser();
  }

  checkMatch() {
    if (this.currentProfile.liked.includes(this.user.uid)) {
      const dialogRef = this.dialog.open(MatchDialogComponent, {
        width: '400px',
        data: {
          name: this.currentProfile.name,
          dogs: this.dogs,
        }
      })
      dialogRef.afterClosed().subscribe(result => {

      })
    }
  }

  dislikeUser(user: User =  this.currentProfile) {
    this.snackbar.showInfo('Disliked User')
    this.user.disliked.push(user.uid);
    this.updateUser();
    this.loadNextUser();
  }

  async updateUser() {
    try {
      this.loading = true;
      await this.db.doc(`/users/${ this.user.uid }`).ref.set(this.user);
    } catch (err) {
      console.log(err)
    } finally {
      this.loading = false;
    }
  }

  async loadDogs() {
    try {
      this.loading = true;
      this.dogs = [];
      const promises = [];
      let interestsMet = false;
      this.currentProfile.dogs.forEach(dog => {
        promises.push(
          new Promise(async (resolve, reject) => {
            try {
              const newDog = (await this.db.doc(`/dogs/${ dog }`).ref.get()).data() as Dog;
              if (newDog.playdates && this.playdates || newDog.breading && this.breading || newDog.adoption && this.adoption) {
                interestsMet = true;
              }
              this.afStorage.refFromURL(`${ environment.storageUrl }/${ newDog.picture }`).getDownloadURL().subscribe(url => {
                newDog.picture = url;
                this.dogs.push(newDog);
                return resolve();
              })
            } catch (err) {
              console.log(err);
              return reject(err)
            }
          })
        );
      })
      await Promise.all(promises);
      console.log(interestsMet)
      if (!interestsMet) {
        this.loadNextUser();
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  loadNextUser() {
    this.currentProfile = this.otherUsers.pop();
    if (!this.currentProfile) {
      this.noMoreUsers();
    }
    this.loadDogs();
  }

  noMoreUsers() {
    // this.noMoreUsers
  }

  updatePreferences() {
    const dialogRef = this.dialog.open(InterestsDialogComponent, {
      width: '400px',
      data: {
        playdates: this.playdates,
        breading: this.breading,
        adoption: this.adoption
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.playdates = result.interests.playdates;
        this.breading = result.interests.breading;
        this.adoption = result.interests.adoption;
        this.initApp();
      }
    })
  }
}
