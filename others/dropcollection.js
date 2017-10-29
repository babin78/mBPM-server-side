var mongoose=require('mongoose')
module.exports=function dropCollection (model) {
  /*if (!modelName || !modelName.length) {
    Promise.reject(new Error('You must provide the name of a model.'));
  }*/

  if (!model) {
    Promise.reject(new Error('You must provide model.'));
  }

  try {
    //var model = mongoose.model(modelName);
    var collection = mongoose.connection.collections[model.collection.collectionName];
  } catch (err) {
    return Promise.reject(err);
  }

  return new Promise(function (resolve, reject) {
    collection.drop(function (err) {
      if (err) {
        reject(err);
        return;
      }

      // Remove mongoose's internal records of this
      // temp. model and the schema associated with it
      //delete mongoose.models[modelName];
      //delete mongoose.modelSchemas[modelName];

      resolve();
    });
  });
}
