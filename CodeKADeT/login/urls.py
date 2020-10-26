from django.urls import path

from . import views

import sys
sys.path.append("..") 


app_name = "login"

urlpatterns = [
    path('signup/',views.signup,name='signup'),
    path('login/',views.login,name='login'),
    #path('',views.signup,name='signup'),
    #re_path()
    #path('user_profile',views.login,name='login'),
]