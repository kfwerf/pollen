import document from "document";

export const setLoader = (isLoading = false) => {
  const className = isLoading ? "loading" : "";
  document.getElementById("app").class = className;
}

const setScore = (key, data) => {
  const { href, humanReadable, color } = data;
  const progressEl = document.getElementById(`${key}-progress`);
  const descEl = document.getElementById(`${key}-desc`);
  
  console.log(`Setting ${key} and color ${color} is ${humanReadable} and image ${href}`);
  
  progressEl.href = href;
  descEl.text = humanReadable;
  descEl.style.fill = color;
}

export const doUI = (decoratedData) => {
  Object.keys(decoratedData)
    .forEach((key) => {
      setScore(key, decoratedData[key]);
    });
  console.log('done')
  setLoader(false);
};