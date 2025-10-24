# Modern Login Page

A beautiful, modern login/signup component built with React, TypeScript, and Tailwind CSS. Based on the [AsmrProg Modern-Login design](https://github.com/AsmrProg-YT/Modern-Login.git), featuring animated sliding panels, form validation, and a complete authentication flow.

## Features

- ✨ **Modern UI Design** - Beautiful gradient backgrounds and smooth animations
- 🔄 **Animated Transitions** - Smooth sliding panel animation between Sign In and Sign Up
- ✅ **Form Validation** - Real-time validation with error messages
- 🔐 **Authentication Flow** - Complete login/signup functionality with mock authentication
- 📱 **Responsive Design** - Works perfectly on all device sizes
- 🎨 **Tailwind CSS** - Utility-first CSS framework for rapid styling
- ⚡ **TypeScript** - Full type safety and better development experience
- 🚀 **Vite** - Fast build tool and development server

## Demo Credentials

For testing purposes, use these credentials:
- **Email**: `demo@example.com`
- **Password**: `password123`

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd modern-login-page
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check for code issues

## Project Structure

```
src/
├── components/
│   └── ModernLogin.tsx    # Main login/signup component
├── pages/
│   └── Dashboard.tsx      # Dashboard page after login
├── hooks/
│   └── useAuth.ts         # Authentication hook
├── types/
│   └── auth.ts           # TypeScript type definitions
├── utils/
│   └── validation.ts     # Form validation utilities
├── App.tsx               # Main app component with routing
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

## Features Breakdown

### Authentication
- Mock authentication service with realistic delays
- Form validation for email, password, and name fields
- Error handling and user feedback
- Loading states during authentication
- Token storage in localStorage

### UI/UX
- Smooth sliding panel animation between forms
- Real-time form validation with error messages
- Password visibility toggle
- Social authentication buttons (UI only)
- Responsive design for all screen sizes
- Beautiful gradient backgrounds and modern styling

### Technical
- TypeScript for type safety
- React hooks for state management
- React Router for navigation
- Tailwind CSS for styling
- ESLint for code quality
- Vite for fast development and building

## Customization

### Styling
The component uses Tailwind CSS classes. You can easily customize:
- Colors by modifying the gradient backgrounds
- Animations by adjusting the transition durations
- Layout by changing the grid and flex properties

### Authentication
To integrate with a real authentication service:
1. Replace the mock service in `src/hooks/useAuth.ts`
2. Update the API endpoints and response handling
3. Add proper error handling for network requests

### Form Validation
Validation rules can be modified in `src/utils/validation.ts`:
- Email format validation
- Password strength requirements
- Name length requirements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the linter: `npm run lint`
5. Test your changes
6. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Next Steps

Here are some suggested improvements you could implement:

1. **Real Authentication Integration**
   - Connect to a real authentication service (Firebase, Auth0, etc.)
   - Add JWT token refresh functionality
   - Implement proper session management

2. **Enhanced Security**
   - Add password strength indicator
   - Implement rate limiting for login attempts
   - Add two-factor authentication

3. **Additional Features**
   - Email verification flow
   - Password reset functionality
   - Remember me checkbox
   - Social authentication integration

4. **Testing**
   - Add unit tests with Jest and React Testing Library
   - Add integration tests for the authentication flow
   - Add E2E tests with Cypress or Playwright

5. **Performance**
   - Add code splitting for better performance
   - Implement lazy loading for components
   - Add service worker for offline functionality
