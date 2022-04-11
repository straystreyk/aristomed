import mongoose from "mongoose";
const db = mongoose.connection;

export const get_all = async (collection, filters = {}, sort = {}) => {
  return db
    .collection(collection)
    .find({ ...filters })
    .sort({ ...sort })
    .toArray();
};

export const get_one = async (collection, filters) => {
  return db.collection(collection).findOne({ ...filters });
};

export const aggregate = async (collection, params) => {
  return db.collection(collection).aggregate(params).toArray();
};
