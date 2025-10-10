export const FilterTypes = {
  all: "Tất Cả",
  active: "Đang làm",
  completed: "Đã hoàn thành",
};

export const priorityOptions = {
  all: { label: "Tất cả", color: "gray" },
  low: { label: "Thấp", color: "green" },
  medium: { label: "Trung bình", color: "yellow" },
  high: { label: "Cao", color: "red" },
};

export const options = [
  { value: "today", label: "Hôm nay" },
  { value: "week", label: "Tuần này" },
  { value: "month", label: "Tháng này" },
  { value: "all", label: "Tất cả" }
];

export const visibleTaskLimit = 4;