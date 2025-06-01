## 🚀 Live Demo

Check it out here:  
👉 [http://thumbsupgroceries-csdth0emcuhmajca.canadacentral-01.azurewebsites.net/](http://thumbsupgroceries-csdth0emcuhmajca.canadacentral-01.azurewebsites.net/)

⚠️ *Note: On the first visit, it may take up to a minute to load due to server cold start.*

---

## ✅ Requirements

- **Node.js** — Tested on `v20.18.0`  
- **npm** — Tested on `v10.8.2`

---

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/neilparkst/ThumbsupGroceries-frontend.git

# Navigate to the frontend directory
cd ThumbsupGroceries-frontend

# Install dependencies
npm install
```

---

## ▶️ Running the App (Development)

```bash
# Start the development server
npm run start
```

---

## 📦 (Optional) Build for Production

```bash
# Build the app for production
npm run build:production
```

---

## ⚙️ Setup

In `/src/Data/Settings.ts`, modify the `domain` line to follow this format using your own production and test server URLs:

```ts
export const domain = process.env.REACT_APP_ENV === 'production'
  ? <server domain for production mode>
  : <server domain for test mode>;
```

Replace `<server domain for production mode>` and `<server domain for test mode>` with the appropriate backend URLs.

---

## 🧱 Tech Stack

- **React**
- **Redux Toolkit**
- **TanStack Query (React Query)**
- **Material UI**
- **SCSS**

---

## 📁 Project Structure

```plaintext
src/
├── Components   # Shared UI components used across the app
├── Data         # API definitions and server communication logic
├── Pages        # Route-based page components
```
