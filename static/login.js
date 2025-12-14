(function () {
      const tabs = document.querySelectorAll('.role-tabs .tab');
      const loginForm = document.getElementById('loginForm');
      const roleNote = document.getElementById('roleNote');
      const roleInput = document.getElementById('roleInput');

      function setRole(role, route) {
        tabs.forEach(btn => btn.setAttribute('aria-selected', String(btn.dataset.role === role)));
        roleNote.innerHTML = `You are signing in as <strong>${role[0].toUpperCase() + role.slice(1)}</strong>.`;
        loginForm.setAttribute('action', route);
        roleInput.value = role;
      }

      tabs.forEach(btn => {
        btn.addEventListener('click', () => setRole(btn.dataset.role, btn.dataset.route));
      });
    })();