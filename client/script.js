window.onload = function() {

    var STORAGE_KEY = 'todos-vuejs-2.0'
    var todoStorage = {
        fetch: function(callback) {
            Vue.http.get('/api/todos').then((response) => {
                callback(response.json() || []);
            }, (response) => {
                console.log(response);
            });
        },
        save: function(todos, callback) {
            Vue.http.post('/api/todos', todos).then((response) => {
                callback(response.json() || []);
            }, (response) => {
                console.log(response);
                // error callback
            });
        }
    }

    // visibility filters
    var filters = {
        all: function(todos) {
            return todos
        },
        active: function(todos) {
            return todos.filter(function(todo) {
                return !todo.completed
            })
        },
        completed: function(todos) {
            return todos.filter(function(todo) {
                return todo.completed
            })
        }
    }

    // app Vue instance
    var app = new Vue({
        // app initial state
        data: {
            todos: [],
            newTodo: '',
            editedTodo: null,
            visibility: 'all'
        },

        created: function() {
            this.getTodos()
        },

        // watch todos change for localStorage persistence
        watch: {
            todos: {
                handler: function(todos) {
                    todoStorage.save(todos)
                },
                deep: true
            }
        },

        // computed properties
        // http://vuejs.org/guide/computed.html
        computed: {
            filteredTodos: function() {
                return filters[this.visibility](this.todos)
            },
            remaining: function() {
                return filters.active(this.todos).length
            },
            allDone: {
                get: function() {
                    return this.remaining === 0
                },
                set: function(value) {
                    this.todos.forEach(function(todo) {
                        todo.completed = value
                    })
                }
            }
        },

        filters: {
            pluralize: function(n) {
                return n === 1 ? 'item' : 'items'
            }
        },

        // methods that implement data logic.
        // note there's no DOM manipulation here at all.
        methods: {
            getTodos: function() {
                var self = this;
                todoStorage.fetch((todos) => {
                    self.todos = todos;
                });
            },
            addTodo: function() {
                var value = this.newTodo && this.newTodo.trim()
                if (!value) {
                    return
                }
                this.todos.push({
                    id: todoStorage.uid++,
                    title: value,
                    completed: false
                })
                this.newTodo = ''
            },

            removeTodo: function(todo) {
                this.todos.splice(this.todos.indexOf(todo), 1)
            },

            editTodo: function(todo) {
                this.beforeEditCache = todo.title
                this.editedTodo = todo
            },

            doneEdit: function(todo) {
                if (!this.editedTodo) {
                    return
                }
                this.editedTodo = null
                todo.title = todo.title.trim()
                if (!todo.title) {
                    this.removeTodo(todo)
                }
            },

            cancelEdit: function(todo) {
                this.editedTodo = null
                todo.title = this.beforeEditCache
            },

            removeCompleted: function() {
                this.todos = filters.active(this.todos)
            }
        },

        // a custom directive to wait for the DOM to be updated
        // before focusing on the input field.
        // http://vuejs.org/guide/custom-directive.html
        directives: {
            'todo-focus': function(el, value) {
                if (value) {
                    el.focus()
                }
            }
        }
    })

    // handle routing
    function onHashChange() {
        var visibility = window.location.hash.replace(/#\/?/, '')
        if (filters[visibility]) {
            app.visibility = visibility
        }
        else {
            window.location.hash = ''
            app.visibility = 'all'
        }
    }

    window.addEventListener('hashchange', onHashChange)
    onHashChange()

    // mount
    app.$mount('.todoapp')

}
