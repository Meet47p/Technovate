import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from './Services/api.service';
import { HeaderComponent } from './components/header/header.component';

/** Model for each Query */
interface Query {
  id: number;
  name: string;
  selectedTable?: string; // Which table is chosen
  columns?: string[]; // Columns from that table
  tableData?: any[]; // Data from that table
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // Basic
  title = 'DynamicDahboard';

  // Overlays
  showOverlay = false;
  showTableOverlay = false;
  showColumnOverlay = false;
  showAddColumnOverlay = false;
  showJoinTableOverlay = false;
  showAppendTableOverlay = false;
  showCustomOperationOverlay = false;

  // Queries
  queries: Query[] = [];
  queryCount = 0;
  selectedQuery: Query | null = null; // The query that's currently "opened"

  // Input for renaming the query
  queryTitle: string = '';

  // Tables from API (for "Select Source")
  tables: string[] = [];
  rightcolumns: string[] = []; // For Join Table overlay

  // For "Choose Columns" overlay
  selectedColumns: string[] = [];

  // For "Add New Column" overlay
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

  // For "Join Table" overlay
  selectedJoinTable = '';
  selectedLeftColumn = '';
  selectedRightColumn = '';
  selectedJoinType = '';
  selectedJoinColumns: string[] = [];
  joinTypes = ['Inner Join', 'Left Join', 'Right Join', 'Full Join'];

  // For "Append Table"
  selectedTableToAppend: string = '';
  dropDuplicates: string = 'No';

  // For "Custom Operation"
  customExpression: string = '';

  // Charts & Dashboard counters
  chartsCount = 0;
  dashboardCount = 0;

  // Overlay reference
  @ViewChild('overlay') overlay!: ElementRef;

  // Injecting our API service
  Apidata = inject(ApiService);

  ngOnInit(): void {
    // Fetch available tables on init
    this.Apidata.GetTableApi().subscribe((res: any) => {
      this.tables = res;
    });
  }

  /*=======================================
   *            QUERIES LOGIC
   =======================================*/
  addQueries() {
    this.queryCount++;
    this.queries.push({
      id: this.queryCount,
      name: `Query ${this.queryCount}`,
    });
  }

  // Open (activate) a query
  openQuery(query: Query) {
    this.selectedQuery = query;
    // Populate the Query Title input
    this.queryTitle = query.name;
  }

  // Rename the opened query after pressing Enter
  updateSelectedQueryName() {
    if (this.selectedQuery) {
      this.selectedQuery.name = this.queryTitle;
    }
    // If you want to clear the input after renaming:
    this.queryTitle = '';
  }

  /*=======================================
   *           SELECT SOURCE
   *  (For the currently opened query)
   =======================================*/
  selectSourceTable(table: string) {
    if (!this.selectedQuery) {
      alert('Please open a query first.');
      return;
    }
    // Set the table on the current query
    this.selectedQuery.selectedTable = table;

    // Fetch columns
    this.Apidata.GetColumnApi(table).subscribe((res: any) => {
      this.selectedQuery!.columns = res;
    });

    // Fetch table data
    this.Apidata.GetData(table).subscribe((res: any) => {
      this.selectedQuery!.tableData = res;
    });

    // Close the overlay
    this.showTableOverlay = false;
  }

  /*=======================================
   *           ADD OPERATIONS
   =======================================*/
  // Show/hide the small "Add Operations" overlay
  toggleOverlay(event: Event) {
    if (!this.selectedQuery) {
      alert('Please open a query first.');
      return;
    }
    this.showOverlay = !this.showOverlay;
    event.stopPropagation();
  }

  // "Select Source" overlay
  openTableOverlay() {
    this.showTableOverlay = true;
    this.showOverlay = false;
  }

  closeTableOverlay() {
    this.showTableOverlay = false;
  }

  // "Choose Columns" overlay
  openColumnOverlay() {
    if (!this.selectedQuery?.columns) {
      alert('Please select a source table first.');
      return;
    }
    this.showColumnOverlay = true;
    this.showOverlay = false;
  }

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

  confirmColumnSelection() {
    console.log('Selected Columns:', this.selectedColumns);
    this.showColumnOverlay = false;
  }

  closeColumnOverlay() {
    this.showColumnOverlay = false;
  }

  // "Add New Column" overlay
  openAddColumnOverlay() {
    this.showAddColumnOverlay = true;
    this.showOverlay = false;
  }

  confirmAddColumn() {
    console.log('New Column Details:', {
      Expression: this.newColumnExpression,
      Name: this.newColumnName,
      Type: this.newColumnType,
    });
    this.showAddColumnOverlay = false;
  }

  closeAddColumnOverlay() {
    this.showAddColumnOverlay = false;
  }

  // "Join Table" overlay
  openJoinTableOverlay() {
    this.showJoinTableOverlay = true;
    this.showOverlay = false;
  }

  RightTable(tableName: string) {
    // Load columns for the chosen right table
    this.Apidata.GetColumnApi(tableName).subscribe((res: any) => {
      this.rightcolumns = res;
    });
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

  // "Append Table" overlay
  openAppendTableOverlay() {
    this.showAppendTableOverlay = true;
    this.showOverlay = false;
  }

  confirmAppendTable() {
    console.log('Selected Table to Append:', this.selectedTableToAppend);
    console.log('Drop Duplicates:', this.dropDuplicates);
    this.closeAppendTableOverlay();
  }

  closeAppendTableOverlay() {
    this.showAppendTableOverlay = false;
  }

  // "Custom Operation" overlay
  openCustomOperationOverlay() {
    this.showCustomOperationOverlay = true;
    this.showOverlay = false;
  }

  confirmCustomOperation() {
    console.log('Custom Expression:', this.customExpression);
    this.closeCustomOperationOverlay();
  }

  closeCustomOperationOverlay() {
    this.showCustomOperationOverlay = false;
  }

  // Close the small overlay if the user clicks outside
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

  /*=======================================
   *      CHARTS & DASHBOARD
   * (Direct DOM approach as in your code)
   =======================================*/
  addCharts() {
    this.chartsCount++;
    const newChartDiv = document.createElement('div');
    newChartDiv.textContent = `charts ${this.chartsCount}`;
    document.getElementById('chartsContainer')?.appendChild(newChartDiv);
  }

  addDashboard() {
    this.dashboardCount++;
    const newDashboardDiv = document.createElement('div');
    newDashboardDiv.textContent = `dashboard ${this.dashboardCount}`;
    document.getElementById('dashboardContainer')?.appendChild(newDashboardDiv);
  }
}
