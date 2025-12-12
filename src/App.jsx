import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Calendar as CalendarIcon, 
  Settings, 
  LogOut, 
  Plus, 
  MoreVertical, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Search,
  Menu,
  X,
  Edit2,
  Trash2,
  Users,
  Grid,
  Check,
  AlertCircle,
  Table2,
  MessageSquare,
  Save,
  Columns
} from 'lucide-react';

/**
 * LOCAL STORAGE KEYS
 */
const STORAGE_KEYS = {
  USER: 'pm_current_user',
  USERS: 'pm_users',
  TEAMS: 'pm_teams',
  BOARDS: 'pm_boards',
  TASKS: 'pm_tasks'
};

/**
 * HELPER FUNCTIONS
 */
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * UI COMPONENTS
 */
const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, disabled = false, type = 'button' }) => {
  const baseStyle = "flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-500 shadow-lg",
    secondary: "bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 hover:border-purple-300 focus:ring-slate-200",
    ghost: "text-slate-600 hover:bg-purple-50 hover:text-purple-700",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} className="mr-2" />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-xl border-2 border-slate-100 shadow-md hover:shadow-lg transition-shadow ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = 'slate' }) => {
  const colors = {
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
    indigo: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    purple: 'bg-purple-100 text-purple-700 border border-purple-200',
    emerald: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    amber: 'bg-amber-100 text-amber-700 border border-amber-200',
    red: 'bg-red-100 text-red-700 border border-red-200',
    blue: 'bg-blue-100 text-blue-700 border border-blue-200',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[color] || colors.slate}`}>
      {children}
    </span>
  );
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl ${sizes[size]} w-full max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg p-1">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
    />
  </div>
);

const Select = ({ label, value, onChange, options, required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
    />
  </div>
);

/**
 * AUTHENTICATION COMPONENT
 */
const AuthScreen = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const users = getFromStorage(STORAGE_KEYS.USERS, []);

    if (isSignUp) {
      if (users.find(u => u.email === formData.email)) {
        setError('Email already exists');
        return;
      }

      const newUser = {
        id: generateId(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveToStorage(STORAGE_KEYS.USERS, users);
      saveToStorage(STORAGE_KEYS.USER, newUser);
      onLogin(newUser);
    } else {
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (!user) {
        setError('Invalid email or password');
        return;
      }
      saveToStorage(STORAGE_KEYS.USER, user);
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border-2 border-purple-100">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg transform rotate-3">
          <LayoutDashboard className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 text-center">MinistryFlow</h1>
        <p className="text-slate-500 mb-8 text-center">
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </p>
        
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </>
          )}
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg flex items-center text-red-600 text-sm">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full py-3 mb-4 text-lg">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
          }}
          className="w-full text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
};

/**
 * TEAM SELECTION / CREATION
 */
const TeamSelection = ({ user, onSelectTeam }) => {
  const [teams, setTeams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    const allTeams = getFromStorage(STORAGE_KEYS.TEAMS, []);
    const userTeams = allTeams.filter(t => t.members.includes(user.id));
    setTeams(userTeams);
  }, [user.id]);

  const createTeam = () => {
    if (!teamName.trim()) return;

    const newTeam = {
      id: generateId(),
      name: teamName,
      createdBy: user.id,
      members: [user.id],
      createdAt: new Date().toISOString()
    };

    const allTeams = getFromStorage(STORAGE_KEYS.TEAMS, []);
    allTeams.push(newTeam);
    saveToStorage(STORAGE_KEYS.TEAMS, allTeams);
    
    setTeams([...teams, newTeam]);
    setShowCreateModal(false);
    setTeamName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">Select a Team</h1>
          <p className="text-slate-500">Choose a team to work with or create a new one</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {teams.map(team => (
            <Card 
              key={team.id} 
              className="p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105"
              onClick={() => onSelectTeam(team)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <Users className="text-purple-600" size={24} />
                </div>
                <ChevronRight className="text-slate-400" size={20} />
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{team.name}</h3>
              <p className="text-sm text-slate-500">{team.members.length} member(s)</p>
            </Card>
          ))}

          <Card 
            className="p-6 border-dashed border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50/30 transition-all cursor-pointer"
            onClick={() => setShowCreateModal(true)}
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                <Plus className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-purple-700">Create New Team</h3>
              <p className="text-xs text-slate-500 mt-1">Start collaborating</p>
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Team">
        <Input
          label="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="e.g., Youth Ministry Team"
          required
        />
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button onClick={createTeam}>Create Team</Button>
        </div>
      </Modal>
    </div>
  );
};

/**
 * BOARD SELECTION / CREATION
 */
const BoardSelection = ({ team, onSelectBoard, onBack }) => {
  const [boards, setBoards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [boardName, setBoardName] = useState('');

  useEffect(() => {
    const allBoards = getFromStorage(STORAGE_KEYS.BOARDS, []);
    const teamBoards = allBoards.filter(b => b.teamId === team.id);
    setBoards(teamBoards);
  }, [team.id]);

  const createBoard = () => {
    if (!boardName.trim()) return;

    const newBoard = {
      id: generateId(),
      name: boardName,
      teamId: team.id,
      createdAt: new Date().toISOString()
    };

    const allBoards = getFromStorage(STORAGE_KEYS.BOARDS, []);
    allBoards.push(newBoard);
    saveToStorage(STORAGE_KEYS.BOARDS, allBoards);
    
    setBoards([...boards, newBoard]);
    setShowCreateModal(false);
    setBoardName('');
  };

  const deleteBoard = (boardId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this board and all its tasks?')) return;

    const allBoards = getFromStorage(STORAGE_KEYS.BOARDS, []);
    const updatedBoards = allBoards.filter(b => b.id !== boardId);
    saveToStorage(STORAGE_KEYS.BOARDS, updatedBoards);

    const allTasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    const updatedTasks = allTasks.filter(t => t.boardId !== boardId);
    saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);

    setBoards(boards.filter(b => b.id !== boardId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center text-purple-600 hover:text-purple-700 mb-6 font-medium"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Teams
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">{team.name}</h1>
          <p className="text-slate-500">Select a board to manage tasks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {boards.map(board => (
            <Card 
              key={board.id} 
              className="p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105 group"
              onClick={() => onSelectBoard(board)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                  <Grid className="text-emerald-600" size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => deleteBoard(board.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                  <ChevronRight className="text-slate-400" size={20} />
                </div>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{board.name}</h3>
              <p className="text-sm text-slate-500">
                {getFromStorage(STORAGE_KEYS.TASKS, []).filter(t => t.boardId === board.id).length} task(s)
              </p>
            </Card>
          ))}

          <Card 
            className="p-6 border-dashed border-2 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer"
            onClick={() => setShowCreateModal(true)}
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                <Plus className="text-emerald-600" size={24} />
              </div>
              <h3 className="font-semibold text-emerald-700">Create New Board</h3>
              <p className="text-xs text-slate-500 mt-1">Organize your tasks</p>
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Board">
        <Input
          label="Board Name"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          placeholder="e.g., Worship Planning"
          required
        />
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button onClick={createBoard}>Create Board</Button>
        </div>
      </Modal>
    </div>
  );
};

/**
 * COMMENTS COMPONENT
 */
const CommentsSection = ({ taskId, comments = [], onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const user = getFromStorage(STORAGE_KEYS.USER);

  const handleAdd = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: generateId(),
      text: newComment,
      author: `${user.firstName} ${user.lastName}`,
      timestamp: new Date().toISOString()
    };
    
    onAddComment(comment);
    setNewComment('');
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
        <MessageSquare size={16} className="mr-2" />
        Comments & Notes
      </label>
      
      <div className="space-y-3 mb-3 max-h-48 overflow-y-auto">
        {comments.map(comment => (
          <div key={comment.id} className="bg-purple-50 p-3 rounded-lg border border-purple-100">
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-sm text-purple-900">{comment.author}</span>
              <span className="text-xs text-slate-500">
                {new Date(comment.timestamp).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-slate-700">{comment.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 rounded-lg border-2 border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button onClick={handleAdd} className="px-3" icon={Plus}>Add</Button>
      </div>
    </div>
  );
};

/**
 * BOARD VIEW (Monday.com style)
 */
const BoardView = ({ board, team }) => {
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [board.id]);

  const loadTasks = () => {
    const allTasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    const boardTasks = allTasks.filter(t => t.boardId === board.id);
    setTasks(boardTasks);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'not-started': return 'slate';
      case 'in-progress': return 'blue';
      case 'on-hold': return 'amber';
      case 'blocked': return 'red';
      case 'done': return 'emerald';
      default: return 'slate';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'amber';
      case 'low': return 'emerald';
      default: return 'slate';
    }
  };

  const openTaskModal = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const deleteTask = (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    const allTasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    const updatedTasks = allTasks.filter(t => t.id !== taskId);
    saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);
    loadTasks();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Board View</h2>
          <p className="text-slate-500">{board.name}</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b-2 border-purple-200">
              <th className="text-left p-4 font-semibold text-slate-700">Task Name</th>
              <th className="text-left p-4 font-semibold text-slate-700">Status</th>
              <th className="text-left p-4 font-semibold text-slate-700">Priority</th>
              <th className="text-left p-4 font-semibold text-slate-700">Due Date</th>
              <th className="text-left p-4 font-semibold text-slate-700">Comments</th>
              <th className="text-left p-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="border-b border-slate-100 hover:bg-purple-50/30 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-slate-800">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-slate-500 mt-1 line-clamp-1">{task.description}</div>
                  )}
                </td>
                <td className="p-4">
                  <Badge color={getStatusColor(task.status)}>
                    {task.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge color={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </td>
                <td className="p-4">
                  {task.dueDate ? (
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock size={14} className="mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm">No date</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <MessageSquare size={14} className="mr-1" />
                    {(task.comments || []).length}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openTaskModal(task)}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <Table2 size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">No tasks yet. Add your first task!</p>
          </div>
        )}
      </div>

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        task={editingTask}
        board={board}
        team={team}
        onSave={() => {
          loadTasks();
          setShowTaskModal(false);
        }}
      />
    </div>
  );
};

/**
 * KANBAN BOARD WITH TASK MANAGEMENT
 */
const KanbanBoard = ({ board, team }) => {
  const [tasks, setTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [board.id]);

  const loadTasks = () => {
    const allTasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    const boardTasks = allTasks.filter(t => t.boardId === board.id);
    setTasks(boardTasks);
  };

  const columns = [
    { id: 'not-started', label: 'Not Started', color: 'bg-slate-50 border-slate-300', badge: 'slate' },
    { id: 'in-progress', label: 'In Progress', color: 'bg-blue-50 border-blue-300', badge: 'blue' },
    { id: 'on-hold', label: 'On Hold', color: 'bg-amber-50 border-amber-300', badge: 'amber' },
    { id: 'blocked', label: 'Blocked', color: 'bg-red-50 border-red-300', badge: 'red' },
    { id: 'done', label: 'Done', color: 'bg-emerald-50 border-emerald-300', badge: 'emerald' }
  ];

  const openTaskModal = (task = null) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const deleteTask = (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    const allTasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    const updatedTasks = allTasks.filter(t => t.id !== taskId);
    saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);
    loadTasks();
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (!draggedTask) return;

    const allTasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    const updatedTasks = allTasks.map(t => 
      t.id === draggedTask.id ? { ...t, status } : t
    );
    saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);
    loadTasks();
    setDraggedTask(null);
  };

  const moveTask = (taskId, newStatus) => {
    const allTasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    const updatedTasks = allTasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);
    loadTasks();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'amber';
      case 'low': return 'emerald';
      default: return 'slate';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{board.name}</h2>
          <p className="text-slate-500">Team: {team.name}</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => openTaskModal()}>
          New Task
        </Button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 min-w-[1200px] h-full pb-4">
          {columns.map(col => (
            <div 
              key={col.id}
              className={`flex-1 rounded-xl border-2 p-4 ${col.color} flex flex-col shadow-sm`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">{col.label}</h3>
                <Badge color={col.badge}>
                  {tasks.filter(t => t.status === col.id).length}
                </Badge>
              </div>
              
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {tasks.filter(t => t.status === col.id).map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className="bg-white p-4 rounded-xl shadow-md border-2 border-slate-100 cursor-grab active:cursor-grabbing hover:shadow-lg transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge color={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => openTaskModal(task)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-semibold text-slate-800 mb-1">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-slate-500 mb-3 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      {task.dueDate && (
                        <div className="flex items-center text-slate-400">
                          <Clock size={14} className="mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      {(task.comments || []).length > 0 && (
                        <div className="flex items-center text-purple-600">
                          <MessageSquare size={14} className="mr-1" />
                          {task.comments.length}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2 md:hidden flex-wrap">
                      {columns.map(c => 
                        c.id !== col.id && (
                          <button 
                            key={c.id}
                            onClick={() => moveTask(task.id, c.id)} 
                            className={`text-xs px-2 py-1 rounded bg-${c.badge}-100 text-${c.badge}-700 font-medium`}
                          >
                            {c.label}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        task={editingTask}
        board={board}
        team={team}
        onSave={() => {
          loadTasks();
          setShowTaskModal(false);
        }}
      />
    </div>
  );
};

/**
 * TASK MODAL
 */
const TaskModal = ({ isOpen, onClose, task, board, team, onSave }) => {
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'not-started',
    priority: 'medium',
    dueDate: '',
    comments: []
  });

  useEffect(() => {
    if (task) {
      setTaskForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        comments: task.comments || []
      });
    } else {
      setTaskForm({
        title: '',
        description: '',
        status: 'not-started',
        priority: 'medium',
        dueDate: '',
        comments: []
      });
    }
  }, [task]);

  const saveTask = () => {
    if (!taskForm.title.trim()) return;

    const allTasks = getFromStorage(STORAGE_KEYS.TASKS, []);

    if (task) {
      const updatedTasks = allTasks.map(t => 
        t.id === task.id ? { ...t, ...taskForm } : t
      );
      saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);
    } else {
      const newTask = {
        id: generateId(),
        boardId: board.id,
        teamId: team.id,
        ...taskForm,
        createdAt: new Date().toISOString()
      };
      allTasks.push(newTask);
      saveToStorage(STORAGE_KEYS.TASKS, allTasks);
    }

    onSave();
  };

  const handleAddComment = (comment) => {
    setTaskForm({
      ...taskForm,
      comments: [...taskForm.comments, comment]
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={task ? 'Edit Task' : 'New Task'}
      size="lg"
    >
      <Input
        label="Task Title"
        value={taskForm.title}
        onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
        placeholder="Enter task title"
        required
      />
      
      <TextArea
        label="Description"
        value={taskForm.description}
        onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
        placeholder="Add details about this task..."
        rows={4}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          value={taskForm.status}
          onChange={(e) => setTaskForm({...taskForm, status: e.target.value})}
          options={[
            { value: 'not-started', label: 'Not Started' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'on-hold', label: 'On Hold' },
            { value: 'blocked', label: 'Blocked' },
            { value: 'done', label: 'Done' }
          ]}
        />

        <Select
          label="Priority"
          value={taskForm.priority}
          onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' }
          ]}
        />
      </div>

      <Input
        label="Due Date"
        type="date"
        value={taskForm.dueDate}
        onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
      />

      <CommentsSection 
        taskId={task?.id}
        comments={taskForm.comments}
        onAddComment={handleAddComment}
      />

      <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-slate-200">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={saveTask} icon={Save}>
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </Modal>
  );
};

/**
 * CALENDAR VIEW
 */
const CalendarView = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days in month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const monthDays = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getTasksForDate = (date) => {
    if (!date) return [];
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Calendar</h2>
          <p className="text-slate-500">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={ChevronLeft} onClick={prevMonth} className="px-3" />
          <Button variant="secondary" onClick={() => setCurrentDate(new Date())} className="px-4">Today</Button>
          <Button variant="secondary" icon={ChevronRight} onClick={nextMonth} className="px-3" />
        </div>
      </div>

      <Card className="flex-1 p-6">
        <div className="grid grid-cols-7 gap-2 mb-4 text-center font-bold text-slate-600">
          {days.map(d => <div key={d} className="py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2 h-[calc(100%-60px)]">
          {monthDays.map((date, index) => {
            const dayTasks = getTasksForDate(date);
            const today = isToday(date);

            return (
              <div 
                key={index} 
                className={`border-2 rounded-xl p-2 min-h-[100px] transition-all ${
                  date ? 'hover:border-purple-300 cursor-pointer' : 'bg-slate-50/50'
                } ${today ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-300 shadow-md' : 'border-slate-100'}`}
              >
                {date && (
                  <>
                    <span className={`text-sm font-bold mb-1 block ${today ? 'text-purple-600' : 'text-slate-700'}`}>
                      {date.getDate()}
                    </span>
                    <div className="space-y-1 overflow-y-auto max-h-20">
                      {dayTasks.map(task => (
                        <div 
                          key={task.id} 
                          className={`text-[10px] px-2 py-1 rounded font-medium truncate ${
                            task.status === 'done' ? 'bg-emerald-100 text-emerald-800' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                            task.status === 'on-hold' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-800'
                          }`}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

/**
 * DASHBOARD
 */
const Dashboard = ({ team, board, tasks }) => {
  const stats = {
    total: tasks.length,
    notStarted: tasks.filter(t => t.status === 'not-started').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    onHold: tasks.filter(t => t.status === 'on-hold').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    done: tasks.filter(t => t.status === 'done').length,
    highPriority: tasks.filter(t => t.priority === 'high').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Dashboard</h2>
        <p className="text-slate-500">{team.name} - {board.name}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 border-l-4 border-purple-500">
          <div className="text-slate-500 text-sm font-medium mb-1">Total Tasks</div>
          <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
        </Card>

        <Card className="p-4 border-l-4 border-slate-500">
          <div className="text-slate-500 text-sm font-medium mb-1">Not Started</div>
          <div className="text-3xl font-bold text-slate-600">{stats.notStarted}</div>
        </Card>

        <Card className="p-4 border-l-4 border-blue-500">
          <div className="text-slate-500 text-sm font-medium mb-1">In Progress</div>
          <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
        </Card>

        <Card className="p-4 border-l-4 border-amber-500">
          <div className="text-slate-500 text-sm font-medium mb-1">On Hold</div>
          <div className="text-3xl font-bold text-amber-600">{stats.onHold}</div>
        </Card>

        <Card className="p-4 border-l-4 border-red-500">
          <div className="text-slate-500 text-sm font-medium mb-1">Blocked</div>
          <div className="text-3xl font-bold text-red-600">{stats.blocked}</div>
        </Card>

        <Card className="p-4 border-l-4 border-emerald-500">
          <div className="text-slate-500 text-sm font-medium mb-1">Done</div>
          <div className="text-3xl font-bold text-emerald-600">{stats.done}</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
          <Clock size={20} className="mr-2 text-purple-600" />
          Recent Tasks
        </h3>
        <div className="space-y-3">
          {tasks.slice(0, 8).map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50/50 to-transparent rounded-xl border border-slate-100 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-3 h-3 rounded-full ${
                  task.status === 'done' ? 'bg-emerald-500' :
                  task.status === 'in-progress' ? 'bg-blue-500' :
                  task.status === 'blocked' ? 'bg-red-500' :
                  task.status === 'on-hold' ? 'bg-amber-500' :
                  'bg-slate-400'
                }`} />
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{task.title}</p>
                  <p className="text-xs text-slate-500">
                    {task.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </p>
                </div>
              </div>
              <Badge color={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'amber' : 'emerald'}>
                {task.priority}
              </Badge>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-slate-400 text-center py-8">No tasks yet. Create your first task to get started!</p>
          )}
        </div>
      </Card>
    </div>
  );
};

/**
 * SETTINGS / ACCOUNT EDITING
 */
const SettingsView = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  });

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    
    // Update in users list
    const allUsers = getFromStorage(STORAGE_KEYS.USERS, []);
    const updatedUsers = allUsers.map(u => u.id === user.id ? updatedUser : u);
    saveToStorage(STORAGE_KEYS.USERS, updatedUsers);
    
    // Update current user
    saveToStorage(STORAGE_KEYS.USER, updatedUser);
    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">Settings</h2>
      
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Account Information</h3>
          {!isEditing ? (
            <Button variant="secondary" icon={Edit2} onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => {
                setIsEditing(false);
                setFormData({
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email
                });
              }}>
                Cancel
              </Button>
              <Button icon={Save} onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Name</label>
              <p className="text-slate-800 font-medium">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
              <p className="text-slate-800 font-medium">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Member Since</label>
              <p className="text-slate-800 font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <h3 className="text-lg font-bold text-slate-800 mb-2">About MinistryFlow</h3>
        <p className="text-slate-600 text-sm">
          MinistryFlow helps churches and ministries manage their tasks and projects efficiently. 
          Stay organized, collaborate with your team, and focus on what matters most.
        </p>
      </Card>
    </div>
  );
};

/**
 * MAIN APP
 */
export default function App() {
  const [user, setUser] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'board'
  const [tasks, setTasks] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = getFromStorage(STORAGE_KEYS.USER);
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (selectedBoard) {
      loadTasks();
    }
  }, [selectedBoard]);

  const loadTasks = () => {
    const allTasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    const boardTasks = allTasks.filter(t => t.boardId === selectedBoard.id);
    setTasks(boardTasks);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setSelectedTeam(null);
    setSelectedBoard(null);
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const NavItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => { 
        setActiveView(id); 
        setIsMobileMenuOpen(false); 
      }}
      className={`w-full flex items-center p-3 rounded-xl mb-2 transition-all font-medium text-sm ${
        activeView === id 
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105' 
        : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
      }`}
    >
      <Icon size={20} className="mr-3" />
      {label}
    </button>
  );

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  if (!selectedTeam) {
    return <TeamSelection user={user} onSelectTeam={setSelectedTeam} />;
  }

  if (!selectedBoard) {
    return (
      <BoardSelection 
        team={selectedTeam} 
        onSelectBoard={setSelectedBoard}
        onBack={() => setSelectedTeam(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/20 flex font-sans text-slate-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r-2 border-slate-100 h-screen sticky top-0 shadow-xl">
        <div className="p-6 flex items-center border-b-2 border-purple-100">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">MinistryFlow</span>
        </div>

        <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 mx-4 rounded-xl mb-4 mt-4 border border-purple-100">
          <div className="text-xs text-purple-600 font-semibold mb-1">Current Board</div>
          <div className="font-bold text-slate-800 text-sm truncate">{selectedBoard.name}</div>
          <button 
            onClick={() => setSelectedBoard(null)}
            className="text-xs text-purple-600 hover:text-purple-700 mt-1 font-medium"
          >
            Switch Board →
          </button>
        </div>

        <nav className="flex-1 px-4 py-4">
          <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-4 px-2">
            Menu
          </div>
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="tasks" label="Tasks" icon={KanbanSquare} />
          <NavItem id="calendar" label="Calendar" icon={CalendarIcon} />
        </nav>

        <div className="p-4 border-t-2 border-slate-100">
          <NavItem id="settings" label="Settings" icon={Settings} />
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm font-medium mt-2"
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b-2 border-purple-100 z-50 px-4 py-3 flex justify-between items-center shadow-lg">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mr-2">
            <LayoutDashboard className="text-white" size={18} />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">MinistryFlow</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 text-purple-600"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-20 px-4 md:hidden overflow-y-auto">
          <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <div className="text-xs text-purple-600 font-semibold mb-1">Current Board</div>
            <div className="font-bold text-slate-800">{selectedBoard.name}</div>
            <button 
              onClick={() => {
                setSelectedBoard(null);
                setIsMobileMenuOpen(false);
              }}
              className="text-xs text-purple-600 hover:text-purple-700 mt-1 font-medium"
            >
              Switch Board →
            </button>
          </div>

          <nav className="space-y-2">
            <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
            <NavItem id="tasks" label="Tasks" icon={KanbanSquare} />
            <NavItem id="calendar" label="Calendar" icon={CalendarIcon} />
            <div className="h-px bg-slate-100 my-4" />
            <NavItem id="settings" label="Settings" icon={Settings} />
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center p-3 text-red-600 bg-red-50 rounded-xl font-medium"
            >
              <LogOut size={20} className="mr-3" /> Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 mt-14 md:mt-0 overflow-y-auto h-screen">
        {/* View Mode Toggle for Tasks */}
        {activeView === 'tasks' && (
          <div className="flex justify-end mb-4">
            <div className="flex gap-2 bg-white rounded-xl p-1 shadow-md border-2 border-slate-100">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'kanban' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Columns size={16} />
                Kanban
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'board' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Table2 size={16} />
                Board
              </button>
            </div>
          </div>
        )}

        <div className="h-[calc(100vh-140px)]">
          {activeView === 'dashboard' && (
            <Dashboard team={selectedTeam} board={selectedBoard} tasks={tasks} />
          )}
          {activeView === 'tasks' && (
            viewMode === 'kanban' ? (
              <KanbanBoard board={selectedBoard} team={selectedTeam} />
            ) : (
              <BoardView board={selectedBoard} team={selectedTeam} />
            )
          )}
          {activeView === 'calendar' && (
            <CalendarView tasks={tasks} />
          )}
          {activeView === 'settings' && (
            <SettingsView user={user} onUpdateUser={handleUpdateUser} />
          )}
        </div>
      </main>
    </div>
  );
}
    <button
      onClick={() => { 
        setActiveView(id); 
        setIsMobileMenuOpen(false); 
      }}
      className={`w-full flex items-center p-3 rounded-xl mb-2 transition-all font-medium text-sm ${
        activeView === id 
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105' 
        : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
      }`}
    >
      <Icon size={20} className="mr-3" />
      {label}
    </button>
  );

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  if (!selectedTeam) {
    return <TeamSelection user={user} onSelectTeam={setSelectedTeam} />;
  }

  if (!selectedBoard) {
    return (
      <BoardSelection 
        team={selectedTeam} 
        onSelectBoard={setSelectedBoard}
        onBack={() => setSelectedTeam(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/20 flex font-sans text-slate-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r-2 border-slate-100 h-screen sticky top-0 shadow-xl">
        <div className="p-6 flex items-center border-b-2 border-purple-100">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">MinistryFlow</span>
        </div>

        <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 mx-4 rounded-xl mb-4 mt-4 border border-purple-100">
          <div className="text-xs text-purple-600 font-semibold mb-1">Current Board</div>
          <div className="font-bold text-slate-800 text-sm truncate">{selectedBoard.name}</div>
          <button 
            onClick={() => setSelectedBoard(null)}
            className="text-xs text-purple-600 hover:text-purple-700 mt-1 font-medium"
          >
            Switch Board →
          </button>
        </div>

        <nav className="flex-1 px-4 py-4">
          <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-4 px-2">
            Menu
          </div>
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="tasks" label="Tasks" icon={KanbanSquare} />
          <NavItem id="calendar" label="Calendar" icon={CalendarIcon} />
          <NavItem id="journal" label="Journal" icon={BookOpen} />
        </nav>

        <div className="p-4 border-t-2 border-slate-100">
          <NavItem id="settings" label="Settings" icon={Settings} />
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm font-medium mt-2"
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b-2 border-purple-100 z-50 px-4 py-3 flex justify-between items-center shadow-lg">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mr-2">
            <LayoutDashboard className="text-white" size={18} />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">MinistryFlow</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 text-purple-600"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-20 px-4 md:hidden overflow-y-auto">
          <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <div className="text-xs text-purple-600 font-semibold mb-1">Current Board</div>
            <div className="font-bold text-slate-800">{selectedBoard.name}</div>
            <button 
              onClick={() => {
                setSelectedBoard(null);
                setIsMobileMenuOpen(false);
              }}
              className="text-xs text-purple-600 hover:text-purple-700 mt-1 font-medium"
            >
              Switch Board →
            </button>
          </div>

          <nav className="space-y-2">
            <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
            <NavItem id="tasks" label="Tasks" icon={KanbanSquare} />
            <NavItem id="calendar" label="Calendar" icon={CalendarIcon} />
            <NavItem id="journal" label="Journal" icon={BookOpen} />
            <div className="h-px bg-slate-100 my-4" />
            <NavItem id="settings" label="Settings" icon={Settings} />
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center p-3 text-red-600 bg-red-50 rounded-xl font-medium"
            >
              <LogOut size={20} className="mr-3" /> Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 mt-14 md:mt-0 overflow-y-auto h-screen">
        {/* View Mode Toggle for Tasks */}
        {activeView === 'tasks' && (
          <div className="flex justify-end mb-4">
            <div className="flex gap-2 bg-white rounded-xl p-1 shadow-md border-2 border-slate-100">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'kanban' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Columns size={16} />
                Kanban
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'board' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Table2 size={16} />
                Board
              </button>
            </div>
          </div>
        )}

        <div className="h-[calc(100vh-140px)]">
          {activeView === 'dashboard' && (
            <Dashboard team={selectedTeam} board={selectedBoard} tasks={tasks} user={user} />
          )}
          {activeView === 'tasks' && (
            viewMode === 'kanban' ? (
              <KanbanBoard board={selectedBoard} team={selectedTeam} />
            ) : (
              <BoardView board={selectedBoard} team={selectedTeam} />
            )
          )}
          {activeView === 'calendar' && (
            <CalendarView tasks={tasks} />
          )}
          {activeView === 'journal' && (
            <JournalView team={selectedTeam} board={selectedBoard} />
          )}
          {activeView === 'settings' && (
            <SettingsView user={user} onUpdateUser={handleUpdateUser} />
          )}
        </div>
      </main>
    </div>
  );
}
