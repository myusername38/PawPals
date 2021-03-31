import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-liked-users',
  templateUrl: './liked-users.component.html',
  styleUrls: ['./liked-users.component.scss']
})
export class LikedUsersComponent implements OnInit {

  maxCharacters = 70;
  likedUsers = [
    {
      name: 'Chuck norris',
      uid: 'alsakfjasdl;fas',
      picture: '../../../assets/pictures/chuck_norris.jpg',
      lastMessage: 'Bruce Lee is going downjljl;kj;kj;ljkljkljkljk;ljkl;jk;jkl;j;ljkljlkj;lkj;j;kajfslk;djfal;ksjfklsajfklsajklfjsajdflsjakljdfsadl;kjf',
      dogs: []
    },
    {
      name: 'Chuck norris',
      uid: 'alsakfjasdl;fas',
      picture: '../../../assets/pictures/chuck_norris.jpg',
      lastMessage: `Bruce Lee ain't shit`,
      dogs: []
    },
    {
      name: 'Chuck norris',
      uid: 'alsakfjasdl;fas',
      picture: '../../../assets/pictures/chuck_norris.jpg',
      lastMessage: `Bruce Lee doesn't know the way of the dragon`,
      dogs: []
    },
  ]

  constructor(private router: Router) { }

  ngOnInit(): void {
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
