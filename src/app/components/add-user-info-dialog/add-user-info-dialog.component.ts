import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore/';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-add-user-info-dialog',
  templateUrl: './add-user-info-dialog.component.html',
  styleUrls: ['./add-user-info-dialog.component.scss']
})
export class AddUserInfoDialogComponent implements OnInit {

  loading = false;
  addUserInfoForm: FormGroup;
  breading = false;
  playdates = false;
  adoption = false;
  userUid = 'chuckNorris'
  file = null;
  user: User = null;

  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
    const file = event && event.item(0);
    this.file = file;
  }

  constructor(
    public dialogRef: MatDialogRef<AddUserInfoDialogComponent>,
    private afStorage: AngularFireStorage,
    private authService: AuthService,
    private db: AngularFirestore,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data) {
      if (data.user) {
        this.user = data.user;
      }
    }

  ngOnInit(): void {
    let bio = '';
    let pictureValidator = [Validators.required];
    if (this.user) {
      bio = this.user.bio;
      pictureValidator = null;
    }
    this.addUserInfoForm = new FormGroup({
      bio: new FormControl(bio, [Validators.required]),
      picture: new FormControl(null, pictureValidator)
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
    if (this.user.bio) {
      try {
        this.loading = true;
        const promises = [];
        promises.push(this.db.doc(`/users/${ this.userUid }`).ref.update('bio', this.addUserInfoForm.value.bio));
        if (this.addUserInfoForm.value.picture) {
          let ref = this.afStorage.ref(this.user.picture);
          promises.push(ref.put(this.file))
        }
        await Promise.all(promises);
        this.snackbarService.showInfo('User Info Updated')
        this.dialogRef.close();
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }

    } else {
      try {
        this.loading = true;
        const id = `${ this.userUid }-u-` + Math.random().toString(36).substring(2);
        const user = this.addUserInfoForm.value;
        user.picture = id;
        user.owner = this.userUid;
        let ref = this.afStorage.ref(id);
        let userInfo = (await this.db.doc(`/users/${ this.userUid }`).ref.get()).data() as User;
        userInfo.bio = user.bio;
        userInfo.picture = user.picture;
        await Promise.all([
          ref.put(this.file),
          this.db.doc(`/users/${ this.userUid }`).set(userInfo)
        ]);
        this.snackbarService.showInfo('User Info Added')
        this.dialogRef.close();
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false;
      }
    }
  }

  disableEnter(event: any) {
    console.log('here')
    if (event.keyCode === 13) {
      event.preventDefault();
    };
  }
}
