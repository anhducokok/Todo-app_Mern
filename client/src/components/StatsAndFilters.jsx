import React from "react";
import { Badge } from "./ui/badge";
import { FilterTypes, priorityOptions } from "@/lib/data";
import { Button } from "./ui/button";
import { Filter, Search } from "lucide-react";

const StatsAndFilters = ({
  filter = "all",
  setFilter,
  filterPriority = "all",
  setFilterPriority,
  searchQuery = "", // Nhận searchQuery từ parent
  onSearch // Nhận onSearch function từ parent
}) => {
  const [openPopup, setOpenPopup] = React.useState(false);
  const [localSearchQuery, setLocalSearchQuery] = React.useState(searchQuery); // Local state for input

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handlePriorityChange = (newPriority) => {
    setFilterPriority(newPriority);
  };

  // Chỉ update local state, không trigger search
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    // Bỏ auto search - chỉ update local state
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Trigger search khi nhấn Enter
      if (onSearch) {
        onSearch(localSearchQuery);
      }
      setOpenPopup(false);
    }
    
    // Close popup on Escape
    if (e.key === "Escape") {
      setOpenPopup(false);
      // Reset local input về search query hiện tại
      setLocalSearchQuery(searchQuery);
    }
  };

  const handleSearchClick = () => {
    // Trigger search khi click button Search
    if (onSearch) {
      onSearch(localSearchQuery);
    }
    setOpenPopup(false);
  };

  const clearSearch = () => {
    setLocalSearchQuery("");
    if (onSearch) {
      onSearch(""); // Clear search ngay lập tức
    }
    setOpenPopup(false);
  };

  const handleCancelSearch = () => {
    // Reset về search query hiện tại và đóng popup
    setLocalSearchQuery(searchQuery);
    setOpenPopup(false);
  };

  // Sync with parent searchQuery khi component mount hoặc searchQuery thay đổi từ bên ngoài
  React.useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      {/* Status Filter */}
      <div className="flex gap-3 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="size-4" />
          <select
            className="border rounded px-2 py-1 text-sm capitalize"
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            {Object.keys(FilterTypes).map((type) => (
              <option key={type} value={type} className="capitalize">
                {FilterTypes[type]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Priority Filter */}
      <div className="flex gap-3 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="size-4" />
          <select
            className="border rounded px-2 py-1 text-sm capitalize"
            value={filterPriority}
            onChange={(e) => handlePriorityChange(e.target.value)}
          >
            {Object.keys(priorityOptions).map((type) => (
              <option key={type} value={type} className="capitalize">
                {priorityOptions[type].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search 
            className="size-4 cursor-pointer hover:text-primary transition-colors" 
            onClick={() => setOpenPopup(true)} 
          />
          {/* Show indicator if there's an active search */}
          {searchQuery && (
            <div className="absolute -top-1 -right-1 size-2 bg-primary rounded-full"></div>
          )}
        </div>
        
        {/* Show current search query */}
        {searchQuery && (
          <Badge variant="secondary" className="text-xs">
            "{searchQuery}"
            <button 
              onClick={clearSearch}
              className="ml-1 hover:text-destructive"
            >
              ×
            </button>
          </Badge>
        )}
      </div>

      {/* Search Popup */}
      {openPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Search Tasks</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancelSearch}
              >
                <span className="text-xl">&times;</span>
              </Button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Type to search tasks..."
                onChange={handleSearchInput}
                onKeyDown={handleKeyDown}
                value={localSearchQuery}
                autoFocus
              />
              
              <div className="text-xs text-gray-500 mb-2">
                Press Enter or click Search to search
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={handleCancelSearch}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={clearSearch}
                  disabled={!searchQuery} // Chỉ enable khi đã có search query
                >
                  Clear Search
                </Button>
                <Button
                  onClick={handleSearchClick}
                  disabled={!localSearchQuery.trim()}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsAndFilters;
