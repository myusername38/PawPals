import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore/';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match-dialog',
  templateUrl: './match-dialog.component.html',
  styleUrls: ['./match-dialog.component.scss']
})
export class MatchDialogComponent implements OnInit {

  dogName = '';
  userName = '';
  image = '';

  constructor(
    public dialogRef: MatDialogRef<MatchDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data) {
      console.log(data.dogs)
      this.userName = data.name;
      this.dogName = data.dogs[0].name;
      this.image = data.dogs[0].picture;
    }

  ngOnInit(): void {
    setTimeout(function(){ this.close() }, 5000);
  }

  onNoClick(): void {
    this.dialogRef.close();

  }

  click(result) {
    this.dialogRef.close(result);
  }

  close () {
    this.dialogRef.close();
  }

  goToMessages() {
    this.dialogRef.close();
    this.router.navigate(['/pawpals/liked']);
  }
}
