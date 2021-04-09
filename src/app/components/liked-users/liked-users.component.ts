import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-liked-users',
  templateUrl: './liked-users.component.html',
  styleUrls: ['./liked-users.component.scss']
})
export class LikedUsersComponent implements OnInit {

  maxCharacters = 70;
  loading = false;
  friends: User[] = [];
  userUid = '';
  user: User = null;

  constructor(private router: Router, private db: AngularFirestore, private authService: AuthService, private afStorage: AngularFireStorage) { }

  ngOnInit(): void {
    this.userUid = this.authService._user.uid;
  }

  async initApp() {
    try {
      this.loading = true;
      this.user = (await this.db.doc(`/users/${ this.userUid }`).ref.get()).data() as User;
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
      (await this.db.collection('users').ref.where('liked', 'array-contains', this.userUid).get()).docs.forEach(doc => {
        let user = doc.data() as User;
        if (this.user.liked.includes(user.uid)) {
          this.friends.push(user);
        }
      })
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  openChat(uid = 'alksjdfalsdj') {
    this.router.navigate(['messanger']);
  }

  shortenMessage(message: string) {
    const len = message.length;
    if (len > this.maxCharacters) {
      return message.substring(0, this.maxCharacters) + '...';
    }
    return message;
  }
}
