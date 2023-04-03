import {
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
} from 'carbon-components-react';
import { useTranslation } from 'react-i18next';
import '../DataTable/DataTable.scss'
export const DataTables = () => {

    const {t}=useTranslation();
    const rows = [
        {
            id: 'a',
            name: t('load-balancer1'),
            status: t('disabled'),
        },
        {
            id: 'b',
            name: t('load-balancer2'),
            status: t('starting'),
        },
        {
            id: 'c',
            name: t('load-balancer3'),
            status: t('active'),
        },
    ];

    const headers = [
        {
            key: 'name',
            header: 'Name',
        },
        {
            key: 'status',
            header: 'Status',
        },
    ];

    return (
        <div className='data-table'>
        <DataTable rows={rows} headers={headers}>
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                <Table {...getTableProps()}>
                    <TableHead>
                        <TableRow>
                            {headers.map((header) => (
                                <TableHeader {...getHeaderProps({ header })}>
                                    {header.header}
                                </TableHeader>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow {...getRowProps({ row })}>
                                {row.cells.map((cell) => (
                                    <TableCell key={cell.id}>{cell.value}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </DataTable>
        </div>
    )
}