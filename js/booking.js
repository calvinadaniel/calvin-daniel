document.addEventListener('DOMContentLoaded', function () {
  var root = document.querySelector('[data-booking]');
  if (!root) return;

  var DEFAULT_API = 'https://api.calvindaniel.com';
  var params = new URLSearchParams(window.location.search);
  var apiBase =
    params.get('api') ||
    localStorage.getItem('bookingApiBase') ||
    DEFAULT_API;

  var statusEl = root.querySelector('[data-booking-status]');
  var loadingEl = root.querySelector('[data-booking-loading]');
  var stepDay = root.querySelector('[data-step="day"]');
  var stepSlot = root.querySelector('[data-step="slot"]');
  var stepForm = root.querySelector('[data-step="form"]');
  var stepDone = root.querySelector('[data-step="done"]');
  var dayList = root.querySelector('[data-day-list]');
  var slotList = root.querySelector('[data-slot-list]');
  var form = root.querySelector('#booking-form');
  var selectedEls = root.querySelectorAll('[data-selected-slot]');
  var dayLabelEls = root.querySelectorAll('[data-selected-day]');
  var doneTime = root.querySelector('[data-done-time]');

  var state = {
    days: [],
    dayKey: null,
    dayLabel: null,
    slot: null,
  };

  var setStatus = function (msg, kind) {
    if (!statusEl) return;
    statusEl.textContent = msg || '';
    statusEl.className = 'booking__status' + (kind ? ' booking__status--' + kind : '');
  };

  var showStep = function (name) {
    [stepDay, stepSlot, stepForm, stepDone].forEach(function (el) {
      if (!el) return;
      el.classList.toggle('is-active', el.getAttribute('data-step') === name);
    });
  };

  var syncSelectedLabels = function () {
    var text = state.slot ? state.slot.label : '';
    selectedEls.forEach(function (el) {
      el.textContent = text;
    });
  };

  var renderDays = function () {
    dayList.innerHTML = '';
    if (!state.days.length) {
      setStatus('No open times in the next two weeks. Email info@calvindaniel.com and I will find a slot.', 'error');
      return;
    }
    state.days.forEach(function (day) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'booking__day-btn';
      btn.innerHTML =
        day.label +
        '<span class="booking__day-meta">' +
        day.slots.length +
        (day.slots.length === 1 ? ' time' : ' times') +
        '</span>';
      btn.addEventListener('click', function () {
        state.dayKey = day.dayKey;
        state.dayLabel = day.label;
        dayLabelEls.forEach(function (el) {
          el.textContent = day.label;
        });
        renderSlots(day);
        showStep('slot');
        setStatus('');
      });
      li.appendChild(btn);
      dayList.appendChild(li);
    });
  };

  var renderSlots = function (day) {
    slotList.innerHTML = '';
    day.slots.forEach(function (slot) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'booking__slot-btn';
      var timeOnly = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(slot.start));
      btn.textContent = timeOnly;
      btn.addEventListener('click', function () {
        state.slot = slot;
        syncSelectedLabels();
        showStep('form');
        setStatus('');
        var nameInput = document.getElementById('bk-name');
        if (nameInput) nameInput.focus();
      });
      li.appendChild(btn);
      slotList.appendChild(li);
    });
  };

  root.querySelectorAll('[data-booking-back]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var to = btn.getAttribute('data-booking-back');
      if (to === 'day') {
        state.dayKey = null;
        state.slot = null;
        showStep('day');
      } else if (to === 'slot') {
        state.slot = null;
        var day = state.days.find(function (d) {
          return d.dayKey === state.dayKey;
        });
        if (day) renderSlots(day);
        showStep('slot');
      }
      setStatus('');
    });
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setStatus('');
      if (!state.slot) {
        setStatus('Pick a time first.', 'error');
        showStep('day');
        return;
      }
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var submitBtn = document.getElementById('bk-submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Booking…';
      }

      var payload = {
        start: state.slot.start,
        name: document.getElementById('bk-name').value.trim(),
        email: document.getElementById('bk-email').value.trim(),
        website: (document.getElementById('bk-website').value || '').trim(),
        note: (document.getElementById('bk-note').value || '').trim(),
      };

      fetch(apiBase.replace(/\/$/, '') + '/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok) throw new Error(data.error || 'Booking failed');
            return data;
          });
        })
        .then(function (data) {
          if (doneTime) doneTime.textContent = data.label || state.slot.label;
          showStep('done');
          setStatus('');
          form.reset();
        })
        .catch(function (err) {
          setStatus(err.message || 'Could not book. Try another time or email me.', 'error');
          if (/no longer available/i.test(err.message || '')) {
            loadAvailability();
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Confirm booking';
          }
        });
    });
  }

  var loadAvailability = function () {
    if (loadingEl) loadingEl.hidden = false;
    showStep('day');
    setStatus('');
    fetch(apiBase.replace(/\/$/, '') + '/api/availability', {
      headers: { Accept: 'application/json' },
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || 'Could not load times');
          return data;
        });
      })
      .then(function (data) {
        state.days = data.days || [];
        renderDays();
      })
      .catch(function (err) {
        setStatus(
          err.message ||
            'Booking is temporarily unavailable. Email info@calvindaniel.com.',
          'error'
        );
        dayList.innerHTML = '';
      })
      .finally(function () {
        if (loadingEl) loadingEl.hidden = true;
      });
  };

  loadAvailability();
});
