export const filterAssetsResolver = async (
  obj: unknown,
  args: any,
  context: any,
) => {
  const { req } = context;
  const { page, limit, sort, where } = args;

  try {
    // Construct the where clause dynamically for arrays of filters in AND and OR
    const buildFilter = (filters: any[] | undefined) => {
      if (!filters) return undefined;

      return filters.map((filter) => ({
        name: filter.name ? { like: filter.name } : undefined,
        ['currentStatus.status']: filter.status
          ? { equals: filter.status }
          : undefined,
      }));
    };

    const result = await req.payload.find({
      collection: 'assets',
      depth: 2,
      page,
      limit,
      sort,
      where: {
        AND: buildFilter(where?.AND),
        OR: buildFilter(where?.OR),
        name: where?.name ? { like: where.name } : undefined,
        ['currentStatus.status']: where?.status
          ? { equals: where.status }
          : undefined,
      },
    });

    return result;
  } catch (error) {
    console.error('Error in FilteredAssets resolver:', error);
    throw error;
  }
};
