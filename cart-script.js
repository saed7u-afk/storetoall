// ----------------------------------------------------------------------
// مصفوفة المنتجات (مُكررة لتشغيل الصفحة بشكل منفصل)
// ----------------------------------------------------------------------
const products = [
    {
        id: 1,
        name: "حذاء الجري فائق السرعة",
        price: 189.50,
        description: "تصميم خفيف الوزن بأحدث تقنيات امتصاص الصدمات، مثالي للماراثون.",
        imageUrl: "images/reb1 (1).jpeg", 
        variants: [
            { color: "أبيض/رمادي", sizes: ["40", "41", "42", "43"], variant_image: "images/rebok1.jpeg" },
            { color: "أسود/أحمر", sizes: ["41", "42", "44"], variant_image: "images/rebok2.jpeg" },
            { color: "أزرق فاتح", sizes: ["40", "43"], variant_image: "images/rebok3.jpeg" }
        ]
    },
    {
        id: 2,
        name: "حذاء رياضي كلاسيكي V9",
        price: 99.99,
        description: "الحذاء الأيقوني المريح، أساسي لكل إطلالة يومية.",
        imageUrl: "images/c270a.jpeg", 
        variants: [
            { color: "أبيض ناصع", sizes: ["38", "39", "40", "41", "42"], variant_image: "images/c270a.jpeg" },
            { color: "أخضر زيتوني", sizes: ["39", "41", "43"], variant_image: "images/c270b.jpeg" },
            { color: "أحمر زيتوني", sizes: ["39", "41", "43"], variant_image: "images/c270c.jpeg" },
            { color: "رمادي داكن", sizes: ["39", "41", "43"], variant_image: "images/c270d.jpeg" }
        ]
    },
    {
        id: 3,
        name: "حذاء التدريب القوي",
        price: 145.00,
        description: "ثبات ودعم ممتازين، مثالي لتمارين القوة وصالة الألعاب الرياضية.",
        imageUrl: "images/reb1 (3).jpeg", 
        
        variants: [
            { color: "أسود فاحم", sizes: ["40", "41", "42"], variant_image: "images/reb1 (3).jpeg" },
            { color: "رمادي غامق", sizes: ["41", "42", "44"], variant_image: "images/reb1 (2).jpeg" }
        ]
    }
];

// ----------------------------------------------------------------------
// *بدء منطق السلة الأصلي*
// ----------------------------------------------------------------------
const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const totalAmountElement = document.getElementById('total-amount');
const checkoutButton = document.getElementById('checkout-btn');

let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

function calculateCartTotal() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const total = subtotal; 
    
    subtotalElement.textContent = `${subtotal.toFixed(2)} ر.س`;
    totalAmountElement.textContent = `${total.toFixed(2)} ر.س`;
    
    checkoutButton.disabled = cart.length === 0;
}

function renderCart() {
    cartItemsContainer.innerHTML = ''; 

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">سلة التسوق فارغة حالياً. ابدأ التسوق الآن!</p>';
        calculateCartTotal();
        return;
    }

    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        
        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>المقاس: ${item.size}</p>
                <p class="item-price">${item.price.toFixed(2)} ر.س</p>
            </div>
            <div class="item-quantity-control">
                <button class="qty-btn remove-btn" data-id="${item.id}">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="qty-btn add-btn" data-id="${item.id}">+</button>
            </div>
            <button class="delete-btn" data-id="${item.id}">حذف</button>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
    });

    attachCartEventListeners();
    calculateCartTotal();
}

function attachCartEventListeners() {
    document.querySelectorAll('.add-btn').forEach(button => {
        button.addEventListener('click', updateItemQuantity);
    });

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', updateItemQuantity);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', deleteItem);
    });
}

function updateItemQuantity(e) {
    const itemId = e.target.getAttribute('data-id');
    const action = e.target.classList.contains('add-btn') ? 'add' : 'remove';

    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex > -1) {
        if (action === 'add') {
            cart[itemIndex].quantity++;
        } else if (action === 'remove' && cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
        }
        
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        renderCart();
    }
}

function deleteItem(e) {
    const itemId = e.target.getAttribute('data-id');
    
    cart = cart.filter(item => item.id !== itemId);
    
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    renderCart();
}

checkoutButton.addEventListener('click', () => {
    if (cart.length > 0) {
        // سيتم ربطها بـ checkout.html في الخطوة التالية
        window.location.href = 'checkout.html';
    }
});

renderCart();