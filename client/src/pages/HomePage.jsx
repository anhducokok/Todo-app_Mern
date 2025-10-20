// Import các components cần thiết từ các thư mục khác nhau
import AddTask from "@/components/task/AddTask";
import Header from "@/components/common/Header";
import StatsAndFilters from "@/components/filters/StatsAndFilters";
import TaskList from "@/components/task/TaskList";
import TaskListPagination from "@/components/task/TaskListPagination";
import Footer from "@/components/common/Footer";
import DateTimeFilter from "@/components/filters/DateTimeFilter";
import { Toaster, toast } from "sonner"; // Thư viện hiển thị notifications
import React, { useEffect, useState } from "react"; // React hooks
import axios from "axios"; // Thư viện gọi API
import { visibleTaskLimit } from "@/lib/data";
import { Spinner } from "@/components/ui/spinner";
import Navigator from "@/components/common/Navigator";
import { useAuth } from "@/context/AuthContext";

/**
 * HomePage Component - Trang chính của ứng dụng quản lý task
 * Quản lý state và logic chính của app
 */
const HomePage = () => {
  const { user, isLoggedIn, token } = useAuth();

  const [taskData, setTaskData] = useState({
    taskList: [], // Danh sách tất cả tasks từ API
    activeTaskCount: 0, // Số lượng task đang active
    completedTaskCount: 0, // Số lượng task đã hoàn thành
  });
  const [page, setPage] = useState(1); // State để lưu trang hiện tại (phân trang)
  const [searchQuery, setSearchQuery] = useState(""); // State để lưu từ khóa tìm kiếm
  // State để lưu filter theo ngày/tuần/tháng (today, week, month, all)
  const [dateQuery, setDateQuery] = useState("all");
  const [isLoading, setIsLoading] = useState(false); // State để quản lý trạng thái loading

  useEffect(() => {
    if (isLoggedIn) {
      fetchTask();
    }
  }, [dateQuery, searchQuery, isLoggedIn]); 

  const [filter, setFilter] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const fetchTask = async () => {
    if (!token || !isLoggedIn) {
      console.log("No authentication token available");
      setTaskData({ taskList: [], activeTaskCount: 0, completedTaskCount: 0 });
      return;
    }

    try {
      setIsLoading(true); 
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Set authorization header for this request
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      let res;
      if (!searchQuery.trim()) {
        res = await axios.get(
          `http://localhost:5001/api/tasks?filter=${dateQuery}`,
          config
        );
      } else {
        res = await axios.get(
          `http://localhost:5001/api/tasks?filter=${dateQuery}&search=${searchQuery}`,
          config
        );
      }

      // Cập nhật state với data từ API response
      setTaskData({
        taskList: res.data.tasks.map(task => ({
          ...task,
          priority: task.priority || 'low' // Mặc định priority là 'low' nếu không có
        })),
        activeTaskCount: res.data.activeCount,
        completedTaskCount: res.data.completedCount,
      });

      console.log(`Fetched ${res.data.tasks.length} tasks for user:`, user?.username);
    } catch (e) {
      console.log("Lỗi khi truy vấn data", e);
      if (e.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Lỗi khi truy vấn data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = taskData.taskList.filter((task) => {
    let statusMatch = true;
    let priorityMatch = true;

    if (filter !== "all") {
      statusMatch = task.status === filter;
    }

    if (filterPriority !== "all") {
      priorityMatch = task.priority === filterPriority;
    }
    return statusMatch && priorityMatch;
  });
  const handleNewTaskAdded = () => {
    fetchTask(); // Refresh data từ server
  };

  const visibleTask = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  ); // Giới hạn số task hiển thị dựa trên page
  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit); // Tính tổng số trang
  const handlePageChange = (newPage) => {
    setPage(newPage); // Cập nhật trang hiện tại
  };
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };
  useEffect(() => {
    setPage(1);
  }, [dateQuery, filter, filterPriority]);

  if (visibleTask.length === 0 && page > 1) {
    handlePrevPage();
  }
  // Thêm hàm handleSearch
  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1); // Reset về trang 1 khi search
  };

  // Hiển thị welcome message hoặc prompt để login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 90%, #ffffff 20%, #fdfdfd 60%, #eeeeee 100%)",
          }}
        />
        
        <div className="container pt-8 mx-auto relative z-10">
          <div className="w-full max-w-2xl mx-auto">
            <div className="space-y-6 mb-6">
              <Header />
              <Navigator />
            </div>
            <div className="flex-1 mb-6">
              <TaskList
                filteredTasks={visibleTask} // Tasks đã được filter
                handleTaskChanged={handleNewTaskAdded} // Callback khi task thay đổi
                config={null}
              />
            </div>
            <Footer
              className="absolute bottom-0 left-0 w-full"
              completedTaskCount={0}
              activeTaskCount={0}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    /* JSX Return - Cấu trúc UI của component */
    <div className="min-h-screen w-full relative">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-70">
          <Spinner className="h-16 w-16 text-red-200 animate-spin" />
        </div>
      )}
        
      {/* Background Layer - Gradient nền với absolute positioning */}
      <div
        className="absolute inset-0 z-0" // inset-0 = top:0, right:0, bottom:0, left:0
        style={{
          // Inline style cho gradient background (không thể dùng Tailwind cho gradient phức tạp)
          background:
            "radial-gradient(125% 125% at 50% 90%, #ffffff 20%, #fdfdfd 60%, #eeeeee 100%)",
        }}
      />

      {/* Main Container với fixed layout */}
      <div className="container pt-8 mx-auto relative z-10">
        <div className="w-full max-w-2xl mx-auto">
          {/* Header và Controls - Fixed top */}
          <div className="space-y-6 mb-6">
            {/* <Header /> */}
            <Navigator />
            <AddTask handleNewTaskAdded={handleNewTaskAdded} />
            <StatsAndFilters
              filter={filter} // Giá trị filter hiện tại
              setFilter={setFilter} // Function để thay đổi filter
              filterPriority={filterPriority} // Giá trị filter hiện tại
              setFilterPriority={setFilterPriority} // Function để thay đổi filter
              searchQuery={searchQuery} // Truyền searchQuery
              onSearch={handleSearch} // Truyền hàm handleSearch (lowercase 'o')
            />
          </div>

          {/* Main Content Area với fixed height */}
          <div
            className="flex flex-col"
            style={{ minHeight: "calc(100vh - 400px)" }}
          >
            {/* Task List - Flexible content */}
            <div className="flex-1 mb-6">
              <TaskList
                filteredTasks={visibleTask} // Tasks đã được filter
                handleTaskChanged={handleNewTaskAdded} // Callback khi task thay đổi
                config={{ headers: { Authorization: `Bearer ${token}` } }}
              />
            </div>

            {/* Fixed Bottom Section */}
            <div className="mt-auto space-y-4 justify-between flex ">
              {/* Pagination - Always at same position */}
              <div className="col-span-6">
                <TaskListPagination
                  handleNextPage={handleNextPage}
                  handlePrevPage={handlePrevPage}
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  completedTaskCount={taskData.completedTaskCount} // Số task hoàn thành
                  activeTaskCount={taskData.activeTaskCount} // Số task đang làm
                />
              </div>

              {/* Date Filter */}
              <div className=" col-span-6 flex justify-end">
                <DateTimeFilter
                  dateQuery={dateQuery} // Giá trị filter ngày hiện tại
                  setDateQuery={setDateQuery} // Function để thay đổi filter ngày
                />
              </div>
            </div>

            {/* Footer - Always at bottom */}
            <Footer
              className="absolute bottom-0 left-0 w-full"
              completedTaskCount={taskData.completedTaskCount}
              activeTaskCount={taskData.activeTaskCount}
            />
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
