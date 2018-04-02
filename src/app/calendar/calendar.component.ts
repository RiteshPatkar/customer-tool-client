import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms'
import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import {IndexKind} from "typescript";
import {Location} from '@angular/common';
import {CalendarArrayDataModel, CalendarDataModel, DateAndFlagDataModel} from '../data/calendartab-data-model';
import { CountryISOCodeArrayDataModel} from '../data/countrytab-data-model';
import {CALENDARS} from '../mock-data/mock-calendars';
import {CalendarService} from '../services/calendar.service';
import { CountryService } from '../services/country.service';

//import 'circular-json';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

    @Input() calendarArrayData: CalendarArrayDataModel;
    calendarFormGroup: FormGroup;
    dateAndFlagFormGroup: FormGroup
    nameChangeLog: string[] = [];
    isLoading = false;
    showNewRow = false;
    countryCodes: CountryISOCodeArrayDataModel;
    selectedCountryCodes: string[] = [];
       
    constructor(
        private calendarFormBuilder: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private calendarService: CalendarService,
        private countryService: CountryService) {
        this.createFormGroup();
        this.createChildFormGroup();
    }
    
        createFormGroup() {
        this.calendarFormGroup = this.calendarFormBuilder.group({
            calendarsOnScreen: this.calendarFormBuilder.array([])
        });
    }

    createChildFormGroup() {
        this.dateAndFlagFormGroup = this.calendarFormBuilder.group({
            datesAndFlags: this.calendarFormBuilder.array([])
        });
    }
    
    ngOnInit() {
        
           if(JSON.parse(localStorage.getItem('currentUser')) == null || JSON.parse(localStorage.getItem('currentUser')) == '') {
          this.router.navigate(['']);
      }
        
        this.getCalendarsFromService();
        this.getCountryCodes();
    }

    getCountryCodes() {
        const selectCountryCodes = this.activatedRoute.snapshot.paramMap.get('selectedCountryCodes');
        let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
        if (selectCountryCodes != null && selectCountryCodes != 'undefined' && selectCountryCodes.length > 0) {
            this.countryCodes = new CountryISOCodeArrayDataModel();
            this.countryCodes.countryCodes = selectCountryCodes.split(',');
            return;
        } else {
            this.countryService.getCountryCodesForUser(userId).subscribe(result => this.countryCodes = result)
        }
    }


    getCalendarsFromService() {
        this.isLoading = true;
          let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
        const selectCountryCodes = this.activatedRoute.snapshot.paramMap.get('selectedCountryCodes');
        if (selectCountryCodes != null && selectCountryCodes != 'undefined' && selectCountryCodes.length > 0) {
            this.calendarService.getCalendarsByCountry(userId, selectCountryCodes).subscribe(calendarArrayData => this.setCalendars(calendarArrayData.calendars))
            return;
        }
        this.calendarService.getCalendars(userId).subscribe(calendarArrayData => this.setCalendars(calendarArrayData.calendars));
        //	.finally(() => this.isLoading = false);
    }

    setCalendars(calendars: CalendarDataModel[]) {
        const calendarsFormGroups = calendars.map(calendar => this.buildEachCalendarForm(calendar));
        const calendarFormArray = this.calendarFormBuilder.array(calendarsFormGroups);
        this.calendarFormGroup.setControl('calendarsOnScreen', calendarFormArray);
    }

    buildEachCalendarForm(calendar: CalendarDataModel) {
        let formGroup = this.calendarFormBuilder.group(calendar);
        const dateAndFlagsFormGroups = (calendar.datesAndFlags).map(dateAndFlag => this.calendarFormBuilder.group(dateAndFlag));
        const dateAndFlagFormArray = this.calendarFormBuilder.array(dateAndFlagsFormGroups);
        
        formGroup.setControl('datesAndFlags', dateAndFlagFormArray);
        return formGroup;
    }
    
    ngOnChanges() {
        this.calendarFormGroup.reset({
        });
        this.setCalendars(this.calendarArrayData.calendars);
    }


    get calendarsOnScreen(): FormArray {
        return this.calendarFormGroup.get('calendarsOnScreen') as FormArray
    }

    addDatesAndFlags(i: number): FormArray {
        var array = this.calendarFormGroup.get('calendarsOnScreen') as FormArray;
        var group = array.at(i) as FormGroup
        return group.get('datesAndFlags') as FormArray;
    }

    add() {
        this.showNewRow = true;
        
        var group = this.calendarFormBuilder.group({
            id : 0,
            userId :'',
            countryCode :'',
            calendarCode:'',
            calendarDescription:'',
            closedDays:'',
            datesAndFlags : this.calendarFormBuilder.array([])
            });
        
        this.calendarsOnScreen.push(group);
    }
    
     addDateAndFlag(i: number) {
        this.showNewRow = true;
        this.addDatesAndFlags(i).push(this.calendarFormBuilder.group(new DateAndFlagDataModel()));
    }

    submit() {
        this.showNewRow = false;
        this.calendarArrayData = this.prepareForSubmit();
        this.calendarService.updateCalendars(this.calendarArrayData).subscribe();
        //let updatedCalendars = this.calendarService.updateCalendars(this.calendarArrayData);
        this.ngOnChanges();
    }

    prepareForSubmit(): CalendarArrayDataModel {
        const formModel = this.calendarFormGroup.value;
        const calendarsOnScreenDeepCopy: CalendarDataModel[] = formModel.calendarsOnScreen.map(
            (calendar: CalendarDataModel) => Object.assign({}, calendar));
        for (let calendar of calendarsOnScreenDeepCopy) {
            calendar.userId = this.activatedRoute.snapshot.paramMap.get('userId');
            this.selectedCountryCodes.push(calendar.countryCode);
        }
        const saveCalendarArrayDataModel: CalendarArrayDataModel = {
            calendars: calendarsOnScreenDeepCopy
        }

        return saveCalendarArrayDataModel;
    }

    revert() {
        this.ngOnChanges();
    }

    delete(i: number, calendar: CalendarDataModel) {
        this.calendarService.removeCalendar(calendar);
        this.calendarsOnScreen.removeAt(i);
    }

    next() {
        if (!this.calendarFormGroup.pristine) {
            this.submit();
        }

        //create unique set of country codes
        this.selectedCountryCodes = Array.from(new Set(this.selectedCountryCodes.map((itemInArray) => itemInArray)));

        this.router.navigate(['/companies/' + this.activatedRoute.snapshot.paramMap.get('userId') + '/' + this.selectedCountryCodes]);
    }

    previousTab() {
        if (this.selectedCountryCodes.length === 0) {
            this.router.navigate(['/currencies/' + this.activatedRoute.snapshot.paramMap.get('userId')]);
        } else {
            this.selectedCountryCodes = Array.from(new Set(this.selectedCountryCodes.map((itemInArray) => itemInArray)));

            this.router.navigate(['/currencies/' + this.activatedRoute.snapshot.paramMap.get('userId') + '/' + this.selectedCountryCodes]);
        }
    }

    nextTab() {
        this.router.navigate(['/companies/' + this.activatedRoute.snapshot.paramMap.get('userId')]);
    }
}
