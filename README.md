# Patient Depict System

A Django-based, role-driven web application that helps patients and families understand a patient’s health status without digging through complex medical records.

The core idea is simple: show the right information to the right people, clearly and safely.

---

## What this project solves

Most clinical reports are written for doctors, not patients or families. Updates often move through phone calls, intermediaries, or incomplete messages. That creates confusion when clarity matters most.

Patient Depict System closes that gap by offering:

* Clear status updates
* Controlled data access
* Privacy-first sharing for families

---

## Key features

### Role-based access

The system is built around three clear roles:

**Admin**

* Creates and manages Doctor and Patient accounts
* Sends credentials via email
* Activates or deactivates users
* Monitors system activity through audit logs

**Doctor**

* Views assigned patients
* Updates patient status (Good, Stable, Critical, Discharged, Deceased)
* Adds short clinical notes
* Reviews status history

**Patient**

* Tracks doctor updates
* Generates a secure shareable status link

---

### Secure status sharing

Patients can generate a **read-only, token-based public link** that shows only:

* Current status
* Last updated time
* Treating doctor’s name or initials

No personal details. No reports. No identifiers.

Links can expire or be revoked at any time.

---

## Tech stack

* **Backend:** Django (MVT architecture)
* **Database:** SQLite (development-ready, PostgreSQL compatible)
* **Frontend:** Django Templates, HTML, CSS
* **Auth & Security:**

  * Django authentication
  * CSRF protection
  * Password hashing
  * Tokenized public links
* **Email:** SMTP (for onboarding and password reset)

---

## System architecture (high level)

* Models: User, Patient, Doctor, Report, StatusLog, ShareLink, AuditLog
* Views: Role-based routing and permission checks
* Templates: Minimal UI tailored per role
* URLs: Clean separation of Admin, Doctor, and Patient workflows

Data structures are designed with **HL7 FHIR alignment in mind** for future interoperability.

---

## How to run locally

```bash
# Clone the repository
git clone https://github.com/omtiwari17/Patient-Depict-System
cd Patient-Depict-System

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Access the app at:
`http://127.0.0.1:8000/`

---

## Project status

This is a **functional academic prototype**, focused on:

* Clear workflows
* Correct access control
* Privacy-by-design
* Clean data modeling

It is not intended to replace hospital systems but can integrate with them in future iterations.

---

## Future enhancements

* Two-factor authentication
* Mobile application (Flutter / React Native)
* Teleconsultation and secure messaging
* Analytics dashboards for patient status trends
* Multi-doctor collaboration per patient

---

## Authors

* **Om Tiwari**
