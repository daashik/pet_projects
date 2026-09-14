toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: 'toast-top-right',
  timeOut: '3000',
};

const reviewsEventSource = new EventSource('/events/reviews');

reviewsEventSource.onmessage = function (event) {
  const data = JSON.parse(event.data);
  const box = document.getElementById('reviews-sse-status');

  if (box) {
    box.innerText = data.message + ' (' + data.time + ')';
  }

  toastr.success(data.message + ' (' + data.time + ')');
};

reviewsEventSource.onerror = function () {
  const box = document.getElementById('reviews-sse-status');

  if (box) {
    box.innerText = 'Ошибка подключения';
  }

  toastr.error('Ошибка подключения');
};