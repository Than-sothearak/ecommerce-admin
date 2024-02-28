import { model, Schema, models } from "mongoose";

const OrderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    phone: Number,
    email: String,
    city: String,
    postalCode: String,
    streetAddress: String,
    country: String,
    paid: Boolean,
  },
  {
    timestamps: true,
  }
);

export const Order = models.Order || model("Order", OrderSchema);
