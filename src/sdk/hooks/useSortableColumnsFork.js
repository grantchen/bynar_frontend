import { themes } from "@carbon/themes";
import cx from "classnames";
import { ArrowUp, ArrowDown, ArrowsVertical } from "@carbon/react/icons";
import { pkg } from "@carbon/ibm-products";
import { Button } from "@carbon/react";
import "./SortableColumns.scss";

const blockClass = `${pkg.prefix}--datagrid`;
const carbon = {
    get themes() {
        return themes;
    },
    prefix: "cds",
};

export const SORTABLE_ORDERING = {
    ASC: "ASC",
    DESC: "DESC",
    NONE: "NONE",
};
export const useSortableColumnsFork = (hooks) => {
    const sortableVisibleColumns = (visibleColumns, { instance }) => {
        const { onSort } = instance;
        const onSortClick = (column) => {
            const key = column.id;
            const sortDesc = column.isSortedDesc;
            const { newSortDesc, newOrder } = getNewSortOrder(sortDesc);
            if (onSort) {
                onSort(key, newOrder);
            }
            instance.toggleSortBy(key, newSortDesc, false);
        };
        const sortableColumns = visibleColumns.map((column) => {
            const icon = (col, props) => {
                if (col?.isSorted) {
                    switch (col.isSortedDesc) {
                        case false:
                            return (
                                <ArrowUp
                                    size={16}
                                    {...props}
                                    className={`${blockClass}__sortable-icon ${carbon.prefix}--btn__icon`}
                                />
                            );
                        case true:
                            return (
                                <ArrowDown
                                    size={16}
                                    {...props}
                                    className={`${blockClass}__sortable-icon ${carbon.prefix}--btn__icon`}
                                />
                            );
                        default:
                            return (
                                <ArrowsVertical
                                    size={16}
                                    {...props}
                                    className={`${blockClass}__sortable-icon ${carbon.prefix}--btn__icon`}
                                />
                            );
                    }
                }
                return (
                    <ArrowsVertical
                        size={16}
                        {...props}
                        className={`${blockClass}__sortable-icon ${carbon.prefix}--btn__icon`}
                    />
                );
            };
            const Header = (headerProp, ...args) => {
                return column.disableSortBy === true ||
                    column.id === "datagridSelection" ? (
                    typeof column.Header === "function" ? (
                        column.Header(headerProp, ...args)
                    ) : (
                        column.Header
                    )
                ) : (
                    <Button
                        onClick={() => onSortClick(headerProp?.column)}
                        kind="ghost"
                        renderIcon={(props) => icon(headerProp?.column, props)}
                        className={cx(
                            `${carbon.prefix}--table-sort ${blockClass}--table-sort`,
                            "disable-focus",
                            "header-sort-btn",
                            {
                                [`${blockClass}--table-sort--desc`]:
                                    headerProp?.column.isSortedDesc,
                                [`${blockClass}--table-sort--asc`]:
                                    headerProp?.column.isSortedDesc === false,
                            }
                        )}
                    >
                        {column.Header}
                    </Button>
                );
            };
            return {
                ...column,
                Header,
                minWidth:
                    column.disableSortBy === true
                        ? column.width
                        : column.width + /*sort button width*/ 24,
            };
        });
        return instance.customizeColumnsProps?.isTearsheetOpen
            ? visibleColumns
            : [...sortableColumns];
    };

    const sortInstanceProps = (instance) => {
        const { onSort } = instance;
        Object.assign(instance, {
            manualSortBy: !!onSort,
            isTableSortable: true,
        });
    };

    const getNewSortOrder = (sortOrder) => {
        const order = {
            newSortDesc: undefined,
            newOrder: SORTABLE_ORDERING.NONE,
        };
        if (sortOrder === false) {
            order.newOrder = SORTABLE_ORDERING.DESC;
            order.newSortDesc = true;
        }
        if (sortOrder === undefined) {
            order.newOrder = SORTABLE_ORDERING.ASC;
            order.newSortDesc = false;
        }
        return order;
    };
    hooks.visibleColumns.push(sortableVisibleColumns);
    hooks.useInstance.push(sortInstanceProps);
};
