import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  userName: String,
  score: Number,
})

export const User = model('User', userSchema)
