var Calendar = {
  init: function() {
    // moustache style templating
    _.templateSettings = {
      interpolate: /\{\{(.+?)\}\}/g
    };

    Calendar.break_size = 5;
    Calendar.shift_block = 4;
    Calendar.pay_period_length = 14;

    $(document).on('ready', function() {
      CalendarHolidays.addHolidays("cdn");
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
        Calendar.parseInputs(year, month, day, pay_year, pay_month, pay_day);
    });
  },

  listEvents: function() {
    return Calendar.calendar.fullCalendar("clientEvents");
  },

  generateBlock: function(data, pay_periods) {
    var events = [];
    var shift, pay_period;
    var title = _.template('Shift: {{shift}}, Pay: {{period}}');

    for (var i = 0; i < Calendar.shift_block; i++) {
      shift = new Date(data.year, data.month, data.date);

      var int_year = shift.getFullYear();
      var int_month = shift.getMonth();
      var int_date = shift.getDate();

      if (int_year > data.year) {
        data.valid_dates = false;
        break;
      }

      for (var n = 0; n < pay_periods.length; n++) {
        if (shift >= pay_periods[n].start && shift <= pay_periods[n].end) {
          pay_period = n;
          break;
        }
      }

      var shift_event = {
        title: title({shift: i, period: n}),
        // Plus 1 to month because FullCalendar has January as 1 instead of 0.
        start: int_year+ '-' + CalendarHelpers.pad(int_month + 1) + '-' + CalendarHelpers.pad(int_date),
        metadata: {
          year: int_year,
          month: int_month,
          date: int_date,
          pay_period: pay_period
        }
      };

      // This changes the pay_periods object JAVASCRIPT MAGIC:
      // Javascript always passes by value but if the variable is referring to an object (arrays include), the underlying object changes as well
      pay_periods[n].shifts.push(shift_event);
      events.push(shift_event);
      data.date++;
    }

    return events;
  },

  generatePayPeriodArray: function(data) {
    var pay_periods = [];
    var boundary = new Date(data.year, data.month, data.date);
    var i = 0;
    var period = {};

    while(boundary.getFullYear() <= data.year) {
      // have to use new Date .getTime() because javascript = passes reference to variable location instead of value
      // so we create a new object
      period['start'] = new Date(boundary.getTime());
      boundary = new Date(boundary.getFullYear(), boundary.getMonth(), boundary.getDate() + Calendar.pay_period_length);
      period['end'] = new Date(boundary.getTime());
      period['shifts'] = [];
      // $extend to deep copy
      pay_periods[i] = $.extend(true, {}, period);
      i++;
    }
    return pay_periods;
  },

  parseInputs: function(y, m, d, py, pm, pd) {
    var year = parseInt(y);
    // Subtract 1 because javascript Date library has January as 0
    var month = parseInt(m - 1);
    var day = parseInt(d);
    var pay_year = parseInt(py);
    var pay_month = parseInt(pm - 1);
    var pay_day = parseInt(pd);

    data = {
      year: year,
      month: month,
      date: day,
      pay_year: pay_year,
      pay_month: pay_month,
      pay_date: pay_day,
      valid_dates: true
    };

    Calendar.addShifts(data);
    // Calendar.addShifts(year, month, day, pay_year, pay_month, pay_day);
  },

  addShifts: function(data) {
    var events = [];
    var pay_period_array = Calendar.generatePayPeriodArray(data);
    var first_run = true;
    // var i = 0;
    while (data.valid_dates && (first_run || last_day.metadata.year === data.year)) {
      events = events.concat(Calendar.generateBlock(data, pay_period_array));
      var last_day = events[events.length-1];
      data.month = last_day.metadata.month;
      data.date = last_day.metadata.date + 1 + Calendar.break_size;
      first_run = false;
    }

    $('#calendar').fullCalendar("addEventSource", events);
  }
};
