import {
    Content,
    Header,
    HeaderContainer,
    HeaderMenuButton,
    HeaderName,
    HeaderNavigation,
    HeaderMenu,
    HeaderMenuItem,
    HeaderGlobalBar,
    HeaderGlobalAction,
    HeaderPanel,
    HeaderSideNavItems,
    SkipToContent,
    SideNav,
    SideNavDivider,
    SideNavItems,
    SideNavLink,
    SideNavMenu,
    SideNavMenuItem,
    Switcher,
    SwitcherItem,
    SwitcherDivider,
    ExpandableSearch
  } from "@carbon/react"
  import {
    Search,
    Notification,
    Fade,
    Switcher as SwitcherIcon,
  } from '@carbon/react/icons';

  function action (v){
    return () => alert(v)
  }
  export default function Test() {
    return (
        <HeaderContainer
    render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label="IBM Platform Name">
        <HeaderName href="#" prefix="IBM">
          [Platform]
        </HeaderName>
        <HeaderGlobalBar>
          <HeaderGlobalAction aria-label="Search" >
            <ExpandableSearch/>
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="Notifications"
            onClick={action('notification click')}>
            <Notification size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="App Switcher"
            onClick={action('app-switcher click')}
            tooltipAlignment="end">
            <SwitcherIcon size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
    )}
  />
    )
  }





// import {
//     useDatagrid,
//     Datagrid,
//     useSelectRows,
//     useActionsColumn,
//     useStickyColumn,
//     pkg,
// } from "@carbon/ibm-products";
// import { useEffect } from "react";
// import { useMemo, useState } from "react";
// import { Pagination } from "carbon-components-react";
// import {
//     Button,
//     TableBatchAction,
//     TableBatchActions,
//     TableToolbarContent,
//     TableToolbarSearch,
// } from "@carbon/react";
// import { Restart16, Activity16 } from "@carbon/icons-react";
// import { Add16 } from "@carbon/icons-react";
// pkg.component.Datagrid = true;

// export default function Test() {
//     const [data, setData] = useState([]);
//     const columns = useMemo(() => getColumns(data), [data]);

//     const [isFetching, setIsFetching] = useState(false);
//     const fetchData = () =>
//         new Promise((resolve) => {
//             setIsFetching(true);
//             setTimeout(() => {
//                 setData(data.concat(dummyData));
//                 resolve();
//             }, 1000);
//         }).then(() => setIsFetching(false));

//     useEffect(() => {
//         fetchData();
//     }, []);
//     const emptyStateTitle = "Empty state title";
//     const emptyStateDescription =
//         "Description explaining why the table is empty";
//     const onActionClick = (actionId, row, event) =>
//         console.log(actionId, row, event);
//     const datagridState = useDatagrid(
//         {
//             columns,
//             data,
//             isFetching,
//             emptyStateTitle,
//             emptyStateDescription,
//             initialState: {
//                 pageSize: 10,
//                 pageSizes: [5, 10, 25, 50],
//             },
//             rowActions: [
//                 {
//                     id: "edit",
//                     itemText: "Edit",
//                     onClick: onActionClick,
//                 },
//                 {
//                     id: "hidden",
//                     itemText: "Hidden item",
//                     onClick: onActionClick,
//                     shouldHideMenuItem: () => true,
//                 },
//                 {
//                     id: "delete",
//                     itemText: "Delete",
//                     hasDivider: true,
//                     isDelete: true,
//                     onClick: onActionClick,
//                 },
//             ],
//             // onRowSelect: (row, event) => console.log(row, event),
//             DatagridPagination,
//             DatagridActions: DatagridActions(fetchData),
//             DatagridBatchActions,
//             batchActions: true,
//             toolbarBatchActions: getBatchActions(),
//         },
//         useStickyColumn,
//         useActionsColumn,
//         useSelectRows
//     );
//     return <Datagrid datagridState={datagridState} />;
// }

// function DatagridActions(fetchData) {
//     return () => (
//         <TableToolbarContent>
//             <TableToolbarSearch
//                 size="xl"
//                 id="columnSearch"
//                 persistent
//                 placeHolderText={"Search here"}
//                 onChange={(e) => console.log(e)}
//             />
//             <Button
//                 kind="ghost"
//                 hasIconOnly
//                 tooltipPosition="bottom"
//                 renderIcon={Restart16}
//                 iconDescription={"Refresh"}
//                 onClick={(...args) => fetchData()}
//             />
//             <Button
//                 onClick={(...args) => console.log(args)}
//                 size="sm"
//                 kind="primary"
//                 style={{ cursor: "pointer" }}
//             >
//                 Add new user
//             </Button>
//         </TableToolbarContent>
//     );
// }

// const DatagridBatchActions = (datagridState) => {
//     const { selectedFlatRows, toggleAllRowsSelected } = datagridState;
//     const totalSelected = selectedFlatRows && selectedFlatRows.length;
//     const onBatchAction = () => alert("Batch action");
//     const actionName = "Action";

//     return (
//         <TableBatchActions
//             shouldShowBatchActions={totalSelected > 0}
//             totalSelected={totalSelected}
//             onCancel={() => toggleAllRowsSelected(false)}
//         >
//             <TableBatchAction renderIcon={Activity16} onClick={onBatchAction}>
//                 {actionName}
//             </TableBatchAction>
//         </TableBatchActions>
//     );
// };

// const dummyData = Array(20).fill({
//     firstName: "Ritik",
//     lastName: "Rishu",
//     age: "Don't ask",
//     about: "I can not write awesome enough times",
// });

// const getColumns = (rows) => {
//     return [
//         {
//             Header: "Row Index",
//             accessor: (row, i) => i,
//             id: "rowIndex",
//             width: getAutoSizedColumnWidth(rows, "rowIndex", "Row Index"),
//         },
//         {
//             Header: "First Name",
//             accessor: "firstName",
//         },
//         {
//             Header: "Last Name",
//             accessor: "lastName",
//             width: getAutoSizedColumnWidth(rows, "lastName", "Last name"),
//         },
//         {
//             Header: "Age",
//             accessor: "age",
//             width: getAutoSizedColumnWidth(rows, "age", "Age"),
//         },
//         {
//             Header: "About",
//             accessor: "about",
//             width: getAutoSizedColumnWidth(rows, "about", "About"),
//         },
//         {
//             Header: "",
//             accessor: "actions",
//             isAction: true,
//             sticky: "right",
//         },
//     ];
// };

// export const getAutoSizedColumnWidth = (rows, accessor, headerText) => {
//     const maxWidth = 400;
//     const minWidth = 58;
//     const letterSpacing = 10;
//     const cellLength = Math.max(
//         ...rows.map((row) => (`${row[accessor]}` || "").length),
//         headerText.length
//     );
//     if (cellLength <= 3) {
//         return minWidth;
//     }
//     return Math.min(maxWidth, cellLength * letterSpacing + 16);
// };

// export const DatagridPagination = ({ state, setPageSize, gotoPage, rows }) => {
//     const updatePagination = ({ page, pageSize }) => {
//         console.log(state);
//         setPageSize(pageSize);
//         gotoPage(page - 1); // Carbon is non-zero-based
//     };

//     return (
//         <Pagination
//             page={state.pageIndex + 1} // react-table is zero-based
//             pageSize={state.pageSize}
//             pageSizes={state.pageSizes || [10, 20, 30, 40, 50]}
//             totalItems={rows.length}
//             onChange={updatePagination}
//         />
//     );
// };

// const getBatchActions = () => {
//     return [
//         {
//             label: "Delete",
//             renderIcon: Add16,
//             onClick: () => action("Clicked batch action button"),
//             hasDivider: true,
//             kind: "danger",
//         },
//     ];
// };

// const action = (test) => console.log(test);
