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

  calculateDaysInMonth: function(year, month) {
    var monthStart = new Date(year, month, 1);
    var monthEnd = new Date(year, month + 1, 1);
    var monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24);
    return monthLength;
  },

  addShifts: function(y, m, d) {
    var int_year = parseInt(y);
    var int_month = parseInt(m);
    var int_day = parseInt(d);
    Math.floor(Calendar.calculateDaysInMonth(int_year, int_month));

    date = _.template("{{ year }}-{{ month }}-{{ day }}");
    $('#calendar').fullCalendar('renderEvent', {title: 'Shift', start: date({year: y, month: m, day: d})});
  }
};
