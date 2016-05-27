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

    /**
     * HEY SHIZU, MAKE SURE TO UPDATE THIS EVERY TIME YOU CHANGE ADVISOR STUFF
     */
    this.version = "1.0.0";
    
    console.log("Bolus Advisor v" + this.version + " by Shizuka Kamishima");
    
    this.currentBG = 0;
    this.bgRange = "";
    this.carbs = 0;
    this.calc = {
      "bg": 0,
      "carb": 0,
      "final": 0
    };
    
    this.updateBolus = function () {
      /* Bolus = [(current bG - Target bG) * (insulin / bgDrop)] + [carbs * (insulin / carbs)] */
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
      console.log("Acknowledged top disclaimer");
      this.saveSettings();
    };
    
    this.ackReadVersion = function () {
      this.opts.hasReadVersion = true;
      this.opts.lastVersion = this.version;
      console.log("Acknowledged new version");
      this.saveSettings();
    };
    
    this.loadSettings = function () {
      console.log("Loading settings from LocalStorage...");
      if (localStorage.getItem('sk-bolus-advisor-options') === null) {
        console.log("No settings found.");
        this.clearSettings();
      }
      this.opts = JSON.parse(localStorage.getItem('sk-bolus-advisor-options'));
      if (this.opts.lastVersion !== this.version) {
        this.opts.hasReadVersion = false;
        console.log("Update Detected: " + this.opts.lastVersion + " -> " + this.version);
      }
      console.log("Ready.")
      this.updateBolus();
    };
    
    this.saveSettings = function () {
      localStorage.setItem('sk-bolus-advisor-options', JSON.stringify(this.opts));
      console.log("Saving settings to LocalStorage...");
      this.updateBolus();
    };
    
    this.clearSettings = function () {
      console.log("Restoring default settings...");
      this.opts = {
        "hasReadLegal": false,
        "hasReadVersion": true,
        "lastVersion": this.version,
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
      this.saveSettings();
    };
    
  });
})();
