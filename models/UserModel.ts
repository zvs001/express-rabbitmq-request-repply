import _ from 'lodash'
import mongoose, { Schema, model, Document } from 'mongoose'

export interface User extends Document {
  _id: string
  name: string
  email:string
  password: string
  country: string
  city: string
}

const UserSchema = new Schema({
  // id: { type: String, unique: true },
  name: { type: String },
  email: { type: String },
  password: { type: String },
  country: { type: String },
  city: { type: String },
}, { timestamps: true })

UserSchema.methods.toPublic = function assetSchemaToPublic() {
  const obj = this.toJSON()

  let videos
  if (!_.isEmpty(obj.videos)) videos = obj.videos

  return {
    id: obj._id,
    original: obj.original,
    updatedAt: obj.updatedAt,
    createdAt: obj.createdAt,
    metadata: obj.metadata,
    videos,
  }
}

delete mongoose.models['User'] // babel bug
const UserModel = model<User>('User', UserSchema)

export default UserModel
