# Who Owes Who?

A React + TypeScript + Firebase expense tracking app to track spending between Madhav and Devika.

## Features

- Track expenses with payer, amount, and description
- View monthly totals and balance calculations
- Clean, dark, minimal UI with Tailwind CSS
- Real-time data with Firebase Firestore

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Firebase:
   - Update `src/config/firebase.ts` with your Firebase project credentials
   - Enable Firestore in your Firebase console

3. Start the development server:
   ```bash
   npm start
   ```

## Firebase Setup

1. Create a new Firebase project
2. Enable Firestore Database
3. Update the Firebase configuration in `src/config/firebase.ts`
4. Set up Firestore security rules as needed

## Usage

- **Home Page**: View totals, balance, and recent expenses
- **Add Expense**: Add new expenses with payer selection and amount
- Balance calculation: Shows who owes whom based on spending difference