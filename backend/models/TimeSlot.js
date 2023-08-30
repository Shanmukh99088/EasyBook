const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  year: Number,
  month: Number,
  day: Number,
  startTime: String,
  endTime: String,
  isBooked: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);