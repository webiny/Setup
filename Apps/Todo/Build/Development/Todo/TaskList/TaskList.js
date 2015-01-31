import BaseComponent from '/Core/Base/BaseComponent';

class TaskList extends BaseComponent {

	getTemplate(){ return '<div className="col-sm-12"><Form name="form"><FormGroup><Label>Create new item</Label><Input grid="2" valueLink={this.linkState("task")} placeholder="New task" ref="newTask"/><button className="btn btn-primary col-sm-2" type="submit" onClick={this.addTask}>Add</button><Label>Filter items</Label><Input grid="4" valueLink={this.linkState("filter")} placeholder="Filter..."/></FormGroup></Form>{function(){if(this.state.todos.length == 0){return <wdiv>No items available yet...</wdiv>}}.bind(this)()}<Table><Thead><Tr><Th>#</Th><Th>ID</Th><Th>Task</Th><Th>Created On</Th><Th>Actions</Th></Tr></Thead><Tbody>{this.state.todos.map(function(item, i){return <Tr key={i} className={this.classSet(this.classSet({danger: item.important, success: item.completed)})}><Td>{i+1}</Td><Td>{function(){if(item.id){return <wdiv>{item.id}</wdiv>}}.bind(this)()}</Td><Td>{item.task}</Td><Td>{item.created}</Td><Td>{function(){if(item.id){return <wdiv><Link className="btn btn-primary" href="/Todo/Todo/:id" params={item}>Edit</Link>&nbsp;<button className="btn btn-danger" onClick={this.removeTask.bind(this, item)}>Delete</button></wdiv>} else { return <wdiv>Saving...</wdiv>;}}.bind(this)()}</Td></Tr>}.bind(this))}</Tbody></Table></div>';
	}

	getFqn() {
		return 'Todo.Todo.ListComponent';
	}

	componentDidMount() {
		super();

		this.fullListOfTasks = [];

		this.tasksStore = this.getStore('Todo.Todo.TasksStore');

		// Get initial data
		this.tasksStore.getData().then((data) => {
			this.fullListOfTasks = data;
			this.setState({todos: data});
		});

		// Listen to store changes
		// TODO: mozda da se iz callbacka vraca data a ne store
		this.onStore('Todo.Todo.TasksStore', (store) => {
			store.getData().then((data) => {
				this.setState({todos: data});
			});
		});
	}

	getInitialState() {
		return {
			todos: [],
			task: '',
			filter: ''
		};
	}

	addTask(e) {
		this.trigger('Todo.Todo.addTodoAction', {task: this.state.task});
		this.setState({task: ''});
	}

	removeTask(id) {
		//var id = $(e.target).attr('data-id');
		this.trigger('Todo.Todo.removeTodoAction', id);
	}

	onChangeFilter(newValue, oldValue) {
		if(!newValue){
			return this.setState({todos: this.fullListOfTasks});
		}
		var filter = newValue.toLowerCase();
		var results = [];
		this.fullListOfTasks.forEach((task) => {
			if (task.task.toLowerCase().indexOf(filter) > -1) {
				results.push(task);
			}
		});
		this.setState({todos: results});
	}
}

export default TaskList;
