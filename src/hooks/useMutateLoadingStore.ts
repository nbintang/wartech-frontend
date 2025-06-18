import { create } from "zustand";

type MutationAction = "create" | "update" | "delete";
type MutationStatus = {
  [tag: string]: {
    [action in MutationAction]?: boolean;
  };
};

type MutationStore = {
  mutationMap: MutationStatus;
  setMutating: (tag: string, action: MutationAction, isLoading: boolean) => void;
  isMutating: (tag: string, action: MutationAction) => boolean;
};

const useMutationLoadingStore = create<MutationStore>((set, get) => ({
  mutationMap: {},
  setMutating: (tag, action, isLoading) =>
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

export default useMutationLoadingStore;