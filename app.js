angular.module('gaisberg', []).controller('todoCtrl', function ($scope) {
    $scope.addTodo = function () {
        alert('Add Todo');
    };
    $scope.deleteTodo = function () {
        alert('Delete Todo');
    };
    $scope.newTodo = '';
    $scope.todos = [
        { text: 'Test', complete: false }
    ];
});