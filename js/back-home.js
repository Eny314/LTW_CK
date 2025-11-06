// Inject a floating "Quay lại trang chủ" bar on all pages except index.html
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const path = window.location.pathname || '';
    const isIndex = /(^|\/)index\.html?$/.test(path);
    if (isIndex) return;

  const bar = document.createElement('a');
  bar.href = 'index.html';
  bar.className = 'back-home-bar d-flex align-items-center justify-content-center';
  bar.setAttribute('aria-label', 'Quay lại trang chủ');
  bar.setAttribute('title', 'Quay lại trang chủ');

    // Style: floating pill under the navbar
    Object.assign(bar.style, {
      position: 'fixed',
      top: '90px', // appear just under the fixed navbar
      left: '16px',
      zIndex: '1051',
      background: '#ffffff',
      color: '#0d6efd',
      border: '1px solid rgba(0,0,0,0.1)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '18px'
    });

    bar.innerHTML = '<i class="bi bi-arrow-left"></i>';

    // Prevent overlap on very small screens: move lower
    function adjustForViewport(){
      bar.style.top = window.innerWidth < 576 ? '110px' : '90px';
    }
    adjustForViewport();
    window.addEventListener('resize', adjustForViewport);

    document.body.appendChild(bar);
  });
})();
