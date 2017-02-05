/**
 * Created by Bidzis on 1/19/2017.
 */
quizApp.controller("uzytkownicyController",
    function ($rootScope, $scope, $http,$route, ngDialog,quizService,tokenService, CONST,loggedService,$route){
        if(!loggedService.isLog()){
            $route.reload();
        };
        $scope.logout = function () {
            tokenService.setLogged(false);
            loggedService.isLog();
        };

        $http({
            method: 'GET',
            url: CONST.url+'/uzytkownicy/pobierzWszystkich/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+ tokenService.getToken()
            },
            cache : false
        }).then(function (response) {
            $scope.users = response.data;
        })
            .finally(function () {
            });
        $scope.openModal = function () {
            ngDialog.open({
                template: 'addUser.html',
                //height: '45%',
                className: 'ngdialog-theme-default',
                controller: 'addUserController'
            });
        };
        $scope.deleteUser = function (nick) {
            quizService.setUserNick(nick);
            ngDialog.open({
                template: '<div class="alert"><div>Czy napewno chcesz usunąć użytkownika?<div><button ng-click="closeAll()">Nie</button><button ng-click="deleteThisUser()">Tak</button></div>',
                className: 'ngdialog-theme-default',
                controller: 'deleteCtr',
                plain: true
            });
        };

    });

quizApp.controller("addUserController",
    function ($scope, $http, ngDialog, tokenService, CONST){
        $scope.newUser = {
            "haslo": "",
            "nick": ""
        };
        $scope.saveUser = function (newUser) {
            console.log($scope.newUser);
            $http({
                url : CONST.url+'/uzytkownicy/zapiszUzytkownika',
                method : 'POST',
                headers: {'Content-Type' : 'application/json',
                          'Authorization': 'Basic '+ tokenService.getToken() },
                data : newUser
            }).then(function(){
                    ngDialog.open({
                        template: '<div class="alert"><div>Utworzono użytkownika<div><button ng-click="closeAll()">Zamknij</button></div>',
                        className: 'ngdialog-theme-default',
                        controller: 'alertCtr',
                        plain: true
                    });
                },function errorCallback(response){
                    if(response.status == '405'){
                        alert("Istnieje użytkownik o takim nicku");
                    }
                }
            ).finally(function () {
            })
        }
    });

quizApp.controller("alertCtr",
    function ($scope, ngDialog,$route) {
        $scope.closeAll = function () {
            ngDialog.closeAll();
            $route.reload();
        };
        $scope.close = function () {
            ngDialog.closeAll();
            ngDialog.open({
                template: 'answersList.html',
                width: '40%',
                className: 'ngdialog-theme-default',
                controller: 'answersList'
            });
        };
        $scope.zamknij = function () {
            ngDialog.closeAll();
            $route.reload();
        }
    });

quizApp.controller("deleteCtr",
    function ($scope, ngDialog,$route, $http,quizService,tokenService,CONST) {
        $scope.deleteThisUser = function () {
            var nickName = quizService.getUserNick();
            $http({
                url : CONST.url+'/uzytkownicy/usunPoNicku/'+nickName,
                method : 'POST',
                headers: {'Content-Type' : 'application/json',
                          'Authorization': 'Basic '+ tokenService.getToken()}
            }).then(function(){
                    $route.reload();
                    ngDialog.closeAll();

                },function errorCallback(response){
                    if(response.status == '404'){
                        alert("Nie istnieje taki użytkownik");
                    }
                }
            )
        };
        $scope.closeAll = function () {
            ngDialog.closeAll();
            $route.reload();
        };
    });
