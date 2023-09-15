

function CreatorDashboard() {
  return (
    <div className="creator-dashboard">
      <h1>Welcome to Your Creator Dashboard</h1>
      <p>Manage your tasks and opportunities here.</p>

      <div className="button-container">
        <a href="/creator/create-task" className="dashboard-button"><button>Create a Task</button></a>
      
        <a href="/creator/previous-tasks" className="dashboard-button"><button>See on going Editing</button></a>
      </div>
    </div>
  );
}

export default CreatorDashboard;