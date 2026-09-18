document.addEventListener("DOMContentLoaded", function () {
  const root = document.getElementById("productEditRoot");
  const skuUrl = root.dataset.skuUrl;
  const generateUrl = root.dataset.descriptionUrl;

  const toggleVariants = document.getElementById("toggleVariants");
  const variantSection = document.getElementById("variantCardSection");
  const container = document.getElementById("variantsContainer");
  const addBtn = document.getElementById("addVariantRowBtn");
  const btnAiGenerate = document.getElementById("btnAiGenerate");
  const btnAiGenerateSku = document.getElementById("btnAiGenerateSku");
  const imageFileInput = document.getElementById("imageFileInput");
  const imgPreview = document.getElementById("imgPreview");
  const previewPlaceholder = document.getElementById("previewPlaceholder");

  let variantIndex = container.querySelectorAll(".variant-row").length;

  // --- Live Main Image Preview Switcher ---
  imageFileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imgPreview.setAttribute("src", e.target.result);
        imgPreview.classList.remove("d-none");
        previewPlaceholder.classList.add("d-none");
      }
      reader.readAsDataURL(file);
    }
  });

  // --- Dynamic Inline Row Thumbnail Engine ---
  container.addEventListener("change", function (e) {
    if (e.target.classList.contains("variant-image-input")) {
      const input = e.target;
      const row = input.closest(".variant-row");
      const thumbImg = row.querySelector(".variant-thumb-preview");
      const thumbIcon = row.querySelector(".variant-thumb-icon");

      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          thumbImg.setAttribute("src", event.target.result);
          thumbImg.classList.remove("d-none");
          thumbIcon.classList.add("d-none");
        }
        reader.readAsDataURL(file);
      }
    }
  });

  // Toggle View Visibility
  toggleVariants.addEventListener("change", function () {
    if (this.checked) {
      variantSection.classList.remove("d-none");
      if (container.children.length === 0) {
        addVariantRow();
      }
    } else {
      variantSection.classList.add("d-none");
      container.innerHTML = "";
      variantIndex = 0;
    }
  });

  addBtn.addEventListener("click", function () {
    addVariantRow();
  });

  function addVariantRow() {
    const html = `
            <tr class="variant-row" data-index="${variantIndex}">
                <td>
                    <input type="hidden" name="ProductDetails[${variantIndex}].Id" value="0" />
                    <input name="ProductDetails[${variantIndex}].Size" class="form-control form-control-sm" placeholder="e.g., Large, XL" />
                </td>
                <td>
                    <input name="ProductDetails[${variantIndex}].Color" class="form-control form-control-sm" placeholder="e.g., Red, Blue" />
                </td>
                <td>
                    <input name="ProductDetails[${variantIndex}].Price" class="form-control form-control-sm" type="number" step="0.01" value="0.00" />
                </td>
                <td>
                    <input name="ProductDetails[${variantIndex}].Stock" class="form-control form-control-sm" type="number" value="0" />
                </td>
                <td>
                    <input type="file" name="ProductDetails[${variantIndex}].VariantImageFile" class="form-control form-control-sm variant-image-input" accept="image/*" />
                    <input type="hidden" name="ProductDetails[${variantIndex}].ImageUrl" class="variant-hidden-url" value="" />
                </td>
                <td class="text-center align-middle">
                    <div class="d-flex align-items-center justify-content-center border rounded bg-light mx-auto" style="width: 40px; height: 40px; overflow: hidden;">
                        <img src="#" alt="Thumb" class="img-fluid d-none variant-thumb-preview" style="max-height: 100%; object-fit: cover;" />
                        <i class="bx bx-image text-muted variant-thumb-icon"></i>
                    </div>
                </td>
                <td class="text-center align-middle">
                    <button type="button" class="btn btn-sm btn-icon btn-outline-danger remove-row-btn">
                        <i class="bx bx-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    container.insertAdjacentHTML('beforeend', html);
    variantIndex++;
  }

  container.addEventListener("click", function (e) {
    if (e.target.closest(".remove-row-btn")) {
      e.target.closest(".variant-row").remove();
      reIndexRows();
    }
  });

  function reIndexRows() {
    const rows = container.querySelectorAll(".variant-row");
    variantIndex = 0;
    rows.forEach(function (row) {
      row.setAttribute("data-index", variantIndex);
      row.querySelector('input[name$=".Id"]').setAttribute("name", `ProductDetails[${variantIndex}].Id`);
      row.querySelector('input[name$=".Size"]').setAttribute("name", `ProductDetails[${variantIndex}].Size`);
      row.querySelector('input[name$=".Color"]').setAttribute("name", `ProductDetails[${variantIndex}].Color`);
      row.querySelector('input[name$=".Price"]').setAttribute("name", `ProductDetails[${variantIndex}].Price`);
      row.querySelector('input[name$=".Stock"]').setAttribute("name", `ProductDetails[${variantIndex}].Stock`);
      row.querySelector('input[name$=".VariantImageFile"]').setAttribute("name", `ProductDetails[${variantIndex}].VariantImageFile`);
      row.querySelector('input[name$=".ImageUrl"]').setAttribute("name", `ProductDetails[${variantIndex}].ImageUrl`);
      variantIndex++;
    });
  }

  // Helper function to extract fields securely
  function getProductContext() {
    const productNameInput = document.getElementById("productNameInput");
    const categorySelect = document.getElementById("categorySelectInput");

    if (!productNameInput || !categorySelect) return null;

    const productName = productNameInput.value.trim();
    let categoryName = "";
    if (categorySelect.selectedIndex > 0) {
      categoryName = categorySelect.options[categorySelect.selectedIndex].text;
    }
    return { productName, categoryName };
  }

  // --- SKU AI Generation ---
  btnAiGenerateSku.addEventListener("click", async function () {
    const context = getProductContext();
    if (!context || !context.productName) {
      alert("Pehle Product Name likhein taake AI SKU code bana sakay!");
      return;
    }

    const originalBtnHtml = btnAiGenerateSku.innerHTML;
    btnAiGenerateSku.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span>`;
    btnAiGenerateSku.disabled = true;

    try {
      const response = await fetch(skuUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: context.productName, categoryName: context.categoryName })
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      if (data.success) {
        document.getElementById("productSkuInput").value = data.sku;
      } else {
        alert(data.message || "Failed to generate SKU.");
      }
    } catch (error) {
      console.error("SKU Error:", error);
      alert("SKU endpoint block ya unreachable hy.");
    } finally {
      btnAiGenerateSku.innerHTML = originalBtnHtml;
      btnAiGenerateSku.disabled = false;
    }
  });

  // --- Description AI Generation ---
  btnAiGenerate.addEventListener("click", async function () {
    const context = getProductContext();
    if (!context || !context.productName) {
      alert("Pehle Product Name likhein taake AI description bana sakay!");
      return;
    }

    const originalBtnHtml = btnAiGenerate.innerHTML;
    btnAiGenerate.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Generating...`;
    btnAiGenerate.disabled = true;

    try {
      const response = await fetch(generateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: context.productName, categoryName: context.categoryName })
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      if (data.success) {
        document.getElementById("productDescription").value = data.description;
      } else {
        alert(data.message || "Failed to generate description.");
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("Mistral API backend integration issue.");
    } finally {
      btnAiGenerate.innerHTML = originalBtnHtml;
      btnAiGenerate.disabled = false;
    }
  });
});
