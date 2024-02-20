import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  slack_id: {
    type: String,
    required: true,
  }
});

const Settings = mongoose.model('Settings', SettingsSchema);

export default Settings;