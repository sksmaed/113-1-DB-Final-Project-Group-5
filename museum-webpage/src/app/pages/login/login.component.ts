// login.component.ts
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { TokenStorageService } from '../../shared/services/token-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')    
  });
  isLoggedIn = false;
  isLoginFailed = false;
  submitted = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
    this.form = this.formBuilder.group(
      {
        username: ['',[Validators.required]],
        password: ['',[Validators.required]]
      }
    )
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const { username, password } = this.form.getRawValue();

    this.authService.login(username, password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.roloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    })
  }

  roloadPage(): void {
    this.submitted = false;
    location.reload();
  }

  onReset(): void {
    this.submitted = false;
    this.isLoginFailed = false;
    this.form.reset();
  }
}