export type Theme = {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
    hover: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  components: {
    button: {
      primary: string;
      secondary: string;
    };
    card: {
      background: string;
      border: string;
    };
  };
  backgroundImage?: string;
};

export const themes: Record<string, Theme> = {
  default: {
    name: "Default",
    colors: {
      primary: "#007AFF",
      secondary: "#F5F5F7",
      background: "#FFFFFF",
      text: "#1D1D1F",
      border: "#E5E5EA",
      hover: "#F5F5F7",
      accent: "#86868B"
    },
    fonts: {
      heading: "system-ui",
      body: "system-ui"
    },
    components: {
      button: {
        primary: "bg-[#007AFF] text-white",
        secondary: "bg-[#F5F5F7] text-[#1D1D1F]"
      },
      card: {
        background: "bg-white",
        border: "border-[#E5E5EA]"
      }
    },
    backgroundImage: undefined
  },
  medieval: {
    name: "Medieval",
    colors: {
      primary: "#8B4513",
      secondary: "#F5DEB3",
      background: "#FDF5E6",
      text: "#4A3728",
      border: "#D2B48C",
      hover: "#F5DEB3",
      accent: "#A0522D"
    },
    fonts: {
      heading: "'MedievalSharp', cursive",
      body: "'MedievalSharp', cursive"
    },
    components: {
      button: {
        primary: "bg-[#8B4513] text-[#FDF5E6]",
        secondary: "bg-[#F5DEB3] text-[#4A3728]"
      },
      card: {
        background: "bg-[#FDF5E6]",
        border: "border-[#D2B48C]"
      }
    },
    backgroundImage: "/assets/background/grey_brick.jpeg"
  },
  cyberpunk: {
    name: "Cyberpunk",
    colors: {
      primary: "#00FFFF",
      secondary: "#2A2A2A",
      background: "#1E1E1E",
      text: "#FFFFFF",
      border: "#00FFFF",
      hover: "#2A2A2A",
      accent: "#FF00FF"
    },
    fonts: {
      heading: "'Orbitron', sans-serif",
      body: "'Orbitron', sans-serif"
    },
    components: {
      button: {
        primary: "bg-[#00FFFF] text-black",
        secondary: "bg-[#2A2A2A] text-[#00FFFF]"
      },
      card: {
        background: "bg-[#1E1E1E]",
        border: "border-[#00FFFF]"
      }
    },
    backgroundImage: undefined
  }
}; 