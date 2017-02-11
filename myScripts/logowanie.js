quizApp.controller("logowanieController",
    function ($scope, $http, tokenService,$state,$location){
        $scope.login = "";
        $scope.password = "";
        var logowanieJson = {
            "haslo": "",
            "nick": ""
        };
        $scope.zaloguj = function (nick,password) {
            logowanieJson.nick = nick;
            logowanieJson.haslo = password;
            // service.setNick(nick);
            // service.setPassword(password);
            var zmienna = nick+':'+password;
            //var encodedString = btoa(zmienna);
            tokenService.setToken(zmienna);
            $http({
                url : 'http://192.168.56.1:8080/quizAndroid/uzytkownicy/logowanieAdmin',
                method : 'GET',
                headers: {
                    'Authorization' : 'Basic '+ tokenService.getToken()
                },
                data : logowanieJson
            }).then(function(response){
                //$scope.data = response;
                tokenService.setLogged(true);
                $location.path('/uzytkownicy')
9
                },function errorCallback(response){
                    // if(response.status == 404){
                    //     tokenService.setLogged(true);
                    //     $location.path('/uzytkownicy')
                    // }
                    alert("Niepoprawne dane logowanie");
                }
            ).finally(function () {
            })
        }
    });