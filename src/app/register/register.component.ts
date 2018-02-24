import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable }        from 'rxjs/Observable';

import { AlertService, UserService } from '../services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

    register() {
      alert('1')
        this.loading = true;
        this.userService.create(this.model)
            .subscribe(
                result => {
                  alert('3');
                  alert(JSON.stringify(result, null, 4));
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login/']);
                },
                error => {
                  alert('2')
                  alert(JSON.stringify(error, null, 4));
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
