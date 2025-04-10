const VISIBLE = "visible";
const tableIconPath = "/images/table.svg";
const treeIconPath = "/images/tree.svg";
const contentTable = document.querySelector(".contentTable");
const foldersTree = document.querySelector(".foldersTree");
const btn = document.querySelector(".toggleHierarchy");
const btnIcon = btn.querySelector("img");

const openFolderTree = () => {
  contentTable.classList.remove(VISIBLE);
  foldersTree.classList.add(VISIBLE);
  btnIcon.src = tableIconPath;
};

const openContentTable = () => {
  contentTable.classList.add(VISIBLE);
  foldersTree.classList.remove(VISIBLE);
  btnIcon.src = treeIconPath;
};

const handleToggle = () => {
  if (contentTable.classList.contains(VISIBLE)) {
    openFolderTree();
  } else {
    openContentTable();
  }
};

openContentTable();
btn.addEventListener("click", handleToggle);
