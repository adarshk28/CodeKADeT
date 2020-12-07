import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { of as observableOf } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { TreeService } from '../tree.service';
import { FileService } from '../file.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatDivider } from '@angular/material/divider'


export interface FileNode {
  name: string;
  type: string;
  path: string;
  children?: FileNode[];
}

export interface TreeNode {
  name: string;
  type: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'try-component',
  templateUrl: './try.component.html',
  styleUrls: [ './try.component.scss' ],
  providers: [TreeService]
})
export class TryComponent implements OnInit{

  showRightMenu: boolean;
  renameModal: boolean;
  RenameForm = new FormGroup({
    old_name: new FormControl(''),
    new_name: new FormControl(''),
    path: new FormControl(''),
  })
  
  @Output() newItemEvent = new EventEmitter<any>();

  sendFilename(name: string, path: string) {
    console.log(name)
    console.log(path)
    this.newItemEvent.emit({"name":name,"path":path});
  }

  files =[{name: "danish", type: 'file', path: ''}];
  loaded=false;
  treeControl: FlatTreeControl<TreeNode>;
  treeFlattener: MatTreeFlattener<FileNode, TreeNode>;
  dataSource: MatTreeFlatDataSource<FileNode, TreeNode>;
  constructor(public treeService: TreeService, public fileService: FileService) {  
    console.log("time2", this.files);
  }
  
  ngOnInit(){
    this.getTree();
  }

  getTree() {
    console.log("At getting tree function");
    this.treeService.getRequest().subscribe(result=>{
      this.files=result.children;
      this.loaded=true;
      console.log(this.files);
      console.log("time1", this.files);
      this.treeFlattener = new MatTreeFlattener(
        this.transformer,
        this.getLevel,
        this.isExpandable,
        this.getChildren);
      this.treeControl = new FlatTreeControl<TreeNode>(this.getLevel, this.isExpandable);
      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      this.dataSource.data = this.files;
	console.log(this.dataSource.data);
    })
  }
  /** Transform the data to something the tree can read. */
  transformer(node: FileNode, level: number) {
    return {
      name: node.name,
      type: node.type,
      level: level,
      path: node.path,
      expandable: !!node.children
    };
  }

 /** Get the level of the node */
  getLevel(node: TreeNode) {
    return node.level;
  }

  /** Return whether the node is expanded or not. */
  isExpandable(node: TreeNode) {
    return node.expandable;
  };

  /** Get the children for the node. */
  getChildren(node: FileNode) {
    return observableOf(node.children);
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: TreeNode){
    return node.expandable;
  }

  rename_modal(){
    this.renameModal = !this.renameModal;
  }

  file_rename(){
    console.log("file-renam start ")
    console.log("before rename service ")
    console.log(this.RenameForm.get('new_name').value)
    this.fileService.renameFile(this.RenameForm.value).subscribe(result => {
      console.log(result);
      this.renameModal = !this.renameModal;
      this.showRightMenu = !this.showRightMenu;
  this.getTree();

    })
  }

  showRightMenu = false;
  renameModal = false;
  isFolder = false;
  showRight(name: string,path: string, type: string){
    console.log('Opening right enu')
    console.log(name)
    console.log(path)
    console.log(type)
    this.RenameForm.get('old_name').setValue(name);
    this.RenameForm.get('path').setValue(path);
    console.log('hey')
    console.log(this.showRightMenu)
    this.showRightMenu = !this.showRightMenu;
    if(type=="folder"){
      this.isFolder = true;
    }
    else{
      this.isFolder = false;
    }
    console.log(this.showRightMenu)
  }

  @Output() deleteEvent = new EventEmitter<any>();

  file_delete(){
    this.deleteEvent.emit(this.RenameForm.get('old_name').value);
    console.log("deleting file: "+this.RenameForm.get('old_name').value+" from "+this.RenameForm.get('path').value)
    this.fileService.deleteFile(this.RenameForm.value).subscribe(result => {
      console.log(result)
      this.showRightMenu = !this.showRightMenu
      this.getTree()
    })
  }

  @Output() uploadFileEvent = new EventEmitter<any>();

  add_file(){
    this.uploadFileEvent.emit({"name": this.RenameForm.get('old_name').value, "path": this.RenameForm.get('path').value});
    console.log(this.RenameForm.get('path').value);
    console.log(this.RenameForm.get('old_name').value);
  }

  @Output() uploadFolderEvent = new EventEmitter<any>();

  add_folder(){
    this.uploadFolderEvent.emit({"name": this.RenameForm.get('old_name').value, "path": this.RenameForm.get('path').value});
    console.log(this.RenameForm.get('path').value);
    console.log(this.RenameForm.get('old_name').value);
  }
  
}
