from django.urls import path

from .import views

urlpatterns = [
    path('signup/',views.signup,name='signup'),
    path('login/',views.login,name='login'),
    #path('',views.signup,name='signup'),
    #re_path()
    #path('user_profile',views.login,name='login'),
]