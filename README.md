# Steam Logger

A production-oriented logging, validation, visualization, and export system for industrial steam and utility operations.
Designed to capture meter data reliably, detect anomalies, and generate structured Excel reports suitable for operational review and invoicing.

---

## Overview

Steam Logger is a full-stack application built to manage industrial steam and utility readings under real-world operating conditions. It provides a mobile-first interface for logging data, a dashboard for visualization, and an automated backend pipeline for exporting validated readings into Excel reports.

The system is designed to handle incomplete readings, delayed entries, and operational variance while maintaining data integrity and traceability.

---

## Core Features

### Meter Logging

- Steam flow
- Makeup water (blue / red)
- Condensate
- Bypass tracking
- Multi-meter support

### Data Validation

- Delta-based anomaly detection
- Configurable thresholds per meter
- Time-gap handling for delayed or missed readings
- Controlled acceptance of out-of-range values when conditions allow

### Dashboard & Visualization

- Aggregated views of logged readings
- Clear presentation of trends and differences
- Designed for operational monitoring and review

### Automated Excel Export

- Generates `.xlsx` reports using `openpyxl`
- Creates structured worksheets per export cycle
- Consistent column layout for downstream processing
- Suitable for invoicing, audits, and reporting

---

## Tech Stack

**Frontend**

- React Native (Expo)
- TypeScript
- Appwrite SDK

**Backend / Automation**

- Python
- openpyxl
- Appwrite (database & storage)
- Scheduled execution compatible (cron / cloud functions)

---

## Architecture

- Separation of UI, business logic, and export pipeline
- Excel generation independent of user interaction
- Supports local execution and cloud deployment
- Storage layer abstracted for portability

---

## Use Case

Steam Logger is intended for my operator environment where:

- Readings may be missed or delayed
- Data accuracy is critical
- Reports must remain consistent despite operational noise
- Automation reduces manual intervention

---

## Screenshots / Demo

### Application Views

<img src="assets/steam logger/pic q.jpg" alt="Dashboard Overview" width="100%" style="margin: 20px 0; border-radius: 8px;">

<img src="assets/steam logger/picture 2.jpg" alt="Meter Readings Interface" width="100%" style="margin: 20px 0; border-radius: 8px;">

<img src="assets/steam logger/picture 3.jpg" alt="Data Validation & Processing" width="100%" style="margin: 20px 0; border-radius: 8px;">

<img src="assets/steam logger/picture 4.jpg" alt="Export Workflow" width="100%" style="margin: 20px 0; border-radius: 8px;">

<img src="assets/steam logger/picture 5.jpg" alt="Reports & Analytics" width="100%" style="margin: 20px 0; border-radius: 8px;">

---

## License

Internal / Demonstration Use

---
