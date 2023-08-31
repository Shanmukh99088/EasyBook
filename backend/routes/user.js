const router = require("express").Router();
const User=require('../models/User');
const TimeSlot = require("../models/TimeSlot")
const {isAuthenticated} = require('../middleware/check-auth')
const {isAdmin} = require('../middleware/isAdmin')
const nodemailer= require("nodemailer")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


function generateToken(userId) {
  const token = jwt.sign({ userId },process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shanmukhshannu2001@gmail.com',
    pass: 'ubbbqjwbeqsmlrty'
  },
});


function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).json({ message: 'An account with this email already exists' });
      }

      const otp = generateOTP();

      bcrypt.hash(password, 10)
        .then((hashedPassword) => {
          const newUser = new User({
            name,
            email,
            password: hashedPassword,
            otp,
          });

          newUser
            .save()
            .then(() => {
              const mailOptions = {
                from: 'shanmukhshannu2001@gmail.com',
                to: email,
                subject: 'OTP Verification',
                text: `Your OTP for registration: ${otp}`,
              };

              // Send OTP via email
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                  res.status(500).json({ message: 'Error sending OTP' });
                } else {
                  res.json({ message: 'OTP sent to your Registered email' });
                }
              });
            })
            .catch((error) => {
              console.error(error);
              res.status(500).json({ message: 'Error registering user' });
            });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: 'Error hashing password' });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error checking user existence' });
    });
});




router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  User.findOne({ email, otp, isVerified: false })
    .then((user) => {
      if (user) {
        // Mark user as verified
        user.isVerified = true;

        // Save the updated user
        user.save().then(() => {
          res.status(200).json({ success:true ,message: 'Account verified successfully' });
        });
      } else {
        res.status(400).json({ message: 'Invalid OTP ' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error verifying OTP' });
    });
});



router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      bcrypt.compare(password, user.password)
        .then((result) => {
          if (result) {
            const token = generateToken(user._id);
            res.json({ message: 'Login successful', token });
          } else {
            res.status(401).json({ message: 'Authentication failed' });
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: 'Error comparing passwords' });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error finding user' });
    });
});


router.post('/add-time-slot', isAdmin,(req, res) => {
  const { year, month, day, startTime, endTime } = req.body;

  const newTimeSlot = new TimeSlot({
    year,
    month,
    day,
    startTime,
    endTime,
  });

  newTimeSlot
    .save()
    .then(() => {
      res.json({ message: 'Time slot added successfully' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error adding time slot' });
    });
});

router.get('/available-time-slots/:year/:month/:day', isAuthenticated, (req, res) => {
  const { year, month, day } = req.params;

  TimeSlot.find({ year, month, day, isBooked: false })
    .then((timeSlots) => {
      res.json({ timeSlots });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error fetching available time slots' });
    });
});

router.post('/book-time-slot/:id', isAuthenticated, (req, res) => {
  const timeSlotId = req.params.id;
  const userId = req.user._id;

  TimeSlot.findById(timeSlotId)
    .then((foundTimeSlot) => {
      if (!foundTimeSlot) {
        return res.status(404).json({ message: 'Time slot not found' });
      }

      if (foundTimeSlot.isBooked) {
        return res.status(400).json({ message: 'Time slot is already booked' });
      }

      TimeSlot.findByIdAndUpdate(
        timeSlotId,
        { isBooked: true, userId  },
        { new: true }
      )
        .then((updatedTimeSlot) => {
          res.json({ message: 'Time slot booked successfully', timeSlot: updatedTimeSlot });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: 'Error booking time slot' });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error finding time slot' });
    });
});


router.post('/cancel-booking/:id', isAuthenticated, (req, res) => {
  const timeSlotId = req.params.id;

  TimeSlot.findById(timeSlotId)
    .then((foundTimeSlot) => {
      if (!foundTimeSlot) {
        return res.status(404).json({ message: 'Time slot not found' });
      }

      if (!foundTimeSlot.isBooked) {
        return res.status(400).json({ message: 'Time slot is not booked' });
      }

      TimeSlot.findByIdAndUpdate(
        timeSlotId,
        { isBooked: false, userId: null },
        { new: true }
      )
        .then((updatedTimeSlot) => {
          res.json({ message: 'Booking canceled successfully', timeSlot: updatedTimeSlot });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: 'Error canceling booking' });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error finding time slot' });
    });
});


router.get('/my-booked-time-slots', isAuthenticated, (req, res) => {
  const userId = req.user._id; 

  TimeSlot.find({ userId, isBooked: true })
    .then((bookedTimeSlots) => {
      res.json({ bookedTimeSlots });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error fetching booked time slots' });
    });
});


module.exports = router