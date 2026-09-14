const scheduleSection = document.getElementById('schedule-table');

if (!scheduleSection) {
  console.error('Не найден элемент с id="schedule-table". Проверь разметку в index.html');
} else if (typeof Tabulator === 'undefined') {
  console.error('Tabulator не загружен. Проверь подключение CDN в <head>.');
} else {
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatDay(dateString) {
    const date = new Date(dateString);
    return dayNames[date.getDay()];
  }

  function extractTrainer(title) {
    const match = title.match(/\((.*?)\)$/);
    return match ? match[1] : '-';
  }

  function extractType(title) {
    const parts = title.split(' - ');
    if (parts.length >= 2) {
      const rawType = parts[1];
      return rawType.replace(/\s*\(.*?\)\s*$/, '');
    }
    return title;
  }

  fetch('/api/schedule')
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Ошибка загрузки расписания: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      const scheduleData = data.map((slot) => ({
        id: slot.id,
        day: formatDay(slot.startAt),
        time: `${formatTime(slot.startAt)}-${formatTime(slot.endAt)}`,
        type: extractType(slot.title),
        trainer: extractTrainer(slot.title),
      }));

      new Tabulator(scheduleSection, {
        data: scheduleData,
        layout: 'fitColumns',
        height: 'auto',
        responsiveLayout: 'collapse',
        placeholder: 'Расписание не найдено',
        columns: [
          { title: 'День', field: 'day', width: 80 },
          { title: 'Время', field: 'time', width: 120 },
          { title: 'Тип занятия', field: 'type', headerFilter: 'input', widthGrow: 3 },
          { title: 'Тренер', field: 'trainer', headerFilter: 'input', widthGrow: 1 },
          {
            title: 'Действия',
            field: 'id',
            hozAlign: 'center',
            width: 260,
            formatter(cell) {
              const id = cell.getValue();

              return `
                <div class="schedule-actions">
                  <a href="/schedule/${id}" class="table-action-btn view-btn">Подробнее</a>
                  <a href="/schedule/${id}/edit" class="table-action-btn edit-btn">Редактировать</a>
                  <form action="/schedule/${id}/delete" method="POST" class="table-delete-form">
                    <button type="submit" class="table-action-btn delete-btn">Удалить</button>
                  </form>
                </div>
              `;
            },
          },
        ],
        pagination: false,
      });

      console.log('Таблица расписания успешно инициализирована');
    })
    .catch((e) => {
      console.error('Ошибка при загрузке или инициализации расписания:', e);
    });
}