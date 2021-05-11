import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { Dog } from '../../interfaces/dog';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';
import { AngularFireStorage } from '@angular/fire/storage';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {

  userPicture = '../../../assets/pictures/OakyBaby.jpg';
  user: User = null;
  uid = '';
  otherUsers: User[] = [];
  loading = false;
  currentProfile: User = null;
  dogDescription = 'Likes to be a big gamer energy'
  dogs: Dog[] = [];
  userUid = '';
  ref = '';


  constructor(private db: AngularFirestore,
              private authService: AuthService,
              private afStorage: AngularFireStorage,
              private dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute,
              private snackbar: SnackbarService) {
                this.route.queryParams.subscribe(params => {
                  this.ref = params['ref'];
                  this.userUid = params['user'];
                });
              }

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
      let user = (await this.db.doc(`/users/${ this.userUid }`).ref.get()).data() as User;
      if (!user.disliked.includes(this.user.uid) &&
          !this.user.disliked.includes(user.uid) &&
          user.dogs.length >= 1) {
        this.otherUsers.push(user);
      }
      this.afStorage.refFromURL(`${ environment.storageUrl }/${ user.picture }`).getDownloadURL().subscribe(url => {
        user.picture = url;
      });

      this.currentProfile = user;
      if (this.currentProfile) {
        this.loadDogs();
      }
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
      this.currentProfile.dogs.forEach(dog => {
        promises.push(
          new Promise(async (resolve, reject) => {
            try {
              const newDog = (await this.db.doc(`/dogs/${ dog }`).ref.get()).data() as Dog;
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
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  back() {
    this.router.navigate(['messanger'], {queryParams: { ref: this.ref, user: this.userUid },});
  }
}
