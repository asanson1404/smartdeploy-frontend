import { createContext, useContext, ReactNode, Dispatch, SetStateAction, useState } from 'react';

interface TimeToLive {
    automaticBump: boolean;
    date: string;
    countdown?: number;
}

export type TimeToLiveType = {
  addressToTtl: Map<string, TimeToLive>;
  setAddressToTtl: Dispatch<SetStateAction<Map<string, TimeToLive>>>
}

type TimeToLiveProviderProps = {
  children: ReactNode;
};

const TimeToLiveContext = createContext<TimeToLiveType | undefined>(undefined);

export const TimeToLiveContextProvider: React.FC<TimeToLiveProviderProps> = ({ children }) => {

  const [addressToTtl, setAddressToTtl] = useState<Map<string, TimeToLive>>(new Map<string, TimeToLive>());

  return (
      <TimeToLiveContext.Provider value={{ addressToTtl, setAddressToTtl }}>
          {children}
      </TimeToLiveContext.Provider>
  );
};

export const useTimeToLiveContext = (): TimeToLiveType => {
  const context = useContext(TimeToLiveContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a TimeToLiveContextProvider');
  }
  return context;
};