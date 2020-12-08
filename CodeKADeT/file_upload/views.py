"""! Set of views for features of file handling in the backend"""

## Imports for file_upload/views.py - 
# Used restframework api for interaction with Angular Frontend,
# Subprocess for Compilation of files,
# shutil for recursively clearing directories"""
from logging import StreamHandler
from sys import flags
from django.http.response import HttpResponse
from django.shortcuts import render, redirect
from django.conf import Settings, settings
from django.contrib.auth.forms import UserCreationForm,AuthenticationForm
from django.core.files.storage import FileSystemStorage
from django.contrib.auth.decorators import login_required
from rest_framework import serializers
from shutil import move
from django.middleware.csrf import CsrfViewMiddleware
from django.contrib.auth import logout
from .models import UserProfile as User
from django.db import IntegrityError
from django.contrib import auth
import subprocess
from django.http import JsonResponse
import logging
logger=logging.getLogger(__name__)
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import FileUploadParser, JSONParser
from django.core.files.base import ContentFile
from rest_framework.decorators import api_view
from django.core.files import File
import os
import json
import shutil

@api_view(['GET'])
def logout_user(request):

    """! View for logging the user out of the workspace
        @param request  GET from Angular frontend to logout current user
        @return JSON response of logged out status
        @note The user should be logged in for this feature to work"""
    logout(request)
    return JsonResponse({"status": "Logged out"})


def path_to_dict(path, request):
    """! Defining the path to file/folder recieved from frontend
        @param path     string, file name
        @param request  user credentials
        @return     dictionary of filename with corresponding path in Media directory
        @note The make_map view function uses this function """
    ## Keys of Dictionary d
    #@var name  For storing the file name
    d = {'name': os.path.basename(path)}

    #check if it's a file or a folder, assign type to the key
    #@var path Assigned the path to media directory
    #@var children Key for Dictionary of children directories for a directory in request
    if os.path.isdir(path):
        d['type'] = "folder"
        d['path']=os.path.relpath(os.path.dirname(path), settings.MEDIA_ROOT+'personal_file/'+str(request.user.id))
        d['children'] = [path_to_dict(os.path.join(path,x), request) for x in os.listdir(path)]
    else:
        d['type'] = "file"
        d['path']=os.path.relpath(os.path.dirname(path), settings.MEDIA_ROOT+'personal_file/'+str(request.user.id))
    return d


@api_view(['GET'])
def make_map(request):
    """! Getting the path of the file requested from frontend for an authenticated user
        @param request  user credentials for authentication
        @return JsonResponse of the path of file in media directory backend"""
    if not request.user.is_authenticated:
        return JsonResponse({'Status': 'not logged in'})
    if request.method=='GET':
       return JsonResponse(path_to_dict(os.readlink(request.user.symlink), request))


@api_view(['POST'])
def upload_from_computer(request):
    """! Backend View for uploading a file chosen from User's system and POSTed on frontend
        Try making a directory for the path received from frontend, and simply create the file if the directory already exists
        @param request.user.symlink         symbolic link to User Media Directory
        @param request.POST['path']         Path to file in backend, type: string
        @param request.POST['file_name']    Name of the file to be saved in backend, type: string
        @param request.POST['content']      File Content, type: file

        @return JsonResponse depending on status of process

        @brief Based on Frontend request, if a file of same name and path already exists, it is overwritten with new content, else a new file is created"""
    try:
        os.makedirs(os.readlink(request.user.symlink)+request.POST['path']+'/')
        with open(os.readlink(request.user.symlink)+request.POST['path']+'/'+request.POST['file_name'], 'w+') as stored_file:
            stored_file.write(request.FILES['content'].read().decode('utf-8'))
    except:
        if os.path.isfile(os.readlink(request.user.symlink)+request.POST['path']+'/'+request.POST['file_name']):
            return JsonResponse({'status': 'File exists!'})
        with open(os.readlink(request.user.symlink)+request.POST['path']+'/'+request.POST['file_name'], 'w+') as stored_file:
            stored_file.write(request.FILES['content'].read().decode('utf-8'))
    return JsonResponse({'status': 'file uploaded'})

@api_view(['POST'])
def emptyFileUpload(request):
    """! Making Empty Files - view defined for enabling upload from textbox feature

        @param request.user.symlink         symbolic link to User Media Directory
        @param request.POST['path']         Path to file in backend, type: string
        @param request.POST['file_name']    Name of the file to be saved in backend, type: string

        @return JSON response depending on status of process
        @brief If a file of fetched name and path already exists, overwrite its content as empty, else create an empty file"""
    data = json.loads(request.body)
    try:
        os.makedirs(os.readlink(request.user.symlink)+data.get('path')+'/')
        with open(os.readlink(request.user.symlink)+data.get('path')+'/'+data.get('file_name'), 'w+') as stored_file:
            stored_file.write('')
    except:
        if not os.path.isfile(os.readlink(request.user.symlink)+data.get('path')+'/'+data.get('file_name')):
            with open(os.readlink(request.user.symlink)+data.get('path')+'/'+data.get('file_name'), 'w+') as stored_file:
                stored_file.write('')
        else:
            return JsonResponse({'status': 'File exists!'})
    return JsonResponse({'status': 'Empty file uploaded'})


@api_view(['POST'])
def makeFolder(request):
    """!
        View for making empty directories

        @param request User Details from Post Requests

        @return JSON Response of status of request
        @note If full path already exists, nothing is created"""
    fullPath = request.body.decode('utf-8') 
    try:
        os.makedirs(os.readlink(request.user.symlink)+fullPath+'/')
        return JsonResponse({"status":"done"})
    except:
        return JsonResponse({"status":"already exists!"})


@api_view(['POST'])
def edit_from_textbox(request):
    """!
        Feature To Update the File in backend by changing the content in the Frontend using the Code Editor
        
        @param request.user.symlink         symbolic link to User Media Directory
        @param request.POST['path']         Path to file in backend, type: string
        @param request.POST['file_name']    Name of the file in backend, type: string
        @param request.POST['content']      Updated File Content, type: string

        @return JsonResponse of success status"""
    data = json.loads(request.body)
    with open(os.readlink(request.user.symlink)+data.get('path')+'/'+data.get('name'), 'w+') as stored_file:
        stored_file.write(data.get('content'))
    return JsonResponse({"status":"Edit reflected in backend"})


@api_view(['POST'])
def delete(request):
    """!
        Feature to Delete the Files or Folders by clicking on them in the frontend
        
        @param request.user.symlink         symbolic link to User Media Directory
        @param request.POST['path']         Path to file in backend, type: string
        @param request.POST['old_name']    Name of the file to be deleted from backend, type: string

        @note Removes the directory recursively; all children directories also deleted

        @return Json Response of success status"""
    data = json.loads(request.body)
    name=data.get('old_name')
    path=data.get('path')
    a_path = os.readlink(request.user.symlink) + path + '/' + name
    if os.path.isdir(a_path):
        shutil.rmtree(a_path)
    else:
        os.remove(os.readlink(request.user.symlink) + path + '/' + name)
    return JsonResponse({"status":"done"})   


@api_view(['POST'])
def rename(request):

    """!
        Feature to Update the file name in the user code directory

        @param request.user.symlink         symbolic link to User Media Directory
        @param request.POST['path']         Path to file in backend, type: string
        @param request.POST['old_name']    Old Name of the file to be renamed from backend, type: string
        @param request.POST['new_name']    Updated Name of the file, type: string
        
        @return JsonResponse of status of request"""
    data = json.loads(request.body)
    if os.path.isfile((request.user.symlink)+data.get('path')+'/'+data.get('new_name')):
        return JsonResponse({'status': 'file with same name exists'})
    os.rename(os.readlink(request.user.symlink)+data.get('path')+'/'+data.get('old_name'), os.readlink(request.user.symlink)+data.get('path')+'/'+data.get('new_name'))
    return JsonResponse({"status":"done"})

@api_view(['GET'])
def view_function(request):
    """!
        Feature to get the file's information as a JSON response for a file clicked on frontend

        @param request.user.symlink         symbolic link to User Media Directory
        @param request.POST['path']         Path to file in backend, type: string
        @param request.POST['name']         Name of the file to be viewed, type: string

        @return JsonResponse of file content (string), file name, language, else only name for a folder"""
    if os.path.isfile(os.readlink(request.user.symlink)+request.GET.get('path')+'/'+request.GET.get('name')):
        with open(os.readlink(request.user.symlink)+request.GET['path']+'/'+request.GET['name']) as f:
            lines=[line for line in f]
        return JsonResponse({'lines':''.join(lines),'name': request.GET['name'], 'language': request.GET['name'].split('.')[-1]})
    else:
        return JsonResponse({'lines':'This is a folder!', 'name': request.GET['name'], 'language': ''})


@api_view(['POST'])
def exec_from_textbox(request):
    """!
        View Function for compiling the file displayed in frontend
        
        @param request.POST['path']         Path to file in backend, type: string
        @param request.POST['Filename']     Name of the file to be compiled from backend, type: string
        @param request    Language, Name, Path of the file which is to be compiled

        @return JSONResponse of the compiled output, or else runtime error

        @note Only C++,python and Java are the executable languages in this update"""
    if(request.method=='POST'):
        data = json.loads(request.body)
        filename=data.get('Filename')
        path=data.get("path")
        mode=0
        args=[]
        exe=""
        exename=''
        input=data.get('Input')
        language=data.get('Language')
        if language == "cpp" or language == "c":
            mode=2
            args=["g++", filename]
            exe="./a.out"
        elif language == "py": 
            mode=1
            args=['python3', filename]
        elif language == "java":
            mode=2
            args=['javac', filename]
            exe=['java', os.path.splitext(filename)[0]]
        if(mode==0):
            return JsonResponse({'out':"invalid language"})
        if(mode==1):
            result=subprocess.Popen(args, cwd= os.readlink(request.user.symlink)+path+'/',stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            ans = result.communicate(input=input.encode())[0].decode('utf-8').replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')
            return JsonResponse({'out': ans})
        if(mode==2):
            comp=subprocess.run(args, cwd= os.readlink(request.user.symlink)+path+'/', capture_output=True)
            if(comp.stderr):
                return JsonResponse({'status':'1', 'out':'compilation failed\n'+comp.stderr.decode('utf-8').replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')})
            result=subprocess.Popen(exe, cwd= os.readlink(request.user.symlink)+path+'/', stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            ans = result.communicate(input=input.encode())[0].decode('utf-8')
        return JsonResponse({"out": ans.replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')})

