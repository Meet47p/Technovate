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

// Extend the Query interface
interface Query {
  id: number;
  name: string;
  selectedTable?: string;
  columns?: string[];
  tableData?: any[];
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.gettabledata();
  }
  title = 'DynamicDahboard';

  // Overlays and flags (unchanged)
  showOverlay = false;
  showTableOverlay = false;
  showColumnOverlay = false;
  showAddColumnOverlay = false;
  showJoinTableOverlay = false;
  showAppendTableOverlay = false;
  showCustomOperationOverlay = false;
  showFilterRowsOverlay = false;
  showGroupSummarizeOverlay = false;

  Apidata = inject(ApiService);
  tables: any[] = [];
  selectedTable: string = '';

  columns: string[] = [];
  rightcolumns: string[] = [];
  tabledata: any[] = [];

  // ***** Query Management *****
  queries: Query[] = [];
  queryCount: number = 0;
  selectedQuery: Query | null = null;
  queryTitle: string = '';

  // (Other properties remain unchanged)
  filterColumns = [
    {
      name: 'Customer Name',
      type: 'string',
      values: ['Alice', 'Bob', 'Charlie'],
    },
    {
      name: 'Order Date',
      type: 'DateTime',
      values: ['2024-01-01', '2024-01-15', '2024-02-01'],
    },
    { name: 'Quantity', type: 'integer', values: [1, 2, 5, 10] },
    { name: 'Price', type: 'decimal', values: [10.99, 20.5, 100.75] },
  ];
  operations: any = {
    string: [
      'is',
      'is not',
      'contains',
      'does not contain',
      'starts with',
      'ends with',
      'is set',
      'is not set',
    ],
    DateTime: [
      'equals',
      'not equals',
      'greater than',
      'greater than or equals',
      'less than',
      'less than or equals',
      'between',
      'within',
    ],
    integer: [
      'equals',
      'not equals',
      'greater than',
      'greater than or equals',
      'less than',
      'less than or equals',
      'between',
    ],
    decimal: [
      'equals',
      'not equals',
      'greater than',
      'greater than or equals',
      'less than',
      'less than or equals',
      'between',
    ],
  };
  filters: any = [
    {
      column: '',
      operation: '',
      value: '',
      availableOperations: [],
      availableValues: [],
      condition: 'AND',
    },
  ];
  aggregateFunctions = [
    'Count of',
    'Sum of',
    'Average of',
    'Minimum of',
    'Maximum of',
    'Unique count of',
  ];
  groupings = [
    { groupByColumn: '', aggregateFunction: '', aggregateColumn: '' },
  ];

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
  dropDuplicates: string = 'No';
  customExpression: string = '';

  @ViewChild('overlay') overlay!: ElementRef;

  // API calls
  gettabledata() {
    this.Apidata.GetTableApi().subscribe((res: any) => (this.tables = res));
  }
  getcolumndata(table1: string) {
    this.Apidata.GetColumnApi(table1).subscribe((res: any) => {
      this.columns = res;
      this.selectedColumns = [];
    });
  }
  getrightcolumndata(table1: string) {
    this.Apidata.GetColumnApi(table1).subscribe(
      (res: any) => (this.rightcolumns = res)
    );
  }
  getdata() {
    this.Apidata.GetData(this.selectedTable).subscribe((res: any) => {
      this.tabledata = res;
    });
  }
  RightTable(Rtable: string) {
    this.getrightcolumndata(Rtable);
  }

  // Query Methods
  addQueries() {
    this.queryCount++;
    this.queries.push({
      id: this.queryCount,
      name: `Query ${this.queryCount}`,
    });
  }
  openQuery(query: Query) {
    this.selectedQuery = query;
    this.queryTitle = query.name;
  }
  updateSelectedQueryName() {
    if (this.selectedQuery) {
      this.selectedQuery.name = this.queryTitle;
    }
    // Clear the input after updating
    // this.queryTitle = '';
  }

  // Operations Methods (unchanged)
  toggleOverlay(event: Event) {
    this.showOverlay = !this.showOverlay;
    event.stopPropagation();
  }
  openTableOverlay() {
    this.showTableOverlay = true;
    this.showOverlay = false;
  }
  selectTable(table: string) {
    this.selectedTable = table;
    if (this.selectedQuery) {
      this.selectedQuery.selectedTable = table;
    }
    console.log('Selected Table:', this.selectedTable);
    this.getcolumndata(table);
    this.getdata();
    this.showTableOverlay = false;
  }
  closeTableOverlay() {
    this.showTableOverlay = false;
  }
  openColumnOverlay() {
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
  deleteQuery(queryId: number): void {
    this.queries = this.queries.filter((query) => query.id !== queryId);
    // Optional: Confirm deletion with the user
  }
  confirmAppendTable() {
    console.log('Selected Table to Append:', this.selectedTableToAppend);
    console.log('Drop Duplicates:', this.dropDuplicates);
    this.closeAppendTableOverlay();
  }
  closeAppendTableOverlay() {
    this.showAppendTableOverlay = false;
  }
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
  chartsCount: number = 0;
  dashboardCount: number = 0;
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
  // Filter Rows and Grouping methods remain unchanged.
  openFilterRowsOverlay() {
    this.showFilterRowsOverlay = true;
    this.showOverlay = false;
  }
  closeFilterRowsOverlay() {
    this.showFilterRowsOverlay = false;
  }
  addFilter() {
    this.filters.push({
      column: '',
      operation: '',
      value: '',
      availableOperations: [],
      availableValues: [],
      condition: 'AND',
    });
  }
  removeFilter(index: number) {
    this.filters.splice(index, 1);
  }
  updateOperations(index: number) {
    const selectedColumn = this.filterColumns.find(
      (col) => col.name === this.filters[index].column
    );
    if (selectedColumn) {
      this.filters[index].availableOperations =
        this.operations[selectedColumn.type] || [];
      this.filters[index].operation = '';
      this.filters[index].availableValues = selectedColumn.values;
    }
  }
  updateValues(index: number) {
    const selectedColumn = this.filterColumns.find(
      (col) => col.name === this.filters[index].column
    );
    if (selectedColumn) {
      this.filters[index].availableValues = selectedColumn.values;
    }
  }
  clearFilters() {
    this.filters = [
      {
        column: '',
        operation: '',
        value: '',
        availableOperations: [],
        availableValues: [],
        condition: 'AND',
      },
    ];
  }
  applyFilters() {
    console.log('Applied Filters:', this.filters);
    this.closeFilterRowsOverlay();
  }
  openGroupSummarizeOverlay() {
    this.showGroupSummarizeOverlay = true;
    this.showOverlay = false;
  }
  closeGroupSummarizeOverlay() {
    this.showGroupSummarizeOverlay = false;
  }
  addGrouping() {
    this.groupings.push({
      groupByColumn: '',
      aggregateFunction: '',
      aggregateColumn: '',
    });
  }
  removeGrouping(index: number) {
    this.groupings.splice(index, 1);
  }
  clearGroupings() {
    this.groupings = [
      { groupByColumn: '', aggregateFunction: '', aggregateColumn: '' },
    ];
  }
  applyGroupings() {
    console.log('Applied Groupings:', this.groupings);
    this.closeGroupSummarizeOverlay();
  }
}
