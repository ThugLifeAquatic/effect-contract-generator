import { Schema } from "effect";

export const UserContract = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  username: Schema.String,
  email: Schema.String,
  address: Schema.Struct({
    street: Schema.String,
    suite: Schema.String,
    city: Schema.String,
    zipcode: Schema.String,
    geo: Schema.Struct({
      lat: Schema.String,
      lng: Schema.String,
    }),
  }),
  phone: Schema.String,
  website: Schema.String,
  company: Schema.Struct({
    name: Schema.String,
    catchPhrase: Schema.String,
    bs: Schema.String,
  }),
});

export type User = Schema.Schema.Type<typeof UserContract>;
