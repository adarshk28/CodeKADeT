from django.urls import path

from . import views

import sys
sys.path.append("..") 

"""! URLs needed for login and signup of user for corresponding views in login/views.py"""
    
app_name = "login"

urlpatterns = [
    path('signup/',views.signup,name='signup'),
    path('login/',views.login,name='login'),
]