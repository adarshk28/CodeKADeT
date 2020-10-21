from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth.forms import UserCreationForm,AuthenticationForm
from django.core.files.storage import FileSystemStorage
from django.contrib.auth.decorators import login_required

from .models import Code_file
from .forms import DocumentForm
from django.middleware.csrf import CsrfViewMiddleware

from .models import UserProfile as User
from django.db import IntegrityError
from django.contrib import auth


#def home(request):
    #documents = Code_file.objects.all()
    #return render(request, 'core/home.html', { 'documents': documents })

def new_user(request):  # ignore this 
    if request.method=="POST":
        username=request.POST['username']
        password=request.POST['password']
        success=auth.authenticate(request,username=username,password=password)
        if success is None:
            return render(request,'login.html',{'form':AuthenticationForm,'info':'Invalid credentials!'}) 
        else:
            auth.login(request,success)
            return render(request,'login.html',{'form':AuthenticationForm},{'info':"upload your files!"}) # redirect to user profile, add url in templates 
    else:
       return render(request,'login.html',{'form':AuthenticationForm})

@login_required
def upload_from_computer(request):
    if request.method=='POST':
        form=DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            myfile=request.user.code_file_set.create(description=request.POST['desc'], content=request.FILES['docfile'], language=request.POST['language'], file_name=request.POST['file_name'])
            myfile.save()
            return render(request, 'user_page.html', {'info':"works!"})
        else:
            myfile=request.user.code_file_set.create(description=request.POST['desc'], content=request.FILES['docfile'], language=request.POST['language'], file_name=request.POST['file_name'])
            myfile.save()
            return render(request, 'user_page.html', {'info':"does not work !"})

    else:
        return render(request, 'user_page.html', {'info':"Hey "+request.user.username+"! Please select a file"})
    

def upload_from_textbox(request):
    if request.method=='POST':
        form=DocumentForm(request.POST)
    if form.is_valid():
        docfile=open(request.filename)
        myfile=request.user.code_file_set.create(description=request.POST['desc'], content=docfile, language=request.POST['language'], file_name=request.POST['file_name'])
        myfile.save()
        return render(request, 'upload_files.html', {})

