export class CalendarArrayDataModel {
  calendars: CalendarDataModel[];
}

export class CalendarDataModel {

  id = 0;
  userId = '';
  countryCode = '';
  
  calendarCode='';
  calendarDescription='';
  closedDays='';
  datesAndFlags : DateAndFlagDataModel[];
}

export class DateAndFlagDataModel {
  id = 0;	
  flag='';
  date='';
}

export class CountryISOCodeArrayDataModel {
  countryCodes: any[];
}
