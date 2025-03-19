
const query = `
  {
    products(first: 10) {
      edges {
        node {
          title
          description
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
          images(first: 2) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

const storefrontEndpoint = "https://tsodykteststore.myshopify.com/api/2023-01/graphql.json";
const storefrontAccessToken = "7e174585a317d187255660745da44cc7";

// Функція для отримання продуктів
async function fetchProducts() {
  try {
    const response = await fetch(storefrontEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`Помилка в запиті: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // console.log("API response:", data);
    return data.data.products.edges;

  } catch (error) {
    console.error("Помилка при отриманні продуктів:", error);
    return [];
  }
}

// ==================== END: GraphQL Запит до Shopify Storefront API ==================== //


// ==================== START: Функція для відображення продуктів ==================== //
function renderProducts(products) {
  const productsContainer = document.getElementById("productsContainer");


  products.forEach(productEdge => {
    const product = productEdge.node;

    // Отримуємо необхідні дані
    const title = product.title || "No Title";
    const description = product.description || "No Description";
    const images = product.images.edges; // масив з 2 картинок, якщо є



    const firstImageUrl = images[0]?.node?.url;
    const secondImageUrl = images[1]?.node?.url;

    console.log(firstImageUrl)



    const variant = product.variants.edges[0]?.node;
    const price = variant?.price?.amount;
    const currency = variant?.price?.currencyCode;
    const compareAtPrice = variant?.compareAtPrice?.amount;
    const compareAtCurrency = variant?.compareAtPrice?.currencyCode;



    // Створюємо картку товару
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");

    // Перша картинка
    const img1 = document.createElement("img");
    img1.src = firstImageUrl || "";
    img1.alt = title || "product image";

    // Друга картинка (при ховері)
    const img2 = document.createElement("img");
    img2.src = secondImageUrl || firstImageUrl || "";
    img2.alt = title || "product image";
    img2.classList.add("second");

    imageWrapper.appendChild(img1);
    imageWrapper.appendChild(img2);

    const productInfo = document.createElement("div");
    productInfo.classList.add("product-info");

    // Заголовок
    const productTitle = document.createElement("h3");
    productTitle.classList.add("product-title");
    productTitle.textContent = title;

    // Опис
    const productDesc = document.createElement("p");
    productDesc.classList.add("product-description");
    productDesc.textContent = description.length > 80
      ? description.slice(0, 80) + "..."
      : description;



    // Ціна
    const priceEl = document.createElement("span");
    priceEl.classList.add("product-price");
    if (price && currency) {
      priceEl.textContent = `${price} ${currency}`;
    } else {
      priceEl.textContent = "N/A";
    }

    // Compare at Price (стара ціна)
    const comparePriceEl = document.createElement("span");
    comparePriceEl.classList.add("product-compare-price");
    if (compareAtPrice && compareAtCurrency) {
      comparePriceEl.textContent = `${compareAtPrice} ${compareAtCurrency}`;
    }

    productInfo.appendChild(productTitle);
    productInfo.appendChild(productDesc);
    productInfo.appendChild(priceEl);
    if (compareAtPrice) {
      productInfo.appendChild(comparePriceEl);
    }

    productCard.appendChild(imageWrapper);
    productCard.appendChild(productInfo);

    productsContainer.appendChild(productCard);
  });
}
// ==================== END: Функція для відображення продуктів ==================== //


// ==================== START: FAQ Логіка ==================== //
function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question");
    questionBtn.addEventListener("click", () => {
      // Якщо вже розкрите, приховаємо
      if (item.classList.contains("open")) {
        item.classList.remove("open");
      } else {
        // Закриємо всі інші, щоб відкритою була лише одна (необов'язково, залежить від вимог)
        faqItems.forEach(i => i.classList.remove("open"));
        item.classList.add("open");
      }
    });
  });
}
// ==================== END: FAQ Логіка ==================== //


// ==================== START: Ініціалізація при завантаженні сторінки ==================== //
document.addEventListener("DOMContentLoaded", async () => {
  // 1) Отримуємо продукти
  const products = await fetchProducts();

  // 2) Рендеримо товари на сторінці
  renderProducts(products);

  // 3) Ініціалізуємо FAQ
  initFAQ();
});
// ==================== END: Ініціалізація при завантаженні сторінки ==================== //

