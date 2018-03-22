import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { User } from '../../models/user.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  formProfile: FormGroup;
  profileErrors: string;
  user: User;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.initFormGroup();
    this.authService.user.subscribe(
      user => {
        if (user) {
          this.formProfile.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          });
          this.user = user;
        }
      }
    );
  }

  private initFormGroup() {
    this.formProfile = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      password: new FormControl(null),
      confirmPassword: new FormControl(null),
    });
  }

  onSubmit() {

    // Update Email
    if (this.user.email !== this.formProfile.value.email) {
      this.authService.updateEmail(this.formProfile.value.email)
      .catch(
        error => {
          console.log(error);
          this.profileErrors = error.message;
          this.formProfile.patchValue({ email: this.user.email });
        }
      );
    }

    // Update Profile (Firstname, Lastname)
    if (this.user.firstName !== this.formProfile.value.firstName || this.user.lastName !== this.formProfile.value.lastName) {
      this.authService.updateProfile(this.formProfile.value);
    }

    // Update password
    if (this.formProfile.value.password && this.formProfile.value.confirmPassword
      && (this.formProfile.value.password === this.formProfile.value.confirmPassword)) {
      this.authService.updatePassword(this.formProfile.value.password)
      .catch(
        error => {
          console.log(error);
          this.profileErrors = error.message;
        }
      );
    }
  }

}
