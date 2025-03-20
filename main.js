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
    return data.data.products.edges;
  } catch (error) {
    console.error("Помилка при отриманні продуктів:", error);
    return [];
  }
}
function renderProducts(products) {
  const productsContainer = document.getElementById("productsContainer");

  products.forEach(productEdge => {
    const product = productEdge.node;

    const title = product.title || "No Title";
    const description = product.description || "No Description";
    const images = product.images.edges;

    const firstImageUrl = images[0]?.node?.url;
    const secondImageUrl = images[1]?.node?.url;

    const variant = product.variants.edges[0]?.node;
    const price = variant?.price?.amount;
    const currency = variant?.price?.currencyCode;
    const compareAtPrice = variant?.compareAtPrice?.amount;
    const compareAtCurrency = variant?.compareAtPrice?.currencyCode;

    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");

    const img1 = document.createElement("img");
    img1.src = firstImageUrl || "";
    img1.alt = title || "product image";

    const img2 = document.createElement("img");
    img2.src = secondImageUrl || firstImageUrl || "";
    img2.alt = title || "product image";
    img2.classList.add("second");

    imageWrapper.appendChild(img1);
    imageWrapper.appendChild(img2);

    const productInfo = document.createElement("div");
    productInfo.classList.add("product-info");

    const productTitle = document.createElement("h3");
    productTitle.classList.add("product-title");
    productTitle.textContent = title;

    const productDesc = document.createElement("p");
    productDesc.classList.add("product-description");
    productDesc.textContent = description.length > 80
      ? description.slice(0, 80) + "..."
      : description;

    const priceEl = document.createElement("span");
    priceEl.classList.add("product-price");
    if (price && currency) {
      priceEl.textContent = `${price} ${currency}`;
    } else {
      priceEl.textContent = "N/A";
    }

    const comparePriceEl = document.createElement("span");
    comparePriceEl.classList.add("product-compare-price");
    if (compareAtPrice && compareAtCurrency) {
      comparePriceEl.textContent = `${compareAtPrice} ${compareAtCurrency}`;
    }

    productInfo.appendChild(productTitle);
    productInfo.appendChild(productDesc);

    if (compareAtPrice) {
      productInfo.appendChild(comparePriceEl);
    }
    productInfo.appendChild(priceEl);

    productCard.appendChild(imageWrapper);
    productCard.appendChild(productInfo);
    productsContainer.appendChild(productCard);
  });
}


function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const faqRow = item.querySelector(".faq-row");

    faqRow.addEventListener("click", () => {
      if (item.classList.contains("open")) {
        item.classList.remove("open");
      } else {
        faqItems.forEach(i => i.classList.remove("open"));
        item.classList.add("open");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const products = await fetchProducts();
  renderProducts(products);
  initFAQ();
});


