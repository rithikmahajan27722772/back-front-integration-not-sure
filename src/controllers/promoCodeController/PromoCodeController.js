const PromoCode = require('../../models/PromoCodes');
const mongoose = require('mongoose');

// Validate Promo Code
exports.validatePromoCode = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code || !cartTotal || cartTotal < 0) {
      return res.status(400).json({ success: false, message: 'Promo code and valid cart total are required' });
    }

    const promoCode = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });
    if (!promoCode) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive promo code' });
    }

    const currentDate = new Date();
    if (currentDate < promoCode.startDate || currentDate > promoCode.endDate) {
      return res.status(400).json({ success: false, message: 'Promo code has expired' });
    }

    if (promoCode.maxUses > 0 && promoCode.currentUses >= promoCode.maxUses) {
      return res.status(400).json({ success: false, message: 'Promo code usage limit reached' });
    }

    if (cartTotal < promoCode.minOrderValue) {
      return res.status(400).json({ success: false, message: `Cart total must be at least ₹${promoCode.minOrderValue}` });
    }

    let discount = 0;
    if (promoCode.discountType === 'percentage') {
      discount = (cartTotal * promoCode.discountValue) / 100;
    } else if (promoCode.discountType === 'fixed') {
      discount = promoCode.discountValue;
    } else if (promoCode.discountType === 'free_shipping') {
      discount = 0; // Shipping cost handled separately
    } else if (promoCode.discountType === 'bogo') {
      discount = 0; // Discount applied via item quantities
    }

    res.status(200).json({
      success: true,
      message: 'Promo code is valid',
      promoCode: {
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
        discount: discount,
      },
    });
  } catch (error) {
    console.error('validatePromoCode error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Create Promo Code (Admin)
exports.createPromoCode = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      startDate,
      endDate,
      maxUses,
      isActive,
    } = req.body;

    if (!code || !discountType || !discountValue || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    if (!['percentage', 'fixed', 'free_shipping', 'bogo'].includes(discountType)) {
      return res.status(400).json({ success: false, message: 'Invalid discount type' });
    }

    const existingPromo = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existingPromo) {
      return res.status(400).json({ success: false, message: 'Promo code already exists' });
    }

    const promoCode = new PromoCode({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderValue: minOrderValue || 0,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      maxUses: maxUses || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await promoCode.save();

    res.status(201).json({ success: true, message: 'Promo code created', promoCode });
  } catch (error) {
    console.error('createPromoCode error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update Promo Code (Admin)
exports.updatePromoCode = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      startDate,
      endDate,
      maxUses,
      isActive,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid promo code ID' });
    }

    const promoCode = await PromoCode.findById(id);
    if (!promoCode) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }

    if (code && code.toUpperCase() !== promoCode.code) {
      const existingPromo = await PromoCode.findOne({ code: code.toUpperCase() });
      if (existingPromo) {
        return res.status(400).json({ success: false, message: 'Promo code already exists' });
      }
      promoCode.code = code.toUpperCase();
    }

    if (discountType) {
      if (!['percentage', 'fixed', 'free_shipping', 'bogo'].includes(discountType)) {
        return res.status(400).json({ success: false, message: 'Invalid discount type' });
      }
      promoCode.discountType = discountType;
    }

    if (discountValue !== undefined) promoCode.discountValue = discountValue;
    if (minOrderValue !== undefined) promoCode.minOrderValue = minOrderValue;
    if (startDate) promoCode.startDate = new Date(startDate);
    if (endDate) promoCode.endDate = new Date(endDate);
    if (maxUses !== undefined) promoCode.maxUses = maxUses;
    if (isActive !== undefined) promoCode.isActive = isActive;

    await promoCode.save();

    res.status(200).json({ success: true, message: 'Promo code updated', promoCode });
  } catch (error) {
    console.error('updatePromoCode error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete Promo Code (Admin)
exports.deletePromoCode = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid promo code ID' });
    }

    const promoCode = await PromoCode.findByIdAndDelete(id);
    if (!promoCode) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }

    res.status(200).json({ success: true, message: 'Promo code deleted' });
  } catch (error) {
    console.error('deletePromoCode error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get All Promo Codes (Admin) with filtering and pagination
exports.getAllPromoCodes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      isActive,
      discountType,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    const filter = {};
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    if (discountType) {
      filter.discountType = discountType;
    }
    
    if (search) {
      filter.code = { $regex: search, $options: 'i' };
    }

    // Build sort query
    const sortQuery = {};
    sortQuery[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute queries
    const [promoCodes, totalItems] = await Promise.all([
      PromoCode.find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(parseInt(limit)),
      PromoCode.countDocuments(filter)
    ]);

    // Calculate statistics
    const [totalCount, activeCount, inactiveCount] = await Promise.all([
      PromoCode.countDocuments(),
      PromoCode.countDocuments({ isActive: true }),
      PromoCode.countDocuments({ isActive: false })
    ]);

    const now = new Date();
    const expiredCount = await PromoCode.countDocuments({
      endDate: { $lt: now }
    });

    const stats = {
      total: totalCount,
      active: activeCount,
      inactive: inactiveCount,
      expired: expiredCount
    };

    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItems / parseInt(limit)),
      totalItems,
      itemsPerPage: parseInt(limit)
    };

    res.status(200).json({ 
      success: true, 
      promoCodes,
      stats,
      pagination
    });
  } catch (error) {
    console.error('getAllPromoCodes error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get Promo Code by ID (Admin)
exports.getPromoCodeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid promo code ID' });
    }

    const promoCode = await PromoCode.findById(id);
    if (!promoCode) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }

    res.status(200).json({ success: true, promoCode });
  } catch (error) {
    console.error('getPromoCodeById error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Bulk Toggle Status (Admin)
exports.bulkToggleStatus = async (req, res) => {
  try {
    const { ids, isActive } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid IDs array' });
    }

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be a boolean' });
    }

    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid IDs provided' });
    }

    const result = await PromoCode.updateMany(
      { _id: { $in: validIds } },
      { $set: { isActive, updatedAt: new Date() } }
    );

    const updatedPromoCodes = await PromoCode.find({ _id: { $in: validIds } });

    res.status(200).json({ 
      success: true, 
      message: `${result.modifiedCount} promo codes updated`,
      promoCodes: updatedPromoCodes
    });
  } catch (error) {
    console.error('bulkToggleStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Bulk Delete (Admin)
exports.bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid IDs array' });
    }

    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid IDs provided' });
    }

    const result = await PromoCode.deleteMany({ _id: { $in: validIds } });

    res.status(200).json({ 
      success: true, 
      message: `${result.deletedCount} promo codes deleted`
    });
  } catch (error) {
    console.error('bulkDelete error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get Statistics (Admin)
exports.getPromoCodeStats = async (req, res) => {
  try {
    const now = new Date();
    
    const [
      totalCount,
      activeCount,
      inactiveCount,
      expiredCount,
      usageStats
    ] = await Promise.all([
      PromoCode.countDocuments(),
      PromoCode.countDocuments({ isActive: true }),
      PromoCode.countDocuments({ isActive: false }),
      PromoCode.countDocuments({ endDate: { $lt: now } }),
      PromoCode.aggregate([
        {
          $group: {
            _id: null,
            totalUses: { $sum: '$currentUses' },
            avgUses: { $avg: '$currentUses' },
            maxUses: { $max: '$currentUses' }
          }
        }
      ])
    ]);

    const stats = {
      total: totalCount,
      active: activeCount,
      inactive: inactiveCount,
      expired: expiredCount,
      usage: usageStats[0] || { totalUses: 0, avgUses: 0, maxUses: 0 }
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error('getPromoCodeStats error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Search Promo Codes (Admin)
exports.searchPromoCodes = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const promoCodes = await PromoCode.find({
      code: { $regex: q.trim(), $options: 'i' }
    }).limit(20).sort({ createdAt: -1 });

    res.status(200).json({ success: true, promoCodes });
  } catch (error) {
    console.error('searchPromoCodes error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get Promo Codes by Status
exports.getPromoCodesByStatus = async (req, res) => {
  try {
    const { isActive } = req.params;
    
    const filter = { isActive: isActive === 'true' };
    const promoCodes = await PromoCode.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, promoCodes });
  } catch (error) {
    console.error('getPromoCodesByStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get Expired Promo Codes
exports.getExpiredPromoCodes = async (req, res) => {
  try {
    const now = new Date();
    const promoCodes = await PromoCode.find({ 
      endDate: { $lt: now } 
    }).sort({ endDate: -1 });

    res.status(200).json({ success: true, promoCodes });
  } catch (error) {
    console.error('getExpiredPromoCodes error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Clone Promo Code
exports.clonePromoCode = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid promo code ID' });
    }

    const originalPromo = await PromoCode.findById(id);
    if (!originalPromo) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }

    // Create new code with "_COPY" suffix
    let newCode = originalPromo.code + '_COPY';
    let counter = 1;
    
    // Check if code already exists and increment counter
    while (await PromoCode.findOne({ code: newCode })) {
      newCode = `${originalPromo.code}_COPY${counter}`;
      counter++;
    }

    // Create new promo code
    const clonedPromo = new PromoCode({
      code: newCode,
      discountType: originalPromo.discountType,
      discountValue: originalPromo.discountValue,
      minOrderValue: originalPromo.minOrderValue,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      maxUses: originalPromo.maxUses,
      isActive: false // Start as inactive
    });

    await clonedPromo.save();

    res.status(201).json({ 
      success: true, 
      message: 'Promo code cloned successfully',
      promoCode: clonedPromo 
    });
  } catch (error) {
    console.error('clonePromoCode error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};