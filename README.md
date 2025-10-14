# UDAWA Smart System

[![UDAWA Smart System](https://img.shields.io/badge/UDAWA-Smart_System-blue.svg)](https://github.com/Narin-Laboratory/udawa-app)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![React + TypeScript + Vite](https://img.shields.io/badge/React-TypeScript-blue)](https://vitejs.dev/)

**UDAWA (Universal Digital Agriculture Workflow Assistant)** is an open-source platform for precision agriculture, designed with a peasant-centric approach to empower small-scale farmers with modern technology. This web application serves as the central dashboard for monitoring and controlling UDAWA smart devices, enabling farmers to optimize their agricultural processes from anywhere, at any time.

![Screenshot Placeholder](https://via.placeholder.com/800x400.png?text=UDAWA+Dashboard+Screenshot)

## ✨ Features

*   **Real-time Monitoring:** Keep track of crucial environmental data such as temperature, humidity, and water quality (TDS).
*   **Remote Control:** Automate and manually control farm instruments like pumps, misters, blowers, and lights.
*   **Energy Management:** Monitor the power consumption of connected devices to optimize energy usage.
*   **Data Logging & Analytics:** Historical data logging to provide insights into farming operations.
*   **Device Management:** Easily manage and switch between multiple UDAWA devices.
*   **Responsive Design:** A mobile-first interface ensures a seamless experience on both desktop and mobile devices.
*   **Multi-language Support:** Available in both English and Indonesian.

## 🌱 About UDAWA

The UDAWA platform was initiated by lecturers and students at Universitas Pendidikan Nasional in 2019. It aims to bridge the technology gap for small farmers by providing affordable, powerful, and open-source tools for precision agriculture. The core philosophy is **peasant-centric**: built by farmers, for farmers.

The project is licensed under the **aGPLv3**, ensuring that it remains free and open-source forever. Everyone is free to use, modify, and distribute the platform.

## 📱 Device Models

The UDAWA platform currently supports three main device models:

*   **UDAWA Gadadar:** Controls and monitors agricultural instruments like pumps, fans, and lights. It features four controllable channels and energy monitoring for each.
*   **UDAWA Damodar:** Monitors hydroponic water conditions, tracking TDS (Total Dissolved Solids) and water temperature.
*   **UDAWA Murari (formerly Sudarsan):** An imaging system that allows farmers to remotely capture photos of their crops for monitoring and early-wilt detection.

## 🛠️ Technology Stack

*   **Frontend:** React, TypeScript, Vite, Material-UI
*   **Backend Integration:** Thingsboard IoT Platform
*   **Real-time Communication:** WebSockets
*   **Internationalization:** i18next
*   **Testing:** Playwright

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later)
*   npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/Narin-Laboratory/udawa-app.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Create a `.env.local` file in the root directory and add the following environment variables for the development server and API proxy:
    ```env
    VITE_TB_URL=https://prita.undiknas.ac.id
    ```
4.  Start the development server:
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 🖼️ Screenshots

*(More screenshots will be added here)*

**Login Page**
![Login Page Placeholder](https://via.placeholder.com/400x600.png?text=Login+Page)

**Device Dashboard**
![Dashboard Placeholder](https://via.placeholder.com/800x400.png?text=Device+Dashboard)

## 📜 License

Distributed under the AGPLv3 License. See `LICENSE` for more information.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📞 Contact & Support

**Narin Laboratory** - [https://narin.co.id](https://narin.co.id)

**Project Link:** [https://github.com/Narin-Laboratory/udawa-app](https://github.com/Narin-Laboratory/udawa-app)

---

© 2025 PSTI Undiknas - Narin Laboratory. All Rights Reserved.