// الهيكلة الجديدة: كل عنصر هو "موديل" رئيسي يحتوي على مصفوفة "variants" للألوان والمقاسات
const products = [
    {
        id: 1,
        name: "حذاء الجري فائق السرعة",
        price: 189.50, // هذا سعر الموديل الأساسي
        description: "تصميم خفيف الوزن بأحدث تقنيات امتصاص الصدمات، مثالي للماراثون.",
        // الموديل الأساسي يستخدم صورة واحدة هنا
        imageUrl: "images/reb1 (1).jpeg", 
        
        // مصفوفة الأصناف (الـ Variants): الألوان والمقاسات المتوفرة
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
            // تم تصحيح الأخطاء التركيبية هنا (تم وضع الفواصل وتجنب التكرار إذا كان اللون هو نفسه)
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
// دالة العرض (renderProducts) - تم تعديل الزر ليصبح رابطاً
// ----------------------------------------------------------------------

const productsContainer = document.getElementById('products-container');
const searchInput = document.getElementById('search-input');

function renderProducts(itemsToRender = products) {
    productsContainer.innerHTML = '';
    
    itemsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // الزر الآن ينقلك إلى صفحة التفاصيل مع تمرير الـ ID عبر الرابط (URL)
        card.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <span class="price">${product.price.toFixed(2)} ر.س</span>
            <a href="product-details.html?id=${product.id}" class="view-variants-btn">
                عرض ${product.variants.length} ألوان ومقاسات
            </a>
        `;
        
        productsContainer.appendChild(card);
    });
    
    // لم نعد بحاجة لربط حدث النقر، لأننا نستخدم وسم <a>
}

// ----------------------------------------------------------------------
// منطق البحث (Search Logic) - تم تبسيطه ليصبح في نهاية الملف
// ----------------------------------------------------------------------
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm);
    });
    
    renderProducts(filteredProducts);
});


// التشغيل الأولي: عرض كل المنتجات عند تحميل الصفحة
renderProducts();