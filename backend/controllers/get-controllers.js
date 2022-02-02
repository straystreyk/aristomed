import mongoose from "mongoose";
const db = mongoose.connection;

export const get_all = async (collection, filters = {}) => {
  return db
    .collection(collection)
    .find({ ...filters })
    .toArray();
};

export const get_one = async (collection, filters) => {
  return db.collection(collection).findOne({ ...filters });
};
