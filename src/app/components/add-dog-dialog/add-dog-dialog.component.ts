import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore/';
import { User } from '../../interfaces/user';
import { Dog } from '../../interfaces/dog';

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
  dog: Dog = null;
  id = '';

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
      if (data.dog) {
        this.dog = data.dog;
      }
    }

  ngOnInit(): void {
    if (this.dog) {
      this.addDogForm = new FormGroup({
        name: new FormControl(this.dog.name, [Validators.required]),
        bread: new FormControl(this.dog.bread, [Validators.required]),
        description: new FormControl(this.dog.description, [Validators.required]),
        playdates: new FormControl(this.dog.playdates, [Validators.required]),
        adoption: new FormControl(this.dog.adoption, [Validators.required]),
        breading: new FormControl(this.dog.bread, [Validators.required]),
        picture: new FormControl(null, )
      });
    } else {
      this.addDogForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        bread: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        playdates: new FormControl(false, [Validators.required]),
        adoption: new FormControl(false, [Validators.required]),
        breading: new FormControl(false, [Validators.required]),
        picture: new FormControl(null, [Validators.required])
      });
    }
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
    if (!this.dog) {
      try {
        const id = `${ this.userUid }-` + Math.random().toString(36).substring(2);
        const dog = this.addDogForm.value;
        dog.picture = id;
        dog.owner = this.userUid;
        let ref = this.afStorage.ref(id);
        let userInfo = (await this.db.doc(`/users/${ this.userUid }`).ref.get()).data() as User;
        userInfo.dogs.push(id)
        await Promise.all([
          userInfo.dogs.push(id),
          ref.put(this.file),
          this.db.doc(`/dogs/${ id }`).set(dog),
          this.db.doc(`/users/${ this.userUid }`).set(userInfo)
        ]);
        this.dialogRef.close();
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false;
      }
    } else {
      try {
        const dog = this.addDogForm.value;
        dog.owner = this.userUid;
        const promises = [];
        if (dog.picture) {
          let ref = this.afStorage.ref(this.dog.picture);
          promises.push(ref.put(this.file),)
        } else {
          dog.picture = this.dog.picture;
        }
        promises.push(this.db.doc(`/dogs/${ this.dog.picture }`).set(dog))
        await Promise.all(promises);
        this.dialogRef.close();
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false;
      }
    }
  }


}
