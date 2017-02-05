/**
 * Created by Bidzis on 1/19/2017.
 */
quizApp.controller("kategorieController",
    function ($rootScope, $scope, $http, ngDialog,quizService,tokenService,CONST,loggedService){
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
            $scope.kategorie = response.data;
        })
            .finally(function () {
            });
        $scope.dodajKategorie = function () {
            ngDialog.open({
                template: '<form> <div class="dialogCenter form-group"> <label>Nazwa:</label> <input class="dialogItems" type="text" ng-model="nowaKategoria.nazwa" /> </div> <div class="dialogFooter"> <button ng-click="closeThisDialog()">Anuluj</button> <button ng-click="zapiszKategorie(nowaKategoria)">OK</button> </div> </form>',
                //height: '45%',
                className: 'ngdialog-theme-default',
                controller: 'dodajKategorieCtr',
                plain: true
            });
        }
        $scope.usunKategorie = function (kategoria) {
            quizService.setKategorieObj(kategoria);
            ngDialog.open({
                template: '<div class="alert"><div>Czy napewno chcesz usunąć użytkownika?<div><button ng-click="closeAll()">Nie</button><button ng-click="usunTaKategorie(kategoria)">Tak</button></div>',
                className: 'ngdialog-theme-default',
                controller: 'usunKategorieCrt',
                plain: true
            });

        }
        $scope.edytujKategorie = function (kategoria) {
            quizService.setKategorieObj(kategoria);
            $scope.elo = quizService.getKategoriaObj();
            ngDialog.open({
                template: '<form> <div class="dialogCenter form-group"> <label>Nazwa:</label> <input class="dialogItems" type="text" ng-model="kategoria.nazwa" /> </div> <div class="dialogFooter"> <button ng-click="closeThisDialog()">Anuluj</button> <button ng-click="zapiszKategorie(kategoria)">OK</button> </div> </form>',
                //height: '45%',
                className: 'ngdialog-theme-default',
                controller: 'edytujKategorieCtr',
                plain: true
            });
        }
    });

quizApp.controller("dodajKategorieCtr",
    function ($scope, $http, ngDialog,tokenService,CONST){
        $scope.nowaKategoria = {
            "nazwa": ""
        };
        $scope.zapiszKategorie = function (nowaKategoria) {
            console.log($scope.newUser);
            $http({
                url : CONST.url+'/kategorie/zapiszKategorie',
                method : 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                },
                data : nowaKategoria
            }).then(function(){
                    ngDialog.open({
                        template: '<div class="alert"><div>Utworzono kategorie<div><button ng-click="closeAll()">Zamknij</button></div>',
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
quizApp.controller("usunKategorieCrt",
    function ($scope, $http, ngDialog, quizService,tokenService,CONST){
        $scope.kategoria = quizService.getKategoriaObj();
        $scope.usunTaKategorie = function (kategoria) {
            $http({
                url : CONST.url+'/kategorie/usunPoNazwie/'+kategoria.id,
                method : 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                }
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
            });
        }

    });
quizApp.controller("edytujKategorieCtr",
    function ($scope, $http, ngDialog,quizService,tokenService,CONST){
        $scope.kategoria = quizService.getKategoriaObj();
        $scope.zapiszKategorie = function (nowaKategoria) {
            console.log($scope.newUser);
            $http({
                url : CONST.url+'/quizAndroid/kategorie/zapiszKategorie',
                method : 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                },
                data : nowaKategoria
            }).then(function(){
                    ngDialog.open({
                        template: '<div class="alert"><div>Utworzono kategorie<div><button ng-click="closeAll()">Zamknij</button></div>',
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
