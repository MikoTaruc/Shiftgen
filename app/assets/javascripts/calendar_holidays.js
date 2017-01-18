var CalendarHolidays = {
  addHolidays: function(region) {
    $('#calendar').fullCalendar({
      eventSources: [
        {
          googleCalendarApiKey: 'AIzaSyDcnW6WejpTOCffshGDDb4neIrXVUA1EAE',
          url: 'en.canadian#holiday@group.v.calendar.google.com',
          color: '#378006'
        }
      ],
      height: 400,
      aspectRatio: 2
    });
  }
};
