document.addEventListener('DOMContentLoaded', function () {
  var params = new URLSearchParams(location.search);
  var key = params.get('key') || '';
  var apiBase =
    params.get('api') ||
    localStorage.getItem('bookingApiBase') ||
    'https://booking-api.calvindaniel.workers.dev';
  var statusEl = document.querySelector('[data-review-status]');
  var listEl = document.querySelector('[data-review-list]');

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  if (!key) {
    statusEl.textContent =
      'Add ?key=… (your review secret) to open this queue.';
    listEl.innerHTML = '';
    return;
  }

  fetch(
    apiBase.replace(/\/$/, '') +
      '/api/booking/pending?key=' +
      encodeURIComponent(key)
  )
    .then(function (r) {
      return r.json().then(function (d) {
        if (!r.ok) throw new Error(d.error || 'Unauthorized');
        return d;
      });
    })
    .then(function (data) {
      var rows = data.pending || [];
      if (!rows.length) {
        statusEl.textContent = 'No pending requests.';
        listEl.innerHTML = '';
        return;
      }
      statusEl.textContent = rows.length + ' pending';
      listEl.innerHTML = rows
        .map(function (p) {
          var websiteLine = p.website
            ? '<p class="booking-review__meta">' +
              escapeHtml(p.website) +
              '</p>'
            : '';
          return (
            '<li class="booking-review__item">' +
            '<p><strong>' +
            escapeHtml(p.name) +
            '</strong> · ' +
            escapeHtml(p.email) +
            '</p>' +
            '<p class="booking-review__time">' +
            escapeHtml(p.start) +
            '</p>' +
            websiteLine +
            (p.note
              ? '<p class="booking-review__note">' + escapeHtml(p.note) + '</p>'
              : '') +
            '<p class="booking-review__actions">' +
            '<a class="booking-review__approve" href="' +
            escapeHtml(p.approveUrl) +
            '">Approve</a> · ' +
            '<a class="booking-review__decline" href="' +
            escapeHtml(p.declineUrl) +
            '">Decline</a></p>' +
            '</li>'
          );
        })
        .join('');
    })
    .catch(function (e) {
      statusEl.textContent = e.message || 'Could not load.';
      listEl.innerHTML = '';
    });
});
