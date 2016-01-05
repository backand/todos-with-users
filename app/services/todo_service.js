/**
 * Created by Itay Herskovits  on 2/1/15.
 */
(function () {

    angular.module('mytodoApp')
        .service('TodoService', ['$http', 'Backand', 'AuthService', TodoService]);

    function TodoService($http, Backand, AuthService) {

        var self = this;
        var baseUrl = Backand.getApiUrl() + '/1/objects/';

        var objectName = 'todo';

        self.readAll = function () {
            return $http({
                method: 'GET',
                url: baseUrl + objectName
            }).then(function(response) {
                return response.data.data;
            });
        };

        self.readOne = function (id) {
            return $http({
                method: 'GET',
                url: baseUrl + objectName + '/' + id
            }).then(function(response) {
                return response.data;
            });
        };

        self.create = function (description) {
            return $http({
                method: 'POST',
                url : baseUrl + objectName,
                data: {
                    description: description
                },
                params: {
                    returnObject: true
                }
            }).then(function(response) {
                return response.data;
            });
        };

        self.update = function (id, data) {
            return $http({
                method: 'PUT',
                url : baseUrl + objectName + '/' + id,
                data: data
            }).then(function(response) {
                return response.data;
            });
        };

        self.delete = function (id) {
            return $http({
                method: 'DELETE',
                url : baseUrl + objectName + '/' + id
            })
        };

    }
}());
