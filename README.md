# 💡 ClarityTracking: Production-Ready SaaS Architecture for 9/10+ Meta CAPI Scores

This repository contains the **v1.0 Production Architecture** for **ClarityTracking**, a full-stack SaaS platform designed to solve the **\#1 pain point for modern advertisers**: conversion data loss post-iOS 14.

This is the exact system blueprint used for the "white-glove" CAPI service that delivered the following **"Golden Case Study"** results:

* **Event Match Quality (EMQ):** From ~5.0/10 to **9.3/10 in 24 hours**.
* **True ROAS:** Enabled **5.15x True ROAS** by feeding Meta's algorithm accurate data.
* **Scalability:** Allowed the client to confidently scale ad spend to **$43k in 45 days**.

This architecture is the **Proof of Work**. I refuse to be a "GTM Technician". Instead, I am a "**CAPI Architect**" who builds complete, secure, and scalable attribution systems.

---

## 🎯 The 10/10 Pain Point This Solves

Advertisers (DTC brands, course creators, agencies) are flying blind. They commonly see:

* **40-50% of their conversion data is missing.**
* **Event Match Quality (EMQ) scores are stuck at a 4/10 or 6/10.**
* **Failing Ad Campaigns** because Meta's algorithm is optimizing on bad data.
* Frustration with complex, brittle, or incomplete tools like Stape.io or Google Tag Manager.

---

## 🛠️ The Architect's Solution: A Complete System

My "white-glove" service is not a simple script; it's a "white-glove implementation" of this exact production-grade architecture.

This system is built on **four pillars** that de-risk the entire process for a client:

### 1. Secure, Multi-Tenant Backend (FastAPI)

The core is a robust **FastAPI** application built for scale.

* **Secure JWT Authentication:** The system is built with secure user authentication (`/api/register`, `/api/login`) from the ground up.
* **Multi-Tenant Architecture:** The database model (**User** $\rightarrow$ **Website** $\rightarrow$ **Connection**) ensures data is securely siloed, a non-negotiable for a real service.
* **Platform-Agnostic:** The **Connection** model is designed to be a "universal data layer," allowing connections to Meta, TikTok, Google, and any e-commerce platform (Shopify, WooCommerce, Skool, Whop), which is our key differentiator against Shopify-only tools.

### 2. High-Throughput Data Ingestion

This architecture is built to handle event data at scale.

* **EventLog Model:** The **EventLog** table is the heart of the data pipeline, designed to ingest all raw event data, including critical identifiers like `event_id`, `fbp`, `fbc`, `email`, and `phone`.
* **Client-Side Scripting:** This backend is the server-side counterpart to the custom client-side `trackingLeads.js` script, forming a complete, full-stack solution.

### 3. Real-Time Health Monitoring & Analytics

This system doesn't just proxy data; it provides **clarity**.

* **Proactive Analytics:** The backend contains database logic (CRUD) to actively analyze incoming data for errors. The `get_potential_duplicate_events` function is a perfect example, identifying costly duplication issues before they skew ad results.
* **Health API:** The `/api/websites/{website_id}/health` and `/api/websites/{website_id}/alerts` endpoints prove the system is built to monitor itself and report on EMQ scores and data integrity.

### 4. Full-Stack Dashboard & Production-Readiness

This is a complete, user-facing solution, not just a backend script.

* **React Frontend:** The `/frontend` directory contains a full React application with a multi-component dashboard, session management, and data visualization.
* **Key Components:** The `EventHealthMonitor` and `AlertsDisplay` components are direct proof of the "**we sell clarity, not code**" promise.
* **Production-Ready:** The system is fully containerized with a **Dockerfile** and managed with **Alembic** migrations, demonstrating elite engineering standards.

---

## 💻 Core Technical Stack

| Category | Key Technologies |
| :--- | :--- |
| **Backend** | Python 3.12, **FastAPI**, SQLAlchemy 2.0, Pydantic V2 |
| **Database** | **PostgreSQL**, Alembic (for migrations) |
| **Authentication** | JWT (passlib, python-jose) |
| **Frontend** | **React 19**, Recharts, TailwindCSS |
| **Deployment** | Docker, Uvicorn |