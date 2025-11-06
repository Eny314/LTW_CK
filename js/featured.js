// Featured products on shop-detail: reuse homepage dataset (productData), support search filtering inline
(function(){
  function normalizeText(s){
    try { return (s || '').toString().normalize('NFD').replace(/[\u0300-\u036F]/g, '').toLowerCase(); } catch(_) { return (s || '').toString().toLowerCase(); }
  }

  function buildData() {
    // Load from window.productData or localStorage
    let data = (typeof window.productData !== 'undefined' && window.productData) ? window.productData : {};
    if (Object.keys(data).length === 0) {
      try {
        const cached = localStorage.getItem('productData');
        if (cached) data = JSON.parse(cached);
      } catch (_) {}
    }
    const list = Object.keys(data).map(name => {
      const info = data[name] || {};
      const priceText = info.price || '';
      // Use rawPrice if available, otherwise parse from price text
      const price = info.rawPrice || parseInt(String(priceText).replace(/[^\d]/g, '')) || 0;
      const imgPath = info.img || '';
      const imgFile = imgPath.split('/').pop();
      return { name, price, priceText, imgPath, imgFile };
    });
    return list;
  }

  function formatPriceVND(amount) {
    return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(amount).replace('\u00A0', ' ');
  }

  function findFeaturedSection(){
    const containers = Array.from(document.querySelectorAll('.col-lg-12'));
    return containers.find(c => c.querySelector('h4') && c.querySelector('h4').textContent.trim().toLowerCase().includes('featured products'));
  }

  function clearSection(section){
    const header = section.querySelector('h4');
    let node = header ? header.nextElementSibling : null;
    while (node) { const next = node.nextElementSibling; node.remove(); node = next; }
  }

  function renderList(section, items){
    clearSection(section);
    // Show first 4 items only
    const displayItems = items.slice(0, 4);
    displayItems.forEach(p => {
      const row = document.createElement('div');
      row.className = 'd-flex align-items-center justify-content-start mb-3';

      const thumb = document.createElement('div');
      thumb.className = 'rounded me-4';
      thumb.style.width = '100px';
      thumb.style.height = '100px';

      const link = document.createElement('a');
      link.href = `shop-detail.html?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.imgFile)}`;
      const img = document.createElement('img');
      img.src = p.imgPath.includes('Models/assets/img') ? p.imgPath : `../Models/${p.imgPath}`;
      img.alt = p.name;
      img.className = 'img-fluid rounded';
      link.appendChild(img);
      thumb.appendChild(link);

      const info = document.createElement('div');
      const title = document.createElement('h6');
      title.className = 'mb-2';
      title.textContent = p.name;

      const priceWrap = document.createElement('div');
      priceWrap.className = 'd-flex mb-2';
      const priceEl = document.createElement('h5');
      priceEl.className = 'fw-bold me-2';
      priceEl.textContent = p.price ? formatPriceVND(p.price) : (p.priceText || '');
      priceWrap.appendChild(priceEl);

      info.appendChild(title);
      info.appendChild(priceWrap);

      row.appendChild(thumb);
      row.appendChild(info);

      section.appendChild(row);
    });

    // Add "Xem thêm" button at the end if there are more products
    if (items.length > 4) {
      const btnWrap = document.createElement('div');
      btnWrap.className = 'd-flex justify-content-center my-4';
      const btn = document.createElement('a');
      btn.href = 'index.html';
      btn.className = 'btn border border-secondary px-4 py-3 rounded-pill text-primary w-100';
      btn.textContent = 'Xem thêm';
      btnWrap.appendChild(btn);
      section.appendChild(btnWrap);
    }
  }

  function filterItems(allItems, term){
    if (!term) return allItems;
    const t = normalizeText(term);
    return allItems.filter(p => normalizeText(p.name).includes(t));
  }

  // Expose a hook so search.js (or others) can trigger rendering on shop-detail without redirect
  window.renderFeaturedSearchResults = function(term){
    const section = findFeaturedSection();
    if (!section) return;
    const all = buildData();
    const list = filterItems(all, term);
    renderList(section, list);
  };

  document.addEventListener('DOMContentLoaded', function(){
    const section = findFeaturedSection();
    if (!section) return;

    // Initial render: use ?q= if present, else full list
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q') || '';
    window.renderFeaturedSearchResults(q);

    // Bind inline filtering on the sidebar search input (if present)
    const sidebarInput = section.closest('.fruite')?.querySelector('input[type="search"]') || document.querySelector('.fruite input[type="search"]');
    if (sidebarInput) {
      sidebarInput.addEventListener('input', function(){
        window.renderFeaturedSearchResults(sidebarInput.value);
      });
      sidebarInput.addEventListener('keypress', function(e){
        if (e.key === 'Enter') { e.preventDefault(); window.renderFeaturedSearchResults(sidebarInput.value); }
      });
    }
  });
})();
