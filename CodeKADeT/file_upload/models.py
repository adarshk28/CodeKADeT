from django.db import models
from django.contrib.auth.models import AbstractUser
import os
import  sys
sys.path.append(os.path.realpath('.'))
from login.models import UserProfile
class Code_file(models.Model):
    description=models.CharField(max_length=200)
    file_name=models.CharField(max_length=20)
    uploaded_on=models.DateTimeField(auto_now=True)
    creator=models.ForeignKey(UserProfile, on_delete=models.CASCADE, default='')
    content=models.FileField('/documents/personal/{0}/{1}'.format(creator, file_name))
    language=models.CharField(max_length=20)
# Create your models here.
