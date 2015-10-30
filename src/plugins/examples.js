'use strict';

function examples(app, opts, done){
  const { handlers } = app;

  handlers.ensureExampleProject(opts.examples, opts.folder || 'examples')
    .then(function(){
      return done();
    })
    .catch(done);
}

module.exports = examples;
