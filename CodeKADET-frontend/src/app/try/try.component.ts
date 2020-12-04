// import {CollectionViewer, SelectionChange, DataSource} from '@angular/cdk/collections';
// import {FlatTreeControl} from '@angular/cdk/tree';
// import {Component, Injectable} from '@angular/core';
// import {BehaviorSubject, merge, Observable} from 'rxjs';
// import {map} from 'rxjs/operators';
// import { FormControl, FormGroup } from '@angular/forms';

// /** Flat node with expandable and level information */
// export class DynamicFlatNode {
//   constructor(public item: string, public level = 1, public expandable = false,
//               public isLoading = false) {}
// }

// /**
//  * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
//  * the descendants data from the database.
//  */
// @Injectable({providedIn: 'root'})
// export class DynamicDatabase {
//   dataMap = new Map<string, string[]>([
//     ['Fruits', ['Apple', 'Orange', 'Banana']],
//     ['Vegetables', ['Tomato', 'Potato', 'Onion']],
//     ['Apple', ['Fuji', 'Macintosh']],
//     ['Onion', ['Yellow', 'White', 'Purple']]
//   ]);

//   rootLevelNodes: string[] = ['Fruits', 'Vegetables'];

//   /** Initial data from database */
//   initialData(): DynamicFlatNode[] {
//     return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
//   }

//   getChildren(node: string): string[] | undefined {
//     return this.dataMap.get(node);
//   }

//   isExpandable(node: string): boolean {
//     return this.dataMap.has(node);
//   }
// }
// /**
//  * File database, it can build a tree structured Json object from string.
//  * Each node in Json object represents a file or a directory. For a file, it has filename and type.
//  * For a directory, it has filename and children (a list of files or directories).
//  * The input will be a json object string, and the output is a list of `FileNode` with nested
//  * structure.
//  */
// export class DynamicDataSource implements DataSource<DynamicFlatNode> {

//   dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

//   get data(): DynamicFlatNode[] { return this.dataChange.value; }
//   set data(value: DynamicFlatNode[]) {
//     this._treeControl.dataNodes = value;
//     this.dataChange.next(value);
//   }

//   constructor(private _treeControl: FlatTreeControl<DynamicFlatNode>,
//               private _database: DynamicDatabase) {}

//   connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
//     this._treeControl.expansionModel.changed.subscribe(change => {
//       if ((change as SelectionChange<DynamicFlatNode>).added ||
//         (change as SelectionChange<DynamicFlatNode>).removed) {
//         this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
//       }
//     });

//     return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
//   }

//   disconnect(collectionViewer: CollectionViewer): void {}

//   /** Handle expand/collapse behaviors */
//   handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
//     if (change.added) {
//       change.added.forEach(node => this.toggleNode(node, true));
//     }
//     if (change.removed) {
//       change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
//     }
//   }

//   /**
//    * Toggle the node, remove from display list
//    */
//   toggleNode(node: DynamicFlatNode, expand: boolean) {
//     const children = this._database.getChildren(node.item);
//     const index = this.data.indexOf(node);
//     if (!children || index < 0) { // If no children, or cannot find the node, no op
//       return;
//     }

//     node.isLoading = true;

//     setTimeout(() => {
//       if (expand) {
//         const nodes = children.map(name =>
//           new DynamicFlatNode(name, node.level + 1, this._database.isExpandable(name)));
//         this.data.splice(index + 1, 0, ...nodes);
//       } else {
//         let count = 0;
//         for (let i = index + 1; i < this.data.length
//           && this.data[i].level > node.level; i++, count++) {}
//         this.data.splice(index + 1, count);
//       }

//       // notify the change
//       this.dataChange.next(this.data);
//       node.isLoading = false;
//     }, 1000);
//   }
// }

// /**
//  * @title Tree with dynamic data
//  */
// @Component({
//   selector: 'try-component',
//   templateUrl: 'try.component.html',
//   styleUrls: ['try.component.scss']
// })
// export class TryComponent {
//   constructor(database: DynamicDatabase) {
//     this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
//     this.dataSource = new DynamicDataSource(this.treeControl, database);

//     this.dataSource.data = database.initialData();
//   }
//   Form= new FormGroup({
//     filename: new FormControl('')
//   });
  
//   selector(value: any){
//     this.Form.get('filename').setValue(value);
   
//   }
//   fname: any;
//   dname: any;
//   addItems() {
//     this.fname = prompt("Enter new file name");
//     this.dname  = prompt("Enter new directory name");
//   }

//   treeControl: FlatTreeControl<DynamicFlatNode>;

//   dataSource: DynamicDataSource;

//   getLevel = (node: DynamicFlatNode) => node.level;

//   isExpandable = (node: DynamicFlatNode) => node.expandable;

//   hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;
// }
import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, Injectable} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

/**
 * Json node data with nested structure. Each node has a filename and a value or a list of children
 */
export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
}

/**
 * The Json tree data in string. The data could be parsed into Json object
 */
const TREE_DATA = JSON.stringify({
  Applications: {
    Calendar: 'app',
    Chrome: 'app',
    Webstorm: 'app'
  },
  Documents: {
    angular: {
      src: {
        compiler: 'ts',
        core: 'ts'
      }
    },
    material2: {
      src: {
        button: 'ts',
        checkbox: 'ts',
        input: 'ts'
      }
    }
  },
  Downloads: {
    October: 'pdf',
    November: 'pdf',
    Tutorial: 'html'
  },
  Pictures: {
    'Photo Booth Library': {
      Contents: 'dir',
      Pictures: 'dir'
    },
    Sun: 'png',
    Woods: 'jpg'
  }
});

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Parse the string to json object.
    const dataObject = JSON.parse(TREE_DATA);

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(dataObject, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: object, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FileNode();
      node.filename = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.type = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}

@Component({
  selector: 'try-component',
  templateUrl: 'try.component.html',
  styleUrls: ['try.component.scss'],
  providers: [FileDatabase]
})
export class TryComponent  {
  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;

  constructor(database: FileDatabase) {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    database.dataChange.subscribe(data => this.nestedDataSource.data = data);
  }

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

  private _getChildren = (node: FileNode) => node.children;
}
