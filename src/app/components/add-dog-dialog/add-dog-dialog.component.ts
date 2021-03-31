import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore/';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-add-dog-dialog',
  templateUrl: './add-dog-dialog.component.html',
  styleUrls: ['./add-dog-dialog.component.scss']
})
export class AddDogDialogComponent implements OnInit {

  loading = false;
  addDogForm: FormGroup;
  breading = false;
  playdates = false;
  adoption = false;
  userUid = 'chuckNorris'
  file = null;

  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
    const file = event && event.item(0);
    this.file = file;
  }

  constructor(
    public dialogRef: MatDialogRef<AddDogDialogComponent>,
    private afStorage: AngularFireStorage,
    private authService: AuthService,
    private db: AngularFirestore,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data) {
    }

  ngOnInit(): void {
    this.addDogForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      bread: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      playdates: new FormControl(false, [Validators.required]),
      adoption: new FormControl(false, [Validators.required]),
      breading: new FormControl(false, [Validators.required]),
      picture: new FormControl(null, [Validators.required])
    });
    this.userUid = this.authService._user.uid
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

  async onSubmit() {
    try {
      this.loading = true;
      const id = `${ this.userUid }-` + Math.random().toString(36).substring(2);
      const dog = this.addDogForm.value;
      dog.picture = id;
      dog.owner = this.userUid;
      let ref = this.afStorage.ref(id);
      let userInfo = (await this.db.doc(`/users/${ this.userUid }`).ref.get()).data() as User;
      await Promise.all([
        userInfo.dogs.push(id),
        ref.put(this.file),
        this.db.doc(`/dogs/${ id }`).set(dog)
      ]);
      this.dialogRef.close();
    } catch (err) {
      console.log(err)
    } finally {
      this.loading = false;
    }
  }
}
