const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const totalAmountElement = document.getElementById('total-amount');
const checkoutButton = document.getElementById('checkout-btn');

let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

// ----------------------------------------------------------------------
// 1. حساب الإجمالي الكلي للسلة
// ----------------------------------------------------------------------
function calculateCartTotal() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    // يمكنك إضافة الضرائب أو الشحن هنا لاحقاً
    const total = subtotal; 
    
    subtotalElement.textContent = `${subtotal.toFixed(2)} ر.س`;
    totalAmountElement.textContent = `${total.toFixed(2)} ر.س`;
    
    // تفعيل زر الدفع إذا كانت السلة غير فارغة
    checkoutButton.disabled = cart.length === 0;
}

// ----------------------------------------------------------------------
// 2. عرض محتويات السلة
// ----------------------------------------------------------------------
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
        
        // بناء عنصر السلة
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

    // ربط الأحداث بعد إنشاء العناصر
    attachCartEventListeners();
    calculateCartTotal();
}

// ----------------------------------------------------------------------
// 3. ربط أزرار التحكم بالسلة
// ----------------------------------------------------------------------
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

// ----------------------------------------------------------------------
// 4. تحديث الكمية (زيادة / إنقاص)
// ----------------------------------------------------------------------
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
        
        // حفظ التغيير وعرض السلة مرة أخرى
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        renderCart();
    }
}

// ----------------------------------------------------------------------
// 5. حذف المنتج من السلة
// ----------------------------------------------------------------------
function deleteItem(e) {
    const itemId = e.target.getAttribute('data-id');
    
    // ترشيح السلة: إبقاء العناصر التي لا تطابق الـ id المحذوف
    cart = cart.filter(item => item.id !== itemId);
    
    // حفظ التغيير وعرض السلة مرة أخرى
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    renderCart();
}

// ----------------------------------------------------------------------
// 6. ربط زر الدفع (سنقوم ببرمجة صفحة checkout.html لاحقاً)
// ----------------------------------------------------------------------
checkoutButton.addEventListener('click', () => {
    if (cart.length > 0) {
        window.location.href = 'checkout.html';
    }
});


// عند تحميل الصفحة، ابدأ بعرض السلة
renderCart();