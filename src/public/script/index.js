const VISIBLE = "visible";

const formatTableDates = (dateElements) => {
  dateElements.forEach((el) => {
    const userLocalDate = new Date(el.textContent.trim()).toLocaleString(
      "pt-BR",
      {
        dateStyle: "short",
        timeStyle: "short",
      }
    );
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

const configUploadFileBtn = (btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("#file").click();
  });

  document.querySelector("#file").addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      document.querySelector("#uploadForm").submit();
    }
  });
};

const configCopyUrlBtn = (btn) => {
  btn.addEventListener("click", (e) => {
    navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        navigator.clipboard.writeText(
          window.location.origin +
            "/s/" +
            e.target.getAttribute("data-share-code")
        );
      } else if (result.state === "denied") {
        alert(`
              Não foi possível copiar o código. Verifique se foi concedida 
              permissão de acesso a área de transferência no seu navegador.
            `);
      }
    });
  });
};

window.addEventListener("load", () => {
  console.log(
    "Olá! Confira este e outros projetos no meu GitHub: https://github.com/Diego-Moreira8"
  );

  const dateElements = document.querySelectorAll(".date");
  if (dateElements.length > 0) formatTableDates(dateElements);

  const toggleHierarchyBtn = document.querySelector(".toggleHierarchy");
  if (toggleHierarchyBtn) configToggleHierarchy(toggleHierarchyBtn);

  const toggleNavBtn = document.querySelector("button.navToggle");
  if (toggleNavBtn) configToggleNav(toggleNavBtn);

  const uploadFileBtn = document.querySelector("#openFileDialog");
  if (uploadFileBtn) configUploadFileBtn(uploadFileBtn);

  const copyUrlBtn = document.querySelector("#copyUrl");
  if (copyUrlBtn) configCopyUrlBtn(copyUrlBtn);
});
