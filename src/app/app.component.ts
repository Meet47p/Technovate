import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from './Services/api.service';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.gettabledata();
    // this.getcolumndata();
  }
  title = 'DynamicDahboard';
  showOverlay = false;
  showTableOverlay = false;
  showColumnOverlay = false;
  showAddColumnOverlay = false;
  showJoinTableOverlay = false;
  showAppendTableOverlay = false;
  showCustomOperationOverlay = false;

  Apidata = inject(ApiService);
  tables = []; //stores table Api data.
  selectedTable: string = '';

  columns = []; // stores Column Api data.
  rightcolumns = [];

  gettabledata() {
    // debugger;
    this.Apidata.GetTableApi().subscribe((res: any) => (this.tables = res));
  }

  getcolumndata(table1: string) {
    // debugger;
    this.Apidata.GetColumnApi(table1).subscribe(
      (res: any) => (this.columns = res)
    );
  }
  getrightcolumndata(table1: string) {
    // debugger;
    this.Apidata.GetColumnApi(table1).subscribe(
      (res: any) => (this.rightcolumns = res)
    );
  }

  RightTable(Rtable: string) {
    // debugger;
    // const selectedvalue=(Rtable.target as HTMLSelectElement).value;
    this.getrightcolumndata(Rtable);
  }

  selectedColumns: string[] = [];

  newColumnExpression = '';
  newColumnName = '';
  newColumnType = '';
  columnTypes = [
    'String',
    'Text',
    'Integer',
    'Decimal',
    'Date',
    'Time',
    'Datetime',
  ];

  selectedJoinTable = '';
  selectedLeftColumn = '';
  selectedRightColumn = '';
  selectedJoinType = '';
  selectedJoinColumns: string[] = [];
  joinTypes = ['Inner Join', 'Left Join', 'Right Join', 'Full Join'];

  selectedTableToAppend: string = '';
  dropDuplicates: string = 'No'; // Default to "No"

  customExpression: string = ''; // Store the custom expression

  @ViewChild('overlay') overlay!: ElementRef;

  //On add operations button it is implemented just to show or not show the small overlay.
  toggleOverlay(event: Event) {
    this.showOverlay = !this.showOverlay;
    event.stopPropagation();
  }

  //On clicking on 'Select Source' this gets triggered to show the tables and hide the previous small overlay.
  openTableOverlay() {
    this.showTableOverlay = true;
    this.showOverlay = false; // Close left overlay
    // this.gettabledata();
  }

  //When tables get displayed and then when we select any of table that time it gets triggered.
  //It console logs the selected table and and also hides away the table overlay.
  selectTable(table: string) {
    this.selectedTable = table;
    console.log('Selected Table:', this.selectedTable);
    this.getcolumndata(table);
    this.showTableOverlay = false; // Close overlay after selection
  }

  //Close button in table overlay triggers this func and on clicking it hides the table overlay.
  closeTableOverlay() {
    this.showTableOverlay = false;
  }

  //On clicking on 'Choose Columns' this gets triggered to show the Columns and hide the previous small overlay.
  openColumnOverlay() {
    this.showColumnOverlay = true;
    this.showOverlay = false;
  }

  //When the columns are displayed at checkboxes, at that time when u select them or unselect them this func gets triggered.
  //It first checks whether it is checkwd or not than if checked than adds that column into the selectedColumn array and
  // if it gets unchecked than that column is removed from the selectedcolumn array.
  toggleColumnSelection(column: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.selectedColumns.includes(column)) {
        this.selectedColumns.push(column);
      }
    } else {
      this.selectedColumns = this.selectedColumns.filter(
        (col) => col !== column
      );
    }
  }

  //It is triggered on clicking of confirm button in column overlay and it console logs the selected column and hides the column overlay.
  confirmColumnSelection() {
    console.log('Selected Columns:', this.selectedColumns);
    this.showColumnOverlay = false;
  }

  //It is triggered on clciking of close button in column overlay, hides the column overlay.
  closeColumnOverlay() {
    this.showColumnOverlay = false;
  }

  //On clicking on 'Add New Column' this gets triggered to show the 'add column' overlay and hide the previous small overlay.
  openAddColumnOverlay() {
    this.showAddColumnOverlay = true;
    this.showOverlay = false;
  }

  //It gets triggered when confirm button in 'add new column' overlay is pressed. it console.logs the info and hides the overlay.
  confirmAddColumn() {
    console.log('New Column Details:', {
      Expression: this.newColumnExpression,
      Name: this.newColumnName,
      Type: this.newColumnType,
    });
    this.showAddColumnOverlay = false;
  }

  //It gets triggered when close button in 'add new column' ovewrlay is pressed and it hides the overlay.
  closeAddColumnOverlay() {
    this.showAddColumnOverlay = false;
  }

  openJoinTableOverlay() {
    this.showJoinTableOverlay = true;
    this.showOverlay = false;
  }

  confirmJoinTable() {
    console.log('Join Table Details:', {
      JoinTable: this.selectedJoinTable,
      LeftColumn: this.selectedLeftColumn,
      RightColumn: this.selectedRightColumn,
      JoinType: this.selectedJoinType,
      SelectedColumns: this.selectedJoinColumns,
    });
    this.showJoinTableOverlay = false;
  }

  closeJoinTableOverlay() {
    this.showJoinTableOverlay = false;
  }

  openAppendTableOverlay() {
    this.showAppendTableOverlay = true;
    this.showOverlay = false;
  }

  // Confirm and log the chosen options for append table
  confirmAppendTable() {
    console.log('Selected Table to Append:', this.selectedTableToAppend);
    console.log('Drop Duplicates:', this.dropDuplicates);
    this.closeAppendTableOverlay(); // Close overlay after confirming
  }

  // Close the overlay
  closeAppendTableOverlay() {
    this.showAppendTableOverlay = false;
  }

  openCustomOperationOverlay() {
    this.showCustomOperationOverlay = true;
    this.showOverlay = false;
  }

  // Confirm and log the custom expression
  confirmCustomOperation() {
    console.log('Custom Expression:', this.customExpression);
    this.closeCustomOperationOverlay(); // Close overlay after confirming
  }

  // Close the overlay without saving
  closeCustomOperationOverlay() {
    this.showCustomOperationOverlay = false;
  }

  // Close overlay when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (
      this.overlay &&
      this.showOverlay &&
      !this.overlay.nativeElement.contains(event.target)
    ) {
      this.showOverlay = false;
    }
  }

  queryCount: number = 0; // Counter to track the number of tables
  chartsCount: number = 0;
  dashboardCount: number = 0;

  addQueries() {
    this.queryCount++; // Increment counter
    // Create a new div for the table name
    const newTableDiv = document.createElement('div');
    newTableDiv.textContent = `Queries ${this.queryCount}`;
    // newTableDiv.style.marginTop = "5px"; // Add some spacing
    // Append the new table label to the container
    document.getElementById('queryContainer')?.appendChild(newTableDiv);
  }
  addCharts() {
    this.chartsCount++; // Increment counter
    // Create a new div for the table name
    const newTableDiv = document.createElement('div');
    newTableDiv.textContent = `charts ${this.chartsCount}`;
    // Append the new table label to the container
    document.getElementById('chartsContainer')?.appendChild(newTableDiv);
  }
  addDashboard() {
    this.dashboardCount++; // Increment counter
    // Create a new div for the table name
    const newTableDiv = document.createElement('div');
    newTableDiv.textContent = `dashboard ${this.dashboardCount}`;

    // Append the new table label to the container
    document.getElementById('dashboardContainer')?.appendChild(newTableDiv);
  }
}
