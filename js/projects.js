document.addEventListener('DOMContentLoaded', function () {
  var btns  = document.querySelectorAll('[data-filter]');
  var cards = document.querySelectorAll('[data-category]');

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.dataset.filter;

      btns.forEach(function (b) { b.setAttribute('data-active', 'false'); });
      btn.setAttribute('data-active', 'true');

      cards.forEach(function (card) {
        var wrap = card.closest('[data-reveal]') || card;
        wrap.style.display = (filter === 'All' || card.dataset.category === filter) ? '' : 'none';
      });
    });
  });
});
