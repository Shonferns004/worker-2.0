import { createContext } from "react";

export interface SelectedChapterIndexContextType {
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}


export const SelectedChapterIndexContext = createContext<SelectedChapterIndexContextType | null>(null);