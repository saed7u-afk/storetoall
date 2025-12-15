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

const detailsContainer = document.getElementById('details-container');
let selectedSize = {}; 

function renderProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);

    if (!product) {
        detailsContainer.innerHTML = '<h1>عذراً، المنتج غير موجود.</h1>';
        return;
    }

    let variantsHTML = '';
    
    product.variants.forEach((variant, index) => {
        const uniqueId = `${productId}-${index}`;
        
        const sizesList = variant.sizes.map(size => 
            `<span class="size-chip" data-size="${size}" data-unique-id="${uniqueId}">${size}</span>`
        ).join('');

        variantsHTML += `
            <div class="variant-card">
                <img src="${variant.variant_image}" alt="${product.name} - ${variant.color}" class="variant-img-large">
                <div class="variant-info">
                    <h3>اللون: ${variant.color}</h3>
                    <p class="variant-price">${product.price.toFixed(2)} ر.س</p>
                    <p>المقاسات المتاحة:</p>
                    <div class="sizes-container">${sizesList}</div>
                    
                    <button class="add-to-cart-btn" data-unique-id="${uniqueId}" disabled>أضف للسلة</button>
                    <p class="selection-message" id="msg-${uniqueId}"></p> 
                </div>
            </div>
            <hr>
        `;
    });

    detailsContainer.innerHTML = `
        <div class="product-header">
            <h1>${product.name}</h1>
            <p>${product.description}</p>
        </div>
        <div class="variants-grid">
            ${variantsHTML}
        </div>
    `;
    
    document.querySelectorAll('.size-chip').forEach(chip => {
        chip.addEventListener('click', handleSizeSelection);
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function handleSizeSelection(e) {
    const chip = e.target;
    const size = chip.getAttribute('data-size');
    const uniqueId = chip.getAttribute('data-unique-id');
    
    document.querySelectorAll(`[data-unique-id="${uniqueId}"]`).forEach(c => {
        c.classList.remove('selected');
    });

    chip.classList.add('selected');

    const addButton = document.querySelector(`.add-to-cart-btn[data-unique-id="${uniqueId}"]`);
    const message = document.getElementById(`msg-${uniqueId}`);
    
    if (addButton) {
        addButton.disabled = false;
    }
    if (message) {
         message.textContent = `تم اختيار مقاس ${size}.`;
    }

    selectedSize[uniqueId] = size;
}

function addToCart(e) {
    const button = e.target;
    const uniqueId = button.getAttribute('data-unique-id');
    const [productIdStr, variantIndexStr] = uniqueId.split('-');
    const productId = parseInt(productIdStr);
    const variantIndex = parseInt(variantIndexStr);

    const size = selectedSize[uniqueId];

    if (!size) {
        alert("الرجاء اختيار مقاس أولاً!");
        return;
    }

    const product = products.find(p => p.id === productId);
    const variant = product.variants[variantIndex];

    const itemId = `${uniqueId}-${size}`;
    
    const item = {
        id: itemId,
        productId: productId,
        name: `${product.name} (${variant.color})`,
        price: product.price,
        size: size,
        image: variant.variant_image,
        quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const existingItem = cart.find(i => i.id === itemId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(item);
    }

    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    
    alert(`تم إضافة ${item.name} مقاس ${item.size} إلى السلة!`);
    
    button.disabled = true;
    const message = document.getElementById(`msg-${uniqueId}`);
    if (message) {
        message.textContent = '';
    }
    document.querySelectorAll(`[data-unique-id="${uniqueId}"]`).forEach(c => c.classList.remove('selected'));
    delete selectedSize[uniqueId]; 
}

renderProductDetails();