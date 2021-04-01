import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { Dog } from '../../interfaces/dog';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-swiping-interface',
  templateUrl: './swiping-interface.component.html',
  styleUrls: ['./swiping-interface.component.scss']
})
export class SwipingInterfaceComponent implements OnInit {

  userPicture = '../../../assets/pictures/OakyBaby.jpg';
  user: User = null;
  uid = '';
  otherUsers: User[] = null;
  loading = false;
  currentProfile = null;
  dogDescription = 'Likes to be a big gamer energy'
  dogs: Dog[] = [];

  constructor(private db: AngularFirestore, private authService: AuthService) { }

  async ngOnInit() {
    this.uid = this.authService._user.uid;
    this.initApp;
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
      })
      this.currentProfile = this.otherUsers.pop();
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
  }

  dislikeUser(user: User) {
    this.user.disliked.push(user.uid);
    this.updateUser();
    this.otherUsers.pop();
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

    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

}
