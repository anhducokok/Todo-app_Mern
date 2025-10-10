import TaskCard from "./TaskCard";
import TaskEmptyState from "./TaskEmptyState";



const TaskList = ({ filteredTasks, handleTaskChanged }) => {
  let filter = 'all';
  
  if (filteredTasks.length === 0 || !filteredTasks) {
    return <TaskEmptyState filter={filter} />;
  }
  return (
    <div className ="space-y-3">
      {filteredTasks.map((task,index) => (
      <TaskCard key={task._id ?? index}  task={task} index={index} handleTaskChanged={handleTaskChanged} />
    ))}
    </div>
  )
}

export default TaskList