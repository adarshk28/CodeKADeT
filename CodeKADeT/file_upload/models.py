from django.db import models
from django.contrib.auth.models import AbstractUser
import os
import  sys
sys.path.append(os.path.realpath('.'))
from login.models import UserProfile

def user_directory_path(instance, filename):
    print('Id is: ', instance.creator.id)
    print('File name is: ', instance.file_name)
    return 'personal_file/{0}/{1}'.format(instance.creator.id, instance.file_name)
class Code_file(models.Model):
    description=models.CharField(max_length=200)
    file_name=models.CharField(max_length=20)
    uploaded_on=models.DateTimeField(auto_now=True)
    creator=models.ForeignKey(UserProfile, on_delete=models.CASCADE, default='')
    content=models.FileField(upload_to=user_directory_path)
    language=models.CharField(max_length=20)
    path=models.CharField(max_length=200)
    
# Create your models here.
