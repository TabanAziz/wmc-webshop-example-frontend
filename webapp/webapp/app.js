document.querySelector("#btnLoadProducts").addEventListener("click", async () => {
  const minPrice = document.querySelector("#minPrice").value;
  const maxPrice = document.querySelector("#maxPrice").value;
  const nameSearch = document.querySelector("#nameSearch").value;
  let url = `http://localhost:3000/api/products`;

  const params = new URLSearchParams();
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (nameSearch) params.append("name", nameSearch);
  if (params.toString()) url += `?${params.toString()}`;

  try {
    const response = await fetch(url);
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
});

document.getElementById("createProductForm").addEventListener("submit", async function (event) {
  event.preventDefault();
  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert("Product created successfully!");
      this.reset();
      document.querySelector("#btnLoadProducts").click();
    } else {
      alert("Failed to create product.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while creating the product.");
  }
});

function displayProducts(products) {
  const productsList = document.getElementById("productsList");
  productsList.innerHTML = "";

  if (products.length === 0) {
    const noProductsItem = document.createElement("li");
    noProductsItem.classList.add("list-group-item");
    noProductsItem.textContent = "No Products found.";
    productsList.appendChild(noProductsItem);
    return;
  }

  products.forEach((product) => {
    const productItem = document.createElement("li");
    productItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    productItem.innerHTML = `
      <div>
        <strong>${product.name}</strong> - ${product.price}€ <br />
        ${product.description}
      </div>
      <button class="btn btn-danger btn-sm delete-btn" data-id="${product.id}">Delete</button>
    `;
    productsList.appendChild(productItem);
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const productId = e.target.getAttribute("data-id");
      await deleteProduct(productId);
    });
  });
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`, { method: "DELETE" });
    if (response.ok) {
      alert("Product deleted successfully!");
      document.querySelector("#btnLoadProducts").click();
    } else {
      alert("Failed to delete product.");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}
