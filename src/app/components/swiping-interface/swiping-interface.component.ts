import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { Dog } from '../../interfaces/dog';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';
import { AngularFireStorage } from '@angular/fire/storage';

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
  currentProfile = null;
  dogDescription = 'Likes to be a big gamer energy'
  dogs: Dog[] = [];


  constructor(private db: AngularFirestore, private authService: AuthService, private afStorage: AngularFireStorage) { }

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
            !this.user.liked.includes(user.uid)) {
              this.otherUsers.push(user);
            }
            this.afStorage.refFromURL(`${ environment.storageUrl }/${ user.picture }`).getDownloadURL().subscribe(url => {
              user.picture = url;
            });
      })
      this.currentProfile = this.otherUsers.pop();
      this.loadDogs();
    } catch (err) {
      console.log(err)
    } finally {
      this.loading = false;
    }
  }

  likeUser(user: User) {
    this.user.liked.push(user.uid);
    if (user.liked.includes(this.user.uid)) {
      this.user.freinds.push(user.uid);
      // show liked message
    }
    this.updateUser();
    this.currentProfile = this.otherUsers.pop();
    this.loadDogs();
  }

  dislikeUser(user: User) {
    this.user.disliked.push(user.uid);
    this.updateUser();
    this.currentProfile = this.otherUsers.pop();
    this.loadDogs();
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

}
