(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Subscribe form
    const subscribeForm = document.getElementById('subscribeForm');
    const subscribeStatus = document.getElementById('subscribeStatus');
    if (subscribeForm) {
      subscribeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (subscribeStatus) subscribeStatus.textContent = 'Subscribing...';
        const data = Object.fromEntries(new FormData(subscribeForm).entries());
        try {
          const res = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (!res.ok) throw new Error('Request failed');
          if (subscribeStatus) subscribeStatus.textContent = 'Subscribed! Please check your inbox.';
          subscribeForm.reset();
        } catch (err) {
          if (subscribeStatus) subscribeStatus.textContent = 'Could not subscribe right now.';
        }
      });
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    const contactStatus = document.getElementById('contactStatus');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const showModal = (title, body) => {
      if (!modalOverlay) return;
      const t = document.getElementById('modalTitle');
      const b = document.getElementById('modalBody');
      if (t && title) t.textContent = title;
      if (b && body) b.textContent = body;
      modalOverlay.style.display = 'flex';
    };
    const hideModal = () => {
      if (modalOverlay) modalOverlay.style.display = 'none';
    };
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', hideModal);
      modalOverlay?.addEventListener('click', (e) => { if (e.target === modalOverlay) hideModal(); });
    }
    if (contactForm) {
      // Toggle subject/attachment visibility based on enquiry type
      const enquirySelect = document.getElementById('enquiryType');
      const attachmentField = document.getElementById('attachmentField');
      const serviceField = document.getElementById('serviceField');
      const budgetField = document.getElementById('budgetField');
      const timelineField = document.getElementById('timelineField');
      const detailsPanel = enquirySelect?.closest('.panel');
      const toggleFields = () => {
        const t = enquirySelect?.value || 'General';
        const isGeneral = t === 'General';
        const isBuild = t === 'Build';
        const isConsult = t === 'Consultation';

        // Show service for Build or Consultation
        if (serviceField) serviceField.style.display = (!isGeneral) ? 'block' : 'none';
        // Attachment only for Build
        if (attachmentField) {
          attachmentField.style.display = isBuild ? 'block' : 'none';
          if (!isBuild) {
            const input = attachmentField.querySelector('input[type="file"]');
            if (input) input.value = '';
          }
        }
        // Budget only for Build
        if (budgetField) {
          budgetField.style.display = isBuild ? 'block' : 'none';
          if (!isBuild) {
            const sel = budgetField.querySelector('select');
            if (sel) sel.selectedIndex = 0;
          }
        }
        // Timeline for Build and Consultation
        if (timelineField) timelineField.style.display = (!isGeneral) ? 'block' : 'none';

        // Ensure panel does not visually extend into next section by keeping consistent spacing
        if (detailsPanel) {
          detailsPanel.style.paddingBottom = '18px';
          detailsPanel.style.marginBottom = '0px';
        }
      };
      toggleFields();
      enquirySelect?.addEventListener('change', toggleFields);

      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (contactStatus) { contactStatus.style.display = 'block'; contactStatus.textContent = 'Sending...'; }
        const formData = new FormData(contactForm);
        try {
          const res = await fetch('/api/contact', { method: 'POST', body: formData });
          if (!res.ok) throw new Error('Request failed');
          if (contactStatus) contactStatus.textContent = '';
          showModal('Message sent', 'Thanks! We will be in touch shortly.');
          contactForm.reset();
          toggleFields();
        } catch (err) {
          if (contactStatus) { contactStatus.style.display = 'block'; contactStatus.textContent = 'Something went wrong. Please try again later.'; }
        }
      });
    }

    // Portfolio projects (supports optional data-limit attribute for homepage preview)
    const projectsEl = document.getElementById('projects');
    const projectsStatus = document.getElementById('projectsStatus');
    if (projectsEl) {
      fetch('/api/projects')
        .then((r) => r.json())
        .then((items) => {
          if (!items || items.length === 0) {
            if (projectsStatus) projectsStatus.textContent = 'No projects available yet.';
            return;
          }
          const normalized = (items || []);
          const limit = parseInt(projectsEl.getAttribute('data-limit') || `${normalized.length}`, 10);
          (normalized.slice(0, limit)).forEach((p) => {
            const card = document.createElement('a');
            card.className = 'card project';
            card.href = p.link || '#';
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            const preview = (() => { if (p?.imageURL) return p.imageURL; try { if (p && p.link) { const origin = new URL(p.link).origin; return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(origin)}&sz=256`; } } catch(e){} return ''; })();
            const hasImage = preview && String(preview).trim().length > 0;
            const isFavicon = hasImage && preview.includes('www.google.com/s2/favicons');
            card.innerHTML = `
              ${hasImage ? `<div class="thumb ${isFavicon ? 'icon' : ''}" style="background-image:url('${preview}')"></div>` : `<div class="thumb placeholder">🖼️</div>`}
              <div class="content">
                <h3>${p.title}</h3>
                <p class="clamp-2">${p.description || ''}</p>
              </div>
            `;
            projectsEl.appendChild(card);
          });
        })
        .catch(() => {
          if (projectsStatus) projectsStatus.textContent = 'Failed to load projects.';
        });
    }

    // Testimonials
    const testimonialsEl = document.getElementById('testimonials');
    const testimonialsStatus = document.getElementById('testimonialsStatus');
    if (testimonialsEl) {
      fetch('/api/testimonials')
        .then((r) => r.json())
        .then((items) => {
          if (!items || items.length === 0) {
            if (testimonialsStatus) testimonialsStatus.textContent = 'No testimonials yet.';
            return;
          }
          const limit = parseInt(testimonialsEl.getAttribute('data-limit') || `${items.length}`, 10);
          (items.slice(0, limit)).forEach((t) => {
            const card = document.createElement('div');
            card.className = 'card testimonial';
            const rating = Math.max(1, Math.min(5, t.rating || 5));
            card.innerHTML = `
              <div class="rating">${'★'.repeat(rating)}</div>
              <p class="feedback">${t.feedback}</p>
              <div class="client">— ${t.clientName}</div>
            `;
            testimonialsEl.appendChild(card);
          });
        })
        .catch(() => {
          if (testimonialsStatus) testimonialsStatus.textContent = 'Failed to load testimonials.';
        });
    }
  });
})();


