// Change dates from UTC to client's local time
const allDateElements = document.querySelectorAll(".date");

allDateElements.forEach((dateElement) => {
  const userLocalDate = new Date(
    dateElement.textContent.trim()
  ).toLocaleString();

  dateElement.textContent = userLocalDate;
});
