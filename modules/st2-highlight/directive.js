/*global hljs:true*/
'use strict';

angular.module('main')
  .config(function () {
    hljs.configure({
      languages: ['json']
    });
  })
  .directive('st2Highlight', function ($filter) {

    var LINES_TO_SHOW = 5;

    function getType(string) {
      try {
        var o = JSON.parse(string);

        if (!o || typeof o !== 'object') {
          throw new Error();
        }

        return 'json';
      } catch (e) {}

      return 'std';
    }

    function postLink(scope) {
      scope.$watch('code', function (code) {
        scope.type = getType(code);

        if (scope.type === 'json') {
          scope.string = hljs.highlight('json', $filter('json')(JSON.parse(code))).value;
        } else {
          scope.string = code && code.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
            return '&#'+i.charCodeAt(0)+';';
          });
        }

        if (scope.full) {
          scope.shortString = scope.string;
        } else {
          if (scope.string) {
            var lines = scope.string.split('\n');

            if (lines[lines.length - 1] === '') {
              lines.pop();
            }

            scope.lines_more = lines.length - LINES_TO_SHOW;

            if (scope.lines_more > 0) {
              lines = lines.slice(0,LINES_TO_SHOW);
            }

            scope.shortString = lines.join('\n');
          }
        }


      });
    }

    return {
      restrict: 'C',
      scope: {
        code: '=',
        full: '@'
      },
      templateUrl: 'modules/st2-highlight/template.html',
      link: postLink
    };

  });
