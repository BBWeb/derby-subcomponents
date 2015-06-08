# derby-subcomponents
Derby plugin for easily adding subcomponents without access to app

How to use
==========
Adds the possibility to add a subcomponents on your Component prototype - i.e. without access to app. E.g.

```javascript
// When this component is loaded through app.component('./mycomponent/index.js'), the subcomponent will automatically be loaded namespaced to the maincomponents name (and possible namespace), i.e. you will have two components loaded (from below component):
// maincomponent
// maincomponent:subcomponent
function MyComponent () {}

MyComponent.prototype.name = 'maincomponent'
MyComponent.prototype.components = [require('subcomponent')]
```
