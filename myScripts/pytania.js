/**
 * Created by Bidzis on 1/19/2017.
 */
quizApp.controller("pytaniaController",
    function ($rootScope, $scope, $http, ngDialog,quizService,tokenService,CONST,loggedService){

        loggedService.isLog();
        $scope.logout = function () {
            tokenService.setLogged(false);
            loggedService.isLog();
        };
        $scope.kategorie = function (aKategoria) {
            quizService.setKategorie(aKategoria);
            $http({
                method: 'GET',
                url: CONST.url+'/pytania/pobierzPoNazwieKategorii/'+aKategoria.nazwa,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                },
                cache : false
            }).then(function (response) {
                $rootScope.pytania = response.data;
            })
                .finally(function () {
                });
            $scope.openModal = function (pytanie) {
                quizService.setPytanie(pytanie)
                ngDialog.open({
                    template: 'answersList.html',
                    width: '40%',
                    className: 'ngdialog-theme-default',
                    controller: 'answersList'
                });
            };
            $scope.usunPytanie = function (pytanie) {
                quizService.setPytanie(pytanie);
                ngDialog.open({
                    template: '<div class="alert"><div>Czy napewno chcesz usunąć użytkownika?<div><button>Nie</button><button ng-click="usunTePytanie(pytanie)">Tak</button></div>',
                    className: 'ngdialog-theme-default',
                    controller: 'usunPytanieCtr',
                    plain: true

                });
            };
            $scope.edytujPytanie = function (pytanie) {
                quizService.setPytanie(pytanie);
                ngDialog.open({
                    template: '<form> <div class="form-group"> <label>Pytanie:</label> <input class="dodajOdpowiedz" ng-model="pytanie.pytanie" type="text" /></div> <div class="dialogFooter"> <button ng-click="closeThisDialog()">Anuluj</button> <button ng-click="zapiszZEdytowanePytanie(pytanie)">OK</button> </div></form>',
                    className: 'ngdialog-theme-default',
                    controller: 'edytujPytanieCtr',
                    plain: true
                });
            };
            $scope.dodajPytanie = function () {
                ngDialog.open({
                    template: 'dodajPytanie.html',
                    className: 'ngdialog-theme-default',
                    controller: 'dodajPytanieCtr'
                });
            }
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

    });

quizApp.controller("dodajPytanieCtr",
    function ($rootScope,$scope, $http,quizService,ngDialog,tokenService,CONST){
        $scope.one = {name:"one",value: true};
        $scope.two = {name:"two",value: false};
        $scope.tree = {name:"tree",value: false};
        $scope.four = {name:"four",value: false};
        $scope.checkRadio = function (name) {
            if(name == "one"){
                $scope.one.value = true;
                $scope.two.value  = false;
                $scope.tree.value = false;
                $scope.four.value = false;
            }else if(name == "two"){
                $scope.one.value = false;
                $scope.two.value  = true;
                $scope.tree.value = false;
                $scope.four.value = false;
            }else if(name == "tree"){
                $scope.one.value = false;
                $scope.two.value  = false;
                $scope.tree.value = true;
                $scope.four.value = false;
            }else if(name == "four"){
                $scope.one.value = false;
                $scope.two.value  = false;
                $scope.tree.value = false;
                $scope.four.value = true;
            }
        };
        $scope.odpOne = {
            odpowiedz: "",
            poprawna: false,
            pytania: 0,
        };
        $scope.odpTwo = {
            odpowiedz: "",
            poprawna: false,
            pytania: 0,
        };
        $scope.odpTree = {
            odpowiedz: "",
            poprawna: false,
            pytania: 0,
        };
        $scope.odpFour = {
            odpowiedz: "",
            poprawna: false,
            pytania: 0,
        };

        $scope.pytanie = {pytanie: "", kategorieID: quizService.getKategorie().id}
        $scope.zrob = function (aaa) {
            $scope.pytanie2 = 0;
        }
        function zapiszPytanie(pytanie) {
            $scope.odpOne.poprawna = $scope.one.value;
            $scope.odpTwo.poprawna = $scope.two.value;
            $scope.odpTree.poprawna = $scope.tree.value;
            $scope.odpFour.poprawna = $scope.four.value;
            $scope.listaOdpowiedzi = [];
            $scope.listaOdpowiedzi.push($scope.odpOne);
            $scope.listaOdpowiedzi.push($scope.odpTwo);
            $scope.listaOdpowiedzi.push($scope.odpTree);
            $scope.listaOdpowiedzi.push($scope.odpFour);
            return ($http({
                url : CONST.url+'/pytania/zapiszPytanie2',
                method : 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                },
                data : pytanie
            }).then(function(response){
                    //$scope.pytanie2 = response.data;
                    $scope.odpOne.pytania = response.data.id;
                    $scope.odpTwo.pytania = response.data.id;
                    $scope.odpTree.pytania = response.data.id;
                    $scope.odpFour.pytania = response.data.id;
                    zapiszOdpowiedz1();
                },function errorCallback(response){
                    if(response.status == '405'){
                        alert("Istnieje użytkownik o takim nicku");
                    }
                }
            ).finally(function () {


            }))

        }
        function zapiszOdpowiedz1() {
            return($http({
                url : CONST.url+'/odpowiedzi/zapiszOdpowiedz2',
                method : 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                },
                data : $scope.odpOne
            }).then(function () {
                zapiszOdpowiedz2()
            }));

        }
        function zapiszOdpowiedz2() {
            return ($http({
                url : CONST.url+'/odpowiedzi/zapiszOdpowiedz2',
                method : 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                },
                data : $scope.odpTwo
            }).then(function () {
                zapiszOdpowiedz3()
            }));
        }
        function zapiszOdpowiedz3() {
            return ($http({
                url : CONST.url+'/odpowiedzi/zapiszOdpowiedz2',
                method : 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                },
                data : $scope.odpTree
            }).then(function () {
                zapiszOdpowiedz4()
            }));
        }
        function zapiszOdpowiedz4() {
            return ($http({
                url : CONST.url+'/odpowiedzi/zapiszOdpowiedz2',
                method : 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                },
                data : $scope.odpFour
            }).then(function () {
                odswiezPytania()
            }));
        }
        function odswiezPytania() {
            return ($http({
                method: 'GET',
                url: CONST.url+'/pytania/pobierzPoNazwieKategorii/'+quizService.getKategorie().nazwa,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                },
                cache : false
            }).then(function (response) {
                $rootScope.pytania = response.data;

            })
                .finally(function () {
                    alert("Dodano pytanie");
                    ngDialog.closeAll();

                }));
        }
        $scope.aaa = function (bbb) {
            zapiszPytanie(bbb);
        }
    });
quizApp.controller("edytujPytanieCtr",
    function ($scope, $http, ngDialog, quizService,tokenService,CONST){
        $scope.pytanie = quizService.getPytanie();
        $scope.zapiszZEdytowanePytanie = function (pytanieZEdytowane) {
            $http({
                url : CONST.url+'/pytania/edytujPytanie',
                method : 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                },
                data : pytanieZEdytowane
            }).then(function(){
                    ngDialog.open({
                        template: '<div class="alert"><div>Utworzono użytkownika<div><button ng-click="zamknij()">Zamknij</button></div>',
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
quizApp.controller("usunPytanieCtr",
    function ($scope, $http, ngDialog, quizService,tokenService,CONST){
        $scope.pytanie = quizService.getPytanie();
        $scope.usunTePytanie = function (pytanie) {
            $http({
                url : CONST.url+'/pytania/usunPoId/'+pytanie.id,
                method : 'PUT',
                header: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                }
            }).then(function(){
                    ngDialog.open({
                        template: '<div class="alert"><div>Utworzono użytkownika<div><button ng-click="zamknij()">Zamknij</button></div>',
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
/*ANSWERS*/
quizApp.controller("answersList",
    function ($scope, $http, ngDialog, quizService){
        $scope.pytanie = quizService.getPytanie();
        $http({
            method: 'GET',
            url: CONST.url+'/odpowiedzi/pobierzPoPytaniu/'+quizService.getPytanie().id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+ tokenService.getToken()
            },
            cache : false
        }).then(function (response) {
            $scope.odpowiedzi = response.data;
        }).finally(function () {
        });
        $scope.edytujOdpowiedz = function (odpowiedz) {
            quizService.setOdpowiedz(odpowiedz);
            ngDialog.open({
                template: 'edytujOdpowiedz.html',
                className: 'ngdialog-theme-default',
                controller: 'edytujOdpowiedzCtr'
            });
        }

    });
quizApp.controller("edytujOdpowiedzCtr",
    function ($scope, $http, ngDialog, quizService,tokenService,CONST){
        $scope.odpowiedz = quizService.getOdpowiedz();
        $scope.zapiszZEdytowanaOdpowiedz = function (odpowiedzZEdytowana) {
            $http({
                url : CONST.url+'/odpowiedzi/edytujOdpowiedz',
                method : 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                },
                data : odpowiedzZEdytowana
            }).then(function(){
                    ngDialog.open({
                        template: '<div class="alert"><div>Utworzono użytkownika<div><button ng-click="close()">Zamknij</button></div>',
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
quizApp.controller("answersList",
    function ($scope, $http, ngDialog, quizService,tokenService,CONST){
        $scope.pytanie = quizService.getPytanie();
        $http({
            method: 'GET',
            url: CONST.url+'/odpowiedzi/pobierzPoPytaniu/'+quizService.getPytanie().id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+ tokenService.getToken()
            },
            cache : false
        }).then(function (response) {
            $scope.odpowiedzi = response.data;
        }).finally(function () {
        });
        $scope.edytujOdpowiedz = function (odpowiedz) {
            quizService.setOdpowiedz(odpowiedz);
            ngDialog.open({
                template: 'edytujOdpowiedz.html',
                className: 'ngdialog-theme-default',
                controller: 'edytujOdpowiedzCtr'
            });
        }
        $scope.usunOdpowiedz = function (odpowiedz) {
            quizService.setOdpowiedz(odpowiedz);
            ngDialog.open({
                template: '<div class="alert"><div>Czy napewno chcesz usunąć użytkownika?<div><button ng-click="closeAll()">Nie</button><button ng-click="usunTaOdpowiedz(odpowiedz)">Tak</button></div>',
                className: 'ngdialog-theme-default',
                controller: 'usunOdpowiedzCrt',
                plain: true

            });
        }

    });
quizApp.controller("usunOdpowiedzCrt",
    function ($scope, $http, ngDialog, quizService,tokenService,CONST){
        $scope.odpowiedz = quizService.getOdpowiedz();
        $scope.usunTaOdpowiedz = function (odpowiedz) {
            $http({
                url : CONST.url+'/odpowiedzi/usunPoId/'+odpowiedz.id,
                method : 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                }
            }).then(function(){
                    ngDialog.open({
                        template: '<div class="alert"><div>Utworzono użytkownika<div><button ng-click="close()">Zamknij</button></div>',
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