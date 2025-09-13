const XLSX = require('xlsx');

// Updated comprehensive template structure
const generateCompleteTemplate = () => {
  // Instructions sheet
  const instructions = [
    ['BULK UPLOAD INSTRUCTIONS'],
    [''],
    ['This Excel file allows you to upload multiple products at once with comprehensive product details.'],
    [''],
    ['SHEET STRUCTURE:'],
    ['1. Instructions - This sheet with detailed guidance'],
    ['2. Field_Descriptions - Detailed explanation of each field'],
    ['3. Sample_Data - Example products with proper formatting'],
    ['4. Template - Empty template ready for your data'],
    [''],
    ['IMPORTANT NOTES:'],
    ['• Fill out the Template sheet with your product data'],
    ['• Follow the exact format shown in Sample_Data'],
    ['• JSON fields must be properly formatted (use online JSON validators)'],
    ['• URLs must be complete and accessible'],
    ['• Price fields should be numeric values only'],
    ['• Filter fields can have multiple values separated by commas'],
    ['• Also Show In fields should be "yes" or "no"'],
    ['• Stock Size Option should be "noSize", "sizes", or "import"'],
    [''],
    ['PROCESS:'],
    ['1. Download this template'],
    ['2. Fill the Template sheet with your products'],
    ['3. Save the file'],
    ['4. Upload it using the bulk upload feature'],
    ['5. Review the preview and submit'],
    [''],
    ['SUPPORT:'],
    ['If you encounter any issues, check the Sample_Data for examples.']
  ];

  // Field descriptions
  const fieldDescriptions = [
    ['Field Name', 'Description', 'Required', 'Format/Example'],
    ['Product Name', 'Main product name', 'Yes', 'Premium Cotton T-Shirt'],
    ['Title', 'Product title for display', 'Yes', 'Premium Cotton T-Shirt - Comfortable Fit'],
    ['Description', 'Detailed product description', 'Yes', 'High-quality 100% cotton t-shirt...'],
    ['Manufacturing Details', 'How the product is made', 'No', 'Made from premium cotton fabric, pre-shrunk...'],
    ['Shipping Returns', 'Shipping and return policy', 'No', '7-day return policy, free shipping above $50'],
    ['Regular Price', 'Original price', 'Yes', '29.99'],
    ['Sale Price', 'Discounted price (optional)', 'No', '24.99'],
    ['Category', 'Product category', 'Yes', 'Clothing'],
    ['Subcategory', 'Product subcategory', 'Yes', 'T-Shirts'],
    ['Meta Title', 'SEO title', 'No', 'Premium Cotton T-Shirt | YoraaFashion'],
    ['Meta Description', 'SEO description', 'No', 'Shop premium cotton t-shirts...'],
    ['Slug URL', 'URL slug', 'No', 'premium-cotton-t-shirt'],
    ['Color Filter', 'Product colors (comma-separated)', 'No', 'Blue,Red,White'],
    ['Size Filter', 'Available sizes (comma-separated)', 'No', 'S,M,L,XL'],
    ['Brand Filter', 'Product brand', 'No', 'YoraaFashion'],
    ['Material Filter', 'Product material', 'No', 'Cotton'],
    ['Style Filter', 'Product style', 'No', 'Casual'],
    ['Gender Filter', 'Target gender', 'No', 'Unisex'],
    ['Season Filter', 'Suitable season', 'No', 'All Season'],
    ['Stock Size Option', 'Size option type', 'No', 'noSize, sizes, or import'],
    ['Custom Sizes (JSON)', 'Size details in JSON format', 'No', 'See Sample_Data for format'],
    ['Common CM Chart URL', 'URL to CM size chart', 'No', 'https://example.com/size-chart-cm.jpg'],
    ['Common Inch Chart URL', 'URL to Inch size chart', 'No', 'https://example.com/size-chart-inch.jpg'],
    ['Common Measurement Guide URL', 'URL to measurement guide', 'No', 'https://example.com/measurement-guide.jpg'],
    ['You Might Also Like', 'Show in "You Might Also Like" section', 'No', 'yes or no'],
    ['Similar Items', 'Show in "Similar Items" section', 'No', 'yes or no'],
    ['Others Also Bought', 'Show in "Others Also Bought" section', 'No', 'yes or no'],
    ['Image URLs (JSON)', 'Product image URLs in JSON array', 'No', '["url1.jpg","url2.jpg"]'],
    ['Video URLs (JSON)', 'Product video URLs in JSON array', 'No', '["url1.mp4"]'],
    ['Returnable', 'Is product returnable', 'No', 'yes or no'],
    ['HSN Code', 'HSN/SAC code for taxation', 'No', '6109'],
    ['Default SKU', 'Stock Keeping Unit', 'No', 'TS001'],
    ['Default Barcode', 'Product barcode', 'No', '1234567890123']
  ];

  // Sample data with all fields
  const sampleData = [
    {
      'Product Name': 'Premium Cotton T-Shirt',
      'Title': 'Premium Cotton T-Shirt - Comfortable Fit',
      'Description': 'High-quality 100% cotton t-shirt with comfortable fit and premium fabric. Perfect for casual wear and daily use.',
      'Manufacturing Details': 'Made from premium cotton fabric, pre-shrunk, color-fast, machine washable at 30°C',
      'Shipping Returns': '7-day return policy, free shipping above $50, hassle-free returns with prepaid labels',
      'Regular Price': 29.99,
      'Sale Price': 24.99,
      'Category': 'Clothing',
      'Subcategory': 'T-Shirts',
      'Meta Title': 'Premium Cotton T-Shirt | Comfortable Fit | YoraaFashion',
      'Meta Description': 'Shop premium cotton t-shirts with comfortable fit. High-quality fabric, various colors and sizes available.',
      'Slug URL': 'premium-cotton-t-shirt-comfortable-fit',
      'Color Filter': 'Blue,Red,White,Black',
      'Size Filter': 'S,M,L,XL,XXL',
      'Brand Filter': 'YoraaFashion',
      'Material Filter': 'Cotton',
      'Style Filter': 'Casual',
      'Gender Filter': 'Unisex',
      'Season Filter': 'All Season',
      'Stock Size Option': 'sizes',
      'Custom Sizes (JSON)': JSON.stringify([
        {
          "size": "S",
          "quantity": "10",
          "hsnCode": "6109",
          "sku": "TS001S",
          "barcode": "123456789012",
          "prices": {
            "amazon": "25",
            "flipkart": "24",
            "myntra": "26",
            "nykaa": "25",
            "yoraa": "24"
          }
        },
        {
          "size": "M",
          "quantity": "15",
          "hsnCode": "6109",
          "sku": "TS001M",
          "barcode": "123456789013",
          "prices": {
            "amazon": "25",
            "flipkart": "24",
            "myntra": "26",
            "nykaa": "25",
            "yoraa": "24"
          }
        },
        {
          "size": "L",
          "quantity": "12",
          "hsnCode": "6109",
          "sku": "TS001L",
          "barcode": "123456789014",
          "prices": {
            "amazon": "25",
            "flipkart": "24",
            "myntra": "26",
            "nykaa": "25",
            "yoraa": "24"
          }
        }
      ]),
      'Common CM Chart URL': 'https://example.com/size-charts/tshirt-cm-chart.jpg',
      'Common Inch Chart URL': 'https://example.com/size-charts/tshirt-inch-chart.jpg',
      'Common Measurement Guide URL': 'https://example.com/guides/how-to-measure.jpg',
      'You Might Also Like': 'yes',
      'Similar Items': 'yes',
      'Others Also Bought': 'no',
      'Image URLs (JSON)': JSON.stringify([
        'https://example.com/images/tshirt-blue-front.jpg',
        'https://example.com/images/tshirt-blue-back.jpg',
        'https://example.com/images/tshirt-blue-side.jpg',
        'https://example.com/images/tshirt-blue-detail.jpg'
      ]),
      'Video URLs (JSON)': JSON.stringify([
        'https://example.com/videos/tshirt-demo.mp4'
      ]),
      'Returnable': 'yes',
      'HSN Code': '6109',
      'Default SKU': 'TS001',
      'Default Barcode': '1234567890123'
    },
    {
      'Product Name': 'Denim Jeans Regular Fit',
      'Title': 'Classic Denim Jeans - Regular Fit',
      'Description': 'Classic blue denim jeans with regular fit. Made from durable denim fabric with comfortable stretch.',
      'Manufacturing Details': 'Made from 98% cotton, 2% elastane denim, stone washed for soft feel',
      'Shipping Returns': '14-day return policy, free alterations within 30 days',
      'Regular Price': 59.99,
      'Sale Price': '',
      'Category': 'Clothing',
      'Subcategory': 'Jeans',
      'Meta Title': 'Classic Denim Jeans Regular Fit | YoraaFashion',
      'Meta Description': 'Shop classic denim jeans with regular fit. Durable, comfortable, and stylish.',
      'Slug URL': 'classic-denim-jeans-regular-fit',
      'Color Filter': 'Blue,Black,Grey',
      'Size Filter': '28,30,32,34,36,38',
      'Brand Filter': 'YoraaFashion',
      'Material Filter': 'Denim',
      'Style Filter': 'Classic',
      'Gender Filter': 'Men',
      'Season Filter': 'All Season',
      'Stock Size Option': 'sizes',
      'Custom Sizes (JSON)': JSON.stringify([
        {
          "size": "30",
          "quantity": "8",
          "hsnCode": "6203",
          "sku": "DJ001-30",
          "barcode": "223456789012",
          "prices": {
            "amazon": "59",
            "flipkart": "55",
            "myntra": "60",
            "nykaa": "58",
            "yoraa": "55"
          }
        },
        {
          "size": "32",
          "quantity": "12",
          "hsnCode": "6203",
          "sku": "DJ001-32",
          "barcode": "223456789013",
          "prices": {
            "amazon": "59",
            "flipkart": "55",
            "myntra": "60",
            "nykaa": "58",
            "yoraa": "55"
          }
        }
      ]),
      'Common CM Chart URL': 'https://example.com/size-charts/jeans-cm-chart.jpg',
      'Common Inch Chart URL': 'https://example.com/size-charts/jeans-inch-chart.jpg',
      'Common Measurement Guide URL': 'https://example.com/guides/jeans-fitting-guide.jpg',
      'You Might Also Like': 'yes',
      'Similar Items': 'no',
      'Others Also Bought': 'yes',
      'Image URLs (JSON)': JSON.stringify([
        'https://example.com/images/jeans-blue-front.jpg',
        'https://example.com/images/jeans-blue-back.jpg',
        'https://example.com/images/jeans-blue-detail.jpg'
      ]),
      'Video URLs (JSON)': JSON.stringify([]),
      'Returnable': 'yes',
      'HSN Code': '6203',
      'Default SKU': 'DJ001',
      'Default Barcode': '2234567890123'
    },
    {
      'Product Name': 'Wireless Bluetooth Headphones',
      'Title': 'Premium Wireless Bluetooth Headphones',
      'Description': 'High-quality wireless Bluetooth headphones with noise cancellation and long battery life.',
      'Manufacturing Details': 'Advanced Bluetooth 5.0, 40mm drivers, premium plastic and metal construction',
      'Shipping Returns': '30-day return policy, 1-year warranty included',
      'Regular Price': 129.99,
      'Sale Price': 99.99,
      'Category': 'Electronics',
      'Subcategory': 'Audio',
      'Meta Title': 'Premium Wireless Bluetooth Headphones | Best Sound Quality',
      'Meta Description': 'Experience premium sound with our wireless Bluetooth headphones featuring noise cancellation.',
      'Slug URL': 'premium-wireless-bluetooth-headphones',
      'Color Filter': 'Black,White,Blue',
      'Size Filter': '',
      'Brand Filter': 'YoraaAudio',
      'Material Filter': 'Plastic,Metal',
      'Style Filter': 'Modern',
      'Gender Filter': 'Unisex',
      'Season Filter': 'All Season',
      'Stock Size Option': 'noSize',
      'Custom Sizes (JSON)': JSON.stringify([]),
      'Common CM Chart URL': '',
      'Common Inch Chart URL': '',
      'Common Measurement Guide URL': '',
      'You Might Also Like': 'yes',
      'Similar Items': 'yes',
      'Others Also Bought': 'yes',
      'Image URLs (JSON)': JSON.stringify([
        'https://example.com/images/headphones-black-main.jpg',
        'https://example.com/images/headphones-black-side.jpg',
        'https://example.com/images/headphones-packaging.jpg'
      ]),
      'Video URLs (JSON)': JSON.stringify([
        'https://example.com/videos/headphones-demo.mp4'
      ]),
      'Returnable': 'yes',
      'HSN Code': '8518',
      'Default SKU': 'WBH001',
      'Default Barcode': '3234567890123'
    }
  ];

  // Create empty template with headers only
  const templateHeaders = Object.keys(sampleData[0]);
  const template = [templateHeaders];

  return {
    instructions,
    fieldDescriptions,
    sampleData,
    template
  };
};

// Generate and save the complete Excel file
const createCompleteExcelFile = () => {
  const { instructions, fieldDescriptions, sampleData, template } = generateCompleteTemplate();

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Add Instructions sheet
  const instructionsWS = XLSX.utils.aoa_to_sheet(instructions);
  XLSX.utils.book_append_sheet(wb, instructionsWS, 'Instructions');

  // Add Field Descriptions sheet
  const fieldDescWS = XLSX.utils.aoa_to_sheet(fieldDescriptions);
  XLSX.utils.book_append_sheet(wb, fieldDescWS, 'Field_Descriptions');

  // Add Sample Data sheet
  const sampleWS = XLSX.utils.json_to_sheet(sampleData);
  XLSX.utils.book_append_sheet(wb, sampleWS, 'Sample_Data');

  // Add Template sheet
  const templateWS = XLSX.utils.aoa_to_sheet(template);
  XLSX.utils.book_append_sheet(wb, templateWS, 'Template');

  // Write complete template
  XLSX.writeFile(wb, 'excel-templates/Product_Complete_Updated_Template.xlsx');
  console.log('✅ Generated: Product_Complete_Updated_Template.xlsx');

  // Create text-only version (without Image/Video URLs)
  const textOnlyData = sampleData.map(item => {
    const { 'Image URLs (JSON)': imageUrls, 'Video URLs (JSON)': videoUrls, ...rest } = item;
    return rest;
  });
  const textOnlyHeaders = Object.keys(textOnlyData[0]);
  const textOnlyTemplate = [textOnlyHeaders];

  const textOnlyWB = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(textOnlyWB, instructionsWS, 'Instructions');
  
  // Update field descriptions for text-only
  const textOnlyFieldDesc = fieldDescriptions.filter(row => 
    row[0] !== 'Image URLs (JSON)' && row[0] !== 'Video URLs (JSON)'
  );
  const textOnlyFieldWS = XLSX.utils.aoa_to_sheet(textOnlyFieldDesc);
  XLSX.utils.book_append_sheet(textOnlyWB, textOnlyFieldWS, 'Field_Descriptions');
  
  const textOnlySampleWS = XLSX.utils.json_to_sheet(textOnlyData);
  XLSX.utils.book_append_sheet(textOnlyWB, textOnlySampleWS, 'Sample_Data');
  
  const textOnlyTemplateWS = XLSX.utils.aoa_to_sheet(textOnlyTemplate);
  XLSX.utils.book_append_sheet(textOnlyWB, textOnlyTemplateWS, 'Template');

  XLSX.writeFile(textOnlyWB, 'excel-templates/Product_Text_Details_Updated_Template.xlsx');
  console.log('✅ Generated: Product_Text_Details_Updated_Template.xlsx');

  // Create image version (with Image/Video URLs)
  const imageWB = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(imageWB, instructionsWS, 'Instructions');
  XLSX.utils.book_append_sheet(imageWB, fieldDescWS, 'Field_Descriptions');
  XLSX.utils.book_append_sheet(imageWB, sampleWS, 'Sample_Data');
  XLSX.utils.book_append_sheet(imageWB, templateWS, 'Template');

  XLSX.writeFile(imageWB, 'excel-templates/Product_With_Images_Updated_Template.xlsx');
  console.log('✅ Generated: Product_With_Images_Updated_Template.xlsx');
};

// Run the generation
console.log('🚀 Generating updated Excel templates with all fields...');
createCompleteExcelFile();
console.log('✅ All updated templates generated successfully!');
console.log('\nNew fields included:');
console.log('• Enhanced filter fields (comma-separated multiple values)');
console.log('• Stock size options and custom sizes with full pricing');
console.log('• Common size chart URLs (CM, Inch, Measurement Guide)');
console.log('• Also Show In options (You Might Also Like, Similar Items, Others Also Bought)');
console.log('• Additional product fields (Returnable, HSN Code, SKU, Barcode)');
console.log('• Comprehensive validation and examples');
console.log('\nTemplates generated:');
console.log('1. Product_Text_Details_Updated_Template.xlsx - Text fields only');
console.log('2. Product_With_Images_Updated_Template.xlsx - Text + Image/Video URLs');
console.log('3. Product_Complete_Updated_Template.xlsx - All fields included');
