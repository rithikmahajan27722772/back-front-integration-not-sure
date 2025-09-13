import React, { useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Download, 
  FileText, 
  Image, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowLeft,
  Plus,
  Info,
  Zap,
  Star
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { createProduct } from '../store/slices/productsSlice';
import {
  fetchCategories,
} from '../store/slices/categoriesSlice';
import {
  fetchSubCategories,
} from '../store/slices/subCategoriesSlice';
import { downloadBulkUploadTemplate } from '../utils/excelTemplates';

/**
 * BulkUpload Component
 * 
 * Provides two main functionalities:
 * 1. Text-only bulk upload via Excel sheet
 * 2. Text + Image URL bulk upload via Excel sheet
 * 
 * Features:
 * - Download Excel templates
 * - Upload and validate Excel files
 * - Preview data before submission
 * - Batch create products
 * - Progress tracking
 */

const BulkUpload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const imageFileInputRef = useRef(null);

  // Redux state
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const createLoading = useSelector(state => state.products.createLoading);
  const categories = useSelector(state => state.categories.categories);
  const subCategories = useSelector(state => state.subCategories.subCategories);

  // Local state
  const [uploadType, setUploadType] = useState('text'); // 'text' or 'text-image'
  const [uploadedData, setUploadedData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState({ success: [], failed: [] });
  const [currentStep, setCurrentStep] = useState('upload'); // 'upload', 'preview', 'processing', 'complete'
  const [validationErrors, setValidationErrors] = useState([]);

  // Excel template structures - Updated with all fields from SingleProductUpload
  const TEXT_ONLY_TEMPLATE = {
    headers: [
      // Basic Product Info
      'Product Name', 'Title', 'Description', 'Manufacturing Details', 
      'Shipping Returns', 'Regular Price', 'Sale Price', 'Category', 
      'Subcategory', 'Meta Title', 'Meta Description', 'Slug URL',
      
      // Product Filters
      'Color Filter', 'Size Filter', 'Brand Filter', 'Material Filter', 
      'Style Filter', 'Gender Filter', 'Season Filter',
      
      // Stock Size Options
      'Stock Size Option', // 'noSize', 'sizes', 'import'
      'Custom Sizes (JSON)', // Array of size objects
      
      // Common Size Charts (URLs)
      'Common CM Chart URL', 'Common Inch Chart URL', 'Common Measurement Guide URL',
      
      // Also Show In Options
      'You Might Also Like', 'Similar Items', 'Others Also Bought',
      
      // Additional Fields
      'Returnable', // 'yes' or 'no'
      'HSN Code', 'Default SKU', 'Default Barcode'
    ],
    sampleData: [
      {
        // Basic Product Info
        'Product Name': 'Premium Cotton T-Shirt',
        'Title': 'Premium Cotton T-Shirt - Comfortable Fit',
        'Description': 'High-quality 100% cotton t-shirt with comfortable fit and premium fabric. Perfect for casual wear.',
        'Manufacturing Details': 'Made from premium cotton fabric, pre-shrunk, color-fast, machine washable',
        'Shipping Returns': '7-day return policy, free shipping above $50, hassle-free returns',
        'Regular Price': '29.99',
        'Sale Price': '24.99',
        'Category': 'Clothing',
        'Subcategory': 'T-Shirts',
        'Meta Title': 'Premium Cotton T-Shirt | Comfortable Fit | YoraaFashion',
        'Meta Description': 'Shop premium cotton t-shirts with comfortable fit. High-quality fabric, various colors available.',
        'Slug URL': 'premium-cotton-t-shirt-comfortable-fit',
        
        // Product Filters (comma-separated for multiple values)
        'Color Filter': 'Blue,Red,White',
        'Size Filter': 'S,M,L,XL',
        'Brand Filter': 'YoraaFashion',
        'Material Filter': 'Cotton',
        'Style Filter': 'Casual',
        'Gender Filter': 'Unisex',
        'Season Filter': 'All Season',
        
        // Stock Size Options
        'Stock Size Option': 'sizes',
        'Custom Sizes (JSON)': '[{"size":"S","quantity":"10","hsnCode":"6109","sku":"TS001S","barcode":"123456789","prices":{"amazon":"25","flipkart":"24","myntra":"26","nykaa":"25","yoraa":"24"}},{"size":"M","quantity":"15","hsnCode":"6109","sku":"TS001M","barcode":"123456790","prices":{"amazon":"25","flipkart":"24","myntra":"26","nykaa":"25","yoraa":"24"}},{"size":"L","quantity":"12","hsnCode":"6109","sku":"TS001L","barcode":"123456791","prices":{"amazon":"25","flipkart":"24","myntra":"26","nykaa":"25","yoraa":"24"}}]',
        
        // Common Size Charts (URLs)
        'Common CM Chart URL': 'https://example.com/size-chart-cm.jpg',
        'Common Inch Chart URL': 'https://example.com/size-chart-inch.jpg',
        'Common Measurement Guide URL': 'https://example.com/measurement-guide.jpg',
        
        // Also Show In Options
        'You Might Also Like': 'yes',
        'Similar Items': 'yes',
        'Others Also Bought': 'no',
        
        // Additional Fields
        'Returnable': 'yes',
        'HSN Code': '6109',
        'Default SKU': 'TS001',
        'Default Barcode': '1234567890123'
      }
    ]
  };

  const TEXT_IMAGE_TEMPLATE = {
    headers: [
      // Basic Product Info
      'Product Name', 'Title', 'Description', 'Manufacturing Details', 
      'Shipping Returns', 'Regular Price', 'Sale Price', 'Category', 
      'Subcategory', 'Meta Title', 'Meta Description', 'Slug URL',
      
      // Product Filters
      'Color Filter', 'Size Filter', 'Brand Filter', 'Material Filter', 
      'Style Filter', 'Gender Filter', 'Season Filter',
      
      // Stock Size Options
      'Stock Size Option', // 'noSize', 'sizes', 'import'
      'Custom Sizes (JSON)', // Array of size objects
      
      // Common Size Charts (URLs)
      'Common CM Chart URL', 'Common Inch Chart URL', 'Common Measurement Guide URL',
      
      // Also Show In Options
      'You Might Also Like', 'Similar Items', 'Others Also Bought',
      
      // Media URLs
      'Image URLs (JSON)', 'Video URLs (JSON)',
      
      // Additional Fields
      'Returnable', // 'yes' or 'no'
      'HSN Code', 'Default SKU', 'Default Barcode'
    ],
    sampleData: [
      {
        // Basic Product Info
        'Product Name': 'Premium Cotton T-Shirt',
        'Title': 'Premium Cotton T-Shirt - Comfortable Fit',
        'Description': 'High-quality 100% cotton t-shirt with comfortable fit and premium fabric. Perfect for casual wear.',
        'Manufacturing Details': 'Made from premium cotton fabric, pre-shrunk, color-fast, machine washable',
        'Shipping Returns': '7-day return policy, free shipping above $50, hassle-free returns',
        'Regular Price': '29.99',
        'Sale Price': '24.99',
        'Category': 'Clothing',
        'Subcategory': 'T-Shirts',
        'Meta Title': 'Premium Cotton T-Shirt | Comfortable Fit | YoraaFashion',
        'Meta Description': 'Shop premium cotton t-shirts with comfortable fit. High-quality fabric, various colors available.',
        'Slug URL': 'premium-cotton-t-shirt-comfortable-fit',
        
        // Product Filters (comma-separated for multiple values)
        'Color Filter': 'Blue,Red,White',
        'Size Filter': 'S,M,L,XL',
        'Brand Filter': 'YoraaFashion',
        'Material Filter': 'Cotton',
        'Style Filter': 'Casual',
        'Gender Filter': 'Unisex',
        'Season Filter': 'All Season',
        
        // Stock Size Options
        'Stock Size Option': 'sizes',
        'Custom Sizes (JSON)': '[{"size":"S","quantity":"10","hsnCode":"6109","sku":"TS001S","barcode":"123456789","prices":{"amazon":"25","flipkart":"24","myntra":"26","nykaa":"25","yoraa":"24"}},{"size":"M","quantity":"15","hsnCode":"6109","sku":"TS001M","barcode":"123456790","prices":{"amazon":"25","flipkart":"24","myntra":"26","nykaa":"25","yoraa":"24"}},{"size":"L","quantity":"12","hsnCode":"6109","sku":"TS001L","barcode":"123456791","prices":{"amazon":"25","flipkart":"24","myntra":"26","nykaa":"25","yoraa":"24"}}]',
        
        // Common Size Charts (URLs)
        'Common CM Chart URL': 'https://example.com/size-chart-cm.jpg',
        'Common Inch Chart URL': 'https://example.com/size-chart-inch.jpg',
        'Common Measurement Guide URL': 'https://example.com/measurement-guide.jpg',
        
        // Also Show In Options
        'You Might Also Like': 'yes',
        'Similar Items': 'yes',
        'Others Also Bought': 'no',
        
        // Media URLs
        'Image URLs (JSON)': '["https://example.com/tshirt-front.jpg","https://example.com/tshirt-back.jpg","https://example.com/tshirt-side.jpg","https://example.com/tshirt-detail.jpg"]',
        'Video URLs (JSON)': '["https://example.com/tshirt-demo.mp4"]',
        
        // Additional Fields
        'Returnable': 'yes',
        'HSN Code': '6109',
        'Default SKU': 'TS001',
        'Default Barcode': '1234567890123'
      }
    ]
  };

  // Download Excel template using our pre-generated templates
    // Download template function
  const downloadTemplate = (templateType) => {
    const templates = {
      complete: '/excel-templates/Product_Complete_Template_Clean.xlsx',
      textOnly: '/excel-templates/Product_Text_Details_Template_Clean.xlsx', 
      withImages: '/excel-templates/Product_With_Images_Template_Clean.xlsx',
      simple: '/excel-templates/Product_Simple_Template_Clean.xlsx',
      // Empty versions (headers + 1 example)
      completeEmpty: '/excel-templates/Product_Complete_Template_Empty.xlsx',
      textOnlyEmpty: '/excel-templates/Product_Text_Details_Template_Empty.xlsx',
      simpleEmpty: '/excel-templates/Product_Simple_Template_Empty.xlsx'
    };

    const templateUrl = templates[templateType];
    if (templateUrl) {
      const link = document.createElement('a');
      link.href = templateUrl;
      link.download = templateUrl.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Validate Excel data
  const validateData = useCallback((data) => {
    const errors = [];
    const requiredFields = [
      'Product Name', 'Title', 'Description', 'Regular Price', 
      'Category', 'Subcategory'
    ];

    data.forEach((row, index) => {
      const rowErrors = [];
      
      // Check required fields
      requiredFields.forEach(field => {
        if (!row[field] || row[field].toString().trim() === '') {
          rowErrors.push(`${field} is required`);
        }
      });

      // Validate prices
      if (row['Regular Price'] && isNaN(parseFloat(row['Regular Price']))) {
        rowErrors.push('Regular Price must be a valid number');
      }
      
      if (row['Sale Price'] && isNaN(parseFloat(row['Sale Price']))) {
        rowErrors.push('Sale Price must be a valid number');
      }

      if (row['Regular Price'] && row['Sale Price'] && 
          parseFloat(row['Sale Price']) >= parseFloat(row['Regular Price'])) {
        rowErrors.push('Sale Price must be less than Regular Price');
      }

      // Validate Stock Size Option
      const validStockSizeOptions = ['noSize', 'sizes', 'import'];
      if (row['Stock Size Option'] && !validStockSizeOptions.includes(row['Stock Size Option'])) {
        rowErrors.push('Stock Size Option must be one of: noSize, sizes, import');
      }

      // Validate Also Show In Options
      const alsoShowInFields = ['You Might Also Like', 'Similar Items', 'Others Also Bought'];
      alsoShowInFields.forEach(field => {
        if (row[field] && !['yes', 'no'].includes(row[field].toLowerCase())) {
          rowErrors.push(`${field} must be either 'yes' or 'no'`);
        }
      });

      // Validate Returnable field
      if (row['Returnable'] && !['yes', 'no'].includes(row['Returnable'].toLowerCase())) {
        rowErrors.push('Returnable must be either \'yes\' or \'no\'');
      }

      // Validate JSON fields
      const jsonFields = ['Custom Sizes (JSON)', 'Image URLs (JSON)', 'Video URLs (JSON)'];
      jsonFields.forEach(field => {
        if (row[field] && row[field].toString().trim() !== '') {
          try {
            const parsed = JSON.parse(row[field]);
            
            // Additional validation for Custom Sizes JSON
            if (field === 'Custom Sizes (JSON)' && Array.isArray(parsed)) {
              parsed.forEach((size, sizeIndex) => {
                if (!size.size || !size.quantity) {
                  rowErrors.push(`Custom Sizes item ${sizeIndex + 1} must have 'size' and 'quantity' fields`);
                }
                if (size.prices && typeof size.prices !== 'object') {
                  rowErrors.push(`Custom Sizes item ${sizeIndex + 1} 'prices' must be an object`);
                }
              });
            }
            
            // Additional validation for Image/Video URLs
            if ((field === 'Image URLs (JSON)' || field === 'Video URLs (JSON)') && Array.isArray(parsed)) {
              parsed.forEach((url, urlIndex) => {
                if (typeof url !== 'string' || !url.trim()) {
                  rowErrors.push(`${field} item ${urlIndex + 1} must be a valid URL string`);
                }
              });
            }
          } catch (e) {
            rowErrors.push(`${field} must be valid JSON format`);
          }
        }
      });

      // Validate URL fields
      const urlFields = ['Common CM Chart URL', 'Common Inch Chart URL', 'Common Measurement Guide URL'];
      urlFields.forEach(field => {
        if (row[field] && row[field].toString().trim() !== '') {
          try {
            new URL(row[field]);
          } catch (e) {
            rowErrors.push(`${field} must be a valid URL`);
          }
        }
      });

      if (rowErrors.length > 0) {
        errors.push({
          row: index + 1,
          errors: rowErrors
        });
      }
    });

    return errors;
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setValidationErrors([]);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets['Data'];
      
      if (!worksheet) {
        throw new Error('Data sheet not found. Please use the provided template.');
      }

      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (jsonData.length === 0) {
        throw new Error('No data found in the Excel file.');
      }

      // Validate data
      const errors = validateData(jsonData);
      
      if (errors.length > 0) {
        setValidationErrors(errors);
        setCurrentStep('upload');
      } else {
        setUploadedData(jsonData);
        setPreviewData(jsonData.slice(0, 5)); // Show first 5 rows for preview
        setCurrentStep('preview');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setValidationErrors([{ row: 'File', errors: [error.message] }]);
    } finally {
      setIsProcessing(false);
    }
  }, [validateData]);

  // Process bulk upload
  const processBulkUpload = useCallback(async () => {
    setCurrentStep('processing');
    setUploadProgress(0);
    const results = { success: [], failed: [] };

    for (let i = 0; i < uploadedData.length; i++) {
      try {
        const row = uploadedData[i];
        
        // Transform Excel row to product format
        const productData = {
          productName: row['Product Name'],
          title: row['Title'],
          description: row['Description'],
          manufacturingDetails: row['Manufacturing Details'] || '',
          shippingReturns: row['Shipping Returns'] || '',
          regularPrice: parseFloat(row['Regular Price']),
          salePrice: row['Sale Price'] ? parseFloat(row['Sale Price']) : '',
          category: row['Category'],
          subcategory: row['Subcategory'],
          metaTitle: row['Meta Title'] || '',
          metaDescription: row['Meta Description'] || '',
          slugUrl: row['Slug URL'] || '',
          returnable: row['Returnable'] || 'yes',
          
          // Process filter fields (comma-separated values)
          filters: {
            color: row['Color Filter'] ? row['Color Filter'].split(',').map(s => s.trim()) : [],
            size: row['Size Filter'] ? row['Size Filter'].split(',').map(s => s.trim()) : [],
            brand: row['Brand Filter'] ? row['Brand Filter'].split(',').map(s => s.trim()) : [],
            material: row['Material Filter'] ? row['Material Filter'].split(',').map(s => s.trim()) : [],
            style: row['Style Filter'] ? row['Style Filter'].split(',').map(s => s.trim()) : [],
            gender: row['Gender Filter'] ? row['Gender Filter'].split(',').map(s => s.trim()) : [],
            season: row['Season Filter'] ? row['Season Filter'].split(',').map(s => s.trim()) : []
          },
          
          // Stock size option and custom sizes
          stockSizeOption: row['Stock Size Option'] || 'sizes',
          customSizes: row['Custom Sizes (JSON)'] ? JSON.parse(row['Custom Sizes (JSON)']) : [],
          
          // Common size charts
          commonSizeChart: {
            cmChart: row['Common CM Chart URL'] || null,
            inchChart: row['Common Inch Chart URL'] || null,
            measurementGuide: row['Common Measurement Guide URL'] || null
          },
          
          // Also Show In options
          alsoShowInOptions: {
            youMightAlsoLike: { value: row['You Might Also Like']?.toLowerCase() === 'yes' ? 'yes' : 'no' },
            similarItems: { value: row['Similar Items']?.toLowerCase() === 'yes' ? 'yes' : 'no' },
            othersAlsoBought: { value: row['Others Also Bought']?.toLowerCase() === 'yes' ? 'yes' : 'no' }
          },
          
          // Media
          images: row['Image URLs (JSON)'] ? JSON.parse(row['Image URLs (JSON)']) : [],
          videos: row['Video URLs (JSON)'] ? JSON.parse(row['Video URLs (JSON)']) : [],
          
          // Additional fields
          hsnCode: row['HSN Code'] || '',
          defaultSku: row['Default SKU'] || '',
          defaultBarcode: row['Default Barcode'] || '',
          
          variants: [{
            id: 1,
            name: 'Variant 1',
            productName: row['Product Name'],
            title: row['Title'],
            description: row['Description'],
            manufacturingDetails: row['Manufacturing Details'] || '',
            shippingReturns: row['Shipping Returns'] || '',
            regularPrice: parseFloat(row['Regular Price']),
            salePrice: row['Sale Price'] ? parseFloat(row['Sale Price']) : '',
            metaTitle: row['Meta Title'] || '',
            metaDescription: row['Meta Description'] || '',
            slugUrl: row['Slug URL'] || '',
            stockSizeOption: row['Stock Size Option'] || 'sizes',
            customSizes: row['Custom Sizes (JSON)'] ? JSON.parse(row['Custom Sizes (JSON)']) : [],
            images: row['Image URLs (JSON)'] ? JSON.parse(row['Image URLs (JSON)']) : [],
            videos: row['Video URLs (JSON)'] ? JSON.parse(row['Video URLs (JSON)']) : [],
            filters: {
              color: row['Color Filter'] ? row['Color Filter'].split(',')[0]?.trim() || '' : '',
              size: row['Size Filter'] ? row['Size Filter'].split(',')[0]?.trim() || '' : '',
              brand: row['Brand Filter'] ? row['Brand Filter'].split(',')[0]?.trim() || '' : '',
              material: row['Material Filter'] ? row['Material Filter'].split(',')[0]?.trim() || '' : '',
              style: row['Style Filter'] ? row['Style Filter'].split(',')[0]?.trim() || '' : '',
              gender: row['Gender Filter'] ? row['Gender Filter'].split(',')[0]?.trim() || '' : '',
              season: row['Season Filter'] ? row['Season Filter'].split(',')[0]?.trim() || '' : ''
            },
            alsoShowIn: {
              youMightAlsoLike: row['You Might Also Like']?.toLowerCase() === 'yes',
              similarItems: row['Similar Items']?.toLowerCase() === 'yes',
              otherAlsoBought: row['Others Also Bought']?.toLowerCase() === 'yes'
            }
          }]
        };

        // Create product
        await dispatch(createProduct(productData)).unwrap();
        results.success.push(`Row ${i + 1}: ${row['Product Name']}`);
        
      } catch (error) {
        console.error(`Error creating product for row ${i + 1}:`, error);
        results.failed.push(`Row ${i + 1}: ${row['Product Name']} - ${error.message}`);
      }

      // Update progress
      setUploadProgress(((i + 1) / uploadedData.length) * 100);
    }

    setUploadResults(results);
    setCurrentStep('complete');
  }, [uploadedData, dispatch]);

  // Reset upload
  const resetUpload = useCallback(() => {
    setUploadedData([]);
    setPreviewData([]);
    setValidationErrors([]);
    setUploadResults({ success: [], failed: [] });
    setCurrentStep('upload');
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageFileInputRef.current) imageFileInputRef.current.value = '';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/manage-items')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Manage Items
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Products</h1>
                <p className="text-gray-600 mt-1">Upload multiple products at once using Excel files</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Type Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Upload Type</h2>
          
          {/* Template Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">📊 Excel Template Features</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>✅ <strong>Instructions Sheet:</strong> Step-by-step guidance for filling the template</p>
                  <p>✅ <strong>Field Descriptions:</strong> Detailed explanation of each field with examples</p>
                  <p>✅ <strong>Sample Data:</strong> 5 complete product examples across different categories</p>
                  <p>✅ <strong>Empty Template:</strong> Clean sheet ready for your product data</p>
                  <p>✅ <strong>Validation Rules:</strong> Clear requirements for each field</p>
                  <p>✅ <strong>JSON Format Examples:</strong> Proper formatting for complex fields</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Simple Template */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                uploadType === 'simple'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setUploadType('simple')}
            >
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Quick & Simple Upload</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Essential fields only for fast product setup. Perfect for beginners.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>• 11 essential fields only</p>
                    <p>• Basic product information</p>
                    <p>• Fastest way to get started</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadTemplate('simple');
                      }}
                      className="flex items-center gap-1 bg-orange-600 text-white px-2 py-1 rounded text-xs hover:bg-orange-700 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      With Samples
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadTemplate('simpleEmpty');
                      }}
                      className="flex items-center gap-1 bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs hover:bg-orange-300 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Empty
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Only Template */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                uploadType === 'textOnly'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setUploadType('textOnly')}
            >
              <div className="flex items-start gap-3">
                <FileText className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Text Details Upload</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Complete product details without images. Images can be added later.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>• All text fields included</p>
                    <p>• Stock sizes, filters, SEO fields</p>
                    <p>• No image/video URLs</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadTemplate('textOnly');
                      }}
                      className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      With Samples
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadTemplate('textOnlyEmpty');
                      }}
                      className="flex items-center gap-1 bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-300 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Empty
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* With Images Template */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                uploadType === 'withImages'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setUploadType('withImages')}
            >
              <div className="flex items-start gap-3">
                <Image className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Complete with Images</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Full product setup with image and video URLs. Ready-to-publish products.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>• All fields including media URLs</p>
                    <p>• Image & video URL arrays</p>
                    <p>• Complete product setup</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadTemplate('withImages');
                      }}
                      className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      With Samples
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadTemplate('completeEmpty');
                      }}
                      className="flex items-center gap-1 bg-green-200 text-green-800 px-2 py-1 rounded text-xs hover:bg-green-300 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Empty
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Template */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                uploadType === 'complete'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setUploadType('complete')}
            >
              <div className="flex items-start gap-3">
                <Star className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    <span className="inline-flex items-center gap-1">
                      Complete Professional
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">RECOMMENDED</span>
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Everything included! All features from SingleProductUpload in Excel format.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>• All 33 fields supported</p>
                    <p>• Complete sample products</p>
                    <p>• Professional e-commerce setup</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadTemplate('complete');
                      }}
                      className="flex items-center gap-1 bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      With Samples
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadTemplate('completeEmpty');
                      }}
                      className="flex items-center gap-1 bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs hover:bg-purple-300 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Empty
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">📋 Template Contents:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">🔤 Text Fields:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Product Name, Title, Description</li>
                  <li>• Manufacturing Details</li>
                  <li>• Shipping & Returns Policy</li>
                  <li>• Pricing (Regular & Sale)</li>
                  <li>• Categories & Subcategories</li>
                  <li>• SEO Fields (Meta Title, Description, URL)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">🏷️ Advanced Fields:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Filter Tags (Color, Size, Brand, etc.)</li>
                  <li>• Stock Sizes (JSON format)</li>
                  <li>• Custom Sizes with Pricing (JSON)</li>
                  <li>• Image URLs (Text+Image template)</li>
                  <li>• Video URLs (Text+Image template)</li>
                  <li>• Platform-specific Pricing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Steps */}
        {currentStep === 'upload' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Upload Excel File - {uploadType === 'text' ? 'Text Only' : 'Text + Images'}
            </h2>

            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload your Excel file
              </h3>
              <p className="text-gray-600 mb-4">
                Choose the completed Excel template file (.xlsx format)
              </p>
              <input
                ref={uploadType === 'text' ? fileInputRef : imageFileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => {
                  if (uploadType === 'text') {
                    fileInputRef.current?.click();
                  } else {
                    imageFileInputRef.current?.click();
                  }
                }}
                disabled={isProcessing}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Select File'}
              </button>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-medium text-red-800">Validation Errors Found</h3>
                </div>
                <div className="space-y-2">
                  {validationErrors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700">
                      <strong>Row {error.row}:</strong>
                      <ul className="list-disc list-inside ml-4">
                        {error.errors.map((err, errIndex) => (
                          <li key={errIndex}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preview Step */}
        {currentStep === 'preview' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Preview Data</h2>
                <p className="text-gray-600">
                  Showing first 5 rows. Total: {uploadedData.length} products
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={resetUpload}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={processBulkUpload}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Start Upload
                </button>
              </div>
            </div>

            {/* Preview Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Product Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Title</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Category</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Regular Price</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Sale Price</th>
                    {uploadType === 'text-image' && (
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Images</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2 text-sm text-gray-900">{row['Product Name']}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{row['Title']}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{row['Category']}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">${row['Regular Price']}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {row['Sale Price'] ? `$${row['Sale Price']}` : '-'}
                      </td>
                      {uploadType === 'text-image' && (
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {row['Image URLs (JSON)'] ? 
                            `${JSON.parse(row['Image URLs (JSON)']).length} images` : 
                            '0 images'
                          }
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Processing Step */}
        {currentStep === 'processing' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Processing Upload</h2>
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 mb-4">Creating products... Please wait</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">{Math.round(uploadProgress)}% complete</p>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {currentStep === 'complete' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Upload Complete</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Success Results */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-green-800">
                    Successfully Created ({uploadResults.success.length})
                  </h3>
                </div>
                <div className="max-h-32 overflow-y-auto">
                  {uploadResults.success.map((item, index) => (
                    <p key={index} className="text-sm text-green-700">{item}</p>
                  ))}
                </div>
              </div>

              {/* Failed Results */}
              {uploadResults.failed.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <h3 className="font-medium text-red-800">
                      Failed ({uploadResults.failed.length})
                    </h3>
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {uploadResults.failed.map((item, index) => (
                      <p key={index} className="text-sm text-red-700">{item}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetUpload}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload More
              </button>
              <button
                onClick={() => navigate('/manage-items')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Manage Items
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUpload;
