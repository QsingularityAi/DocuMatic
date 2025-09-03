import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLList,
} from 'graphql';

export const GQLCurrentStatus = new GraphQLObjectType({
  name: 'CurrentStatus',
  fields: () => ({
    id: { type: GraphQLInt },
    status: { type: GraphQLString },
    dateFrom: { type: GraphQLString },
    dateTo: { type: GraphQLString },
    notes: { type: GraphQLString },
    downtimeType: { type: GraphQLString },
  }),
});

export const GQLAsset = new GraphQLObjectType({
  name: 'GQLAsset',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    manufacturer: { type: GraphQLString },
    model: { type: GraphQLString },
    currentStatus: { type: GQLCurrentStatus },
  }),
});

export const GQLAssetFilterWhere: GraphQLInputObjectType =
  new GraphQLInputObjectType({
    // Its important to name it like this: [collectionNameSingular]_where
    name: 'FilteredAsset_where',
    fields: () => ({
      status: { type: GraphQLString },
      name: { type: GraphQLString },

      // Filter definition to allow querying multiple filters as OR or AND
      OR: { type: new GraphQLList(GQLSimpleFilterType) },
      AND: { type: new GraphQLList(GQLSimpleFilterType) },
    }),
  });

const GQLSimpleFilterType = new GraphQLInputObjectType({
  name: 'SimpleFilter',
  fields: () => ({
    status: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

// export const GQLFilteredAssetsResult = new GraphQLObjectType({
//   name: 'FilteredAssetsResult',
//   fields: () => ({
//     docs: { type: new GraphQLList(GQLAsset) },
//     page: { type: GraphQLInt },
//     limit: { type: GraphQLInt },
//     hasNextPage: { type: GraphQLBoolean },
//     hasPrevPage: { type: GraphQLBoolean },
//     totalDocs: { type: GraphQLInt },
//     totalPages: { type: GraphQLInt },
//   }),
// });
