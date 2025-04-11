const VISIBLE = "visible";

const formatTableDates = (dateElements) => {
  dateElements.forEach((el) => {
    const userLocalDate = new Date(el.textContent.trim()).toLocaleString();
    el.textContent = userLocalDate;
  });
};

const configToggleHierarchy = (btn) => {
  const tableIconPath = "/images/table.svg";
  const treeIconPath = "/images/tree.svg";
  const contentTable = document.querySelector(".contentTable");
  const foldersTree = document.querySelector(".foldersTree");
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
};

const configToggleNav = (btn) => {
  const nav = document.querySelector("nav");
  const navOverlay = document.querySelector(".navOverlay");

  const closeNav = () => {
    nav.classList.remove(VISIBLE);
    navOverlay.classList.remove(VISIBLE);
  };

  const openNav = () => {
    nav.classList.add(VISIBLE);
    navOverlay.classList.add(VISIBLE);
  };

  const toggleNav = () => {
    if (nav.classList.contains(VISIBLE)) {
      closeNav();
    } else {
      openNav();
    }
  };

  btn.addEventListener("click", toggleNav);
  navOverlay.addEventListener("click", closeNav);
};

window.addEventListener("load", () => {
  console.log(
    "Olá! Confira este e outros projetos no meu GitHub: https://github.com/Diego-Moreira8"
  );

  const dateElements = document.querySelectorAll(".date");
  if (dateElements.length > 0) {
    formatTableDates(dateElements);
  }

  const toggleHierarchyBtn = document.querySelector(".toggleHierarchy");
  if (toggleHierarchyBtn) {
    configToggleHierarchy(toggleHierarchyBtn);
  }

  const toggleNavBtn = document.querySelector("button.navToggle");
  if (toggleNavBtn) {
    configToggleNav(toggleNavBtn);
  }
});
