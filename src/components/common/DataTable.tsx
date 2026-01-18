import { useState, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { smartSearch } from '@/lib/smartSearch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  MoreHorizontal
} from 'lucide-react'

interface Column<T> {
  key: string
  title: string
  dataIndex?: keyof T
  render?: (value: any, record: T, index: number) => React.ReactNode
  sortable?: boolean
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  searchable?: boolean
  selectable?: boolean
  pagination?: {
    pageSize: number
    showSizeChanger?: boolean
  }
  onSearch?: (value: string) => void
  onSelect?: (selectedRows: T[]) => void
  onExport?: () => void
  className?: string
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = false,
  selectable = false,
  pagination,
  onSearch,
  onSelect,
  onExport,
  className
}: DataTableProps<T>) {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRows, setSelectedRows] = useState<T[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const pageSize = pagination?.pageSize || 10
  const totalPages = Math.ceil(data.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = data.slice(startIndex, endIndex)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch?.(value)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows([...currentData])
      onSelect?.(currentData)
    } else {
      setSelectedRows([])
      onSelect?.([])
    }
  }

  const handleSelectRow = (row: T, checked: boolean) => {
    if (checked) {
      const newSelected = [...selectedRows, row]
      setSelectedRows(newSelected)
      onSelect?.(newSelected)
    } else {
      const newSelected = selectedRows.filter(item => item !== row)
      setSelectedRows(newSelected)
      onSelect?.(newSelected)
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const isRowSelected = (row: T) => {
    return selectedRows.includes(row)
  }

  const isAllSelected = currentData.length > 0 && currentData.every(isRowSelected)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        {searchable && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('dataTable.search')}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="ps-10"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 me-2" />
              {t('dataTable.export')}
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 me-2" />
            {t('dataTable.filter')}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.sortable ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={() => column.sortable && handleSort(column.key)}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.title}</span>
                    {column.sortable && sortField === column.key && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 2 : 1)} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-muted border-t-primary"></div>
                    <span>{t('dataTable.loading')}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 2 : 1)} className="text-center py-8">
                  <div className="text-muted-foreground">{t('dataTable.noData')}</div>
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((row, index) => (
                <TableRow key={index}>
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={isRowSelected(row)}
                        onCheckedChange={(checked) => handleSelectRow(row, checked as boolean)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(
                            column.dataIndex ? row[column.dataIndex] : null,
                            row,
                            index
                          )
                        : column.dataIndex
                        ? row[column.dataIndex]
                        : null}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="ghost" size="icon" aria-label={t('common.actions')}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t('dataTable.showing', { from: startIndex + 1, to: Math.min(endIndex, data.length), total: data.length })}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              {t('dataTable.page', { current: currentPage, total: totalPages })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Export memoized version to prevent unnecessary re-renders
export default memo(DataTable) as typeof DataTable
