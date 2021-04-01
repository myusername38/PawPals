import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent implements OnInit {

  userMessage = '';
  messageForm: FormGroup;
  currentUser = '1';
  selectedUser = {
    name: 'Chuck norris',
    uid: 'alsakfjasdl;fas',
    picture: '../../../assets/pictures/chuck_norris.jpg',
    lastMessage: 'Bruce Lee is going downjljl;kj;kj;ljkljkljkljk;ljkl;jk;jkl;j;ljkljlkj;lkj;j;kajfslk;djfal;ksjfklsajfklsajklfjsajdflsjakljdfsadl;kjf',
    dogs: []
  };

  messages = [
    {
      user: '1',
      message: 'I love dogs',
      date: Date.now()-4
    },
    {
      user: '2',
      message: 'No way I love dogs too',
      date: Date.now()-3
    },
    {
      user: '1',
      message: 'Woah we have a lot in common',
      date: Date.now()-2
    },
    {
      user: '2',
      message: 'Lets get married and die at 92 in a retirement home after living a somewhat fullfilling life of working at random jobs we hate and have children to hopefully num the pain of this terrible existance',
      date: Date.now()-1
    },
    {
      user: '1',
      message: 'Hell ya gamer',
      date: Date.now()
    },
  ]

  constructor(private _ngZone: NgZone, private router: Router) { }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @ViewChild('chat') private chatWindow: ElementRef;

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });
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
    this.messages.push({
      user: '1',
      message: this.userMessage,
      date: Date.now()
    })
    this.userMessage = '';
    this.scrollToBottom();
  }

  updateTextArea() {

  }

  disableEnter(event: any) {
    if (event.keyCode === 13) {
      event.preventDefault();
    };
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
