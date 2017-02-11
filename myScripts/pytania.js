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
        $scope.kategoria = quizService.getKategorie();
        // $scope.kategorie = function (aKategoria) {
        //     quizService.setKategorie(aKategoria);
            $http({
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
                    template: '<div class="alert"><div>Czy napewno chcesz usunąć pytanie?<div><button>Nie</button><button ng-click="usunTePytanie(pytanie)">Tak</button></div>',
                    className: 'ngdialog-theme-default',
                    controller: 'usunPytanieCtr',
                    plain: true

                });
            };
            $scope.edytujPytanie = function (pytanie) {
                quizService.setPytanie(pytanie);
                ngDialog.open({
                    template: '<form name="edytujPytanie"> <div class="form-group"> <label>Pytanie:</label> <input class="dodajOdpowiedz" ng-model="pytanie.pytanie" type="text" name="pytanie" title="Pole nie może być puste" pattern=".{1,}" required/></div> <div class="dialogFooter"> <button ng-click="anuluj()">Anuluj</button> <input type="submit" ng-disabled="edytujPytanie.pytanie.$invalid" ng-click="zapiszZEdytowanePytanie(pytanie)" value="OK"> </div></form>',
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
            };
        // };
        // $http({
        //     method: 'GET',
        //     url: CONST.url+'/kategorie/pobierzWszystkie',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Basic '+ tokenService.getToken()
        //     },
        //     cache : false
        // }).then(function (response) {
        //     $scope.kategories = response.data;
        // })
        //     .finally(function () {
        //     });

    });

quizApp.controller("dodajPytanieCtr",
    function ($rootScope,$scope, $http,quizService,ngDialog,tokenService,CONST,$route){
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
                        alert("Istnieje taka odpowiedź");
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
        $scope.anuluj = function () {
            ngDialog.close();
            $route.reload();
        }
    });
quizApp.controller("edytujPytanieCtr",
    function ($scope, $http, ngDialog, quizService,tokenService,CONST,$route){
        $scope.pytanie = quizService.getPytanie();
        $scope.pytaniePrzedEdycja = quizService.getPytanie();
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
                        template: '<div class="alert"><div>Edycja pytania powiodła się<div><button ng-click="zamknij()">Zamknij</button></div>',
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
        $scope.anuluj = function () {
            $scope.pytanie = $scope.pytaniePrzedEdycja;
            ngDialog.close();
            $route.reload();
        }


    });
quizApp.controller("usunPytanieCtr",
    function ($scope, $http, ngDialog, quizService,tokenService,CONST){
        $scope.pytanie = quizService.getPytanie();
        $scope.usunTePytanie = function (pytanie) {
            $http({
                url : CONST.url+'/pytania/usunPoId/'+pytanie.id,
                method : 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                }
            }).then(function(){
                    ngDialog.open({
                        template: '<div class="alert"><div>Usunięto pytanie<div><button ng-click="zamknij()">Zamknij</button></div>',
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
quizApp.controller("dodajOdpowiedz",
    function ($scope, $http, ngDialog,tokenService,quizService, CONST){
        $scope.odpowiedz = {
            id: 0,
            odpowiedz: "string",
            poprawna: true,
            pytania: quizService.getPytanie().id,
            techDate: "2017-02-11T16:52:27.836Z"
        };
        $scope.odpowiedzi = quizService.getOdpowiedzi();
            $scope.zapiszZEdytowanaOdpowiedz = function (odpowiedzZEdytowana,odpowiedzi) {
                if(odpowiedzi.length > 3){
                    alert("Osiągnięto maksymalną ilość odpowiedzi");
                    return;
                }
                if (odpowiedzZEdytowana.poprawna) {
                    for (var i = 0; i < odpowiedzi.length; i++) {
                        if (odpowiedzi[i].poprawna) {

                            if (odpowiedzi[i].id == odpowiedzZEdytowana.id)
                                continue;
                            var odpowiedzDoZmiany = odpowiedzi[i];
                            odpowiedzDoZmiany.poprawna = false;
                            $http({
                                url: CONST.url + '/odpowiedzi/edytujOdpowiedz',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Basic ' + tokenService.getToken()
                                },
                                data: odpowiedzDoZmiany
                            }).then(function () {
                                }, function errorCallback(response) {
                                }
                            ).finally(function () {
                            })
                        }
                    }

            }
            $http({
                url : CONST.url+'/odpowiedzi/zapiszOdpowiedz2',
                method : 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                },
                data : odpowiedzZEdytowana
            }).then(function(){
                    ngDialog.open({
                        template: '<div class="alert"><div>Dodanie odpowiedzi powiodło się<div><button ng-click="close()">Zamknij</button></div>',
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
        $scope.anuluj = function () {
            ngDialog.closeAll();
            ngDialog.open({
                template: 'answersList.html',
                width: '40%',
                className: 'ngdialog-theme-default',
                controller: 'answersList'
            });
        }


    });

quizApp.controller("edytujOdpowiedzCtr",
    function ($scope, $http, ngDialog, quizService,tokenService,CONST){
        $scope.odpowiedz = quizService.getOdpowiedz();
        $scope.odpowiedzPrzedEdycja = quizService.getOdpowiedz();
        $scope.odpowiedzi = quizService.getOdpowiedzi();
        $scope.zapiszZEdytowanaOdpowiedz = function (odpowiedzZEdytowana,odpowiedzi) {
            if(odpowiedzZEdytowana.poprawna) {
                for (var i=0; i<odpowiedzi.length; i++) {
                    if(odpowiedzi[i].poprawna){

                        if(odpowiedzi[i].id == odpowiedzZEdytowana.id)
                            continue;
                        var odpowiedzDoZmiany = odpowiedzi[i];
                        odpowiedzDoZmiany.poprawna = false;
                        $http({
                            url : CONST.url+'/odpowiedzi/edytujOdpowiedz',
                            method : 'POST',
                            headers: {
                                'Content-Type' : 'application/json',
                                'Authorization': 'Basic '+ tokenService.getToken()
                            },
                            data : odpowiedzDoZmiany
                        }).then(function(){
                            },function errorCallback(response){
                            }
                        ).finally(function () {
                        })
                    }
                }
            }
            var licznik = 0;
            for (var i=0; i<odpowiedzi.length; i++) {
                if(!odpowiedzi[i].poprawna){
                    licznik++;
                }
            }
            if(licznik == odpowiedzi.length){
                alert("Przynajmniej jedna odpowiedz musi być prawidłowa");
                return;
            }
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
                        template: '<div class="alert"><div>Edycja odpowiedzi powiodła się<div><button ng-click="close()">Zamknij</button></div>',
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
        $scope.anuluj = function () {
            ngDialog.closeAll();
            ngDialog.open({
                template: 'answersList.html',
                width: '40%',
                className: 'ngdialog-theme-default',
                controller: 'answersList'
            });
        }

    });
quizApp.controller("answersList",
    function ($scope, $http, ngDialog, quizService,tokenService,CONST){
        $scope.pytanie = quizService.getPytanie();
        $scope.odpowiedzi = [];
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
        $scope.edytujOdpowiedz = function (odpowiedz,odpowiedzi) {
            quizService.setOdpowiedz(odpowiedz);
            quizService.setOdpowiedzi(odpowiedzi);
            ngDialog.open({
                template: 'edytujOdpowiedz.html',
                className: 'ngdialog-theme-default',
                controller: 'edytujOdpowiedzCtr'
            });
        }
        $scope.dodajOdpowiedz = function (odpowiedzi) {
            quizService.setOdpowiedzi(odpowiedzi);
            ngDialog.open({
                template: 'edytujOdpowiedz.html',
                className: 'ngdialog-theme-default',
                controller: 'dodajOdpowiedz'
            });
        }
        $scope.usunOdpowiedz = function (odpowiedz) {
            quizService.setOdpowiedz(odpowiedz);
            ngDialog.open({
                template: '<div class="alert"><div>Czy napewno chcesz usunąć odpowiedź?<div><button ng-click="anuluj()">Nie</button><button ng-click="usunTaOdpowiedz(odpowiedz)">Tak</button></div>',
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
            if(odpowiedz.poprawna){
                alert("Przynajmniej jedna odpowiedź musi byc poprawna!");
                return;
            }
            $http({
                url : CONST.url+'/odpowiedzi/usunPoId/'+odpowiedz.id,
                method : 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic '+ tokenService.getToken()
                }
            }).then(function(){
                    ngDialog.open({
                        template: '<div class="alert"><div>Usunięto odpowiedź<div><button ng-click="close()">Zamknij</button></div>',
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
        $scope.anuluj = function () {
            ngDialog.closeAll();
            ngDialog.open({
                template: 'answersList.html',
                width: '40%',
                className: 'ngdialog-theme-default',
                controller: 'answersList'
            });
        }

    });