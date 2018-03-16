var hbs = require('express-handlebars');
function hbsHelpers(hbs) {
  return hbs.create({
    helpers: {
  /*hbs.registerHelper("inc", function(value, options) {
    return parseInt(value) + 1;
  });*/

  // More helpers...
  for: function(from, to, incr, block) {
    var accum = '';
    for(var i = from; i < to; i += incr)
        accum += block.fn(i);
    return accum;
}

},
extname: 'hbs', defaultLayout:'layout',layoutDir:__dirname+'/views/layouts/'
});
}

module.exports = hbsHelpers;
