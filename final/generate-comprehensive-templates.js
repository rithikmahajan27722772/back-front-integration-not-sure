const XLSX = require('xlsx');

// Generate comprehensive Excel templates with realistic dummy data
const generateComprehensiveTemplates = () => {
  
  // Detailed instructions
  const instructions = [
    ['YORAA BULK PRODUCT UPLOAD - COMPREHENSIVE GUIDE'],
    [''],
    ['Welcome to the Yoraa Bulk Upload System! This tool allows you to upload multiple products at once with all the features available in the single product upload form.'],
    [''],
    ['📋 WHAT YOU CAN UPLOAD:'],
    ['• Basic product information (name, description, pricing)'],
    ['• Product categories and subcategories'],
    ['• SEO metadata (title, description, slug)'],
    ['• Product filters (color, size, brand, material, style, gender, season)'],
    ['• Stock management with sizes, quantities, and pricing per platform'],
    ['• Size charts (CM, Inch, Measurement Guide URLs)'],
    ['• Product visibility settings (You Might Also Like, Similar Items, Others Also Bought)'],
    ['• Product images and videos'],
    ['• Additional fields (HSN codes, SKUs, barcodes, return policy)'],
    [''],
    ['📊 EXCEL SHEETS STRUCTURE:'],
    ['1. Instructions - This comprehensive guide'],
    ['2. Field_Guide - Detailed explanation of every field'],
    ['3. Sample_Products - 5 realistic product examples'],
    ['4. Upload_Template - Empty template for your products'],
    [''],
    ['🚀 HOW TO USE:'],
    ['1. Study the Sample_Products sheet to understand the format'],
    ['2. Use the Upload_Template sheet to add your products'],
    ['3. Follow the exact format shown in samples'],
    ['4. Save the file and upload through the bulk upload interface'],
    ['5. Review the preview before final submission'],
    [''],
    ['⚠️ IMPORTANT VALIDATION RULES:'],
    ['• Product Name, Title, Description are REQUIRED'],
    ['• Prices must be numbers (use 29.99 not $29.99)'],
    ['• JSON fields must be properly formatted'],
    ['• URLs must be complete and accessible'],
    ['• Yes/No fields must be exactly "yes" or "no"'],
    ['• Multi-value fields use comma separation (Red,Blue,Green)'],
    ['• Stock Size Option: "noSize", "sizes", or "import"'],
    [''],
    ['💡 PRO TIPS:'],
    ['• Use online JSON validators for JSON fields'],
    ['• Test URLs before adding them'],
    ['• Keep product names consistent with your brand'],
    ['• Use descriptive SKUs and barcodes'],
    ['• Set realistic stock quantities'],
    ['• Include size charts for clothing items'],
    [''],
    ['🔧 TROUBLESHOOTING:'],
    ['• If upload fails, check the Sample_Products for correct formatting'],
    ['• Ensure all required fields are filled'],
    ['• Validate JSON fields using online tools'],
    ['• Check that image URLs are accessible'],
    [''],
    ['📞 SUPPORT:'],
    ['For technical support, contact your system administrator.']
  ];

  // Comprehensive field guide
  const fieldGuide = [
    ['Field Name', 'Required', 'Data Type', 'Description', 'Example', 'Validation Rules'],
    ['Product Name', 'YES', 'Text', 'Main product name for identification', 'Premium Cotton T-Shirt', 'Must be unique, 3-100 characters'],
    ['Title', 'YES', 'Text', 'Display title for customers', 'Premium Cotton T-Shirt - Comfortable Fit', '3-150 characters'],
    ['Description', 'YES', 'Text', 'Detailed product description', 'High-quality 100% cotton t-shirt with comfortable fit...', 'Minimum 20 characters'],
    ['Manufacturing Details', 'No', 'Text', 'How the product is made', 'Made from premium cotton, pre-shrunk, machine washable', 'Optional, up to 500 characters'],
    ['Shipping Returns', 'No', 'Text', 'Shipping and return information', '7-day return policy, free shipping above $50', 'Optional, up to 300 characters'],
    ['Regular Price', 'YES', 'Number', 'Original selling price', '29.99', 'Must be positive number'],
    ['Sale Price', 'No', 'Number', 'Discounted price (optional)', '24.99', 'Must be less than regular price'],
    ['Category', 'YES', 'Text', 'Main product category', 'Clothing', 'Must match existing categories'],
    ['Subcategory', 'YES', 'Text', 'Product subcategory', 'T-Shirts', 'Must match existing subcategories'],
    ['Meta Title', 'No', 'Text', 'SEO page title', 'Premium Cotton T-Shirt | YoraaFashion', 'Recommended 50-60 characters'],
    ['Meta Description', 'No', 'Text', 'SEO page description', 'Shop premium cotton t-shirts with comfortable fit...', 'Recommended 150-160 characters'],
    ['Slug URL', 'No', 'Text', 'URL-friendly product identifier', 'premium-cotton-t-shirt', 'Lowercase, hyphens only'],
    ['Color Filter', 'No', 'Text', 'Available colors (comma-separated)', 'Red,Blue,White,Black', 'Comma-separated list'],
    ['Size Filter', 'No', 'Text', 'Available sizes (comma-separated)', 'S,M,L,XL,XXL', 'Comma-separated list'],
    ['Brand Filter', 'No', 'Text', 'Product brand', 'YoraaFashion', 'Single brand name'],
    ['Material Filter', 'No', 'Text', 'Product material', 'Cotton', 'Single material or blend'],
    ['Style Filter', 'No', 'Text', 'Product style', 'Casual', 'Single style descriptor'],
    ['Gender Filter', 'No', 'Text', 'Target gender', 'Unisex', 'Men, Women, Unisex, Kids'],
    ['Season Filter', 'No', 'Text', 'Suitable season', 'All Season', 'Summer, Winter, All Season, etc.'],
    ['Stock Size Option', 'No', 'Text', 'Size management type', 'sizes', 'noSize, sizes, or import'],
    ['Custom Sizes (JSON)', 'No', 'JSON Array', 'Size details with pricing', '[{"size":"S","quantity":"10",...}]', 'Must be valid JSON array'],
    ['Common CM Chart URL', 'No', 'URL', 'Centimeter size chart image', 'https://example.com/size-chart-cm.jpg', 'Must be valid accessible URL'],
    ['Common Inch Chart URL', 'No', 'URL', 'Inch size chart image', 'https://example.com/size-chart-inch.jpg', 'Must be valid accessible URL'],
    ['Common Measurement Guide URL', 'No', 'URL', 'How to measure guide', 'https://example.com/measurement-guide.jpg', 'Must be valid accessible URL'],
    ['You Might Also Like', 'No', 'Yes/No', 'Show in recommendation section', 'yes', 'Exactly "yes" or "no"'],
    ['Similar Items', 'No', 'Yes/No', 'Show in similar items section', 'yes', 'Exactly "yes" or "no"'],
    ['Others Also Bought', 'No', 'Yes/No', 'Show in also bought section', 'no', 'Exactly "yes" or "no"'],
    ['Image URLs (JSON)', 'No', 'JSON Array', 'Product image URLs', '["url1.jpg","url2.jpg"]', 'Must be valid JSON array of URLs'],
    ['Video URLs (JSON)', 'No', 'JSON Array', 'Product video URLs', '["video1.mp4"]', 'Must be valid JSON array of URLs'],
    ['Returnable', 'No', 'Yes/No', 'Is product returnable', 'yes', 'Exactly "yes" or "no"'],
    ['HSN Code', 'No', 'Text', 'HSN/SAC code for taxation', '6109', 'Valid HSN code format'],
    ['Default SKU', 'No', 'Text', 'Stock Keeping Unit', 'TS001', 'Unique identifier'],
    ['Default Barcode', 'No', 'Text', 'Product barcode', '1234567890123', 'Valid barcode format']
  ];

  // Comprehensive sample products with realistic data
  const sampleProducts = [
    {
      'Product Name': 'Premium Cotton T-Shirt',
      'Title': 'Premium Cotton T-Shirt - Ultra Comfortable Fit',
      'Description': 'Experience ultimate comfort with our premium 100% cotton t-shirt. Made from the finest cotton fibers, this t-shirt offers exceptional softness and breathability. The pre-shrunk fabric ensures long-lasting fit, while the reinforced seams provide durability. Perfect for casual wear, workouts, or layering. Available in multiple colors and sizes to suit every style preference.',
      'Manufacturing Details': 'Crafted from 100% organic cotton, pre-shrunk for consistent sizing, color-fast dyes for lasting vibrancy, reinforced double-stitched seams, tagless design for comfort, machine washable at 30°C, tumble dry low heat',
      'Shipping Returns': '✅ Free shipping on orders above $50 | 🔄 30-day hassle-free returns | 📦 Express shipping available | 💯 100% satisfaction guarantee | 🚚 Same-day dispatch for orders before 2 PM',
      'Regular Price': 29.99,
      'Sale Price': 24.99,
      'Category': 'Clothing',
      'Subcategory': 'T-Shirts',
      'Meta Title': 'Premium Cotton T-Shirt - Ultra Comfortable | YoraaFashion',
      'Meta Description': 'Shop our premium 100% cotton t-shirts with ultra-comfortable fit. Pre-shrunk, color-fast, and available in multiple sizes. Free shipping above $50. Order now!',
      'Slug URL': 'premium-cotton-t-shirt-ultra-comfortable',
      'Color Filter': 'Navy Blue,Charcoal Grey,Pure White,Forest Green,Burgundy',
      'Size Filter': 'XS,S,M,L,XL,XXL,XXXL',
      'Brand Filter': 'YoraaFashion',
      'Material Filter': 'Cotton',
      'Style Filter': 'Casual',
      'Gender Filter': 'Unisex',
      'Season Filter': 'All Season',
      'Stock Size Option': 'sizes',
      'Custom Sizes (JSON)': JSON.stringify([
        {
          "size": "XS",
          "quantity": "5",
          "hsnCode": "6109",
          "sku": "YF-TS001-XS",
          "barcode": "1234567890001",
          "prices": {
            "amazon": "26.99",
            "flipkart": "25.99",
            "myntra": "27.99",
            "nykaa": "26.49",
            "yoraa": "24.99"
          }
        },
        {
          "size": "S",
          "quantity": "15",
          "hsnCode": "6109",
          "sku": "YF-TS001-S",
          "barcode": "1234567890002",
          "prices": {
            "amazon": "26.99",
            "flipkart": "25.99",
            "myntra": "27.99",
            "nykaa": "26.49",
            "yoraa": "24.99"
          }
        },
        {
          "size": "M",
          "quantity": "25",
          "hsnCode": "6109",
          "sku": "YF-TS001-M",
          "barcode": "1234567890003",
          "prices": {
            "amazon": "26.99",
            "flipkart": "25.99",
            "myntra": "27.99",
            "nykaa": "26.49",
            "yoraa": "24.99"
          }
        },
        {
          "size": "L",
          "quantity": "20",
          "hsnCode": "6109",
          "sku": "YF-TS001-L",
          "barcode": "1234567890004",
          "prices": {
            "amazon": "26.99",
            "flipkart": "25.99",
            "myntra": "27.99",
            "nykaa": "26.49",
            "yoraa": "24.99"
          }
        },
        {
          "size": "XL",
          "quantity": "18",
          "hsnCode": "6109",
          "sku": "YF-TS001-XL",
          "barcode": "1234567890005",
          "prices": {
            "amazon": "26.99",
            "flipkart": "25.99",
            "myntra": "27.99",
            "nykaa": "26.49",
            "yoraa": "24.99"
          }
        }
      ]),
      'Common CM Chart URL': 'https://cdn.yoraafashion.com/size-charts/tshirt-unisex-cm-chart.jpg',
      'Common Inch Chart URL': 'https://cdn.yoraafashion.com/size-charts/tshirt-unisex-inch-chart.jpg',
      'Common Measurement Guide URL': 'https://cdn.yoraafashion.com/guides/how-to-measure-tshirt.jpg',
      'You Might Also Like': 'yes',
      'Similar Items': 'yes',
      'Others Also Bought': 'yes',
      'Image URLs (JSON)': JSON.stringify([
        'https://cdn.yoraafashion.com/products/tshirt-premium-cotton/navy-front.jpg',
        'https://cdn.yoraafashion.com/products/tshirt-premium-cotton/navy-back.jpg',
        'https://cdn.yoraafashion.com/products/tshirt-premium-cotton/navy-side.jpg',
        'https://cdn.yoraafashion.com/products/tshirt-premium-cotton/fabric-close-up.jpg',
        'https://cdn.yoraafashion.com/products/tshirt-premium-cotton/lifestyle-1.jpg'
      ]),
      'Video URLs (JSON)': JSON.stringify([
        'https://cdn.yoraafashion.com/videos/tshirt-premium-cotton-demo.mp4'
      ]),
      'Returnable': 'yes',
      'HSN Code': '6109',
      'Default SKU': 'YF-TS001',
      'Default Barcode': '1234567890000'
    },
    {
      'Product Name': 'Classic Denim Jeans Regular Fit',
      'Title': 'Classic Blue Denim Jeans - Regular Fit for Men',
      'Description': 'Timeless style meets modern comfort in our classic blue denim jeans. Crafted from premium denim with just the right amount of stretch, these jeans offer a regular fit that flatters every body type. The authentic stonewash finish gives them a lived-in look, while the durable construction ensures they\'ll be a wardrobe staple for years to come. Features classic 5-pocket styling, riveted stress points, and a signature leather patch.',
      'Manufacturing Details': '98% cotton, 2% elastane blend for comfort and durability, stonewashed for authentic vintage look, YKK zipper and copper rivets at stress points, contrast stitching, enzyme washed for softness, sanforized to prevent shrinkage',
      'Shipping Returns': '🚛 Free shipping on all orders | 🔄 45-day return window | 📏 Free hem alterations within 30 days | 💎 Premium packaging | 🎯 Perfect fit guarantee',
      'Regular Price': 79.99,
      'Sale Price': 64.99,
      'Category': 'Clothing',
      'Subcategory': 'Jeans',
      'Meta Title': 'Classic Blue Denim Jeans Regular Fit Men | Premium Quality | YoraaFashion',
      'Meta Description': 'Shop classic blue denim jeans with regular fit. Premium cotton blend, stonewashed finish, 5-pocket styling. Free alterations and shipping. Perfect fit guaranteed!',
      'Slug URL': 'classic-blue-denim-jeans-regular-fit-men',
      'Color Filter': 'Classic Blue,Dark Wash,Light Wash,Black Denim,Grey Wash',
      'Size Filter': '28,30,32,34,36,38,40,42',
      'Brand Filter': 'YoraaFashion',
      'Material Filter': 'Denim',
      'Style Filter': 'Classic',
      'Gender Filter': 'Men',
      'Season Filter': 'All Season',
      'Stock Size Option': 'sizes',
      'Custom Sizes (JSON)': JSON.stringify([
        {
          "size": "30",
          "quantity": "12",
          "hsnCode": "6203",
          "sku": "YF-DJ002-30",
          "barcode": "2234567890001",
          "prices": {
            "amazon": "69.99",
            "flipkart": "67.99",
            "myntra": "72.99",
            "nykaa": "68.99",
            "yoraa": "64.99"
          }
        },
        {
          "size": "32",
          "quantity": "18",
          "hsnCode": "6203",
          "sku": "YF-DJ002-32",
          "barcode": "2234567890002",
          "prices": {
            "amazon": "69.99",
            "flipkart": "67.99",
            "myntra": "72.99",
            "nykaa": "68.99",
            "yoraa": "64.99"
          }
        },
        {
          "size": "34",
          "quantity": "22",
          "hsnCode": "6203",
          "sku": "YF-DJ002-34",
          "barcode": "2234567890003",
          "prices": {
            "amazon": "69.99",
            "flipkart": "67.99",
            "myntra": "72.99",
            "nykaa": "68.99",
            "yoraa": "64.99"
          }
        },
        {
          "size": "36",
          "quantity": "20",
          "hsnCode": "6203",
          "sku": "YF-DJ002-36",
          "barcode": "2234567890004",
          "prices": {
            "amazon": "69.99",
            "flipkart": "67.99",
            "myntra": "72.99",
            "nykaa": "68.99",
            "yoraa": "64.99"
          }
        }
      ]),
      'Common CM Chart URL': 'https://cdn.yoraafashion.com/size-charts/jeans-men-cm-chart.jpg',
      'Common Inch Chart URL': 'https://cdn.yoraafashion.com/size-charts/jeans-men-inch-chart.jpg',
      'Common Measurement Guide URL': 'https://cdn.yoraafashion.com/guides/how-to-measure-jeans.jpg',
      'You Might Also Like': 'yes',
      'Similar Items': 'yes',
      'Others Also Bought': 'yes',
      'Image URLs (JSON)': JSON.stringify([
        'https://cdn.yoraafashion.com/products/classic-denim-jeans/classic-blue-front.jpg',
        'https://cdn.yoraafashion.com/products/classic-denim-jeans/classic-blue-back.jpg',
        'https://cdn.yoraafashion.com/products/classic-denim-jeans/classic-blue-side.jpg',
        'https://cdn.yoraafashion.com/products/classic-denim-jeans/denim-texture.jpg',
        'https://cdn.yoraafashion.com/products/classic-denim-jeans/lifestyle-casual.jpg',
        'https://cdn.yoraafashion.com/products/classic-denim-jeans/pocket-detail.jpg'
      ]),
      'Video URLs (JSON)': JSON.stringify([
        'https://cdn.yoraafashion.com/videos/denim-jeans-fit-guide.mp4'
      ]),
      'Returnable': 'yes',
      'HSN Code': '6203',
      'Default SKU': 'YF-DJ002',
      'Default Barcode': '2234567890000'
    },
    {
      'Product Name': 'Wireless Bluetooth Noise-Cancelling Headphones',
      'Title': 'Premium Wireless Bluetooth Headphones with Active Noise Cancellation',
      'Description': 'Immerse yourself in crystal-clear audio with our premium wireless Bluetooth headphones. Featuring advanced active noise cancellation technology, these headphones block out external distractions for an unparalleled listening experience. The 40mm drivers deliver rich, detailed sound across all frequencies, while the comfortable over-ear design ensures hours of fatigue-free listening. With 30-hour battery life and quick-charge capability, these headphones are perfect for travel, work, or leisure.',
      'Manufacturing Details': 'Advanced Bluetooth 5.2 connectivity, 40mm neodymium drivers, active noise cancellation with 3 levels, memory foam ear cushions, foldable design, premium matte finish, built-in microphone with echo cancellation, USB-C charging',
      'Shipping Returns': '📦 Premium packaging with hard case | 🔄 60-day satisfaction guarantee | ⚡ 1-year manufacturer warranty | 🎧 24/7 technical support | 🚚 Express shipping available',
      'Regular Price': 199.99,
      'Sale Price': 149.99,
      'Category': 'Electronics',
      'Subcategory': 'Audio',
      'Meta Title': 'Premium Wireless Bluetooth Headphones with Noise Cancellation | YoraaAudio',
      'Meta Description': 'Experience premium sound with our wireless Bluetooth headphones. Active noise cancellation, 30-hour battery, comfortable fit. Perfect for travel and work.',
      'Slug URL': 'premium-wireless-bluetooth-headphones-noise-cancellation',
      'Color Filter': 'Midnight Black,Pearl White,Space Grey,Rose Gold',
      'Size Filter': '',
      'Brand Filter': 'YoraaAudio',
      'Material Filter': 'Plastic,Metal,Memory Foam',
      'Style Filter': 'Modern',
      'Gender Filter': 'Unisex',
      'Season Filter': 'All Season',
      'Stock Size Option': 'noSize',
      'Custom Sizes (JSON)': JSON.stringify([]),
      'Common CM Chart URL': '',
      'Common Inch Chart URL': '',
      'Common Measurement Guide URL': 'https://cdn.yoraafashion.com/guides/headphone-fitting-guide.jpg',
      'You Might Also Like': 'yes',
      'Similar Items': 'yes',
      'Others Also Bought': 'yes',
      'Image URLs (JSON)': JSON.stringify([
        'https://cdn.yoraafashion.com/products/wireless-headphones/midnight-black-main.jpg',
        'https://cdn.yoraafashion.com/products/wireless-headphones/midnight-black-side.jpg',
        'https://cdn.yoraafashion.com/products/wireless-headphones/controls-detail.jpg',
        'https://cdn.yoraafashion.com/products/wireless-headphones/packaging-contents.jpg',
        'https://cdn.yoraafashion.com/products/wireless-headphones/lifestyle-travel.jpg'
      ]),
      'Video URLs (JSON)': JSON.stringify([
        'https://cdn.yoraafashion.com/videos/headphones-noise-cancellation-demo.mp4',
        'https://cdn.yoraafashion.com/videos/headphones-unboxing.mp4'
      ]),
      'Returnable': 'yes',
      'HSN Code': '8518',
      'Default SKU': 'YA-WH003',
      'Default Barcode': '3234567890000'
    },
    {
      'Product Name': 'Elegant Silk Scarf Collection',
      'Title': 'Luxury Silk Scarf - Handcrafted with Artistic Patterns',
      'Description': 'Elevate your style with our exquisite silk scarf collection. Each scarf is handcrafted from 100% pure mulberry silk and features unique artistic patterns inspired by nature and contemporary art. The luxurious feel and vibrant colors make these scarves perfect for both casual and formal occasions. Whether worn around the neck, as a headband, or tied to a handbag, these versatile accessories add a touch of elegance to any outfit.',
      'Manufacturing Details': '100% pure mulberry silk, hand-rolled edges, digital printing with eco-friendly dyes, 90cm x 90cm dimensions, lightweight and breathable, color-fast treatment, presented in luxury gift box',
      'Shipping Returns': '🎁 Luxury gift packaging included | 🔄 30-day return policy | 🧽 Free silk care instructions | 💫 Authenticity certificate | 🌍 International shipping available',
      'Regular Price': 89.99,
      'Sale Price': 69.99,
      'Category': 'Accessories',
      'Subcategory': 'Scarves',
      'Meta Title': 'Luxury Silk Scarf Collection - Handcrafted Artistic Patterns | YoraaFashion',
      'Meta Description': 'Shop our luxury silk scarf collection. 100% pure mulberry silk with artistic patterns. Perfect accessory for any occasion. Free gift packaging included.',
      'Slug URL': 'luxury-silk-scarf-collection-artistic-patterns',
      'Color Filter': 'Emerald Green,Royal Blue,Sunset Orange,Rose Pink,Golden Yellow,Deep Purple',
      'Size Filter': '90cm x 90cm',
      'Brand Filter': 'YoraaFashion',
      'Material Filter': 'Silk',
      'Style Filter': 'Elegant',
      'Gender Filter': 'Women',
      'Season Filter': 'All Season',
      'Stock Size Option': 'noSize',
      'Custom Sizes (JSON)': JSON.stringify([]),
      'Common CM Chart URL': '',
      'Common Inch Chart URL': '',
      'Common Measurement Guide URL': 'https://cdn.yoraafashion.com/guides/scarf-styling-guide.jpg',
      'You Might Also Like': 'yes',
      'Similar Items': 'yes',
      'Others Also Bought': 'no',
      'Image URLs (JSON)': JSON.stringify([
        'https://cdn.yoraafashion.com/products/silk-scarf/emerald-pattern-flat.jpg',
        'https://cdn.yoraafashion.com/products/silk-scarf/emerald-pattern-worn.jpg',
        'https://cdn.yoraafashion.com/products/silk-scarf/texture-closeup.jpg',
        'https://cdn.yoraafashion.com/products/silk-scarf/gift-packaging.jpg',
        'https://cdn.yoraafashion.com/products/silk-scarf/styling-options.jpg'
      ]),
      'Video URLs (JSON)': JSON.stringify([
        'https://cdn.yoraafashion.com/videos/silk-scarf-styling-tutorial.mp4'
      ]),
      'Returnable': 'yes',
      'HSN Code': '6214',
      'Default SKU': 'YF-SS004',
      'Default Barcode': '4234567890000'
    },
    {
      'Product Name': 'Professional Running Shoes',
      'Title': 'Professional Running Shoes - Advanced Cushioning Technology',
      'Description': 'Take your running performance to the next level with our professional running shoes. Engineered with advanced cushioning technology and breathable mesh construction, these shoes provide optimal comfort and support for runners of all levels. The responsive midsole returns energy with each step, while the durable outsole offers excellent traction on various surfaces. Perfect for daily training, marathon preparation, or casual jogging.',
      'Manufacturing Details': 'Breathable engineered mesh upper, responsive foam midsole with energy return, carbon fiber plate for propulsion, durable rubber outsole with multi-directional traction, reflective elements for visibility, antimicrobial treatment',
      'Shipping Returns': '🏃 30-day performance guarantee | 🔄 Easy returns if not satisfied | 👟 Free size exchange | 📊 Running performance tracking app included | 🚚 Same-day shipping in metro areas',
      'Regular Price': 159.99,
      'Sale Price': 129.99,
      'Category': 'Footwear',
      'Subcategory': 'Sports Shoes',
      'Meta Title': 'Professional Running Shoes - Advanced Cushioning | YoraaFashion',
      'Meta Description': 'Enhance your running with our professional running shoes. Advanced cushioning, energy return technology, breathable design. Perfect for all running levels.',
      'Slug URL': 'professional-running-shoes-advanced-cushioning',
      'Color Filter': 'Electric Blue,Neon Green,Carbon Black,Solar Red,Arctic White',
      'Size Filter': '6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12',
      'Brand Filter': 'YoraaAthletic',
      'Material Filter': 'Mesh,Foam,Rubber',
      'Style Filter': 'Athletic',
      'Gender Filter': 'Unisex',
      'Season Filter': 'All Season',
      'Stock Size Option': 'sizes',
      'Custom Sizes (JSON)': JSON.stringify([
        {
          "size": "8",
          "quantity": "15",
          "hsnCode": "6404",
          "sku": "YA-RS005-8",
          "barcode": "5234567890001",
          "prices": {
            "amazon": "139.99",
            "flipkart": "134.99",
            "myntra": "144.99",
            "nykaa": "137.99",
            "yoraa": "129.99"
          }
        },
        {
          "size": "8.5",
          "quantity": "18",
          "hsnCode": "6404",
          "sku": "YA-RS005-8.5",
          "barcode": "5234567890002",
          "prices": {
            "amazon": "139.99",
            "flipkart": "134.99",
            "myntra": "144.99",
            "nykaa": "137.99",
            "yoraa": "129.99"
          }
        },
        {
          "size": "9",
          "quantity": "25",
          "hsnCode": "6404",
          "sku": "YA-RS005-9",
          "barcode": "5234567890003",
          "prices": {
            "amazon": "139.99",
            "flipkart": "134.99",
            "myntra": "144.99",
            "nykaa": "137.99",
            "yoraa": "129.99"
          }
        },
        {
          "size": "9.5",
          "quantity": "22",
          "hsnCode": "6404",
          "sku": "YA-RS005-9.5",
          "barcode": "5234567890004",
          "prices": {
            "amazon": "139.99",
            "flipkart": "134.99",
            "myntra": "144.99",
            "nykaa": "137.99",
            "yoraa": "129.99"
          }
        },
        {
          "size": "10",
          "quantity": "20",
          "hsnCode": "6404",
          "sku": "YA-RS005-10",
          "barcode": "5234567890005",
          "prices": {
            "amazon": "139.99",
            "flipkart": "134.99",
            "myntra": "144.99",
            "nykaa": "137.99",
            "yoraa": "129.99"
          }
        }
      ]),
      'Common CM Chart URL': 'https://cdn.yoraafashion.com/size-charts/shoes-unisex-cm-chart.jpg',
      'Common Inch Chart URL': 'https://cdn.yoraafashion.com/size-charts/shoes-unisex-inch-chart.jpg',
      'Common Measurement Guide URL': 'https://cdn.yoraafashion.com/guides/how-to-measure-feet.jpg',
      'You Might Also Like': 'yes',
      'Similar Items': 'yes',
      'Others Also Bought': 'yes',
      'Image URLs (JSON)': JSON.stringify([
        'https://cdn.yoraafashion.com/products/running-shoes/electric-blue-main.jpg',
        'https://cdn.yoraafashion.com/products/running-shoes/electric-blue-side.jpg',
        'https://cdn.yoraafashion.com/products/running-shoes/sole-technology.jpg',
        'https://cdn.yoraafashion.com/products/running-shoes/mesh-detail.jpg',
        'https://cdn.yoraafashion.com/products/running-shoes/action-running.jpg',
        'https://cdn.yoraafashion.com/products/running-shoes/size-comparison.jpg'
      ]),
      'Video URLs (JSON)': JSON.stringify([
        'https://cdn.yoraafashion.com/videos/running-shoes-technology-demo.mp4',
        'https://cdn.yoraafashion.com/videos/running-shoes-performance-test.mp4'
      ]),
      'Returnable': 'yes',
      'HSN Code': '6404',
      'Default SKU': 'YA-RS005',
      'Default Barcode': '5234567890000'
    }
  ];

  // Create empty template with all headers
  const templateHeaders = Object.keys(sampleProducts[0]);
  const emptyTemplate = [templateHeaders];

  return {
    instructions,
    fieldGuide,
    sampleProducts,
    emptyTemplate,
    templateHeaders
  };
};

// Create comprehensive Excel files
const createComprehensiveExcelFiles = () => {
  const { instructions, fieldGuide, sampleProducts, emptyTemplate, templateHeaders } = generateComprehensiveTemplates();

  console.log('🚀 Creating comprehensive Excel templates...');

  // 1. Complete Template (All fields including images)
  const completeWB = XLSX.utils.book_new();
  
  const instructionsWS = XLSX.utils.aoa_to_sheet(instructions);
  XLSX.utils.book_append_sheet(completeWB, instructionsWS, 'Instructions');
  
  const fieldGuideWS = XLSX.utils.aoa_to_sheet(fieldGuide);
  XLSX.utils.book_append_sheet(completeWB, fieldGuideWS, 'Field_Guide');
  
  const sampleWS = XLSX.utils.json_to_sheet(sampleProducts);
  XLSX.utils.book_append_sheet(completeWB, sampleWS, 'Sample_Products');
  
  const templateWS = XLSX.utils.aoa_to_sheet(emptyTemplate);
  XLSX.utils.book_append_sheet(completeWB, templateWS, 'Upload_Template');

  XLSX.writeFile(completeWB, 'excel-templates/Yoraa_Complete_Product_Upload_Template.xlsx');
  console.log('✅ Created: Yoraa_Complete_Product_Upload_Template.xlsx');

  // 2. Text-Only Template (No image/video URLs)
  const textOnlyProducts = sampleProducts.map(product => {
    const { 'Image URLs (JSON)': images, 'Video URLs (JSON)': videos, ...textFields } = product;
    return textFields;
  });
  
  const textOnlyHeaders = Object.keys(textOnlyProducts[0]);
  const textOnlyTemplate = [textOnlyHeaders];
  
  const textOnlyFieldGuide = fieldGuide.filter(row => 
    row[0] !== 'Image URLs (JSON)' && row[0] !== 'Video URLs (JSON)'
  );

  const textOnlyWB = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(textOnlyWB, instructionsWS, 'Instructions');
  
  const textOnlyFieldWS = XLSX.utils.aoa_to_sheet(textOnlyFieldGuide);
  XLSX.utils.book_append_sheet(textOnlyWB, textOnlyFieldWS, 'Field_Guide');
  
  const textOnlySampleWS = XLSX.utils.json_to_sheet(textOnlyProducts);
  XLSX.utils.book_append_sheet(textOnlyWB, textOnlySampleWS, 'Sample_Products');
  
  const textOnlyTemplateWS = XLSX.utils.aoa_to_sheet(textOnlyTemplate);
  XLSX.utils.book_append_sheet(textOnlyWB, textOnlyTemplateWS, 'Upload_Template');

  XLSX.writeFile(textOnlyWB, 'excel-templates/Yoraa_Text_Details_Upload_Template.xlsx');
  console.log('✅ Created: Yoraa_Text_Details_Upload_Template.xlsx');

  // 3. Images Template (Includes image/video URLs)
  const imagesWB = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(imagesWB, instructionsWS, 'Instructions');
  XLSX.utils.book_append_sheet(imagesWB, fieldGuideWS, 'Field_Guide');
  XLSX.utils.book_append_sheet(imagesWB, sampleWS, 'Sample_Products');
  XLSX.utils.book_append_sheet(imagesWB, templateWS, 'Upload_Template');

  XLSX.writeFile(imagesWB, 'excel-templates/Yoraa_Products_With_Images_Template.xlsx');
  console.log('✅ Created: Yoraa_Products_With_Images_Template.xlsx');

  // 4. Simple Template (Basic fields only)
  const basicFields = [
    'Product Name', 'Title', 'Description', 'Regular Price', 'Sale Price',
    'Category', 'Subcategory', 'Color Filter', 'Size Filter', 'Brand Filter',
    'Stock Size Option', 'Returnable'
  ];
  
  const basicProducts = sampleProducts.map(product => {
    const basicProduct = {};
    basicFields.forEach(field => {
      if (product[field] !== undefined) {
        basicProduct[field] = product[field];
      }
    });
    return basicProduct;
  });
  
  const basicTemplate = [basicFields];
  const basicFieldGuide = fieldGuide.filter(row => basicFields.includes(row[0]));

  const basicWB = XLSX.utils.book_new();
  
  // Simple instructions for basic template
  const basicInstructions = [
    ['YORAA SIMPLE BULK UPLOAD'],
    [''],
    ['This simplified template includes only the essential fields for quick product upload.'],
    [''],
    ['📋 INCLUDED FIELDS:'],
    ['• Product Name, Title, Description (Required)'],
    ['• Regular Price, Sale Price (Required/Optional)'],
    ['• Category, Subcategory (Required)'],
    ['• Basic filters: Color, Size, Brand'],
    ['• Stock Size Option and Returnable status'],
    [''],
    ['🚀 HOW TO USE:'],
    ['1. Fill the Upload_Template sheet with your basic product data'],
    ['2. Check Sample_Products for proper formatting'],
    ['3. Save and upload through bulk upload feature'],
    [''],
    ['💡 TIP: For advanced features like stock management, size charts, and images,'],
    ['use the Complete Template instead.']
  ];
  
  const basicInstructionsWS = XLSX.utils.aoa_to_sheet(basicInstructions);
  XLSX.utils.book_append_sheet(basicWB, basicInstructionsWS, 'Instructions');
  
  const basicFieldWS = XLSX.utils.aoa_to_sheet(basicFieldGuide);
  XLSX.utils.book_append_sheet(basicWB, basicFieldWS, 'Field_Guide');
  
  const basicSampleWS = XLSX.utils.json_to_sheet(basicProducts);
  XLSX.utils.book_append_sheet(basicWB, basicSampleWS, 'Sample_Products');
  
  const basicTemplateWS = XLSX.utils.aoa_to_sheet(basicTemplate);
  XLSX.utils.book_append_sheet(basicWB, basicTemplateWS, 'Upload_Template');

  XLSX.writeFile(basicWB, 'excel-templates/Yoraa_Simple_Product_Upload_Template.xlsx');
  console.log('✅ Created: Yoraa_Simple_Product_Upload_Template.xlsx');

  console.log('\n🎉 All comprehensive templates created successfully!');
  console.log('\n📋 Available Templates:');
  console.log('1. Yoraa_Complete_Product_Upload_Template.xlsx - All fields with comprehensive examples');
  console.log('2. Yoraa_Text_Details_Upload_Template.xlsx - Text fields only (no images/videos)');
  console.log('3. Yoraa_Products_With_Images_Template.xlsx - All fields including image/video URLs');
  console.log('4. Yoraa_Simple_Product_Upload_Template.xlsx - Essential fields only for quick upload');
  
  console.log('\n✨ Features included:');
  console.log('• Comprehensive field documentation');
  console.log('• 5 realistic product examples across different categories');
  console.log('• Detailed validation rules and examples');
  console.log('• Stock size management with multi-platform pricing');
  console.log('• Size chart and measurement guide URLs');
  console.log('• Product visibility and recommendation settings');
  console.log('• Image and video URL management');
  console.log('• HSN codes, SKUs, and barcode support');
  console.log('• SEO metadata fields');
  console.log('• Complete filter system support');
  
  console.log('\n📥 Templates are ready for download from the excel-templates folder!');
};

// Generate all templates
createComprehensiveExcelFiles();
