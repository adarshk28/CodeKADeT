import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { of as observableOf } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { TreeService } from '../tree.service';
import { FileService } from '../file.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';


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
    console.log("send file "+name)
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
    })
  }

  showRightMenu = false;
  renameModal = false;

  showRight(name: string,path: string){
    console.log('Opening right enu')
    console.log(name)
    console.log(path)
    this.RenameForm.get('old_name').setValue(name);
    this.RenameForm.get('path').setValue(path);
    console.log('hey')
    console.log(this.showRightMenu)
    this.showRightMenu = !this.showRightMenu;
    console.log(this.showRightMenu)
  }

  file_delete(){
    
  }

}
