import TaskCard from "./TaskCard";
import TaskEmptyState from "./TaskEmptyState";



const TaskList = ({ filteredTasks, handleTaskChanged, config }) => {
  let filter = 'all';
  
  if (filteredTasks.length === 0 || !filteredTasks) {
    return <TaskEmptyState filter={filter} />;
  }
  return (
    <div className ="space-y-3">
      {filteredTasks.map((task,index) => (
      <TaskCard key={task._id ?? index}  task={task} index={index} handleTaskChanged={handleTaskChanged} config={config} />
    ))}
    </div>
  )
}

export default TaskList