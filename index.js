function createCalendar({ selector, eventsUrl, timezone }) {
  const calendarContainer = document.querySelector(selector);
  let currentDate = new Date();


  let events = [];

  async function loadEvents() {
    try {
      const response = await fetch(eventsUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      events = await response.json();
    } catch (error) {
      console.error("Error loading events:", error);
    }
  }


  function renderCalendar() {
    calendarContainer.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'calendar-header';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '<';
    prevBtn.addEventListener('click', () => changeMonth(-1));

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '>';
    nextBtn.addEventListener('click', () => changeMonth(1));

    const title = document.createElement('h2');
    title.textContent = `${currentDate.toLocaleString('default', {
      month: 'long',
    })} ${currentDate.getFullYear()}`;


    const timeDisplay = document.createElement('div');
    timeDisplay.className = 'calendar-time';
    header.append(prevBtn, title, nextBtn, timeDisplay);
    calendarContainer.appendChild(header);

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';

    const searchBox1 = document.createElement('input');
    searchBox1.type = 'text';
    searchBox1.placeholder = 'Search events...';
    searchBox1.className = 'search-box1';

    const searchBtn = document.createElement('button');
    searchBtn.textContent = 'Search';
    searchBtn.className = 'search-btn';

    searchContainer.append(searchBox1, searchBtn);
    calendarContainer.appendChild(searchContainer);


    searchBtn.addEventListener('click', () => {
      const query = searchBox1.value.trim().toLowerCase();
      searchBox1.value = '';
      if (query) {
        const filteredEvents = events.filter((event) =>
          event.title.toLowerCase().includes(query)
        );

        displaySearchResults(filteredEvents);
      } else {
        alert("Please enter a search term.");
      }
    });


    const todoList = document.createElement('div');
    const btn = document.createElement('button');
    btn.innerHTML = "Add";
    let searchBox = document.createElement('input')
    searchBox.setAttribute('placeholder', 'enter task');
    searchBox.id = "search-box"
    const list = document.createElement('ul')

    todoList.append(searchBox, btn, list)
    todoList.className = 'task-list';
    calendarContainer.appendChild(todoList)

    btn.addEventListener('click', () => {
      let taskText = searchBox.value.trim();

      if (taskText) {
        const taskItem = document.createElement('li');
        taskItem.textContent = taskText;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.id = "deleteBtn"
        deleteBtn.addEventListener('click', () => {
          taskItem.remove();
        });

        taskItem.appendChild(deleteBtn);

        list.appendChild(taskItem);
        searchBox.value = '';
      } else {
        alert("add a task")
      }
    });


    const weekHeader = document.createElement('div');
    weekHeader.className = 'calendar-weekdays';
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekDays.forEach((day) => {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-weekday';
      dayElement.textContent = day;
      weekHeader.appendChild(dayElement);
    });
    calendarContainer.appendChild(weekHeader);

    const daysGrid = document.createElement('div');
    daysGrid.className = 'calendar-days';
    daysGrid.innerHTML = renderDays();
    calendarContainer.appendChild(daysGrid);

    const footer = document.createElement('div');
    footer.className = 'calendar-footer';
    footer.textContent = 'Powered by Enhanced Calendar Plugin';
    calendarContainer.appendChild(footer);

    const eventDays = daysGrid.querySelectorAll('.calendar-day.event');
    eventDays.forEach((day) => {
      day.addEventListener('click', () => {
        const date = day.dataset.date;
        const event = events.find((e) => e.date === date);
        if (event) alert(`Event: ${event.title}`);
      });
    });

    setInterval(() => {
      const currentTime = new Date().toLocaleString('en-US', {
        timeZone: timezone
      });

      timeDisplay.textContent = `Time and Date: ${currentTime}`;
    }, 1000);
  }


  function renderDays() {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();

    let daysHTML = '';

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysHTML += `<div class="calendar-day empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const isEvent = events.some((event) => event.date === dateStr);

      daysHTML += `
        <div class="calendar-day ${isEvent ? 'event' : ''}" data-date="${dateStr}">
          ${day}
        </div>
      `;
    }

    return daysHTML;
  }



  function changeMonth(e) {
    currentDate.setMonth(currentDate.getMonth() + e);
    renderCalendar();
  }
  function displaySearchResults(filteredEvents) {
    const resultContainer = document.createElement('div');
    resultContainer.className = 'search-results';

    resultContainer.innerHTML = `<h3>Search Results:</h3>`;
    if (filteredEvents.length === 0) {
      resultContainer.innerHTML += `<p>No events found.</p>`;
    } else {
      filteredEvents.forEach((event) => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.textContent = `${event.title} ${event.date}`;
        resultContainer.appendChild(eventItem);
      });
    }


    const existingResults = document.querySelector('.search-results');
    if (existingResults) existingResults.remove();

    calendarContainer.appendChild(resultContainer);
  }


  async function init() {
    await loadEvents();
    renderCalendar();
  }

  init();
}
