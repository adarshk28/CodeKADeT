# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render,redirect
from django.contrib.auth.forms import UserCreationForm,AuthenticationForm
from .models import UserProfile as User
from django.db import IntegrityError
from django.contrib import auth
from django.middleware.csrf import CsrfViewMiddleware



def signup(request):
    if request.method=="POST":
        if request.POST.get('password1')==request.POST.get('password2'):
            try:
                saveuser=User.objects.create_user(request.POST.get('username'),password=request.POST.get('password1'))
                saveuser.save()
                return render(request,'signup.html',{'form':UserCreationForm,'info':'User '+request.POST.get('username')+' registered succssfully!'})
            except IntegrityError:
                return render(request,'signup.html',{'form':UserCreationForm,'info':'User '+request.POST.get('username')+' already exists! Try to login!'})
        else:
            return render(request,'signup.html',{'form':UserCreationForm,'info':'Passwords don\'t match! Try again!'})
    else:
        return render(request,'signup.html',{'form':UserCreationForm})

def login(request):
    
    if request.method=="POST":
        username=request.POST['username']
        password=request.POST['password']
        success=auth.authenticate(request,username=username,password=password)
        if success is None:
            return render(request,'login.html',{'form':AuthenticationForm,'info':'Invalid credentials!'}) 
        else:
            auth.login(request,success)
            return redirect("upload") # redirect to user profile, add url in templates 
    else:
       return render(request,'login.html',{'form':AuthenticationForm})
# Create your views here.
