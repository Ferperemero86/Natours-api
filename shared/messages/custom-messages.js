export const generateMessage = (action, entity, success = true) => {
  const actions = {
    create: success
      ? `${entity} created successfully`
      : `Failed to create ${entity}`,
    update: success
      ? `${entity} updated successfully`
      : `Failed to update ${entity}`,
    delete: success
      ? `${entity} deleted successfully`
      : `Failed to delete ${entity}`,
    fetch: success
      ? `${entity} fetched successfully`
      : `Failed to fetch ${entity}`,
    conflict: `${entity} already exists`,
    notFound: `${entity} not found`,
    empty: `No ${entity}s found`,
    dataRequired: `${entity} data is required`,
    idRequired: `${entity} ID is required`,
  }

  return actions[action] || `${action} action failed for ${entity}`
}
