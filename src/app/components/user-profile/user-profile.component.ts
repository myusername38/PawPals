import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  picture = 'src/assets/pictures/chuck_norris.jpg'
  userInfo = {
    name: 'Chuck Norris',
    location: 'Chapel Hill, NC'
  }
  userDogs = [
    {
      name: 'Nard',
      picture: '../../../assets/pictures/dogs-temp/nard-dog.jpg',
    },
    {
      name: 'Snoop',
      picture: '../../../assets/pictures/dogs-temp/snoop.jpg',
    },
    {
      name: 'Whats',
      picture: '../../../assets/pictures/dogs-temp/updog.jpg'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
