from django.db import models

class create_doctor(models.Model):
    doc_id = models.CharField(max_length=100, unique=True)
    name= models.CharField(max_length=100)
    email= models.EmailField()
    phone= models.CharField(max_length=15)
    department= models.CharField(max_length=100)
    specialist= models.CharField(max_length=100)
    license_no= models.CharField(max_length=50)
    experience= models.IntegerField()
    password= models.CharField(max_length=100, default="password123")
    #status= models.CharField(max_length=20, default="Active")

class create_patient(models.Model):
    patient_id= models.CharField(max_length=100)
    name= models.CharField(max_length=100)
    email= models.EmailField()
    phone= models.CharField(max_length=15)
    age= models.IntegerField()
    address= models.TextField()
    gender= models.CharField(max_length=10)
    blood_group= models.CharField(max_length=5)
    disease= models.CharField(max_length=100)
    doctor= models.ForeignKey(create_doctor, on_delete=models.CASCADE)
    password= models.CharField(max_length=100, default="password123")
    status= models.CharField(max_length=20, default="Admitted")
    status_notes = models.TextField(blank=True, null=True)

class Report(models.Model):
    patient = models.ForeignKey(create_patient, on_delete=models.CASCADE, related_name='reports')
    report_type = models.CharField(max_length=50)
    notes = models.TextField(blank=True)
    file = models.FileField(upload_to='reports/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
class contact_us(models.Model):
    firstname= models.CharField(max_length=100)
    lastname= models.CharField(max_length=100)
    email= models.EmailField()
    priorty= models.CharField(max_length=50)
    subject= models.CharField(max_length=200)
    message= models.TextField()