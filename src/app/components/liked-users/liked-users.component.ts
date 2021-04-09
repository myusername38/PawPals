import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from 'src/app/interfaces/user';
import { environment } from '../../../environments/environment';

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
    this.initApp();
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
      (await this.db.collection('users').ref.where('liked', 'array-contains', this.userUid).get()).docs.forEach(async doc => {
        let user = doc.data() as User;
        if (this.user.liked.includes(user.uid)) {
          this.afStorage.refFromURL(`${ environment.storageUrl }/${ user.picture }`).getDownloadURL().subscribe(url => {
            user.picture = url;
          });
          const conversation = await this.getConversation(user);
          user.lastMessage = conversation.prevMessage;
          user.ref = conversation.ref;
          user.date = conversation.date;
          this.friends.push(user);
        }
      })
      console.log(this.friends);
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  async getConversation(user: User) {
    try {
      this.loading = true;
      let ref = `${ this.userUid }-${ user.uid }`
      let conversation = (await this.db.collection('conversations')
                    .doc('conversations')
                    .collection(ref).ref.orderBy('date', 'desc').limit(1).get()).docs;
      if (conversation.length < 1) {
        ref =`${ user.uid }-${ this.userUid }`;
        conversation = (await this.db.collection('conversations')
                                         .doc('conversations')
                                         .collection(ref).ref.orderBy('date', 'desc').limit(1).get()).docs;
      }
      if (conversation.length < 1) {
        return { prevMessage: 'Start the conversation!', ref, date: -1 }
      }
      return {
        prevMessage: conversation[0].data().message,
        date: conversation[0].data().date,
        ref
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  openChat(chatRef: string, uid: string) {
    console.log(chatRef);
    this.router.navigate(['messanger'], {queryParams: { ref: chatRef, user: uid },});
  }

  shortenMessage(message: string) {
    const len = message.length;
    if (len > this.maxCharacters) {
      return message.substring(0, this.maxCharacters) + '...';
    }
    return message;
  }
}
