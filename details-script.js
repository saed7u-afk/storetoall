// نفس بيانات المنتجات التي في script.js، يجب تكرارها هنا
// (لأن هذه صفحة منفصلة ولا ترى المتغيرات في script.js)
const products = [
    {
        id: 1,
        name: "حذاء الجري فائق السرعة",
        price: 189.50,
        description: "تصميم خفيف الوزن بأحدث تقنيات امتصاص الصدمات، مثالي للماراثون.",
        imageUrl: "images/reb1 (1).jpeg", 
        variants: [
            { color: "أبيض/رمادي", sizes: ["40", "41", "42", "43"], variant_image: "images/reb1 (1).jpeg" },
            { color: "أسود/أحمر", sizes: ["41", "42", "44"], variant_image: "images/reb1 (2).jpeg" },
            { color: "أزرق فاتح", sizes: ["40", "43"], variant_image: "images/reb1 (3).jpeg" }
        ]
    },
    {
        id: 2,
        name: "حذاء رياضي كلاسيكي V9",
        price: 99.99,
        description: "الحذاء الأيقوني المريح، أساسي لكل إطلالة يومية.",
        imageUrl: "images/reb1 (4).jpeg", 
        variants: [
            { color: "أبيض ناصع", sizes: ["38", "39", "40", "41", "42"], variant_image: "images/c270a.jpeg" },
            { color: "أخضر زيتوني", sizes: ["39", "41", "43"], variant_image: "images/c270b.jpeg" },
            { color: "أخضر زيتوني", sizes: ["39", "41", "43"], variant_image: "images/c270d.jpeg" },
            { color: "أخضر زيتوني", sizes: ["39", "41", "43"], variant_image: "images/c270c.jpeg" },
        ]
    },
    // أضف أي موديلات أخرى لديك هنا بنفس الهيكلة...
];

const detailsContainer = document.getElementById('details-container');

function renderProductDetails() {
    // 1. استخراج رقم المنتج (ID) من رابط الصفحة (URL)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // 2. البحث عن المنتج في مصفوفة المنتجات
    const product = products.find(p => p.id === productId);

    if (!product) {
        detailsContainer.innerHTML = '<h1>عذراً، المنتج غير موجود.</h1>';
        return;
    }

    // 3. بناء محتوى الصفحة
    let variantsHTML = '';
    
    product.variants.forEach(variant => {
        // إنشاء قائمة المقاسات المتاحة
        const sizesList = variant.sizes.map(size => `<span class="size-chip">${size}</span>`).join('');

        variantsHTML += `
            <div class="variant-card">
                <img src="${variant.variant_image}" alt="${product.name} - ${variant.color}" class="variant-img-large">
                <div class="variant-info">
                    <h3>اللون: ${variant.color}</h3>
                    <p class="variant-price">${product.price.toFixed(2)} ر.س</p>
                    <p>المقاسات المتاحة:</p>
                    <div class="sizes-container">${sizesList}</div>
                    <button class="add-to-cart-btn">أضف للسلة</button>
                </div>
            </div>
            <hr>
        `;
    });

    // إضافة العنوان الرئيسي والوصف
    detailsContainer.innerHTML = `
        <div class="product-header">
            <h1>${product.name}</h1>
            <p>${product.description}</p>
        </div>
        <div class="variants-grid">
            ${variantsHTML}
        </div>
    `;
}

// تشغيل وظيفة عرض التفاصيل عند تحميل الصفحة
renderProductDetails();