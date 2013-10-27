angular.module('gaisberg', []).service('todoSrvc', function ($rootScope, $q) {
    var client = new WindowsAzure.MobileServiceClient('https://gaisberg.azure-mobile.net/', 'zWkZwDXaswoZZUHPHUMQqoNdCeHuad42'),
        todoItemTable = client.getTable('todoitem'),
        deferred = $q.defer();
    return {
        currentTodos: function () {
            var query = todoItemTable.where({ complete: false });
            query.read().then(function (todos) {
                $rootScope.$apply(function () {
                    deferred.resolve(todos);
                });
            });
            return deferred.promise;
        },
        addTodo: function (text) {
            todoItemTable.insert({ text: text, complete: false });
        },
        deleteTodo: function (todo) {
            todoItemTable.del({ id: todo.id })
        }
    };
}).controller('todoCtrl', function ($scope, todoSrvc) {
    var todoPromise = todoSrvc.currentTodos();
    $scope.addTodo = function () {
        todoSrvc.addTodo($scope.text);
        $scope.text = '';
    };
    $scope.deleteTodo = function (todo) {
        todoSrvc.deleteTodo(todo);
    };
    $scope.text = '';
    $scope.loading = true;
    $scope.todos = todoPromise;
    todoPromise.then(function () {
        $scope.loading = false;
    });
});