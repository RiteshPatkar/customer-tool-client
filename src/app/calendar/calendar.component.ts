import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms'
import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {CalendarArrayDataModel, CalendarDataModel, DateAndFlagDataModel} from '../data/calendartab-data-model';
import {CALENDARS} from '../mock-data/mock-calendars';
import {CalendarService} from '../services/calendar.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import {IndexKind} from "typescript";
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  @Input() calendarArrayData: CalendarArrayDataModel;
  calendarFormGroup: FormGroup;
  // calendarDataFromService : Observable<CalendarArrayDataModel>;
  @Input() calendarData: CalendarDataModel;
  dateAndFlagFormGroup: FormGroup

  calendarDataFromService: CalendarArrayDataModel;

  nameChangeLog: string[] = [];
  isLoading = false;
  showNewRow = false;

  constructor(
    private calendarFormBuilder: FormBuilder,
	private router: Router,
    private calendarService: CalendarService) {
    alert("constructor");
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



  ngOnInit() {
    alert("ngOnInit");
    this.getCalendarsFromService();
    this.setCalendars(this.calendarDataFromService.calendars);
  }

  getCalendarsFromService() {
    alert("getCalendarsFromService");
    this.isLoading = true;
    this.calendarDataFromService = this.calendarService.getCalendarsByCountry([]);
    //	.finally(() => this.isLoading = false);
  }

  ngOnChanges() {
    alert("ngOnChanges");
    this.calendarFormGroup.reset({
    });
    this.setCalendars(this.calendarArrayData.calendars);
  }


  get calendarsOnScreen(): FormArray {
    alert('calendarsOnScreen');
    return this.calendarFormGroup.get('calendarsOnScreen') as FormArray
  }

  get datesAndFlags(): FormArray {
    alert('dateAndFlagsOnScreen');
    return this.calendarFormGroup.get('dateAndFlagsOnScreen') as FormArray
  }


  setCalendars(calendars: CalendarDataModel[]) {
    alert('setCalendars');
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
    //    this.calendarService.updateCalendars(this.calendarArrayData).subscribe(/* error handling */);
    let updatedCalendars = this.calendarService.updateCalendars(this.calendarArrayData);
    this.ngOnChanges();
  }

  prepareForSubmit(): CalendarArrayDataModel {
    alert('preparesubmit');
    const formModel = this.calendarFormGroup.value;
    const calendarsOnScreenDeepCopy: CalendarDataModel[] = formModel.calendarsOnScreen.map(
      (calendar: CalendarDataModel) => Object.assign({}, calendar));
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
    this.router.navigate(['/companies']);
  }

  previousTab() {
  	this.router.navigate(['/currencies']);
  }

  nextTab() {
    this.router.navigate(['/companies']);
  }
}
