const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');

let races = [
    { 
        id: 1, 
        name: 'Terran', 
        raceDescription: 'The terrans (or humans) are a young species with psionic potential. The terrans of the' + 
        'Koprulu sector descend from the survivors of a disastrous 23rd century colonization mission from Earth by Doran Routhe. ' + 
        'Compared to the protoss and zerg, the terrans are highly factionalized and endure frequent wars amongst themselves in' + 
        'addition to the more recent conflicts with their alien neighbors. Nevertheless, terrans stand as one of the three dominant species of the galaxy.' 
    },
    { 
        id: 2, 
        name: 'Zerg',
        raceDescription: 'The Zerg Swarm is a terrifying and ruthless amalgamation of biologically advanced, arthropodal aliens.' + 
        'Dedicated to the pursuit of genetic perfection, the zerg relentlessly hunt down and assimilate advanced species across the galaxy, incorporating' +
        'useful genetic code into their own. They are named "the Swarm" per their ability to rapidly create strains, and the relentless assaults they employ to overwhelm their foes.' 
    },
    { 
        id: 3, 
        name: 'Protoss',
        raceDescription: 'The protoss Firstborn are a sapient humanoid species native to Aiur. Their advanced technology' + 
        'complements and enhances their psionic mastery. The main protoss cultural groups are the Khalai, who adhere to' +
        'the communal Khala, and the Nerazim, who reject the Khala. Two smaller cultural branches of the protoss,' + 
        'the Tal\'darim and the Purifier, separated from the Khalai over respective ideological differences.' + 
        'Protoss civilization was reunified when the Khalai and Nerazim, sundered since the Discord,' + 
        'were reunited after the devastation of Aiur by the zerg during the Great War. Alongside the zerg and terrans,' + 
        'the protoss stand as one of the three dominant species of the Milky Way. Protoss are not found outside the Koprulu sector.' 
    }
];

let units = [
    { id: 1, name: 'Battlecruiser', unitType: 'Air', raceId: 1 },
    { id: 2, name: 'SCV', unitType: 'Ground', raceId: 1 },
    { id: 3, name: 'Marine', unitType: 'Ground', raceId: 1 },
    { id: 7, name: 'Hydralisk', unitType: 'Ground', raceId: 2 },
    { id: 8, name: 'Overlord', unitType: 'Air', raceId: 2 },
    { id: 8, name: 'Zergling', unitType: 'Ground', raceId: 2 },
    { id: 4, name: 'Dark Templar', unitType: 'Ground', raceId: 3 },
    { id: 5, name: 'Carrier', unitType: 'Air', raceId: 3 },
    { id: 6, name: 'Zealot', unitType: 'Ground', raceId: 3 }
];

const unitObject = new GraphQLObjectType({
  name: 'starCraftUnit',
  description: 'A StarCraft Unit',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    unitType: { type: GraphQLNonNull(GraphQLString) },
    raceId: { type: GraphQLNonNull(GraphQLInt) },
    race: {
      type: raceObject,
      resolve: (unit) => {
        return races.find(race => race.id === unit.raceId);
      }
    }
  })
});

const raceObject = new GraphQLObjectType({
  name: 'Race',
  description: 'A StarCraft race',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    raceDescription: { type: GraphQLNonNull(GraphQLString) },
    units: {
      type: new GraphQLList(unitObject),
      resolve: (race) => {
        return units.filter(unit => unit.raceId === race.id);
      }
    }
  })
});

const queryMenu = new GraphQLObjectType({
    name: 'starCraftUnits',
    description: 'StarCraft units',
    fields: () => ({
        unit: {
            type: unitObject,
            description: 'Returns one StarCraft unit',
            args: {
                name: { type: GraphQLString }
            },
            resolve: (parent, args) => units.find(unit => unit.name.toLowerCase() === args.name.toLowerCase())
        },
        units: {
            type: new GraphQLList(unitObject),
            description: 'Returns a list of all StarCraft units',
            resolve: () => units
        },
        race: {
            type: raceObject,
            description: 'Returns one StarCraft race',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => races.find(race => race.id === args.id)
        },
        races: {
            type: new GraphQLList(raceObject),
            description: 'Returns a list of all StarCraft races',
            resolve: () => races
        }
    })
});

const mutationMenu = new GraphQLObjectType({
    name: 'starCraftMutation',
    description: 'StarCraft Mutation',
    fields: () => ({
        addUnit: {
            type: unitObject,
            description: 'Adds a StarCraft unit',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                unitType: { type: GraphQLNonNull(GraphQLString) },
                raceId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                let unit = { id: units.length + 1, name: args.name, unitType: args.unitType, raceId: args.raceId };
                units.push(unit);
                return unit;
            }
        }
    })
});

module.exports = { queryMenu, mutationMenu };