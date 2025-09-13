// Test script to generate Excel templates for demonstration
import { createBulkUploadTemplates, downloadBulkUploadTemplate } from './final/src/utils/excelTemplates.js';
import * as XLSX from 'xlsx';

console.log('🚀 Generating Yoraa Bulk Upload Excel Templates...');

try {
  // Generate both templates
  const templates = createBulkUploadTemplates();
  
  console.log('✅ Templates created successfully!');
  
  // Save Text Only Template
  XLSX.writeFile(templates.textOnly, 'Yoraa_Bulk_Upload_Text_Only_DEMO.xlsx');
  console.log('📄 Text Only Template saved as: Yoraa_Bulk_Upload_Text_Only_DEMO.xlsx');
  
  // Save Text + Images Template  
  XLSX.writeFile(templates.textImage, 'Yoraa_Bulk_Upload_Text_Images_DEMO.xlsx');
  console.log('🖼️ Text + Images Template saved as: Yoraa_Bulk_Upload_Text_Images_DEMO.xlsx');
  
  console.log('\n📋 Template Features:');
  console.log('✅ Instructions Sheet - Step-by-step guidance');
  console.log('✅ Field Descriptions - Detailed field explanations with examples');
  console.log('✅ Sample Data - 5 complete product examples:');
  console.log('   • Premium Cotton T-Shirt (Clothing)');
  console.log('   • Slim Fit Denim Jeans (Clothing)'); 
  console.log('   • Wireless Bluetooth Earbuds (Electronics)');
  console.log('   • Organic Skincare Set (Beauty)');
  console.log('   • Smart Fitness Tracker (Electronics)');
  console.log('✅ Empty Template - Ready for your data');
  
  console.log('\n🔤 Fields Included:');
  console.log('• Product Name, Title, Description');
  console.log('• Manufacturing Details, Shipping Returns');
  console.log('• Pricing (Regular & Sale)');
  console.log('• Category & Subcategory');
  console.log('• SEO Fields (Meta Title, Description, Slug URL)');
  console.log('• Filter Tags (Color, Size, Brand, Material, Style, Gender, Season)');
  console.log('• Stock Sizes (JSON)');
  console.log('• Custom Sizes with Multi-platform Pricing (JSON)');
  console.log('• Image URLs (Text+Images template only)');
  console.log('• Video URLs (Text+Images template only)');
  
  console.log('\n📊 Sample Data Features:');
  console.log('• Realistic product descriptions');
  console.log('• Proper JSON formatting examples');
  console.log('• Multi-platform pricing (Amazon, Flipkart, Myntra, Nykaa, Yoraa)');
  console.log('• Complete size charts with SKUs and barcodes');
  console.log('• SEO-optimized meta data');
  console.log('• Professional product images (Unsplash URLs)');
  
  console.log('\n🎯 Ready to use! Open the Excel files to see the comprehensive templates.');
  
} catch (error) {
  console.error('❌ Error generating templates:', error);
}
