angular.module('gaisberg', []).controller('todoCtrl', function ($scope, $q) {
    var client = new WindowsAzure.MobileServiceClient('https://gaisberg.azure-mobile.net/', 'zWkZwDXaswoZZUHPHUMQqoNdCeHuad42'),
        todoItemTable = client.getTable('todoitem');
    var query = todoItemTable.where({ complete: false });
    query.read().then(function (todos) {
       $scope.$apply(function () {
           $scope.todos = todos;
       });
    });

    $scope.addTodo = function () {
        alert('Add Todo');
    };
    $scope.deleteTodo = function () {
        alert('Delete Todo');
    };
    $scope.newTodo = '';
    $scope.todos = [];
});