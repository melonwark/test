import type { DefineComponent, VNode } from 'vue';

export type TMenuItem = {
  title: string;
  icon?: string | { [key: string]: string };
  href: string;
  regExpForDetermineActivePoint: string | RegExp;
  child?: TMenuItem[];
  isActive?: (item: TMenuItem) => boolean;
  disabled?: boolean;
  class?: string;
  attributes?: { [key: string]: string };
  hidden?: boolean;
  hiddenOnCollapse?: boolean;
};

export type TMultiselectValue =
  | string
  | number
  | object
  | null
  | (string | number | object)[];

export type TInputCheckboxValue = number | boolean | string;
export type TInputHiddenValue = number | boolean | string | (string | number)[]

export type TMultiselect = DefineComponent & {
  search: string;
  isOpen: boolean;
  toggle: () => void;
  removeLastElement: () => void;
  $el: HTMLElement;
  $refs: {
    search: HTMLElement;
  };
};

export type TDirectiveData = {
  name: unknown;
  value?: unknown;
  modifiers?: Record<string, boolean>;
};

export type TTableColumn = {
  groupCollapsable: string | null | boolean;
  property: string;
  title?: string;
  direction: null | string | boolean;
  callTempRowsOnSort?: boolean;
  nonDraggable?: boolean;
  nonRemovable?: boolean;
  headerDataObject?: {
    [key: string]: string | boolean | Record<string, boolean>;
  };
  tooltip?: string;
  directivesData?: TDirectiveData[];
  visible?: boolean;
  hide?: boolean;
  order: number;
  groupable?: boolean;
  collapseIcon?: boolean;
  date?: string;
  till_date?: string;
  column?: TTableColumn;
  groups?: {
    [key: string]: string;
  };
  grouped: boolean;
};

export type TTableRow = {
  [key: string]:
    | string
    | number
    | TTableRow[]
    | null
    | boolean
    | Record<string, unknown>
    | undefined
  ;
  _children: TTableRow[];
  _meta: {
    index: number;
    loading: boolean;
    parent: number;
    visibleChildren: TTableRow[];
  };
  _parent?: TTableRow;
  _classes: { [p: string]: Record<string, string | boolean> },
  level: number;
  _showChildren?: boolean;
};


export type TTableSlotFunction<T = Record<string, unknown>> = (props?: T) => VNode | VNode[] | null;

export type EmitFn = <E extends string, P extends unknown[]>(event: E, ...args: P) => void;

export type TTableCssProcessor = {
  process: (
    rowIndex: number | null,
    columnIndex: number | null,
    row?: TTableRow,
    column?: TTableColumn,
  ) => Record<string, unknown>;
  processFixed: (
    classes: { [p: string]: Record<string, string | boolean> },
    columnIndex: number,
    row?: TTableRow,
    column?: TTableColumn
  ) => Record<string, unknown>;
  classes: Record<string, unknown>;
}
