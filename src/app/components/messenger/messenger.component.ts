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

  constructor(private _ngZone: NgZone, private router: Router, private route: ActivatedRoute, private db: AngularFirestore, private authService: AuthService, private afStorage: AngularFireStorage) {
    this.route.queryParams.subscribe(params => {
      this.ref = params['ref'];
      this.selectedUserUid = params['user'];
    });
  }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @ViewChild('chat') private chatWindow: ElementRef;

  ngOnInit(): void {
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
    });
    this.getUser();
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  print(message) {
    console.log(message);
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
    this.scrollToBottom();
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
    this.chatWindow.nativeElement.scroll({
      top: this.chatWindow.nativeElement.scrollHeight - 100,
      left: 0,
      behavior: 'smooth'
    });
  }

  back() {
    this.router.navigate(['/pawpals/liked'])
  }
}
