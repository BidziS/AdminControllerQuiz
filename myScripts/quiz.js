/**
 * Created by Bidzis on 1/18/2017.
 */

var quizApp = angular.module("quizApp", ['ngRoute', 'ngAnimate', 'ngDialog','ui.router']);

quizApp.constant("CONST", {
    "url": "http://192.168.56.1:8080/quizAndroid"
});

quizApp.service('tokenService',
    function () {
        var token = "";
        var isLogged = false;
        return {
            getToken: function () {
                return token
            },
            setToken: function (value) {
                token = btoa(value);
            },
            setLogged: function (value) {
                isLogged = value;
            },
            isLoggedIn: function () {
                return isLogged;
            }
        };
    });
quizApp.service('quizService',
    function () {
        var userNick = "";
        var pytanie = {};
        var kategoria = "";
        var odpowiedz = {};
        var kategoriaObj = {};
        return {
            getUserNick: function () {
                return userNick;
            },
            setUserNick: function (value) {
                userNick = value;
            },
            getPytanie: function () {
                return pytanie;
            },
            setPytanie: function (value) {
                pytanie = value;
            },
            getKategorie: function () {
                return kategoria;
            },
            setKategorie: function (value) {
                kategoria = value;
            },
            getOdpowiedz: function () {
                return odpowiedz;
            },
            setOdpowiedz: function (value) {
                odpowiedz = value;
            },
            getKategoriaObj: function () {
                return kategoriaObj;
            },
            setKategorieObj: function (value) {
                kategoriaObj = value;
            }

        };
    });
// quizApp.run(['$rootScope', '$location', 'tokenService', function ($rootScope, $location, Auth) {
//     $rootScope.$on('$routeChangeStart', function (event) {
//
//         if (!Auth.isLoggedIn()) {
//             $location.path('/');
//         }
//     });
// }]);
quizApp.config(function($routeProvider,$qProvider) {

    $routeProvider
        .when("/", {
            templateUrl : "logowanie.html",
            controller: "logowanieController"
        })
        .when("/uzytkownicy", {
            templateUrl : "uzytkownicy.html",
            controller: "uzytkownicyController"
        })
        .when("/pytania", {
            templateUrl : "Pytania.html",
            controller: "pytaniaController"
        })
        .when("/kategorie", {
            templateUrl : "Kategorie.html",
            controller:"kategorieController",
            controllerAs:'kategorie'
        });

    $qProvider.errorOnUnhandledRejections(false);
});
quizApp.service('loggedService',
    function (tokenService,$location,$route) {
        return{
            isLog: function () {
                if(!tokenService.isLoggedIn()) {
                    $location.path('/');
                    $route.reload();
                }
                return tokenService.isLoggedIn();
            },
            Logout: function () {
                
            }
        }

    });