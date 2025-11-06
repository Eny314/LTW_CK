// Helper: collect product cards on the current page
function collectProducts() {
    const cards = Array.from(document.querySelectorAll('.fruite-item'));
    return cards.map(card => {
        const nameEl = card.querySelector('h4');
        const addBtn = card.querySelector('.add-to-cart');
        const imgEl = card.querySelector('img');
        const linkEl = card.querySelector('.fruite-img a') || card.querySelector('a');
        const priceTextEl = card.querySelector('.text-dark');
        const name = (nameEl ? nameEl.textContent : (addBtn ? addBtn.getAttribute('data-name') : '') || '').trim();
        const priceText = priceTextEl ? priceTextEl.textContent.trim() : '';
        const priceNum = parseInt((priceText || '').replace(/[^\d]/g, '')) || 0;
        const imgSrc = imgEl ? imgEl.getAttribute('src') || '' : '';
        const imgFile = imgSrc.split('/').pop();
        const tabPane = card.closest('.tab-pane');
        // Prefer existing link if present
        let href = linkEl && linkEl.getAttribute('href');
        if (!href || href === '#') {
            // Build a detail link using query params; product-detail.js will resolve img path
            const params = new URLSearchParams();
            if (name) params.set('name', name);
            if (priceNum) params.set('price', String(priceNum));
            if (imgFile) params.set('img', imgFile);
            href = `shop-detail.html?${params.toString()}`;
        }
        return { el: card, name, priceText, priceNum, imgSrc, imgFile, href, tabId: tabPane ? tabPane.id : null };
    });
}

// Helper: render results into the modal dropdown list
function renderSearchResults(matches) {
    const resultsEl = document.getElementById('search-results');
    if (!resultsEl) return;
    if (!matches || matches.length === 0) {
        resultsEl.style.display = 'none';
        resultsEl.innerHTML = '';
        return;
    }
    const top = matches.slice(0, 8);
    resultsEl.innerHTML = top.map(m => `
        <a href="${m.href}" class="d-flex align-items-center text-decoration-none text-dark py-2 px-2 rounded-2 hover-bg">
            <img src="${m.imgSrc}" alt="${m.name}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;margin-right:10px;">
            <div>
                <div style="font-weight:600;">${m.name}</div>
                <div style="font-size:12px;color:#6c757d;">${m.priceText || ''}</div>
            </div>
        </a>
    `).join('');
    resultsEl.style.display = 'block';
}

// Generalized product search function. Accepts an input element and a submit flag.
function searchProductsFromInput(inputEl, submit = false) {
    if (!inputEl) return;
    const raw = (inputEl.value || '');
    const searchTerm = raw.toLowerCase();

    // normalize to remove diacritics so searches like 'ca chua' match 'Cà chua'
        function normalizeText(s){
            try {
                return s.normalize('NFD').replace(/[\u0300-\u036F]/g, '');
        } catch (e) {
            return s;
        }
    }

    // Collect product cards
    const productObjs = collectProducts();
    const products = productObjs.map(p => p.el);
    let matched = 0;

    // Visible diagnostic log so user can see search was triggered
    console.log('searchProductsFromInput called:', {value: raw, searchTerm, products: products.length});

    const termNorm = normalizeText(searchTerm);
    const firstVisibleCandidates = [];

    const matches = [];
    products.forEach((product, idx) => {
        const p = productObjs[idx];
        const nameEl = product.querySelector('h4');
        const productName = nameEl ? (nameEl.textContent || '').toLowerCase() : (p.name || '').toLowerCase();
        const priceEl = product.querySelector('.text-dark');
        const productPrice = priceEl ? (priceEl.textContent || '').toLowerCase() : (p.priceText || '').toLowerCase();
        const imgEl = product.querySelector('img');
        const imgAlt = imgEl ? (imgEl.alt || '') : '';

        const productNameNorm = normalizeText((productName + ' ' + imgAlt).trim());
        const productPriceNorm = normalizeText(productPrice);

        const visible = (!searchTerm || productNameNorm.includes(termNorm) || productPriceNorm.includes(termNorm));
        // show/hide the product card itself
        product.style.display = visible ? '' : 'none';

        // also hide the column wrapper (so the grid collapses). Look for nearest ancestor with a "col-" class
        const colParent = product.closest('[class*="col-"]');
        if (colParent) colParent.style.display = visible ? '' : 'none';

        if (visible) {
            matched += 1;
            firstVisibleCandidates.push(product);
            matches.push(p);
        }
    });
    // log summary so user can see behavior in console
    console.log('search run:', {term: searchTerm, termNorm: termNorm, total: products.length, matched});

    // show a friendly no-results message when nothing matched
    // prefer to insert inside the .fruite container if present
    const fruiteSection = document.querySelector('.fruite') || document.body;
    let noResultsEl = document.getElementById('search-no-results');
    if (matched === 0) {
        if (!noResultsEl) {
            noResultsEl = document.createElement('div');
            noResultsEl.id = 'search-no-results';
            noResultsEl.className = 'alert alert-warning text-center';
            noResultsEl.style.marginTop = '1rem';
            noResultsEl.textContent = 'Không tìm thấy sản phẩm phù hợp.';
            // try to place it after the product row if present
            const targetRow = fruiteSection.querySelector('.row');
            if (targetRow && targetRow.parentElement) targetRow.parentElement.insertBefore(noResultsEl, targetRow.nextSibling);
            else fruiteSection.appendChild(noResultsEl);
        }
    } else {
        if (noResultsEl && noResultsEl.parentElement) noResultsEl.parentElement.removeChild(noResultsEl);

        // auto-activate the tab containing the first match, then scroll and highlight
        const first = firstVisibleCandidates[0];
        if (first) {
            const pane = first.closest('.tab-pane');
            if (pane && !pane.classList.contains('show')) {
                const sel = `[data-bs-target="#${pane.id}"], a[href="#${pane.id}"], button[data-bs-target="#${pane.id}"]`;
                const trigger = document.querySelector(sel);
                if (trigger) trigger.click();
            }
            setTimeout(() => {
                try { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_) {}
                const oldOutline = first.style.outline;
                const oldShadow = first.style.boxShadow;
                first.style.outline = '3px solid #ffc107';
                first.style.boxShadow = '0 0 0 4px rgba(255,193,7,0.35)';
                setTimeout(() => { first.style.outline = oldOutline; first.style.boxShadow = oldShadow; }, 1500);
            }, 250);
        }
    }

    // If input is inside the modal, show results there
    const inModal = !!inputEl.closest('#searchModal');
    if (inModal) {
        renderSearchResults(matches);
    }

    // If there are no product cards on this page and this is a submit action,
    // handle shop-detail inline featured results if available; otherwise redirect to index with q
    if (submit && products.length === 0) {
        const term = raw.trim();
        const isDetail = window.location.pathname.includes('shop-detail.html');
        const canInline = typeof window.renderFeaturedSearchResults === 'function';
        if (isDetail && canInline) {
            window.renderFeaturedSearchResults(term);
            const modal = document.getElementById('searchModal');
            if (modal) {
                try { new bootstrap.Modal(modal).hide(); } catch(_) {}
            }
        } else if (term) {
            window.location.href = `index.html?q=${encodeURIComponent(term)}`;
        }
    }
}

// Attach listeners to all search inputs and their matching icons when DOM is ready.
document.addEventListener('DOMContentLoaded', function() {
    // All inputs of type=search on the page (modal, hero, sidebars, etc.)
    const searchInputs = Array.from(document.querySelectorAll('input[type="search"]'));

    searchInputs.forEach(input => {
        // live search on input
        input.addEventListener('input', function() {
            searchProductsFromInput(input, false);
        });

        // Enter key
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchProductsFromInput(input, true);
            }
        });

        // If the input is inside an input-group with a sibling .input-group-text (search icon), bind click on that icon too
        const parent = input.closest('.input-group');
        if (parent) {
            const iconSpan = parent.querySelector('.input-group-text');
            if (iconSpan) {
                iconSpan.addEventListener('click', function() {
                    searchProductsFromInput(input, true);
                });
            }
        }
    });

    // Also bind the hero search button if present (some pages have a separate button)
    const heroBtn = document.getElementById('hero-search-btn');
    const heroInput = document.getElementById('hero-search-input');
    if (heroBtn && heroInput) {
        heroBtn.addEventListener('click', function() {
            searchProductsFromInput(heroInput, true);
        });
    }

    // If URL contains ?q=term, prefill main search and run filter on index
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q && heroInput) {
        heroInput.value = q;
        searchProductsFromInput(heroInput, true);
    }

    // Hide modal results on modal close
    const searchModal = document.getElementById('searchModal');
    if (searchModal) {
        searchModal.addEventListener('hidden.bs.modal', function(){
            const resultsEl = document.getElementById('search-results');
            if (resultsEl) { resultsEl.style.display = 'none'; resultsEl.innerHTML = ''; }
        });
    }
});