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

        var pay_year = $(this).find("#pay_year").val();
        var pay_month = $(this).find("#pay_month").val();
        var pay_day =  $(this).find("#pay_day").val();
        Calendar.addShifts(year, month, day, pay_year, pay_month, pay_day);
    });
  },

  listEvents: function() {
    return Calendar.calendar.fullCalendar("clientEvents");
  },

  generateBlock: function(y, m, d, blockSize, pay_periods) {
    var events = [];
    var shift, pay_period;
    var title = _.template('Shift: {{shift}}');
    for (var i = 0; i < blockSize; i++) {
      shift = new Date(y, m, d);
      var int_year = shift.getFullYear();
      var int_month = shift.getMonth();
      var int_date = shift.getDate();

      for (var n = 0; n < pay_periods.length; n++) {
        if (shift >= pay_periods[n].start && shift <= pay_periods[n].end) {
          pay_period = n;
          break;
        }
      }
      var title
      events.push({
        title: title({shift: i}),
        // Plus 1 to month because FullCalendar has January as 1 instead of 0.
        start: int_year+ '-' + Calendar.pad(int_month + 1) + '-' + Calendar.pad(int_date),
        metadata: {
          year: int_year,
          month: int_month,
          date: int_date,
          pay_period: pay_period
        }
      });
      d++;
    }
    return events;
  },

  generatePayPeriodArray: function(y, m, d, block_size, current_year) {
    var pay_periods = [];
    var boundary = new Date(y, m, d);
    var i = 0;
    var period = {};

    while(boundary.getFullYear() <= current_year) {
      // have to use new Date .getTime() because javascript = passes reference to variable location instead of value
      // so we create a new object
      period['start'] = new Date(boundary.getTime());
      boundary = new Date(boundary.getFullYear(), boundary.getMonth(), boundary.getDate() + block_size);
      period['end'] = new Date(boundary.getTime());
      // $extend to deep copy
      pay_periods[i] = $.extend(true, {}, period);
      i++;
    }
    return pay_periods;
  },

  pad: function(num){
    if (num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  },

  addShifts: function(y, m, d, py, pm, pd) {
    var year = parseInt(y);
    // Subtract 1 because javascript Date library has January as 0
    var month = parseInt(m - 1);
    var day = parseInt(d);
    var pay_year = parseInt(py);
    var pay_month = parseInt(pm - 1);
    var pay_day = parseInt(pd);
    var events = [];
    var pay_period_array = Calendar.generatePayPeriodArray(pay_year, pay_month, pay_day, 14, year);
    var first_run = true;
    var break_size = 5;

    while(first_run || last_day.metadata.year === year) {
      events = events.concat(Calendar.generateBlock(year, month, day, 4, pay_period_array));
      var last_day = events[events.length-1];
      month = last_day.metadata.month;
      day = last_day.metadata.date + 1 + break_size;
      first_run = false;
    }

    debugger;

    $('#calendar').fullCalendar("addEventSource", events);
  }
};
