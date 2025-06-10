import mongoose from 'mongoose';

// Define the Property schema
const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please add a property type'],
    enum: ['house', 'store']
  },
  transaction: {
    type: String,
    required: [true, 'Please add a transaction type'],
    enum: ['buy', 'rent']
  },
  price: {
    type: String,
    required: [true, 'Please add a price']
  },
  area: {
    type: String,
    required: [true, 'Please add an area']
  },
  bedrooms: {
    type: Number,
    default: 0
  },
  bathrooms: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  images: {
    type: [String],
    required: [true, 'Please add at least one image']
  },
  features: {
    type: [String],
    default: []
  },
  agent: {
    name: {
      type: String,
      required: [true, 'Please add an agent name']
    },
    phone: {
      type: String,
      required: [true, 'Please add an agent phone']
    },
    email: {
      type: String,
      required: [true, 'Please add an agent email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    }
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'sold'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  inquiries: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create or use existing model
const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

export default Property;