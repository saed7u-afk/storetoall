// ----------------------------------------------------------------------
// مصفوفة المنتجات (مُعدلة بالأسعار الموحدة 15.00)
// ملاحظة: هذه المصفوفة ليست ضرورية في صفحة السلة إذا كانت البيانات محفوظة بشكل صحيح في localStorage،
// لكن نتركها لضمان التناسق.
// ----------------------------------------------------------------------
const products = [
    {
        id: 1,
        name: "حذاء الجري فائق السرعة",
        price: 15.00, // السعر الموحد
        description: "تصميم خفيف الوزن بأحدث تقنيات امتصاص الصدمات، مثالي للماراثون.",
        imageUrl: "images/reb1 (1).jpeg", 
    },
    {
        id: 2,
        name: "حذاء رياضي كلاسيكي V9",
        price: 15.00, // السعر الموحد
        description: "الحذاء الأيقوني المريح، أساسي لكل إطلالة يومية.",
        imageUrl: "images/c270a.jpeg", 
    },
    {
        id: 3,
        name: "حذاء التدريب القوي",
        price: 15.00, // السعر الموحد
        description: "ثبات ودعم ممتازين، مثالي لتمارين القوة وصالة الألعاب الرياضية.",
        imageUrl: "images/reb1 (3).jpeg", 
    }
];

// ----------------------------------------------------------------------
// *منطق السلة المُعدّل*
// ----------------------------------------------------------------------
const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal-price'); // تم التعديل ليناسب هيكل HTML الذي استخدمناه
const shippingElement = document.getElementById('shipping-price');   // عنصر جديد للشحن
const totalAmountElement = document.getElementById('total-price');    // تم التعديل
const checkoutButton = document.getElementById('checkout-btn');

const SHIPPING_COST = 15.00; // **** تكلفة الشحن الموحدة 15.00 د.أ ****

let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// ---------------------------------------------------
// 1. حساب إجمالي السلة
// ---------------------------------------------------
function calculateCartTotal() {
    let subtotal = 0;
    cart.forEach(item => {
        // نعتمد على سعر المنتج المحفوظ في السلة (الذي يجب أن يكون 15.00)
        subtotal += item.price * item.quantity;
    });
    
    const totalWithShipping = subtotal + SHIPPING_COST; 
    
    // تحديث الأسعار بالعملة الجديدة (د.أ)
    subtotalElement.textContent = `${subtotal.toFixed(2)} د.أ`;
    shippingElement.textContent = `${SHIPPING_COST.toFixed(2)} د.أ`;
    totalAmountElement.textContent = `${totalWithShipping.toFixed(2)} د.أ`;
    
    checkoutButton.disabled = cart.length === 0;
}

// ---------------------------------------------------
// 2. عرض محتويات السلة
// ---------------------------------------------------
function renderCart() {
    cartItemsContainer.innerHTML = ''; 

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">سلة التسوق فارغة حالياً. ابدأ التسوق الآن!</p>';
        calculateCartTotal();
        // إخفاء ملخص الطلب إذا كانت السلة فارغة
        document.getElementById('cart-summary').style.display = 'none'; 
        return;
    }

    // إظهار ملخص الطلب
    document.getElementById('cart-summary').style.display = 'block';

    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        
        // استخدام cartId لتحديد العنصر بشكل فريد
        cartItemDiv.dataset.id = item.cartId; 

        // حساب السعر الجزئي لكل سطر
        const itemSubtotal = item.price * item.quantity;

        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>اللون: ${item.color} | المقاس: ${item.size}</p> 
                <p class="item-price">${itemSubtotal.toFixed(2)} د.أ</p>
            </div>
            <div class="item-quantity-control">
                <button class="qty-btn remove-btn" data-cart-id="${item.cartId}">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="qty-btn add-btn" data-cart-id="${item.cartId}">+</button>
            </div>
            <button class="delete-btn" data-cart-id="${item.cartId}">حذف</button>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
    });

    attachCartEventListeners();
    calculateCartTotal();
}

// ---------------------------------------------------
// 3. التحكم في الكمية والحذف (يستخدم cartId الآن)
// ---------------------------------------------------

function attachCartEventListeners() {
    // نستخدم event delegation على الحاوية بدلاً من كل زر (أكثر كفاءة)
    cartItemsContainer.addEventListener('click', handleCartAction);
}

function handleCartAction(e) {
    const target = e.target;
    const cartId = target.getAttribute('data-cart-id');
    
    if (!cartId) return;

    // البحث باستخدام cartId
    const itemIndex = cart.findIndex(item => item.cartId === cartId);

    if (itemIndex > -1) {
        if (target.classList.contains('add-btn')) {
            cart[itemIndex].quantity++;
        } else if (target.classList.contains('remove-btn') && cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
        } else if (target.classList.contains('delete-btn')) {
            // حذف العنصر
            cart.splice(itemIndex, 1);
        } else {
            return;
        }
        
        saveCart();
        renderCart();
    }
}

// ---------------------------------------------------
// 4. ربط زر الشراء
// ---------------------------------------------------
if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            window.location.href = 'checkout.html';
        }
    });
}

// ---------------------------------------------------
// 5. بدء تشغيل الصفحة
// ---------------------------------------------------
renderCart();