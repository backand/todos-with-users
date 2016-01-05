'use strict';
(function () {
    /**
     * @ngdoc function
     * @name todoApp.controller:TodoListCtrl
     * @description
     * # TodoListCtrl
     * Todo List controller of the todoApp for viewing and adding to do items
     */
    angular.module('mytodoApp')
        .controller('TodoListCtrl', ['TodoService', TodoListCtrl]);

    function TodoListCtrl(TodoService) {
        var self = this;

        /**
         * init by reading the to do list from the database
         */
        clearError();
        readTodoList();

        /**
         * Read the to do list from the database
         */
        function readTodoList() {
            TodoService.readAll().then(onReadListSuccess, errorHandler);
        }

        /**
         * Success promise call with the lit data
         * @param data
         */
        function onReadListSuccess(todos) {
            self.todos = todos;
        }

        /**
         * Update item in the database
         * @param todo
         */
        self.updateTodo = function (todo) {
            clearError();
            TodoService.update(todo.id, todo)
                .then(null, errorHandler);
        };

        /**
         * Add new item
         */
        self.addTodo = function () {
            clearError();
            TodoService.create(self.todo)
                .then(onAddTodoSuccess, errorHandler);
            self.todo = '';
        };

        /**
         * Success promise call with the new item added
         * @param data
         */
        function onAddTodoSuccess(todo) {
            self.todos.push(todo);
        }

        /**
         * Remove item from the database and from the list
         * @param todo
         */
        self.removeTodo = function (todo) {
            clearError();
            TodoService.delete(todo.id).then(function () {
                self.todos.splice(self.todos.indexOf(todo), 1);
            }, errorHandler);
        };

        /**
         * Handle promise error call.
         * Error object may have the error message in 'data' property, or in 'data.Message'.
         * @param error
         * @param message
         */
        function errorHandler(error) {
            if (error) {
                if (error.data) {
                    if (error.data.split) {
                        var msg = error.data.split(':');
                        self.error = msg[msg.length - 1];
                    } else if (error.data.Message) {
                        self.error = error.data.Message;
                    }
                } else {
                    self.error = JSON.stringify(error);
                }

            } else {
                self.error = "Unexpected failure";
            }

            readTodoList();
        }

        function clearError() {
            self.error = null;
        }

    }

})();
