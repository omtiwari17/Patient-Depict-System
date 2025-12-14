"""
URL configuration for PDS project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from PDS import views

from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('contact/submit/', views.contact_us_form, name='contact-submit'),
    
    path('admin1/dashboard/', views.admin, name='adminpage'),
    path('admin1/accounts/create/', views.admin_acc_create, name='admin-create-accounts'),
    path('admin1/doctor/', views.admin_doctor, name='admin-doctor'),
    path('admin1/patients/', views.admin_patients, name='admin-patients'),
    path('admin1/accounts/edit/', views.admin_acc_edit, name='admin-edit-accounts'),
    path('admin1/accounts/edit/doctor/search/', views.admin_lookup_doctor, name='admin-lookup-doctor'),
    path('admin1/accounts/edit/patient/search/', views.admin_lookup_patient, name='admin-lookup-patient'),
    path('admin1/accounts/edit/doctor/update/', views.admin_update_doctor, name='admin-update-doctor'),
    path('admin1/accounts/edit/patient/update/', views.admin_update_patient, name='admin-update-patient'),

    path('doctor/dashboard/', views.doctor_dashboard, name='doctor-dashboard'),
    path('doctor/account-edit/', views.doctor_account_edit, name='doctor-account-edit'),
    path('doctor/account-view/', views.doctor_account_view, name='doctor-account-view'),
    path('doctor/messages/', views.doctor_messages, name='doctor-messages'),
    path('doctor/patients/', views.doctor_patients, name='doctor-patients'),
    path('doctor/reports/', views.doctor_reports, name='doctor-reports'),
    path('doctor/status/', views.doctor_status, name='doctor-status'),
    path('doctor/status/update/', views.doc_pat_status, name='doctor-status-update'),
    path('doctor/update/account/', views.update_doc_acc, name='doctor-update-account'),

    path('patient/dashboard/', views.patient_dashboard, name='patient-dashboard'),
    path('patient/account-edit/', views.patient_account_edit, name='patient-account-edit'),
    path('patient/account-view/', views.patient_account_view, name='patient-account-view'),
    path('patient/reports/', views.patient_reports, name='patient-reports'),
    path('patient/status/', views.patient_status, name='patient-status'),
    path("patient/status/share-link/", views.patient_generate_share_link, name="patient-status-share-link"),
    path("share/status/<str:token>/", views.shared_status_view, name="shared-status"),
    path('status-shared/', views.status_shared, name='status-shared'),
    path('patient/update/account/', views.update_patient_acc, name='patient-update-account'),


    path('save_doctor/', views.save_doctor, name='save_doctor'),
    path('save_patient/', views.save_patient, name='save_patient'),
    
    path('login/', views.login, name='login'),
    path('login-auth', views.login_auth, name='login_auth'),

    path("<str:role>/login", views.role_login, name="role-login"),
    path('role_login:<str:role>/', views.role_login, name='role_login'),

    path('logout/', views.logout, name='logout'),

    path('extract-pdf/', views.upload_and_extract_pdf_text, name='extract_pdf_text'),
    path('upload_report/', views.upload_report, name='upload_report'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)