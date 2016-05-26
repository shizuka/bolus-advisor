/**
 * Bolus Advisor - Angular Module
 * Shizuka Kamishima
 */
(function () {
  var app = angular.module('bolus-advisor', []);
  
  app.directive('selectOnClick', function () {
    return function (scope, element, attrs) {
      element.bind('click', function () {
        this.select();
      });
    };
  });
  
  app.controller('AdvisorController', function () {
    this.opts = {
      "hasReadLegal": false,
      "carbRatio": {
        "insulin": 1,
        "carbs": 15
      },
      "insulinSensitivity": {
        "insulin": 1,
        "bgDrop": 50
      },
      "units": {
        "bg": "mg/dL",
        "carbs": "g",
      },
      "bgLevels": {
        "hyper": 250,
        "high": 200,
        "low": 100,
        "hypo": 70
      }
    };
    
    var carbEqv = {
      "KE": 10,
      "BE": 12,
      "CC": 15
    };
    
    this.currentBG = 0;
    this.bgRange = "";
    this.carbs = 0;
    
    this.calc = {
      "bg": 0,
      "carb": 0,
      "final": 0
    };
    
    this.updateBolus = function () {
      console.log("update");
      /**
       * (current bG - Target bG) * (sensitivity) + ((carbs * (carb ratio))
       */
      var carbRatio = this.opts.carbRatio.insulin / this.opts.carbRatio.carbs;
      var insRatio = this.opts.insulinSensitivity.insulin / this.opts.insulinSensitivity.bgDrop;
      var targetBG = (this.opts.bgLevels.high + this.opts.bgLevels.low) / 2;
      
      this.calc.bg = (this.currentBG - targetBG) * insRatio;
      if (this.currentBG > this.opts.bgLevels.hyper) {
        this.bgRange = "hyper";
      } else if (this.currentBG > this.opts.bgLevels.high) {
        this.bgRange = "high";
      } else if (this.currentBG >= this.opts.bgLevels.low) {
        this.bgRange = "normal";
        this.calc.bg = 0;
      } else if (this.currentBG >= this.opts.bgLevels.hypo) {
        this.bgRange = "low";
      } else if (this.currentBG > 0) {
        this.bgRange = "hypo";
      } else {
        this.bgRange = "";
        this.calc.bg = 0;
      }
      this.calc.carb = (this.carbs * carbRatio);
      this.calc.final = Math.max(0, this.calc.bg + this.calc.carb);

      this.bolus = {
        "bg": (this.calc.bg < 0 ? '' : '+') + this.calc.bg.toFixed(1),
        "carb": (this.calc.carb < 0 ? '' : '+') + this.calc.carb.toFixed(1),
        "final": this.calc.final.toFixed(1)
      };
    };
    
    this.ackReadLegal = function () {
      this.opts.hasReadLegal = true;
    };
    
    this.loadSettings = function () {
      console.log("load!");
      this.updateBolus();
    };
    
    this.saveSettings = function () {
      console.log("save!");
      this.updateBolus();
    };
    
    this.clearSettings = function () {
      console.log("Restoring defaults...");
    };
    
  });
})();
