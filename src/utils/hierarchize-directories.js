const hierarchizeDirectories = (directoriesArray, parentId) => {
  const parent = directoriesArray.find((d) =>
    parentId ? d.id === parentId : d.rootOfUserId
  );

  const children = directoriesArray.filter((d) => d.parentId === parent.id);

  if (children.length === 0) {
    return parent;
  }

  return {
    ...parent,
    children: children.map((child) =>
      hierarchizeDirectories(directoriesArray, child.id)
    ),
  };
};

module.exports = hierarchizeDirectories;
