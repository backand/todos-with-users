/**
 * Created by Itay Herskovits  on 2/1/15.
 */
(function () {

    angular.module('mytodoApp')
        .service('TodoService', ['$http', 'Backand', 'AuthService', TodoService]);

    function TodoService($http, Backand, AuthService) {

        var self = this;
        var objectName = 'todo';

        self.readAll = function () {
          Backand.object.getList(objectName).then(function(response) {
            return response.data
          });
        };

        self.readOne = function (id) {
          Backand.object.getOne(objectName, id).then(function(response) {
            return response.data
          });
        };

        self.create = function (description) {
          var object = {description: description};
          Backand.object.create(objectName, object)
            .then(function(response) {
                return response.data;
            });
        };

        self.update = function (id, data) {
          Backand.object.create(objectName, data)
            .then(function(response) {
                return response.data;
            });
        };

        self.delete = function (id) {
          return Backand.object.remove(objectName, id);
        };

    }
}());
