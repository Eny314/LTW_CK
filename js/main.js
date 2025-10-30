(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        } 
    });
    
    
   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:2
            }
        }
    });


    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });



    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });

})(jQuery);



// Mảng giỏ hàng (không redeclare nếu đã có từ file khác)
window.cart = window.cart || [];

// Hàm cập nhật giỏ hàng trên giao diện
function updateCartUI() {
    // Kiểm tra nếu không phải trang cart.html hoặc checkout.html thì không thực hiện
    if (!window.location.pathname.includes("cart.html") && !window.location.pathname.includes("checkout.html")) {
        return;
    }

    let cartTableBody = document.querySelector("tbody"); // Chọn tbody của bảng
    if (!cartTableBody) return; // Tránh lỗi nếu không có bảng

    cartTableBody.innerHTML = ""; // Xóa nội dung cũ

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        let row = document.createElement("tr");
        row.innerHTML = `
            <th scope="row">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" class="img-fluid me-5 rounded-circle" style="width: 80px; height: 80px;">
                </div>
            </th>
            <td><p class="mb-0 mt-4">${item.name}</p></td>
            <td><p class="mb-0 mt-4">${item.price}đ</p></td>
            <td>
                <div class="input-group quantity mt-4" style="width: 100px;">
                    <div class="input-group-btn">
                        <button class="btn btn-sm btn-minus rounded-circle bg-light border" data-index="${index}">
                            <i class="fa fa-minus"></i>
                        </button>
                    </div>
                    <input type="text" class="form-control form-control-sm text-center border-0" value="${item.quantity}">
                    <div class="input-group-btn">
                        <button class="btn btn-sm btn-plus rounded-circle bg-light border" data-index="${index}">
                            <i class="fa fa-plus"></i>
                        </button>
                    </div>
                </div>
            </td>
            <td><p class="mb-0 mt-4">${itemTotal}đ</p></td>
            <td>
                <button class="btn btn-md rounded-circle bg-light border mt-4 btn-remove" data-index="${index}">
                    <i class="fa fa-times text-danger"></i>
                </button>
            </td>
        `;
        cartTableBody.appendChild(row);
    });

    // Cập nhật tổng tiền
    let cartTotalElement = document.querySelector(".cart-total");
    if (cartTotalElement) {
        cartTotalElement.textContent = `${total}đ`;
    }

    // Thêm sự kiện cho các nút sau khi cập nhật giao diện
    addEventListenersToCartButtons();
}

// Gọi hàm updateCartUI() khi tải trang để hiển thị giỏ hàng
document.addEventListener("DOMContentLoaded", updateCartUI);


// Hàm cập nhật số lượng sản phẩm trên icon giỏ hàng
function updateCartCount() {
    let cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
        let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalQuantity;
    }
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(name, price, image) {
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price: parseFloat(price), image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartUI();
    updateCartCount();

    alert(`Đã thêm sản phẩm "${name}" vào giỏ hàng!`);
}

// Gán sự kiện cho các nút (+), (-), (xóa) trong giỏ hàng
function addEventListenersToCartButtons() {
    document.querySelectorAll(".btn-minus").forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartUI();
            updateCartCount();
        });
    });

    document.querySelectorAll(".btn-plus").forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            cart[index].quantity++;
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartUI();
            updateCartCount();
        });
    });

    document.querySelectorAll(".btn-remove").forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartUI();
            updateCartCount();
        });
    });
}

// Thêm sản phẩm vào giỏ hàng khi bấm nút "Add to Cart"
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function (event) {
        event.preventDefault();
        
        let name = this.getAttribute("data-name");
        let price = this.getAttribute("data-price");

        let productElement = this.closest(".fruite-item");
        if (!productElement) {
            console.error("Không tìm thấy phần tử sản phẩm!", this);
            return;
        }

        let imageElement = productElement.querySelector(".fruite-img img");
        if (!imageElement) {
            console.error("Không tìm thấy ảnh sản phẩm!", this);
            return;
        }
        let image = imageElement.src;

        addToCart(name, price, image);
        updateCartCount();
    });
});

// Khi trang tải lại, khôi phục giỏ hàng từ localStorage
document.addEventListener("DOMContentLoaded", function () {
    let storedCart = localStorage.getItem("cart");
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
    
    updateCartUI();
    updateCartCount();
});

document.addEventListener("DOMContentLoaded", function () {
    const checkoutBtn = document.querySelector(".btn.text-uppercase");
    const cartTotalElement = document.querySelector(".cart-total");

    if (checkoutBtn && cartTotalElement) {
        checkoutBtn.addEventListener("click", function () {
            let totalText = cartTotalElement.textContent.trim();
            let totalAmount = parseFloat(totalText.replace(/[^\d.]/g, ""));

                if (isNaN(totalAmount) || totalAmount === 0) {
                alert("⚠ Giỏ hàng đang trống! Vui lòng thêm sản phẩm trước khi thanh toán.");
            } else {
                    // chuyển tới trang thanh toán (checkout)
                    console.log('Redirecting to checkout, totalAmount =', totalAmount);
                    window.location.href = "checkout.html";
            }
        });
    } else {
        console.error("Không tìm thấy nút thanh toán hoặc tổng tiền!");
    }
});



document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM đã tải xong!");

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    if (window.location.pathname.includes("shop-detail.html")) {
        console.log("🔍 Đang ở trang shop-detail.html");

        const productName = getQueryParam("name") || "Sản phẩm không xác định";
        let productPrice = getQueryParam("price") || "0";
        let productImg = getQueryParam("img") || "default.jpg"; // Tránh lỗi đường dẫn

        // ✅ Sửa đường dẫn hình ảnh
        if (!productImg.startsWith("assets/img/")) {
            productImg = "assets/img/" + productImg;
        }

        // ✅ Chuẩn hóa giá tiền (loại bỏ ký tự lạ, chỉ giữ số)
        productPrice = productPrice.replace(/[^\d]/g, "") + "đ";

        console.log("📌 Tên sản phẩm:", productName);
        console.log("💰 Giá sản phẩm:", productPrice);
        console.log("🖼 Ảnh sản phẩm:", productImg);

        const productImage = document.querySelector(".product-image");
        const productTitle = document.querySelector(".product-name");
        const productPriceTag = document.querySelector(".product-price");

        if (productImage) productImage.src = productImg;
        if (productTitle) productTitle.innerText = productName;
        if (productPriceTag) productPriceTag.innerText = productPrice;

        // 🛒 Xử lý thêm sản phẩm vào giỏ hàng
        const addToCartBtn = document.querySelector(".btn-add-to-cart");
        if (addToCartBtn) {
            addToCartBtn.addEventListener("click", function () {
                let cart = JSON.parse(localStorage.getItem("cart")) || [];

                // Kiểm tra sản phẩm đã tồn tại chưa
                let existingItem = cart.find(item => item.name === productName);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({
                        name: productName,
                        price: parseInt(productPrice), // Đảm bảo kiểu số
                        image: productImg,
                        quantity: 1
                    });
                }

                // Lưu giỏ hàng vào localStorage
                localStorage.setItem("cart", JSON.stringify(cart));

                alert(`✅ Đã thêm "${productName}" vào giỏ hàng!`);
            });
        }
    }
});


document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM đã tải xong!");

    // Xử lý đặt hàng và lưu vào lịch sử giao dịch
    let orderButton = document.getElementById("orderButton");

    if (orderButton) {
        orderButton.addEventListener("click", function () {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            if (cart.length === 0) {
                alert("⚠ Giỏ hàng đang trống!");
                return;
            }

            // Lấy danh sách giao dịch hiện tại
            let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

            // Tạo ID giao dịch mới (tự động tăng)
            let transactionID = transactions.length > 0 ? transactions[transactions.length - 1].id + 1 : 1;

            // Tạo một giao dịch mới
            let newTransaction = {
                id: transactionID,
                products: cart.map(item => item.name) // Lưu danh sách tên sản phẩm
            };

            // Thêm vào danh sách giao dịch
            transactions.push(newTransaction);

            // Lưu vào localStorage
            localStorage.setItem("transactions", JSON.stringify(transactions));

            // Hiển thị thông báo đặt hàng thành công
            alert("🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm. 🛒");

            // Xóa giỏ hàng khỏi LocalStorage
            localStorage.removeItem("cart");

            // Cập nhật giao diện lịch sử giao dịch
            updateTransactionUI();
        });
    }

    // Hiển thị lịch sử giao dịch
    function updateTransactionUI() {
        let transactionBody = document.getElementById("transaction-body");
        if (!transactionBody) return; // Nếu không có phần tử này trên trang thì thoát sớm
        let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

        // Xóa nội dung cũ
        transactionBody.innerHTML = "";

        if (transactions.length === 0) {
            transactionBody.innerHTML = "<tr><td colspan='2' class='text-center'>Chưa có giao dịch nào!</td></tr>";
        } else {
            transactions.forEach(transaction => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${transaction.id}</td>
                    <td>${transaction.products.join(", ")}</td> <!-- Hiển thị danh sách sản phẩm -->
                `;
                transactionBody.appendChild(row);
            });
        }
    }

    // Cập nhật giao diện khi tải trang
    updateTransactionUI();

    // Xóa lịch sử giao dịch
    let clearButton = document.getElementById("clear-transactions");
    if (clearButton) {
        clearButton.addEventListener("click", function () {
            if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử giao dịch?")) {
                localStorage.removeItem("transactions");
                updateTransactionUI();
                alert("🗑 Lịch sử giao dịch đã được xóa!");
            }
        });
    }
});

function getTransactions() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    let groupedTransactions = transactions.map(tran => tran.products);

    console.log("Transactions đã nhóm lại:", groupedTransactions);
    return groupedTransactions;
}

// 🔹 Xây dựng bảng bit từ lịch sử giao dịch
function buildBitTable(transactions) {
    let itemSet = new Set(transactions.flat());
    let bitTable = {};

    itemSet.forEach(item => {
        bitTable[item] = transactions.map(tran => tran.includes(item) ? 1 : 0);
    });

    console.log("Bảng bit table:", bitTable);
    return bitTable;
}

function findFrequentItemsets(bitTable, minSupport) {
    let frequentItems = {};
    for (let item in bitTable) {
        let support = bitTable[item].reduce((sum, bit) => sum + bit, 0);
        if (support >= minSupport) {
            frequentItems[item] = support;
        }
    }
    console.log("Tập phổ biến:", frequentItems);
    return frequentItems;
}

// 🔹 Sinh danh sách sản phẩm gợi ý từ tập phổ biến (ưu tiên sản phẩm có tần suất cao)
function generateRecommendations(frequentItems, transactions, minSupport) {
    let recommendations = {};

    for (let item in frequentItems) {
        let relatedItems = new Map();

        transactions.forEach(transaction => {
            if (transaction.includes(item)) {
                transaction.forEach(otherItem => {
                    if (otherItem !== item) {
                        relatedItems.set(otherItem, (relatedItems.get(otherItem) || 0) + 1);
                    }
                });
            }
        });

        console.log(`Sản phẩm liên quan đến ${item}:`, [...relatedItems.entries()]);

        recommendations[item] = [...relatedItems.entries()]
            .filter(([_, count]) => count >= minSupport)
            .sort((a, b) => b[1] - a[1])  // Sắp xếp theo tần suất giảm dần
            .slice(0, 5)  // Lấy tối đa 5 sản phẩm
            .map(([otherItem]) => otherItem);
    }

    console.log("Danh sách gợi ý sản phẩm:", recommendations);
    return recommendations;
}

// 🔹 Chạy thuật toán khi trang tải
document.addEventListener("DOMContentLoaded", function () {
    let transactions = getTransactions();
    let bitTable = buildBitTable(transactions);
    let frequentItems = findFrequentItemsets(bitTable, 2);
    let recommendations = generateRecommendations(frequentItems, transactions, 2);
});

// 🔹 Dữ liệu sản phẩm
const productData = {
    "Đậu bắp": { img: "assets/img/vegetable-item-7.jpg", price: "12.000đ" },
    "Bắp chuối": { img: "assets/img/vegetable-item-8.jpg", price: "20.000đ" },
    "Khoai tây": { img: "assets/img/vegetable-item-9.jpg", price: "25.000đ" },
    "Bí đỏ": { img: "assets/img/vegetable-item-10.jpg", price: "10.000đ" },
    "Ớt chuông": { img: "assets/img/vegetable-item-11.jpg", price: "18.000đ" },
    "Cà tím": { img: "assets/img/vegetable-item-12.jpg", price: "9.000đ" },
    "Củ dền": { img: "assets/img/vegetable-item-13.jpg", price: "14.000đ" },
    "Củ cải trắng": { img: "assets/img/vegetable-item-14.jpg", price: "22.000đ" },
    "Cà chua": { img: "assets/img/vegetable-item-15.jpg", price: "12.000đ" },
    "Hành baro": { img: "assets/img/vegetable-item-16.jpg", price: "10.000đ" },
    "Cà pháo": { img: "assets/img/vegetable-item-17.jpg", price: "55.000đ" },
    "Dưa chuột": { img: "assets/img/vegetable-item-18.jpg", price: "30.000đ" },
    "Cải xanh": { img: "assets/img/vegetable-item-19.jpg", price: "35.000đ" },
    "Bắp": { img: "assets/img/vegetable-item-20.jpg", price: "12.000đ" },
    "Đậu cô ve": { img: "assets/img/vegetable-item-21.jpg", price: "20.000đ" },
    "Mướp": { img: "assets/img/vegetable-item-22.png", price: "18.000đ" },
    "Măng cụt": { img: "assets/img/fruite-item-17.jpg", price: "9.000đ" },
    "Kiwi": { img: "assets/img/fruite-item-18.jpg", price: "30.000đ" },
    "Nho": { img: "assets/img/fruite-item-7.jpg", price: "89.500đ" },
    "Vải": { img: "assets/img/fruite-item-8.jpg", price: "45.000đ" },
    "Dứa": { img: "assets/img/fruite-item-9.jpg", price: "23.000đ" },
    "Chôm chôm": { img: "assets/img/fruite-item-10.jpg", price: "35.000đ" },
    "Mâm xôi": { img: "assets/img/fruite-item-11.jpg", price: "15.000đ" },
    "Đào": { img: "assets/img/fruite-item-12.jpg", price: "85.000đ" },
    "Lê": { img: "assets/img/fruite-item-13.jpg", price: "55.000đ" },
    "Ổi": { img: "assets/img/fruite-item-14.jpg", price: "35.000đ" },
    "Chuối": { img: "assets/img/fruite-item-15.jpg", price: "30.000đ" },
    "Khế": { img: "assets/img/fruite-item-16.jpg", price: "23.000đ" }
};

// 🔹 Hiển thị gợi ý sản phẩm trên shop-detail.html
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get("name");

    let transactions = getTransactions();
    let bitTable = buildBitTable(transactions);
    let frequentItems = findFrequentItemsets(bitTable, 2);
    let recommendations = generateRecommendations(frequentItems, transactions, 2);

    if (productName) {
        let suggestedProducts = (recommendations[productName] || []).filter(p => productData[p]);

        const container = document.querySelector(".vegetable-carousel");
        if (!container) return;

        container.innerHTML = ""; // Xóa danh sách cũ

        if (suggestedProducts.length === 0) {
            suggestedProducts = Object.keys(productData).slice(0, 5); // Hiển thị sản phẩm bán chạy nếu không có gợi ý
        }

        suggestedProducts.forEach(product => {
            let productInfo = productData[product];

            let productHTML = `
                <div class="border border-primary rounded position-relative vesitable-item">
                    <div class="vesitable-img">
                        <img src="${productInfo.img}" class="img-fluid w-100 rounded-top" alt="${product}">
                    </div>
                    <div class="p-4 pb-0 rounded-bottom">
                        <h4>${product}</h4>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                        <div class="d-flex justify-content-between flex-lg-wrap">
                            <p class="text-dark fs-5 fw-bold">${productInfo.price}</p>
                            <a href="shop-detail.html?name=${encodeURIComponent(product)}&img=${encodeURIComponent(productInfo.img)}&price=${encodeURIComponent(productInfo.price)}" class="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary">
                                <i class="fa fa-shopping-bag me-2 text-primary"></i> View Details
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += productHTML;
        });

        // 🔄 Khởi động lại Owl Carousel
        setTimeout(() => {
            $(".vegetable-carousel").owlCarousel("destroy");
            $(".vegetable-carousel").owlCarousel({
                loop: true,
                margin: 20,
                nav: true,
                dots: false,
                autoplay: true,
                autoplayTimeout: 3000,
                responsive: {
                    0: { items: 1 },
                    600: { items: 2 },
                    1000: { items: 3 },
                }
            });
        }, 100);
    }
});

function getBestSellingProducts() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    
    let productCount = {};

    transactions.forEach(tran => {
        tran.products.forEach(product => {
            productCount[product] = (productCount[product] || 0) + 1;
        });
    });

    // Sắp xếp theo số lần xuất hiện giảm dần
    let sortedProducts = Object.entries(productCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6); // Lấy 6 sản phẩm bán chạy nhất

    return sortedProducts;
}

// Gọi hàm để hiển thị danh sách sản phẩm bán chạy nhất khi trang tải
document.addEventListener("DOMContentLoaded", function () {
    let bestSellers = getBestSellingProducts();
    const container = document.querySelector(".best-sellers");

    if (!container) return;
    container.innerHTML = ""; // Xóa danh sách cũ

    bestSellers.forEach(([product, count]) => {
        let productInfo = productData[product];

        if (!productInfo) return; // Bỏ qua sản phẩm không có dữ liệu hình ảnh

        let productHTML = `
            <div class="col-lg-6 col-xl-4">
                <div class="p-4 rounded bg-light">
                    <div class="row align-items-center">
                        <div class="col-6">
                            <img src="${productInfo.img}" class="img-fluid rounded-circle w-100" alt="${product}">
                        </div>
                        <div class="col-6">
                            <a href="shop-detail.html?name=${encodeURIComponent(product)}&img=${encodeURIComponent(productInfo.img)}&price=${encodeURIComponent(productInfo.price)}" class="h5">${product}</a>
                            <div class="d-flex my-3">
                                <i class="fas fa-star text-primary"></i>
                                <i class="fas fa-star text-primary"></i>
                                <i class="fas fa-star text-primary"></i>
                                <i class="fas fa-star text-primary"></i>
                                <i class="fas fa-star"></i>
                            </div>
                            <h4 class="mb-3">${productInfo.price}</h4>
                            <p class="text-muted">Đã bán: ${count} lần</p>
                            <a href="shop-detail.html?name=${encodeURIComponent(product)}&img=${encodeURIComponent(productInfo.img)}&price=${encodeURIComponent(productInfo.price)}" class="btn border border-secondary rounded-pill px-3 text-primary">
                                <i class="fa fa-shopping-bag me-2 text-primary"></i> Xem chi tiết
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productHTML;
    });
});
