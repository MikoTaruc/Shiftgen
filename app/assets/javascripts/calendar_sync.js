var CalendarSync = {
  sync: function(data) {
    $.ajax({
      url: '/google_sync',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      dataType: 'json',
      success: function() {
        console.log("SUCCESS");
      },
      error: function() {
        console.log("FAILURE");
      }
    });
  }
};
