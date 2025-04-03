const hierarchizeFolders = (foldersArray, parentId) => {
  const parent = foldersArray.find((d) =>
    parentId ? d.id === parentId : d.rootOfUserId
  );

  const children = foldersArray.filter((d) => d.parentId === parent.id);

  if (children.length === 0) {
    return parent;
  }

  return {
    ...parent,
    children: children.map((child) =>
      hierarchizeFolders(foldersArray, child.id)
    ),
  };
};

module.exports = hierarchizeFolders;
