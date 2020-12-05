import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { of as observableOf } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { TreeService } from '../tree.service';

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

  files =[{name: "danish", type: 'file', path: ''}];
  loaded=false;
  treeControl: FlatTreeControl<TreeNode>;
  treeFlattener: MatTreeFlattener<FileNode, TreeNode>;
  dataSource: MatTreeFlatDataSource<FileNode, TreeNode>;
  constructor(public treeService: TreeService) {
   
    console.log("time2", this.files);
  }
  getfile(name: string, path: string){
    console.log(name, path);
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

}
