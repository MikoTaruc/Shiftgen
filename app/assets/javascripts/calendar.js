var Calendar = {

  init: function(){
    $(document).on('ready', function(){
      $('#calendar').fullCalendar({
        height: 400,
        aspectRatio: 2
      });

      Calendar.calendar = $('#calendar');
    });
  },

  addEvent: function() {
    $('#calendar').fullCalendar('renderEvent', {title:'event1', start:'2016-11-01'});
  },

  addEvents: function() {
    var events = [
      {title: 'event2', start: '2016-11-02'},
      {title: 'event3', start: '2016-11-03'}
    ];

    Calendar.calendar.fullCalendar("addEventSource", events);
  },

  listEvents: function() {
    return Calendar.calendar.fullCalendar("clientEvents");
  }
};
