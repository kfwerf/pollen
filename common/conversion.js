export const valueToHumanReadable = {
  5: "High",
  4: "Med/Hi",
  3: "Medium",
  2: "Low/Med",
  1: "Low",
  0: "Min/Low",
};

export const valueToColor = {
  5: "#F83C40",
  4: "#FC6B3A",
  3: "#FFD733",
  2: "#E4FA3C",
  1: "#B8FC68",
  0: "#00A629", 
};

export const getImage = (score) => `Progress-${score}.png`;