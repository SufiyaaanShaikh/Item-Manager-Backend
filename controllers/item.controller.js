import asyncWrapper from "../middleware/asyncWrapper.middleware.js";
import { ApiRes } from "../utils/ApiRes.js";
import { Item } from "../models/item.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadonCloudinary, deleteFromCloudinary } from "../cdn/cloudinary.js";

export const createItem = asyncWrapper(async (req, res, next) => {
  const { name, description, price, type } = req.body;
  if (!name || !description || !price || !type) {
    return next(new ApiError(400, "All fields are required", null, false));
  }

  const itemData = {
    name,
    description,
    price: parseFloat(price),
    type,
    imageUrls: [],
    imageUrlsID: [],
  };

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadResult = await uploadonCloudinary(file.buffer, file.mimetype);
      if (!uploadResult || !uploadResult.secure_url) {
        return next(new ApiError(500, "Image upload failed"));
      }
      itemData.imageUrls.push(uploadResult.secure_url);
      itemData.imageUrlsID.push(uploadResult.public_id);
    }
  }

  const newItem = await Item.create(itemData);
  if (!newItem) {
    return next(new ApiError(500, null, false, "Failed to create item"));
  }

  return res
    .status(201)
    .json(new ApiRes(201, newItem, true, "Item created successfully"));
});

export const getAllItems = asyncWrapper(async (req, res) => {
  const items = await Item.find();
  res
    .status(200)
    .json(new ApiRes(200, items, true, "Items fetched successfully"));
});

export const getItemById = asyncWrapper(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return next(new ApiError(404, null, false, "Item not found"));
  }
  res
    .status(200)
    .json(new ApiRes(200, item, true, "Item fetched successfully"));
});

export const deleteItem = asyncWrapper(async (req, res, next) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) {
    return next(new ApiError(404, null, false, "Item not found"));
  }
  // Delete images from Cloudinary
  for (const imageId of item.imageUrlsID) {
    await deleteFromCloudinary(imageId);
  }
  res
    .status(200)
    .json(new ApiRes(200, null, true, "Item deleted successfully"));
});

// delete all items and with add delete images from cloudinary
export const deleteAllItems = asyncWrapper(async (req, res, next) => {
  const items = await Item.find();
  for (const item of items) {
    // Delete images from Cloudinary
    for (const imageId of item.imageUrlsID) {
      await deleteFromCloudinary(imageId);
    }
  }
  await Item.deleteMany();
  res
    .status(200)
    .json(new ApiRes(200, null, true, "All items deleted successfully"));
});
