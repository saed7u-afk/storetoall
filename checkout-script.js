const SHIPPING_COST = 25.00; 

const summaryItemsContainer = document.getElementById('summary-items');
const summarySubtotalElement = document.getElementById('summary-subtotal');
const shippingCostElement = document.getElementById('shipping-cost');
const finalTotalElement = document.getElementById('final-total');
const placeOrderButton = document.getElementById('place-order-btn');
const checkoutForm = document.getElementById('checkout-form');
const orderMessage = document.getElementById('order-message');
const cartDataInput = document.getElementById('cart-data-input'); // الحقل المخفي

let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

// ----------------------------------------------------------------------
// 1. عرض الملخص النهائي وحساب الإجمالي (لا تغيير)
// ----------------------------------------------------------------------

function renderOrderSummary() {
    summaryItemsContainer.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        summaryItemsContainer.innerHTML = '<p>سلة التسوق فارغة! الرجاء العودة لإضافة منتجات.</p>';
        placeOrderButton.disabled = true;
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        summaryItemsContainer.innerHTML += `
            <div class="summary-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>المقاس: ${item.size} | الكمية: ${item.quantity}</p>
                    <span class="item-total-price">${itemTotal.toFixed(2)} ر.س</span>
                </div>
            </div>
        `;
    });

    const finalTotal = subtotal + SHIPPING_COST;
    
    // تحديث الأرقام
    summarySubtotalElement.textContent = `${subtotal.toFixed(2)} ر.س`;
    shippingCostElement.textContent = `${SHIPPING_COST.toFixed(2)} ر.س`;
    finalTotalElement.textContent = `${finalTotal.toFixed(2)} ر.س`;

    placeOrderButton.disabled = false;
}

// ----------------------------------------------------------------------
// 2. منطق تأكيد الطلب والدفع (المُعدل لـ Formspree)
// ----------------------------------------------------------------------

// ربط هذا الحدث على "submit" للنموذج، وليس على "click" للزر
checkoutForm.addEventListener('submit', handlePlaceOrder);

function handlePlaceOrder(e) {
    // منع الإرسال التلقائي للتحكم في عملية التحقق والإفراغ
    e.preventDefault(); 

    if (cart.length === 0) {
        orderMessage.textContent = 'السلة فارغة، لا يمكن إتمام الطلب!';
        return;
    }

    // 1. التحقق من صحة جميع المدخلات في النموذج
    if (!checkoutForm.checkValidity()) {
        orderMessage.textContent = 'الرجاء ملء جميع الحقول المطلوبة بشكل صحيح.';
        checkoutForm.reportValidity(); 
        return;
    }

    // 2. تجميع محتويات السلة في نص واحد للحقل المخفي
    let cartSummaryText = 'تفاصيل الطلب: ';
    cart.forEach((item, index) => {
        cartSummaryText += `(${index + 1}) - ${item.name} | مقاس: ${item.size} | كمية: ${item.quantity} | الإجمالي: ${(item.price * item.quantity).toFixed(2)} ر.س; `;
    });
    
    // إضافة الإجمالي النهائي
    const finalTotalValue = (parseFloat(summarySubtotalElement.textContent) + SHIPPING_COST).toFixed(2);
    cartSummaryText += ` | الإجمالي النهائي شامل الشحن: ${finalTotalValue} ر.س.`;
    
    // 3. وضع النص في الحقل المخفي
    cartDataInput.value = cartSummaryText;

    // 4. إرسال النموذج إلى Formspree باستخدام Fetch API
    fetch(checkoutForm.action, {
        method: checkoutForm.method,
        body: new FormData(checkoutForm),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // 5. إفراغ السلة وعرض رسالة النجاح بعد نجاح الإرسال
            localStorage.removeItem('shoppingCart');
            cart = [];
            
            orderMessage.style.color = 'green';
            orderMessage.innerHTML = `
                🎉 تم تأكيد طلبك بنجاح!
                <br>
                سيتم شحن الطلب إلى العنوان. سيتم التواصل معك على رقم الهاتف: ${document.getElementById('phone').value}.
                <br>
                شكراً لثقتك بنا.
            `;
            
            document.getElementById('place-order-btn').disabled = true;
            renderOrderSummary(); // لتحديث عرض السلة الفارغة
            checkoutForm.reset(); // مسح حقول النموذج

        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    orderMessage.textContent = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    orderMessage.textContent = "حدث خطأ في الإرسال. الرجاء المحاولة لاحقاً.";
                }
            })
        }
    })
    .catch(error => {
        orderMessage.textContent = "حدث خطأ في الاتصال بالشبكة. الرجاء المحاولة لاحقاً.";
    });
}

// ----------------------------------------------------------------------
// ربط الأحداث (لا تغيير هنا)
// ----------------------------------------------------------------------

// تشغيل عرض الملخص عند تحميل الصفحة
renderOrderSummary();