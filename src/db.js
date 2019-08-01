// the db.js file handles the connection to our DB
import mongoose from 'mongoose'
import options from './config'

export const connect = (url = options.dbUrl, opts = {}) => {
  return mongoose.connect(url, { ...opts, useNewUrlParser: true })
}
