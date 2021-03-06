import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from 'src/app/interfaces/user';
import { ShowHideStyleBuilder } from '@angular/flex-layout';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent implements OnInit {

  userMessage = '';
  messageForm: FormGroup;
  currentUser = '1';
  selectedUser: User = null;
  ref = '';
  uid = ''
  messages = []
  selectedUserUid = '';
  scroll: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private _ngZone: NgZone, private router: Router, private route: ActivatedRoute, private db: AngularFirestore, private authService: AuthService, private afStorage: AngularFireStorage) {
    this.route.queryParams.subscribe(params => {
      this.ref = params['ref'];
      this.selectedUserUid = params['user'];
    });
  }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @ViewChild('chat') private chatWindow: ElementRef;

  ngOnInit(): void {
    this.currentUser = this.authService._user.uid;
    console.log(this.currentUser);
    this.messageForm = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });
    this.uid = this.authService._user.uid;
    this.db.doc('conversations/conversations').collection(this.ref).ref.orderBy('date', 'asc').onSnapshot((data) => {
      this.messages = [];
      data.forEach(doc => {
        let message = doc.data();
        this.messages.push(message);
      })
      this.scroll.next(true);
    });
    this.getUser();
    this.scroll.subscribe(scrollDown => {
      if (scrollDown) {
        this.scroll.next(false);
        setTimeout(() => { this.scrollToBottom(); }, 500)
      }
    })
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  print(message) {
    console.log(message);
  }

  async unmatch() {
    try {
      let userData = (await this.db.doc(`/users/${ this.currentUser }`).ref.get()).data() as User;
      userData.liked = userData.liked.filter(uid => uid !== this.selectedUser.uid);
      userData.disliked.push(this.selectedUserUid);
      await await this.db.doc(`/users/${ this.currentUser }`).ref.set(userData);
     // this.sn
      this.back();
    } catch (err) {
      console.log(err)
    } finally {
      // do something
    }
  }

  async send() {
    try {
      const newMessage = {
        user: this.uid,
        message: this.userMessage,
        date: Date.now()
      }
      this.userMessage = '';
      const id = 'message_' + Math.random().toString(36).substr(2, 15);
      await this.db.doc('conversations/conversations').collection(this.ref).doc(id).ref.set(newMessage);
    } catch (err) {
      console.log(err)
    } finally {
    }
  }

  updateTextArea() {

  }

  disableEnter(event: any) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.send();
    };
  }

  async getUser() {
    try {
      this.selectedUser = (await this.db.doc(`/users/${ this.selectedUserUid }`).ref.get()).data() as User;
      this.afStorage.refFromURL(`${ environment.storageUrl }/${ this.selectedUser.picture }`).getDownloadURL().subscribe(url => {
        this.selectedUser.picture = url;
      });
    } catch (err) {
      console.log(err);
    } finally {
    }
  }

  scrollToBottom(): void {
    console.log('here')
    this.chatWindow.nativeElement.scroll({
      top: this.chatWindow.nativeElement.scrollHeight - 100,
      left: 0,
      behavior: 'smooth'
    });
  }

  back() {
    this.router.navigate(['/pawpals/liked'])
  }

  viewProfile() {
    this.router.navigate(['/pawpals/view-profile'], {queryParams: { ref: this.ref, user: this.selectedUserUid },});
  }
}
