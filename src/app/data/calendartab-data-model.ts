export class CalendarArrayDataModel {
  calendars: CalendarDataModel[];
}

export class CalendarDataModel {
  calendarCode='';
  calendarDescription='';
  closedDays='';
  datesAndFlags : DateAndFlagDataModel[];
}

export class DateAndFlagDataModel {
  flag='';
  date='';
}
