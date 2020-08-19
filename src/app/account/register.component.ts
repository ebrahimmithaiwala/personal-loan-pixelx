import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {

    form: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private http: HttpClient,
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            city: ['', Validators.required],
            panNumber: ['', [Validators.required, Validators.maxLength(10), Validators.pattern("^[A-Za-z]{5}[0-9]{4}[A-Za-z]$")]],
            fullName: ['', [Validators.required, Validators.maxLength(120)]],
            email: ['', [Validators.required, Validators.maxLength(255), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
            mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    getOtp(){

        this.http.post("http://lab.thinkoverit.com/api/verifyOTP.php", (res) => {
                res.status(200).send({});
               });
    
      }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    this.router.navigate(['.home'], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });

                  
    }
}