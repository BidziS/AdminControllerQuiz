/**
 * Created by Bidzis on 2/10/2017.
 */
quizApp.controller("wybierzKategorieCrt",
    function ($rootScope, $scope, $http, ngDialog,quizService,tokenService,CONST,loggedService) {
        loggedService.isLog();
        $scope.logout = function () {
            tokenService.setLogged(false);
            loggedService.isLog();
        };
        $http({
            method: 'GET',
            url: CONST.url+'/kategorie/pobierzWszystkie',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+ tokenService.getToken()
            },
            cache : false
        }).then(function (response) {
            $scope.kategories = response.data;
        })
            .finally(function () {
            });
        $scope.wybierzKategorie = function (kategoria) {
            quizService.setKategorie(kategoria);
        }

    });