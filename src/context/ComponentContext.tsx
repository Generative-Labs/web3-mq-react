import React, { PropsWithChildren, useContext } from 'react';

import type { ThreadHeaderProps } from '../components/Thread/ThreadHeader';

export type ComponentContextValue = {
  Message: React.ComponentType<any>;
  Input: React.ComponentType<any>;
  ThreadHeader: React.ComponentType<ThreadHeaderProps>;
};

export const ComponentContext = React.createContext<ComponentContextValue | undefined>(undefined);

export const ComponentProvider = ({
  children,
  value,
}: PropsWithChildren<{
  value: ComponentContextValue;
}>) => (
  <ComponentContext.Provider value={value as unknown as ComponentContextValue}>
    {children}
  </ComponentContext.Provider>
);

export const useComponentContext = (componentName?: string) => {
  const contextValue = useContext(ComponentContext);

  if (!contextValue) {
    console.warn(
      `The useComponentContext hook was called outside of the ComponentContext provider. Make sure this hook is called within a child of the Chat component. The errored call is located in the ${componentName} component.`,
    );

    return {} as ComponentContextValue;
  }

  return contextValue as unknown as ComponentContextValue;
};
