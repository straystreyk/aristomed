import mongoose from "mongoose";
const db = mongoose.connection;
let all_collections = [];

//all collections
mongoose.connection.on("open", function () {
  mongoose.connection.db.listCollections().toArray(function (err, collections) {
    if (collections) {
      all_collections = collections;
      return;
    }
    console.log(err);
  });
});

//search
export const getAll = async (value) => {
  let data = [];

  all_collections.forEach((el) => {
    data.push({
      [el.name]: db
        .collection(el.name)
        .aggregate([
          {
            $match: {
              jopa: value,
            },
          },
        ])
        .toArray(),
    });
  });

  return data;
};
