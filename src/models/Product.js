const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    slug: { type: String, unique: true }, // auto-generated from title
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 }, // ✅ stock
    category: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      ref: "Category",
    },
    image: { type: String }, // ✅ single image
    colors: [{ type: String }], // can keep array if you want multiple colors
    videoUrl: { type: String }, // ✅ video link
    additionalInfo: { type: String }, // ✅ extra info
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Auto-generate slug before save
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

// Auto-generate slug before update
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.title) {
    update.slug = slugify(update.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
