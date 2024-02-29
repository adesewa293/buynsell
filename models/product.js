import { model, Schema, models } from "mongoose"
// import { number, string } from "prop-types"

const ProductSchema = new Schema({
title: {type: String, required: true},
description: String,
price: {type: Number, required: true},
});
export const Product = models.Product || model('Product', ProductSchema);