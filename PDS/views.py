from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.core.mail import send_mail
from users.models import *

from django.contrib import messages
from django.http import Http404
from django.urls import reverse

from django.contrib.auth.models import User

from django.core.files.uploadedfile import InMemoryUploadedFile 
import io
from pypdf import PdfReader
from django.shortcuts import render, get_object_or_404, redirect
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import os
from django.http import JsonResponse

from django.core import signing
from django.views.decorators.http import require_GET, require_POST
from django.utils import timezone



def index(request):
    return render(request, "index.html")

def about(request):
    return render(request, "about.html")

def contact(request):
    return render(request, "contact.html")

def admin(request):
    doctor_count= create_doctor.objects.count()
    patient_count = create_patient.objects.count()
    report_count= Report.objects.count()
    return render(request, "admin-dashboard.html", {'patient_count': patient_count, 'doctor_count': doctor_count, 'report_count': report_count})

def admin_acc_create(request):
    doc_id = create_doctor.objects.values('doc_id')
    return render(request, "admin-create-accounts.html", {'doc_id': doc_id})

def admin_acc_edit(request):
    return render(request, "admin-edit-accounts.html")

def admin_doctor(request):
    doctor_data = create_doctor.objects.all()
    return render(request, "admin-doctors.html", {'doctor_data': doctor_data})

def admin_patients(request):
    patient_data = create_patient.objects.all().order_by('id')

    return render(request, "admin-patients.html", {'patient_data': patient_data})

def doctor_dashboard(request):
    return render(request, "doctor-dashboard.html")

def doctor_account_edit(request):
    email = request.session.get('doctor_session')
    doctor_acc = create_doctor.objects.get(email=email)
    return render(request, "doctor-account-edit.html", {'doctor_acc': doctor_acc})

def doctor_account_view(request):
    email = request.session.get('doctor_session')
    doctor_acc = create_doctor.objects.get(email=email)
    return render(request, "doctor-account-view.html", {
        'doctor_acc': doctor_acc
    })

def doctor_messages(request):
    return render(request, "doctor-messages.html")

def doctor_patients(request):
    #get data of patient for the doctor assigned to them check from session id
    doctor_id = request.session.get('doctor_id')
    patient_data = create_patient.objects.filter(doctor_id=doctor_id).order_by('name')

    return render(request, "doctor-patients.html", {'patient_data': patient_data})

def doctor_reports(request):
    patients = create_patient.objects.all().order_by('name')
    return render(request, "doctor-reports.html", {'patients': patients})

def doctor_status(request):
    patients = create_patient.objects.all().order_by('name')

    return render(request, "doctor-status.html", {'patients': patients})

def patient_dashboard(request):
    email = request.session.get('patient_session')

    patient = create_patient.objects.get(email=email)

    return render(request, "patient-dashboard.html",{"patient": patient})

def patient_account_edit(request):
    email = request.session.get('patient_session')

    patient = create_patient.objects.get(email=email)

    return render(request, "patient-account-edit.html", {"patient": patient})

def patient_account_view(request):
    email = request.session.get('patient_session')
    patient = create_patient.objects.get(email=email)
    return render(request, "patient-account-view.html", {"patient": patient})

def patient_reports(request):
    return render(request, "patient-reports.html")

def patient_status(request):
    email = request.session.get('patient_session')

    patient = create_patient.objects.get(email=email)

    return render(request, "patient-share-status.html", {"patient": patient})

def status_shared(request):
    return render(request, "status-share.html")
@require_POST
def patient_generate_share_link(request):
    email = request.session.get('patient_session')
    if not email:
        return JsonResponse({"ok": False, "error": "Not logged in"}, status=401)

    try:
        patient = create_patient.objects.get(email=email)
    except create_patient.DoesNotExist:
        return JsonResponse({"ok": False, "error": "Patient not found"}, status=404)

    token = signing.dumps({"pid": patient.id}, salt="status-share")
    url = request.build_absolute_uri(reverse('shared-status', args=[token]))
    return JsonResponse({"ok": True, "url": url, "token": token})


@require_GET
def shared_status_view(request, token: str):
    try:
        data = signing.loads(token, salt="status-share", max_age=60*60*24*30)
        pid = data.get("pid")
        patient = create_patient.objects.get(pk=pid)
    except Exception:
        return render(request, "status-share.html", {"invalid": True})

    # Simple color map for badge
    color_map = {
        "Active": "#2ec4b6",
        "Stable": "#ffd166",
        "Recovering": "#4caf50",
        "Critical": "#e63946",
        "Admitted": "#4361ee",
    }
    status_color = color_map.get(patient.status, "#2c3e50")

    return render(request, "status-share.html", {
        "name": patient.name,
        "status": patient.status,
        "status_color": status_color,
        "updated_at": timezone.now().strftime("%b %d, %Y %I:%M %p")
    })

def login(request):
    return render(request, "login.html")


def save_doctor(request):
    if request.method == "POST":
        doc_id=request.POST.get('doctorId')
        name= request.POST.get('name')
        email= request.POST.get('email')
        phone= request.POST.get('phone')
        department= request.POST.get('department')
        specialist= request.POST.get('specialist')
        license_no= request.POST.get('license')
        experience= request.POST.get('experience')

        password = User.objects.make_random_password(length=10)

        sav= create_doctor(doc_id=doc_id, name=name, email=email, phone=phone, department=department, specialist=specialist, license_no=license_no, experience=experience, password=password)
        sav.save()

        messages.success(request, "Doctor registered successfully.", extra_tags="doctor")

        subject = f"Doctor Registration Confirmation – {name}"
        message = f"""
        Hello Dr. {name},

        Registration successful. Your account has been created.

        Doctor ID: {doc_id}
        Password: {password}

        Regards,
        PDS Admin Team
        """
        send_mail(subject, message, "osts317@gmail.com", [email])

        return redirect("admin-create-accounts")

def save_patient(request):
    if request.method == "POST":
        patient_id = request.POST.get('patientId')
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        age = request.POST.get('age')
        address = request.POST.get('address')
        gender = request.POST.get('gender')
        blood_group = request.POST.get('bloodGroup')
        disease = request.POST.get('disease')
        doctor_id = request.POST.get('doctor_id')

        # a random password will generate 
        password = User.objects.make_random_password(length=10)
 

        doctor = get_object_or_404(create_doctor, doc_id=doctor_id)

        sav= create_patient(
            patient_id=patient_id,
            name=name,
            email=email,
            phone=phone,
            age=age,
            address=address,
            gender=gender,
            blood_group=blood_group,
            disease=disease,
            doctor=doctor,
            password=password
        )
        sav.save()

        messages.success(request, "Patient registered successfully.", extra_tags="patient")

        # send email AFTER save
        subject = f"Patient Registration Confirmation – {name}"
        message = f"""
        Hello {name},

        Registration successful. Your account has been created.

        Password: {password}
        Patient ID: {patient_id}

        Regards,
        PDS Admin Team
        """
        send_mail(subject, message, "osts317@gmail.com", [email])

        return redirect("admin-create-accounts")


'''
def savedata1(request):
    if request.method == "POST":
        name= request.POST.get('name')
        email= request.POST.get('email')
        hospitalId= request.POST.get('hospitalId')
        age= request.POST.get('age')
        address= request.POST.get('address')
        disease= request.POST.get('disease')
        doctor= request.POST.get('doctor')
    
    return render(request, "admin-accounts-edit.html")
'''
'''
def admin_accounts_view(request):
    #admin_all= pds.objects.all()  #select * from pds
    #admin_all= pds.objects.all().order_by('name')  #select * from pds order by name
    #admin_all= pds.objects.all().order_by('name').reverse()  #select * from pds order by name desc
    #admin_all= pds.objects.all().order_by('id')[:3]  #select * from pds order by id limit 3
    #admin_all= pds.objects.all().filter(age=15).values()  #select * from pds where age = 15
    #admin_all= pds.objects.all().filter(age=15 , addr='Indore').values()  #select * from pds where age = 15 and addr='Indore'
    #admin_all= pds.objects.all().filter(age=15).values() | pds.objects.all().filter(addr='Indore').values()  #select * from pds where age = 15 or addr='Indore'
    admin_all= pds.objects.values('name') #select name from pds
    
    return render(request, "admin-accounts-view.html", {'admin_all': admin_all})
'''

def login_auth(request):
    d={}
    if request.method == "POST":
        email= request.POST.get('email')
        password= request.POST.get('password')
        if email=="admin@example.com" and password=="admin123":
            d['msg']="Login Successfully"
            return render(request, "admin-dashboard.html",d)
    
        else:
            d['msg']="Login Failed"



ALLOWED_ROLES = ["admin1", "doctor", "patient"]

DEMO_CREDS = {
    "admin1":  {"email": "admin@example.com",  "password": "admin123",  "redirect": "/admin1/dashboard/"},
    "doctor":  {"email": "doctor@example.com", "password": "doctor123", "redirect": "/doctor/dashboard/"},
    "patient": {"email": "patient@example.com","password": "patient123","redirect": "/patient/dashboard/"},
}

def role_login(request, role: str):
    role = role.lower()
    if role not in ALLOWED_ROLES:
        raise Http404("Unknown role")

    if request.method != "POST":
        return render(request, "login.html")

    email = (request.POST.get("email") or "").strip().lower()
    password = request.POST.get("password") or ""

    # Direct check example (you asked for this pattern earlier)
    rule = DEMO_CREDS[role]

    doc= create_doctor.objects.all().filter(email=email , password=password).values()
    pat= create_patient.objects.all().filter(email=email , password=password).values()

    print(doc)
    if 'admin1' in ALLOWED_ROLES and email == "admin@gmail.com" and password == "admin":
        return redirect("/admin1/dashboard/")

    elif 'doctor' in ALLOWED_ROLES and doc:
        doc_obj= doc[0]['name']
        #request.session['doctor_session'] = email
        request.session['doctor_name'] = doc_obj
        request.session['doctor_session'] = email
        request.session['doctor_id'] = doc[0]['doc_id']
        return redirect("/doctor/dashboard/")

    elif 'patient' in ALLOWED_ROLES and pat:
        pat_obj= pat[0]['name']
        request.session['patient_session'] = email
        request.session['patient_name'] = pat_obj
        request.session['patient_id'] = pat[0]['patient_id']
        return redirect("/patient/dashboard/")
    
    else:
        messages.error(request, "The username or password you entered is incorrect.")

    # if email == rule["email"] and password == rule["password"]:
    #     # TODO: set session or Django auth login(...) as needed
    #     return redirect(rule["redirect"])

    return redirect(reverse("login"))

def logout(request):
    # ALLOWED_ROLES = ["admin1", "doctor", "patient"]
    # if 'doctor' in ALLOWED_ROLES and 'doctor_session' in request.session:
    #     del request.session['doctor_session']
    # if 'patient' in ALLOWED_ROLES and 'patient_session' in request.session:
    #     del request.session['patient_session']

    request.session.flush()
    return redirect('/login/')


def doc_pat_status(request):
    if request.method != "POST":
        return redirect('doctor-status')

    patient_id = request.POST.get("patient")
    status = request.POST.get("status")
    notes = request.POST.get("statusNotes", "")

    try:
        patient = create_patient.objects.get(pk=patient_id)
        patient.status = status
        patient.status_notes = notes
        patient.save()
        messages.success(request, f"Status updated for {patient.name} → {status}.")
    except (create_patient.DoesNotExist, ValueError):
        messages.error(request, "Selected patient does not exist or is invalid.")

    return redirect('doctor-status')


def update_doc_acc(request):
    if request.method == "POST":
        email = request.session.get('doctor_session')
        doctor_acc = create_doctor.objects.get(email=email)

        name = request.POST.get('name')
        phone = request.POST.get('phone')
        experience = request.POST.get('experience')
        password = request.POST.get('password')

        # Update fields
        doctor_acc.name = name
        doctor_acc.phone = phone
        doctor_acc.experience = experience
        if password:
            doctor_acc.password = password

        doctor_acc.save()

        messages.success(request, "Account details updated successfully.")

        return redirect('doctor-account-edit')

def update_patient_acc(request):
    if request.method == "POST":
        email = request.session.get('patient_session')
        patient_acc = create_patient.objects.get(email=email)

        name = request.POST.get('name')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        password = request.POST.get('password')

        # Update fields
        patient_acc.name = name
        patient_acc.phone = phone
        patient_acc.address = address
        if password:
            patient_acc.password = password

        patient_acc.save()

        messages.success(request, "Account details updated successfully.")

        return redirect('patient-account-edit')

def upload_report(request):
    if request.method == "POST":
        patient_id = request.POST.get("patient_id")
        report_type = request.POST.get("report_type")
        notes = request.POST.get("notes", "")
        uploaded_file = request.FILES.get("report_file")

        if not uploaded_file:
            return JsonResponse({"ok": False, "error": "No file uploaded"}, status=400)

        patient = get_object_or_404(create_patient, pk=patient_id)

        # Rename the uploaded file to include patient id
        # Preserve extension and add a short timestamp for uniqueness
        import time, os as _os
        original_name = uploaded_file.name
        base, ext = _os.path.splitext(original_name)
        safe_ext = ext.lower() if ext else ""
        stamp = time.strftime("%Y%m%d%H%M%S")
        new_name = f"p{patient.id}_{stamp}{safe_ext}"

        # Update the file's name before saving
        uploaded_file.name = new_name

        report = Report(
            patient=patient,
            report_type=report_type,
            notes=notes,
            file = uploaded_file
        )
        report.save()


        return JsonResponse({
            "ok": True,
            "message": "Report uploaded successfully!",
            "file_name": uploaded_file.name,
            "file_url": request.build_absolute_uri(report.file.url),
            "patient": patient.name,
            "report_type": report_type
        })

    return JsonResponse({"ok": False, "error": "Invalid request"}, status=400)



def upload_and_extract_pdf_text(request):
        extracted_text = ""
        if request.method == 'POST' and request.FILES.get('pdf_file'):
            uploaded_file: InMemoryUploadedFile = request.FILES['pdf_file']

            if uploaded_file.name.endswith('.pdf'):
                try:
                    pdf_file_obj = io.BytesIO(uploaded_file.read())
                    reader = PdfReader(pdf_file_obj)
                    
                    for page in reader.pages:
                        extracted_text += page.extract_text() + "\n"

                except Exception as e:
                    extracted_text = f"Error extracting text: {e}"
            else:
                extracted_text = "Please upload a valid PDF file."

        return render(request, 'doctor-reports.html', {'extracted_text': extracted_text})
