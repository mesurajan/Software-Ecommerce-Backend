const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    subtitle: { type: String }, // optional short description
    slug: { type: String, unique: true },

    description: { type: String }, // rich text / long description
    additionalInfo: { type: String }, // extra info

    price: { type: Number, required: true },
    oldPrice: { type: Number }, // optional for discount
    discount: { type: Number, default: 0 }, // % discount
    stock: { type: Number, default: 0 },

    // ---- Extra Product Details ----
    brand: { type: String },
    sku: { type: String },
    weight: { type: Number }, // in kg
    length: { type: Number }, // in cm
    width: { type: Number },
    height: { type: Number },
    material: { type: String },
    warranty: { type: String },
    delivery: { type: String },

    // ---- Media ----
    image: { type: String }, // ✅ single main image
    colors: [{ type: String }],
    videoUrl: { type: String },

    // ---- Relations ----
    category: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      ref: "Category",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // ---- Reviews ----
    rating: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate slug from title
productSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    while (await mongoose.models.Product.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }
    this.slug = slug;
  }
  next();
});

// Auto-generate slug on update
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.title) {
    update.slug = slugify(update.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
