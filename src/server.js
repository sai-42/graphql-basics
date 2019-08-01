// server.js -> creating a GraphQL server
import { ApolloServer } from 'apollo-server'
import { loadTypeSchema } from './utils/schema'
import { authenticate } from './utils/auth'
import { merge } from 'lodash'
import config from './config'
import { connect } from './db'
import product from './types/product/product.resolvers'
import coupon from './types/coupon/coupon.resolvers'
import user from './types/user/user.resolvers'

const types = ['product', 'coupon', 'user']

// start the server
export const start = async () => {
  // entry schema, the 1st part of the schema
  // Schema = a tree, a graph, a root, the entry point to our schema
  // SDL - Schema Definition Language (you are creating a schema inside of this string)

  const rootSchema = `
    schema {
      query: Query
      mutation: Mutation
    }
  `
  const schemaTypes = await Promise.all(types.map(loadTypeSchema))

  const server = new ApolloServer({
    typeDefs: [rootSchema, ...schemaTypes],

    resolvers: merge({}, product, coupon, user),

    async context({ req }) {
      // use the authenticate function from utils to auth, req, it's Async!
      const user = await authenticate(req)
      return { user }
    }
  })

  // connect to the DB
  await connect(config.dbUrl)
  // listening on the server with a passed in port
  const { url } = await server.listen({ port: config.port })

  console.log(`GQL server ready at ${url}`)
}
