# SmartGrocer Installation Instructions

## Required Package
Before running the app, you need to install the React Navigation Stack package.

Run one of these commands in your terminal:

```bash
# Using npm
npm install @react-navigation/stack

# OR using Expo
npx expo install @react-navigation/stack
```

## Running the App
After installing the package, start your app:

```bash
npm start
# or
npx expo start
```

Then press 'a' to run on Android emulator.

## App Navigation Flow
1. Splash Screen (2 seconds)
2. Login Screen
3. Register Screen (optional)
4. Dashboard (main hub)
5. Add Stock Screen
6. Sales Entry Screen
7. Product List Screen
8. Invoice Screen
9. Profile Screen

## Default Products
The app comes with three default products:
- Tomato: 50 units @ ₹20
- Potato: 100 units @ ₹30
- Onion: 75 units @ ₹25

## Features
- Add new products or update existing stock
- Record sales (decreases stock automatically)
- View all products and their quantities
- Generate invoice showing all sales and total amount
- Simple, clean UI with white background, black text, and light green buttons
