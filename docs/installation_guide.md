# Speech Therapy Companion Application
# Installation and Setup Guide

## Table of Contents
1. System Requirements
2. Installation Options
3. Web Application Setup
4. iPad/Tablet Setup
5. OpenAI API Configuration
6. First-Time Configuration
7. Data Management
8. Updating the Application
9. Troubleshooting

## 1. System Requirements

### Minimum Requirements
- **Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **Internet Connection**: Broadband connection (minimum 5 Mbps)
- **Device**: iPad (6th generation or newer), Android tablet (8" screen or larger), or computer
- **Processor**: Dual-core 1.8 GHz or better
- **Memory**: 4 GB RAM or more
- **Storage**: 500 MB available space
- **Microphone**: Built-in or external microphone for speech recording features

### Recommended Specifications
- **Web Browser**: Latest version of Chrome or Safari
- **Internet Connection**: High-speed connection (10+ Mbps)
- **Device**: iPad Pro or recent tablet with touch screen
- **Processor**: Quad-core 2.0 GHz or better
- **Memory**: 8 GB RAM or more
- **Storage**: 1 GB available space
- **Microphone**: High-quality external microphone for better speech recording

## 2. Installation Options

The Speech Therapy Companion Application is a web application that can be accessed in multiple ways:

### Option 1: Direct Web Access
- No installation required
- Access via web browser at the application URL
- Requires internet connection at all times

### Option 2: Progressive Web App (PWA)
- Install as an app on your device
- Limited offline functionality
- Automatic updates
- Better performance than browser-only access

### Option 3: Local Development Setup
- For technical users or organizations with IT support
- Clone the repository and run locally
- Requires Node.js and development tools
- Full customization capabilities

## 3. Web Application Setup

### Direct Web Access

1. Open your web browser
2. Navigate to: https://speech-therapy-companion.app
3. Bookmark the page for easy access
4. Log in with your credentials or create a new account
5. Accept permissions for microphone access when prompted

### Progressive Web App Installation

#### On Chrome (Computer):
1. Navigate to https://speech-therapy-companion.app
2. Look for the install icon (➕) in the address bar
3. Click "Install" in the prompt
4. The app will install and create a desktop shortcut

#### On Safari (Mac):
1. Navigate to https://speech-therapy-companion.app
2. Click "Share" in the toolbar
3. Select "Add to Dock"
4. The app will be available from your dock

## 4. iPad/Tablet Setup

### iPad Setup (Recommended)

1. Open Safari on your iPad
2. Navigate to https://speech-therapy-companion.app
3. Tap the Share button (square with arrow)
4. Select "Add to Home Screen"
5. Name the application "Speech Therapy Companion"
6. Tap "Add"
7. The app icon will appear on your home screen
8. Tap the icon to launch the application
9. Allow microphone access when prompted
10. Enable "Allow Cross-Website Tracking" in Safari settings for best experience

### Android Tablet Setup

1. Open Chrome on your Android tablet
2. Navigate to https://speech-therapy-companion.app
3. Tap the menu button (three dots)
4. Select "Add to Home screen"
5. Name the application "Speech Therapy Companion"
6. Tap "Add"
7. The app icon will appear on your home screen
8. Tap the icon to launch the application
9. Allow microphone access when prompted

### Optimizing for Touch Experience

1. In the application settings, enable "Touch Optimization"
2. Adjust button sizes if needed in the Accessibility settings
3. For iPad, enable "Guided Access" in iOS settings for distraction-free therapy sessions:
   - Go to Settings > Accessibility > Guided Access
   - Turn on Guided Access
   - Open the Speech Therapy Companion app
   - Triple-click the side button to start Guided Access
   - Circle areas you want to disable (if any)
   - Tap Start

## 5. OpenAI API Configuration

The Speech Therapy Companion Application uses OpenAI's API for content generation. You'll need to set up an API key to use these features.

### Obtaining an OpenAI API Key

1. Visit https://platform.openai.com/signup
2. Create an account or sign in
3. Navigate to the API section
4. Create a new API key
5. Copy the API key (it starts with "sk-")

### Configuring the API Key in the Application

1. Open the Speech Therapy Companion Application
2. Go to Settings > OpenAI Configuration
3. Enter your API key in the provided field
4. Click "Save API Key"
5. The key will be stored securely on your device
6. Test the connection by clicking "Test API Connection"

### API Usage and Costs

- The application is configured to use minimal tokens per request
- Typical usage is approximately 10-20 requests per therapy session
- With default settings, this should cost less than $1 per session
- You can set usage limits in the OpenAI dashboard to control costs
- The application includes a usage tracker in Settings > OpenAI Configuration > Usage Stats

## 6. First-Time Configuration

When you first launch the Speech Therapy Companion Application, you'll need to complete the initial setup:

### Patient Profile Setup

1. Click "Create New Patient Profile"
2. Enter patient information:
   - Name
   - Age
   - Special interests (default: dragons/dinosaurs)
   - Color preferences (default: pink, purple, white)
   - Speech targets
   - Behavioral considerations
3. Click "Save Profile"

### Theme Configuration

1. Go to Settings > Theme Configuration
2. Select primary theme:
   - Dragon Theme (default)
   - Dinosaur Theme
3. Customize color scheme:
   - Primary Color (default: pink)
   - Secondary Color (default: purple)
   - Accent Color (default: white)
4. Adjust visual complexity (1-10 scale)
5. Set animation level (None, Low, Medium, High)
6. Click "Apply Theme"

### Session Configuration

1. Go to Settings > Session Configuration
2. Set default session length (default: 45 minutes)
3. Configure activity durations
4. Set break frequency and duration
5. Configure token economy settings
6. Click "Save Configuration"

## 7. Data Management

### Local Storage

By default, the application stores data locally on your device:
- Patient profiles
- Session configurations
- OpenAI API key
- Session history and progress data

### Data Backup

To back up your data:
1. Go to Settings > Data Management
2. Click "Export Data"
3. Choose a location to save the backup file
4. The file will be saved in JSON format

### Data Restore

To restore from a backup:
1. Go to Settings > Data Management
2. Click "Import Data"
3. Select your backup file
4. Confirm the data import
5. The application will restart with the restored data

### Data Privacy

- All patient data is stored locally on your device
- No patient information is transmitted to our servers
- OpenAI API calls are made directly from your device to OpenAI
- The application complies with HIPAA guidelines for patient privacy

## 8. Updating the Application

### Web Application Updates

The web application updates automatically when you access it. No action is required.

### Progressive Web App Updates

1. The PWA will check for updates automatically
2. When updates are available, you'll see an "Update Available" notification
3. Click "Update Now" to apply the update
4. The application will refresh with the new version

### Manual Update Check

1. Go to Settings > About
2. Click "Check for Updates"
3. If updates are available, follow the prompts to update

## 9. Troubleshooting

### Connection Issues

**Issue**: Cannot access the application
- **Solution**: Check your internet connection
- **Solution**: Try a different browser
- **Solution**: Clear browser cache and cookies

**Issue**: Application loads but features don't work
- **Solution**: Ensure JavaScript is enabled in your browser
- **Solution**: Check for browser extensions that might be blocking functionality
- **Solution**: Try using Chrome or Safari, which are fully supported

### Microphone Issues

**Issue**: Microphone not working
- **Solution**: Check browser permissions for microphone access
- **Solution**: Ensure the correct microphone is selected in your device settings
- **Solution**: Close other applications that might be using the microphone
- **Solution**: Restart your browser or device

### OpenAI Integration Issues

**Issue**: Content generation not working
- **Solution**: Verify your API key is entered correctly
- **Solution**: Check your OpenAI account has available credits
- **Solution**: Ensure you have an internet connection
- **Solution**: Try a simpler prompt

### Performance Issues

**Issue**: Application running slowly
- **Solution**: Close other applications and browser tabs
- **Solution**: Clear browser cache
- **Solution**: Reduce animation level in settings
- **Solution**: Use the PWA version instead of browser version

### Getting Help

If you encounter issues not covered here:
1. Check the Help Center in the application (? icon)
2. Visit our support website: https://help.speechtherapycompanion.app
3. Contact support: support@speechtherapycompanion.app

---

© 2025 Speech Therapy Companion Application
Version 1.0
