// مصفوفة المنتجات (يجب أن تكون متطابقة مع script.js لضمان عمل الصفحة)
const products = [
    {
        id: 1,
        name: "حذاء الجري فائق السرعة",
        price: 15.00, // السعر موحد لـ 15.00 د.أ
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
        price: 15.00, // السعر موحد لـ 15.00 د.أ
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
        price: 15.00, // السعر موحد لـ 15.00 د.أ
        description: "ثبات ودعم ممتازين، مثالي لتمارين القوة وصالة الألعاب الرياضية.",
        imageUrl: "images/reb1 (3).jpeg", 
        
        variants: [
            { color: "أسود فاحم", sizes: ["40", "41", "42"], variant_image: "images/reb1 (3).jpeg" },
            { color: "رمادي غامق", sizes: ["41", "42", "44"], variant_image: "images/reb1 (2).jpeg" }
        ]
    }
];

// جلب العناصر الأساسية
const productDetailsContainer = document.getElementById('product-details-container');
const quantityInput = document.getElementById('quantity');
const finalPriceElement = document.getElementById('final-price');
const colorSelector = document.getElementById('color-selector');
const sizeSelector = document.getElementById('size-selector');
const addToCartButton = document.getElementById('add-to-cart-btn');

let selectedProduct = null;
let basePrice = 0; // السعر الأساسي للمنتج

// ----------------------------------------------------------------------
// 1. عرض تفاصيل المنتج عند التحميل
// ----------------------------------------------------------------------

function renderProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    selectedProduct = products.find(p => p.id === productId);

    if (!selectedProduct) {
        if (productDetailsContainer) {
            productDetailsContainer.innerHTML = '<h1>عفواً، المنتج غير موجود.</h1>';
        }
        return;
    }

    basePrice = selectedProduct.price; // تحديد السعر الأساسي (15.00 د.أ)

    // عرض التفاصيل (الاسم، الوصف، الخ)
    document.getElementById('product-image').src = selectedProduct.imageUrl;
    document.getElementById('product-name').textContent = selectedProduct.name;
    document.getElementById('product-description').textContent = selectedProduct.description;
    
    // إعداد محددات الألوان
    colorSelector.innerHTML = '';
    selectedProduct.variants.forEach(variant => {
        const option = document.createElement('option');
        option.value = variant.color;
        option.textContent = variant.color;
        colorSelector.appendChild(option);
    });

    // تحميل المقاسات لأول لون افتراضياً
    updateSizes();
    
    // تحديث السعر الافتراضي بعد التحميل
    updatePrice();
}


// ----------------------------------------------------------------------
// 2. تحديث المقاسات بناءً على اللون
// ----------------------------------------------------------------------

function updateSizes() {
    const selectedColor = colorSelector.value;
    const variant = selectedProduct.variants.find(v => v.color === selectedColor);
    
    sizeSelector.innerHTML = '';
    if (variant) {
        // تحديث صورة المنتج بناءً على اللون المختار
        document.getElementById('product-image').src = variant.variant_image;

        // إعداد المقاسات المتاحة
        variant.sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelector.appendChild(option);
        });
    }
}


// ----------------------------------------------------------------------
// 3. تحديث السعر الإجمالي
// ----------------------------------------------------------------------

function updatePrice() {
    const quantity = parseInt(quantityInput.value) || 1;
    // يتم الحساب بناءً على السعر الأساسي (basePrice) المحدد بـ 15.00
    const totalPrice = basePrice * quantity; 
    
    // استخدام رمز العملة د.أ
    finalPriceElement.textContent = `${totalPrice.toFixed(2)} د.أ`; 
}


// ----------------------------------------------------------------------
// 4. إضافة إلى السلة
// ----------------------------------------------------------------------

function addToCart() {
    const quantity = parseInt(quantityInput.value);
    const size = sizeSelector.value;
    const color = colorSelector.value;

    if (quantity < 1 || !size || !color) {
        alert('الرجاء اختيار المقاس واللون وتحديد كمية صحيحة.');
        return;
    }

    let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // إنشاء ID فريد للعنصر في السلة (للتفريق بين الأحذية ذات اللون والمقاس المختلفين)
    const cartItemId = `${selectedProduct.id}-${color}-${size}`;

    // البحث عن المنتج في السلة
    const existingItemIndex = shoppingCart.findIndex(item => item.cartId === cartItemId);

    if (existingItemIndex > -1) {
        // إذا كان موجوداً، قم بزيادة الكمية
        shoppingCart[existingItemIndex].quantity += quantity;
    } else {
        // إذا لم يكن موجوداً، أضف عنصراً جديداً
        const newItem = {
            cartId: cartItemId,
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: basePrice, // استخدام السعر الموحد 15.00
            quantity: quantity,
            size: size,
            color: color,
            image: document.getElementById('product-image').src // استخدام صورة اللون المختار
        };
        shoppingCart.push(newItem);
    }

    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
    alert(`${quantity} قطعة من ${selectedProduct.name} (${color}, مقاس ${size}) أضيفت إلى السلة بنجاح!`);
}


// ----------------------------------------------------------------------
// ربط الأحداث وتشغيل الدوال
// ----------------------------------------------------------------------

// الاستماع لتغيير اللون لتحديث المقاسات والصورة
if (colorSelector) colorSelector.addEventListener('change', () => {
    updateSizes();
    updatePrice();
});

// الاستماع لتغيير الكمية لحساب السعر الجديد
if (quantityInput) quantityInput.addEventListener('input', updatePrice);

// الاستماع لزر الإضافة إلى السلة
if (addToCartButton) addToCartButton.addEventListener('click', addToCart);

// تشغيل عرض التفاصيل عند تحميل الصفحة
renderProductDetails();