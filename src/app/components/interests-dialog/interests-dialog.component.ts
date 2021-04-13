import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-interests-dialog',
  templateUrl: './interests-dialog.component.html',
  styleUrls: ['./interests-dialog.component.scss']
})
export class InterestsDialogComponent implements OnInit {

  interests = null;
  loading = false;
  interestsForm: FormGroup;

  constructor(
  public dialogRef: MatDialogRef<InterestsDialogComponent>,
  private snackbarService: SnackbarService,
  @Inject(MAT_DIALOG_DATA) public data) {
    this.interests = data;
    console.log(this.interests)
  }

  ngOnInit(): void {
    this.interestsForm = new FormGroup({
      playdates: new FormControl(this.interests.playdates, [Validators.required]),
      adoption: new FormControl(this.interests.adoption, [Validators.required]),
      breading: new FormControl(this.interests.breading, [Validators.required])
    });
  }

  close() {
    this.dialogRef.close();
  }

  async onSubmit() {
    this.dialogRef.close({ interests: this.interestsForm.value });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  click(result) {
    this.dialogRef.close(result);
  }
}
