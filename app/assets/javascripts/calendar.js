var Calendar = {
  init: function(){
    // moustache style templating
    _.templateSettings = {
      interpolate: /\{\{(.+?)\}\}/g
    };

    $(document).on('ready', function(){
      $('#calendar').fullCalendar({
        height: 400,
        aspectRatio: 2
      });

      Calendar.calendar = $('#calendar');
      Calendar.initListeners();
    });
  },

  initListeners: function() {
    $('#date_form').on('submit', function(e){
        e.preventDefault();
        var year = $(this).find("#year").val();
        var month = $(this).find("#month").val();
        var day =  $(this).find("#day").val();
        Calendar.addShifts(year, month, day);
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
  },

  generateBlock: function(y, m, d, blockSize) {
    var events = [];
    var shift;
    for (var i = 0; i < blockSize; i++) {
      shift = new Date(y, m, d);
      var int_year = shift.getFullYear();
      var int_month = shift.getMonth();
      var int_date = shift.getDate();
      events.push({
        title: 'shift',
        // Plus 1 to month because FullCalendar has January as 1 instead of 0.
        start: int_year+ '-' + Calendar.pad(int_month + 1) + '-' + Calendar.pad(int_date),
        extras: {
          year: int_year,
          month: int_month,
          date: int_date
        }
      });
      d++;
    }
    return events;
  },

  pad: function(num){
    if (num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  },

  addShifts: function(y, m, d) {
    var int_year = parseInt(y);
    // Subtract 1 because javascript Date has January as 0
    var int_month = parseInt(m - 1);
    var int_day = parseInt(d);
    var events = [];
    var first_run = true;
    var break_size = 5;
    while(first_run || last_day.extras.year === int_year) {
      events = events.concat(Calendar.generateBlock(int_year, int_month, int_day, 4));
      var last_day = events[events.length-1];
      int_month = last_day.extras.month;
      int_day = last_day.extras.date + 1 + break_size;
      first_run = false;
    }

    $('#calendar').fullCalendar("addEventSource", events);
  }
};
