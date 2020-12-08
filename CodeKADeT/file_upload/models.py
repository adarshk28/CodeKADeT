# Imports required for the file_upload model
from django.db import models
from django.contrib.auth.models import AbstractUser
import os
import  sys
sys.path.append(os.path.realpath('.'))
from login.models import UserProfile



def user_directory_path(instance, filename):
    '''! Function for setting the path for given file instance in the media directory

        @param instance     Parameter with details of User logged in and the file received from front end

        @return path of the saved file in the user's media directory 
    '''
    return 'personal_file/{0}/{1}/{2}'.format(instance.creator.id , instance.path ,instance.file_name)

