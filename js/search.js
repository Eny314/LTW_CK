// Generalized product search function. Accepts an input element (so multiple inputs can trigger it).
function searchProductsFromInput(inputEl) {
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

    // Select all product items (if none exist on the page, nothing happens)
    const products = document.querySelectorAll('.fruite-item');
    let matched = 0;

    // Visible diagnostic log so user can see search was triggered
    console.log('searchProductsFromInput called:', {value: raw, searchTerm, products: products.length});

    const termNorm = normalizeText(searchTerm);

    products.forEach(product => {
        // defensively get name/price text
        const nameEl = product.querySelector('h4');
        const priceEl = product.querySelector('.text-dark');
        const productName = nameEl ? (nameEl.textContent || '').toLowerCase() : '';
        const productPrice = priceEl ? (priceEl.textContent || '').toLowerCase() : '';

    const productNameNorm = normalizeText(productName);
    const productPriceNorm = normalizeText(productPrice);

        const visible = (!searchTerm || productNameNorm.includes(termNorm) || productPriceNorm.includes(termNorm));
        // show/hide the product card itself
        product.style.display = visible ? '' : 'none';

        // also hide the column wrapper (so the grid collapses). Look for nearest ancestor with a "col-" class
        const colParent = product.closest('[class*="col-"]');
        if (colParent) colParent.style.display = visible ? '' : 'none';

        if (visible) matched += 1;
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
    }
}

// Attach listeners to all search inputs and their matching icons when DOM is ready.
document.addEventListener('DOMContentLoaded', function() {
    // All inputs of type=search on the page (modal, hero, sidebars, etc.)
    const searchInputs = Array.from(document.querySelectorAll('input[type="search"]'));

    searchInputs.forEach(input => {
        // live search on input
        input.addEventListener('input', function() {
            searchProductsFromInput(input);
        });

        // Enter key
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchProductsFromInput(input);
            }
        });

        // If the input is inside an input-group with a sibling .input-group-text (search icon), bind click on that icon too
        const parent = input.closest('.input-group');
        if (parent) {
            const iconSpan = parent.querySelector('.input-group-text');
            if (iconSpan) {
                iconSpan.addEventListener('click', function() {
                    searchProductsFromInput(input);
                });
            }
        }
    });

    // Also bind the hero search button if present (some pages have a separate button)
    const heroBtn = document.getElementById('hero-search-btn');
    const heroInput = document.getElementById('hero-search-input');
    if (heroBtn && heroInput) {
        heroBtn.addEventListener('click', function() {
            searchProductsFromInput(heroInput);
        });
    }
});