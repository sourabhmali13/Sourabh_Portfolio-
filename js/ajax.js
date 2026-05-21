$(document).ready(function () {

  // =============================================
  // 1. AJAX — LOAD PROJECTS FROM API
  // =============================================
  if ($('#ajax-projects').length) {
    $.ajax({
      url: 'https://jsonplaceholder.typicode.com/posts?_limit=3',
      method: 'GET',
      beforeSend: function () {
        $('#ajax-spinner').show();
      },
      success: function (data) {
        $('#ajax-spinner').hide();

        const techOptions = [
          ['Node.js', 'Express', 'MongoDB'],
          ['React', 'REST API', 'CSS3'],
          ['Python', 'Flask', 'SQLite']
        ];

        let html = '';
        data.forEach(function (post, i) {
          const tags = techOptions[i % techOptions.length];
          const tagsHtml = tags.map(t => `<span class="tech-tag">${t}</span>`).join('');
          html += `
            <div class="glass-panel project-card" data-aos="fade-up" data-category="web api">
              <div class="project-badge">API</div>
              <h3>${post.title.charAt(0).toUpperCase() + post.title.slice(1, 38)}...</h3>
              <p>${post.body.substring(0, 110)}...</p>
              <div class="tech-stack">${tagsHtml}</div>
              <div class="project-links">
                <a href="https://github.com/sourabhmali13" target="_blank" class="btn btn-outline">
                  <i class="fab fa-github"></i> GitHub
                </a>
                <a href="#" class="btn btn-primary">
                  <i class="fas fa-external-link-alt"></i> Live
                </a>
              </div>
            </div>
          `;
        });
        $('#ajax-projects').html(html);

        // Refresh AOS so newly injected cards animate in
        if (typeof AOS !== 'undefined') AOS.refresh();
      },
      error: function (err) {
        $('#ajax-spinner').hide();
        $('#ajax-projects').html(`
          <div class="ajax-error">
            <i class="fas fa-exclamation-triangle" style="font-size:2rem;color:#ef4444;margin-bottom:10px;"></i>
            <p>Failed to load dynamic projects. Please check your connection and try again.</p>
            <button class="btn btn-outline" id="retry-ajax" style="margin-top:15px;">
              <i class="fas fa-redo"></i> Retry
            </button>
          </div>
        `);
        $('#retry-ajax').on('click', function () {
          $('#ajax-projects').empty();
          $('#ajax-spinner').show();
          // Reload page to retry
          location.reload();
        });
        console.error('AJAX Error:', err);
      }
    });
  }

  // =============================================
  // 2. CONTACT FORM — REAL-TIME VALIDATION + SUBMIT
  // =============================================
  // Real-time field validation
  $('#contact-form input, #contact-form textarea').on('input blur', function () {
    const val  = $(this).val().trim();
    const type = $(this).attr('type');
    let   msg  = '';
    let   cls  = '';

    if ($(this).attr('required') && val === '') {
      cls = 'invalid'; msg = 'This field is required.';
    } else if (type === 'email') {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      cls = emailOk ? 'valid' : 'invalid';
      msg = emailOk ? '' : 'Please enter a valid email address.';
    } else if (val !== '') {
      cls = 'valid';
    } else {
      cls = '';
    }

    $(this).removeClass('valid invalid').addClass(cls);
    let $msg = $(this).siblings('.validation-msg');
    if ($msg.length === 0) {
      $msg = $('<span class="validation-msg"></span>').insertAfter(this);
    }
    $msg.attr('class', 'validation-msg ' + (cls === 'invalid' ? 'error' : 'success'))
        .text(msg);
  });

  // Character counter for textarea
  $('#contact-form textarea').on('input', function () {
    const len  = $(this).val().length;
    let $ctr   = $(this).siblings('.char-count');
    if ($ctr.length === 0) {
      $ctr = $('<span class="char-count"></span>').insertAfter(this);
    }
    $ctr.text(`${len} character${len !== 1 ? 's' : ''}`);
  });

  // Form submission
  $('#contact-form').on('submit', function (e) {
    e.preventDefault();

    // Validate all required fields before submit
    let isValid = true;
    $(this).find('input[required], textarea[required]').each(function () {
      if ($(this).val().trim() === '') {
        isValid = false;
        $(this).addClass('invalid').removeClass('valid');
      }
    });

    // Check email
    const $email = $(this).find('input[type="email"]');
    if ($email.length && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($email.val())) {
      isValid = false;
      $email.addClass('invalid');
    }

    if (!isValid) {
      if (typeof showToast === 'function') showToast('⚠️ Please fix the errors above.');
      return;
    }

    const form       = $(this);
    const submitBtn  = form.find('button[type="submit"]');
    const origText   = submitBtn.html();

    submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Sending...').prop('disabled', true);

    $.ajax({
      url:      form.attr('action'),
      method:   'POST',
      data:     form.serialize(),
      dataType: 'json',
      success: function () {
        if (typeof showToast === 'function') showToast('✅ Message sent successfully!');
        form[0].reset();
        form.find('.valid, .invalid').removeClass('valid invalid');
        form.find('.validation-msg, .char-count').remove();
        submitBtn.html(origText).prop('disabled', false);
      },
      error: function () {
        if (typeof showToast === 'function') showToast('❌ Oops! Could not send. Try emailing directly.');
        submitBtn.html(origText).prop('disabled', false);
      }
    });
  });

});
