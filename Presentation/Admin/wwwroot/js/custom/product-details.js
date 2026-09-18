document.addEventListener("DOMContentLoaded", function () {
  const previewModal = new bootstrap.Modal(document.getElementById('imagePreviewModal'));
  const modalImg = document.getElementById('modalPreviewTarget');

  // Handle Main Image and Variant click triggers
  document.querySelectorAll('.view-zoom-img').forEach(el => {
    el.addEventListener('click', function () {
      let src = "";
      if (this.tagName === 'IMG') {
        src = this.getAttribute('src');
      } else {
        const childImg = this.querySelector('img');
        if (childImg) src = childImg.getAttribute('src');
      }

      if (src && src !== "#") {
        modalImg.setAttribute('src', src);
        previewModal.show();
      }
    });
  });
});
