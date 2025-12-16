# Network Simulator Web (NetSim Web)

NetSim Web is a **frontend-only web application** for simulating computer network topologies and basic network behavior.  
This project is intended for **educational, academic, and demonstration purposes**, allowing users to visually design networks and simulate connectivity directly in the browser.

---

## ✨ Features

- Visual network topology builder (drag & drop)
- Add and configure network devices (PC, router, etc.)
- IP address and gateway configuration
- Basic connectivity simulation (ping)
- Simple firewall rule simulation (client-side)
- Auto-save topology using browser localStorage
- Export and import topology as JSON files
- Clean and responsive user interface

---

## 🔐 Authentication Notice (Important)

> ⚠️ **This application does NOT implement real authentication.**

- The login screen is **mock / demo only**
- No backend server, database, or API is used
- Any username and password combination is accepted
- Credentials are **not validated, stored, or transmitted**
- Login exists purely for **UI and simulation flow purposes**

This project **should not be used as a security reference**.

---

## 🧠 Technology Stack

- React
- Vite
- React Flow
- JavaScript (ES6+)
- HTML & CSS
- Client-side storage (localStorage)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm

### Installation & Run

```bash
git clone https://github.com/Yand1sc/network-simulator-web.git
cd network-simulator-web
npm install
npm run dev
