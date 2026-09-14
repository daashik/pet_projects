// achievements.js - ES-модуль для загрузки и отображения достижений клуба.
// В модуле реализовано:
// - получение списка достижений по сети через fetch (JSON API)
// - отображение карточек достижений по шаблону <template>
// - вывод индикатора загрузки и сообщения об ошибке
// - использование запасных данных (fallback), если сервер недоступен

const listContainer = document.getElementById('achievements-list');
const loader = document.getElementById('achievements-loader');
const errorBlock = document.getElementById('achievements-error');
const template = document.getElementById('achievement-card-template');

const fallbackData = [
  {
    title: 'Победа!',
    description:
      'Самый лучший конный клуб, получивший награду - признание общественности.',
    date: '09 сентября 2016',
  },
];

function displayAchievements(achievements) {
  if (!listContainer) return;

  if (loader) {
    loader.classList.add('hidden');
  }

  listContainer.innerHTML = '';

  if (!template) {
    listContainer.innerHTML = '<p>Ошибка: шаблон не найден.</p>';
    return;
  }

  achievements.forEach((item) => {
    const clone = template.content.cloneNode(true);
    const title = clone.querySelector('.achievement-title');
    const desc = clone.querySelector('.achievement-description');
    const date = clone.querySelector('.achievement-date');

    if (title) title.textContent = item.title || 'Без названия';
    if (desc) desc.textContent = item.description || '';
    if (date) date.textContent = item.date || '';

    listContainer.appendChild(clone);
  });
}

function handleAchievementsError(error) {
  console.error('Не удалось загрузить достижения:', error);

  // Показываем запасные данные
  displayAchievements(fallbackData);

  if (errorBlock) {
    errorBlock.classList.remove('hidden');
  }

  if (loader) {
    loader.classList.add('hidden');
  }
}

function loadAchievements() {
  if (!listContainer) return;

  if (loader) {
    loader.classList.remove('hidden');
  }

  const url =
    'https://raw.githubusercontent.com/daashik/my-horse-gallery/main/db.json';

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Сервер вернул ошибку: ' + response.status);
      }
      return response.json();
    })
    .then((data) => {
      const achievements = Array.isArray(data?.achievements)
        ? data.achievements
        : [];

      if (achievements.length > 0) {
        displayAchievements(achievements);
      } else {
        displayAchievements(fallbackData);
      }
    })
    .catch(handleAchievementsError);
}

loadAchievements();
