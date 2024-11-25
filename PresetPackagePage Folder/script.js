document.getElementById('country').addEventListener('change', function() { // When the country select element changes, run this function
  var flag = document.getElementById('flag'); // Get the flag image element
  var selectedCountry = this.value; // Get the selected country
  if (selectedCountry === 'canada') { // If the selected country is Canada set the flag image to the Canada flag
      flag.src = '../PresetPackagePage Folder/Images/canada.jpg'; 
  } else if (selectedCountry === 'usa') { // If the selected country is USA set the flag image to the USA flag
      flag.src = '../PresetPackagePage Folder/Images/usa.jpg';
  } else if (selectedCountry === 'uk') { // If the selected country is UK set the flag image to the UK flag
      flag.src = '../PresetPackagePage Folder/Images/uk.jpg';
  }
});

document.getElementById('computer-category').addEventListener('change', function() { // When the computer category select element changes, run this function
  var selectedCategory = this.value;  // Get the selected category
  var prebuiltProducts = document.querySelectorAll('.product#prebuilt'); // Get all the prebuilt products
  var laptopProducts = document.querySelectorAll('.product#laptop'); // Get all the laptop products

  if (selectedCategory === 'all') { // If the selected category is all, show all the products
      prebuiltProducts.forEach(function(product) {
          product.style.display = 'block';
      });
      laptopProducts.forEach(function(product) {
          product.style.display = 'block';
      });
  } else if (selectedCategory === 'prebuilt') { // If the selected category is prebuilt, show only the prebuilt products
      prebuiltProducts.forEach(function(product) {
          product.style.display = 'block';
      });
      laptopProducts.forEach(function(product) {
          product.style.display = 'none';
      });
  } else if (selectedCategory === 'laptop') { // If the selected category is laptop, show only the laptop products
      prebuiltProducts.forEach(function(product) {
          product.style.display = 'none';
      });
      laptopProducts.forEach(function(product) {
          product.style.display = 'block';
      });
  }
});