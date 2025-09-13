// Clock and CalendarX icons imported from lucide-react - CACHE BUST v2.0
import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
// Import icons with Clock and CalendarX explicitly for scheduling features - FIXED
import {
  Search,
  Edit2,
  Trash2,
  ChevronDown,
  Plus,
  X,
  Filter,
  RefreshCw,
  Tag,
  Clock as ClockIcon,
  CalendarX as CalendarXIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Cache bust verification
console.log("ManageItems.jsx loaded with ClockIcon:", typeof ClockIcon, "and CalendarXIcon:", typeof CalendarXIcon);
import { itemAPI, productAPI, categoryAPI, subCategoryAPI, filterAPI } from "../api/endpoints";
import {
  fetchFilters,
  selectAvailableFilters,
  selectAppliedFilters,
  selectFilterLoading,
  setColorFilter,
  setSizeFilter,
  setBrandFilter,
  clearAllFilters
} from "../store/slices/filtersSlice";
import {
  fetchProducts,
  selectProductsItems,
  selectProductsLoading,
  selectProductsError,
} from "../store/slices/productsSlice";
import {
  fetchCategories,
  fetchSubCategories,
  selectCategories,
  selectSubCategories,
  selectCategoriesLoading,
  selectSubCategoriesLoading,
  selectCategoriesError,
  selectSubCategoriesError,
} from "../store/slices/categoriesSlice";

// All data is now loaded dynamically from the API

const STATUS_STYLES = {
  live: "text-[#00b69b]",
  draft: "text-[#ef3826]",
  scheduled: "text-[#ffd56d]",
};

// Custom hooks for better state management
const useManageItemsState = () => {
  // Basic filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [selectedSubCategory, setSelectedSubCategory] =
    useState("All subcategories");
  const [selectedItem, setSelectedItem] = useState("Items");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDraftsOnly, setShowDraftsOnly] = useState(false);
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [showScheduledOnly, setShowScheduledOnly] = useState(false);

  // Items data
  const [draftItems, setDraftItems] = useState([]);
  const [publishedItems, setPublishedItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [statistics, setStatistics] = useState({
    drafts: 0,
    live: 0,
    scheduled: 0,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Dynamic dropdown data (these are already available from Redux selectors above)
  // Removed duplicate categories and subCategories state since they're already in Redux
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isSubCategoriesLoading, setIsSubCategoriesLoading] = useState(true);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    selectedItem,
    setSelectedItem,
    statusFilter,
    setStatusFilter,
    showDraftsOnly,
    setShowDraftsOnly,
    showLiveOnly,
    setShowLiveOnly,
    showScheduledOnly,
    setShowScheduledOnly,
    draftItems,
    setDraftItems,
    publishedItems,
    setPublishedItems,
    allItems,
    setAllItems,
    statistics,
    setStatistics,
    isLoading,
    setIsLoading,
    isFilterDropdownOpen,
    setIsFilterDropdownOpen,
    isCategoriesLoading,
    setIsCategoriesLoading,
    isSubCategoriesLoading,
    setIsSubCategoriesLoading,
  };
};

const useModalState = () => {
  // Edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newDetails, setNewDetails] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  // Edit form data
  const [editFormData, setEditFormData] = useState({
    productName: "",
    title: "",
    description: "",
    manufacturingDetails: "",
    shippingReturns: "",
    returnable: "yes",
    category: "",
    subCategory: "",
    hsn: "",
    regularPrice: 0,
    salePrice: 0,
    sizes: [
      { size: "small", quantity: 0, price: 0, salePrice: 0, alternatePrice: 0, sku: "", barcode: "" },
      { size: "medium", quantity: 0, price: 0, salePrice: 0, alternatePrice: 0, sku: "", barcode: "" },
      { size: "large", quantity: 0, price: 0, salePrice: 0, alternatePrice: 0, sku: "", barcode: "" }
    ],
    metaTitle: "",
    metaDescription: "",
    slugUrl: "",
    platforms: {
      myntra: false,
      amazon: false,
      flipkart: false,
      nykaa: false
    },
    actions: {
      moveToSale: false,
      keepCopyAndMove: false,
      moveToEyx: false
    }
  });

  // Meta data modal
  const [isMetaDataModalOpen, setIsMetaDataModalOpen] = useState(false);
  const [isMetaDataSuccessModalOpen, setIsMetaDataSuccessModalOpen] =
    useState(false);
  const [selectedItemForMeta, setSelectedItemForMeta] = useState(null);
  const [metaFormData, setMetaFormData] = useState({
    metaTitle: "",
    metaDescription: "",
    slugUrl: "",
  });

  // Delete modal
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] =
    useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Schedule modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [itemToSchedule, setItemToSchedule] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isScheduleSuccessModalOpen, setIsScheduleSuccessModalOpen] =
    useState(false);

  // Make live modal
  const [isMakeLiveConfirmModalOpen, setIsMakeLiveConfirmModalOpen] =
    useState(false);
  const [itemToMakeLive, setItemToMakeLive] = useState(null);
  const [isMakeLiveSuccessModalOpen, setIsMakeLiveSuccessModalOpen] =
    useState(false);

  // Cancel schedule modal
  const [
    isCancelScheduleConfirmModalOpen,
    setIsCancelScheduleConfirmModalOpen,
  ] = useState(false);
  const [itemToCancelSchedule, setItemToCancelSchedule] = useState(null);
  const [
    isCancelScheduleSuccessModalOpen,
    setIsCancelScheduleSuccessModalOpen,
  ] = useState(false);

  return {
    // Edit modal
    isEditModalOpen,
    setIsEditModalOpen,
    editingItem,
    setEditingItem,
    newDetails,
    setNewDetails,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    editFormData,
    setEditFormData,

    // Meta data modal
    isMetaDataModalOpen,
    setIsMetaDataModalOpen,
    isMetaDataSuccessModalOpen,
    setIsMetaDataSuccessModalOpen,
    selectedItemForMeta,
    setSelectedItemForMeta,
    metaFormData,
    setMetaFormData,

    // Delete modal
    isDeleteConfirmModalOpen,
    setIsDeleteConfirmModalOpen,
    isDeleteSuccessModalOpen,
    setIsDeleteSuccessModalOpen,
    itemToDelete,
    setItemToDelete,

    // Schedule modal
    isScheduleModalOpen,
    setIsScheduleModalOpen,
    itemToSchedule,
    setItemToSchedule,
    scheduleDate,
    setScheduleDate,
    scheduleTime,
    setScheduleTime,
    isScheduleSuccessModalOpen,
    setIsScheduleSuccessModalOpen,

    // Make live modal
    isMakeLiveConfirmModalOpen,
    setIsMakeLiveConfirmModalOpen,
    itemToMakeLive,
    setItemToMakeLive,
    isMakeLiveSuccessModalOpen,
    setIsMakeLiveSuccessModalOpen,

    // Cancel schedule modal
    isCancelScheduleConfirmModalOpen,
    setIsCancelScheduleConfirmModalOpen,
    itemToCancelSchedule,
    setItemToCancelSchedule,
    isCancelScheduleSuccessModalOpen,
    setIsCancelScheduleSuccessModalOpen,
  };
};

const ManageItems = memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useManageItemsState();
  const modalState = useModalState();

  // Redux state
  const products = useSelector(selectProductsItems) || [];
  const productsLoading = useSelector(selectProductsLoading);
  const productsError = useSelector(selectProductsError);
  const categories = useSelector(selectCategories) || [];
  const subCategories = useSelector(selectSubCategories) || [];
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const subCategoriesLoading = useSelector(selectSubCategoriesLoading);

  // Filter Redux state
  const availableFilters = useSelector(selectAvailableFilters);
  const appliedFilters = useSelector(selectAppliedFilters);
  const filterLoading = useSelector(selectFilterLoading);

  // All data comes from API - no static fallbacks

  // Remove the problematic useCallback functions since we're doing direct API calls now

  // Data loading effect - fetch real-time data on component mount
  useEffect(() => {
    console.log("ManageItems: Initial data load triggered");
    const loadData = async () => {
      try {
        state.setIsLoading(true);
        
        // Load data using Redux actions
        dispatch(fetchProducts());
        dispatch(fetchCategories());
        dispatch(fetchSubCategories());
        dispatch(fetchFilters());

        // Still fetch stats and items directly for now
        const [itemsResponse, statsResponse] = await Promise.all([
          productAPI.getAllProducts(),
          itemAPI.getItemStatistics()
        ]);
        
        console.log("ManageItems: Received API responses", { 
          itemsCount: Array.isArray(itemsResponse?.data) ? itemsResponse.data.length : 0,
          statistics: statsResponse?.data?.data 
        });
        
        // Handle products response  
        if (itemsResponse.data) {
          // Products API returns array directly, not wrapped in .items
          const productsArray = Array.isArray(itemsResponse.data) ? itemsResponse.data : [itemsResponse.data];
          const mappedItems = productsArray.map(item => ({
            id: item._id || item.id,
            image: item.thumbnail || item.variants?.[0]?.images?.[0] || item.images?.[0] || "/api/placeholder/120/116",
            productName: item.productName || item.title,
            title: item.title || item.productName,
            category: item.category?.name || item.category || "Unknown",
            subCategory: item.subCategory?.name || item.subCategory || "Unknown",
            subCategories: item.subCategory?.name || item.subCategory || "Unknown", // Legacy field name for table display
            hsn: item.sizes?.[0]?.hsnCode || "N/A",
            size: item.sizes?.map(s => s.size) || [],
            quantity: item.stockQuantity || item.sizes?.reduce((total, size) => total + (size.quantity || 0), 0) || 0,
            price: item.regularPrice || item.price || 0,
            salePrice: item.salePrice || item.regularPrice || item.price || 0,
            regularPrice: item.regularPrice || item.price || 0,
            status: item.status === 'published' ? 'live' : (item.status || 'draft'),
            metaTitle: item.metaTitle || "",
            metaDescription: item.metaDescription || "",
            slugUrl: item.slugUrl || "",
            description: item.description || "",
            manufacturingDetails: item.manufacturingDetails || "",
            shippingReturns: item.shippingAndReturns || "",
            returnable: item.returnable ? 'yes' : 'no',
            variants: item.variants || [],
            sizes: item.sizes || [],
            stockSizeOption: item.stockSizeOption || 'sizes',
            sizeChart: item.sizeChart || {},
            commonSizeChart: item.commonSizeChart || {},
            alsoShowInOptions: item.alsoShowInOptions || {},
            filters: item.filters || [],
            tags: item.tags || [],
            platformPricing: item.platformPricing || {},
            platforms: {
              myntra: { 
                enabled: item.platformPricing?.myntra?.enabled || false, 
                price: item.platformPricing?.myntra?.price || item.regularPrice || 0 
              },
              amazon: { 
                enabled: item.platformPricing?.amazon?.enabled || false, 
                price: item.platformPricing?.amazon?.price || item.regularPrice || 0 
              },
              flipkart: { 
                enabled: item.platformPricing?.flipkart?.enabled || false, 
                price: item.platformPricing?.flipkart?.price || item.regularPrice || 0 
              },
              nykaa: { 
                enabled: item.platformPricing?.nykaa?.enabled || false, 
                price: item.platformPricing?.nykaa?.price || item.regularPrice || 0 
              },
            },
            skus: item.sizes?.reduce((acc, sizeItem) => {
              acc[sizeItem.size] = sizeItem.sku;
              return acc;
            }, {}) || {},
            barcodeNo: item.sizes?.[0]?.barcode || "N/A",
            // Legacy support for existing functionality
            moveToSale: false,
            keepCopyAndMove: false,
            moveToEyx: false,
          }));
          state.setAllItems(mappedItems);
          console.log("ManageItems: Updated items list with", mappedItems.length, "items");
        }
        
        // Handle statistics response
        if (statsResponse.data && statsResponse.data.data) {
          state.setStatistics(statsResponse.data.data);
          console.log("ManageItems: Updated statistics", statsResponse.data.data);
        }

        // Categories are now managed by Redux - dispatch to load them
        console.log("ManageItems: Dispatching fetchCategories to Redux");
        dispatch(fetchCategories());
        state.setIsCategoriesLoading(false);

        // Subcategories are now managed by Redux - dispatch to load them
        console.log("ManageItems: Dispatching fetchSubCategories to Redux");
        dispatch(fetchSubCategories());
        state.setIsSubCategoriesLoading(false);
        
        // Also load any saved local data
        const savedDrafts = localStorage.getItem("yoraa_draft_items");
        if (savedDrafts) {
          state.setDraftItems(JSON.parse(savedDrafts));
        }

        const savedPublished = localStorage.getItem("yoraa_published_items");
        if (savedPublished) {
          state.setPublishedItems(JSON.parse(savedPublished));
        }
        
      } catch (error) {
        console.error("Error loading data:", error);
        console.error("Error details:", error.response?.data || error.message);
        
        // Set empty arrays on error - no static fallbacks
        state.setAllItems([]);
        state.setStatistics({ drafts: 0, live: 0, scheduled: 0, total: 0 });

        // Set categories and subcategories loading to false even on error
        state.setIsCategoriesLoading(false);
        state.setIsSubCategoriesLoading(false);
      } finally {
        state.setIsLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array - run only once on mount

  // Refresh data when component becomes visible (e.g., when navigating back from SingleProductUpload)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !state.isLoading) {
        console.log("ManageItems: Page became visible, refreshing data...");
        const loadData = async () => {
          try {
            state.setIsLoading(true);
            
            const [itemsResponse, statsResponse] = await Promise.all([
              productAPI.getAllProducts(),
              itemAPI.getItemStatistics()
            ]);
            
            console.log("ManageItems: Visibility refresh - received responses", {
              itemsCount: Array.isArray(itemsResponse?.data) ? itemsResponse.data.length : 0,
              statistics: statsResponse?.data?.data
            });
            
            if (itemsResponse.data) {
              const productsArray = Array.isArray(itemsResponse.data) ? itemsResponse.data : [itemsResponse.data];
              const mappedItems = productsArray.map(item => ({
                ...item,
                status: item.status === 'published' ? 'live' : item.status
              }));
              state.setAllItems(mappedItems);
            }
            
            if (statsResponse.data && statsResponse.data.data) {
              state.setStatistics(statsResponse.data.data);
            }
          } catch (error) {
            console.error("ManageItems: Error refreshing data:", error);
          } finally {
            state.setIsLoading(false);
          }
        };
        loadData();
      }
    };

    const handleFocus = () => {
      if (!state.isLoading) {
        console.log("Window focused, refreshing data...");
        handleVisibilityChange();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [state.isLoading]);

  // Optimized filter handlers with useCallback
  const filterHandlers = useMemo(() => {
    const handleViewAllDrafts = () => {
      const newStatus = state.statusFilter === "draft" ? "all" : "draft";
      state.setStatusFilter(newStatus);
      state.setShowDraftsOnly(newStatus === "draft");
      state.setShowLiveOnly(false);
      state.setShowScheduledOnly(false);
    };

    const handleViewAllLive = () => {
      const newStatus = state.statusFilter === "live" ? "all" : "live";
      state.setStatusFilter(newStatus);
      state.setShowLiveOnly(newStatus === "live");
      state.setShowDraftsOnly(false);
      state.setShowScheduledOnly(false);
    };

    const handleViewAllScheduled = () => {
      const newStatus =
        state.statusFilter === "scheduled" ? "all" : "scheduled";
      state.setStatusFilter(newStatus);
      state.setShowScheduledOnly(newStatus === "scheduled");
      state.setShowDraftsOnly(false);
      state.setShowLiveOnly(false);
    };

    const clearAllFilters = () => {
      state.setStatusFilter("all");
      state.setShowDraftsOnly(false);
      state.setShowLiveOnly(false);
      state.setShowScheduledOnly(false);
    };

    const toggleFilterDropdown = () => {
      state.setIsFilterDropdownOpen((prev) => !prev);
    };

    const handleFilterOption = (filterType) => {
      switch (filterType) {
        case "all_drafts":
          handleViewAllDrafts();
          break;
        case "all_live":
          handleViewAllLive();
          break;
        case "all_scheduled":
          handleViewAllScheduled();
          break;
        case "clear_filters":
          clearAllFilters();
          break;
        default:
          break;
      }
      state.setIsFilterDropdownOpen(false);
    };

    return {
      handleViewAllDrafts,
      handleViewAllLive,
      handleViewAllScheduled,
      clearAllFilters,
      toggleFilterDropdown,
      handleFilterOption,
    };
  }, [
    state.statusFilter,
    state.setStatusFilter,
    state.setShowDraftsOnly,
    state.setShowLiveOnly,
    state.setShowScheduledOnly,
    state.setIsFilterDropdownOpen,
  ]);

  // Dropdown click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        state.isFilterDropdownOpen &&
        !event.target.closest(".filter-dropdown")
      ) {
        state.setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [state.isFilterDropdownOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (event.altKey) {
        switch (event.key) {
          case "d":
          case "D":
            event.preventDefault();
            filterHandlers.handleViewAllDrafts();
            break;
          case "l":
          case "L":
            event.preventDefault();
            filterHandlers.handleViewAllLive();
            break;
          case "s":
          case "S":
            event.preventDefault();
            filterHandlers.handleViewAllScheduled();
            break;
          case "c":
          case "C":
            event.preventDefault();
            filterHandlers.clearAllFilters();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filterHandlers]);

  // Combined items computation - only use API data
  const allItems = useMemo(() => {
    // Only use real API data - no static fallbacks
    return [...(state.allItems || []), ...(state.draftItems || []), ...(state.publishedItems || [])];
  }, [state.allItems, state.draftItems, state.publishedItems]);

  // Filtered items computation
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesSearch =
        (item.productName || item.title || '')
          .toLowerCase()
          .includes(state.searchTerm.toLowerCase()) ||
        (item.category || '')
          .toLowerCase()
          .includes(state.searchTerm.toLowerCase()) ||
        (item.subCategories || item.subCategory || '')
          .toLowerCase()
          .includes(state.searchTerm.toLowerCase());

      const matchesCategory =
        state.selectedCategory === "All categories" ||
        (item.category || '') === state.selectedCategory;

      const matchesSubCategory =
        state.selectedSubCategory === "All subcategories" ||
        (item.subCategories || item.subCategory || '') === state.selectedSubCategory;

      // Status filtering
      let matchesStatusFilter = true;
      if (state.showDraftsOnly) {
        matchesStatusFilter = item.status === "draft";
      } else if (state.showLiveOnly) {
        matchesStatusFilter = item.status === "live";
      } else if (state.showScheduledOnly) {
        matchesStatusFilter = item.status === "scheduled";
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubCategory &&
        matchesStatusFilter
      );
    });
  }, [
    allItems,
    state.searchTerm,
    state.selectedCategory,
    state.selectedSubCategory,
    state.showDraftsOnly,
    state.showLiveOnly,
    state.showScheduledOnly,
  ]);

  // Optimized utility functions with useCallback for better performance
  const utils = useMemo(() => {
    const getSizeDisplay = (sizes) => sizes.join(", ");

    const getSkuDisplay = (skus, sizes) =>
      (sizes || []).map((size) => skus?.[size] || 'N/A').join(", ");

    const getStatusStyle = (status) => {
      if (!status || typeof status !== 'string') {
        return STATUS_STYLES.draft;
      }
      return STATUS_STYLES[status.toLowerCase()] || STATUS_STYLES.draft;
    };

    const formatScheduledDateTime = (date, time) => {
      if (!date || !time) return "";

      const dateObj = new Date(date);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const [hours, minutes] = time.split(":");
      const timeObj = new Date();
      timeObj.setHours(parseInt(hours), parseInt(minutes));
      const formattedTime = timeObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return `${formattedDate} at ${formattedTime}`;
    };

    return {
      getSizeDisplay,
      getSkuDisplay,
      getStatusStyle,
      formatScheduledDateTime,
    };
  }, []);

  // Optimized action handlers with useCallback
  const actionHandlers = useMemo(() => {
    const handleBulkUpload = () => {
      navigate("/bulk-upload");
    };

    const handleUploadSingleProduct = () => {
      navigate("/single-product-upload");
    };

    const handleRefreshData = async () => {
      console.log("Refreshing data...");
      try {
        state.setIsLoading(true);
        
        // Direct API calls without dependencies
        const [itemsResponse, statsResponse] = await Promise.all([
          productAPI.getAllProducts(),
          itemAPI.getItemStatistics()
        ]);
        
        // Handle products response
        if (itemsResponse.data) {
          const productsArray = Array.isArray(itemsResponse.data) ? itemsResponse.data : [itemsResponse.data];
          const mappedItems = productsArray.map(item => ({
            ...item,
            status: item.status === 'published' ? 'live' : item.status
          }));
          state.setAllItems(mappedItems);
        }
        
        // Handle statistics response
        if (statsResponse.data && statsResponse.data.data) {
          state.setStatistics(statsResponse.data.data);
        }
        
      } catch (error) {
        console.error("Error refreshing data:", error);
      } finally {
        state.setIsLoading(false);
      }
    };

    const handleEdit = (itemId) => {
      const itemToEdit = allItems.find((item) => item.id === itemId);
      modalState.setEditingItem(itemToEdit);
      modalState.setNewDetails("");
      
      // Initialize form data with existing product data
      modalState.setEditFormData({
        productName: itemToEdit?.productName || itemToEdit?.title || "",
        title: itemToEdit?.title || itemToEdit?.productName || "",
        description: itemToEdit?.description || "",
        manufacturingDetails: itemToEdit?.manufacturingDetails || "",
        shippingReturns: itemToEdit?.shippingReturns || "",
        returnable: itemToEdit?.returnable || "yes",
        category: itemToEdit?.category || "",
        subCategory: itemToEdit?.subCategory || itemToEdit?.subCategories || "",
        hsn: itemToEdit?.hsn || "",
        regularPrice: itemToEdit?.price || itemToEdit?.regularPrice || 0,
        salePrice: itemToEdit?.salePrice || 0,
        sizes: [
          {
            size: "small",
            quantity: itemToEdit?.sizes?.find(s => s.size === "small")?.quantity || 0,
            price: itemToEdit?.price || itemToEdit?.regularPrice || 0,
            salePrice: itemToEdit?.salePrice || 0,
            alternatePrice: itemToEdit?.alternatePrice || 0,
            sku: itemToEdit?.skus?.small || itemToEdit?.sizes?.find(s => s.size === "small")?.sku || "",
            barcode: itemToEdit?.sizes?.find(s => s.size === "small")?.barcode || itemToEdit?.barcodeNo || ""
          },
          {
            size: "medium",
            quantity: itemToEdit?.sizes?.find(s => s.size === "medium")?.quantity || 0,
            price: itemToEdit?.price || itemToEdit?.regularPrice || 0,
            salePrice: itemToEdit?.salePrice || 0,
            alternatePrice: itemToEdit?.alternatePrice || 0,
            sku: itemToEdit?.skus?.medium || itemToEdit?.sizes?.find(s => s.size === "medium")?.sku || "",
            barcode: itemToEdit?.sizes?.find(s => s.size === "medium")?.barcode || itemToEdit?.barcodeNo || ""
          },
          {
            size: "large",
            quantity: itemToEdit?.sizes?.find(s => s.size === "large")?.quantity || 0,
            price: itemToEdit?.price || itemToEdit?.regularPrice || 0,
            salePrice: itemToEdit?.salePrice || 0,
            alternatePrice: itemToEdit?.alternatePrice || 0,
            sku: itemToEdit?.skus?.large || itemToEdit?.sizes?.find(s => s.size === "large")?.sku || "",
            barcode: itemToEdit?.sizes?.find(s => s.size === "large")?.barcode || itemToEdit?.barcodeNo || ""
          }
        ],
        metaTitle: itemToEdit?.metaTitle || "",
        metaDescription: itemToEdit?.metaDescription || "",
        slugUrl: itemToEdit?.slugUrl || "",
        platforms: {
          myntra: itemToEdit?.platforms?.myntra?.enabled || false,
          amazon: itemToEdit?.platforms?.amazon?.enabled || false,
          flipkart: itemToEdit?.platforms?.flipkart?.enabled || false,
          nykaa: itemToEdit?.platforms?.nykaa?.enabled || false
        },
        actions: {
          moveToSale: itemToEdit?.moveToSale || false,
          keepCopyAndMove: itemToEdit?.keepCopyAndMove || false,
          moveToEyx: itemToEdit?.moveToEyx || false
        }
      });
      
      modalState.setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
      try {
        const formData = modalState.editFormData;
        const itemId = modalState.editingItem.id || modalState.editingItem._id;
        
        // Prepare the updated data structure
        const updatedData = {
          productName: formData.productName,
          title: formData.title,
          description: formData.description,
          manufacturingDetails: formData.manufacturingDetails,
          shippingReturns: formData.shippingReturns,
          returnable: formData.returnable,
          category: formData.category,
          subCategory: formData.subCategory,
          hsn: formData.hsn,
          regularPrice: parseInt(formData.regularPrice) || 0,
          salePrice: parseInt(formData.salePrice) || 0,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          slugUrl: formData.slugUrl,
          
          // Update sizes array with new data
          sizes: formData.sizes.map(sizeData => ({
            size: sizeData.size,
            quantity: parseInt(sizeData.quantity) || 0,
            sku: sizeData.sku,
            barcode: sizeData.barcode,
            hsnCode: formData.hsn
          })),
          
          // Update pricing
          price: parseInt(formData.regularPrice) || parseInt(formData.sizes[0]?.price) || modalState.editingItem.price || 0,
          
          // Update platform settings
          platformPricing: {
            myntra: { 
              enabled: formData.platforms.myntra, 
              price: formData.sizes[0]?.price || modalState.editingItem.price || 0 
            },
            amazon: { 
              enabled: formData.platforms.amazon, 
              price: formData.sizes[0]?.price || modalState.editingItem.price || 0 
            },
            flipkart: { 
              enabled: formData.platforms.flipkart, 
              price: formData.sizes[0]?.price || modalState.editingItem.price || 0 
            },
            nykaa: { 
              enabled: formData.platforms.nykaa, 
              price: formData.sizes[0]?.price || modalState.editingItem.price || 0 
            }
          },
          
          // Update action flags
          moveToSale: formData.actions.moveToSale,
          keepCopyAndMove: formData.actions.keepCopyAndMove,
          moveToEyx: formData.actions.moveToEyx,
          
          // Keep existing fields that shouldn't be changed
          status: modalState.editingItem.status,
          image: modalState.editingItem.image,
          thumbnail: modalState.editingItem.thumbnail,
          variants: modalState.editingItem.variants || [],
          filters: modalState.editingItem.filters || [],
          tags: modalState.editingItem.tags || []
        };

        console.log("Saving edit for item:", itemId, updatedData);

        // Call the productAPI updateProduct method
        const response = await productAPI.updateProduct(itemId, updatedData);

        if (response && (response.success || response.data)) {
          // Update the local state to reflect the changes
          const updatedItem = { 
            ...modalState.editingItem, 
            ...updatedData,
            id: itemId,
            _id: itemId
          };
          
          // Update allItems array
          state.setAllItems(prevItems => 
            prevItems.map(item => 
              (item.id === itemId || item._id === itemId)
                ? updatedItem
                : item
            )
          );
          
          // Update other relevant arrays if needed
          if (modalState.editingItem.status === 'draft') {
            state.setDraftItems(prevItems => 
              prevItems.map(item => 
                (item.id === itemId || item._id === itemId)
                  ? updatedItem
                  : item
              )
            );
          } else if (modalState.editingItem.status === 'live' || modalState.editingItem.status === 'published') {
            state.setPublishedItems(prevItems => 
              prevItems.map(item => 
                (item.id === itemId || item._id === itemId)
                  ? updatedItem
                  : item
              )
            );
          }

          modalState.setIsEditModalOpen(false);
          modalState.setEditingItem(null);
          modalState.setNewDetails("");
          modalState.setIsSuccessModalOpen(true);
          
          console.log("Product updated successfully:", response);
        } else {
          console.error("Failed to update product:", response);
          alert("Failed to update product. Please try again.");
        }
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Error updating product: " + (error.message || "Unknown error"));
      }
    };

    const handleCloseEdit = () => {
      modalState.setIsEditModalOpen(false);
      modalState.setEditingItem(null);
      modalState.setNewDetails("");
    };

    // Helper functions for form input changes
    const handleFormFieldChange = (field, value) => {
      modalState.setEditFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleSizeFieldChange = (sizeIndex, field, value) => {
      modalState.setEditFormData(prev => ({
        ...prev,
        sizes: prev.sizes.map((size, index) => 
          index === sizeIndex ? { ...size, [field]: value } : size
        )
      }));
    };

    const handlePlatformChange = (platform, enabled) => {
      modalState.setEditFormData(prev => ({
        ...prev,
        platforms: { ...prev.platforms, [platform]: enabled }
      }));
    };

    const handleActionChange = (action, enabled) => {
      modalState.setEditFormData(prev => ({
        ...prev,
        actions: { ...prev.actions, [action]: enabled }
      }));
    };

    const handleVariantFieldChange = (variantIndex, field, value) => {
      // Update the editing item's variants directly since they're not in the form data
      modalState.setEditingItem(prev => ({
        ...prev,
        variants: prev.variants.map((variant, index) => 
          index === variantIndex ? { ...variant, [field]: value } : variant
        )
      }));
    };

    const handleCloseSuccess = () => {
      modalState.setIsSuccessModalOpen(false);
    };

    return {
      handleBulkUpload,
      handleUploadSingleProduct,
      handleRefreshData,
      handleEdit,
      handleSaveEdit,
      handleCloseEdit,
      handleCloseSuccess,
      handleFormFieldChange,
      handleSizeFieldChange,
      handlePlatformChange,
      handleActionChange,
      handleVariantFieldChange,
    };
  }, [navigate, allItems]); // Removed the problematic function dependencies

  // Optimized delete handlers
  const deleteHandlers = useMemo(() => {
    const handleDelete = (itemId) => {
      const itemToDeleteObj = allItems.find((item) => item.id === itemId);
      if (!itemToDeleteObj) {
        console.error("Item not found for deletion:", itemId);
        alert("Item not found. Please refresh the page and try again.");
        return;
      }
      modalState.setItemToDelete(itemToDeleteObj);
      modalState.setIsDeleteConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
      try {
        if (!modalState.itemToDelete) {
          console.error("No item to delete");
          return;
        }

        console.log("Deleting item:", modalState.itemToDelete.id);

        // Call the API to delete the product
        await productAPI.deleteProduct(modalState.itemToDelete.id);

        // Update local state based on item status
        if (modalState.itemToDelete.status === "draft") {
          const updatedDrafts = (state.draftItems || []).filter(
            (item) => item.id !== modalState.itemToDelete.id
          );
          state.setDraftItems(updatedDrafts);
          localStorage.setItem(
            "yoraa_draft_items",
            JSON.stringify(updatedDrafts)
          );
        } else if (modalState.itemToDelete.status === "live") {
          const updatedPublished = (state.publishedItems || []).filter(
            (item) => item.id !== modalState.itemToDelete.id
          );
          state.setPublishedItems(updatedPublished);
          localStorage.setItem(
            "yoraa_published_items",
            JSON.stringify(updatedPublished)
          );
        } else if (modalState.itemToDelete.status === "scheduled") {
          const updatedScheduled = (state.scheduledItems || []).filter(
            (item) => item.id !== modalState.itemToDelete.id
          );
          state.setScheduledItems(updatedScheduled);
          localStorage.setItem(
            "yoraa_scheduled_items",
            JSON.stringify(updatedScheduled)
          );
        }

        // Update allItems as well
        const updatedAllItems = (state.allItems || []).filter(
          (item) => item.id !== modalState.itemToDelete.id
        );
        state.setAllItems(updatedAllItems);

        // Update statistics
        const currentStats = state.statistics || { total: 0, draft: 0, live: 0, scheduled: 0 };
        const updatedStats = {
          ...currentStats,
          total: Math.max(0, (currentStats.total || 0) - 1),
          [modalState.itemToDelete.status]: Math.max(0, (currentStats[modalState.itemToDelete.status] || 0) - 1)
        };
        state.setStatistics(updatedStats);

        modalState.setIsDeleteConfirmModalOpen(false);
        modalState.setItemToDelete(null);
        modalState.setIsDeleteSuccessModalOpen(true);
        
        console.log("Item deleted successfully");
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item. Please try again.");
        // Reset modal states even on error
        modalState.setIsDeleteConfirmModalOpen(false);
        modalState.setItemToDelete(null);
      }
    };

    const handleCancelDelete = () => {
      modalState.setIsDeleteConfirmModalOpen(false);
      modalState.setItemToDelete(null);
    };

    const handleCloseDeleteSuccess = () => {
      modalState.setIsDeleteSuccessModalOpen(false);
    };

    return {
      handleDelete,
      handleConfirmDelete,
      handleCancelDelete,
      handleCloseDeleteSuccess,
    };
  }, [
    allItems.length, // Use length instead of the full array
    modalState.itemToDelete?.id,
  ]);

  // Meta data input change handler
  const handleMetaInputChange = useCallback(
    (field, value) => {
      modalState.setMetaFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [modalState.setMetaFormData]
  );

  // Optimized metadata handlers
  const metaDataHandlers = useMemo(() => {
    const handleViewMetaData = (item) => {
      modalState.setSelectedItemForMeta(item);
      modalState.setMetaFormData({
        metaTitle: item.metaTitle || "",
        metaDescription: item.metaDescription || "",
        slugUrl: item.slugUrl || "",
      });
      modalState.setIsMetaDataModalOpen(true);
    };

    const handleCloseMetaData = () => {
      modalState.setIsMetaDataModalOpen(false);
      modalState.setSelectedItemForMeta(null);
      modalState.setMetaFormData({
        metaTitle: "",
        metaDescription: "",
        slugUrl: "",
      });
    };

    const handleSaveMetaData = async () => {
      try {
        const itemId = modalState.selectedItemForMeta.id || modalState.selectedItemForMeta._id;
        const updatedMetaData = {
          metaTitle: modalState.metaFormData.metaTitle,
          metaDescription: modalState.metaFormData.metaDescription,
          slugUrl: modalState.metaFormData.slugUrl,
        };

        console.log(
          "Saving meta data for item:",
          itemId,
          "Data:",
          updatedMetaData
        );

        // Call the productAPI updateProduct method to save metadata
        const response = await productAPI.updateProduct(itemId, updatedMetaData);

        if (response && response.success) {
          // Update the local state to reflect the changes
          setManageItemsState(prevState => ({
            ...prevState,
            items: prevState.items.map(item => 
              (item.id === itemId || item._id === itemId)
                ? { ...item, ...updatedMetaData }
                : item
            )
          }));

          modalState.setIsMetaDataModalOpen(false);
          modalState.setSelectedItemForMeta(null);
          modalState.setMetaFormData({
            metaTitle: "",
            metaDescription: "",
            slugUrl: "",
          });
          modalState.setIsMetaDataSuccessModalOpen(true);
          
          console.log("Metadata saved successfully");
        } else {
          console.error("Failed to save metadata:", response);
          alert("Failed to save metadata. Please try again.");
        }
      } catch (error) {
        console.error("Error saving metadata:", error);
        alert("Error saving metadata: " + (error.message || "Unknown error"));
      }
    };

    const handleCloseMetaDataSuccess = () => {
      modalState.setIsMetaDataSuccessModalOpen(false);
    };

    return {
      handleViewMetaData,
      handleCloseMetaData,
      handleSaveMetaData,
      handleCloseMetaDataSuccess,
      handleMetaInputChange,
    };
  }, [modalState.selectedItemForMeta?.id, handleMetaInputChange]);

  // Optimized item action handlers
  const handleItemAction = useCallback(
    (itemId, action, value) => {
      const actionMessages = {
        moveToSale: value ? 'Moving item to sale' : 'Removing item from sale',
        keepCopyAndMove: value ? 'Creating copy and moving to sale' : 'Cancelling copy and move action',
        moveToEyx: value ? 'Moving item to Eyx platform' : 'Removing item from Eyx platform'
      };
      
      console.log(`${actionMessages[action] || action} for item ${itemId}:`, value);

      // All items are now editable - no read-only static items

      // Update draft items
      const draftItemIndex = state.draftItems.findIndex(
        (item) => item.id === itemId
      );
      if (draftItemIndex !== -1) {
        const updatedDrafts = [...state.draftItems];
        updatedDrafts[draftItemIndex] = {
          ...updatedDrafts[draftItemIndex],
          [action]: value,
        };
        state.setDraftItems(updatedDrafts);
        localStorage.setItem(
          "yoraa_draft_items",
          JSON.stringify(updatedDrafts)
        );
        return;
      }

      // Update published items
      const publishedItemIndex = state.publishedItems.findIndex(
        (item) => item.id === itemId
      );
      if (publishedItemIndex !== -1) {
        const updatedPublished = [...state.publishedItems];
        updatedPublished[publishedItemIndex] = {
          ...updatedPublished[publishedItemIndex],
          [action]: value,
        };
        state.setPublishedItems(updatedPublished);
        localStorage.setItem(
          "yoraa_published_items",
          JSON.stringify(updatedPublished)
        );
        return;
      }

      // Update allItems if the item exists there
      const allItemIndex = state.allItems.findIndex(
        (item) => item.id === itemId
      );
      if (allItemIndex !== -1) {
        const updatedAllItems = [...state.allItems];
        updatedAllItems[allItemIndex] = {
          ...updatedAllItems[allItemIndex],
          [action]: value,
        };
        state.setAllItems(updatedAllItems);
        
        // Also save to API if needed - you can implement API call here
        console.log(`Updated ${action} for item ${itemId} in allItems`);
        
        // Show success message in console for now
        console.log(`✓ ${actionMessages[action] || `${action} updated`}`);
        
        return;
      }

      console.log("Item not found in any collection");
    },
    [state.draftItems, state.publishedItems, state.allItems, state.setDraftItems, state.setPublishedItems, state.setAllItems]
  );

  // Optimized item lifecycle handlers with focused dependencies
  const lifecycleHandlers = useMemo(() => {
    // Make Live handlers
    const handleMakeLive = (item) => {
      modalState.setItemToMakeLive(item);
      modalState.setIsMakeLiveConfirmModalOpen(true);
    };

    const handleConfirmMakeLive = async () => {
      if (modalState.itemToMakeLive) {
        try {
          // Update product status in database
          await productAPI.publishProduct(modalState.itemToMakeLive._id || modalState.itemToMakeLive.id);
          
          // Update local state - move item from draft to published
          const updatedItem = {
            ...modalState.itemToMakeLive,
            status: "published", // Changed from "live" to "published" to match backend
            publishedAt: new Date().toISOString(),
          };

          // Update in allItems array
          const updatedAllItems = state.allItems.map(item => 
            (item._id || item.id) === (modalState.itemToMakeLive._id || modalState.itemToMakeLive.id)
              ? updatedItem
              : item
          );
          state.setAllItems(updatedAllItems);

          // Remove from drafts if it exists there
          const updatedDrafts = state.draftItems.filter(
            (item) => (item._id || item.id) !== (modalState.itemToMakeLive._id || modalState.itemToMakeLive.id)
          );
          state.setDraftItems(updatedDrafts);
          localStorage.setItem("yoraa_draft_items", JSON.stringify(updatedDrafts));

          // Add to published items if not already there
          const existsInPublished = state.publishedItems.some(
            item => (item._id || item.id) === (modalState.itemToMakeLive._id || modalState.itemToMakeLive.id)
          );
          if (!existsInPublished) {
            const updatedPublished = [...state.publishedItems, updatedItem];
            state.setPublishedItems(updatedPublished);
            localStorage.setItem("yoraa_published_items", JSON.stringify(updatedPublished));
          }

          console.log("✓ Item successfully published:", modalState.itemToMakeLive.productName);
          
          modalState.setIsMakeLiveConfirmModalOpen(false);
          modalState.setItemToMakeLive(null);
          modalState.setIsMakeLiveSuccessModalOpen(true);
        } catch (error) {
          console.error("Error publishing item:", error);
          // You could add error notification here
          modalState.setIsMakeLiveConfirmModalOpen(false);
          modalState.setItemToMakeLive(null);
        }
      }
    };

    const handleCancelMakeLive = () => {
      modalState.setIsMakeLiveConfirmModalOpen(false);
      modalState.setItemToMakeLive(null);
    };

    const handleCloseMakeLiveSuccess = () => {
      modalState.setIsMakeLiveSuccessModalOpen(false);
    };

    // Schedule handlers
    const handleScheduleItem = (item) => {
      modalState.setItemToSchedule(item);
      modalState.setScheduleDate("");
      modalState.setScheduleTime("");
      modalState.setIsScheduleModalOpen(true);
    };

    const handleConfirmSchedule = async () => {
      if (
        modalState.itemToSchedule &&
        modalState.scheduleDate &&
        modalState.scheduleTime
      ) {
        try {
          // Update product scheduling in database
          await productAPI.scheduleProduct(
            modalState.itemToSchedule._id || modalState.itemToSchedule.id,
            {
              date: modalState.scheduleDate,
              time: modalState.scheduleTime
            }
          );

          // Update local state
          const updatedItem = {
            ...modalState.itemToSchedule,
            status: "scheduled",
            scheduledDate: modalState.scheduleDate,
            scheduledTime: modalState.scheduleTime,
            scheduledAt: new Date().toISOString(),
          };

          // Update in allItems array
          const updatedAllItems = state.allItems.map(item => 
            (item._id || item.id) === (modalState.itemToSchedule._id || modalState.itemToSchedule.id)
              ? updatedItem
              : item
          );
          state.setAllItems(updatedAllItems);

          // Update drafts if item exists there
          const updatedDrafts = state.draftItems.map((item) =>
            (item._id || item.id) === (modalState.itemToSchedule._id || modalState.itemToSchedule.id)
              ? updatedItem
              : item
          );
          state.setDraftItems(updatedDrafts);
          localStorage.setItem("yoraa_draft_items", JSON.stringify(updatedDrafts));

          console.log(
            "✓ Item scheduled successfully:",
            modalState.itemToSchedule.productName,
            "for",
            modalState.scheduleDate,
            "at",
            modalState.scheduleTime
          );
          
          modalState.setIsScheduleModalOpen(false);
          modalState.setItemToSchedule(null);
          modalState.setScheduleDate("");
          modalState.setScheduleTime("");
          modalState.setIsScheduleSuccessModalOpen(true);
        } catch (error) {
          console.error("Error scheduling item:", error);
          // You could add error notification here
          modalState.setIsScheduleModalOpen(false);
          modalState.setItemToSchedule(null);
          modalState.setScheduleDate("");
          modalState.setScheduleTime("");
        }
      }
    };

    const handleCancelSchedule = () => {
      modalState.setIsScheduleModalOpen(false);
      modalState.setItemToSchedule(null);
      modalState.setScheduleDate("");
      modalState.setScheduleTime("");
    };

    const handleCloseScheduleSuccess = () => {
      modalState.setIsScheduleSuccessModalOpen(false);
    };

    // Cancel schedule handlers
    const handleCancelScheduleItem = (item) => {
      modalState.setItemToCancelSchedule(item);
      modalState.setIsCancelScheduleConfirmModalOpen(true);
    };

    const handleConfirmCancelSchedule = async () => {
      if (modalState.itemToCancelSchedule) {
        try {
          // Make API call to cancel schedule
          const response = await productAPI.cancelSchedule(modalState.itemToCancelSchedule._id);
          console.log('Cancel schedule API response:', response.data);

          // Update the item in all relevant arrays
          const updatedItem = {
            ...modalState.itemToCancelSchedule,
            status: "draft",
            scheduledDate: null,
            scheduledTime: null,
            publishAt: null
          };

          // Update allItems array
          state.setAllItems(prev => 
            prev.map(item => 
              item._id === modalState.itemToCancelSchedule._id ? updatedItem : item
            )
          );

          // Update draftItems array
          state.setDraftItems(prev => 
            prev.map(item => 
              item._id === modalState.itemToCancelSchedule._id ? updatedItem : item
            )
          );

          // Update scheduledItems array (remove from scheduled)
          state.setScheduledItems(prev => 
            prev.filter(item => item._id !== modalState.itemToCancelSchedule._id)
          );

          console.log('Successfully cancelled schedule for item:', modalState.itemToCancelSchedule._id);
          
          // Show success modal
          modalState.setIsCancelScheduleSuccessModalOpen(true);
        } catch (error) {
          console.error('Error cancelling schedule:', error);
          // You can add error handling UI here if needed
        }
      }
      modalState.setIsCancelScheduleConfirmModalOpen(false);
      modalState.setItemToCancelSchedule(null);
    };

    const handleCancelCancelSchedule = () => {
      modalState.setIsCancelScheduleConfirmModalOpen(false);
      modalState.setItemToCancelSchedule(null);
    };

    const handleCloseCancelScheduleSuccess = () => {
      modalState.setIsCancelScheduleSuccessModalOpen(false);
    };

    return {
      handleMakeLive,
      handleConfirmMakeLive,
      handleCancelMakeLive,
      handleCloseMakeLiveSuccess,
      handleScheduleItem,
      handleConfirmSchedule,
      handleCancelSchedule,
      handleCloseScheduleSuccess,
      handleCancelScheduleItem,
      handleConfirmCancelSchedule,
      handleCancelCancelSchedule,
      handleCloseCancelScheduleSuccess,
    };
  }, [
    modalState.itemToMakeLive?.id,
    modalState.itemToSchedule?.id,
    modalState.scheduleDate,
    modalState.scheduleTime,
    modalState.itemToCancelSchedule?.id,
    state.draftItems.length,
    state.publishedItems.length,
  ]);

  // Memoized component renderers for better performance
  const renderHeader = useCallback(
    () => (
      <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-b from-white to-gray-50">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <h1 className="text-[24px] font-bold text-[#111111] font-['Montserrat'] tracking-tight">
            Manage Items
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={actionHandlers.handleRefreshData}
              disabled={state.isLoading}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-['Montserrat'] font-medium py-2.5 px-4 rounded-lg transition-all duration-200 ease-in-out shadow-md text-[14px] hover:shadow-lg"
              title="Refresh data"
            >
              <RefreshCw className={`h-5 w-5 ${state.isLoading ? 'animate-spin' : ''}`} />
              <span className="leading-[20px]">Refresh</span>
            </button>
            <button
              onClick={actionHandlers.handleBulkUpload}
              className="flex items-center gap-2 bg-[#000aff] hover:bg-blue-700 text-white font-['Montserrat'] font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out shadow-md border border-[#7280ff] text-[14px] hover:shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span className="leading-[20px]">Bulk Upload</span>
            </button>
            <button
              onClick={actionHandlers.handleUploadSingleProduct}
              className="flex items-center gap-2 bg-[#000aff] hover:bg-blue-700 text-white font-['Montserrat'] font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out shadow-md border border-[#7280ff] text-[14px] hover:shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span className="leading-[20px]">Upload single product</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#667085]" />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={state.searchTerm}
              onChange={(e) => state.setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-[#d0d5dd] rounded-lg bg-white placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm font-['Montserrat'] text-[16px] leading-[24px] transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-4">
            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={state.selectedCategory}
                onChange={(e) => state.setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border-2 border-black rounded-xl px-4 py-3 pr-8 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[153px] h-[47px] font-['Montserrat'] text-[14px] text-center leading-[16px] hover:border-blue-400 transition-all"
              >
                <option value="All categories">All categories</option>
                {state.isCategoriesLoading ? (
                  <option disabled>Loading categories...</option>
                ) : (
                  categories.map((category, index) => (
                    <option key={category._id || index} value={category.name || category}>
                      {category.name || category}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-black" />
              </div>
            </div>

            {/* Sub Category Dropdown */}
            <div className="relative">
              <select
                value={state.selectedSubCategory}
                onChange={(e) => state.setSelectedSubCategory(e.target.value)}
                className="appearance-none bg-white border-2 border-black rounded-xl px-4 py-3 pr-8 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[153px] h-[47px] font-['Montserrat'] text-[14px] text-center leading-[16px] hover:border-blue-400 transition-all"
              >
                <option value="All subcategories">All subcategories</option>
                {state.isSubCategoriesLoading ? (
                  <option disabled>Loading subcategories...</option>
                ) : (
                  subCategories.map((subCategory, index) => (
                    <option key={subCategory._id || index} value={subCategory.name || subCategory}>
                      {subCategory.name || subCategory}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-black" />
              </div>
            </div>

            {/* Items Dropdown */}
            <div className="relative">
              <select 
                value={state.selectedItem}
                onChange={(e) => state.setSelectedItem(e.target.value)}
                className="appearance-none bg-white border-2 border-black rounded-xl px-4 py-3 pr-8 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[153px] h-[47px] font-['Montserrat'] text-[14px] text-center leading-[16px] hover:border-blue-400 transition-all"
              >
                <option value="Items">Items</option>
                {state.isLoading ? (
                  <option disabled>Loading items...</option>
                ) : (
                  state.allItems.map((item, index) => (
                    <option key={item.id || index} value={item.productName || item.title}>
                      {item.productName || item.title}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-black" />
              </div>
            </div>

            {/* Filters Button with Dropdown */}
            <div className="relative filter-dropdown">
              <button
                onClick={filterHandlers.toggleFilterDropdown}
                className="flex items-center gap-2 bg-white border border-[#d0d5dd] rounded-lg px-4 py-2.5 text-[#344054] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-[40px] font-['Montserrat'] text-[14px] shadow-sm hover:shadow-md transition-all"
              >
                <Filter className="h-5 w-5" />
                <span className="leading-[20px]">Filters</span>
              </button>

              {/* Dropdown Menu */}
              {state.isFilterDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-[274px] bg-white rounded-xl shadow-lg z-50 overflow-hidden border border-gray-100">
                  <div className="px-[27px] py-3 border-b border-gray-200 bg-gray-50">
                    <p className="text-[14px] font-medium text-[#555] font-['Montserrat'] uppercase tracking-wide">
                      Choose sort by
                    </p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() =>
                        filterHandlers.handleFilterOption("all_live")
                      }
                      className={`w-full px-8 py-2 text-left hover:bg-gray-50 transition-colors ${
                        state.statusFilter === "live"
                          ? "bg-blue-50 text-blue-600"
                          : "text-[#000000]"
                      }`}
                    >
                      <span className="text-[15px] font-medium font-['Montserrat']">
                        View all live
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        filterHandlers.handleFilterOption("all_scheduled")
                      }
                      className={`w-full px-8 py-2 text-left hover:bg-gray-50 transition-colors ${
                        state.statusFilter === "scheduled"
                          ? "bg-blue-50 text-blue-600"
                          : "text-[#010101]"
                      }`}
                    >
                      <span className="text-[14px] font-medium font-['Montserrat']">
                        View all scheduled
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        filterHandlers.handleFilterOption("all_drafts")
                      }
                      className={`w-full px-8 py-2 text-left hover:bg-gray-50 transition-colors ${
                        state.statusFilter === "draft"
                          ? "bg-blue-50 text-blue-600"
                          : "text-[#010101]"
                      }`}
                    >
                      <span className="text-[14px] font-medium font-['Montserrat']">
                        View all drafts
                      </span>
                    </button>

                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={() =>
                          filterHandlers.handleFilterOption("clear_filters")
                        }
                        className="w-full px-8 py-2 text-left hover:bg-gray-50 transition-colors text-[#010101]"
                      >
                        <span className="text-[14px] font-medium font-['Montserrat']">
                          Clear all filters
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    [
      actionHandlers,
      state.searchTerm,
      state.selectedCategory,
      state.selectedSubCategory,
      state.isFilterDropdownOpen,
      state.statusFilter,
      filterHandlers,
    ]
  );

  // Memoized statistics calculations - use API data when available
  const currentStatistics = useMemo(() => {
    // Use API statistics if available, otherwise calculate from current items
    if (!state.isLoading && state.statistics.total > 0) {
      return {
        draftsCount: state.statistics.drafts,
        liveCount: state.statistics.live,
        scheduledCount: state.statistics.scheduled,
        totalCount: state.statistics.total
      };
    }
    
    // Fallback to calculating from current items
    const draftsCount = allItems.filter(
      (item) => item.status === "draft"
    ).length;
    const liveCount = allItems.filter((item) => item.status === "live").length;
    const scheduledCount = allItems.filter(
      (item) => item.status === "scheduled"
    ).length;
    const totalCount = allItems.length;

    return { draftsCount, liveCount, scheduledCount, totalCount };
  }, [state.isLoading, state.statistics, allItems]);

  const renderFilterSummary = useCallback(
    () => (
      <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-lg font-bold text-[#111111] font-['Montserrat'] tracking-tight">
              Showing {filteredItems.length} items
            </span>

            {(state.showDraftsOnly ||
              state.showLiveOnly ||
              state.showScheduledOnly) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-[#666666] font-['Montserrat']">
                  Filtered by:
                </span>
                {state.showDraftsOnly && (
                  <span className="bg-[#ef3826] text-white text-xs font-medium font-['Montserrat'] px-3 py-1 rounded-full shadow-sm">
                    Draft Items
                  </span>
                )}
                {state.showLiveOnly && (
                  <span className="bg-[#22c55e] text-white text-xs font-medium font-['Montserrat'] px-3 py-1 rounded-full shadow-sm">
                    Live Items
                  </span>
                )}
                {state.showScheduledOnly && (
                  <span className="bg-[#eab308] text-white text-xs font-medium font-['Montserrat'] px-3 py-1 rounded-full shadow-sm">
                    Scheduled Items
                  </span>
                )}
              </div>
            )}
          </div>

          {(state.showDraftsOnly ||
            state.showLiveOnly ||
            state.showScheduledOnly) && (
            <button
              onClick={filterHandlers.clearAllFilters}
              className="bg-white hover:bg-gray-100 text-sm text-[#666666] hover:text-[#111111] font-['Montserrat'] px-4 py-1.5 rounded-md border border-gray-300 transition-all duration-150 shadow-sm hover:shadow-md"
              title="Alt + C to clear filters"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Summary Statistics */}
        <div className="flex items-center gap-6 text-sm font-['Montserrat'] flex-wrap">
          {state.isLoading ? (
            <div className="flex items-center gap-2 text-[#666666]">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Loading statistics...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-[#ef3826] rounded-full shadow-sm"></span>
                <span className="text-[#666666]">
                  Drafts:{" "}
                  <span className="font-medium text-[#111111]">
                    {currentStatistics.draftsCount}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-[#22c55e] rounded-full shadow-sm"></span>
                <span className="text-[#666666]">
                  Live:{" "}
                  <span className="font-medium text-[#111111]">
                    {currentStatistics.liveCount}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-[#eab308] rounded-full shadow-sm"></span>
                <span className="text-[#666666]">
                  Scheduled:{" "}
                  <span className="font-medium text-[#111111]">
                    {currentStatistics.scheduledCount}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-[#6b7280] rounded-full shadow-sm"></span>
                <span className="text-[#666666]">
                  Total:{" "}
                  <span className="font-medium text-[#111111]">
                    {currentStatistics.totalCount}
                  </span>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    ),
    [
      filteredItems.length,
      state.showDraftsOnly,
      state.showLiveOnly,
      state.showScheduledOnly,
      state.isLoading,
      currentStatistics,
      filterHandlers.clearAllFilters
    ]
  );

  // Item action handlers object
  const itemActionHandlers = useMemo(() => ({
    handleItemAction
  }), [handleItemAction]);

  // Memoized item row component for better performance
  const ItemRow = memo(({ item, index }) => (
    <React.Fragment key={item.id}>
      <tr className="even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors duration-200">
        {/* Product Image */}
        <td className="px-4 py-3 text-center">
          <div className="flex justify-center">
            <div className="w-[120px] h-[116px] bg-gray-200 rounded-md overflow-hidden shadow-inner hover:scale-105 transition-transform duration-200">
              <img
                src={item.image || '/placeholder-image.jpg'}
                alt={item.productName || item.title || 'Product Image'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjExNiIgdmlld0JveD0iMCAwIDEyMCAxMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTE2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA0MEg4MFY3Nkg0MFY0MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHN2Zz4K';
                }}
              />
            </div>
          </div>
        </td>

        {/* Product Name */}
        <td className="px-4 py-3 text-center">
          <div className="text-gray-800 text-[14px] font-semibold font-['Montserrat'] tracking-wide">
            {item.productName || item.title || 'Unknown Product'}
          </div>
        </td>

        {/* Category */}
        <td className="px-4 py-3 text-center">
          <div className="text-gray-800 text-[14px] font-medium font-['Montserrat'] tracking-wide">
            {item.category || 'Unknown Category'}
          </div>
        </td>

        {/* Sub Categories */}
        <td className="px-4 py-3 text-center">
          <div className="text-gray-800 text-[14px] font-medium font-['Montserrat'] tracking-wide">
            {item.subCategories || item.subCategory || 'Unknown Subcategory'}
          </div>
        </td>

        {/* Filters */}
        <td className="px-4 py-3 text-center">
          <div className="flex flex-wrap gap-1 justify-center max-w-[150px]">
            {(item.filters || []).map((filter, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                title={`${filter.key}: ${filter.values?.map(v => v.name).join(', ')}`}
              >
                <Tag size={10} className="mr-1" />
                {filter.key}
              </span>
            ))}
            {(!item.filters || item.filters.length === 0) && (
              <span className="text-gray-400 text-xs font-['Montserrat']">
                No filters
              </span>
            )}
          </div>
        </td>

        {/* HSN */}
        <td className="px-4 py-3 text-center">
          <div className="text-gray-800 text-[14px] font-medium font-['Montserrat'] tracking-wide">
            {item.hsn || 'N/A'}
          </div>
        </td>

        {/* Size */}
        <td className="px-4 py-3 text-center">
          <div className="flex flex-col gap-1">
            {(item.sizes || []).map((size, idx) => (
              <div key={idx} className="text-gray-800 text-xs">
                {typeof size === 'string' ? size : size?.size || 'N/A'}
              </div>
            ))}
          </div>
        </td>

        {/* Quantity */}
        <td className="px-4 py-3 text-center">
          <div className="flex flex-col gap-1">
            {(item.sizes || []).map((size, idx) => (
              <div key={idx} className="text-gray-800 text-xs">
                {typeof size === 'string' ? 'N/A' : size?.quantity || '0'}
              </div>
            ))}
          </div>
        </td>

        {/* Price */}
        <td className="px-4 py-3 text-center">
          <div className="flex flex-col gap-1">
            {(item.sizes || []).map((size, idx) => (
              <div key={idx} className="text-gray-800 text-xs">
                ₹{typeof size === 'string' ? 'N/A' : size?.price || '0'}
              </div>
            ))}
          </div>
        </td>

        {/* Sale Price */}
        <td className="px-4 py-3 text-center">
          <div className="flex flex-col gap-1">
            {(item.sizes || []).map((size, idx) => (
              <div key={idx} className="text-gray-800 text-xs">
                ₹{typeof size === 'string' ? 'N/A' : size?.salePrice || '0'}
              </div>
            ))}
          </div>
        </td>

        {/* Alternate Price */}
        <td className="px-4 py-3 text-center">
          <div className="flex flex-col gap-4 text-xs">
            {item.platformPricing ? (
              Object.entries(item.platformPricing).map(([platform, data]) => (
                data?.enabled && (
                  <div key={platform} className="flex items-center justify-between">
                    <span className="capitalize">{platform}:</span>
                    <span>₹{data?.price || '0'}</span>
                  </div>
                )
              ))
            ) : (
              <div>N/A</div>
            )}
          </div>
        </td>

        {/* SKU */}
        <td className="px-4 py-3 text-center">
          <div className="flex flex-col gap-1">
            {(item.sizes || []).map((size, idx) => (
              <div key={idx} className="text-gray-800 text-xs">
                {typeof size === 'string' ? 'N/A' : size?.sku || 'N/A'}
              </div>
            ))}
          </div>
        </td>

        {/* Barcode */}
        <td className="px-4 py-3 text-center">
          <div className="flex flex-col gap-1">
            {(item.sizes || []).map((size, idx) => (
              <div key={idx} className="text-gray-800 text-xs">
                {typeof size === 'string' ? 'N/A' : size?.barcode || 'N/A'}
              </div>
            ))}
          </div>
        </td>

        {/* Status */}
        <td className="px-4 py-3 text-center">
          <span
            className={`${utils.getStatusStyle(
              item.status
            )} text-[14px] font-semibold font-['Montserrat'] rounded-full px-3 py-1`}
          >
            {item.status || 'Draft'}
          </span>
          {item.status === "scheduled" && item.scheduledDate && item.scheduledTime && (
            <div className="text-[10px] text-gray-500 mt-1 font-['Montserrat']">
              {utils.formatScheduledDateTime(item.scheduledDate, item.scheduledTime)}
            </div>
          )}
        </td>

        {/* Meta Data */}
        <td className="px-4 py-3 text-center">
          <button
            onClick={() => metaDataHandlers.handleViewMetaData(item)}
            className="bg-black text-white text-[12px] font-medium font-['Montserrat'] px-3 py-1 rounded-md hover:bg-gray-800 transition-colors"
          >
            View Meta Data
          </button>
        </td>

        {/* Actions */}
        <td className="px-4 py-3 text-center">
          <div className="flex justify-center gap-2 flex-wrap">
            {item.status === "draft" ? (
              <>
                <button
                  onClick={() => lifecycleHandlers.handleMakeLive(item)}
                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                  title="Make Live"
                >
                  <Tag className="h-4 w-4" />
                </button>
                <button
                  onClick={() => lifecycleHandlers.handleSchedule(item)}
                  className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                  title="Schedule"
                >
                  <ClockIcon className="h-4 w-4" />
                </button>
              </>
            ) : item.status === "scheduled" ? (
              <button
                onClick={() => lifecycleHandlers.handleCancelSchedule(item)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Cancel Schedule"
              >
                <CalendarXIcon className="h-4 w-4" />
              </button>
            ) : null}

            {/* Edit and Delete buttons - available for all statuses */}
            <button
              onClick={() => editHandlers.handleEdit(item)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Edit"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => deleteHandlers.handleDelete(item)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Row-level Bulk Actions - Additional row */}
      <tr className="bg-gray-50 border-t border-gray-200">
        <td colSpan="15" className="px-4 py-2">
          <div className="text-[12px] font-['Montserrat'] transition-all duration-200">
            <div className="flex items-center gap-8">
              <div
                className={`flex items-center gap-2 ${
                  item.moveToSale ? "bg-blue-50 p-2 rounded-md transition" : ""
                }`}
              >
                <input
                  type="checkbox"
                  id={`move-to-sale-${item.id}`}
                  checked={item.moveToSale}
                  onChange={(e) =>
                    itemActionHandlers.handleItemAction(
                      item.id,
                      "moveToSale",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 rounded-[3px] border-[#bcbcbc] text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor={`move-to-sale-${item.id}`}
                  className={`${
                    item.moveToSale ? "text-blue-700 font-medium" : "text-black"
                  }`}
                >
                  move to sale
                </label>
              </div>

              <div
                className={`flex items-center gap-2 ${
                  item.keepCopyAndMove
                    ? "bg-green-50 p-2 rounded-md transition"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  id={`keep-copy-${item.id}`}
                  checked={item.keepCopyAndMove}
                  onChange={(e) =>
                    itemActionHandlers.handleItemAction(
                      item.id,
                      "keepCopyAndMove",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 rounded-[3px] border-[#bcbcbc] text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor={`keep-copy-${item.id}`}
                  className={`${
                    item.keepCopyAndMove
                      ? "text-green-700 font-medium"
                      : "text-black"
                  }`}
                >
                  make a copy and move to sale
                </label>
              </div>

              <div
                className={`flex items-center gap-2 ${
                  item.moveToEyx ? "bg-purple-50 p-2 rounded-md transition" : ""
                }`}
              >
                <input
                  type="checkbox"
                  id={`move-to-eyx-${item.id}`}
                  checked={item.moveToEyx}
                  onChange={(e) =>
                    itemActionHandlers.handleItemAction(
                      item.id,
                      "moveToEyx",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 rounded-[3px] border-[#bcbcbc] text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor={`move-to-eyx-${item.id}`}
                  className={`${
                    item.moveToEyx
                      ? "text-purple-700 font-medium"
                      : "text-black"
                  }`}
                >
                  move to eyx
                </label>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </React.Fragment>
  ));

  // Set display name for debugging
  ItemRow.displayName = "ItemRow";

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="w-full">
        {renderHeader()}

        {/* Table Section */}
        <div className="px-6 py-6">
          {renderFilterSummary()}

          {/* Table Container */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full min-w-[1350px]">
              {/* Table Header */}
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 py-3 text-[14px] font-semibold text-gray-800 font-['Montserrat'] text-center tracking-wide">
                    Image
                  </th>
                  <th className="px-4 py-3 text-[14px] font-semibold text-gray-800 font-['Montserrat'] text-center tracking-wide min-w-[180px]">
                    Product Name
                  </th>
                  <th className="px-4 py-3 text-[14px] font-semibold text-gray-800 font-['Montserrat'] text-center tracking-wide min-w-[100px]">
                    Category
                  </th>
                  <th className="px-4 py-3 text-[14px] font-semibold text-gray-800 font-['Montserrat'] text-center tracking-wide min-w-[120px]">
                    Subcategory
                  </th>
                  <th className="px-4 py-3 text-[14px] font-semibold text-gray-800 font-['Montserrat'] text-center tracking-wide min-w-[150px]">
                    Filters
                  </th>
                  <th className="px-4 py-3 text-[14px] font-semibold text-gray-800 font-['Montserrat'] text-center tracking-wide min-w-[80px]">
                    HSN
                  </th>
                  <th className="px-4 py-3 text-[14px] font-semibold text-gray-800 font-['Montserrat'] text-center tracking-wide min-w-[80px]">
                    Size
                  </th>
                  <th className="px-4 py-3 text-[14px] font-semibold text-gray-800 font-['Montserrat'] text-center tracking-wide min-w-[80px]">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-[14px] font-semibold text-gray-800 font-['Montserrat'] text-center tracking-wide min-w-[80px]">
                    Price
                  </th>
                  <th className="px-4 py-3 text-[14px] font-semibold text-gray-800 font-['Montserrat'] text-center tracking-wide min-w-[80px]">
                    Sale Price
                  </th>
                  <th className="px-4 py-3 text-[14px] font-semibold text-gray-800 font-['Montserrat'] text-center tracking-wide min-w-[200px]">
                    Alternate Price
                  </th>
                  <th className="px-4 py-3 text-[14px] font-semibold text-gray-800 font-['Montserrat'] text-center tracking-wide min-w-[120px]">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-[14px] font-semibold text-gray-800 font-['Montserrat'] text-center tracking-wide min-w-[120px]">
                    Barcode No.
                  </th>
                  <th className="px-4 py-3 text-[14px] font-semibold text-gray-800 font-['Montserrat'] text-center tracking-wide min-w-[80px]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[14px] font-semibold text-gray-800 font-['Montserrat'] text-center tracking-wide min-w-[120px]">
                    Meta Data
                  </th>
                  <th className="px-4 py-3 text-[14px] font-semibold text-gray-800 font-['Montserrat'] text-center tracking-wide min-w-[120px]">
                    Action
                  </th>
                </tr>
                {/* Platform Headers Row */}
                <tr className="bg-white border-b border-gray-200">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center gap-4 text-[10px] font-medium font-['Montserrat'] text-gray-600">
                      {["myntra", "amazon", "flipkart", "nykaa"].map(
                        (platform) => (
                          <div
                            key={platform}
                            className="flex flex-col items-center gap-1"
                          >
                            <span className="text-green-600 text-lg leading-none">
                              ✓
                            </span>
                            <span className="capitalize">{platform}</span>
                          </div>
                        )
                      )}
                    </div>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item, index) => (
                  <ItemRow 
                    key={item.id || item._id || item.productId || `item-${index}`} 
                    item={item} 
                    index={index} 
                  />
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p className="text-lg font-semibold mb-2">No items found</p>
                <p className="text-sm">
                  {state.searchTerm ||
                  state.selectedCategory !== "All categories" ||
                  state.selectedSubCategory !== "All subcategories"
                    ? "Try adjusting your search or filters"
                    : "Start by uploading your first product"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* All Modal Components */}
        {renderModals()}
      </div>
    </div>
  );

  // Modal rendering function
  function renderModals() {
    return (
      <>
        {/* Edit Item Modal - Enhanced Comprehensive Design */}
        {modalState.isEditModalOpen && modalState.editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white overflow-hidden relative rounded-[12px] shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] w-full max-w-[1920px] h-[90vh] max-h-[800px]">
              {/* Close Button */}
              <button
                onClick={actionHandlers.handleCloseEdit}
                className="absolute right-9 top-9 w-6 h-6 z-10 hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <path d="M15.4238 13.8329C15.6352 14.0442 15.7539 14.3309 15.7539 14.6298C15.7539 14.9286 15.6352 15.2153 15.4238 15.4266C15.2125 15.638 14.9258 15.7567 14.627 15.7567C14.3281 15.7567 14.0414 15.638 13.8301 15.4266L7.87789 9.47258L1.92383 15.4248C1.71248 15.6361 1.42584 15.7548 1.12695 15.7548C0.828065 15.7548 0.541421 15.6361 0.330077 15.4248C0.118732 15.2134 4.45375e-09 14.9268 0 14.6279C-4.45375e-09 14.329 0.118732 14.0424 0.330077 13.831L6.28414 7.87883L0.331951 1.92476C0.120607 1.71342 0.00187504 1.42678 0.00187504 1.12789C0.00187505 0.829003 0.120607 0.542358 0.331951 0.331014C0.543296 0.11967 0.82994 0.000937346 1.12883 0.000937343C1.42771 0.000937339 1.71436 0.11967 1.9257 0.331014L7.87789 6.28508L13.832 0.330076C14.0433 0.118732 14.3299 -4.97944e-09 14.6288 0C14.9277 4.97944e-09 15.2144 0.118732 15.4257 0.330076C15.637 0.541421 15.7558 0.828065 15.7558 1.12695C15.7558 1.42584 15.637 1.71248 15.4257 1.92383L9.47164 7.87883L15.4238 13.8329Z" fill="#1A1A1A" />
                </svg>
              </button>

              {/* Header Section */}
              <div className="text-center pt-6 pb-4">
                <h2 className="font-['Montserrat'] font-normal text-[24px] text-black leading-[16.9px]">
                  Edit Item
                </h2>
              </div>

              {/* Type new details heading */}
              <div className="px-8 mb-6">
                <h3 className="font-['Montserrat'] font-bold text-[24px] text-[#111111] leading-[24px]">
                  Type new details
                </h3>
              </div>

              {/* Main Content in a Scrollable Container */}
              <div className="px-8 pb-20 max-h-[600px] overflow-y-auto">
                
                {/* Product Information Section */}
                <div className="mb-8">
                  <h4 className="font-['Montserrat'] font-bold text-[18px] text-[#111111] mb-4">
                    Product Information
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block font-['Montserrat'] font-medium text-[15px] text-[#111111] mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={modalState.editFormData.productName}
                        onChange={(e) => actionHandlers.handleFormFieldChange('productName', e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <label className="block font-['Montserrat'] font-medium text-[15px] text-[#111111] mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={modalState.editFormData.title}
                        onChange={(e) => actionHandlers.handleFormFieldChange('title', e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter title"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block font-['Montserrat'] font-medium text-[15px] text-[#111111] mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={modalState.editFormData.category}
                        onChange={(e) => actionHandlers.handleFormFieldChange('category', e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter category"
                      />
                    </div>

                    <div>
                      <label className="block font-['Montserrat'] font-medium text-[15px] text-[#111111] mb-2">
                        Sub Category
                      </label>
                      <input
                        type="text"
                        value={modalState.editFormData.subCategory}
                        onChange={(e) => actionHandlers.handleFormFieldChange('subCategory', e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter sub category"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block font-['Montserrat'] font-medium text-[15px] text-[#111111] mb-2">
                      Description
                    </label>
                    <textarea
                      value={modalState.editFormData.description}
                      onChange={(e) => actionHandlers.handleFormFieldChange('description', e.target.value)}
                      className="w-full h-20 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Enter product description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block font-['Montserrat'] font-medium text-[15px] text-[#111111] mb-2">
                        Manufacturing Details
                      </label>
                      <textarea
                        value={modalState.editFormData.manufacturingDetails}
                        onChange={(e) => actionHandlers.handleFormFieldChange('manufacturingDetails', e.target.value)}
                        className="w-full h-16 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Enter manufacturing details"
                      />
                    </div>

                    <div>
                      <label className="block font-['Montserrat'] font-medium text-[15px] text-[#111111] mb-2">
                        Shipping & Returns
                      </label>
                      <textarea
                        value={modalState.editFormData.shippingReturns}
                        onChange={(e) => actionHandlers.handleFormFieldChange('shippingReturns', e.target.value)}
                        className="w-full h-16 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Enter shipping & returns info"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block font-['Montserrat'] font-medium text-[15px] text-[#111111] mb-2">
                        HSN Code
                      </label>
                      <input
                        type="text"
                        value={modalState.editFormData.hsn}
                        onChange={(e) => actionHandlers.handleFormFieldChange('hsn', e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter HSN code"
                      />
                    </div>

                    <div>
                      <label className="block font-['Montserrat'] font-medium text-[15px] text-[#111111] mb-2">
                        Returnable
                      </label>
                      <select
                        value={modalState.editFormData.returnable}
                        onChange={(e) => actionHandlers.handleFormFieldChange('returnable', e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>

                    <div></div>
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="mb-8">
                  <h4 className="font-['Montserrat'] font-bold text-[18px] text-[#111111] mb-4">
                    Pricing Information
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-['Montserrat'] font-medium text-[15px] text-[#111111] mb-2">
                        Regular Price
                      </label>
                      <input
                        type="number"
                        value={modalState.editFormData.regularPrice}
                        onChange={(e) => actionHandlers.handleFormFieldChange('regularPrice', e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block font-['Montserrat'] font-medium text-[15px] text-[#111111] mb-2">
                        Sale Price
                      </label>
                      <input
                        type="number"
                        value={modalState.editFormData.salePrice}
                        onChange={(e) => actionHandlers.handleFormFieldChange('salePrice', e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Size and Inventory Section */}
                <div className="mb-8">
                  <h4 className="font-['Montserrat'] font-bold text-[18px] text-[#111111] mb-4">
                    Size & Inventory Details
                  </h4>
                  
                  {/* Size Table Header */}
                  <div className="grid grid-cols-8 gap-2 mb-2">
                    <div className="font-['Montserrat'] font-medium text-[12px] text-[#111111] text-center">Size</div>
                    <div className="font-['Montserrat'] font-medium text-[12px] text-[#111111] text-center">Quantity</div>
                    <div className="font-['Montserrat'] font-medium text-[12px] text-[#111111] text-center">Price</div>
                    <div className="font-['Montserrat'] font-medium text-[12px] text-[#111111] text-center">Sale Price</div>
                    <div className="font-['Montserrat'] font-medium text-[12px] text-[#111111] text-center">Alt Price</div>
                    <div className="font-['Montserrat'] font-medium text-[12px] text-[#111111] text-center">SKU</div>
                    <div className="font-['Montserrat'] font-medium text-[12px] text-[#111111] text-center">Barcode</div>
                    <div></div>
                  </div>

                  {/* Size Rows */}
                  {modalState.editFormData.sizes.map((sizeData, index) => (
                    <div key={index} className="grid grid-cols-8 gap-2 items-center mb-2 p-2 bg-gray-50 rounded-lg">
                      <select
                        value={sizeData.size}
                        onChange={(e) => actionHandlers.handleSizeFieldChange(index, 'size', e.target.value)}
                        className="h-8 px-2 border border-[#979797] rounded-[12px] text-[12px] font-['Montserrat'] font-medium text-black bg-white"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="xl">XL</option>
                        <option value="xxl">XXL</option>
                      </select>

                      <input
                        type="number"
                        value={sizeData.quantity}
                        onChange={(e) => actionHandlers.handleSizeFieldChange(index, 'quantity', e.target.value)}
                        className="h-8 px-2 border border-[#979797] rounded-[12px] text-[12px] font-['Montserrat'] font-medium text-black bg-white"
                        placeholder="0"
                      />

                      <input
                        type="number"
                        value={sizeData.price}
                        onChange={(e) => actionHandlers.handleSizeFieldChange(index, 'price', e.target.value)}
                        className="h-8 px-2 border border-[#979797] rounded-[12px] text-[12px] font-['Montserrat'] font-medium text-[#111111] bg-white"
                        placeholder="0"
                      />

                      <input
                        type="number"
                        value={sizeData.salePrice}
                        onChange={(e) => actionHandlers.handleSizeFieldChange(index, 'salePrice', e.target.value)}
                        className="h-8 px-2 border border-[#979797] rounded-[12px] text-[12px] font-['Montserrat'] font-medium text-[#111111] bg-white"
                        placeholder="0"
                      />

                      <input
                        type="number"
                        value={sizeData.alternatePrice}
                        onChange={(e) => actionHandlers.handleSizeFieldChange(index, 'alternatePrice', e.target.value)}
                        className="h-8 px-2 border border-[#979797] rounded-[12px] text-[12px] font-['Montserrat'] font-medium text-[#111111] bg-white"
                        placeholder="0"
                      />

                      <input
                        type="text"
                        value={sizeData.sku}
                        onChange={(e) => actionHandlers.handleSizeFieldChange(index, 'sku', e.target.value)}
                        className="h-8 px-2 border border-[#979797] rounded-[12px] text-[12px] font-['Montserrat'] font-medium text-[#111111] bg-white"
                        placeholder="SKU"
                      />

                      <input
                        type="text"
                        value={sizeData.barcode}
                        onChange={(e) => actionHandlers.handleSizeFieldChange(index, 'barcode', e.target.value)}
                        className="h-8 px-2 border border-[#979797] rounded-[12px] text-[12px] font-['Montserrat'] font-medium text-[#111111] bg-white"
                        placeholder="Barcode"
                      />

                      <div className="text-[12px] font-['Montserrat'] font-medium text-gray-600">
                        {sizeData.size.charAt(0).toUpperCase() + sizeData.size.slice(1)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Meta Data Section */}
                <div className="mb-8">
                  <h4 className="font-['Montserrat'] font-bold text-[18px] text-[#111111] mb-4">
                    SEO & Meta Data
                  </h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block font-['Montserrat'] font-medium text-[15px] text-[#111111] mb-2">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={modalState.editFormData.metaTitle}
                        onChange={(e) => actionHandlers.handleFormFieldChange('metaTitle', e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Meta title"
                      />
                    </div>

                    <div>
                      <label className="block font-['Montserrat'] font-medium text-[15px] text-[#111111] mb-2">
                        Meta Description
                      </label>
                      <input
                        type="text"
                        value={modalState.editFormData.metaDescription}
                        onChange={(e) => actionHandlers.handleFormFieldChange('metaDescription', e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Meta description"
                      />
                    </div>

                    <div>
                      <label className="block font-['Montserrat'] font-medium text-[15px] text-[#111111] mb-2">
                        Slug URL
                      </label>
                      <input
                        type="text"
                        value={modalState.editFormData.slugUrl}
                        onChange={(e) => actionHandlers.handleFormFieldChange('slugUrl', e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-bold text-[#000aff] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Slug URL"
                      />
                    </div>
                  </div>
                </div>

                {/* Platform Settings Section */}
                <div className="mb-8">
                  <h4 className="font-['Montserrat'] font-bold text-[18px] text-[#111111] mb-4">
                    Platform Settings
                  </h4>
                  
                  <div className="flex gap-6 mb-4">
                    {['myntra', 'amazon', 'flipkart', 'nykaa'].map((platform) => (
                      <div key={platform} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`platform-${platform}`}
                          checked={modalState.editFormData.platforms[platform]}
                          onChange={(e) => actionHandlers.handlePlatformChange(platform, e.target.checked)}
                          className="w-4 h-4 border border-[#bcbcbc] rounded-[3px] text-[#111111] focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor={`platform-${platform}`} className="font-['Montserrat'] font-normal text-[12px] text-black capitalize cursor-pointer">
                          {platform}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Settings Section */}
                <div className="mb-8">
                  <h4 className="font-['Montserrat'] font-bold text-[18px] text-[#111111] mb-4">
                    Action Settings
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="moveToSale"
                        checked={modalState.editFormData.actions.moveToSale}
                        onChange={(e) => actionHandlers.handleActionChange('moveToSale', e.target.checked)}
                        className="w-5 h-5 border border-[#bcbcbc] rounded-[3px] text-[#111111] focus:ring-2 focus:ring-blue-500"
                      />
                      <label htmlFor="moveToSale" className="font-['Montserrat'] font-normal text-[15px] text-black leading-[22px] cursor-pointer">
                        Move to sale
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="keepCopyAndMove"
                        checked={modalState.editFormData.actions.keepCopyAndMove}
                        onChange={(e) => actionHandlers.handleActionChange('keepCopyAndMove', e.target.checked)}
                        className="w-5 h-5 border border-[#bcbcbc] rounded-[3px] text-[#111111] focus:ring-2 focus:ring-blue-500"
                      />
                      <label htmlFor="keepCopyAndMove" className="font-['Montserrat'] font-normal text-[15px] text-black leading-[22px] cursor-pointer">
                        Keep a copy and move
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="moveToEyx"
                        checked={modalState.editFormData.actions.moveToEyx}
                        onChange={(e) => actionHandlers.handleActionChange('moveToEyx', e.target.checked)}
                        className="w-5 h-5 border border-[#bcbcbc] rounded-[3px] text-[#111111] focus:ring-2 focus:ring-blue-500"
                      />
                      <label htmlFor="moveToEyx" className="font-['Montserrat'] font-normal text-[15px] text-black leading-[16.9px] cursor-pointer">
                        Move to EYX
                      </label>
                    </div>
                  </div>
                </div>

                {/* Product Variants Section */}
                {modalState.editingItem?.variants && modalState.editingItem.variants.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-['Montserrat'] font-bold text-[18px] text-[#111111] mb-4">
                      Product Variants
                    </h4>
                    
                    {modalState.editingItem.variants.map((variant, variantIndex) => (
                      <div key={variantIndex} className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                        <h5 className="font-['Montserrat'] font-semibold text-[16px] text-[#111111] mb-4">
                          Variant {variantIndex + 1} {variant.name ? `- ${variant.name}` : ''}
                        </h5>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {/* Variant Name */}
                          <div>
                            <label className="block font-['Montserrat'] font-medium text-[14px] text-[#111111] mb-2">
                              Variant Name
                            </label>
                            <input
                              type="text"
                              value={variant.name || ''}
                              onChange={(e) => actionHandlers.handleVariantFieldChange(variantIndex, 'name', e.target.value)}
                              className="w-full h-10 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter variant name"
                            />
                          </div>

                          {/* Variant SKU */}
                          <div>
                            <label className="block font-['Montserrat'] font-medium text-[14px] text-[#111111] mb-2">
                              Variant SKU
                            </label>
                            <input
                              type="text"
                              value={variant.sku || ''}
                              onChange={(e) => actionHandlers.handleVariantFieldChange(variantIndex, 'sku', e.target.value)}
                              className="w-full h-10 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter variant SKU"
                            />
                          </div>

                          {/* Variant Price */}
                          <div>
                            <label className="block font-['Montserrat'] font-medium text-[14px] text-[#111111] mb-2">
                              Variant Price
                            </label>
                            <input
                              type="number"
                              value={variant.price || ''}
                              onChange={(e) => actionHandlers.handleVariantFieldChange(variantIndex, 'price', e.target.value)}
                              className="w-full h-10 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                            />
                          </div>

                          {/* Variant Stock */}
                          <div>
                            <label className="block font-['Montserrat'] font-medium text-[14px] text-[#111111] mb-2">
                              Stock Quantity
                            </label>
                            <input
                              type="number"
                              value={variant.stock || variant.quantity || ''}
                              onChange={(e) => actionHandlers.handleVariantFieldChange(variantIndex, 'stock', e.target.value)}
                              className="w-full h-10 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        {/* Variant Meta Fields */}
                        <div className="grid grid-cols-1 gap-4 mt-4">
                          <div>
                            <label className="block font-['Montserrat'] font-medium text-[14px] text-[#111111] mb-2">
                              Variant Description
                            </label>
                            <textarea
                              value={variant.description || ''}
                              onChange={(e) => actionHandlers.handleVariantFieldChange(variantIndex, 'description', e.target.value)}
                              className="w-full h-16 px-3 py-2 border border-[#979797] rounded-[12px] text-[14px] font-['Montserrat'] font-medium text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                              placeholder="Enter variant description"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fixed Action Buttons at Bottom */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
                <button
                  onClick={actionHandlers.handleSaveEdit}
                  className="bg-black hover:bg-gray-800 rounded-[100px] w-[284px] transition-colors"
                >
                  <div className="flex items-center justify-center px-[51px] py-4">
                    <span className="font-['Montserrat'] font-medium text-[16px] text-white leading-[1.2]">
                      save
                    </span>
                  </div>
                </button>
                <button
                  onClick={actionHandlers.handleCloseEdit}
                  className="bg-white hover:bg-gray-50 border border-[#e4e4e4] rounded-[100px] w-[284px] transition-colors"
                >
                  <div className="flex items-center justify-center px-[51px] py-4">
                    <span className="font-['Montserrat'] font-medium text-[16px] text-black leading-[1.2]">
                      go back
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {modalState.isSuccessModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 relative">
              {/* Close Button */}
              <button
                onClick={actionHandlers.handleCloseSuccess}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Content */}
              <div className="p-8 text-center">
                {/* Success Message */}
                <h2 className="text-lg font-bold text-black mb-8 leading-tight font-['Montserrat']">
                  Item Details updated successfully!
                </h2>

                {/* Done Button */}
                <button
                  onClick={actionHandlers.handleCloseSuccess}
                  className="bg-black hover:bg-gray-800 text-white font-['Montserrat'] font-semibold py-3 px-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 min-w-[120px]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Meta Data Modal */}
        {modalState.isMetaDataModalOpen && modalState.selectedItemForMeta && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] max-w-[869px] w-full mx-4 relative">
              {/* Close Button */}
              <button
                onClick={metaDataHandlers.handleCloseMetaData}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Content */}
              <div className="p-8 relative">
                {/* Header */}
                <div className="text-center mb-6">
                  <p className="font-['Montserrat'] font-medium text-[#bfbfbf] text-[14px] leading-[1.2]">
                    Meta Data
                  </p>
                </div>

                {/* Divider Line */}
                <div className="w-full h-px bg-gray-300 mb-6"></div>

                {/* Meta Title */}
                <div className="mb-8">
                  <label className="block font-['Montserrat'] font-bold text-[#111111] text-[20px] leading-[24px] mb-4">
                    meta title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={modalState.metaFormData.metaTitle}
                      onChange={(e) =>
                        metaDataHandlers.handleMetaInputChange(
                          "metaTitle",
                          e.target.value
                        )
                      }
                      className="w-full h-[41px] px-4 py-2 border-2 border-black rounded-xl font-['Montserrat'] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter meta title"
                    />
                  </div>
                </div>

                {/* Meta Description */}
                <div className="mb-8">
                  <label className="block font-['Montserrat'] font-bold text-[#111111] text-[20px] leading-[24px] mb-4">
                    meta description
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={modalState.metaFormData.metaDescription}
                      onChange={(e) =>
                        metaDataHandlers.handleMetaInputChange(
                          "metaDescription",
                          e.target.value
                        )
                      }
                      className="w-full h-[41px] px-4 py-2 border-2 border-black rounded-xl font-['Montserrat'] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter meta description"
                    />
                  </div>
                </div>

                {/* Slug URL */}
                <div className="mb-8">
                  <label className="block font-['Montserrat'] font-bold text-[#111111] text-[20px] leading-[24px] mb-4">
                    slug URL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={modalState.metaFormData.slugUrl}
                      onChange={(e) =>
                        metaDataHandlers.handleMetaInputChange(
                          "slugUrl",
                          e.target.value
                        )
                      }
                      className="w-full h-[41px] px-4 py-2 border-2 border-black rounded-xl font-['Montserrat'] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter slug URL"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center mt-8">
                  <button
                    onClick={metaDataHandlers.handleSaveMetaData}
                    className="bg-black hover:bg-gray-800 text-white font-['Montserrat'] font-medium py-4 px-[51px] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-[284px] text-[16px] leading-[1.2]"
                  >
                    save
                  </button>
                  <button
                    onClick={metaDataHandlers.handleCloseMetaData}
                    className="bg-white hover:bg-gray-50 text-black font-['Montserrat'] font-medium py-4 px-[51px] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 w-[284px] text-[16px] leading-[1.2] border border-[#e4e4e4]"
                  >
                    go back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {modalState.isDeleteConfirmModalOpen && modalState.itemToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] max-w-sm w-full mx-4 relative">
              {/* Modal Content */}
              <div className="p-8 text-center relative">
                {/* Confirmation Message */}
                <h2 className="text-[18px] font-bold text-black mb-4 leading-[22px] font-['Montserrat'] tracking-[-0.41px] px-4">
                  Are you sure you want to delete this item?
                </h2>
                {modalState.itemToDelete && (
                  <p className="text-[14px] text-gray-600 mb-8 font-['Montserrat'] px-4">
                    <strong>{modalState.itemToDelete.productName || modalState.itemToDelete.title}</strong>
                    <br />
                    <span className="text-sm">This action cannot be undone.</span>
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={deleteHandlers.handleConfirmDelete}
                    className="bg-red-600 hover:bg-red-700 text-white font-['Montserrat'] font-semibold py-3 px-8 rounded-3xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 w-[149px] h-12 text-[16px] leading-[1.406]"
                  >
                    Delete
                  </button>
                  <button
                    onClick={deleteHandlers.handleCancelDelete}
                    className="bg-white hover:bg-gray-50 text-black font-['Montserrat'] font-medium py-3 px-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 w-[209px] text-[16px] leading-[1.2] border border-[#e4e4e4]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Item Modal */}
        {modalState.isScheduleModalOpen && modalState.itemToSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] max-w-md w-full mx-4 relative">
              {/* Modal Content */}
              <div className="p-8 relative">
                {/* Header */}
                <h2 className="text-[24px] font-bold text-black mb-8 leading-[29px] font-['Montserrat'] text-center">
                  Schedule Item for Later
                </h2>

                {/* Form Fields */}
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-['Montserrat']">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={modalState.scheduleDate}
                      min={new Date().toISOString().split('T')[0]} // Prevent past dates
                      onChange={(e) =>
                        modalState.setScheduleDate(e.target.value)
                      }
                      className="w-full h-[50px] px-4 py-3 border border-gray-300 rounded-lg font-['Montserrat'] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-['Montserrat']">
                      Select Time
                    </label>
                    <input
                      type="time"
                      value={modalState.scheduleTime}
                      onChange={(e) =>
                        modalState.setScheduleTime(e.target.value)
                      }
                      className="w-full h-[50px] px-4 py-3 border border-gray-300 rounded-lg font-['Montserrat'] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                  {modalState.scheduleDate && modalState.scheduleTime && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800 font-['Montserrat']">
                        <strong>Publish Date & Time:</strong><br />
                        {new Date(`${modalState.scheduleDate}T${modalState.scheduleTime}`).toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={lifecycleHandlers.handleConfirmSchedule}
                    disabled={
                      !modalState.scheduleDate || !modalState.scheduleTime ||
                      new Date(`${modalState.scheduleDate}T${modalState.scheduleTime}`) <= new Date()
                    }
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-['Montserrat'] font-medium py-4 px-8 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-[16px] leading-[1.2] min-w-[140px]"
                  >
                    {!modalState.scheduleDate || !modalState.scheduleTime 
                      ? 'Select Date & Time' 
                      : new Date(`${modalState.scheduleDate}T${modalState.scheduleTime}`) <= new Date()
                      ? 'Past Time Selected'
                      : 'Schedule Now'
                    }
                  </button>
                  <button
                    onClick={lifecycleHandlers.handleCancelSchedule}
                    className="bg-white hover:bg-gray-50 text-black font-['Montserrat'] font-medium py-4 px-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 text-[16px] leading-[1.2] border border-[#e4e4e4] min-w-[140px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Schedule Confirmation Modal */}
        {modalState.isCancelScheduleConfirmModalOpen && modalState.itemToCancelSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] max-w-md w-full mx-4 relative">
              {/* Modal Content */}
              <div className="p-8 relative">
                {/* Header */}
                <h2 className="text-[24px] font-bold text-black mb-6 leading-[29px] font-['Montserrat'] text-center">
                  Cancel Schedule
                </h2>

                {/* Content */}
                <div className="text-center mb-8">
                  <p className="text-[16px] text-gray-600 font-['Montserrat'] leading-[24px]">
                    Are you sure you want to cancel the scheduled publication for{' '}
                    <strong className="text-black">
                      "{modalState.itemToCancelSchedule.productName || modalState.itemToCancelSchedule.title}"
                    </strong>?
                  </p>
                  <p className="text-[14px] text-gray-500 font-['Montserrat'] leading-[20px] mt-4">
                    This item will be moved back to draft status.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={lifecycleHandlers.handleConfirmCancelSchedule}
                    className="bg-red-600 hover:bg-red-700 text-white font-['Montserrat'] font-medium py-4 px-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-[16px] leading-[1.2] min-w-[140px]"
                  >
                    Yes, Cancel Schedule
                  </button>
                  <button
                    onClick={lifecycleHandlers.handleCancelCancelSchedule}
                    className="bg-white hover:bg-gray-50 text-black font-['Montserrat'] font-medium py-4 px-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 text-[16px] leading-[1.2] border border-[#e4e4e4] min-w-[140px]"
                  >
                    Keep Scheduled
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Schedule Success Modal */}
        {modalState.isCancelScheduleSuccessModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] max-w-md w-full mx-4 relative">
              {/* Modal Content */}
              <div className="p-8 relative text-center">
                {/* Success Icon */}
                <div className="mx-auto mb-6 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>

                {/* Header */}
                <h2 className="text-[24px] font-bold text-black mb-4 leading-[29px] font-['Montserrat']">
                  Schedule Cancelled
                </h2>

                {/* Content */}
                <p className="text-[16px] text-gray-600 font-['Montserrat'] leading-[24px] mb-8">
                  The scheduled publication has been cancelled and the item has been moved back to draft status.
                </p>

                {/* Action Button */}
                <button
                  onClick={() => modalState.setIsCancelScheduleSuccessModalOpen(false)}
                  className="bg-black hover:bg-gray-800 text-white font-['Montserrat'] font-medium py-4 px-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-[16px] leading-[1.2] min-w-[140px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
});

ManageItems.displayName = "ManageItems";

export default ManageItems;
