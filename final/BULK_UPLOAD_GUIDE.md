# Excel Bulk Upload Templates - User Guide

## 📋 Available Templates

### 1. **Product_Text_Details_Template.xlsx**
- **Purpose**: Basic product information upload
- **Use Case**: When you only have text details and want to add images later
- **Contains**: Product name, title, description, pricing, categories, meta data

### 2. **Product_With_Images_Template.xlsx** 
- **Purpose**: Product information with image and video URLs
- **Use Case**: When you have hosted images/videos and their direct URLs
- **Contains**: All text fields PLUS image URLs and video URLs

### 3. **Product_Complete_Template.xlsx**
- **Purpose**: Complete product data including inventory management
- **Use Case**: Full product setup with sizes, stock, SKUs, and platform-specific pricing
- **Contains**: Everything PLUS size variants, stock quantities, HSN codes, SKUs, barcodes, platform prices

## 📊 How to Use the Templates

### Step 1: Download Templates
1. Go to **Manage Items** → **Bulk Upload**
2. Choose your template type:
   - **Text Only**: For basic product info
   - **With Images**: For products with image URLs
   - **Complete**: For full inventory management
3. Click **Download Template** button

### Step 2: Review the Instructions Sheet
Each Excel file contains two sheets:
- **Instructions**: Detailed field explanations and guidelines
- **Data Sheet**: Sample data showing the correct format

### Step 3: Fill Your Data
- Replace sample data with your product information
- Follow the format exactly as shown in examples
- Keep the headers unchanged
- Use the Instructions sheet for field guidance

### Step 4: Upload Your File
1. Return to Bulk Upload page
2. Select your upload type (matches your template)
3. Choose your completed Excel file
4. Review the data preview
5. Click **Upload Products**

## 📝 Field Descriptions

### Required Fields
| Field | Description | Example |
|-------|-------------|---------|
| Product Name | Main product identifier | "Premium Cotton T-Shirt" |
| Title | Display title | "Comfortable Cotton Crew Neck T-Shirt" |
| Description | Detailed product description | "Made from 100% premium cotton..." |
| Regular Price | Original price (numbers only) | 1299 |
| Category | Main product category | "Clothing" |
| Sub Category | Product subcategory | "T-Shirts" |

### Optional Fields
| Field | Description | Example |
|-------|-------------|---------|
| Manufacturing Details | Production information | "Manufactured in certified facilities..." |
| Shipping Returns | Return policy | "Free returns within 30 days..." |
| Sale Price | Discounted price | 999 |
| Meta Title | SEO title | "Premium Cotton T-Shirt - Comfortable" |
| Meta Description | SEO description | "Shop premium cotton t-shirts online..." |
| Slug URL | URL-friendly identifier | "premium-cotton-t-shirt" |

### Image/Video Fields (With Images Template)
| Field | Description | Format |
|-------|-------------|--------|
| Image URL 1-5 | Direct image links | https://example.com/image1.jpg |
| Video URL 1-2 | Direct video links | https://example.com/video1.mp4 |

### Size/Stock Fields (Complete Template)
| Field | Description | Example |
|-------|-------------|---------|
| Size | Product size | S, M, L, XL |
| Quantity | Stock quantity | 50 |
| HSN Code | Tax classification code | 61099090 |
| SKU | Stock keeping unit | TSHIRT-COTTON-S-001 |
| Barcode | Product barcode | 1234567890123 |
| Amazon Price | Amazon platform price | 1299 |
| Flipkart Price | Flipkart platform price | 1199 |
| Myntra Price | Myntra platform price | 1149 |
| Nykaa Price | Nykaa platform price | 1099 |
| Yoraa Price | Yoraa platform price | 999 |

## ⚠️ Important Guidelines

### Data Format Rules
- **Prices**: Numbers only (no currency symbols)
- **URLs**: Must be valid and accessible links
- **Descriptions**: Keep under 500 characters
- **Categories**: Use existing category names
- **Sizes**: For multiple sizes, create separate rows

### Multiple Size Products
For products with multiple sizes:
1. Create one row per size
2. Keep all other details identical
3. Change only: Size, Quantity, SKU, Barcode
4. Platform prices can vary by size

### Image Requirements
- Use direct image URLs (JPG, PNG formats)
- Ensure images are publicly accessible
- Test URLs before uploading
- Maximum 5 images per product

### Video Requirements
- Use direct video URLs (MP4 format)
- Maximum 2 videos per product
- Ensure videos are publicly accessible

## 🚀 Upload Process

### Step 1: Template Selection
Choose the right template based on your needs:
- **Basic info only** → Text Details Template
- **Have image URLs** → With Images Template  
- **Full inventory setup** → Complete Template

### Step 2: Data Preparation
1. Download template
2. Read Instructions sheet carefully
3. Fill data following sample format
4. Validate URLs if using image template
5. Save file with your data

### Step 3: Upload & Validation
1. Select upload type matching your template
2. Choose your Excel file
3. System validates data format
4. Review preview of detected products
5. Fix any validation errors

### Step 4: Bulk Creation
1. Confirm data is correct
2. Click "Upload Products" 
3. Monitor upload progress
4. Review success/failure report
5. Check created products

## 📈 Sample Data Overview

Each template includes realistic sample data:

### Text Template Sample
- 3 complete product examples
- Different categories (T-Shirts, Jeans, Shirts)
- Proper pricing and descriptions
- SEO-optimized meta fields

### Images Template Sample  
- Same products with image URLs
- Multiple images per product
- Video URLs included
- Demonstrates URL format

### Complete Template Sample
- Size variants (S, M, L for same product)
- Stock quantities and SKUs
- Platform-specific pricing
- Complete inventory data

## 🔧 Troubleshooting

### Common Issues
1. **Invalid URLs**: Test image/video links before upload
2. **Price Format**: Use numbers only (1299, not $12.99)
3. **Missing Required Fields**: Ensure Product Name, Title, Description are filled
4. **Category Mismatch**: Use existing category names from the system
5. **Size Duplicates**: Create separate rows for each size variant

### Validation Errors
- Check Instructions sheet for field requirements
- Verify data format matches samples
- Ensure all required fields are filled
- Test URLs are accessible

### Upload Failures
- Check file format is .xlsx
- Verify template headers are unchanged
- Ensure data follows sample format
- Contact support if issues persist

## 📞 Support

For additional help:
1. Review the Instructions sheet in each template
2. Check sample data format
3. Verify field requirements
4. Test with small batch first
5. Contact technical support if needed

---

**Last Updated**: September 2025  
**Template Version**: 1.0  
**Compatible With**: Yoraa Bulk Upload System
