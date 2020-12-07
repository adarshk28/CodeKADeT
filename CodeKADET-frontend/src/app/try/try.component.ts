import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { of as observableOf } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { TreeService } from '../tree.service';
import { FileService } from '../file.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

/**
 * Interface for the node for a file/folder in the file tree obtained from the nested JSON object passed from the backend
 */
export interface FileNode {
  name: string;
  type: string;
  path: string;
  children?: FileNode[];
}

/**
 * Interface for a node in the tree for the display in the frontend
 */
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

  /**
   * The menu for options is opened if true, closed if false
   */
  showRightMenu: boolean = false;

  /**
   * The modal for renaming the file is opened if true, closed if false
   */
  renameModal: boolean = false;

  /**
   * True if the chosen element is a folder, else false
   */
  isFolder = false;
  /**
   * A form which contains the data needed to rename the currently selected file/folder, namely the path, the old name and the new name. Also used as a general-purpose form to store chosen elements' data, and for deleting the chosen elements as well
   */
  RenameForm = new FormGroup({
    old_name: new FormControl(''),
    new_name: new FormControl(''),
    path: new FormControl(''),
  })
  
  /**
   * An EventEmitter which is bound to getFile() in workspace.component.ts
   */
  @Output() newItemEvent = new EventEmitter<any>();

  /**
   * 
   * @param name The name of the chosen file/folder
   * @param path The path of the chosen file/folder
   * @param tp The type of the element, i.e., if it is a file or folder
   * 
   * Checks if the input element is a file, and then emits an event to call getFile from workspace.component.ts
   */
  sendFilename(name: string, path: string, tp: string) {
    if (tp=='file') this.newItemEvent.emit({"name":name,"path":path});
  }

  // files =[{name: "danish", type: 'file', path: ''}];
  /**
   * A nested JSON object containing the tree structure passed from the backend
   */
  files =[];

  /**
   * A variable to check if the tree has been loaded or not
   */
  loaded=false;

  /**
   * Controls the expanded/collapsed states of the nodes in the file tree
   */
  treeControl: FlatTreeControl<TreeNode>;

  /**
   * Adds the information about the children and the level of the node
   */
  treeFlattener: MatTreeFlattener<FileNode, TreeNode>;

  /**
   * The data source for the file tree
   */
  dataSource: MatTreeFlatDataSource<FileNode, TreeNode>;

  /**
   * 
   * @param treeService To use the method to get the tree from backend
   * @param fileService To use the methods in file_upload in backend
   */
  constructor(public treeService: TreeService, public fileService: FileService) {  
  }
  
  /**
   * Gets the file tree when the component is initialized
   */
  ngOnInit(){
    this.getTree();
  }

  /** 
   * Gets the file tree from the backend as a nested JSON object using treeService and stores it in the  tree format needed for display
  */
  getTree() {
    this.treeService.getRequest().subscribe(result=>{
      this.files=result.children;
      this.loaded=true;
      this.treeFlattener = new MatTreeFlattener(
        this.transformer,
        this.getLevel,
        this.isExpandable,
        this.getChildren);
      this.treeControl = new FlatTreeControl<TreeNode>(this.getLevel, this.isExpandable);
      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      this.dataSource.data = this.files;
    });
  }

  /** 
   * Transform the data from the JSON object to something the frontend file tree can read. 
   */
  transformer(node: FileNode, level: number) {
    return {
      name: node.name,
      type: node.type,
      level: level,
      path: node.path,
      expandable: !!node.children
    };
  }

 /** 
  * Get the level of the node 
  */
  getLevel(node: TreeNode) {
    return node.level;
  }

  /** 
   * Return whether the node is expanded or not. 
   */
  isExpandable(node: TreeNode) {
    return node.expandable;
  };

  /** 
   * Get the children for the node. 
   */
  getChildren(node: FileNode) {
    return observableOf(node.children);
  }

  /** 
   * Get whether the node has children or not. 
   */
  hasChild(index: number, node: TreeNode){
    return node.expandable;
  }

  /**
   * Toggles whether the renaming modal is displayed or not
   */
  rename_modal(){
    this.renameModal = !this.renameModal;
  }

  /**
   * An emitter to close the menu which appears at the right for the node. Emits to closeModals() in workspace.component.ts
   */
  @Output() rightClose = new EventEmitter<any>(); 

  /**
   * Closes the right menu
   */
  closeRight(){
    this.rightClose.emit();
    this.showRightMenu = false;
    this.renameModal = false;
  }

  /**
   * Renames the file/folder chosen, and uses fileService to change the name of the file in the backend
   */
  file_rename(){
    if (confirm("Are you sure you want to RENAME "+this.RenameForm.get('old_name').value+" to "+this.RenameForm.get('new_name').value+'?')) {
	    this.fileService.renameFile(this.RenameForm.value).subscribe(result => {
	      this.renameModal = !this.renameModal;
	      this.showRightMenu = !this.showRightMenu;
	      this.getTree();
	    });
    }
  }

  /**
   * 
   * @param name The name of the chosen element
   * @param path The path of the chosen element
   * @param type The type of the chosen element, i.e., if it is a file or folder
   * 
   * Sets the name and path of the chosen file in RenameForm
   */
  showRight(name: string,path: string, type: string){
    this.RenameForm.get('old_name').setValue(name);
    this.RenameForm.get('path').setValue(path);
    this.showRightMenu = !this.showRightMenu;
    if(type=="folder"){
      this.isFolder = true;
    }
    else{
      this.isFolder = false;
    }
  }

  /**
   * Emits an event when the chosen file is deleted. Ouput is directed to deleteText() in workspace.component.ts
   */
  @Output() deleteEvent = new EventEmitter<any>();

  /**
   * Deletes the file from the backend using fileService. The change is reflected in the file tree.
   */
  file_delete(){
      if (confirm("Are you sure you want to PERMANENTLY DELETE "+this.RenameForm.get('old_name').value + '?')) {
    this.deleteEvent.emit({"name":this.RenameForm.get('old_name').value,"path":this.RenameForm.get('path').value});
    this.fileService.deleteFile(this.RenameForm.value).subscribe(result => {
      this.showRightMenu = !this.showRightMenu
      this.getTree()
    })
      }
  }

  /**
   * Emits an event when a file is to be uploaded. Output is directed to modalview in workspace.component.ts
   */
  @Output() uploadFileEvent = new EventEmitter<any>();

  /**
   * Emits the event when called to add the file
   */
  add_file(){
    this.uploadFileEvent.emit({"name": this.RenameForm.get('old_name').value, "path": this.RenameForm.get('path').value});
  }

  /**
   * Emits an event when a folder is to be created. Ouput is directed to folderModalview() in workspace.component.ts
   */
  @Output() uploadFolderEvent = new EventEmitter<any>();

  /**
   * Emits the event when called to add the folder
   */
  add_folder(){
    this.uploadFolderEvent.emit({"name": this.RenameForm.get('old_name').value, "path": this.RenameForm.get('path').value});
  }
}
