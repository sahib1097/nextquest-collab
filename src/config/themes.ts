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
    backgroundImage: "/assets/themes/medieval/backgrounds/grey_brick.jpeg"
  },
  cyberpunk: {
    name: "Cyberpunk",
    colors: {
      primary: "#FF2E97",
      secondary: "#141622",
      background: "#0A0C14",
      text: "#E0F2FF",
      border: "#2DE2E6",
      hover: "#261D54",
      accent: "#F706CF"
    },
    fonts: {
      heading: "'Orbitron', sans-serif",
      body: "'Share Tech Mono', monospace"
    },
    components: {
      button: {
        primary: "bg-gradient-to-r from-[#FF2E97] to-[#2DE2E6] text-white shadow-[0_0_15px_rgba(45,226,230,0.5)]",
        secondary: "bg-[#141622] text-[#2DE2E6] border-[1px] border-[#2DE2E6] shadow-[0_0_10px_rgba(45,226,230,0.3)]"
      },
      card: {
        background: "bg-[#141622]/80 backdrop-blur-sm",
        border: "border-[#2DE2E6] shadow-[0_0_20px_rgba(45,226,230,0.2)]"
      }
    },
    backgroundImage: "/assets/themes/cyberpunk/grid.svg"
  }
}; 