const XLSX = require('xlsx');

// Generate clean, practical Excel templates (like the image shown)
const generateCleanTemplates = () => {
  
  // Define all headers based on SingleProductUpload.jsx
  const allHeaders = [
    'Product Name',
    'Title', 
    'Description',
    'Manufacturing Details',
    'Shipping Returns',
    'Regular Price',
    'Sale Price',
    'Category',
    'Subcategory',
    'Meta Title',
    'Meta Description',
    'Slug URL',
    'Color Filter',
    'Size Filter', 
    'Brand Filter',
    'Material Filter',
    'Style Filter',
    'Gender Filter',
    'Season Filter',
    'Stock Size Option',
    'Custom Sizes (JSON)',
    'Common CM Chart URL',
    'Common Inch Chart URL', 
    'Common Measurement Guide URL',
    'You Might Also Like',
    'Similar Items',
    'Others Also Bought',
    'Image URLs (JSON)',
    'Video URLs (JSON)',
    'Returnable',
    'HSN Code',
    'Default SKU',
    'Default Barcode'
  ];

  // Text-only headers (no image/video URLs)
  const textOnlyHeaders = allHeaders.filter(header => 
    !header.includes('Image URLs') && !header.includes('Video URLs')
  );

  // Simple headers (basic fields only)
  const simpleHeaders = [
    'Product Name',
    'Title',
    'Description', 
    'Regular Price',
    'Sale Price',
    'Category',
    'Subcategory',
    'Color Filter',
    'Size Filter',
    'Brand Filter',
    'Returnable'
  ];

  // Sample data rows for reference
  const sampleDataComplete = [
    {
      'Product Name': 'Premium Cotton T-Shirt',
      'Title': 'Premium Cotton T-Shirt - Comfortable Fit',
      'Description': 'High-quality 100% cotton t-shirt with comfortable fit and premium fabric. Perfect for casual wear.',
      'Manufacturing Details': 'Made from premium cotton fabric, pre-shrunk, color-fast, machine washable at 30°C',
      'Shipping Returns': '7-day return policy, free shipping above $50, hassle-free returns',
      'Regular Price': 29.99,
      'Sale Price': 24.99,
      'Category': 'Clothing',
      'Subcategory': 'T-Shirts',
      'Meta Title': 'Premium Cotton T-Shirt | Comfortable Fit | YoraaFashion',
      'Meta Description': 'Shop premium cotton t-shirts with comfortable fit. High-quality fabric, various colors available.',
      'Slug URL': 'premium-cotton-t-shirt-comfortable-fit',
      'Color Filter': 'Blue,Red,White,Black',
      'Size Filter': 'S,M,L,XL,XXL',
      'Brand Filter': 'YoraaFashion',
      'Material Filter': 'Cotton',
      'Style Filter': 'Casual',
      'Gender Filter': 'Unisex',
      'Season Filter': 'All Season',
      'Stock Size Option': 'sizes',
      'Custom Sizes (JSON)': '[{"size":"S","quantity":"10","hsnCode":"6109","sku":"TS001S","barcode":"123456789","prices":{"amazon":"25","flipkart":"24","myntra":"26","nykaa":"25","yoraa":"24"}},{"size":"M","quantity":"15","hsnCode":"6109","sku":"TS001M","barcode":"123456790","prices":{"amazon":"25","flipkart":"24","myntra":"26","nykaa":"25","yoraa":"24"}}]',
      'Common CM Chart URL': 'https://example.com/size-chart-cm.jpg',
      'Common Inch Chart URL': 'https://example.com/size-chart-inch.jpg',
      'Common Measurement Guide URL': 'https://example.com/measurement-guide.jpg',
      'You Might Also Like': 'yes',
      'Similar Items': 'yes',
      'Others Also Bought': 'no',
      'Image URLs (JSON)': '["https://example.com/tshirt-blue-front.jpg","https://example.com/tshirt-blue-back.jpg"]',
      'Video URLs (JSON)': '["https://example.com/tshirt-demo.mp4"]',
      'Returnable': 'yes',
      'HSN Code': '6109',
      'Default SKU': 'TS001',
      'Default Barcode': '1234567890123'
    },
    {
      'Product Name': 'Designer Casual Jeans',
      'Title': 'Slim Fit Designer Denim Jeans',
      'Description': 'Stylish slim-fit jeans made from premium denim fabric. Features modern cut and comfortable stretch.',
      'Manufacturing Details': 'Made from 98% cotton and 2% elastane for optimal stretch. Stone washed finish.',
      'Shipping Returns': 'Free returns within 30 days, size exchange available',
      'Regular Price': 79.99,
      'Sale Price': 59.99,
      'Category': 'Clothing',
      'Subcategory': 'Jeans',
      'Meta Title': 'Designer Casual Jeans - Slim Fit | YoraaFashion',
      'Meta Description': 'Premium denim jeans with modern slim fit. Comfortable stretch fabric, stone washed finish.',
      'Slug URL': 'designer-casual-jeans-slim-fit',
      'Color Filter': 'Blue,Black,Grey',
      'Size Filter': '28,30,32,34,36,38',
      'Brand Filter': 'YoraaFashion',
      'Material Filter': 'Denim',
      'Style Filter': 'Casual',
      'Gender Filter': 'Men',
      'Season Filter': 'All Season',
      'Stock Size Option': 'sizes',
      'Custom Sizes (JSON)': '[{"size":"30","quantity":"8","hsnCode":"6203","sku":"DJ001-30","barcode":"223456789","prices":{"amazon":"65","flipkart":"62","myntra":"68","nykaa":"64","yoraa":"59"}},{"size":"32","quantity":"12","hsnCode":"6203","sku":"DJ001-32","barcode":"223456790","prices":{"amazon":"65","flipkart":"62","myntra":"68","nykaa":"64","yoraa":"59"}}]',
      'Common CM Chart URL': 'https://example.com/jeans-size-chart-cm.jpg',
      'Common Inch Chart URL': 'https://example.com/jeans-size-chart-inch.jpg',
      'Common Measurement Guide URL': 'https://example.com/jeans-measurement-guide.jpg',
      'You Might Also Like': 'yes',
      'Similar Items': 'no',
      'Others Also Bought': 'yes',
      'Image URLs (JSON)': '["https://example.com/jeans-blue-front.jpg","https://example.com/jeans-blue-back.jpg"]',
      'Video URLs (JSON)': '[]',
      'Returnable': 'yes',
      'HSN Code': '6203',
      'Default SKU': 'DJ001',
      'Default Barcode': '2234567890123'
    },
    {
      'Product Name': 'Formal Dress Shirt',
      'Title': 'Classic Formal Cotton Dress Shirt',
      'Description': 'Professional formal shirt perfect for office and business meetings. Premium cotton fabric with anti-wrinkle treatment.',
      'Manufacturing Details': 'Machine washable, wrinkle-resistant finish, mother-of-pearl buttons',
      'Shipping Returns': 'Free returns within 30 days',
      'Regular Price': 49.99,
      'Sale Price': 39.99,
      'Category': 'Clothing',
      'Subcategory': 'Shirts',
      'Meta Title': 'Formal Dress Shirt - Classic Cotton | YoraaFashion',
      'Meta Description': 'Professional formal shirts for business. Premium cotton, anti-wrinkle, comfortable fit.',
      'Slug URL': 'formal-dress-shirt-classic-cotton',
      'Color Filter': 'White,Blue,Light Blue',
      'Size Filter': 'S,M,L,XL,XXL',
      'Brand Filter': 'YoraaFashion',
      'Material Filter': 'Cotton',
      'Style Filter': 'Formal',
      'Gender Filter': 'Men',
      'Season Filter': 'All Season',
      'Stock Size Option': 'sizes',
      'Custom Sizes (JSON)': '[{"size":"M","quantity":"20","hsnCode":"6205","sku":"FS001M","barcode":"323456789","prices":{"amazon":"42","flipkart":"40","myntra":"45","nykaa":"41","yoraa":"39"}},{"size":"L","quantity":"25","hsnCode":"6205","sku":"FS001L","barcode":"323456790","prices":{"amazon":"42","flipkart":"40","myntra":"45","nykaa":"41","yoraa":"39"}}]',
      'Common CM Chart URL': 'https://example.com/shirt-size-chart-cm.jpg',
      'Common Inch Chart URL': 'https://example.com/shirt-size-chart-inch.jpg',
      'Common Measurement Guide URL': 'https://example.com/shirt-measurement-guide.jpg',
      'You Might Also Like': 'yes',
      'Similar Items': 'yes',
      'Others Also Bought': 'no',
      'Image URLs (JSON)': '["https://example.com/shirt-white-front.jpg","https://example.com/shirt-white-back.jpg"]',
      'Video URLs (JSON)': '[]',
      'Returnable': 'yes',
      'HSN Code': '6205',
      'Default SKU': 'FS001',
      'Default Barcode': '3234567890123'
    }
  ];

  // Filter sample data for text-only and simple templates
  const sampleDataTextOnly = sampleDataComplete.map(item => {
    const filtered = {};
    textOnlyHeaders.forEach(header => {
      if (item[header] !== undefined) {
        filtered[header] = item[header];
      }
    });
    return filtered;
  });

  const sampleDataSimple = sampleDataComplete.map(item => {
    const filtered = {};
    simpleHeaders.forEach(header => {
      if (item[header] !== undefined) {
        filtered[header] = item[header];
      }
    });
    return filtered;
  });

  return {
    allHeaders,
    textOnlyHeaders,
    simpleHeaders,
    sampleDataComplete,
    sampleDataTextOnly,
    sampleDataSimple
  };
};

// Create clean Excel files (like the image format)
const createCleanExcelFiles = () => {
  const {
    allHeaders,
    textOnlyHeaders, 
    simpleHeaders,
    sampleDataComplete,
    sampleDataTextOnly,
    sampleDataSimple
  } = generateCleanTemplates();

  console.log('🚀 Creating clean Excel templates...');

  // 1. Complete Template
  const completeWB = XLSX.utils.book_new();
  
  // Create worksheet with headers and sample data
  const completeWS = XLSX.utils.json_to_sheet(sampleDataComplete);
  XLSX.utils.book_append_sheet(completeWB, completeWS, 'Product Data');
  
  XLSX.writeFile(completeWB, 'excel-templates/Product_Complete_Template_Clean.xlsx');
  console.log('✅ Created: Product_Complete_Template_Clean.xlsx');

  // 2. Text Details Template
  const textOnlyWB = XLSX.utils.book_new();
  const textOnlyWS = XLSX.utils.json_to_sheet(sampleDataTextOnly);
  XLSX.utils.book_append_sheet(textOnlyWB, textOnlyWS, 'Product Data');
  
  XLSX.writeFile(textOnlyWB, 'excel-templates/Product_Text_Details_Template_Clean.xlsx');
  console.log('✅ Created: Product_Text_Details_Template_Clean.xlsx');

  // 3. With Images Template (same as complete)
  const withImagesWB = XLSX.utils.book_new();
  const withImagesWS = XLSX.utils.json_to_sheet(sampleDataComplete);
  XLSX.utils.book_append_sheet(withImagesWB, withImagesWS, 'Product Data');
  
  XLSX.writeFile(withImagesWB, 'excel-templates/Product_With_Images_Template_Clean.xlsx');
  console.log('✅ Created: Product_With_Images_Template_Clean.xlsx');

  // 4. Simple Template
  const simpleWB = XLSX.utils.book_new();
  const simpleWS = XLSX.utils.json_to_sheet(sampleDataSimple);
  XLSX.utils.book_append_sheet(simpleWB, simpleWS, 'Product Data');
  
  XLSX.writeFile(simpleWB, 'excel-templates/Product_Simple_Template_Clean.xlsx');
  console.log('✅ Created: Product_Simple_Template_Clean.xlsx');

  // 5. Empty templates (headers only + one example row for reference)
  
  // Empty Complete Template
  const emptyCompleteData = [sampleDataComplete[0]]; // Just one example
  const emptyCompleteWB = XLSX.utils.book_new();
  const emptyCompleteWS = XLSX.utils.json_to_sheet(emptyCompleteData);
  XLSX.utils.book_append_sheet(emptyCompleteWB, emptyCompleteWS, 'Product Data');
  
  XLSX.writeFile(emptyCompleteWB, 'excel-templates/Product_Complete_Template_Empty.xlsx');
  console.log('✅ Created: Product_Complete_Template_Empty.xlsx');

  // Empty Text Only Template
  const emptyTextOnlyData = [sampleDataTextOnly[0]]; // Just one example
  const emptyTextOnlyWB = XLSX.utils.book_new();
  const emptyTextOnlyWS = XLSX.utils.json_to_sheet(emptyTextOnlyData);
  XLSX.utils.book_append_sheet(emptyTextOnlyWB, emptyTextOnlyWS, 'Product Data');
  
  XLSX.writeFile(emptyTextOnlyWB, 'excel-templates/Product_Text_Details_Template_Empty.xlsx');
  console.log('✅ Created: Product_Text_Details_Template_Empty.xlsx');

  // Empty Simple Template
  const emptySimpleData = [sampleDataSimple[0]]; // Just one example
  const emptySimpleWB = XLSX.utils.book_new();
  const emptySimpleWS = XLSX.utils.json_to_sheet(emptySimpleData);
  XLSX.utils.book_append_sheet(emptySimpleWB, emptySimpleWS, 'Product Data');
  
  XLSX.writeFile(emptySimpleWB, 'excel-templates/Product_Simple_Template_Empty.xlsx');
  console.log('✅ Created: Product_Simple_Template_Empty.xlsx');

  console.log('\n🎉 Clean Excel templates created successfully!');
  console.log('\n📋 Available Templates:');
  console.log('1. Product_Complete_Template_Clean.xlsx - All fields with 3 sample products');
  console.log('2. Product_Text_Details_Template_Clean.xlsx - Text fields only with samples');
  console.log('3. Product_With_Images_Template_Clean.xlsx - All fields including images');
  console.log('4. Product_Simple_Template_Clean.xlsx - Basic fields only');
  console.log('\n📄 Empty Templates (Headers + 1 example):');
  console.log('5. Product_Complete_Template_Empty.xlsx - Ready for your data');
  console.log('6. Product_Text_Details_Template_Empty.xlsx - Text fields ready');
  console.log('7. Product_Simple_Template_Empty.xlsx - Basic fields ready');
  
  console.log('\n✨ Format: Clean spreadsheet like the image you showed!');
  console.log('📥 Templates are ready for download!');
};

// Generate clean templates
createCleanExcelFiles();
