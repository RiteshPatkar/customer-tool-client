import { Component } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

//  constructor(private activatedRoute: ActivatedRoute)
    
//    alert(this.paramMap);


//  showTabs = (+this.activatedRoute != 'undefined' 
//                && +this.activatedRoute.snapshot != 'undefined' 
//                    && +this.activatedRoute.snapshot.paramMap != 'undefined' 
//                        && +this.activatedRoute.snapshot.paramMap.get('userId') != 'undefined' 
//                            && +this.activatedRoute.snapshot.paramMap.get('userId') != null);
    showTabs: boolean = true;
    
    loggedInState(event) {
    this.showTabs = true;
  }
}
