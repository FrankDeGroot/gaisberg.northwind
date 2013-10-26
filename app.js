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
        }
    };
}).controller('todoCtrl', function ($scope, todoSrvc) {
    var todoPromise = todoSrvc.currentTodos();
    $scope.addTodo = function () {
        alert('Add Todo');
    };
    $scope.deleteTodo = function () {
        alert('Delete Todo');
    };
    $scope.newTodo = '';
    $scope.loading = true;
    $scope.todos = todoPromise;
    todoPromise.then(function () {
        $scope.loading = false;
    });
});