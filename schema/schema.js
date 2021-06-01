const graphql = require("graphql");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
} = graphql;

var books = [
  { name: "Name of wind", genre: "Fantasy", id: "1", authorId: "1" },
  { name: "Name of the water", genre: "Fantasy", id: "2", authorId: "2" },
  { name: "The Final Empire", genre: "Fantasy", id: "3", authorId: "3" },
  { name: "The Long Earth", genre: "Sci-Fi", id: "4", authorId: "3" },
  { name: "The Color of magic", genre: "Fantasy", id: "5", authorId: "2" },
  { name: "The Light fantastic", genre: "Thriller", id: "6", authorId: "1" },
];

var author = [
  { name: "Patric Rothfuss", age: 44, id: "1" },
  { name: "Brandon Sanderson", age: 42, id: "2" },
  { name: "Terry Pratchett", age: 41, id: "3" },
  { name: "Patric dowrus", age: 48, id: "4" },
];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // console.log(parent);
        return _.find(author, { id: parent.authorId });
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, { authorId: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //Code to get the data from db or others source
        return _.find(books, { id: args.id });
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //Code to get the data from db or others source
        return _.find(author, { id: args.id });
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return author;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
