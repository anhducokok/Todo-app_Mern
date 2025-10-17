import React, { useEffect } from 'react'

/**
 * Footer component - Hiển thị thống kê task và thông tin tác giả
 * @param {number} completedTaskCount - Số lượng task đã hoàn thành
 * @param {number} activeTaskCount - Số lượng task đang active (chưa hoàn thành)
 */
const Footer = ({completedTaskCount, activeTaskCount}) => {
  return (
    <div>
      {/* Chỉ hiển thị thống kê khi có ít nhất 1 task */}
      {completedTaskCount + activeTaskCount > 0 && (
        <div className="text-center">
          <p className='text-sm text-muted-foreground'>
            {/* Hiển thị số task đã hoàn thành */}
            {completedTaskCount} completed,{
              /* Nếu có task active thì hiển thị thêm số task active */
              activeTaskCount > 0 && (` ${activeTaskCount} active`)
            }
          </p>
        </div>
      )}
      
      {/* Hiển thị tổng số task */}
      <div className="text-center">
        <p className='text-sm text-muted-foreground'>
          {/* Tính tổng: completed + active = total */}
          {completedTaskCount + activeTaskCount} total
        </p>
      </div>
      
      {/* Thông tin tác giả */}
      <div className="text-center">
        <p className='text-sm text-muted-foreground'>
          Made with ❤️ by Phạm Đức
        </p>
      </div>
    </div>
  )
}

export default Footer