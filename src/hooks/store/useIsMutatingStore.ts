import { create } from "zustand";

type MutationAction = "create" | "update" | "delete";
type MutationStatus = {
  [tag: string]: {
    [action in MutationAction]?: boolean;
  };
};

type MutationStore = {
  mutationMap: MutationStatus;
  setIsMutating: (tag: string, action: MutationAction, isLoading: boolean) => void;
  isMutating: (tag: string, action: MutationAction) => boolean;
};

const useIsMutatingStore = create<MutationStore>((set, get) => ({
  mutationMap: {},
  setIsMutating: (tag, action, isLoading) =>
    set((state) => ({
      mutationMap: {
        ...state.mutationMap,
        [tag]: {
          ...state.mutationMap[tag],
          [action]: isLoading,
        },
      },
    })),
  isMutating: (tag, action) => !!get().mutationMap[tag]?.[action],
}));

export default useIsMutatingStore;