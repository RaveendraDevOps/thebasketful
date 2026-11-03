# Basketful Mobile MVP

Basketful is a cross-platform fresh-produce and grocery marketplace built with Expo, React Native, TypeScript, and Expo Router. It supports household customers and business buyers with different pack sizes and pricing.

This repository is an MVP. Its catalog, customer details, addresses, and historical orders are sample data. Checkout and payment are simulated: no real order is sent and no payment is collected.

## Features

- Household and wholesale business shopping modes
- Product categories, search, details, availability, and discounts
- Mode-specific units and prices
- Favorites and a persistent shopping basket
- Address, delivery-slot, and mock payment selection
- Order confirmation, history, and tracking timeline
- Local persistence with AsyncStorage
- Responsive iOS, Android, and web interface
- Production web container using Docker and Nginx

## Technology

- Expo SDK 58
- React 19 and React Native 0.88
- Expo Router
- TypeScript
- AsyncStorage
- Vitest
- Nginx for the containerized web build

## Prerequisites

Install:

- Node.js 22.13 or newer
- npm
- Expo Go on a physical device, or an iOS/Android simulator
- Docker Desktop only if running the web container
- An Expo account for EAS builds
- A Google Play Developer account for Play Store distribution

Confirm the local tools:

```bash
node --version
npm --version
```

## Install the project

```bash
cd /Users/raveendra.bandi_codev_blr/basketful
npm install
```

## Run in development

Start Metro:

```bash
npm start
```

The terminal displays a QR code and these shortcuts:

- Press `w` to open the web app.
- Press `i` to open the iOS Simulator on macOS.
- Press `a` to open an Android emulator.
- Press `r` to reload.
- Press `j` to open the debugger.
- Press `Ctrl+C` to stop Metro.

### Run on a physical phone

1. Install a compatible version of Expo Go.
2. Connect the computer and phone to the same Wi-Fi network.
3. Run `npm start`.
4. Open Expo Go and scan the QR code.

If the phone cannot reach Metro because of the local network, try:

```bash
npx expo start --tunnel
```

### Run on the web

```bash
npm run web
```

Then open `http://localhost:8081`.

### Run on iOS

Install Xcode and create an iOS Simulator first. Then:

```bash
npm run ios
```

### Run on Android

Install Android Studio, an Android SDK, Platform Tools, and an emulator. On macOS, add the SDK to `~/.zshrc`:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools"
```

Reload the shell and confirm ADB:

```bash
source ~/.zshrc
adb version
```

Start an emulator from Android Studio, then run:

```bash
npm run android
```

If you see `spawn adb ENOENT`, Android Platform Tools are missing or `ANDROID_HOME`/`PATH` is not configured.

## Demo walkthrough

1. Select Household or Business during onboarding.
2. Browse products from Home or Categories.
3. Search by product, category, or origin.
4. Save products using the heart button.
5. Add products and adjust quantities.
6. Open the basket and review totals and delivery fees.
7. Select an address, delivery slot, and mock payment method.
8. Place the simulated order.
9. Track it from the confirmation screen or Orders tab.
10. Switch pricing mode from Account.

## Available commands

```bash
npm start          # Start Expo/Metro
npm run android    # Open on Android
npm run ios        # Open on iOS
npm run web        # Open in a browser
npm run build:web  # Export a production web build to dist/
npm run typecheck  # Run TypeScript checks
npm run lint       # Run ESLint
npm test           # Run Vitest once
```

## Run the production web app with Docker

Docker packages only the web version. Android and iOS store applications must be built separately with EAS.

Build and start the container:

```bash
docker build -t basketful .
docker run --rm --name basketful -p 8080:80 basketful
```

Open `http://localhost:8080`.

Stop the foreground container with `Ctrl+C`. If it was started in the background, stop it with:

```bash
docker stop basketful
```

Rebuild after changing application code:

```bash
docker build --no-cache -t basketful .
```

## Validate before release

```bash
npm run typecheck
npm run lint
npm test
npx expo-doctor
npm run build:web
```

Expected project status:

- TypeScript passes
- ESLint passes
- Cart and checkout tests pass
- Expo Doctor passes all checks
- Expo creates the static web bundle successfully

## Project structure

```text
basketful/
├── assets/                 App icons and static assets
├── src/
│   ├── app/                Expo Router layouts and screens
│   │   ├── (tabs)/         Home, Categories, Orders, and Account tabs
│   │   ├── category/       Category listing route
│   │   ├── order/          Order detail route
│   │   └── product/        Product detail route
│   ├── components/         Reusable product and UI components
│   ├── data/               Demo catalog, addresses, slots, and orders
│   ├── store/              Persistent application state
│   ├── theme/              Colors, spacing, radius, and shadows
│   ├── types/              Shared TypeScript models
│   └── utils/              Pricing, totals, checkout rules, and tests
├── app.json                Expo application configuration
├── Dockerfile              Multi-stage production web image
├── nginx.conf              Static routing and cache rules
├── package.json            Dependencies and scripts
└── tsconfig.json           TypeScript configuration
```

## Data and state

Demo content is defined in `src/data/catalog.ts`. The application stores onboarding status, shopping mode, basket, favorites, and orders locally using AsyncStorage.

To clear local demo state:

- Mobile: clear the Expo Go/app storage or uninstall the app.
- Web: clear site storage from browser developer tools.

No backend, authentication server, payment gateway, inventory service, analytics service, or notification service is currently connected.

## Build an Android App Bundle

Google Play requires an Android App Bundle (`.aab`) for new applications.

### 1. Android package name

The application is configured with this permanent Android identifier:

```json
{
  "expo": {
    "android": {
      "package": "com.thebasketful.app"
    }
  }
}
```

The package name cannot be changed for the same Play Store application after publishing.

### 2. Sign in and configure EAS

```bash
cd /Users/raveendra.bandi_codev_blr/basketful
npx eas-cli@latest login
npx eas-cli@latest whoami
npx eas-cli@latest build:configure
```

The included `eas.json` has a `preview` profile for an installable APK and a `production` profile for a Play Store AAB. For the first Android build, allow EAS to generate and securely store a new upload keystore unless an existing keystore must be retained.

### 3. Create an installable APK

```bash
npx eas-cli@latest build --platform android --profile preview
```

Open the resulting build link on an Android phone to download and install the APK.

### 4. Create the production bundle

```bash
npx eas-cli@latest build --platform android --profile production
```

The default production Android build produces an `.aab`. Follow the build URL printed by EAS and download the completed artifact.

## Publish to Google Play

1. Register at [Google Play Console](https://play.google.com/console).
2. Create an application named Basketful.
3. Ensure its package name matches `expo.android.package`.
4. Start with Testing → Internal testing.
5. Create a release and upload the production `.aab`.
6. Add testers and publish the internal test.
7. Complete the store listing and policy requirements.
8. Promote an approved build to production when ready.

The Play Console setup normally includes:

- App name, short description, and full description
- High-resolution icon, feature graphic, phone screenshots, and optional tablet screenshots
- Privacy-policy URL
- Data safety disclosure
- Content rating
- Ads declaration
- Target-audience declaration
- App access instructions
- Contact details
- Testing requirements applicable to the developer account

### Submit with EAS

After creating the Play Console application, configure a Google Service Account key for Expo Submit. Then:

```bash
npx eas-cli@latest submit --platform android
```

Or build and submit together:

```bash
npx eas-cli@latest build --platform android --profile production --auto-submit
```

EAS uploads the binary. Store descriptions, screenshots, policy forms, review, and production rollout are still managed in Google Play Console.

## Production-readiness checklist

Before releasing publicly:

- Replace sample customer, address, catalog, and order data.
- Replace remote sample photography with licensed production assets.
- Configure final app icon, adaptive icon, splash screen, and store graphics.
- Connect a secured backend and production database.
- Add authentication and account recovery.
- Integrate a real payment provider and verify payment status server-side.
- Add inventory, pricing, order, delivery, refund, and cancellation APIs.
- Add secure configuration and environment management.
- Publish privacy policy, terms, refund policy, and support contact.
- Add error monitoring, analytics, logging, and alerting.
- Test offline, slow network, empty, error, and retry states.
- Test on multiple Android/iOS versions and screen sizes.
- Add integration and end-to-end tests.
- Perform accessibility, performance, and security reviews.
- Never place private API keys or payment secrets in client code.

## Troubleshooting

### Metro cache problems

```bash
npx expo start --clear
```

### Dependency compatibility problems

```bash
npx expo install --fix
npx expo-doctor
```

### Android SDK not found

Confirm Android Studio installed the SDK at `$HOME/Library/Android/sdk`, set `ANDROID_HOME`, add `platform-tools` to `PATH`, and restart the terminal.

### QR code does not connect

Confirm the phone and computer use the same network, disable restrictive VPN/firewall settings, or run `npx expo start --tunnel`.

### Port 8081 is already used

Stop the other Metro process or allow Expo to use another port when prompted.

### Docker command not found

Install and start Docker Desktop, then verify:

```bash
docker --version
```

### Docker page does not update

Rebuild the image after code changes:

```bash
docker build --no-cache -t basketful .
```

## Branding and limitations

Basketful uses original branding and publicly hosted sample product photography. It does not include Ninjacart trademarks, proprietary artwork, source code, or private data.

This MVP is suitable for demonstration and product validation. It is not ready to process real customer orders or payments without the production work described above.
