const SHIPPING_COST = 15.00; // **** تم التعديل إلى 15.00 دينار ****

const summaryItemsContainer = document.getElementById('summary-items');
const summarySubtotalElement = document.getElementById('summary-subtotal');
const shippingCostElement = document.getElementById('shipping-cost');
const finalTotalElement = document.getElementById('final-total');
const placeOrderButton = document.getElementById('place-order-btn');
const checkoutForm = document.getElementById('checkout-form');
const orderMessage = document.getElementById('order-message');
const cartDataInput = document.getElementById('cart-data-input'); 

// تعريف العناصر الخاصة بالدفع والبطاقة
const visaRadio = document.getElementById('radio-visa');
const cashRadio = document.getElementById('radio-cash');
const cardDetailsDiv = document.getElementById('card-details');
const expiryInput = document.getElementById('expiry'); // مدخل تاريخ الانتهاء

const cardInputs = [
    document.getElementById('card-number'),
    document.getElementById('card-name'),
    expiryInput,
    document.getElementById('cvv')
];

let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

// ----------------------------------------------------------------------
// 1. عرض الملخص النهائي وحساب الإجمالي
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
                    <span class="item-total-price">${itemTotal.toFixed(2)} د.أ</span> </div>
            </div>
        `;
    });

    const finalTotal = subtotal + SHIPPING_COST;
    
    // تحديث الأرقام
    summarySubtotalElement.textContent = `${subtotal.toFixed(2)} د.أ`; // **** تم التعديل هنا ****
    shippingCostElement.textContent = `${SHIPPING_COST.toFixed(2)} د.أ`; // **** تم التعديل هنا ****
    finalTotalElement.textContent = `${finalTotal.toFixed(2)} د.أ`; // **** تم التعديل هنا ****

    placeOrderButton.disabled = false;
}

// ----------------------------------------------------------------------
// 2. منطق إظهار وإخفاء حقول البطاقة (حل مشكلة الفيزا)
// ----------------------------------------------------------------------

function toggleCardFields() {
    const isVisaSelected = visaRadio.checked;

    if (isVisaSelected) {
        cardDetailsDiv.style.display = 'block';
        cardInputs.forEach(input => input.setAttribute('required', 'required'));
    } else {
        cardDetailsDiv.style.display = 'none';
        cardInputs.forEach(input => input.removeAttribute('required'));
    }
}

// ربط وظيفة التبديل بأزرار الراديو
if (visaRadio && cashRadio) {
    visaRadio.addEventListener('change', toggleCardFields);
    cashRadio.addEventListener('change', toggleCardFields);
}
toggleCardFields();


// ----------------------------------------------------------------------
// 3. تنسيق مدخل تاريخ الانتهاء (MM/YY)
// ----------------------------------------------------------------------

if (expiryInput) {
    expiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // إزالة أي شيء ليس رقمًا

        // إذا كان طول المدخل 3 أرقام أو أكثر، أضف الشرطة المائلة بعد أول رقمين
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4); 
        }

        e.target.value = value;
    });
}


// ----------------------------------------------------------------------
// 4. منطق تأكيد الطلب والدفع (إرسال Formspree)
// ----------------------------------------------------------------------

checkoutForm.addEventListener('submit', handlePlaceOrder);

function handlePlaceOrder(e) {
    e.preventDefault(); 

    if (cart.length === 0) {
        orderMessage.textContent = 'السلة فارغة، لا يمكن إتمام الطلب!';
        return;
    }

    // التحقق من صحة جميع المدخلات
    if (!checkoutForm.checkValidity()) {
        orderMessage.textContent = 'الرجاء ملء جميع الحقول المطلوبة بشكل صحيح.';
        checkoutForm.reportValidity(); 
        return;
    }

    // تجميع محتويات السلة في نص واحد للحقل المخفي
    let cartSummaryText = 'تفاصيل الطلب: ';
    cart.forEach((item, index) => {
        // تم تغيير الرمز في التجميع أيضاً
        cartSummaryText += `(${index + 1}) - ${item.name} | مقاس: ${item.size} | كمية: ${item.quantity} | الإجمالي: ${(item.price * item.quantity).toFixed(2)} د.أ; `;
    });
    
    const finalTotalValue = (parseFloat(summarySubtotalElement.textContent) + SHIPPING_COST).toFixed(2);
    // تم تغيير الرمز هنا أيضاً
    cartSummaryText += ` | الإجمالي النهائي شامل الشحن: ${finalTotalValue} د.أ.`;
    
    cartDataInput.value = cartSummaryText;

    // إرسال النموذج إلى Formspree باستخدام Fetch API
    fetch(checkoutForm.action, {
        method: checkoutForm.method,
        body: new FormData(checkoutForm),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // إفراغ السلة وعرض رسالة النجاح بعد نجاح الإرسال
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
            renderOrderSummary(); 
            checkoutForm.reset(); 

        } else {
            // معالجة أخطاء Formspree
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

// تشغيل عرض الملخص عند تحميل الصفحة
renderOrderSummary();