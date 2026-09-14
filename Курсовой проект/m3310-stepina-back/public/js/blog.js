// blog.js - ES-модуль для работы с отзывами на странице блога.
// В модуле реализованы:
// - добавление нового отзыва через форму
// - рендер карточек отзывов по шаблону
// - редактирование и удаление существующих отзывов
// - сохранение отзывов в localStorage браузера и восстановление при загрузке страницы

const STORAGE_KEY = 'reviews';

const reviewForm = document.getElementById('review-form');
const reviewsContainer = document.getElementById('reviews-list');
const reviewCardTemplate = document.getElementById('review-card-template');
const editFieldsTemplate = document.getElementById('edit-fields-template');

function renderReview(reviewItem) {
  if (!reviewCardTemplate || !reviewsContainer) return;

  const cardElement = reviewCardTemplate.content.firstElementChild.cloneNode(true);
  cardElement.querySelector('.review-name').textContent = reviewItem.fullName;
  cardElement.querySelector('.review-comment').textContent = reviewItem.comment;
  reviewsContainer.appendChild(cardElement);
}

function saveReviewsToStorage() {
  if (!reviewsContainer) return;

  const reviewsData = [];
  reviewsContainer.querySelectorAll('.review-card').forEach((card) => {
    reviewsData.push({
      fullName: card.querySelector('.review-name').textContent.trim(),
      comment: card.querySelector('.review-comment').textContent.trim(),
    });
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewsData));
}

function loadReviewsFromStorage() {
  const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  savedData.forEach(renderReview);
}

function handleReviewsClick(event) {
  const clickedButton = event.target.closest('button');
  if (!clickedButton || !reviewsContainer || !editFieldsTemplate) return;

  const reviewCard = clickedButton.closest('.review-card');
  if (!reviewCard) return;

  const nameElement = reviewCard.querySelector('.review-name');
  const commentElement = reviewCard.querySelector('.review-comment');

  if (clickedButton.classList.contains('btn-delete')) {
    reviewCard.remove();
    saveReviewsToStorage();
    return;
  }

  if (clickedButton.classList.contains('btn-edit')) {
    const isCurrentlyEditing = clickedButton.textContent === 'Сохранить';

    if (isCurrentlyEditing) {
      const nameInput = nameElement.querySelector('.edit-name');
      const commentTextarea = commentElement.querySelector('.edit-comment');

      if (!nameInput || !commentTextarea) return;

      nameElement.textContent = nameInput.value.trim() || '-';
      commentElement.textContent = commentTextarea.value.trim() || '-';

      clickedButton.textContent = 'Редактировать';
      saveReviewsToStorage();
    } else {
      const fragment = editFieldsTemplate.content.cloneNode(true);
      const nameInput = fragment.querySelector('.edit-name');
      const commentTextarea = fragment.querySelector('.edit-comment');

      nameInput.value = nameElement.textContent;
      commentTextarea.value = commentElement.textContent;

      nameElement.innerHTML = '';
      nameElement.appendChild(nameInput);

      commentElement.innerHTML = '';
      commentElement.appendChild(commentTextarea);

      clickedButton.textContent = 'Сохранить';
    }
  }
}

function handleReviewFormSubmit(event) {
  event.preventDefault();
  if (!reviewForm) return;

  const fullName = reviewForm.fullName.value.trim();
  const comment = reviewForm.comment.value.trim();

  if (!fullName || !comment) {
    alert('Пожалуйста, заполните все поля.');
    return;
  }

  renderReview({ fullName, comment });
  saveReviewsToStorage();
  reviewForm.reset();
}

function initReviewsModule() {
  if (!reviewsContainer || !reviewCardTemplate || !editFieldsTemplate) {
    console.error('Отсутствует один из шаблонов или контейнер review-list. Проверь разметку страницы блога.');
    return;
  }

  reviewsContainer.addEventListener('click', handleReviewsClick);

  if (reviewForm) {
    reviewForm.addEventListener('submit', handleReviewFormSubmit);
  }

  loadReviewsFromStorage();
}

initReviewsModule();