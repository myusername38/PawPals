import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-swiping-interface',
  templateUrl: './swiping-interface.component.html',
  styleUrls: ['./swiping-interface.component.scss']
})
export class SwipingInterfaceComponent implements OnInit {

  userPicture = '../../../assets/pictures/OakyBaby.jpg';

  constructor() { }

  ngOnInit(): void {
  }

}
