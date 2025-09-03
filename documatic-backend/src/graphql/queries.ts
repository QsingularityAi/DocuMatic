import { GraphQLString } from 'graphql';
import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLOutputType,
} from 'graphql';
import { filterAssetsResolver } from './resolvers';
import { GQLAssetFilterWhere, GQLAsset } from './types';

// This is the GraphQL query for filtering assets
// To allow filtering by nested properties (e.g., asset.currentStatus.status)
export const filterAssetQuery = (GraphQL: any) => {
  return {
    FilteredAssets: {
      type: new GraphQL.GraphQLObjectType({
        name: 'FilteredAssetsResult',
        fields: {
          docs: {
            type: new GraphQLList(GQLAsset as GraphQLOutputType),
          },
          page: { type: GraphQLInt },
          limit: { type: GraphQLInt },
          hasNextPage: { type: GraphQLBoolean },
          hasPrevPage: { type: GraphQLBoolean },
          totalDocs: { type: GraphQLInt },
          totalPages: { type: GraphQLInt },
          currentStatus: { type: GraphQLString },
        },
      }),
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        sort: { type: GraphQLString },
        where: { type: GQLAssetFilterWhere },
      },
      resolve: filterAssetsResolver,
    },
  };
};
