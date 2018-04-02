import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    @Output() loggedInEvent: EventEmitter<string> = new EventEmitter<string>();
    model: any = {};
    loading = false;
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { }

    ngOnInit() {
        localStorage.removeItem('currentUser');
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                data => {
                    // this.router.navigate([this.returnUrl]);
                    this.loggedInEvent.emit('loggedIn');
                      this.router.navigate(['/countries/'+data.userId]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
