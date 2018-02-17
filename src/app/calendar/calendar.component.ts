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
  countryCodes : CountryISOCodeArrayDataModel;
  selectedCountryCodes : string[] = [];

  constructor(
    private calendarFormBuilder: FormBuilder,
	private router: Router,
	private activatedRoute: ActivatedRoute,
    	private calendarService: CalendarService,
        private countryService: CountryService) {
    this.createFormGroup();
//    this.createChildFormGroup();
  }


  createFormGroup() {
    alert("createFormGroup");
    this.calendarFormGroup = this.calendarFormBuilder.group({
      calendarsOnScreen: this.calendarFormBuilder.array([])
//          calendarsOnScreen : this.calendarFormBuilder.array([this.init1()])
    });
  }

    ngOnInit() {
    this.getCalendarsFromService();
      this.getCountryCodes();
//    this.setCalendars(this.calendarDataFromService.calendars);
  }

    createChildFormGroup() {
    alert("createChildFormGroup");
    this.dateAndFlagFormGroup = this.calendarFormBuilder.group({
      datesAndFlags: this.calendarFormBuilder.array([])
    });
  }

  init1() {
    return this.calendarFormBuilder.group({
      calendarCode: [''],
      calendarDescription: [''],
      closedDays: [''],
      datesAndFlags: this.calendarFormBuilder.array([this.init2()])
    });
  }

  init2() {
    return this.calendarFormBuilder.group({
      date: [''],
      flag: ['']
    });
  }

 getCountryCodes() {
  alert('populate country codes for currency');
  const selectCountryCodes = this.activatedRoute.snapshot.paramMap.get('selectedCountryCodes');
  const userId = +this.activatedRoute.snapshot.paramMap.get('userId');
  alert(selectCountryCodes);
    if(selectCountryCodes != null && selectCountryCodes != 'undefined' && selectCountryCodes.length > 0) {
 	   alert(JSON.stringify(this.countryCodes, null, 4));
 	   alert(selectCountryCodes.split(','));
 	   this.countryCodes = new CountryISOCodeArrayDataModel();
 	   this.countryCodes.countryCodes = selectCountryCodes.split(',');
       return;
    } else {
    this.countryService.getCountryCodesForUser(userId).subscribe(result => this.countryCodes = result)
  }
  }


  getCalendarsFromService() {
    alert("getCalendarsFromService");
    this.isLoading = true;
      const userId = +this.activatedRoute.snapshot.paramMap.get('userId');
  const selectCountryCodes = this.activatedRoute.snapshot.paramMap.get('selectedCountryCodes');
  alert(selectCountryCodes)
  if(selectCountryCodes != null && selectCountryCodes != 'undefined' && selectCountryCodes.length > 0) {
    this.calendarService.getCalendarsByCountry(userId, selectCountryCodes).subscribe(calendarArrayData => this.setCalendars(calendarArrayData.calendars))
    return;
    }
    this.calendarService.getCalendars(userId).subscribe(calendarArrayData => this.setCalendars(calendarArrayData.calendars));
   //	.finally(() => this.isLoading = false);
  }

  ngOnChanges() {
    this.calendarFormGroup.reset({
    });
    this.setCalendars(this.calendarArrayData.calendars);
  }


  get calendarsOnScreen(): FormArray {
    return this.calendarFormGroup.get('calendarsOnScreen') as FormArray
  }

  get datesAndFlags(): FormArray {
    alert('dateAndFlagsOnScreen');
    return this.calendarFormGroup.get('dateAndFlagsOnScreen') as FormArray
  }


  setCalendars(calendars: CalendarDataModel[]) {
  alert('IN Calendar set');
  alert(JSON.stringify(calendars, null, 4));
    const calendarsFormGroups = calendars.map(calendar => this.buildEachCalendarForm(calendar));
    const calendarFormArray = this.calendarFormBuilder.array(calendarsFormGroups);
    this.calendarFormGroup.setControl('calendarsOnScreen', calendarFormArray);
  }

  buildEachCalendarForm(calendar: CalendarDataModel) {
    alert('buildEachCalendarForm');
    this.setChildDateAndFlag(calendar.datesAndFlags);
    return this.calendarFormBuilder.group(calendar);
  }

  setChildDateAndFlag(dateAndFlags: DateAndFlagDataModel[]) {
    alert('setChildDateAndFlag');
    alert(JSON.stringify(dateAndFlags));
    const dateAndFlagsFormGroups = dateAndFlags.map(dateAndFlag => this.calendarFormBuilder.group(dateAndFlag));
    const dateAndFlagFormArray = this.calendarFormBuilder.array(dateAndFlagsFormGroups);
    this.dateAndFlagFormGroup.setControl('datesAndFlags', dateAndFlagFormArray);
  }

  add() {
    alert('add');
    this.showNewRow = true;
    this.calendarsOnScreen.push(this.calendarFormBuilder.group(new CalendarDataModel()));
  }

  submit() {
    alert('submit');
    this.showNewRow = false;
    this.calendarArrayData = this.prepareForSubmit();
    this.calendarService.updateCalendars(this.calendarArrayData).subscribe();
    //let updatedCalendars = this.calendarService.updateCalendars(this.calendarArrayData);
    this.ngOnChanges();
  }

  prepareForSubmit(): CalendarArrayDataModel {
    alert('preparesubmit');
    const formModel = this.calendarFormGroup.value;
    const calendarsOnScreenDeepCopy: CalendarDataModel[] = formModel.calendarsOnScreen.map(
      (calendar: CalendarDataModel) => Object.assign({}, calendar));
    for(let calendar of calendarsOnScreenDeepCopy) {
        alert(this.activatedRoute.snapshot.paramMap.get('userId'));
        calendar.userId = this.activatedRoute.snapshot.paramMap.get('userId');
        this.selectedCountryCodes.push(calendar.countryCode);
      }
    const saveCalendarArrayDataModel: CalendarArrayDataModel = {
      calendars: calendarsOnScreenDeepCopy
    }

    return saveCalendarArrayDataModel;
  }

  revert() {
    alert('revert');
    this.ngOnChanges();
  }

  delete(i: number, calendar: CalendarDataModel) {
    alert('delete');
    
    this.calendarService.removeCalendar(calendar);
    this.calendarsOnScreen.removeAt(i);
  }

  next() {
  if(!this.calendarFormGroup.pristine){
    this.submit();
    }
    
    //create unique set of country codes
    this.selectedCountryCodes = Array.from(new Set(this.selectedCountryCodes.map((itemInArray) => itemInArray)));
    
    this.router.navigate(['/companies/'+this.activatedRoute.snapshot.paramMap.get('userId')+'/'+this.selectedCountryCodes]);
  }

  previousTab() {
  if(this.selectedCountryCodes.length === 0) {
  	this.router.navigate(['/currencies/'+this.activatedRoute.snapshot.paramMap.get('userId')]);
  	} else {
  	this.selectedCountryCodes = Array.from(new Set(this.selectedCountryCodes.map((itemInArray) => itemInArray)));
    
    this.router.navigate(['/currencies/'+this.activatedRoute.snapshot.paramMap.get('userId')+'/'+this.selectedCountryCodes]);
  	}
  }

  nextTab() {
    this.router.navigate(['/companies/'+this.activatedRoute.snapshot.paramMap.get('userId')]);
  }
}
