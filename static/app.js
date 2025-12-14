
// ================= Login Modal Functions =================
let selectedUserType = '';

function openLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    // Reset to step 1
    showLoginStep1();
  }
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    // Reset form
    const form = document.getElementById('loginCredentialsForm');
    if (form) form.reset();
    selectedUserType = '';
  }
}

function showLoginStep1() {
  const step1 = document.getElementById('loginStep1');
  const step2 = document.getElementById('loginStep2');
  if (step1 && step2) {
    step1.style.display = 'block';
    step2.style.display = 'none';
  }
}

function showLoginStep2() {
  const step1 = document.getElementById('loginStep1');
  const step2 = document.getElementById('loginStep2');
  if (step1 && step2) {
    step1.style.display = 'none';
    step2.style.display = 'block';
  }
}

function selectUserType(userType) {
  selectedUserType = userType;
  
  // Update the login form header and description based on user type
  const icon = document.getElementById('loginTypeIcon');
  const title = document.getElementById('loginTypeTitle');
  const description = document.getElementById('loginDescription');
  
  const userTypeConfig = {
    admin: {
      icon: 'fas fa-user-shield',
      title: 'Administrator Login',
      description: 'Enter your administrator credentials to access the admin portal:'
    },
    doctor: {
      icon: 'fas fa-user-md',
      title: 'Doctor Login',
      description: 'Enter your doctor credentials to access the medical portal:'
    },
    patient: {
      icon: 'fas fa-user-heart',
      title: 'Patient Login',
      description: 'Enter your patient credentials to access your health portal:'
    }
  };
  
  if (icon && title && description && userTypeConfig[userType]) {
    icon.className = userTypeConfig[userType].icon;
    title.textContent = userTypeConfig[userType].title;
    description.textContent = userTypeConfig[userType].description;
  }
  
  showLoginStep2();
}

function goBackToStep1() {
  showLoginStep1();
  selectedUserType = '';
}

function loginAs(userType) {
  // Show loading state
  const submitBtn = document.getElementById('loginSubmitBtn');
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    submitBtn.disabled = true;
  }
  
  // Simulate authentication process
  setTimeout(() => {
    let redirectUrl;
    switch(userType) {
      case 'admin':
        redirectUrl = 'admin-dashboard.html';
        break;
      case 'doctor':
        redirectUrl = 'doctor-dashboard.html';
        break;
      case 'patient':
        redirectUrl = 'patient.html';
        break;
      default:
        redirectUrl = 'index.html';
    }
    
    // Store user type in session storage
    sessionStorage.setItem('userType', userType);
    sessionStorage.setItem('isAuthenticated', 'true');
    
    // Redirect to appropriate portal
    window.location.href = redirectUrl;
  }, 1500);
}

// No-op placeholders; implement your own handlers if needed
function showForgotPassword() {}
function showCreateAccount() {} 

// ================= Health Buddy interactions =================
// Health Buddy interactions
const $ = (q, s=document) => s.querySelector(q);
const $$ = (q, s=document) => Array.from(s.querySelectorAll(q));

// Mobile menu
const nav = $('.nav');
const toggle = $('.mobile-toggle');
if (toggle){ toggle.addEventListener('click', ()=> nav.classList.toggle('open')); }

// Scroll reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); }
  });
}, {threshold:.15});
$$('.reveal').forEach(el=> io.observe(el));

// Login modal event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Ensure body overflow is reset on page load
  document.body.style.overflow = 'auto';
  
  // Add click event to login button: navigate to login page
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      // In case it's a <button> on some pages, prevent modal and redirect
      // If it's an <a>, let the href work; otherwise do a programmatic redirect
      const isAnchor = loginBtn.tagName.toLowerCase() === 'a';
      if (!isAnchor) {
        e.preventDefault();
        window.location.href = '/login/';
      }
    });
  }
  
  // Remove demo login handler; implement your own auth submission logic
  
  // Close modal on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeLoginModal();
    }
  });
});

// Contact form: no demo handler; submit behavior to be implemented by you

// Admin account creation: demo handler removed; implement your own

// Search in dashboard table
const search = $('#reportSearch');
if (search){
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    $$('#reportTable tbody tr').forEach(tr => tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none');
  });
}

// Enhanced status management
const statusBadge = $('#statusBadge');
if (statusBadge){
  const states = [
    {text: 'Good', color: '#2ec4b6', bg: '#e8f5f3'},
    {text: 'Stable', color: '#ffd166', bg: '#fef9e6'},
    {text: 'Monitoring', color: '#f4a261', bg: '#fef2e6'},
    {text: 'Critical', color: '#e63946', bg: '#fdeaea'}
  ];
  let i = 0;
  
  // Update status every 5 seconds for demo
  setInterval(()=>{
    i = (i+1) % states.length;
    statusBadge.textContent = states[i].text;
    statusBadge.style.background = states[i].bg;
    statusBadge.style.color = states[i].color;
    statusBadge.style.border = `2px solid ${states[i].color}`;
  }, 5000);
}

// Copy share link functionality (supports #copyBtn or #copyLink)
(function(){
  const shareInput = $('#shareLink');
  const copyBtn = $('#copyBtn') || $('#copyLink');
  const toast = $('#copyToast');

  // If present on page: do not auto-fill; stays empty until generated

  function showToast() {
    if (!toast) return;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 1600);
  }

  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly','');
    ta.style.position = 'absolute'; ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } finally { document.body.removeChild(ta); }
    return Promise.resolve();
  }

  if (copyBtn && shareInput) {
    copyBtn.addEventListener('click', () => {
      copyText(shareInput.value).then(() => {
        // Prefer toast if available; otherwise update button text briefly
        if (toast) {
          showToast();
        } else {
          const original = copyBtn.textContent;
          copyBtn.textContent = '✅ Copied!';
          copyBtn.style.background = '#2ec4b6';
          setTimeout(() => {
            copyBtn.textContent = original || 'Copy Link';
            copyBtn.style.background = '';
          }, 1600);
        }
      }).catch(() => {
        // If copy fails, select text so user can Ctrl+C
        shareInput.focus(); shareInput.select();
      });
    });
  }
})();

// File upload simulation
const fileInput = $('#reportFile');
if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadStatus = $('#uploadStatus');
      if (uploadStatus) {
        uploadStatus.innerHTML = `<div style="color:#2ec4b6;font-weight:bold;">📄 ${file.name} selected (${(file.size/1024/1024).toFixed(2)} MB)</div>`;
      }
    }
  });
}


// SIMPLE UPLOAD JS
(function () {
  const form = document.querySelector('#uploadForm');
  const statusBox = document.querySelector('#uploadStatus');

  function getCookie(name) {
    const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? decodeURIComponent(m[2]) : null;
  }

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const fd = new FormData(form);
    const csrf = getCookie('csrftoken');

    statusBox.innerHTML = `<div style="color:#ffd166;font-weight:bold;">Uploading...</div>`;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: fd,
        credentials: 'same-origin',
        headers: { 'X-CSRFToken': csrf }
      });

      const data = await res.json();       // your view returns JSON
      console.log(data);

      if (data.ok) {
        statusBox.innerHTML = `
          <div style="color:#2ec4b6;font-weight:bold;padding:1rem;background:#e8f5f3;border-radius:8px;">
            Report saved!<br>
            File: <a href="${data.file_url}" target="_blank">${data.file_name}</a>
          </div>
        `;
        form.reset();
      } else {
        statusBox.innerHTML = `<div style="color:#e63946;">${data.error}</div>`;
      }

    } catch (err) {
      statusBox.innerHTML = `<div style="color:#e63946;">Error: ${err.message}</div>`;
      console.error(err);
    }
  });
})();




// Patient status update form
const statusForm = document.getElementById('statusUpdateForm');

if (statusForm) {
  statusForm.addEventListener('submit', () => {
    const statusResponse = document.getElementById('statusResponse');

    if (statusResponse) {
      statusResponse.innerHTML =
        '<div style="color:#ffd166;font-weight:bold;">⏳ Updating status...</div>';
    }
  });
}



// AI Summary generation
const generateSummaryBtn = $('#generateSummary');
if (generateSummaryBtn) {
  generateSummaryBtn.addEventListener('click', () => {
    const summaryDiv = $('#aiSummary');
    if (summaryDiv) {
      summaryDiv.innerHTML = '<div style="color:#ffd166;font-weight:bold;">🤖 Generating AI summary...</div>';
      
      setTimeout(() => {
        summaryDiv.innerHTML = `<div style="background:#f8f9fa;padding:1.5rem;border-radius:10px;border-left:4px solid #2ec4b6;">
          <h4 style="color:#2c3e50;margin:0 0 1rem 0;">🤖 AI Summary</h4>
          <p style="margin:0 0 1rem 0;color:#5a6c7d;line-height:1.6;">
            <strong>Overall Health:</strong> Your recent blood work shows normal values for most parameters. 
            Cholesterol levels are slightly elevated but within acceptable range.
          </p>
          <p style="margin:0 0 1rem 0;color:#5a6c7d;line-height:1.6;">
            <strong>Recommendations:</strong> Continue current medications, maintain a balanced diet, 
            and schedule a follow-up in 3 months.
          </p>
          <p style="margin:0;color:#5a6c7d;line-height:1.6;">
            <strong>Key Values:</strong> Blood pressure: 125/80, Heart rate: 72 bpm, Blood sugar: 95 mg/dL
          </p>
        </div>`;
      }, 2000);
    }
  });
}

// Diet suggestions
const getDietBtn = $('#getDietSuggestions');
if (getDietBtn) {
  getDietBtn.addEventListener('click', () => {
    const dietDiv = $('#dietSuggestions');
    if (dietDiv) {
      dietDiv.innerHTML = '<div style="color:#ffd166;font-weight:bold;">🥗 Generating personalized diet plan...</div>';
      
      setTimeout(() => {
        dietDiv.innerHTML = `<div style="background:#f8f9fa;padding:1.5rem;border-radius:10px;border-left:4px solid #f4a261;">
          <h4 style="color:#2c3e50;margin:0 0 1rem 0;">🥗 Personalized Diet Suggestions</h4>
          <div style="margin-bottom:1rem;">
            <strong style="color:#2c3e50;">Breakfast:</strong>
            <ul style="color:#5a6c7d;margin:0.5rem 0;">
              <li>Oatmeal with fresh berries and almonds</li>
              <li>Green tea or herbal tea</li>
            </ul>
          </div>
          <div style="margin-bottom:1rem;">
            <strong style="color:#2c3e50;">Lunch:</strong>
            <ul style="color:#5a6c7d;margin:0.5rem 0;">
              <li>Grilled chicken salad with olive oil dressing</li>
              <li>Quinoa or brown rice (small portion)</li>
            </ul>
          </div>
          <div style="margin-bottom:1rem;">
            <strong style="color:#2c3e50;">Dinner:</strong>
            <ul style="color:#5a6c7d;margin:0.5rem 0;">
              <li>Baked salmon with steamed vegetables</li>
              <li>Sweet potato (moderate portion)</li>
            </ul>
          </div>
          <p style="margin:0;color:#5a6c7d;font-size:0.9rem;font-style:italic;">
            💡 Based on your health profile: Heart-healthy, low sodium, moderate carbs
          </p>
        </div>`;
      }, 1500);
    }
  });
}

// Smooth animations on load (safe, self-contained)
document.addEventListener('DOMContentLoaded', () => {
  // Create particle background/init animations only if defined elsewhere
  if (typeof createParticles === 'function') createParticles();
  if (typeof initScrollAnimations === 'function') initScrollAnimations();

  // Fade in animation for cards
  $$('.card, .feature-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 120);
  });

  // Hover effects for key buttons
  $$('.cta-btn, .pill, .btn-submit').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px) scale(1.02)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Ripple click effect on buttons
  $$('button, .btn, .cta-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const d = Math.max(this.clientWidth, this.clientHeight);
      ripple.style.width = ripple.style.height = d + 'px';
      ripple.style.left = e.clientX - rect.left - d / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - d / 2 + 'px';
      ripple.className = 'ripple';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Scroll-into-view animation for elements with .scroll-animate
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const children = entry.target.querySelectorAll('.scroll-animate');
        children.forEach((child, index) => {
          setTimeout(() => child.classList.add('in-view'), index * 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  $$('.scroll-animate').forEach(el => observer.observe(el));
});

// Add typewriter effect restart on scroll
function restartTypewriter() {
  const typewriterElements = $$('.typewriter');
  typewriterElements.forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight; // Trigger reflow
    el.style.animation = 'typing 3s steps(40, end), blink-caret 0.75s step-end infinite';
  });
}

// Enhanced intersection observer for special effects
const specialEffectsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      
      // Trigger typewriter effect
      if (target.classList.contains('typewriter')) {
        restartTypewriter();
      }
      
      // Add wiggle effect to specific elements
      if (target.classList.contains('wiggle')) {
        target.style.animation = 'wiggle 0.5s ease-in-out';
      }
}
  });
}, { threshold: 0.5 });

// Observe elements for special effects
document.addEventListener('DOMContentLoaded', () => {
  $$('.typewriter, .wiggle').forEach(el => {
    specialEffectsObserver.observe(el);
  });
});

// Animate counter numbers
function animateCounter(element) {
  const text = element.textContent.trim();

  // Skip ratios like 24/7
  if (text.includes('/')) return;

  const match = text.match(/^([\d,.]+)(.*)$/);
  if (!match) return;

  const number = parseFloat(match[1].replace(',', ''));
  const suffix = match[2] || '';

  if (isNaN(number)) return;

  let current = 0;
  const step = number / 50;

  const timer = setInterval(() => {
    current += step;
    if (current >= number) {
      current = number;
      clearInterval(timer);
    }
    element.textContent = current.toFixed(1).replace(/\.0$/, '') + suffix;
  }, 50);
}


// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    pointer-events: none;
    transform: scale(0);
    animation: rippleAnimation 0.6s ease-out;
  }
  
  @keyframes rippleAnimation {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
  
  button, .btn, .cta-btn {
    position: relative;
    overflow: hidden;
  }
`;
document.head.appendChild(style);


// ========= Admin: role-based UI toggles only =========
document.addEventListener('DOMContentLoaded', () => {
  // Create form (show/hide doctor vs patient fields)
  const roleSel = document.getElementById('role');
  const doctorBox = document.getElementById('doctorSchema');
  const patientBox = document.getElementById('patientSchema');
  const toggleSchemas = () => {
    const val = roleSel ? roleSel.value : '';
    if (doctorBox) doctorBox.hidden = val !== 'doctor';
    if (patientBox) patientBox.hidden = val !== 'patient';
  };
  if (roleSel) {
    roleSel.addEventListener('change', toggleSchemas);
    toggleSchemas();
  }

  // Edit form (show/hide edit field groups)
  const editRoleSel = document.getElementById('editRoleSelect');
  const editDoctorFields = document.getElementById('editDoctorFields');
  const editPatientFields = document.getElementById('editPatientFields');
  const toggleEditSections = () => {
    const val = editRoleSel ? editRoleSel.value : '';
    if (editDoctorFields) editDoctorFields.hidden = val !== 'doctor';
    if (editPatientFields) editPatientFields.hidden = val !== 'patient';
  };
  if (editRoleSel) {
    editRoleSel.addEventListener('change', toggleEditSections);
    toggleEditSections();
  }
});

// ========= Client-side validation (email, 10-digit phone, numbers) =========
document.addEventListener('DOMContentLoaded', () => {
  const getDigits = (s) => (s || '').replace(/\D/g, '');
  const isTenDigitPhone = (s) => getDigits(s).length === 10;
  const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || '').trim());
  const isNonNegativeNumber = (v) => v !== '' && !isNaN(v) && Number(v) >= 0;

  // Helper: render error list into a container
  const renderErrors = (container, errors) => {
    if (!container) return;
    if (!errors.length) { container.innerHTML = ''; return; }
    container.innerHTML = `<div style="color:#f43f5e;font-weight:700;padding:1rem;background:#2a0f14;border-radius:10px;border-left:4px solid #f43f5e;line-height:1.5;">`+
      `❌ Please fix the following:<br>• ${errors.map(e=>String(e)).join('<br>• ')}`+
      `</div>`;
  };

  // Doctor Create validation
  const doctorForm = document.getElementById('doctorCreateForm');
  if (doctorForm) {
    const resp = document.getElementById('doctorCreateResponse');
    doctorForm.addEventListener('submit', (e) => {
      const fd = new FormData(doctorForm);
      const errors = [];
      const name = (fd.get('name') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const phone = (fd.get('phone') || '').toString().trim();
      const doctorId = (fd.get('doctorId') || '').toString().trim();
      const dept = (fd.get('department') || '').toString().trim();
      const specialist = (fd.get('specialist') || '').toString().trim();
      const license = (fd.get('license') || '').toString().trim();
      const experience = (fd.get('experience') || '').toString().trim();

      if (!doctorId) errors.push('Doctor ID is required');
      if (!name) errors.push('Name is required');
      if (!email) errors.push('Email is required');
      if (email && !isValidEmail(email)) errors.push('Enter a valid email');
      if (phone && !isTenDigitPhone(phone)) errors.push('Phone must be exactly 10 digits');
      if (!dept) errors.push('Department is required');
      if (!specialist) errors.push('Specialist is required');
      if (experience && !isNonNegativeNumber(experience)) errors.push('Experience must be a non-negative number');
      if (license && license.length < 4) {
        // very light sanity check; adjust as needed
        errors.push('License number looks too short');
      }

      if (errors.length) {
        e.preventDefault();
        renderErrors(resp, errors);
        return;
      }

      // Valid: do not show success here; allow user to handle save.
      // Prevent default and call user hook if provided; otherwise allow default submit
      if (typeof window.onDoctorCreateValid === 'function') {
        e.preventDefault();
        window.onDoctorCreateValid(fd);
      } else {
        // if no action attribute, prevent navigation by default
        if (!(doctorForm.getAttribute('action'))) {
          e.preventDefault();
          console.log('Doctor form valid. Implement save logic in onDoctorCreateValid(fd).');
        }
      }
    });
  }

  // Patient Create validation
  const patientForm = document.getElementById('patientCreateForm');
  if (patientForm) {
    const resp = document.getElementById('patientCreateResponse');
    patientForm.addEventListener('submit', (e) => {
      const fd = new FormData(patientForm);
      const errors = [];
      const name = (fd.get('name') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const phone = (fd.get('phone') || '').toString().trim();
      const patientId = (fd.get('patientId') || '').toString().trim();
      const age = (fd.get('age') || '').toString().trim();
      const address = (fd.get('address') || '').toString().trim();
      const disease = (fd.get('disease') || '').toString().trim();
      const doctor = (fd.get('doctor') || '').toString().trim();
      const gender = (fd.get('gender') || '').toString().trim();
      const bloodGroup = (fd.get('bloodGroup') || '').toString().trim();

      if (!name) errors.push('Name is required');
      if (!email) errors.push('Email is required');
      if (email && !isValidEmail(email)) errors.push('Enter a valid email');
      if (phone && !isTenDigitPhone(phone)) errors.push('Phone must be exactly 10 digits');
      if (!patientId) errors.push('Patient ID is required');
      if (!age) errors.push('Age is required');
      if (age && !isNonNegativeNumber(age)) errors.push('Enter a valid non-negative age');
      if (!address) errors.push('Address is required');
      if (!disease) errors.push('Disease Name is required');
      if (!doctor) errors.push('Doctor is required');
      // Optional: if gender/bloodGroup provided, just ensure non-empty string (already)

      if (errors.length) {
        e.preventDefault();
        renderErrors(resp, errors);
        return;
      }

      if (typeof window.onPatientCreateValid === 'function') {
        e.preventDefault();
        window.onPatientCreateValid(fd);
      } else {
        if (!(patientForm.getAttribute('action'))) {
          e.preventDefault();
          console.log('Patient form valid. Implement save logic in onPatientCreateValid(fd).');
        }
      }
    });
  }

  // Edit form minimal validation
  const editForm = document.getElementById('editAccountForm');
  if (editForm) {
    const resp = document.getElementById('editResponse');
    editForm.addEventListener('submit', (e) => {
      const fd = new FormData(editForm);
      const errors = [];
      const editEmail = (fd.get('editEmail') || '').toString().trim();
      const editRole = (fd.get('editRole') || '').toString().trim().toLowerCase();
      const editDoctorPhone = (fd.get('editDoctorPhone') || '').toString().trim();
      const editPatientPhone = (fd.get('editPatientPhone') || '').toString().trim();
      const editAge = (fd.get('editAge') || '').toString().trim();
      const editExperience = (fd.get('editDoctorExperience') || '').toString().trim();

      if (!editEmail) errors.push('Lookup Email is required');
      if (editEmail && !isValidEmail(editEmail)) errors.push('Enter a valid lookup email');
      if (editDoctorPhone && !isTenDigitPhone(editDoctorPhone)) errors.push('Doctor phone must be exactly 10 digits');
      if (editPatientPhone && !isTenDigitPhone(editPatientPhone)) errors.push('Patient phone must be exactly 10 digits');
      if (editAge && !isNonNegativeNumber(editAge)) errors.push('Edit Age must be a non-negative number');
      if (editExperience && !isNonNegativeNumber(editExperience)) errors.push('Experience must be a non-negative number');

      if (errors.length) {
        e.preventDefault();
        renderErrors(resp, errors);
        return;
      }

      if (typeof window.onAccountEditValid === 'function') {
        e.preventDefault();
        window.onAccountEditValid(fd);
      } else {
        if (!(editForm.getAttribute('action'))) {
          e.preventDefault();
          console.log('Edit form valid. Implement save logic in onAccountEditValid(fd).');
        }
      }
    });
  }
});
