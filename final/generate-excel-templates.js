const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Template 1: Text Details Only
const textDetailsTemplate = {
  headers: [
    'Product Name', 'Title', 'Description', 'Manufacturing Details', 
    'Shipping Returns', 'Regular Price', 'Sale Price', 'Category', 
    'Sub Category', 'Meta Title', 'Meta Description', 'Slug URL'
  ],
  sampleData: [
    [
      'Premium Cotton T-Shirt', 
      'Comfortable Cotton Crew Neck T-Shirt', 
      'Made from 100% premium cotton, this t-shirt offers superior comfort and durability. Perfect for casual wear with a classic fit that suits all body types.', 
      'Manufactured in certified facilities using eco-friendly processes. Pre-shrunk fabric ensures consistent sizing after wash.',
      'Free returns within 30 days. Exchange available for size and color. Return shipping costs covered by seller.',
      '1299',
      '999',
      'Clothing',
      'T-Shirts',
      'Premium Cotton T-Shirt - Comfortable & Durable',
      'Shop premium cotton t-shirts online. 100% cotton, comfortable fit, multiple colors available. Free shipping and easy returns.',
      'premium-cotton-t-shirt'
    ],
    [
      'Designer Casual Jeans',
      'Slim Fit Designer Denim Jeans',
      'Stylish slim-fit jeans crafted from premium denim fabric. Features modern styling with perfect stretch for all-day comfort.',
      'Made from 98% cotton and 2% elastane for optimal stretch. Stone-washed finish for vintage appeal.',
      'Free returns within 30 days. Size exchange available. Please refer to size chart before ordering.',
      '2499',
      '1899',
      'Clothing',
      'Jeans',
      'Designer Slim Fit Jeans - Premium Denim',
      'Buy designer jeans online. Slim fit, premium denim, comfortable stretch. Available in multiple sizes and washes.',
      'designer-casual-jeans'
    ],
    [
      'Formal Dress Shirt',
      'Classic Formal Cotton Dress Shirt',
      'Professional formal shirt perfect for office and business meetings. Made from breathable cotton with wrinkle-resistant finish.',
      'Premium cotton fabric with anti-wrinkle treatment. Machine washable with color-fast guarantee.',
      'Free returns within 30 days. Exchange available for size. Professional dry cleaning recommended.',
      '1899',
      '1499',
      'Clothing',
      'Shirts',
      'Classic Formal Dress Shirt - Professional Wear',
      'Shop formal dress shirts online. Premium cotton, wrinkle-resistant, professional fit. Perfect for office wear.',
      'formal-dress-shirt'
    ]
  ]
};

// Template 2: With Image URLs
const withImagesTemplate = {
  headers: [
    'Product Name', 'Title', 'Description', 'Manufacturing Details', 
    'Shipping Returns', 'Regular Price', 'Sale Price', 'Category', 
    'Sub Category', 'Meta Title', 'Meta Description', 'Slug URL',
    'Image URL 1', 'Image URL 2', 'Image URL 3', 'Image URL 4', 'Image URL 5',
    'Video URL 1', 'Video URL 2'
  ],
  sampleData: [
    [
      'Premium Cotton T-Shirt', 
      'Comfortable Cotton Crew Neck T-Shirt', 
      'Made from 100% premium cotton, this t-shirt offers superior comfort and durability. Perfect for casual wear with a classic fit that suits all body types.', 
      'Manufactured in certified facilities using eco-friendly processes. Pre-shrunk fabric ensures consistent sizing after wash.',
      'Free returns within 30 days. Exchange available for size and color. Return shipping costs covered by seller.',
      '1299',
      '999',
      'Clothing',
      'T-Shirts',
      'Premium Cotton T-Shirt - Comfortable & Durable',
      'Shop premium cotton t-shirts online. 100% cotton, comfortable fit, multiple colors available. Free shipping and easy returns.',
      'premium-cotton-t-shirt',
      'https://example.com/images/tshirt-front.jpg',
      'https://example.com/images/tshirt-back.jpg',
      'https://example.com/images/tshirt-side.jpg',
      'https://example.com/images/tshirt-detail.jpg',
      'https://example.com/images/tshirt-model.jpg',
      'https://example.com/videos/tshirt-showcase.mp4',
      ''
    ],
    [
      'Designer Casual Jeans',
      'Slim Fit Designer Denim Jeans',
      'Stylish slim-fit jeans crafted from premium denim fabric. Features modern styling with perfect stretch for all-day comfort.',
      'Made from 98% cotton and 2% elastane for optimal stretch. Stone-washed finish for vintage appeal.',
      'Free returns within 30 days. Size exchange available. Please refer to size chart before ordering.',
      '2499',
      '1899',
      'Clothing',
      'Jeans',
      'Designer Slim Fit Jeans - Premium Denim',
      'Buy designer jeans online. Slim fit, premium denim, comfortable stretch. Available in multiple sizes and washes.',
      'designer-casual-jeans',
      'https://example.com/images/jeans-front.jpg',
      'https://example.com/images/jeans-back.jpg',
      'https://example.com/images/jeans-side.jpg',
      'https://example.com/images/jeans-pocket-detail.jpg',
      'https://example.com/images/jeans-model.jpg',
      'https://example.com/videos/jeans-fit-guide.mp4',
      'https://example.com/videos/jeans-styling.mp4'
    ]
  ]
};

// Template 3: With Size and Stock Information
const withSizeStockTemplate = {
  headers: [
    'Product Name', 'Title', 'Description', 'Manufacturing Details', 
    'Shipping Returns', 'Regular Price', 'Sale Price', 'Category', 
    'Sub Category', 'Meta Title', 'Meta Description', 'Slug URL',
    'Size', 'Quantity', 'HSN Code', 'SKU', 'Barcode',
    'Amazon Price', 'Flipkart Price', 'Myntra Price', 'Nykaa Price', 'Yoraa Price',
    'Image URL 1', 'Image URL 2', 'Image URL 3', 'Video URL 1'
  ],
  sampleData: [
    [
      'Premium Cotton T-Shirt', 
      'Comfortable Cotton Crew Neck T-Shirt', 
      'Made from 100% premium cotton, this t-shirt offers superior comfort and durability.', 
      'Manufactured in certified facilities using eco-friendly processes.',
      'Free returns within 30 days. Exchange available for size and color.',
      '1299',
      '999',
      'Clothing',
      'T-Shirts',
      'Premium Cotton T-Shirt - Comfortable & Durable',
      'Shop premium cotton t-shirts online. 100% cotton, comfortable fit.',
      'premium-cotton-t-shirt',
      'S',
      '50',
      '61099090',
      'TSHIRT-COTTON-S-001',
      '1234567890123',
      '1299',
      '1199',
      '1149',
      '1099',
      '999',
      'https://example.com/images/tshirt-s-front.jpg',
      'https://example.com/images/tshirt-s-back.jpg',
      'https://example.com/images/tshirt-s-model.jpg',
      'https://example.com/videos/tshirt-size-guide.mp4'
    ],
    [
      'Premium Cotton T-Shirt', 
      'Comfortable Cotton Crew Neck T-Shirt', 
      'Made from 100% premium cotton, this t-shirt offers superior comfort and durability.', 
      'Manufactured in certified facilities using eco-friendly processes.',
      'Free returns within 30 days. Exchange available for size and color.',
      '1299',
      '999',
      'Clothing',
      'T-Shirts',
      'Premium Cotton T-Shirt - Comfortable & Durable',
      'Shop premium cotton t-shirts online. 100% cotton, comfortable fit.',
      'premium-cotton-t-shirt',
      'M',
      '75',
      '61099090',
      'TSHIRT-COTTON-M-001',
      '1234567890124',
      '1299',
      '1199',
      '1149',
      '1099',
      '999',
      'https://example.com/images/tshirt-m-front.jpg',
      'https://example.com/images/tshirt-m-back.jpg',
      'https://example.com/images/tshirt-m-model.jpg',
      'https://example.com/videos/tshirt-size-guide.mp4'
    ],
    [
      'Premium Cotton T-Shirt', 
      'Comfortable Cotton Crew Neck T-Shirt', 
      'Made from 100% premium cotton, this t-shirt offers superior comfort and durability.', 
      'Manufactured in certified facilities using eco-friendly processes.',
      'Free returns within 30 days. Exchange available for size and color.',
      '1299',
      '999',
      'Clothing',
      'T-Shirts',
      'Premium Cotton T-Shirt - Comfortable & Durable',
      'Shop premium cotton t-shirts online. 100% cotton, comfortable fit.',
      'premium-cotton-t-shirt',
      'L',
      '100',
      '61099090',
      'TSHIRT-COTTON-L-001',
      '1234567890125',
      '1299',
      '1199',
      '1149',
      '1099',
      '999',
      'https://example.com/images/tshirt-l-front.jpg',
      'https://example.com/images/tshirt-l-back.jpg',
      'https://example.com/images/tshirt-l-model.jpg',
      'https://example.com/videos/tshirt-size-guide.mp4'
    ]
  ]
};

// Instructions sheet data
const instructionsData = [
  ['BULK UPLOAD INSTRUCTIONS', '', '', ''],
  ['', '', '', ''],
  ['Template Types:', '', '', ''],
  ['1. Text Details Only', 'Basic product information without images', '', ''],
  ['2. With Image URLs', 'Product information with image and video URLs', '', ''],
  ['3. With Size & Stock', 'Complete product data including inventory', '', ''],
  ['', '', '', ''],
  ['Field Descriptions:', '', '', ''],
  ['Product Name', 'The main product name (e.g., Premium Cotton T-Shirt)', '', ''],
  ['Title', 'Product title for display (e.g., Comfortable Cotton Crew Neck)', '', ''],
  ['Description', 'Detailed product description (min 50 characters)', '', ''],
  ['Manufacturing Details', 'Information about how the product is made', '', ''],
  ['Shipping Returns', 'Return and exchange policy details', '', ''],
  ['Regular Price', 'Original price in numbers only (e.g., 1299)', '', ''],
  ['Sale Price', 'Discounted price in numbers only (e.g., 999)', '', ''],
  ['Category', 'Main product category (e.g., Clothing)', '', ''],
  ['Sub Category', 'Product subcategory (e.g., T-Shirts)', '', ''],
  ['Meta Title', 'SEO title for search engines', '', ''],
  ['Meta Description', 'SEO description for search engines', '', ''],
  ['Slug URL', 'URL-friendly product identifier', '', ''],
  ['', '', '', ''],
  ['Image/Video URLs:', '', '', ''],
  ['Image URL 1-5', 'Direct links to product images (JPG, PNG)', '', ''],
  ['Video URL 1-2', 'Direct links to product videos (MP4)', '', ''],
  ['', '', '', ''],
  ['Size & Stock Fields:', '', '', ''],
  ['Size', 'Product size (S, M, L, XL, etc.)', '', ''],
  ['Quantity', 'Available stock quantity', '', ''],
  ['HSN Code', 'Harmonized System of Nomenclature code', '', ''],
  ['SKU', 'Stock Keeping Unit identifier', '', ''],
  ['Barcode', 'Product barcode number', '', ''],
  ['Platform Prices', 'Specific prices for different platforms', '', ''],
  ['', '', '', ''],
  ['Important Notes:', '', '', ''],
  ['• All price fields should contain numbers only', '', '', ''],
  ['• URLs must be valid and accessible', '', '', ''],
  ['• For multiple sizes, create separate rows', '', '', ''],
  ['• Required fields: Product Name, Title, Description', '', '', ''],
  ['• Images are optional but recommended', '', '', ''],
  ['• Keep descriptions under 500 characters', '', '', '']
];

function createWorkbook(templateData, sheetName) {
  const wb = XLSX.utils.book_new();
  
  // Create main data sheet
  const wsData = [templateData.headers, ...templateData.sampleData];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Set column widths
  const colWidths = templateData.headers.map(header => {
    if (header.includes('Description') || header.includes('Details')) return { wch: 50 };
    if (header.includes('URL')) return { wch: 40 };
    if (header.includes('Meta')) return { wch: 30 };
    return { wch: 20 };
  });
  ws['!cols'] = colWidths;
  
  // Add data sheet
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Create instructions sheet
  const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsData);
  wsInstructions['!cols'] = [{ wch: 25 }, { wch: 50 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');
  
  return wb;
}

// Generate the Excel files
const outputDir = path.join(__dirname, 'excel-templates');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate Text Details Only template
const textOnlyWb = createWorkbook(textDetailsTemplate, 'Text Details');
XLSX.writeFile(textOnlyWb, path.join(outputDir, 'Product_Text_Details_Template.xlsx'));
console.log('✅ Generated: Product_Text_Details_Template.xlsx');

// Generate With Images template
const withImagesWb = createWorkbook(withImagesTemplate, 'With Images');
XLSX.writeFile(withImagesWb, path.join(outputDir, 'Product_With_Images_Template.xlsx'));
console.log('✅ Generated: Product_With_Images_Template.xlsx');

// Generate With Size & Stock template
const withSizeStockWb = createWorkbook(withSizeStockTemplate, 'Size & Stock');
XLSX.writeFile(withSizeStockWb, path.join(outputDir, 'Product_Complete_Template.xlsx'));
console.log('✅ Generated: Product_Complete_Template.xlsx');

console.log('\n📁 All Excel templates generated in:', outputDir);
console.log('\n📋 Templates created:');
console.log('1. Product_Text_Details_Template.xlsx - Basic product info');
console.log('2. Product_With_Images_Template.xlsx - With image/video URLs');
console.log('3. Product_Complete_Template.xlsx - Complete with sizes/stock');
console.log('\n🎯 Each file includes:');
console.log('• Sample data showing the correct format');
console.log('• Instructions sheet with field explanations');
console.log('• Proper column formatting');
