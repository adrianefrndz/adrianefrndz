// Scrollspy-like behavior for navbar
window.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar .nav-link');

  function onScroll() {
    let scrollPos = window.scrollY || document.documentElement.scrollTop;
    let offset = 80; // adjust if navbar height changes
    let found = false;
    sections.forEach(section => {
      if (!found && section.offsetTop - offset <= scrollPos && (section.offsetTop + section.offsetHeight - offset) > scrollPos) {
        navLinks.forEach(link => {
          link.classList.remove('scrolled-active');
          if (link.getAttribute('href').replace('#','') === section.id) {
            link.classList.add('scrolled-active');
          }
        });
        found = true;
      }
    });
    if (!found) {
      navLinks.forEach(link => link.classList.remove('scrolled-active'));
    }
  }

  window.addEventListener('scroll', onScroll);

  // Also update on click for instant feedback
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('scrolled-active'));
      this.classList.add('scrolled-active');
    });
  });

  // Only enable arrow buttons on touch devices
  var arrows = document.querySelectorAll('#touch-arrows .arrow-btn');
  arrows.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (typeof window.move === 'function') window.move(btn.getAttribute('data-dir'));
    });
  });

  // Project slide-down logic
  var viewBtn = document.getElementById('view-project-btn');
  var details = document.getElementById('project-details');
  var expanded = false;
  if (viewBtn && details) {
    viewBtn.addEventListener('click', function(e) {
      e.preventDefault();
      expanded = !expanded;
      if (expanded) {
        details.style.display = 'block';
        details.style.maxHeight = details.scrollHeight + 'px';
        viewBtn.textContent = 'Hide Project';
        // Only scroll the project card, not the whole row or game
        var card = viewBtn.closest('.card');
        if (card) card.scrollIntoView({behavior:'smooth', block:'center'});
      } else {
        details.style.maxHeight = '0';
        setTimeout(function(){ details.style.display = 'none'; }, 500);
        viewBtn.textContent = 'View Project';
      }
    });
  }

  // Prevent project details from affecting the 2048 game card height
  var projectCol = viewBtn ? viewBtn.closest('.col-md-6') : null;
  if (projectCol) {
    projectCol.style.alignSelf = 'flex-start';
  }
  var gameCol = document.querySelector('#projects .row .col-md-6:nth-child(2)');
  if (gameCol) {
    gameCol.style.alignSelf = 'flex-start';
  }
});
