// js/script.js - interactivity for Keep Clean
document.addEventListener('DOMContentLoaded', function () {
  // Theme switcher logic
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme) {
    document.body.setAttribute('data-theme', currentTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      let theme = 'light';
      if (document.body.getAttribute('data-theme') !== 'dark') {
        theme = 'dark';
      }
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  }

  // Nav toggle for small screens
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-list');
  if(navToggle){
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('show');
    });
  }

  // Event Delegation for service card buttons
  const servicesSection = document.getElementById('servicos');
  if (servicesSection) {
    servicesSection.addEventListener('click', (e) => {
      const button = e.target.closest('button.btn[data-service]');
      if (!button) return;

      const card = button.closest('.service-card');
      const cardTitle = card.querySelector('h3').textContent;
      const cardDescription = card.querySelector('.service-description').textContent;
      const serviceName = button.dataset.service;
      if (button.classList.contains('details')) {
        openServiceModal(cardTitle, cardDescription, serviceName);
      } else if (button.classList.contains('book')) {
        openServiceModal('Agendamento — ' + cardTitle, 'Deseja agendar este serviço? Clique no botão abaixo para ir ao formulário de contato com este serviço já selecionado.', serviceName);
      }
    });
  }

  // Video Modal Logic
  const playVideoBtn = document.getElementById('playVideoBtn');
  const videoModal = document.querySelector('.modal[data-modal-type="video"]'); // More specific selector
  const videoContainer = document.getElementById('videoContainer');
  const videoModalClose = videoModal ? videoModal.querySelector('.modal-close') : null;
  const videoUrl = 'https://www.youtube.com/embed/l_s1T8v51yE'; // Public car polishing video

  function openVideoModal() {
    videoContainer.innerHTML = `<iframe src="${videoUrl}?autoplay=1" title="Demonstração de Lavagem a Seco Automotiva" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    videoModal.setAttribute('aria-hidden', 'false');
  }

  function closeVideoModal() {
    videoModal.setAttribute('aria-hidden', 'true');
    videoContainer.innerHTML = ''; // Stop video by removing iframe
  }

  if (playVideoBtn) {
    playVideoBtn.addEventListener('click', openVideoModal);
  }
  if (videoModal) {
    videoModalClose.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', (e) => { if (e.target === videoModal) closeVideoModal(); });
  }


  // Form validation + fake submit (keeps data local)
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if(!form.checkValidity()){
      feedback.style.color = 'crimson';
      feedback.textContent = 'Por favor, preencha corretamente os campos obrigatórios.';
      return;
    }
    // gather data
    const data = {
      nome: form.nome.value.trim(),
      telefone: form.telefone.value.trim(),
      email: form.email.value.trim(),
      servico: form.servico.value,
      mensagem: form.mensagem.value.trim()
    };
    // simulate successful submission (could be replaced with fetch to backend)
    feedback.style.color = 'green';
    feedback.textContent = 'Pedido enviado com sucesso! Em breve entraremos em contato pelo telefone ou email informados.';
    form.reset();
    // set service back to default after a tiny delay
    setTimeout(()=>{ document.getElementById('servico').value = ''; }, 300);
    console.log('Orçamento enviado (simulado):', data);
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
    });
  });
  
  // Service Modal event listeners
  const modal = document.querySelector('.modal[data-modal-type="service"]'); // More specific selector
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = modal ? modal.querySelector('.modal-close') : null;
  const modalBookBtn = modal ? modal.querySelector('.modal-book') : null;

  function openServiceModal(title, text, serviceName){
    modalTitle.textContent = title;
    modalBody.textContent = text || 'Descrição detalhada disponível. Entre em contato para maiores informações e orçamento.';
    modal.setAttribute('aria-hidden','false');
    modalBookBtn.dataset.service = serviceName;
  }
  function closeServiceModal(){
    modal.setAttribute('aria-hidden','true');
  }

  if (modal) {
    modalClose.addEventListener('click', closeServiceModal);
    modal.addEventListener('click', (e) => { if(e.target === modal) closeServiceModal(); });
    modalBookBtn.addEventListener('click', (e) => {
      const service = e.currentTarget.dataset.service;
      document.querySelector('#servico').value = service;
      closeServiceModal();
      document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
    });
  }

});
