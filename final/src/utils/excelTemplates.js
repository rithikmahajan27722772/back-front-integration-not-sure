/**
 * Creates comprehensive Excel templates with detailed dummy data and field descriptions
 * for Yoraa bulk product upload functionality
 */

import * as XLSX from 'xlsx';

// Field descriptions and validation rules
const FIELD_DESCRIPTIONS = {
  'Product Name': {
    description: 'Main product name (Required)',
    example: 'Cotton T-Shirt',
    validation: 'Text, 3-100 characters',
    required: true
  },
  'Title': {
    description: 'Product display title (Required)',
    example: 'Premium Cotton T-Shirt',
    validation: 'Text, 5-150 characters',
    required: true
  },
  'Description': {
    description: 'Detailed product description (Required)',
    example: 'High-quality 100% cotton t-shirt with comfortable fit and premium fabric',
    validation: 'Text, 10-2000 characters',
    required: true
  },
  'Manufacturing Details': {
    description: 'Production and material details',
    example: 'Made from premium cotton fabric, pre-shrunk, color-fast, machine washable',
    validation: 'Text, up to 1000 characters',
    required: false
  },
  'Shipping Returns': {
    description: 'Shipping and return policy information',
    example: '7-day return policy, free shipping above $50, exchange available',
    validation: 'Text, up to 1000 characters',
    required: false
  },
  'Regular Price': {
    description: 'Original product price (Required)',
    example: '29.99',
    validation: 'Decimal number, greater than 0',
    required: true
  },
  'Sale Price': {
    description: 'Discounted price (Optional)',
    example: '24.99',
    validation: 'Decimal number, less than Regular Price',
    required: false
  },
  'Category': {
    description: 'Main product category (Required)',
    example: 'Clothing',
    validation: 'Must match existing category in system',
    required: true
  },
  'Subcategory': {
    description: 'Product subcategory (Required)',
    example: 'T-Shirts',
    validation: 'Must match existing subcategory in system',
    required: true
  },
  'Meta Title': {
    description: 'SEO title for search engines',
    example: 'Premium Cotton T-Shirt | Comfortable Fit | YoraaFashion',
    validation: 'Text, 10-60 characters for best SEO',
    required: false
  },
  'Meta Description': {
    description: 'SEO description for search engines',
    example: 'Shop premium cotton t-shirts with comfortable fit. High-quality fabric, various colors available. Free shipping.',
    validation: 'Text, 50-160 characters for best SEO',
    required: false
  },
  'Slug URL': {
    description: 'URL-friendly product identifier',
    example: 'premium-cotton-t-shirt',
    validation: 'Lowercase, hyphens only, no spaces or special chars',
    required: false
  },
  'Color': {
    description: 'Product color filter',
    example: 'Blue',
    validation: 'Text, single color name',
    required: false
  },
  'Size': {
    description: 'Product size filter',
    example: 'M',
    validation: 'Text, single size designation',
    required: false
  },
  'Brand': {
    description: 'Product brand filter',
    example: 'YoraaFashion',
    validation: 'Text, brand name',
    required: false
  },
  'Material': {
    description: 'Product material filter',
    example: 'Cotton',
    validation: 'Text, material type',
    required: false
  },
  'Style': {
    description: 'Product style filter',
    example: 'Casual',
    validation: 'Text, style category',
    required: false
  },
  'Gender': {
    description: 'Target gender filter',
    example: 'Unisex',
    validation: 'Text: Male/Female/Unisex',
    required: false
  },
  'Season': {
    description: 'Seasonal filter',
    example: 'All',
    validation: 'Text: Spring/Summer/Fall/Winter/All',
    required: false
  },
  'Stock Sizes (JSON)': {
    description: 'Standard stock sizes in JSON format',
    example: '[]',
    validation: 'Valid JSON array of strings',
    required: false
  },
  'Custom Sizes (JSON)': {
    description: 'Custom size configurations with pricing',
    example: '[{"size":"S","quantity":"10","hsnCode":"6109","sku":"TS001S","barcode":"123456789","prices":{"amazon":"25","flipkart":"24","myntra":"26","nykaa":"25","yoraa":"24"}}]',
    validation: 'Valid JSON array of size objects',
    required: false
  },
  'Image URLs (JSON)': {
    description: 'Product image URLs (for text+image template)',
    example: '["https://example.com/image1.jpg","https://example.com/image2.jpg"]',
    validation: 'Valid JSON array of public image URLs',
    required: false
  },
  'Video URLs (JSON)': {
    description: 'Product video URLs (for text+image template)',
    example: '["https://example.com/video1.mp4"]',
    validation: 'Valid JSON array of public video URLs',
    required: false
  }
};

// Comprehensive dummy data for different product types
const DUMMY_PRODUCTS = [
  {
    'Product Name': 'Premium Cotton T-Shirt',
    'Title': 'Premium 100% Cotton Crew Neck T-Shirt',
    'Description': 'Experience ultimate comfort with our premium 100% cotton crew neck t-shirt. Made from pre-shrunk cotton fabric that maintains its shape and softness wash after wash. Perfect for casual wear, layering, or as a wardrobe staple. Available in multiple colors and sizes.',
    'Manufacturing Details': 'Made from 100% organic cotton, pre-shrunk and color-fast treated. Reinforced seams for durability. Machine washable at 30°C. Manufactured in certified facilities following ethical labor practices.',
    'Shipping Returns': '✓ Free shipping on orders above $50 ✓ 7-day hassle-free returns ✓ Size exchange available ✓ Full refund if not satisfied ✓ Express delivery available',
    'Regular Price': '29.99',
    'Sale Price': '24.99',
    'Category': 'Clothing',
    'Subcategory': 'T-Shirts',
    'Meta Title': 'Premium Cotton T-Shirt | Comfortable Fit | YoraaFashion',
    'Meta Description': 'Shop premium 100% cotton t-shirts with superior comfort and fit. Pre-shrunk, color-fast fabric. Multiple colors available. Free shipping over $50.',
    'Slug URL': 'premium-cotton-t-shirt',
    'Color': 'Navy Blue',
    'Size': 'M',
    'Brand': 'YoraaFashion',
    'Material': 'Cotton',
    'Style': 'Casual',
    'Gender': 'Unisex',
    'Season': 'All',
    'Stock Sizes (JSON)': '["XS","S","M","L","XL","XXL"]',
    'Custom Sizes (JSON)': '[{"size":"S","quantity":"25","hsnCode":"6109","sku":"TS001S","barcode":"123456789101","prices":{"amazon":"27","flipkart":"26","myntra":"28","nykaa":"27","yoraa":"24.99"}},{"size":"M","quantity":"30","hsnCode":"6109","sku":"TS001M","barcode":"123456789102","prices":{"amazon":"27","flipkart":"26","myntra":"28","nykaa":"27","yoraa":"24.99"}},{"size":"L","quantity":"20","hsnCode":"6109","sku":"TS001L","barcode":"123456789103","prices":{"amazon":"27","flipkart":"26","myntra":"28","nykaa":"27","yoraa":"24.99"}}]',
    'Image URLs (JSON)': '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab","https://images.unsplash.com/photo-1503341504253-dff4815485f1","https://images.unsplash.com/photo-1562157873-818bc0726f68"]',
    'Video URLs (JSON)': '["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"]'
  },
  {
    'Product Name': 'Slim Fit Denim Jeans',
    'Title': 'Classic Slim Fit Dark Wash Denim Jeans',
    'Description': 'Discover the perfect blend of style and comfort with our classic slim fit denim jeans. Crafted from premium stretch denim that moves with you throughout the day. Features a timeless dark wash, comfortable mid-rise fit, and durable construction.',
    'Manufacturing Details': 'Made from 98% cotton, 2% elastane for stretch and comfort. Stone-washed for softness. Reinforced stress points. YKK zipper. Antique brass hardware. Pre-washed to prevent shrinkage.',
    'Shipping Returns': '✓ Free shipping on orders above $75 ✓ 14-day returns for unused items ✓ Size exchange program ✓ Store credit or refund options ✓ Try before you buy program available',
    'Regular Price': '79.99',
    'Sale Price': '59.99',
    'Category': 'Clothing',
    'Subcategory': 'Jeans',
    'Meta Title': 'Slim Fit Denim Jeans | Dark Wash | Premium Quality | YoraaFashion',
    'Meta Description': 'Shop premium slim fit denim jeans with stretch comfort. Classic dark wash, durable construction. Perfect fit guaranteed. Free shipping over $75.',
    'Slug URL': 'slim-fit-dark-wash-denim-jeans',
    'Color': 'Dark Blue',
    'Size': '32x32',
    'Brand': 'YoraaFashion',
    'Material': 'Denim',
    'Style': 'Slim Fit',
    'Gender': 'Male',
    'Season': 'All',
    'Stock Sizes (JSON)': '["28x30","28x32","30x30","30x32","32x30","32x32","34x30","34x32","36x30","36x32"]',
    'Custom Sizes (JSON)': '[{"size":"30x32","quantity":"15","hsnCode":"6203","sku":"DJ001-30x32","barcode":"123456789201","prices":{"amazon":"65","flipkart":"62","myntra":"68","nykaa":"65","yoraa":"59.99"}},{"size":"32x32","quantity":"20","hsnCode":"6203","sku":"DJ001-32x32","barcode":"123456789202","prices":{"amazon":"65","flipkart":"62","myntra":"68","nykaa":"65","yoraa":"59.99"}},{"size":"34x32","quantity":"12","hsnCode":"6203","sku":"DJ001-34x32","barcode":"123456789203","prices":{"amazon":"65","flipkart":"62","myntra":"68","nykaa":"65","yoraa":"59.99"}}]',
    'Image URLs (JSON)': '["https://images.unsplash.com/photo-1542272604-787c3835535d","https://images.unsplash.com/photo-1473966968600-fa801b869a1a","https://images.unsplash.com/photo-1594633312681-425c7b97ccd1"]',
    'Video URLs (JSON)': '["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"]'
  },
  {
    'Product Name': 'Wireless Bluetooth Earbuds',
    'Title': 'Premium Wireless Bluetooth 5.0 Earbuds with Noise Cancellation',
    'Description': 'Immerse yourself in crystal-clear audio with our premium wireless earbuds. Featuring advanced Bluetooth 5.0 technology, active noise cancellation, and up to 24 hours of playtime with the charging case. Perfect for music, calls, and workouts.',
    'Manufacturing Details': 'Premium ABS plastic construction. IPX7 waterproof rating. High-quality drivers for superior sound. Touch controls. Fast charging technology. CE, FCC, and RoHS certified.',
    'Shipping Returns': '✓ Free shipping worldwide ✓ 30-day money-back guarantee ✓ 1-year manufacturer warranty ✓ Express shipping available ✓ Hassle-free returns',
    'Regular Price': '129.99',
    'Sale Price': '89.99',
    'Category': 'Electronics',
    'Subcategory': 'Audio',
    'Meta Title': 'Wireless Bluetooth Earbuds | Noise Cancelling | 24H Battery | YoraaFashion',
    'Meta Description': 'Premium wireless Bluetooth earbuds with noise cancellation and 24-hour battery life. Crystal clear sound, waterproof design. Free worldwide shipping.',
    'Slug URL': 'wireless-bluetooth-earbuds-noise-cancelling',
    'Color': 'Black',
    'Size': 'One Size',
    'Brand': 'YoraaFashion',
    'Material': 'ABS Plastic',
    'Style': 'Modern',
    'Gender': 'Unisex',
    'Season': 'All',
    'Stock Sizes (JSON)': '["One Size"]',
    'Custom Sizes (JSON)': '[{"size":"One Size","quantity":"50","hsnCode":"8518","sku":"WE001-OS","barcode":"123456789301","prices":{"amazon":"95","flipkart":"92","myntra":"98","nykaa":"95","yoraa":"89.99"}}]',
    'Image URLs (JSON)': '["https://images.unsplash.com/photo-1590658268037-6bf12165a8df","https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46","https://images.unsplash.com/photo-1583394838336-acd977736f90"]',
    'Video URLs (JSON)': '["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4"]'
  },
  {
    'Product Name': 'Organic Skincare Set',
    'Title': 'Complete Organic Skincare Routine Set - 4 Products',
    'Description': 'Transform your skincare routine with our complete organic skincare set. Includes cleanser, toner, serum, and moisturizer made from 100% natural ingredients. Suitable for all skin types, dermatologist tested, and cruelty-free.',
    'Manufacturing Details': 'Made from certified organic ingredients. No parabens, sulfates, or artificial fragrances. Dermatologist tested. Cruelty-free and vegan. Recyclable packaging. Manufactured in FDA-approved facilities.',
    'Shipping Returns': '✓ Free shipping on all orders ✓ 60-day satisfaction guarantee ✓ Full refund if not satisfied ✓ Hypoallergenic guarantee ✓ Expert skincare consultation available',
    'Regular Price': '89.99',
    'Sale Price': '69.99',
    'Category': 'Beauty',
    'Subcategory': 'Skincare',
    'Meta Title': 'Organic Skincare Set | 4-Step Routine | Natural Ingredients | YoraaFashion',
    'Meta Description': 'Complete organic skincare routine set with cleanser, toner, serum & moisturizer. 100% natural ingredients, all skin types. 60-day guarantee.',
    'Slug URL': 'organic-skincare-routine-set',
    'Color': 'Natural',
    'Size': '4-Piece Set',
    'Brand': 'YoraaFashion',
    'Material': 'Organic',
    'Style': 'Natural',
    'Gender': 'Unisex',
    'Season': 'All',
    'Stock Sizes (JSON)': '["Travel Size","Full Size","Value Pack"]',
    'Custom Sizes (JSON)': '[{"size":"Full Size","quantity":"30","hsnCode":"3304","sku":"SS001-FS","barcode":"123456789401","prices":{"amazon":"75","flipkart":"72","myntra":"78","nykaa":"74","yoraa":"69.99"}},{"size":"Travel Size","quantity":"40","hsnCode":"3304","sku":"SS001-TS","barcode":"123456789402","prices":{"amazon":"35","flipkart":"32","myntra":"38","nykaa":"34","yoraa":"29.99"}}]',
    'Image URLs (JSON)': '["https://images.unsplash.com/photo-1556228720-195a672e8a03","https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b","https://images.unsplash.com/photo-1598300042247-d088f8ab3a91"]',
    'Video URLs (JSON)': '["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"]'
  },
  {
    'Product Name': 'Smart Fitness Tracker',
    'Title': 'Advanced Smart Fitness Tracker with Heart Rate Monitor',
    'Description': 'Track your fitness journey with our advanced smart fitness tracker. Features heart rate monitoring, step counting, sleep tracking, and smartphone notifications. Water-resistant design with 7-day battery life.',
    'Manufacturing Details': 'Silicone band with aluminum case. AMOLED display. IP68 water resistance. Lithium polymer battery. Bluetooth 5.0 connectivity. Medical-grade heart rate sensor.',
    'Shipping Returns': '✓ Free shipping worldwide ✓ 45-day trial period ✓ 2-year warranty ✓ App support included ✓ Fitness coaching subscription available',
    'Regular Price': '199.99',
    'Sale Price': '149.99',
    'Category': 'Electronics',
    'Subcategory': 'Wearables',
    'Meta Title': 'Smart Fitness Tracker | Heart Rate Monitor | 7-Day Battery | YoraaFashion',
    'Meta Description': 'Advanced fitness tracker with heart rate monitoring, sleep tracking, and 7-day battery. Water-resistant, smartphone compatible. 45-day trial.',
    'Slug URL': 'smart-fitness-tracker-heart-rate',
    'Color': 'Black',
    'Size': 'Adjustable',
    'Brand': 'YoraaFashion',
    'Material': 'Silicone',
    'Style': 'Modern',
    'Gender': 'Unisex',
    'Season': 'All',
    'Stock Sizes (JSON)': '["Small","Medium","Large"]',
    'Custom Sizes (JSON)': '[{"size":"Medium","quantity":"35","hsnCode":"9102","sku":"FT001-M","barcode":"123456789501","prices":{"amazon":"160","flipkart":"155","myntra":"165","nykaa":"160","yoraa":"149.99"}},{"size":"Large","quantity":"25","hsnCode":"9102","sku":"FT001-L","barcode":"123456789502","prices":{"amazon":"160","flipkart":"155","myntra":"165","nykaa":"160","yoraa":"149.99"}}]',
    'Image URLs (JSON)': '["https://images.unsplash.com/photo-1544117519-31a4b719223d","https://images.unsplash.com/photo-1551698618-1dfe5d97d256","https://images.unsplash.com/photo-1434494878577-86c23bcb06b9"]',
    'Video URLs (JSON)': '["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"]'
  }
];

// Create field description sheet
const createFieldDescriptionSheet = () => {
  const data = Object.entries(FIELD_DESCRIPTIONS).map(([field, info]) => ({
    'Field Name': field,
    'Description': info.description,
    'Example': info.example,
    'Validation Rules': info.validation,
    'Required': info.required ? 'YES' : 'NO'
  }));
  
  return data;
};

// Create instructions sheet
const createInstructionsSheet = () => {
  return [
    ['YORAA BULK PRODUCT UPLOAD INSTRUCTIONS'],
    [''],
    ['📋 OVERVIEW'],
    ['This Excel template allows you to upload multiple products at once.'],
    ['There are two template types:'],
    ['1. Text Only: Product details without images/videos'],
    ['2. Text + Images: Product details with image and video URLs'],
    [''],
    ['📝 HOW TO USE'],
    ['1. Choose the appropriate template type'],
    ['2. Fill in the Data sheet with your product information'],
    ['3. Reference the Field Descriptions sheet for guidance'],
    ['4. Save as .xlsx format'],
    ['5. Upload through the bulk upload interface'],
    [''],
    ['✅ VALIDATION RULES'],
    ['• All required fields must be filled'],
    ['• Prices must be valid numbers'],
    ['• Sale Price must be less than Regular Price'],
    ['• Categories/Subcategories must exist in the system'],
    ['• JSON fields must be valid JSON format'],
    ['• Image/Video URLs must be publicly accessible'],
    [''],
    ['🔧 JSON FIELD FORMATS'],
    ['Stock Sizes: ["XS","S","M","L","XL"]'],
    ['Custom Sizes: [{"size":"M","quantity":"10","hsnCode":"1234","sku":"ABC123","barcode":"789","prices":{"amazon":"25","flipkart":"24"}}]'],
    ['Image URLs: ["https://example.com/image1.jpg","https://example.com/image2.jpg"]'],
    ['Video URLs: ["https://example.com/video1.mp4"]'],
    [''],
    ['⚠️ IMPORTANT NOTES'],
    ['• Maximum file size: 10MB'],
    ['• Maximum 1000 products per upload'],
    ['• Process may take several minutes for large uploads'],
    ['• Invalid rows will be skipped with error reports'],
    ['• Duplicate SKUs will be rejected'],
    [''],
    ['📞 SUPPORT'],
    ['For help with bulk uploads, contact: support@yoraa.com']
  ];
};

// Export function to create Excel files
export const createBulkUploadTemplates = () => {
  // Create Text Only Template
  const createTextOnlyTemplate = () => {
    const wb = XLSX.utils.book_new();
    
    // Instructions sheet
    const instructionsWS = XLSX.utils.aoa_to_sheet(createInstructionsSheet());
    XLSX.utils.book_append_sheet(wb, instructionsWS, 'Instructions');
    
    // Field descriptions sheet
    const descriptionsWS = XLSX.utils.json_to_sheet(createFieldDescriptionSheet());
    XLSX.utils.book_append_sheet(wb, descriptionsWS, 'Field Descriptions');
    
    // Sample data sheet (without image/video columns)
    const textOnlyData = DUMMY_PRODUCTS.map(product => {
      const { 'Image URLs (JSON)': images, 'Video URLs (JSON)': videos, ...textData } = product;
      return textData;
    });
    const dataWS = XLSX.utils.json_to_sheet(textOnlyData);
    XLSX.utils.book_append_sheet(wb, dataWS, 'Sample Data');
    
    // Empty template sheet
    const emptyData = [{}];
    Object.keys(DUMMY_PRODUCTS[0]).forEach(key => {
      if (key !== 'Image URLs (JSON)' && key !== 'Video URLs (JSON)') {
        emptyData[0][key] = '';
      }
    });
    const emptyWS = XLSX.utils.json_to_sheet(emptyData);
    XLSX.utils.book_append_sheet(wb, emptyWS, 'Template');
    
    return wb;
  };

  // Create Text + Images Template
  const createTextImageTemplate = () => {
    const wb = XLSX.utils.book_new();
    
    // Instructions sheet
    const instructionsWS = XLSX.utils.aoa_to_sheet(createInstructionsSheet());
    XLSX.utils.book_append_sheet(wb, instructionsWS, 'Instructions');
    
    // Field descriptions sheet
    const descriptionsWS = XLSX.utils.json_to_sheet(createFieldDescriptionSheet());
    XLSX.utils.book_append_sheet(wb, descriptionsWS, 'Field Descriptions');
    
    // Sample data sheet (with all columns)
    const dataWS = XLSX.utils.json_to_sheet(DUMMY_PRODUCTS);
    XLSX.utils.book_append_sheet(wb, dataWS, 'Sample Data');
    
    // Empty template sheet
    const emptyData = [{}];
    Object.keys(DUMMY_PRODUCTS[0]).forEach(key => {
      emptyData[0][key] = '';
    });
    const emptyWS = XLSX.utils.json_to_sheet(emptyData);
    XLSX.utils.book_append_sheet(wb, emptyWS, 'Template');
    
    return wb;
  };

  return {
    textOnly: createTextOnlyTemplate(),
    textImage: createTextImageTemplate()
  };
};

// Download templates function
export const downloadBulkUploadTemplate = (type = 'text') => {
  const templates = createBulkUploadTemplates();
  const wb = type === 'text' ? templates.textOnly : templates.textImage;
  
  const fileName = type === 'text' 
    ? 'Yoraa_Bulk_Upload_Text_Only_Template.xlsx'
    : 'Yoraa_Bulk_Upload_Text_Images_Template.xlsx';
  
  XLSX.writeFile(wb, fileName);
};
