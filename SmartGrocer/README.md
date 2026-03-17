# SmartGrocer

SmartGrocer is a React Native application built with Expo, designed to help users manage grocery inventory, sales, and invoices efficiently. The app features a user-friendly interface with multiple screens for authentication, inventory management, and user settings.

## Features

- **Splash Screen**: A welcoming splash screen that appears while the app is loading.
- **Login Screen**: Allows users to log in with their credentials.
- **Registration Screen**: New users can create an account to access the app.
- **Dashboard/Home Screen**: The main hub for navigation to other features like adding stock and viewing sales.
- **Add Stock Screen**: Users can add new products to the inventory with specified quantities.
- **Sales Entry Screen**: Users can record sales and update inventory accordingly.
- **Product List/Stock View Screen**: Displays a list of available products and their quantities.
- **Invoice Screen**: Summarizes sold items and calculates total prices for invoices.
- **Profile/Settings Screen**: Allows users to view and edit their profile settings, including logout options.

## Installation

To get started with SmartGrocer, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/SmartGrocer.git
   cd SmartGrocer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the app**:
   ```bash
   npm start
   ```

4. **Open the app**:
   Use the Expo Go app on your mobile device or an emulator to scan the QR code displayed in the terminal.

## Folder Structure

```
SmartGrocer
├── App.tsx
├── app.json
├── babel.config.js
├── package.json
├── tsconfig.json
├── README.md
├── assets
│   └── fonts
├── src
│   ├── navigation
│   │   ├── index.tsx
│   │   ├── AuthStack.tsx
│   │   └── AppStack.tsx
│   ├── screens
│   │   ├── SplashScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── AddStockScreen.tsx
│   │   ├── SalesEntryScreen.tsx
│   │   ├── ProductListScreen.tsx
│   │   ├── InvoiceScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── components
│   │   ├── Header.tsx
│   │   ├── ProductCard.tsx
│   │   └── InvoiceItem.tsx
│   ├── context
│   │   ├── AuthContext.tsx
│   │   └── InventoryContext.tsx
│   ├── hooks
│   │   └── useAuth.ts
│   ├── data
│   │   └── products.ts
│   ├── utils
│   │   └── helpers.ts
│   └── types
│       └── index.ts
```

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.