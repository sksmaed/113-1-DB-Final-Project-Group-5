// register.component.ts
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegisterComponent implements OnInit {
  form: FormGroup = new FormGroup({
    s_id: new FormControl(''),
    s_name: new FormControl(''),
    position: new FormControl(''),
    contract_start_date: new FormControl(''),
    password: new FormControl(''),
  });
  submitted = false;
  isSuccessful = false;;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        s_id: ['', [Validators.required]],
        s_name: ['', [Validators.required]],
        position: ['', [Validators.required]],
        contract_start_date: ['', [Validators.required]],
        password: ['', [Validators.required]],
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
    const { s_id, s_name, position, contract_start_date, password } = this.form.getRawValue();
    this.authService.register(s_id, s_name, position, contract_start_date, password).subscribe({
      next: (data) => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: (err) => {
        console.log(err);
        this.isSuccessful = false;
        this.isSignUpFailed = true;
      }
    });
  }

  onReset(): void {
    this.submitted = false;
    this.isSignUpFailed = false;
    this.form.reset();
  }
}
