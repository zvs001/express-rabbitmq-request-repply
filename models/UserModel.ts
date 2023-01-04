import _ from 'lodash'
import mongoose, { Schema, model, Document } from 'mongoose'

interface PublicMethods {
  toPublic(): Pick<User, '_id' | 'name' | 'email' | 'country' | 'city'>
}

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

  return {
    _id: obj._id,
    name: obj.name,
    email: obj.email,
    country: obj.country,
    city: obj.city,
  }
}

delete mongoose.models['User'] // babel bug
const UserModel = model<User & PublicMethods>('User', UserSchema)

export default UserModel
