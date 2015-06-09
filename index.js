var path = require('path');
var util = require('derby/node_modules/racer/lib/util');
var derbyTemplates = require('derby/node_modules/derby-templates');
var templates = derbyTemplates.templates;

var Component = require('derby/lib/components').Component;
var createFactory = require('derby/lib/components').createFactory;

module.exports = function (derby, options) {
  var App = derby.App;

  App.prototype.component = function(viewName, constructor, ns) {
    if (typeof viewName === 'function') {
      constructor = viewName;
      viewName = null;
    }

    // Inherit from Component
    extendComponent(constructor);

    // Set namespace to the component if it's passed along
    if(ns) constructor.prototype.ns = ns;

    // Load template view from filename
    if (constructor.prototype.view) {
      var viewFilename = constructor.prototype.view;
      viewName = constructor.prototype.name || path.basename(viewFilename, '.html');
      if(ns) viewName = ns + ':' + viewName;
      this.loadViews(viewFilename, viewName);
    } else if (!viewName) {
      if (constructor.prototype.name) {
        viewName = constructor.prototype.name;
        if(ns) viewName = ns + ':' + viewName;
        var view = this.views.register(viewName);
        view.template = templates.emptyTemplate;
      } else {
        throw new Error('No view name specified for component');
      }
    }

    // Load sub components
    var subComponents = constructor.prototype.components;
    if (subComponents) {
      for(var i = 0, len = subComponents.length; i < len; i++) {
        this.component(null, subComponents[i], viewName);
      }
    }

    // Associate the appropriate view with the component type
    var view = this.views.find(viewName);
    if (!view) {
      var message = this.views.findErrorMessage(viewName);
      throw new Error(message);
    }
    view.componentFactory = createFactory(constructor);

    // Make chainable
    return this;
  };

  function extendComponent(constructor) {
    // Don't do anything if the constructor already extends Component
    if (constructor.prototype instanceof Component) return;
    // Otherwise, replace its prototype with an instance of Component
    var oldPrototype = constructor.prototype;
    constructor.prototype = new Component();
    util.mergeInto(constructor.prototype, oldPrototype);
  }
};
