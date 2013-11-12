angular.module('gaisberg', []).service('todoSrvc', function ($rootScope, $q) {
    var self = this,
        client = new WindowsAzure.MobileServiceClient('https://gaisberg.azure-mobile.net/', 'zWkZwDXaswoZZUHPHUMQqoNdCeHuad42'),
        todoItemTable = client.getTable('todoitem'),
        query = todoItemTable.where({ complete: false });
    this.errorlog = [];
    this.todos = [];
    this.loading = false;
    this.readTodos = function () {
        self.loading = true;
        query.read().then(function (todos) {
            $rootScope.$apply(function () {
                self.todos.splice(0, self.todos.length);
                todos.forEach(function (todo) { self.todos.push(todo); });
                self.loading = false;
            });
        });
    };
    this.addTodo = function (text) {
        todoItemTable.insert({ text: text, complete: false }).then(self.readTodos, self.appendErrorLog);
    };
    this.deleteTodo = function (todo) {
        todoItemTable.del({ id: todo.id }).then(self.readTodos, self.appendErrorLog);
    };
    this.updateTodo = function (todo) {
        todoItemTable.update({ id: todo.id, text: todo.text });
    };
    this.completeTodo = function (todo) {
        todoItemTable.update({ id: todo.id, complete: todo.complete }).then(self.readTodos, self.appendErrorLog);
    };
    this.appendErrorLog = function (entry) {
        $rootScope.$apply(function () {
            self.errorlog.push(entry);
            self.loading = false;
        });
    };
}).controller('todoCtrl', function ($scope, todoSrvc) {
    $scope.addTodo = function () {
        todoSrvc.addTodo($scope.text);
        $scope.text = '';
    };
    $scope.deleteTodo = todoSrvc.deleteTodo;
    $scope.updateTodo = todoSrvc.updateTodo;
    $scope.completeTodo = todoSrvc.completeTodo;
    $scope.text = '';
    $scope.loading = true;
    $scope.$watch(
        function () {
            return todoSrvc.loading;
        },
        function (newVal) {
            $scope.loading = newVal;
        }
    );
    $scope.todos = todoSrvc.todos;
    $scope.errorlog = todoSrvc.errorlog;
    todoSrvc.readTodos();
});