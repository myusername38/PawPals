import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dogs = 0;

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.getDogs();
  }

  async getDogs() {
    try {
      this.dogs = (await this.db.collection('dogs').ref.get()).docs.length;
    } catch (err) {
      console.log(err);
    } finally {
      // do something
    }

  }

  learnMore() {
    window.scroll(0, (window.innerHeight - 85));
  }

  backToTop() {
    window.scroll(0, 0);
  }

}
