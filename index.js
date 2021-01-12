const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schemaModule = require('./schema.js');

const {
    GraphQLSchema
} = require('graphql');

const app = express();

const mySchema = new GraphQLSchema({
  query: schemaModule.queryMenu,
  mutation: schemaModule.mutationMenu
});

app.use('/graphql', graphqlHTTP({
  schema: mySchema,
  graphiql: true
}));

app.listen(3000, () => console.log('Server is alive!'));

//Run server: nodemon index.js

//Server URL
//http://localhost:3000/graphql?


//Single unit query example
/*
    {
        unit(name: "Battlecruiser"){
            name,
            race
        }
    }
*/

//Unit list query example
/*
    {
        units{
            name,
            race
        }
    }
*/

//Add unit example
/*
    mutation{
        addUnit(name: "Wraith", unitType: "Air", raceId: 1){
            name
            unitType
        }
    }

*/