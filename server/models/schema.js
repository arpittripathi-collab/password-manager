// server/models/schema.js
require('dotenv').config();             // ensure env vars are loaded

const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');
const { encrypt, decrypt } = require('./EncDecManager');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,                      // prevent duplicates
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Invalid email format']
  },

  password: {
    type: String,
    required: true,
    minlength: 8
  },

  // store issued JWTs so you can revoke them if needed
  tokens: [
    {
      token: {
        type: String,
        required: true
      },
      issuedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // renamed from 'passwords' to 'vault' for clarity, and storing only encrypted data
  vault: [
    {
      platform: {
        type: String,
        required: true,
        trim: true
      },
      platEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
      },
      encryptedPassword: {
        type: String,
        required: true
      },
      iv: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true                    // adds createdAt & updatedAt to User documents
});

// Hash only the main password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Generate a JWT, save it to tokens[], and return it
userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign(
    { _id: this._id.toString() },
    process.env.SECRET_KEY,
    { expiresIn: '1d' }               // tokens now expire in 1 day
  );

  this.tokens.push({ token });
  await this.save();
  return token;
};

// Add a new credential to the vault (encrypts internally)
userSchema.methods.addNewPassword = async function(plainPassword, platform, platEmail) {
  const { iv, encryptedData } = encrypt(plainPassword);
  this.vault.push({
    platform,
    platEmail,
    encryptedPassword: encryptedData,
    iv
  });
  await this.save();
  return true;
};

// Retrieve and decrypt all vault items
userSchema.methods.getVault = function() {
  return this.vault.map(item => ({
    platform: item.platform,
    platEmail: item.platEmail,
    password: decrypt(item.encryptedPassword, item.iv),
    createdAt: item.createdAt
  }));
};

const User = mongoose.model('User', userSchema);
module.exports = User;
