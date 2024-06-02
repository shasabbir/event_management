if(!(localStorage.username && localStorage.password)){
    window.location.href = 'events.html';
  }

  $(document).ready(function() {
    fetchEvents();
  });

  var calendarEl = document.getElementById('calendar');
  var calendar;

  function ShowCalendar() {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      events: function(info, successCallback, failureCallback) {
        successCallback(events);
      },
    });

    calendar.render();
  }

  function fetchEvents() {
    $.ajax({
      url: 'http://127.0.0.1:5000/events',
      method: 'GET',
      success: function(data) {
        events = data;
        console.log(events);
        ShowCalendar();
      },
      error: function() {
        alert('There was an error fetching the events.');
      }
    });
  }

  $("#addEvent").on("click", function() {
    var obj = {
      title: $("#eventName").val(),
      start: $("#fromDate").val(),
      end: $("#toDate").val()
    };
    var objs = {
      title: $("#eventName").val(),
      start: $("#fromDate").val(),
      end: $("#toDate").val(),
      type: "default",
      username: localStorage.username,
      password: localStorage.password
    };
    var objstr = JSON.stringify(objs);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        if(JSON.parse(this.responseText).message == "Event inserted successfully") {
          events.push(obj);
          alert("Event inserted successfully");
        } else if (JSON.parse(this.responseText).message == "Invalid admin credentials") {
          alert("Invalid admin credentials");
          localStorage.clear();
          window.location.href = 'login.html';
        }

        calendar.refetchEvents();
      }
    });

    xhr.open("POST", "http://127.0.0.1:5000/events");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(objstr);
  });

  // Logout function
  document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.clear();
    window.location.href = 'events.html';
  });